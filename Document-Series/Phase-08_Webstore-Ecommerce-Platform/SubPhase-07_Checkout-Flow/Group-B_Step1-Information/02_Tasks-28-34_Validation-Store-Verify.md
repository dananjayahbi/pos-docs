# Tasks 28-34: Validation, Store Integration, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** B - Step 1 - Information  
> **Document:** 02 of 02  
> **Tasks Covered:** 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-27_Page-Contact-Personal.md](01_Tasks-19-27_Page-Contact-Personal.md)

---

## Document Overview

This document covers the validation, data persistence, and verification aspects of the checkout information step. It establishes comprehensive form validation using Zod schemas, implements field-level error handling, integrates with the checkout store for state management, and ensures data pre-filling for authenticated users. The document also covers complete flow verification to ensure a seamless user experience.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 28 | Create Form Validation | Medium | 30 min |
| 29 | Create Email Validation | Low | 15 min |
| 30 | Create Phone Validation | Medium | 25 min |
| 31 | Create Error Display | Low | 20 min |
| 32 | Create Save to Store | Low | 20 min |
| 33 | Create Pre-fill for Logged In | Medium | 30 min |
| 34 | Verify Step 1 Flow | Low | 25 min |

---

## Task 28: Create Form Validation

### Overview
Implement comprehensive form validation using Zod schema for the information step. Create a strongly-typed validation schema that enforces all business rules for contact information and personal details, ensuring data integrity before proceeding to the next checkout step.

### Dependencies
- Task 21: Create Email Input (requires email field)
- Task 22: Create Phone Input (requires phone field)
- Task 26: Create First Name Input (requires first name field)
- Task 27: Create Last Name Input (requires last name field)
- React Hook Form library installed
- Zod validation library installed

### Instructions

1. **Create validation schemas directory**
   - Navigate to `frontend/lib/` directory
   - Create `validations/` subdirectory if it doesn't exist
   - This centralizes all validation logic

2. **Create checkout schemas file**
   - Create `checkoutSchemas.ts` in `lib/validations/`
   - Import Zod library
   - Set up TypeScript type exports

3. **Define information step schema**
   - Create `informationStepSchema` using Zod
   - Define schema for all required fields
   - Set up field validation rules

4. **Configure field-level validation**
   - Email field: string, required, email format
   - Phone field: string, required, custom Sri Lanka format
   - First name: string, required, min 2 characters
   - Last name: string, required, min 2 characters
   - WhatsApp opt-in: boolean, optional, defaults to true

5. **Add custom validation messages**
   - Define user-friendly error messages for each field
   - Ensure messages are clear and actionable
   - Support internationalization (i18n) if needed

6. **Export TypeScript types**
   - Infer TypeScript type from Zod schema
   - Export as `InformationStepData` type
   - Use throughout components for type safety

7. **Integrate with React Hook Form**
   - Use `zodResolver` to connect Zod with React Hook Form
   - Configure form with schema resolver
   - Enable real-time validation mode

### Validation Schema Structure

```
informationStepSchema
├── email
│   ├── Type: string
│   ├── Required: true
│   ├── Format: email
│   └── Message: "Please enter a valid email address"
├── phone
│   ├── Type: string
│   ├── Required: true
│   ├── Pattern: ^7[0-9]{8}$
│   └── Message: "Please enter a valid Sri Lankan mobile number"
├── firstName
│   ├── Type: string
│   ├── Required: true
│   ├── Min Length: 2
│   └── Message: "First name must be at least 2 characters"
├── lastName
│   ├── Type: string
│   ├── Required: true
│   ├── Min Length: 2
│   └── Message: "Last name must be at least 2 characters"
└── whatsappOptIn
    ├── Type: boolean
    ├── Required: false
    └── Default: true
```

### Field Validation Rules

| Field | Type | Required | Min Length | Max Length | Special Rules |
|-------|------|----------|------------|------------|---------------|
| email | string | Yes | - | - | Valid email format |
| phone | string | Yes | 9 | 9 | Sri Lanka mobile pattern |
| firstName | string | Yes | 2 | 50 | Letters, spaces, hyphens |
| lastName | string | Yes | 2 | 50 | Letters, spaces, hyphens |
| whatsappOptIn | boolean | No | - | - | Defaults to true |

### Validation Trigger Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| onChange | Validates on every keystroke | Real-time feedback |
| onBlur | Validates when field loses focus | Less intrusive |
| onSubmit | Validates only on form submission | Minimal interference |
| all | Combines onChange and onBlur | Best user experience |

### Schema Organization

```
lib/validations/
├── checkoutSchemas.ts
│   ├── informationStepSchema
│   ├── shippingStepSchema (future)
│   ├── paymentStepSchema (future)
│   └── Types exported
└── index.ts (exports)
```

### Error Message Guidelines

| Principle | Implementation |
|-----------|----------------|
| Be Specific | "Enter valid Sri Lankan mobile" not "Invalid phone" |
| Be Helpful | Suggest correct format: "Start with 7, followed by 8 digits" |
| Be Concise | Keep messages under 50 characters |
| Be Polite | Use "Please enter" not "You must enter" |

### TypeScript Type Safety

```
Type Flow
└── Zod Schema (runtime validation)
    └── InformationStepData (compile-time type)
        └── Form Component (typed props)
            └── Store Actions (typed parameters)
                └── API Calls (typed payload)
```

### Expected Outcome
- Comprehensive Zod validation schema for information step
- Type-safe form data handling
- Clear, actionable validation messages
- Integration with React Hook Form
- Foundation for email and phone validation (Tasks 29-30)

