# Tasks 17-26: Registration Form and Input Fields

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** B - Registration Flow  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Validation-Submit-Verify.md](02_Tasks-27-34_Validation-Submit-Verify.md)

---

## Document Overview

This document covers the creation of the customer registration page and form with all input fields. It establishes the registration UI including email/phone inputs with Sri Lanka +94 format support, email OR phone toggle for choosing registration method, name inputs, password fields with strength meter, and all form infrastructure using React Hook Form.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Register Page | Low | 20 min |
| 18 | Create Register Form | Medium | 30 min |
| 19 | Create Email Input | Low | 20 min |
| 20 | Create Phone Input (+94 format) | Medium | 35 min |
| 21 | Create Email OR Phone Toggle | Low | 25 min |
| 22 | Create First Name Input | Low | 15 min |
| 23 | Create Last Name Input | Low | 15 min |
| 24 | Create Password Input | Low | 20 min |
| 25 | Create Confirm Password Input | Low | 15 min |
| 26 | Create Password Strength Meter | Medium | 30 min |

---

## Task 17: Create Register Page

### Overview
Create the main registration page component that serves as the container for the registration flow. This page component handles the route rendering at `/register` and provides the structure for the registration form within the storefront authentication layout.

### Dependencies
- Task 16: Verify Store Auth Routes (from Group A)
- Storefront auth layout exists
- StorefrontLayout configured

### Instructions

1. **Navigate to components directory**
   - Go to `frontend/components/storefront/auth/` directory
   - Create new folder named `Register`

2. **Create RegisterPage.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `RegisterPage.tsx`
   - This is the main page component

3. **Import required dependencies**
   - Import React types
   - Import Card component from shadcn/ui
   - Import RegisterForm component (created in Task 18)
   - Import necessary layout utilities

4. **Define page metadata structure**
   - Add page title for SEO
   - Set description about customer registration
   - Configure metadata for webstore context

5. **Create RegisterPage component**
   - Define default export function `RegisterPage`
   - Use 'use client' directive for client component
   - Return structured JSX

6. **Implement page structure**
   - Add centered container with max-width
   - Include Card wrapper for registration form
   - Add CardHeader with title and description
   - Add CardContent with RegisterForm component

7. **Add registration header content**
   - Display "Create Account" as main heading
   - Add subtitle "Join LankaCommerce and start shopping"
   - Include welcome message for new customers

8. **Configure responsive layout**
   - Set max-width for registration card (md breakpoint)
   - Center card horizontally on page
   - Add appropriate padding and spacing
   - Ensure mobile-first responsive design

### Page Structure

```
┌──────────────────────────────────────────┐
│                                          │
│        [LCC Logo - from layout]          │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │   Create Account                 │   │
│   │   Join LankaCommerce and start   │   │
│   │   shopping                       │   │
│   │                                  │   │
│   │   <RegisterForm />               │   │
│   │                                  │   │
│   └──────────────────────────────────┘   │
│                                          │
│        [Footer - from layout]            │
└──────────────────────────────────────────┘
```

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| None | - | No props required |

### Page Sections

| Section | Component | Purpose |
|---------|-----------|---------|
| Container | Card | Registration form wrapper |
| Header | CardHeader | Page title and description |
| Content | CardContent | RegisterForm component |