### Verification Checklist
- [ ] `checkoutSchemas.ts` file created in `lib/validations/`
- [ ] `informationStepSchema` defined with all required fields
- [ ] Custom validation messages for each field
- [ ] TypeScript types exported from schema
- [ ] Schema integrates with React Hook Form via zodResolver
- [ ] Validation triggers configured appropriately
- [ ] Error messages are user-friendly and specific

---

## Task 29: Create Email Validation

### Overview
Implement specific email validation rules for the checkout information step. While the basic email format validation is handled by Zod's email validator, this task adds business-specific rules such as disposable email detection, common typo suggestions, and domain validation to ensure high-quality email addresses.

### Dependencies
- Task 28: Create Form Validation (provides base schema)
- Task 21: Create Email Input (provides email field)

### Instructions

1. **Enhance email validation in schema**
   - Open `checkoutSchemas.ts`
   - Locate the email field validation
   - Add additional validation rules

2. **Implement format validation**
   - Use Zod's built-in email validator
   - Ensure RFC 5322 compliance
   - Validate @ symbol and domain structure

3. **Add domain validation (optional)**
   - Check for valid TLD (top-level domain)
   - Detect common typos (gmial.com → gmail.com)
   - Suggest corrections for common mistakes

4. **Block disposable emails (optional)**
   - Create list of common disposable email providers
   - Add custom validation to reject these domains
   - Show appropriate error message

5. **Normalize email input**
   - Trim whitespace before validation
   - Convert to lowercase for consistency
   - Remove any leading/trailing spaces

6. **Add email-specific error messages**
   - "Please enter a valid email address" (format error)
   - "This email domain is not recognized" (domain error)
   - "Disposable email addresses are not allowed" (business rule)

7. **Test email validation**
   - Valid emails: user@example.com
   - Invalid format: user@, @example.com, user.example.com
   - Common typos: user@gmial.com, user@yahooo.com

### Email Validation Rules

| Rule | Purpose | Example |
|------|---------|---------|
| Format | Ensure valid email structure | user@example.com ✓ |
| Domain | Check domain has valid TLD | user@example ✗ |
| Lowercase | Normalize for consistency | User@Example.com → user@example.com |
| Trimmed | Remove accidental spaces | " user@example.com " → "user@example.com" |

### Common Email Typo Suggestions

| Typo | Suggestion |
|------|------------|
| @gmial.com | Did you mean @gmail.com? |
| @yahooo.com | Did you mean @yahoo.com? |
| @hotmial.com | Did you mean @hotmail.com? |
| @outlok.com | Did you mean @outlook.com? |

### Email Validation Diagram

```
Email Input
    ↓
┌───────────────────────┐
│ 1. Trim whitespace    │
└───────────────────────┘
    ↓
┌───────────────────────┐
│ 2. Convert lowercase  │
└───────────────────────┘
    ↓
┌───────────────────────┐
│ 3. Format validation  │
│    (Zod email)        │
└───────────────────────┘
    ↓
┌───────────────────────┐
│ 4. Domain validation  │
│    (optional)         │
└───────────────────────┘
    ↓
┌───────────────────────┐
│ 5. Disposable check   │
│    (optional)         │
└───────────────────────┘
    ↓
Valid Email ✓
```

### Validation Flow

```
User Types Email
    │
    ▼
onChange Event
    │
    ▼
Zod Schema Validation
    │
    ├─→ Valid ────→ Clear error state
    │
    └─→ Invalid ──→ Set error message
                      │
                      ▼
                   Display Error
                   (Task 31)
```

### Disposable Email Domains (Examples)

| Category | Domains |
|----------|---------|
| Common | tempmail.com, guerrillamail.com, 10minutemail.com |
| Temporary | throwaway.email, temp-mail.org, mailinator.com |
| Action | Block or warn user, suggest permanent email |

### Business Rules

| Rule | Enforcement | Reason |
|------|-------------|--------|
| No disposable | Block | Order tracking requires valid email |
| Valid domain | Require | Ensure deliverability |
| No typos | Suggest | Reduce delivery failures |

### Email Validation Complexity Levels

| Level | Features | Implementation |
|-------|----------|----------------|
| Basic | Format only | Zod .email() |
| Standard | Format + normalization | + transform() |
| Advanced | + domain validation | + custom regex |
| Enterprise | + disposable detection | + external API |

### Expected Outcome
- Robust email validation that catches common errors
- User-friendly error messages
- Optional typo suggestions for better UX
- Normalized email storage in consistent format

### Verification Checklist
- [ ] Email format validation using Zod .email()
- [ ] Email normalization (lowercase, trimmed)
- [ ] Clear error messages for invalid emails
- [ ] Optional: Domain validation implemented
- [ ] Optional: Disposable email detection
- [ ] Optional: Typo suggestions for common errors
- [ ] Test cases for valid and invalid emails passed

---

## Task 30: Create Phone Validation

### Overview
Implement Sri Lanka-specific phone number validation for mobile numbers. Validate that phone numbers follow the Sri Lankan mobile format, starting with 7 and containing exactly 9 digits after the +94 country code. This ensures all phone numbers collected are valid Sri Lankan mobile numbers capable of receiving WhatsApp messages.

### Dependencies
- Task 28: Create Form Validation (provides base schema)
- Task 22: Create Phone Input (provides phone field with +94 prefix)

### Instructions

1. **Define Sri Lanka phone regex pattern**
   - Pattern: `^7[0-9]{8}$`
   - First digit must be 7 (mobile)
   - Followed by exactly 8 more digits
   - Total: 9 digits after +94

2. **Add phone validation to schema**
   - Open `checkoutSchemas.ts`
   - Locate phone field in schema
   - Add custom regex validation

3. **Implement validation logic**
   - Use Zod's `.regex()` method
   - Apply Sri Lanka mobile pattern
   - Define custom error message

4. **Validate phone number format**
   - Remove spaces and dashes from input
   - Check for exactly 9 digits
   - Ensure starts with 7

5. **Add phone-specific error messages**
   - "Please enter a valid Sri Lankan mobile number"
   - "Mobile number must start with 7"
   - "Mobile number must be 9 digits"

6. **Handle user input variations**
   - Accept: 771234567, 77 123 4567, 77-123-4567
   - Normalize: Remove spaces and dashes before validation
   - Store: Clean format (771234567)

7. **Validate against Sri Lankan mobile operators**
   - Dialog: 76, 77
   - Mobitel: 70, 71, 72
   - Hutch: 76, 77
   - Airtel: 70, 75, 76, 77, 78
   - All start with 7 (covered by regex)

### Sri Lanka Mobile Number Format

```
Full International Format
└── +94 77 123 4567
    │  │  └── 7 digits
    │  └── Operator prefix (2 digits)
    └── Country code

Input Format (our system)
└── +94 (fixed) + 77 123 4567 (user enters)
                  └── 9 digits starting with 7
```

### Phone Validation Pattern

| Component | Rule | Example |
|-----------|------|---------|
| Country Code | Fixed +94 | Not user input |
| First Digit | Must be 7 | 7XX XXX XXX |
| Total Digits | Exactly 9 | 771234567 |
| Format | Digits only (after normalization) | No letters |

### Validation Regex Breakdown

```
Pattern: ^7[0-9]{8}$

^           Start of string
7           First digit must be 7
[0-9]{8}    Exactly 8 more digits (0-9)
$           End of string

Total: 9 digits, starting with 7
```

### Valid Phone Number Examples

| Format | Valid | Notes |
|--------|-------|-------|
| 771234567 | ✓ | Standard format |
| 701234567 | ✓ | Mobitel |
| 761234567 | ✓ | Dialog/Hutch |
| 751234567 | ✓ | Airtel |
| 781234567 | ✓ | Airtel |

### Invalid Phone Number Examples

| Format | Valid | Reason |
|--------|-------|--------|
| 871234567 | ✗ | Starts with 8 (landline) |
| 71234567 | ✗ | Only 8 digits |
| 7712345678 | ✗ | 10 digits |
| 07712345678 | ✗ | Starts with 0 |

### Sri Lankan Mobile Operator Prefixes

| Operator | Prefixes | Example |
|----------|----------|---------|
| Dialog | 76, 77 | +94 77 123 4567 |
| Mobitel | 70, 71, 72 | +94 71 234 5678 |
| Hutch | 76, 77 | +94 76 345 6789 |
| Airtel | 70, 75, 76, 77, 78 | +94 78 456 7890 |

### Phone Number Normalization

```
User Input Variations
├── "77 123 4567"
├── "77-123-4567"
├── "771234567"
└── "77.123.4567"
    │
    ▼
Remove non-digits
    │
    ▼
"771234567"
    │
    ▼
Validate with regex
    │
    ├─→ Matches ^7[0-9]{8}$ ─→ Valid ✓
    │
    └─→ No match ─────────→ Invalid ✗
```

### Validation Flow Diagram

```
Phone Input (+94 prefix shown, user enters digits)
    │
    ▼
┌─────────────────────────┐
│ 1. Extract digits only  │
│    (remove spaces/dash) │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ 2. Check length = 9     │
└─────────────────────────┘
    │
    ├─→ Not 9 digits ──→ Error: "Must be 9 digits"
    │
    ▼
┌─────────────────────────┐
│ 3. Check starts with 7  │
└─────────────────────────┘
    │
    ├─→ Not 7 ──────────→ Error: "Must start with 7"
    │
    ▼
┌─────────────────────────┐
│ 4. Validate with regex  │
│    ^7[0-9]{8}$          │
└─────────────────────────┘
    │
    ├─→ No match ───────→ Error: "Invalid mobile number"
    │
    ▼
Valid Sri Lankan Mobile ✓
```

### Error Messages by Scenario

| Scenario | Error Message |
|----------|---------------|
| Too short | "Mobile number must be 9 digits" |
| Too long | "Mobile number must be 9 digits" |
| Starts with 0 | "Don't include the leading 0" |
| Starts with 8 or 9 | "Mobile numbers start with 7" |
| Contains letters | "Mobile number must contain only digits" |
| Invalid format | "Please enter a valid Sri Lankan mobile number" |

### WhatsApp Validation Context

| Requirement | Implementation |
|-------------|----------------|
| WhatsApp Support | All Sri Lankan mobile numbers support WhatsApp |
| Delivery Channel | Primary order updates via WhatsApp |
| Validation Purpose | Ensure deliverable WhatsApp messages |

### Expected Outcome
- Strict validation for Sri Lankan mobile numbers
- Clear error messages for different validation failures
- Input normalization for consistent storage
- Compatibility with WhatsApp messaging requirements

### Verification Checklist
- [ ] Regex pattern `^7[0-9]{8}$` implemented
- [ ] Validation added to Zod schema
- [ ] Phone input normalization (remove spaces/dashes)
- [ ] Error message for invalid phone number
- [ ] Test with valid numbers (70-78 prefixes)
- [ ] Test with invalid numbers (not starting with 7)
- [ ] Test with wrong length (too short/long)
- [ ] Validation works with PhoneInput component

---

## Task 31: Create Error Display

### Overview
Implement a consistent error display system for form validation errors. Show field-level error messages below each input when validation fails, with clear visual indicators, animations, and accessibility features. Ensure users understand exactly what needs to be corrected.