### Expected Outcome
- Register page component created
- Proper page structure with Card wrapper
- Header with title and description
- Ready to receive RegisterForm component
- Responsive layout configured

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/RegisterPage.tsx` created
- [ ] Component exports properly
- [ ] Card structure implemented
- [ ] Header with title present
- [ ] Placeholder for RegisterForm added
- [ ] Responsive design applied

---

## Task 18: Create Register Form

### Overview
Create the registration form wrapper component using React Hook Form. This form manages the complete registration flow including form state, validation handling, submission logic, and coordinating all child input components. It serves as the central hub for the registration process.

### Dependencies
- Task 17: Create Register Page
- React Hook Form library installed
- Zod validation library available

### Instructions

1. **Create RegisterForm.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `RegisterForm.tsx`
   - This manages form state and submission

2. **Import required dependencies**
   - Import React and hooks (useState, useTransition)
   - Import useForm from react-hook-form
   - Import zodResolver from @hookform/resolvers/zod
   - Import Form, FormField components from shadcn/ui
   - Import Button component

3. **Import child input components**
   - Import EmailInput (Task 19)
   - Import PhoneInput (Task 20)
   - Import EmailPhoneToggle (Task 21)
   - Import name input components (Tasks 22-23)
   - Import password components (Tasks 24-26)
   - Import TermsCheckbox (Task 28)

4. **Define form interface**
   - Create TypeScript interface for registration data
   - Include registrationType field (email or phone)
   - Include email, phone, firstName, lastName fields
   - Include password, confirmPassword fields
   - Include terms acceptance boolean

5. **Set up form state**
   - Initialize React Hook Form with useForm hook
   - Configure zodResolver for validation (schema in Task 29)
   - Set default values for all form fields
   - Configure form mode as 'onBlur' for validation

6. **Create registration type state**
   - Use useState for registrationType ('email' or 'phone')
   - Default to 'email' as registration method
   - This controls which input field is shown

7. **Implement form submission handler**
   - Create async onSubmit function
   - Accept validated form data
   - Use useTransition for pending state
   - Call register API service (Task 31)
   - Handle success and error responses

8. **Structure form JSX**
   - Wrap form elements in Form component
   - Add EmailPhoneToggle for method selection
   - Conditionally render EmailInput or PhoneInput
   - Render name inputs side-by-side
   - Add password inputs with strength meter
   - Include TermsCheckbox component
   - Add submit button with loading state

9. **Configure form layout**
   - Use flex column for form fields
   - Add spacing between field groups
   - Ensure responsive stacking on mobile
   - Group related fields together

10. **Add form footer elements**
    - Include LoginLink component (Task 33)
    - Add "Already have an account?" text
    - Position link appropriately

### Form Structure

```
┌────────────────────────────────────────┐
│  Register Form                         │
│  ┌──────────────────────────────────┐  │
│  │ ○ Email  ○ Phone                │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ Email / Phone Input              │  │
│  └──────────────────────────────────┘  │
│  ┌───────────┬────────────────────┐    │
│  │ First Name │ Last Name         │    │
│  └───────────┴────────────────────┘    │
│  ┌──────────────────────────────────┐  │
│  │ Password                         │  │
│  │ [Strength Meter]                 │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ Confirm Password                 │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ☐ I agree to Terms of Service   │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │      Create Account              │  │
│  └──────────────────────────────────┘  │
│  Already have an account? [Login]      │
└────────────────────────────────────────┘
```

### Form Fields Configuration

| Field | Type | Component | Required |
|-------|------|-----------|----------|
| registrationType | radio | EmailPhoneToggle | Yes |
| email | text | EmailInput | Conditional |
| phone | text | PhoneInput | Conditional |
| firstName | text | FirstNameInput | Yes |
| lastName | text | LastNameInput | Yes |
| password | password | PasswordInput | Yes |
| confirmPassword | password | ConfirmPassword | Yes |
| terms | checkbox | TermsCheckbox | Yes |

### Form State Management

| State | Type | Purpose |
|-------|------|---------|
| registrationType | 'email' \| 'phone' | Controls input visibility |
| isPending | boolean | Submission loading state |
| formData | RegisterFormData | Form field values |

### Expected Outcome
- RegisterForm component created
- React Hook Form integration complete
- Form state management configured
- All input components integrated
- Submit handler structure ready
- Conditional rendering logic implemented

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/RegisterForm.tsx` created
- [ ] React Hook Form configured
- [ ] Form interface defined
- [ ] Registration type state managed
- [ ] Submit handler created
- [ ] Form structure with all fields
- [ ] Conditional email/phone rendering
- [ ] Loading state handled

---

## Task 19: Create Email Input

### Overview
Create the email input field component for registration via email. This component provides an input field for entering email addresses with proper validation, error display, and integration with React Hook Form. It appears when the user selects "Email" as the registration method.

### Dependencies
- Task 18: Create Register Form

### Instructions

1. **Create EmailInput.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `EmailInput.tsx`
   - This is a controlled form input component

2. **Import required dependencies**
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage from shadcn/ui
   - Import Input component from shadcn/ui
   - Import Mail icon from lucide-react
   - Import useFormContext hook

3. **Define component props interface**
   - Create EmailInputProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state
   - Include any additional styling props

4. **Create EmailInput component**
   - Define function component with props
   - Get form context from useFormContext
   - Return FormField with proper configuration

5. **Configure FormField**
   - Set field name to "email"
   - Connect to form control
   - Render input using render prop pattern

6. **Structure input field**
   - Add FormItem wrapper
   - Include FormLabel with "Email Address" text
   - Add FormControl with Input component
   - Include FormMessage for validation errors

7. **Configure Input component**
   - Set type to "email"
   - Add placeholder "you@example.com"
   - Include Mail icon as leading icon
   - Apply autoComplete="email"
   - Set disabled state based on form submission

8. **Add input styling**
   - Apply border and padding styles
   - Add focus ring styling
   - Ensure error state styling
   - Configure icon positioning

9. **Handle accessibility**
   - Add proper aria-labels
   - Connect label to input
   - Ensure keyboard navigation
   - Add error announcements

### Input Field Structure

```
┌────────────────────────────────────┐
│ Email Address                      │
│ ┌────────────────────────────────┐ │
│ │ ✉  you@example.com            │ │
│ └────────────────────────────────┘ │
│ [Error message if validation fails]│
└────────────────────────────────────┘
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | "email" | Form field name |
| disabled | boolean | false | Disable input |

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | email | Email input type |
| autoComplete | email | Browser autofill |
| placeholder | you@example.com | Input hint |
| required | true | Field requirement |

### Expected Outcome
- EmailInput component created
- Email icon integrated
- Proper form integration
- Validation errors displayed
- Accessibility implemented

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/EmailInput.tsx` created
- [ ] FormField integration complete
- [ ] Email icon added
- [ ] Placeholder text set
- [ ] Error messages display
- [ ] AutoComplete configured
- [ ] Accessibility attributes added

---

## Task 20: Create Phone Input (+94 format)

### Overview
Create the phone input field component for registration via phone number with Sri Lankan +94 country code format. This component provides formatted phone number input, automatic formatting as the user types, and validation for Sri Lankan phone number patterns (XX XXX XXXX format).

### Dependencies
- Task 18: Create Register Form

### Instructions

1. **Create PhoneInput.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `PhoneInput.tsx`
   - This handles formatted phone input

2. **Import required dependencies**
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input component from shadcn/ui
   - Import Phone icon from lucide-react
   - Import useState for local formatting state
   - Import useFormContext hook

3. **Define component props interface**
   - Create PhoneInputProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state

4. **Create PhoneInput component**
   - Define function component with props
   - Get form context from useFormContext
   - Initialize local state for display value

5. **Implement phone formatting logic**
   - Create formatPhoneNumber helper function
   - Strip all non-numeric characters
   - Format as XX XXX XXXX pattern
   - Return formatted string

6. **Create phone number sanitizer**
   - Create sanitizePhoneNumber helper function
   - Remove all non-numeric characters
   - Validate length (9 digits after +94)
   - Return clean number for storage

7. **Configure FormField**
   - Set field name to "phone"
   - Connect to form control
   - Handle value changes with formatting

8. **Structure input field**
   - Add FormItem wrapper
   - Include FormLabel with "Phone Number" text
   - Add FormControl with Input component
   - Include country code prefix display
   - Include FormMessage for errors

9. **Configure Input component**
   - Set type to "tel"
   - Add placeholder "71 234 5678"
   - Include Phone icon
   - Apply autoComplete="tel"
   - Set maxLength to 12 (including spaces)

10. **Implement onChange handler**
    - Get raw input value
    - Sanitize to numbers only
    - Apply formatting
    - Update form field value
    - Update local display state

11. **Add country code prefix**
    - Display "+94" before input
    - Style as non-editable prefix
    - Position properly with input field
    - Use subtle styling to differentiate

12. **Add input styling**
    - Apply border and padding
    - Add focus ring styling
    - Ensure error state styling
    - Configure prefix positioning
    - Style icon appropriately

### Phone Input Structure

```
┌──────────────────────────────────────┐
│ Phone Number                         │
│ ┌──────────────────────────────────┐ │
│ │ ☎ +94 │ 71 234 5678            │ │
│ └──────────────────────────────────┘ │
│ [Error if invalid format]            │
└──────────────────────────────────────┘
```

### Phone Format Specification

| Component | Format | Example |
|-----------|--------|---------|
| Country Code | +94 | +94 |
| Network Code | XX | 71, 77, 70 |
| Number Part 1 | XXX | 234 |
| Number Part 2 | XXXX | 5678 |
| Full Format | +94 XX XXX XXXX | +94 71 234 5678 |

### Sri Lankan Mobile Patterns

| Operator | Code | Pattern |
|----------|------|---------|
| Dialog | 7X | 71, 76, 77 |
| Mobitel | 7X | 70, 71, 72 |
| Hutch | 7X | 78 |
| Airtel | 7X | 75 |

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | "phone" | Form field name |
| disabled | boolean | false | Disable input |

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | tel | Phone input type |
| autoComplete | tel | Browser autofill |
| maxLength | 12 | Limit with spaces |
| pattern | [0-9\s]+ | Numeric only |

### Formatting Logic

```
Input: "712345678"
Process:
  1. Strip non-numeric: "712345678"
  2. Split: "71" + "234" + "5678"
  3. Format: "71 234 5678"
Display: "+94 71 234 5678"
Store: "712345678"
```