### Dependencies
- Task 28: Create Form Validation (provides validation errors)
- Task 29: Create Email Validation (provides email errors)
- Task 30: Create Phone Validation (provides phone errors)
- React Hook Form (provides error state)

### Instructions

1. **Create error message component**
   - Create `FieldError.tsx` in `components/ui/` or `components/storefront/checkout/`
   - Accept error message as prop
   - Implement accessible error display

2. **Design error message styling**
   - Use red color for error text (text-red-600)
   - Add error icon (alert circle or exclamation)
   - Set appropriate font size (text-sm)
   - Add proper spacing (mt-1 for margin-top)

3. **Implement error animations**
   - Add fade-in animation when error appears
   - Use Framer Motion or CSS animations
   - Smooth transition (200-300ms duration)
   - Avoid jarring movements

4. **Connect to React Hook Form errors**
   - Access errors from `formState.errors`
   - Extract error message for each field
   - Pass to FieldError component
   - Conditionally render when error exists

5. **Add accessibility features**
   - Use `aria-live="polite"` for error announcements
   - Add `role="alert"` to error container
   - Associate error with input using `aria-describedby`
   - Ensure error is announced to screen readers

6. **Style input fields on error**
   - Add red border to invalid inputs
   - Change focus ring color to red
   - Add error icon inside input (optional)
   - Maintain clear visual feedback

7. **Test error display**
   - Submit form with empty fields
   - Enter invalid email format
   - Enter invalid phone number
   - Verify error messages appear
   - Check screen reader announcements

### Error Display Structure

```
Input Field
    │
    ├─→ Valid State
    │   └── Normal border (gray)
    │
    └─→ Error State
        ├── Red border
        ├── Error icon (optional)
        └── Error message below
            ├── Red text
            ├── Alert icon
            └── Error description
```

### Error Message Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| message | string | Yes | Error message to display |
| className | string | No | Additional CSS classes |

### Visual Error States

| Element | Normal | Error | Focus (Error) |
|---------|--------|-------|---------------|
| Border | border-gray-300 | border-red-500 | border-red-500 |
| Ring | focus:ring-blue-500 | focus:ring-red-500 | ring-red-500 |
| Text | text-gray-900 | text-gray-900 | text-gray-900 |
| Error Msg | (hidden) | text-red-600 | text-red-600 |

### Error Display Positioning

```
┌─────────────────────────────────────┐
│  Email Address *                    │
│  ┌────────────────────────────────┐ │
│  │ user@example                 ⚠ │ │ ← Error icon (optional)
│  └────────────────────────────────┘ │
│     └─ Red border
│  
│  ⚠ Please enter a valid email address │ ← Error message
│     └─ Red text with alert icon
│
└─────────────────────────────────────┘
```

### Error Animation Sequence

```
Error Triggered
    │
    ▼
┌───────────────────────┐
│ Opacity: 0            │
│ Transform: -4px       │
└───────────────────────┘
    │ (transition 200ms)
    ▼
┌───────────────────────┐
│ Opacity: 1            │
│ Transform: 0px        │
└───────────────────────┘
    │
    ▼
Error Fully Visible
```

### Accessibility Attributes

| Attribute | Element | Purpose |
|-----------|---------|---------|
| aria-invalid | input | Mark field as invalid |
| aria-describedby | input | Link to error message ID |
| role="alert" | error div | Announce as alert |
| aria-live="polite" | error div | Screen reader update |
| id | error div | Match aria-describedby |

### Error Display HTML Structure

```
<div className="space-y-1">
  <label htmlFor="email">Email Address *</label>
  <input
    id="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
    className={errors.email ? "border-red-500" : "border-gray-300"}
  />
  {errors.email && (
    <div
      id="email-error"
      role="alert"
      aria-live="polite"
      className="text-red-600 text-sm flex items-center gap-1"
    >
      <AlertCircleIcon className="w-4 h-4" />
      <span>{errors.email.message}</span>
    </div>
  )}
</div>
```

### Error Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Color | text-red-600 | Clear error indication |
| Font Size | text-sm | Readable but not overwhelming |
| Icon Size | w-4 h-4 | Matches text size |
| Margin Top | mt-1 | Spacing from input |
| Display | flex items-center | Align icon and text |
| Gap | gap-1 | Space between icon and text |

### Error Message Format

| Type | Format | Example |
|------|--------|---------|
| Required Field | "Please enter your [field]" | "Please enter your email address" |
| Invalid Format | "Please enter a valid [field]" | "Please enter a valid email address" |
| Specific Rule | "[Specific requirement]" | "Mobile number must start with 7" |

### Field-Specific Error Messages

| Field | Error Scenario | Message |
|-------|----------------|---------|
| Email | Empty | "Please enter your email address" |
| Email | Invalid | "Please enter a valid email address" |
| Phone | Empty | "Please enter your mobile number" |
| Phone | Invalid | "Please enter a valid Sri Lankan mobile number" |
| Phone | Wrong start | "Mobile numbers must start with 7" |
| First Name | Empty | "Please enter your first name" |
| First Name | Too short | "First name must be at least 2 characters" |
| Last Name | Empty | "Please enter your last name" |
| Last Name | Too short | "Last name must be at least 2 characters" |

### Expected Outcome
- Clear, visible error messages for all validation failures
- Consistent error styling across all form fields
- Smooth animations for error appearance
- Full accessibility support for screen readers
- Visual feedback on inputs with errors