### Expected Outcome
- PhoneInput component created
- +94 prefix displayed
- Auto-formatting implemented
- Format validation working
- Clean number stored in form

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/PhoneInput.tsx` created
- [ ] Formatting function implemented
- [ ] +94 prefix displayed
- [ ] XX XXX XXXX format applied
- [ ] Phone icon added
- [ ] Validation messages shown
- [ ] AutoComplete configured
- [ ] maxLength enforced

---

## Task 21: Create Email OR Phone Toggle

### Overview
Create the toggle component that allows users to choose their registration method between email and phone number. This component provides a radio-button style interface that controls which input field is displayed in the registration form, enabling customers to register using their preferred contact method.

### Dependencies
- Task 19: Create Email Input
- Task 20: Create Phone Input (for context)
- Task 18: Create Register Form

### Instructions

1. **Create EmailPhoneToggle.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `EmailPhoneToggle.tsx`
   - This controls registration method selection

2. **Import required dependencies**
   - Import RadioGroup, RadioGroupItem from shadcn/ui
   - Import Label component
   - Import Mail and Phone icons from lucide-react
   - Import useFormContext hook

3. **Define component props interface**
   - Create EmailPhoneToggleProps interface
   - Include value prop for current selection
   - Include onChange prop for selection changes
   - Include disabled prop for loading state

4. **Create EmailPhoneToggle component**
   - Define function component with props
   - Get form context if needed
   - Return RadioGroup wrapper

5. **Configure RadioGroup**
   - Set value to current selection ('email' or 'phone')
   - Set onValueChange to call onChange handler
   - Apply horizontal layout (flex row)
   - Add proper spacing between options

6. **Create Email option**
   - Add RadioGroupItem with value "email"
   - Include Mail icon
   - Add Label with "Email" text
   - Style as card-like button

7. **Create Phone option**
   - Add RadioGroupItem with value "phone"
   - Include Phone icon
   - Add Label with "Phone" text
   - Style as card-like button

8. **Add toggle styling**
   - Style as button-like cards
   - Apply border and padding
   - Add hover effects
   - Highlight selected option
   - Use brand colors for selection

9. **Configure selection states**
   - Default state: neutral border
   - Hover state: lighter border
   - Selected state: primary border with background
   - Disabled state: opacity reduction

10. **Add accessibility**
    - Ensure keyboard navigation
    - Add proper aria-labels
    - Connect labels to radio inputs
    - Add focus indicators

### Toggle Structure

```
┌─────────────────────────────────────┐
│ Choose Registration Method          │
│ ┌──────────────┬─────────────────┐  │
│ │ ● ✉ Email   │ ○ ☎ Phone      │  │
│ └──────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | 'email' \| 'phone' | 'email' | Current selection |
| onChange | (value) => void | - | Selection handler |
| disabled | boolean | false | Disable toggle |

### Toggle Options

| Option | Value | Icon | Label |
|--------|-------|------|-------|
| Email | email | Mail | Email |
| Phone | phone | Phone | Phone |

### Selection States

| State | Border | Background | Icon |
|-------|--------|------------|------|
| Default | Gray | White | Gray |
| Hover | Gray-dark | Gray-light | Gray-dark |
| Selected | Primary | Primary-light | Primary |
| Disabled | Gray-light | Gray-lighter | Gray-light |

### Expected Outcome
- Toggle component created
- Two options rendered
- Selection state managed
- Visual feedback implemented
- Icons displayed

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/EmailPhoneToggle.tsx` created
- [ ] RadioGroup configured
- [ ] Both options rendered
- [ ] Icons displayed properly
- [ ] Selection highlighting works
- [ ] onChange handler fires
- [ ] Keyboard navigation works
- [ ] Accessibility implemented

---

## Task 22: Create First Name Input

### Overview
Create the first name input field component for customer registration. This component provides a simple text input for entering the customer's first name with proper validation, error display, and integration with React Hook Form. It works alongside the last name input for complete name collection.

### Dependencies
- Task 18: Create Register Form

### Instructions

1. **Create FirstNameInput.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `FirstNameInput.tsx`
   - This is a standard text input component

2. **Import required dependencies**
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input component from shadcn/ui
   - Import User icon from lucide-react
   - Import useFormContext hook

3. **Define component props interface**
   - Create FirstNameInputProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state

4. **Create FirstNameInput component**
   - Define function component with props
   - Get form context from useFormContext
   - Return FormField with proper configuration

5. **Configure FormField**
   - Set field name to "firstName"
   - Connect to form control
   - Render input using render prop pattern

6. **Structure input field**
   - Add FormItem wrapper
   - Include FormLabel with "First Name" text
   - Add FormControl with Input component
   - Include FormMessage for validation errors

7. **Configure Input component**
   - Set type to "text"
   - Add placeholder "John"
   - Include User icon as leading icon
   - Apply autoComplete="given-name"
   - Set disabled state based on form submission

8. **Add input styling**
   - Apply border and padding styles
   - Add focus ring styling
   - Ensure error state styling
   - Configure icon positioning

9. **Handle capitalization**
   - Consider auto-capitalizing first letter
   - Use CSS text-transform or input handler
   - Maintain user input control

### Input Field Structure

```
┌────────────────────────────────┐
│ First Name                     │
│ ┌────────────────────────────┐ │
│ │ 👤 John                   │ │
│ └────────────────────────────┘ │
│ [Error message if required]    │
└────────────────────────────────┘
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | "firstName" | Form field name |
| disabled | boolean | false | Disable input |

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | text | Text input |
| autoComplete | given-name | Browser autofill |
| placeholder | John | Input hint |
| required | true | Field requirement |