### Verification Checklist
- [ ] FieldError component created
- [ ] Error styling implemented (red color, icon)
- [ ] Error messages appear below respective fields
- [ ] Fade-in animation on error display
- [ ] Errors from React Hook Form connected
- [ ] Accessibility attributes implemented (aria-invalid, aria-describedby, role, aria-live)
- [ ] Input borders change to red on error
- [ ] Error messages are clear and helpful
- [ ] Screen reader announces errors properly

---

## Task 32: Create Save to Store

### Overview
Implement integration with the checkout store to persist information step data. Automatically save form field values to the Zustand store as users fill out the form, enabling data persistence across page reloads, navigation between checkout steps, and recovery if users navigate away and return.

### Dependencies
- Task 09: Create Checkout Store (from Group A)
- Task 28: Create Form Validation (provides form data structure)
- React Hook Form (provides form state)

### Instructions

1. **Review checkout store structure**
   - Open checkout store file from Task 09
   - Identify information step state properties
   - Understand update action signatures

2. **Import store hooks in component**
   - Import `useCheckoutStore` hook
   - Access state and update actions
   - Set up selectors for performance

3. **Create save function**
   - Define function to save form data to store
   - Accept form data as parameter
   - Call store update action

4. **Implement auto-save on change**
   - Use React Hook Form's watch() or onChange
   - Debounce updates to avoid excessive saves
   - Save to store on field blur or change

5. **Save on continue button click**
   - Connect continue button to form submission
   - Validate form data before saving
   - Save to store on successful validation
   - Navigate to next step after save

6. **Handle validation before save**
   - Ensure form passes validation
   - Don't save invalid data to store
   - Show errors if validation fails
   - Block navigation until valid

7. **Test data persistence**
   - Fill form fields
   - Verify data saved to store
   - Navigate away and return
   - Confirm data persists (Task 33 handles pre-fill)

### Checkout Store Structure

```
checkoutStore
├── cart (from Cart module)
├── information
│   ├── email: string
│   ├── phone: string
│   ├── firstName: string
│   ├── lastName: string
│   └── whatsappOptIn: boolean
├── shipping (from Step 2)
├── payment (from Step 3)
└── actions
    ├── updateInformation()
    ├── updateShipping()
    └── updatePayment()
```

### Save Flow Diagram

```
User Fills Form Field
    │
    ▼
onChange Event
    │
    ▼
┌──────────────────────────┐
│ React Hook Form Updates  │
│ Internal State           │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Optional: Debounce       │
│ (300ms delay)            │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Call updateInformation() │
│ with field data          │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Zustand Store Updated    │
│ (persisted to localStorage)│
└──────────────────────────┘
```

### Update Information Action

| Parameter | Type | Description |
|-----------|------|-------------|
| data | InformationStepData | Form data object |

### Store Update Implementation

```
Store Action Structure
└── updateInformation(data: InformationStepData)
    ├── Validate data type
    ├── Merge with existing state
    └── Persist to localStorage (via store middleware)
```

### Save Strategy Options

| Strategy | Trigger | Pros | Cons |
|----------|---------|------|------|
| onChange | Every keystroke | Real-time sync | Performance impact |
| onBlur | Field loses focus | Less frequent | Small delay |
| Debounced | After pause in typing | Balanced | Slight complexity |
| onSubmit | Continue button | Simple, clean | No intermediate saves |

### Recommended Save Strategy

```
Hybrid Approach
├── Auto-save (debounced, 500ms)
│   └── Saves as user types, but not too frequently
└── onSubmit
    └── Final validation and save before navigation
```

### Data Flow

```
Form Component
    │
    ├── formData (React Hook Form)
    │   └── { email, phone, firstName, lastName, whatsappOptIn }
    │
    ▼
useCheckoutStore
    │
    ├── State: information
    │   └── { email, phone, firstName, lastName, whatsappOptIn }
    │
    └── Action: updateInformation(data)
        │
        ▼
    Store Updated
        │
        ▼
    localStorage (via persist middleware)
```

### Integration with Continue Button

```
User Clicks Continue
    │
    ▼
┌──────────────────────────┐
│ Trigger form validation  │
└──────────────────────────┘
    │
    ├─→ Invalid ──→ Show errors (Task 31)
    │               Block navigation
    │
    ▼
┌──────────────────────────┐
│ Call updateInformation() │
│ with validated data      │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Mark step as complete    │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Navigate to Step 2       │
│ (Shipping)               │
└──────────────────────────┘
```

### Continue Button Logic

```
const handleContinue = async (data: InformationStepData) => {
  // Data already validated by React Hook Form + Zod
  
  // Save to store
  updateInformation(data);
  
  // Mark step as complete
  markStepComplete('information');
  
  // Navigate to next step
  router.push('/checkout/shipping');
};
```

### Store State Update

| Before | After Submit |
|--------|--------------|
| information: {} | information: { email, phone, firstName, lastName, whatsappOptIn } |
| currentStep: 'information' | currentStep: 'shipping' |
| completedSteps: [] | completedSteps: ['information'] |

### Performance Considerations

| Concern | Solution |
|---------|----------|
| Too many updates | Debounce onChange saves |
| Store re-renders | Use selectors to subscribe only to needed state |
| localStorage writes | Middleware batches writes |

### Expected Outcome
- Form data automatically saved to checkout store
- Data persists across page navigation
- Smooth transition to next checkout step
- No data loss if user navigates away

### Verification Checklist
- [ ] Checkout store imported in component
- [ ] `updateInformation()` action called on form submit
- [ ] Form validation happens before save
- [ ] Data saved to store successfully
- [ ] Continue button triggers save and navigation
- [ ] Invalid forms don't save or navigate
- [ ] Store state updated correctly
- [ ] localStorage contains saved data

---

## Task 33: Create Pre-fill for Logged In

### Overview
Implement automatic form pre-filling for authenticated users. When a logged-in user reaches the information step, automatically populate email, phone, first name, and last name fields with data from their user profile. Disable email field if verified to prevent changes. This improves user experience by reducing data entry.

### Dependencies
- Task 16: Create Auth State (from Group A - provides user authentication state)
- Task 32: Create Save to Store (provides store integration)
- User authentication system with profile data

### Instructions

1. **Access user authentication state**
   - Import auth store or context
   - Check if user is authenticated
   - Retrieve user profile data

2. **Extract user profile data**
   - Get email from user account
   - Get phone from user profile
   - Get first name from user profile
   - Get last name from user profile
   - Check email verification status

3. **Set default values in form**
   - Use React Hook Form's `defaultValues` prop
   - Conditionally set values if user is logged in
   - Leave empty if not authenticated

4. **Implement form reset with user data**
   - Use `reset()` method from React Hook Form
   - Call on component mount if user is logged in
   - Populate fields with user data

5. **Handle email field for verified users**
   - Check if user's email is verified
   - Disable email input if verified
   - Show indicator that email is verified
   - Add tooltip explaining why disabled

6. **Check store first, then user data**
   - Priority 1: Data already in checkout store (from previous visit)
   - Priority 2: User profile data (if no store data)
   - Priority 3: Empty fields (guest checkout)

7. **Test pre-fill functionality**
   - Log in as user with complete profile
   - Navigate to checkout
   - Verify fields are pre-filled
   - Test with verified and unverified email
   - Test guest checkout (no pre-fill)

### Pre-fill Data Sources

```
Data Source Priority
│
├── 1. Checkout Store (highest priority)
│   └── User previously filled form
│       └── Use stored data
│
├── 2. User Profile (if store empty)
│   └── User is logged in
│       └── Use profile data
│
└── 3. Empty (lowest priority)
    └── Guest user or no data
        └── Show empty fields
```

### Pre-fill Logic Flow

```
Component Mounts
    │
    ▼
┌────────────────────────┐
│ Check authentication   │
│ status                 │
└────────────────────────┘
    │
    ├─→ Not logged in ──→ Empty form (guest checkout)
    │
    ▼
┌────────────────────────┐
│ Check checkout store   │
│ for existing data      │
└────────────────────────┘
    │
    ├─→ Has data ────────→ Use store data (user returning)
    │
    ▼
┌────────────────────────┐
│ Fetch user profile     │
│ data                   │
└────────────────────────┘
    │
    ▼
┌────────────────────────┐
│ Pre-fill form fields   │
│ with profile data      │
└────────────────────────┘
    │
    ▼
┌────────────────────────┐
│ Check email verified   │
│ status                 │
└────────────────────────┘
    │
    └─→ Verified ─────────→ Disable email field
```

### User Data Structure

```
User Profile
├── account
│   ├── email: string
│   ├── emailVerified: boolean
│   └── id: string
└── profile
    ├── firstName: string
    ├── lastName: string
    └── phone: string
```

### Field Pre-fill Mapping

| Form Field | Data Source | Fallback |
|------------|-------------|----------|
| email | user.account.email | "" |
| phone | user.profile.phone | "" |
| firstName | user.profile.firstName | "" |
| lastName | user.profile.lastName | "" |
| whatsappOptIn | store or default | true |

### Email Field States

| User State | Email Status | Field State |
|------------|--------------|-------------|
| Not logged in | N/A | Empty, enabled |
| Logged in, unverified | Unverified | Pre-filled, enabled |
| Logged in, verified | Verified | Pre-filled, disabled |

### Verified Email Indicator

```
┌─────────────────────────────────────┐
│  Email Address *               ✓    │ ← Verified badge
│  ┌────────────────────────────────┐ │
│  │ user@example.com           🔒  │ │ ← Lock icon
│  └────────────────────────────────┘ │
│     └─ Disabled (gray background)
│  
│  ℹ Email verified and locked        │ ← Info message
│
└─────────────────────────────────────┘
```

### Pre-fill Implementation

```
useEffect Hook
└── On component mount
    ├── Get user from auth store
    ├── Get stored data from checkout store
    ├── Determine data source priority
    └── Call form.reset(data)
```

### Data Priority Example

```
Scenario 1: Returning user with stored data
└── Store: { email: "new@example.com", phone: "771234567" }
    Profile: { email: "old@example.com", phone: "789999999" }
    Result: Use store data (user's latest input)

Scenario 2: First-time logged-in user
└── Store: {}
    Profile: { email: "user@example.com", phone: "771234567" }
    Result: Use profile data

Scenario 3: Guest user
└── Store: {}
    Profile: null
    Result: Empty form
```

### Disabled Field Styling

| State | Background | Cursor | Opacity |
|-------|------------|--------|---------|
| Enabled | bg-white | cursor-text | opacity-100 |
| Disabled | bg-gray-50 | cursor-not-allowed | opacity-75 |

### Expected Outcome
- Authenticated users see pre-filled form fields
- Email field disabled for verified users
- Data sourced from checkout store first, then user profile
- Guest users see empty form
- Verified email indicator displayed appropriately

### Verification Checklist
- [ ] Authentication state accessed in component
- [ ] User profile data retrieved when logged in
- [ ] Form fields pre-filled with user data
- [ ] Checkout store data takes priority over profile
- [ ] Email field disabled for verified users
- [ ] Verified email indicator/badge displayed
- [ ] Guest users see empty form (no errors)
- [ ] Pre-fill works on component mount
- [ ] Test with various user states (guest, unverified, verified)

---

## Task 34: Verify Step 1 Flow