### Expected Outcome
- FirstNameInput component created
- User icon integrated
- Form integration complete
- Validation errors displayed
- AutoComplete configured

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/FirstNameInput.tsx` created
- [ ] FormField integration complete
- [ ] User icon added
- [ ] Placeholder text set
- [ ] Error messages display
- [ ] AutoComplete configured
- [ ] Styling applied

---

## Task 23: Create Last Name Input

### Overview
Create the last name input field component for customer registration. This component provides a simple text input for entering the customer's last name with proper validation, error display, and integration with React Hook Form. It pairs with the first name input to collect complete customer names.

### Dependencies
- Task 18: Create Register Form

### Instructions

1. **Create LastNameInput.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `LastNameInput.tsx`
   - This mirrors FirstNameInput structure

2. **Import required dependencies**
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input component from shadcn/ui
   - Import User icon from lucide-react
   - Import useFormContext hook

3. **Define component props interface**
   - Create LastNameInputProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state

4. **Create LastNameInput component**
   - Define function component with props
   - Get form context from useFormContext
   - Return FormField with proper configuration

5. **Configure FormField**
   - Set field name to "lastName"
   - Connect to form control
   - Render input using render prop pattern

6. **Structure input field**
   - Add FormItem wrapper
   - Include FormLabel with "Last Name" text
   - Add FormControl with Input component
   - Include FormMessage for validation errors

7. **Configure Input component**
   - Set type to "text"
   - Add placeholder "Doe"
   - Include User icon as leading icon
   - Apply autoComplete="family-name"
   - Set disabled state based on form submission

8. **Add input styling**
   - Apply border and padding styles
   - Add focus ring styling
   - Ensure error state styling
   - Configure icon positioning
   - Match FirstNameInput styling

9. **Handle capitalization**
   - Consider auto-capitalizing first letter
   - Use CSS text-transform or input handler
   - Maintain user input control

### Input Field Structure

```
┌────────────────────────────────┐
│ Last Name                      │
│ ┌────────────────────────────┐ │
│ │ 👤 Doe                    │ │
│ └────────────────────────────┘ │
│ [Error message if required]    │
└────────────────────────────────┘
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | "lastName" | Form field name |
| disabled | boolean | false | Disable input |

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | text | Text input |
| autoComplete | family-name | Browser autofill |
| placeholder | Doe | Input hint |
| required | true | Field requirement |

### Name Inputs Layout

```
┌─────────────────────────────────────────┐
│ ┌────────────────┬──────────────────┐   │
│ │ First Name     │ Last Name        │   │
│ │ 👤 John        │ 👤 Doe          │   │
│ └────────────────┴──────────────────┘   │
└─────────────────────────────────────────┘
```

### Expected Outcome
- LastNameInput component created
- User icon integrated
- Form integration complete
- Validation errors displayed
- Consistent styling with FirstNameInput

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/LastNameInput.tsx` created
- [ ] FormField integration complete
- [ ] User icon added
- [ ] Placeholder text set
- [ ] Error messages display
- [ ] AutoComplete configured
- [ ] Styling matches FirstNameInput

---

## Task 24: Create Password Input

### Overview
Create the password input field component for registration with visibility toggle. This component provides a secure password input with show/hide functionality, integration with password strength meter, and proper validation error display. It serves as the foundation for password management in the registration form.

### Dependencies
- Task 18: Create Register Form

### Instructions

1. **Create PasswordInput.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `PasswordInput.tsx`
   - This handles password input with visibility toggle

2. **Import required dependencies**
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input component from shadcn/ui
   - Import Button component
   - Import Lock, Eye, EyeOff icons from lucide-react
   - Import useState hook for visibility state
   - Import useFormContext hook

3. **Define component props interface**
   - Create PasswordInputProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state
   - Include onPasswordChange callback for strength meter

4. **Create PasswordInput component**
   - Define function component with props
   - Get form context from useFormContext
   - Initialize showPassword state (default false)

5. **Configure FormField**
   - Set field name to "password"
   - Connect to form control
   - Render input with toggle button

6. **Structure input field**
   - Add FormItem wrapper
   - Include FormLabel with "Password" text
   - Add FormControl with Input in relative container
   - Add toggle button inside input container
   - Include FormMessage for validation errors

7. **Configure Input component**
   - Set type to "password" or "text" based on showPassword state
   - Add placeholder "Enter your password"
   - Include Lock icon as leading icon
   - Apply autoComplete="new-password"
   - Set disabled state based on form submission

8. **Implement visibility toggle**
   - Create toggle button positioned absolutely
   - Use Eye icon when password hidden
   - Use EyeOff icon when password visible
   - Toggle showPassword state on click
   - Position button at right edge of input

9. **Add password change handler**
   - Get current field value
   - Call onPasswordChange callback with value
   - This triggers strength meter update
   - Fire on every input change

10. **Add input styling**
    - Apply border and padding styles
    - Add focus ring styling
    - Ensure error state styling
    - Add extra padding-right for toggle button
    - Style toggle button appropriately

11. **Configure toggle button**
    - Type "button" to prevent form submission
    - Size appropriately for touch targets
    - Add hover effects
    - Ensure accessibility with aria-label

### Password Input Structure

```
┌────────────────────────────────────┐
│ Password                           │
│ ┌────────────────────────────────┐ │
│ │ 🔒 ••••••••••••      [👁]    │ │
│ └────────────────────────────────┘ │
│ [Password Strength Meter - Task 26]│
│ [Error message if validation fails]│
└────────────────────────────────────┘
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | "password" | Form field name |
| disabled | boolean | false | Disable input |
| onPasswordChange | (pwd: string) => void | - | Strength callback |

### Input States

| State | Type | Icon |
|-------|------|------|
| Hidden | password | Eye |
| Visible | text | EyeOff |

### Toggle Button Specification

| Property | Value |
|----------|-------|
| Position | Absolute right |
| Type | button |
| Size | 32x32px |
| Icon Size | 16px |

### Expected Outcome
- PasswordInput component created
- Visibility toggle implemented
- Lock icon displayed
- Password change callback working
- Ready for strength meter integration

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/PasswordInput.tsx` created
- [ ] FormField integration complete
- [ ] Lock icon added
- [ ] Visibility toggle button working
- [ ] Eye/EyeOff icons switching
- [ ] onPasswordChange callback firing
- [ ] Error messages display
- [ ] AutoComplete configured
- [ ] Toggle button positioned correctly

---

## Task 25: Create Confirm Password Input

### Overview
Create the confirm password input field component to ensure customers enter their password correctly. This component provides a second password input that must match the original password, with validation to check equality and proper error messaging for mismatches.

### Dependencies
- Task 24: Create Password Input

### Instructions

1. **Create ConfirmPasswordInput.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `ConfirmPasswordInput.tsx`
   - This mirrors PasswordInput with matching logic

2. **Import required dependencies**
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input component from shadcn/ui
   - Import Button component
   - Import Lock, Eye, EyeOff icons from lucide-react
   - Import useState hook for visibility state
   - Import useFormContext hook

3. **Define component props interface**
   - Create ConfirmPasswordInputProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state

4. **Create ConfirmPasswordInput component**
   - Define function component with props
   - Get form context from useFormContext
   - Initialize showPassword state (default false)

5. **Configure FormField**
   - Set field name to "confirmPassword"
   - Connect to form control
   - Render input with toggle button

6. **Structure input field**
   - Add FormItem wrapper
   - Include FormLabel with "Confirm Password" text
   - Add FormControl with Input in relative container
   - Add toggle button inside input container
   - Include FormMessage for validation errors

7. **Configure Input component**
   - Set type to "password" or "text" based on showPassword state
   - Add placeholder "Re-enter your password"
   - Include Lock icon as leading icon
   - Apply autoComplete="new-password"
   - Set disabled state based on form submission

8. **Implement visibility toggle**
   - Create toggle button positioned absolutely
   - Use Eye icon when password hidden
   - Use EyeOff icon when password visible
   - Toggle showPassword state on click
   - Position button at right edge of input

9. **Add input styling**
   - Apply border and padding styles
   - Add focus ring styling
   - Ensure error state styling
   - Add extra padding-right for toggle button
   - Match PasswordInput styling

10. **Configure validation message**
    - Display "Passwords must match" error
    - Show when values don't match
    - Clear error when values match
    - Validation handled by Zod schema (Task 29)

### Confirm Password Structure

```
┌────────────────────────────────────┐
│ Confirm Password                   │
│ ┌────────────────────────────────┐ │
│ │ 🔒 ••••••••••••      [👁]    │ │
│ └────────────────────────────────┘ │
│ [Error: Passwords must match]      │
└────────────────────────────────────┘
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | "confirmPassword" | Form field name |
| disabled | boolean | false | Disable input |