### Overview
Conduct comprehensive testing and verification of the complete information step flow. Ensure all components work together seamlessly, validation functions correctly, data persists to the store, and users can successfully complete step 1 and proceed to shipping. This task confirms the entire information collection process is production-ready.

### Dependencies
- All previous tasks in Group B (Tasks 19-33)
- Testing environment or development server running
- Access to browser dev tools

### Instructions

1. **Test guest user flow**
   - Open checkout as non-authenticated user
   - Fill all required fields
   - Verify validation triggers appropriately
   - Submit form and check store update
   - Verify navigation to step 2

2. **Test logged-in user flow (unverified email)**
   - Log in with unverified account
   - Navigate to checkout
   - Verify fields pre-filled from profile
   - Verify email field is editable
   - Submit and check data saved

3. **Test logged-in user flow (verified email)**
   - Log in with verified account
   - Navigate to checkout
   - Verify fields pre-filled
   - Verify email field is disabled
   - Verify verified badge displayed
   - Submit and check data saved

4. **Test validation scenarios**
   - Submit empty form → all field errors shown
   - Enter invalid email → email error shown
   - Enter invalid phone → phone error shown
   - Fix errors → errors clear appropriately
   - Submit valid form → no errors, proceed to step 2

5. **Test data persistence**
   - Fill form partially
   - Refresh page
   - Verify data persists (from store)
   - Complete form
   - Navigate to step 2
   - Go back to step 1
   - Verify data still there

6. **Test error display**
   - Trigger each validation error type
   - Verify error messages appear below fields
   - Check error styling (red border, icon)
   - Verify accessibility (screen reader announcements)
   - Clear errors by fixing fields

7. **Test WhatsApp checkbox**
   - Verify defaults to checked
   - Toggle on and off
   - Verify state saved to store
   - Submit form with both states

8. **Test login prompt**
   - As guest, click "Log in" link
   - Verify redirects to login page
   - After login, verify returns to checkout
   - Verify checkout data preserved

9. **Test phone input formatting**
   - Enter phone in various formats
   - Verify formatting applied correctly
   - Verify +94 prefix always shown
   - Test validation with different formats

10. **Test responsive design**
    - Test on mobile viewport (< 640px)
    - Test on tablet viewport (640-1024px)
    - Test on desktop viewport (> 1024px)
    - Verify layout adjusts appropriately

11. **Check performance**
    - Measure form interaction responsiveness
    - Check for console errors or warnings
    - Verify no memory leaks
    - Test with slow 3G connection

12. **Verify accessibility**
    - Tab through form fields
    - Verify focus indicators visible
    - Use screen reader (NVDA, JAWS, VoiceOver)
    - Verify error announcements
    - Check color contrast ratios

### Verification Test Cases

| Test Case | Expected Outcome | Status |
|-----------|------------------|--------|
| TC-01: Guest submission | Form validates, saves to store, navigates to step 2 | ☐ |
| TC-02: Logged-in unverified | Fields pre-filled, all editable, saves correctly | ☐ |
| TC-03: Logged-in verified | Email pre-filled and disabled, badge shown | ☐ |
| TC-04: Empty form submit | All field errors displayed | ☐ |
| TC-05: Invalid email | Email error message shown | ☐ |
| TC-06: Invalid phone | Phone error message shown | ☐ |
| TC-07: Data persistence | Refresh preserves data | ☐ |
| TC-08: Back navigation | Return to step 1 shows saved data | ☐ |
| TC-09: WhatsApp checkbox | Toggles and saves correctly | ☐ |
| TC-10: Login prompt | Redirects and returns properly | ☐ |
| TC-11: Phone formatting | +94 prefix, correct masking | ☐ |
| TC-12: Responsive mobile | Layout works on small screens | ☐ |
| TC-13: Responsive desktop | Layout works on large screens | ☐ |
| TC-14: Keyboard navigation | Tab order logical, focus visible | ☐ |
| TC-15: Screen reader | Errors announced, labels clear | ☐ |

### Complete Flow Diagram

```
User Lands on Checkout
    │
    ▼
┌──────────────────────────────┐
│ Check Authentication         │
└──────────────────────────────┘
    │
    ├─→ Guest ──────┐
    │               │
    └─→ Logged In   │
        │           │
        ├─→ Pre-fill form
        │   (Task 33)
        │           │
        ▼           ▼
┌──────────────────────────────┐
│ Display Information Step     │
│ - Contact Section            │
│ - Personal Info Section      │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ User Fills Form              │
│ - Real-time validation       │
│ - Error display on invalid   │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ User Clicks Continue         │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Validate All Fields          │
│ (Zod Schema)                 │
└──────────────────────────────┘
    │
    ├─→ Invalid ──→ Show Errors
    │               (Stop)
    │
    ▼
┌──────────────────────────────┐
│ Save to Checkout Store       │
│ (Task 32)                    │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Mark Step Complete           │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Navigate to Step 2           │
│ (Shipping)                   │
└──────────────────────────────┘
```

### Email Validation Test Matrix

| Input | Expected Result |
|-------|-----------------|
| user@example.com | ✓ Valid |
| user@example | ✗ "Please enter a valid email address" |
| @example.com | ✗ "Please enter a valid email address" |
| user.example.com | ✗ "Please enter a valid email address" |
| user@gmial.com | Optional: Suggest gmail.com |
| (empty) | ✗ "Please enter your email address" |

### Phone Validation Test Matrix

| Input | Expected Result |
|-------|-----------------|
| 771234567 | ✓ Valid |
| 701234567 | ✓ Valid (Mobitel) |
| 871234567 | ✗ "Mobile numbers must start with 7" |
| 71234567 | ✗ "Mobile number must be 9 digits" |
| 7712345678 | ✗ "Mobile number must be 9 digits" |
| 77 123 4567 | ✓ Valid (normalized) |
| (empty) | ✗ "Please enter your mobile number" |