### Input States

| State | Type | Icon |
|-------|------|------|
| Hidden | password | Eye |
| Visible | text | EyeOff |

### Validation Logic

```
Validation Flow:
1. User enters password: "MyPassword123"
2. User enters confirm: "MyPassword123"
3. Validation: password === confirmPassword
4. Result: Valid ✓

Mismatch:
1. User enters password: "MyPassword123"
2. User enters confirm: "MyPassword124"
3. Validation: password !== confirmPassword
4. Result: Error "Passwords must match"
```

### Expected Outcome
- ConfirmPasswordInput component created
- Visibility toggle implemented
- Lock icon displayed
- Matching validation ready
- Consistent styling with PasswordInput

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/ConfirmPasswordInput.tsx` created
- [ ] FormField integration complete
- [ ] Lock icon added
- [ ] Visibility toggle button working
- [ ] Eye/EyeOff icons switching
- [ ] Error messages display
- [ ] AutoComplete configured
- [ ] Styling matches PasswordInput

---

## Task 26: Create Password Strength Meter

### Overview
Create the password strength meter component that provides visual feedback on password security. This component analyzes password characteristics (length, complexity, character types) and displays a colored progress bar with strength label (Weak, Fair, Good, Strong) to help customers create secure passwords.

### Dependencies
- Task 24: Create Password Input

### Instructions

1. **Create PasswordStrengthMeter.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `PasswordStrengthMeter.tsx`
   - This calculates and displays password strength

2. **Import required dependencies**
   - Import React and useState, useEffect hooks
   - Import Progress component from shadcn/ui
   - Import cn utility for conditional classes

3. **Define component props interface**
   - Create PasswordStrengthMeterProps interface
   - Include password prop (current password value)
   - Include className prop for styling

4. **Define strength levels**
   - Create StrengthLevel type ('weak' | 'fair' | 'good' | 'strong')
   - Create interface for strength result
   - Include score (0-100), level, and color

5. **Create PasswordStrengthMeter component**
   - Define function component with props
   - Initialize strength state
   - Calculate strength when password changes

6. **Implement strength calculation function**
   - Create calculatePasswordStrength function
   - Accept password string parameter
   - Return strength result object

7. **Define strength criteria**
   - Length check: 8+ chars (25 points)
   - Uppercase letters: present (20 points)
   - Lowercase letters: present (20 points)
   - Numbers: present (20 points)
   - Special characters: present (15 points)
   - Total possible: 100 points

8. **Implement scoring logic**
   - Start with score of 0
   - Add points for each criterion met
   - Calculate percentage (0-100)
   - Determine strength level from score

9. **Define strength levels mapping**
   - 0-25: Weak (red)
   - 26-50: Fair (orange)
   - 51-75: Good (yellow)
   - 76-100: Strong (green)

10. **Structure meter display**
    - Add container div with proper spacing
    - Include Progress bar component
    - Display strength label text
    - Add color coding

11. **Configure Progress component**
    - Set value to calculated score
    - Apply color based on strength level
    - Animate transitions
    - Set appropriate height

12. **Add strength label**
    - Display text beside or below progress bar
    - Show strength level ("Weak", "Fair", "Good", "Strong")
    - Color code text to match progress bar
    - Update in real-time

13. **Add conditional rendering**
    - Show meter only when password length > 0
    - Hide when password field is empty
    - Provide smooth transitions

14. **Add styling**
    - Apply spacing around meter
    - Color code strength levels
    - Add smooth transitions
    - Ensure responsive design

### Password Strength Meter Structure

```
┌────────────────────────────────────┐
│ Password                           │
│ ┌────────────────────────────────┐ │
│ │ 🔒 MyPass123         [👁]     │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ ████████░░░░░░░░░░░░  Good    │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| password | string | Current password value |
| className | string | Additional CSS classes |

### Strength Levels

| Level | Score | Color | Label |
|-------|-------|-------|-------|
| Weak | 0-25 | Red | Weak |
| Fair | 26-50 | Orange | Fair |
| Good | 51-75 | Yellow | Good |
| Strong | 76-100 | Green | Strong |

### Scoring Criteria

| Criterion | Points | Description |
|-----------|--------|-------------|
| Length 8+ | 25 | Minimum 8 characters |
| Uppercase | 20 | Contains A-Z |
| Lowercase | 20 | Contains a-z |
| Numbers | 20 | Contains 0-9 |
| Special | 15 | Contains !@#$%^&* |
| **Total** | **100** | Maximum score |

### Strength Calculation Example

```
Password: "Hello123"
├─ Length 8+: ✓ (25 points)
├─ Uppercase: ✓ (20 points)
├─ Lowercase: ✓ (20 points)
├─ Numbers: ✓ (20 points)
├─ Special: ✗ (0 points)
└─ Total: 85 points → Strong

Password: "hello"
├─ Length 8+: ✗ (0 points)
├─ Uppercase: ✗ (0 points)
├─ Lowercase: ✓ (20 points)
├─ Numbers: ✗ (0 points)
├─ Special: ✗ (0 points)
└─ Total: 20 points → Weak
```

### Color Coding

| Strength | Tailwind Class | Hex Color |
|----------|---------------|-----------|
| Weak | bg-red-500 | #EF4444 |
| Fair | bg-orange-500 | #F97316 |
| Good | bg-yellow-500 | #EAB308 |
| Strong | bg-green-500 | #22C55E |

### Expected Outcome
- PasswordStrengthMeter component created
- Real-time strength calculation
- Visual progress bar display
- Strength label shown
- Color coding implemented

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/PasswordStrengthMeter.tsx` created
- [ ] Strength calculation function implemented
- [ ] Scoring criteria defined
- [ ] Progress bar displays correctly
- [ ] Strength levels mapped
- [ ] Color coding applied
- [ ] Label text displayed
- [ ] Real-time updates working
- [ ] Conditional rendering implemented

---

## Summary and Next Steps

### Tasks Completed in This Document

✅ **Task 17:** Register page component created  
✅ **Task 18:** Register form with React Hook Form setup  
✅ **Task 19:** Email input field with validation  
✅ **Task 20:** Phone input with +94 Sri Lankan format  
✅ **Task 21:** Email or phone toggle for registration method  
✅ **Task 22:** First name input field  
✅ **Task 23:** Last name input field  
✅ **Task 24:** Password input with visibility toggle  
✅ **Task 25:** Confirm password input with matching validation  
✅ **Task 26:** Password strength meter with real-time feedback

### Component Architecture Overview

```
RegisterPage
    └── RegisterForm (React Hook Form)
        ├── EmailPhoneToggle
        ├── EmailInput (conditional)
        ├── PhoneInput (conditional, +94 format)
        ├── FirstNameInput
        ├── LastNameInput
        ├── PasswordInput
        │   └── PasswordStrengthMeter
        ├── ConfirmPasswordInput
        ├── PasswordRequirements (Task 27)
        ├── TermsCheckbox (Task 28)
        └── Submit Button
```

### Registration Flow State

```
┌─────────────────────────────────────┐
│ Registration Method                 │
│ ┌─────────────────────────────────┐ │
│ │ ● Email    ○ Phone             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Contact Information                 │
│ ┌─────────────────────────────────┐ │
│ │ Email / Phone (based on toggle) │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Personal Information                │
│ ┌──────────────┬──────────────────┐ │
│ │ First Name   │ Last Name        │ │
│ └──────────────┴──────────────────┘ │
│                                     │
│ Security                            │
│ ┌─────────────────────────────────┐ │
│ │ Password [Strength Meter]       │ │
│ │ Confirm Password                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Continue in Task 27-34...]         │
└─────────────────────────────────────┘
```

### What's Next

The next document (02_Tasks-27-34_Validation-Submit-Verify.md) will cover:

- **Task 27:** Password requirements list display
- **Task 28:** Terms of service checkbox
- **Task 29:** Zod validation schema creation
- **Task 30:** Form submission logic
- **Task 31:** Register API service integration
- **Task 32:** Registration success handling
- **Task 33:** Login link for existing users
- **Task 34:** Complete registration flow verification

### Integration Points

The components created in this document integrate with:

1. **React Hook Form** - Form state management
2. **Zod Validation** - Schema validation (Task 29)
3. **API Services** - Registration endpoint (Task 31)
4. **Auth Store** - Token management (Group A)
5. **Storefront Layout** - Page container and styling

### Testing Considerations

When implementing these components, verify:

- [ ] Email input accepts valid email formats
- [ ] Phone input formats as XX XXX XXXX
- [ ] +94 prefix displays correctly
- [ ] Toggle switches between email and phone
- [ ] Name inputs accept text properly
- [ ] Password visibility toggle works
- [ ] Strength meter updates in real-time
- [ ] Confirm password validates matching
- [ ] All fields show validation errors
- [ ] Form is keyboard accessible
- [ ] Mobile responsive layout works

---

**Continue to:** [02_Tasks-27-34_Validation-Submit-Verify.md](02_Tasks-27-34_Validation-Submit-Verify.md)