### Store State Verification

```
Before Step 1 Complete
checkoutStore: {
  information: {},
  currentStep: 'information',
  completedSteps: []
}

After Step 1 Complete
checkoutStore: {
  information: {
    email: "user@example.com",
    phone: "771234567",
    firstName: "John",
    lastName: "Doe",
    whatsappOptIn: true
  },
  currentStep: 'shipping',
  completedSteps: ['information']
}
```

### Browser Dev Tools Checks

| Tool | What to Check |
|------|---------------|
| Console | No errors or warnings |
| Network | API calls succeed (if any) |
| Application | localStorage contains checkout data |
| Elements | Accessibility attributes present |
| Performance | No layout shifts or repaints |

### Cross-Browser Testing

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ☐ |
| Firefox | Latest | ☐ |
| Safari | Latest | ☐ |
| Edge | Latest | ☐ |
| Mobile Safari | iOS 15+ | ☐ |
| Chrome Mobile | Android | ☐ |

### Accessibility Testing Tools

| Tool | Purpose |
|------|---------|
| axe DevTools | Automated accessibility testing |
| WAVE | Visual accessibility evaluation |
| Lighthouse | Overall accessibility score |
| Screen Reader | Manual testing (NVDA/JAWS/VoiceOver) |
| Keyboard Only | Navigation without mouse |

### Performance Benchmarks

| Metric | Target | Measured |
|--------|--------|----------|
| Form Input Lag | < 50ms | ☐ |
| Validation Speed | < 100ms | ☐ |
| Store Update | < 50ms | ☐ |
| Page Transition | < 200ms | ☐ |

### Common Issues to Check

| Issue | Verification |
|-------|--------------|
| Form doesn't submit | Check validation errors, console errors |
| Data not saving | Check store update, localStorage |
| Pre-fill not working | Check auth state, user profile data |
| Email not disabled | Check email verification status |
| Errors not showing | Check error state, conditional rendering |
| Phone formatting broken | Check input mask, normalization |
| Navigation blocked | Check validation, navigation guards |

### Expected Outcome
- Complete information step flow works end-to-end
- All validation scenarios tested and passing
- Data persistence confirmed across sessions
- Pre-fill works for authenticated users
- Responsive design verified on all viewports
- Accessibility standards met
- Performance benchmarks achieved
- Production-ready implementation

### Verification Checklist
- [ ] Guest user flow tested successfully
- [ ] Logged-in unverified user flow tested
- [ ] Logged-in verified user flow tested
- [ ] All validation scenarios work correctly
- [ ] Data persists across page refreshes
- [ ] Back navigation preserves data
- [ ] Error messages display appropriately
- [ ] WhatsApp checkbox functions correctly
- [ ] Login prompt works correctly
- [ ] Phone input formatting works
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] No console errors or warnings
- [ ] Store state updates correctly
- [ ] Successfully navigates to step 2 after validation

---

## Summary

This document established comprehensive validation, data persistence, and verification for the checkout information step. The implementation ensures robust data collection with field-level validation, clear error messaging, seamless store integration, and smart pre-filling for authenticated users.

### Completed Tasks
1. ✓ Created comprehensive Zod validation schema for information step
2. ✓ Implemented email validation with format checking and optional typo detection
3. ✓ Implemented Sri Lanka phone validation with ^7[0-9]{8}$ pattern
4. ✓ Created accessible error display system with visual and screen reader support
5. ✓ Integrated form with checkout store for data persistence
6. ✓ Implemented pre-fill functionality for authenticated users with email locking
7. ✓ Verified complete step 1 flow with comprehensive test cases

### Key Achievements

- **Robust Validation:** Zod schema with custom rules for email and Sri Lankan phone numbers
- **User Experience:** Clear error messages, real-time validation, smooth animations
- **Data Persistence:** Automatic save to Zustand store with localStorage sync
- **Smart Pre-fill:** Priority-based data sourcing (store → profile → empty)
- **Accessibility:** ARIA attributes, screen reader support, keyboard navigation
- **Production Ready:** Comprehensive testing across browsers, devices, and user states

### Data Flow Overview

```
User Input
    ↓
Validation (Zod + React Hook Form)
    ↓
Error Display (if invalid)
    ↓
Save to Store (if valid)
    ↓
localStorage Persistence
    ↓
Navigate to Step 2
```

### Group B Completion

All tasks in Group B (Tasks 19-34) are now complete. The information step provides a solid foundation for collecting customer contact and personal information with:

- Professional UI components (page, sections, inputs)
- Comprehensive validation (email, phone, names)
- Seamless data persistence (Zustand store)
- Smart user experience (pre-fill, error handling)
- Full accessibility support
- Complete end-to-end verification

### Next Steps

Proceed to **Group C: Step 2 - Shipping** to create the shipping address collection step with Sri Lankan address formats, delivery method selection, and shipping cost calculation.

---

## Additional Resources

### Zod Documentation
- Schema validation patterns
- Custom validation methods
- TypeScript integration

### React Hook Form
- Form state management
- Validation integration
- Error handling patterns

### Accessibility Guidelines
- WCAG 2.1 AA compliance
- ARIA best practices
- Screen reader testing

### Sri Lanka Phone Standards
- Mobile operator prefixes
- Number formatting conventions
- WhatsApp compatibility

---

*Document Version: 1.0*  
*Last Updated: Phase 08, SubPhase 07, Group B*  
*Status: Complete*
