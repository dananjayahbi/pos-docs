# Tasks 19-27: Information Page, Contact, and Personal Sections

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** B - Step 1 - Information  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-28-34_Validation-Store-Verify.md](02_Tasks-28-34_Validation-Store-Verify.md)

---

## Document Overview

This document covers the creation of the information page (Step 1) in the checkout flow. It establishes the page structure with two main sections: contact information (email, phone, WhatsApp) and personal information (first and last name). The implementation includes React Hook Form integration, Sri Lanka-specific phone formatting (+94), and a login prompt for existing customers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create Information Page | Low | 20 min |
| 20 | Create Contact Section | Low | 25 min |
| 21 | Create Email Input | Low | 15 min |
| 22 | Create Phone Input | Medium | 30 min |
| 23 | Create WhatsApp Checkbox | Low | 15 min |
| 24 | Create Login Prompt | Low | 15 min |
| 25 | Create Personal Info Section | Low | 20 min |
| 26 | Create First Name Input | Low | 15 min |
| 27 | Create Last Name Input | Low | 15 min |

---

## Task 19: Create Information Page

### Overview
Create the InformationStep component that serves as the main page for checkout step 1. This component orchestrates the contact and personal information sections, integrates with React Hook Form for state management, and handles navigation to the next checkout step. The page layout follows a card-based design consistent with the checkout flow.

### Dependencies
- Task 18: Create Navigation Guards (from Group A)
- React Hook Form installed and configured
- Checkout layout component exists
- Checkout store structure defined (Task 09 from Group A)

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `InformationStep.tsx`
   - Set up as a client component using "use client" directive

2. **Import required dependencies**
   - Import React Hook Form utilities (useForm, FormProvider)
   - Import checkout store hook (useCheckoutStore)
   - Import child components (ContactSection, PersonalInfoSection)
   - Import UI components (Button, Card)
   - Import navigation utilities from Next.js

3. **Define form interface**
   - Create TypeScript interface for information form data
   - Include fields: email, phone, whatsappOptIn, firstName, lastName
   - Ensure type safety across all form fields

4. **Initialize form with React Hook Form**
   - Set up useForm hook with proper typing
   - Configure default values from checkout store
   - Set up validation mode (onChange recommended)

5. **Create three-section layout structure**
   - Section 1: Contact information section
   - Section 2: Personal information section
   - Section 3: Continue to shipping button

6. **Implement form submission handler**
   - Define onSubmit function to handle form data
   - Save data to checkout store
   - Navigate to shipping step (/checkout/shipping)
   - Include error handling for navigation

7. **Wrap sections in FormProvider**
   - Use FormProvider to share form context
   - Pass form methods to child components
   - Enable field-level validation

### Page Structure

```
┌─────────────────────────────────────────┐
│     CHECKOUT - Step 1 of 3              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  CONTACT INFORMATION              │ │
│  │  ───────────────────              │ │
│  │  [Email Input]                    │ │
│  │  [Phone Input]                    │ │
│  │  [☑] WhatsApp updates             │ │
│  │  Already have an account? Log in  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  PERSONAL INFORMATION             │ │
│  │  ────────────────────             │ │
│  │  [First Name Input]               │ │
│  │  [Last Name Input]                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Continue to Shipping →]              │
└─────────────────────────────────────────┘
```

### Component Structure

| Element | Type | Purpose |
|---------|------|---------|
| FormProvider | Context | Share form state with children |
| ContactSection | Component | Email, phone, WhatsApp, login |
| PersonalInfoSection | Component | First and last name inputs |
| Button | Component | Submit form and navigate |

### Form Data Flow

```
User Input
    ↓
React Hook Form
    ↓
Validation (Task 28)
    ↓
Checkout Store (Task 32)
    ↓
Navigation to Shipping
```

### State Management

| Data | Source | Purpose |
|------|--------|---------|
| Form Values | React Hook Form | Current input state |
| Store Values | Checkout Store | Persisted data |
| Validation | Zod Schema (Task 28) | Field validation |

### Expected Outcome
- Functional information page component
- Integrated with React Hook Form
- Two distinct sections for contact and personal info
- Continue button navigates to shipping step
- Form state managed properly

### Verification Checklist
- [ ] `InformationStep.tsx` component created
- [ ] React Hook Form integrated
- [ ] Form interface defined with TypeScript
- [ ] ContactSection and PersonalInfoSection rendered
- [ ] Continue button submits and navigates
- [ ] FormProvider wraps child components
- [ ] Default values loaded from store
- [ ] Page renders without errors

---

## Task 20: Create Contact Section

### Overview
Create the ContactSection component that groups all contact-related input fields. This component includes email and phone inputs, WhatsApp opt-in checkbox, and a login prompt for returning customers. It provides a clean, organized interface for collecting customer contact information with proper labels and spacing.

### Dependencies
- Task 19: Create Information Page

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `ContactSection.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import child components (EmailInput, PhoneInput, WhatsAppCheckbox, LoginPrompt)
   - Import UI components (Card, CardContent, CardHeader, CardTitle)
   - Import any icons or utilities needed

3. **Create section structure**
   - Add section title "Contact Information"
   - Group all contact fields in a card or section container
   - Ensure proper spacing between fields

4. **Render child components in order**
   - EmailInput component (Task 21)
   - PhoneInput component (Task 22)
   - WhatsAppCheckbox component (Task 23)
   - LoginPrompt component (Task 24)

5. **Apply consistent styling**
   - Use Tailwind CSS for spacing
   - Apply gap between fields (gap-4 recommended)
   - Ensure responsive design for mobile devices

6. **Add section description (optional)**
   - Include helper text if needed
   - Explain purpose of contact information
   - Keep description concise

### Section Layout

```
┌─────────────────────────────────────┐
│  CONTACT INFORMATION                │
│  ───────────────────                │
│                                     │
│  Email                              │
│  ┌─────────────────────────────┐   │
│  │ your.email@example.com      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Phone number                       │
│  ┌───┬─────────────────────────┐   │
│  │+94│ 7X XXX XXXX             │   │
│  └───┴─────────────────────────┘   │
│                                     │
│  ☑ Send order updates via WhatsApp │
│                                     │
│  Already have an account? Log in   │
└─────────────────────────────────────┘
```

### Component Hierarchy

```
ContactSection
├── SectionTitle ("Contact Information")
├── EmailInput
├── PhoneInput
├── WhatsAppCheckbox
└── LoginPrompt
```

### Field Organization

| Field | Component | Required | Order |
|-------|-----------|----------|-------|
| Email | EmailInput | Yes | 1 |
| Phone | PhoneInput | Yes | 2 |
| WhatsApp | WhatsAppCheckbox | No | 3 |
| Login | LoginPrompt | - | 4 |

### Spacing Guidelines

| Element | Spacing | Tailwind Class |
|---------|---------|----------------|
| Section Title | Bottom margin | `mb-4` |
| Between Fields | Vertical gap | `gap-4` |
| Section Padding | All sides | `p-6` |
| Mobile Padding | Reduced | `p-4 sm:p-6` |

### Expected Outcome
- Clean contact information section
- All contact fields grouped logically
- Proper spacing and visual hierarchy
- Responsive layout for mobile and desktop

### Verification Checklist
- [ ] `ContactSection.tsx` component created
- [ ] Section title displayed correctly
- [ ] EmailInput component rendered
- [ ] PhoneInput component rendered
- [ ] WhatsAppCheckbox component rendered
- [ ] LoginPrompt component rendered
- [ ] Proper spacing between elements
- [ ] Responsive on mobile devices

---

## Task 21: Create Email Input

### Overview
Create the EmailInput component for collecting customer email addresses. This input field integrates with React Hook Form, includes email-specific HTML attributes for proper keyboard behavior on mobile devices, and provides autocomplete functionality. The field is marked as required and will be validated in Task 28.

### Dependencies
- Task 20: Create Contact Section
- React Hook Form configured in parent

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `EmailInput.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import React Hook Form utilities (useFormContext, Controller)
   - Import UI input components (Input, Label, FormField)
   - Import any icon components if needed

3. **Access form context**
   - Use useFormContext hook to access form methods
   - Extract register, control, and formState
   - Access field errors for display

4. **Create input field structure**
   - Add label with "Email" text
   - Mark field as required with asterisk or indicator
   - Add input field with proper attributes

5. **Configure input attributes**
   - Set type to "email" for HTML5 validation
   - Add placeholder text "your.email@example.com"
   - Set autocomplete attribute to "email"
   - Set autoCapitalize to "none"
   - Set inputMode to "email" for mobile keyboards

6. **Register field with React Hook Form**
   - Use register or Controller for form integration
   - Set field name as "email"
   - Validation will be handled in Task 28

7. **Add error message display**
   - Show validation errors below input
   - Style error text in red color
   - Only display when field has been touched

### Input Structure

```
Email *
┌─────────────────────────────────────┐
│ your.email@example.com              │
└─────────────────────────────────────┘
[Error message displays here if invalid]
```

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | email | HTML5 email validation |
| name | email | Form field identifier |
| placeholder | your.email@example.com | Example format |
| autocomplete | email | Browser autofill |
| autoCapitalize | none | No auto-capitalization |
| inputMode | email | Email keyboard on mobile |
| required | true | Field is mandatory |

### Mobile Keyboard Optimization

```
inputMode="email"
    ↓
Shows email-optimized keyboard
    ↓
Includes @ and . keys prominently
    ↓
Better user experience on mobile
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | Associated with input via htmlFor |
| Required | Indicated visually and semantically |
| Error | Announced to screen readers |
| Autocomplete | Helps users with saved data |

### Expected Outcome
- Functional email input field
- Integrated with React Hook Form
- Proper HTML attributes for mobile UX
- Autocomplete enabled
- Ready for validation in Task 28

### Verification Checklist
- [ ] `EmailInput.tsx` component created
- [ ] Label displays "Email" with required indicator
- [ ] Input type set to "email"
- [ ] Placeholder text shows example
- [ ] Autocomplete attribute configured
- [ ] Field registered with React Hook Form
- [ ] Error message area prepared
- [ ] Mobile keyboard optimized

---

## Task 22: Create Phone Input

### Overview
Create the PhoneInput component with Sri Lanka-specific formatting (+94 XX XXX XXXX). This component includes a fixed country code prefix, formatted input mask for the local number portion, and validation for Sri Lankan mobile numbers. The implementation ensures proper display on mobile devices and prevents users from modifying the +94 prefix.

### Dependencies
- Task 20: Create Contact Section
- React Hook Form configured in parent

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `PhoneInput.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import React Hook Form utilities (useFormContext, Controller)
   - Import UI input components (Input, Label, FormField)
   - Import input masking library if used (e.g., react-input-mask)
   - Import phone icon if needed

3. **Access form context**
   - Use useFormContext hook
   - Extract control, setValue, and formState
   - Access phone field errors

4. **Create input structure with prefix**
   - Add label with "Phone number" text
   - Mark field as required
   - Create container for prefix and input
   - Add fixed "+94" prefix (non-editable)

5. **Implement phone number formatting**
   - Apply mask pattern: XX XXX XXXX
   - Format as user types (e.g., 77 123 4567)
   - Remove spaces before saving to form state
   - Only allow numeric input after prefix

6. **Configure input attributes**
   - Set type to "tel" for mobile optimization
   - Add placeholder "7X XXX XXXX"
   - Set inputMode to "numeric" for number keyboard
   - Set maxLength to prevent over-entry

7. **Handle input value changes**
   - Format input as user types
   - Store clean value (digits only) in form
   - Display formatted value to user
   - Handle paste events properly

8. **Add validation preparation**
   - Register field with React Hook Form
   - Set field name as "phone"
   - Validation rules will be added in Task 28

### Phone Input Layout

```
Phone number *
┌───┬─────────────────────────────────┐
│+94│ 7X XXX XXXX                     │
└───┴─────────────────────────────────┘
 ↑     ↑
Fixed  User Input
```

### Format Pattern

| Input Stage | Display | Stored Value |
|-------------|---------|--------------|
| Typing "7" | +94 7 | 7 |
| Typing "77" | +94 77 | 77 |
| Typing "771" | +94 77 1 | 771 |
| Typing "7712" | +94 77 12 | 7712 |
| Typing "77123" | +94 77 123 | 77123 |
| Complete | +94 77 123 4567 | 771234567 |

### Sri Lanka Mobile Format

```
+94 XX XXX XXXX
│   │  │   │
│   │  │   └─ Last 4 digits
│   │  └───── Middle 3 digits
│   └──────── First 2 digits (operator)
└──────────── Country code (fixed)
```

### Valid Number Patterns

| Pattern | Operator | Example |
|---------|----------|---------|
| 70 XXX XXXX | Mobitel | +94 70 123 4567 |
| 71 XXX XXXX | Mobitel | +94 71 234 5678 |
| 72 XXX XXXX | Hutch | +94 72 345 6789 |
| 75 XXX XXXX | Airtel | +94 75 456 7890 |
| 76 XXX XXXX | Dialog | +94 76 567 8901 |
| 77 XXX XXXX | Dialog | +94 77 678 9012 |
| 78 XXX XXXX | Hutch | +94 78 789 0123 |

### Input Masking Options

| Approach | Library | Complexity |
|----------|---------|------------|
| Manual | Custom hooks | Medium |
| React Input Mask | react-input-mask | Low |
| React Number Format | react-number-format | Low |
| Custom Component | DIY | High |

### Mobile Optimization

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | tel | Indicates phone number |
| inputMode | numeric | Shows number keyboard |
| pattern | [0-9]* | Restricts to numbers |
| maxLength | 12 | Prevents over-entry |
| placeholder | 7X XXX XXXX | Shows format |

### Expected Outcome
- Phone input with fixed +94 prefix
- Formatted input (XX XXX XXXX)
- Numeric keyboard on mobile
- Clean value storage (digits only)
- Ready for Sri Lanka phone validation

### Verification Checklist
- [ ] `PhoneInput.tsx` component created
- [ ] +94 prefix displayed and non-editable
- [ ] Input formatted as XX XXX XXXX
- [ ] Only numeric input allowed
- [ ] Placeholder shows example format
- [ ] Mobile keyboard optimized (numeric)
- [ ] Field registered with React Hook Form
- [ ] Value stored without formatting characters
- [ ] Error message area prepared

---

## Task 23: Create WhatsApp Checkbox

### Overview
Create the WhatsAppCheckbox component to allow customers to opt in for order updates via WhatsApp. This checkbox is checked by default (as WhatsApp is the primary communication channel in Sri Lanka) and includes the WhatsApp icon for visual recognition. The component integrates with React Hook Form and is linked to the phone number field.

### Dependencies
- Task 22: Create Phone Input
- React Hook Form configured in parent

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `WhatsAppCheckbox.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import React Hook Form utilities (useFormContext, Controller)
   - Import UI checkbox components (Checkbox, Label)
   - Import WhatsApp icon (lucide-react or custom SVG)

3. **Access form context**
   - Use useFormContext hook
   - Extract control and register
   - Access whatsappOptIn field state

4. **Create checkbox structure**
   - Add checkbox input element
   - Add label text "Send order updates via WhatsApp"
   - Include WhatsApp icon next to label
   - Ensure proper alignment

5. **Configure checkbox behavior**
   - Set field name as "whatsappOptIn"
   - Set defaultChecked to true (opt-in by default)
   - Register with React Hook Form
   - Make checkbox optional (not required)

6. **Add visual styling**
   - Use WhatsApp brand color (#25D366) for checked state
   - Show icon in brand color when checked
   - Ensure sufficient click/tap target size
   - Add hover state for desktop

7. **Create accessible label**
   - Associate label with checkbox
   - Ensure clickable label toggles checkbox
   - Add descriptive text about WhatsApp updates

### Checkbox Layout

```
┌───┬─────────────────────────────────────────┐
│ ☑ │  Send order updates via WhatsApp       │
└───┴─────────────────────────────────────────┘
 ↑              ↑
Checkbox    Label with icon
```

### Checkbox States

| State | Visual | Description |
|-------|--------|-------------|
| Checked | ☑ Green | User will receive WhatsApp updates |
| Unchecked | ☐ Gray | User won't receive WhatsApp updates |
| Hover | Background highlight | Interactive feedback |
| Disabled | ☐ Light gray | Not available |

### WhatsApp Branding

| Element | Color | Usage |
|---------|-------|-------|
| Icon | #25D366 | WhatsApp brand green |
| Checkbox (checked) | #25D366 | Brand consistency |
| Text | Default | Standard text color |

### Form Integration

```
whatsappOptIn: boolean
    ↓
Default: true
    ↓
Stored in Checkout Store
    ↓
Used for order notifications
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Label Association | htmlFor attribute matches input id |
| Keyboard Navigation | Tab to focus, Space to toggle |
| Screen Reader | Descriptive label text |
| Focus Indicator | Visible outline on focus |
| Touch Target | Minimum 44x44 pixels |

### Expected Outcome
- Functional WhatsApp opt-in checkbox
- Checked by default
- WhatsApp icon displayed
- Integrated with React Hook Form
- Accessible and mobile-friendly

### Verification Checklist
- [ ] `WhatsAppCheckbox.tsx` component created
- [ ] Checkbox renders correctly
- [ ] Label displays "Send order updates via WhatsApp"
- [ ] WhatsApp icon included
- [ ] Default state is checked (true)
- [ ] Field registered as "whatsappOptIn"
- [ ] Checkbox toggles on click/tap
- [ ] Label click toggles checkbox
- [ ] WhatsApp brand color applied
- [ ] Accessible via keyboard
- [ ] Sufficient touch target size

---

## Task 24: Create Login Prompt

### Overview
Create the LoginPrompt component that displays a link to the login page for existing customers. This component helps returning customers sign in to autofill their information and access their order history. It includes clear, action-oriented text and proper navigation to the login route.

### Dependencies
- Task 20: Create Contact Section
- Next.js routing configured
- Login page exists (from Phase 07)

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `LoginPrompt.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import Link component from Next.js
   - Import any text or icon components
   - Import styling utilities

3. **Create prompt text structure**
   - Add introductory text "Already have an account?"
   - Add login link with text "Log in"
   - Separate text and link appropriately

4. **Configure login link**
   - Set href to "/login" route
   - Add query parameter to return to checkout after login
   - Use proper Link component for client-side navigation

5. **Add return URL parameter**
   - Include returnUrl or callbackUrl query parameter
   - Set value to current checkout URL
   - Enable redirect back to checkout after login

6. **Apply styling**
   - Use subtle, non-intrusive styling
   - Make link clearly clickable (color, underline)
   - Ensure proper spacing from other elements
   - Use brand color for link

7. **Add hover and focus states**
   - Apply hover effect on link
   - Add focus outline for keyboard navigation
   - Ensure good contrast for accessibility

### Prompt Layout

```
Already have an account? Log in
                        ↑
                    Clickable link
```

### Link Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| href | /login?returnUrl=/checkout/information | Navigate to login |
| Component | Next.js Link | Client-side navigation |
| Target | Same window | Keep in current tab |
| Style | Underlined, colored | Clear affordance |

### Navigation Flow

```
Checkout Information Page
         ↓
    Click "Log in"
         ↓
   Login Page (/login)
         ↓
    User authenticates
         ↓
Redirect to returnUrl
         ↓
Back to Checkout (pre-filled)
```

### Text Variations

| Style | Text |
|-------|------|
| Default | "Already have an account? Log in" |
| Alternative 1 | "Returning customer? Sign in" |
| Alternative 2 | "Have an account? Log in to save time" |

### Styling Guidelines

| Element | Style | Tailwind Classes |
|---------|-------|------------------|
| Container | Center or left align | `text-center` or `text-left` |
| Static Text | Default color | `text-gray-600` |
| Link Text | Brand color | `text-blue-600 hover:text-blue-700` |
| Link Decoration | Underline on hover | `hover:underline` |
| Spacing | Top margin | `mt-4` |

### Expected Outcome
- Clear prompt for existing customers
- Functional link to login page
- Return URL configured for redirect
- Proper styling and hover states
- Accessible via keyboard

### Verification Checklist
- [ ] `LoginPrompt.tsx` component created
- [ ] Text displays "Already have an account?"
- [ ] "Log in" link rendered
- [ ] Link navigates to /login route
- [ ] Return URL parameter included
- [ ] Link styled with brand color
- [ ] Hover state applied
- [ ] Focus indicator visible
- [ ] Spacing from other elements appropriate

---

## Task 25: Create Personal Info Section

### Overview
Create the PersonalInfoSection component that groups the first and last name input fields. This component provides a clear section for collecting the customer's personal identification information, maintaining visual consistency with the contact section. It includes a section title and proper spacing for the name fields.

### Dependencies
- Task 19: Create Information Page

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `PersonalInfoSection.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import child components (FirstNameInput, LastNameInput)
   - Import UI components (Card, CardContent, CardHeader, CardTitle)
   - Import spacing utilities

3. **Create section structure**
   - Add section title "Personal Information"
   - Group name fields in a container
   - Ensure proper spacing between fields

4. **Render child components**
   - FirstNameInput component (Task 26)
   - LastNameInput component (Task 27)
   - Arrange in vertical or horizontal layout

5. **Apply consistent styling**
   - Match styling with ContactSection
   - Use same spacing patterns
   - Ensure responsive design

6. **Choose layout strategy**
   - Option 1: Vertical (mobile-friendly)
   - Option 2: Horizontal on desktop, vertical on mobile
   - Consider form width and readability

### Section Layout (Vertical)

```
┌─────────────────────────────────────┐
│  PERSONAL INFORMATION               │
│  ────────────────────               │
│                                     │
│  First name *                       │
│  ┌─────────────────────────────┐   │
│  │ John                        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Last name *                        │
│  ┌─────────────────────────────┐   │
│  │ Doe                         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Section Layout (Horizontal on Desktop)

```
┌─────────────────────────────────────┐
│  PERSONAL INFORMATION               │
│  ────────────────────               │
│                                     │
│  First name *        Last name *    │
│  ┌─────────────┐    ┌─────────────┐│
│  │ John        │    │ Doe         ││
│  └─────────────┘    └─────────────┘│
└─────────────────────────────────────┘
```

### Component Hierarchy

```
PersonalInfoSection
├── SectionTitle ("Personal Information")
├── FirstNameInput
└── LastNameInput
```

### Layout Options

| Layout | Mobile | Desktop | Pros | Cons |
|--------|--------|---------|------|------|
| Vertical | 1 column | 1 column | Simpler | Takes more space |
| Responsive | 1 column | 2 columns | Space efficient | More complex |

### Responsive Grid (if using horizontal layout)

```html
Tailwind Classes:
- Container: grid grid-cols-1 md:grid-cols-2 gap-4
- FirstNameInput: col-span-1
- LastNameInput: col-span-1

Breakpoints:
- Mobile (< 768px): 1 column
- Desktop (≥ 768px): 2 columns
```

### Spacing Guidelines

| Element | Spacing | Tailwind Class |
|---------|---------|----------------|
| Section Title | Bottom margin | `mb-4` |
| Between Fields (vertical) | Vertical gap | `gap-4` |
| Between Fields (horizontal) | Horizontal gap | `gap-4` |
| Section Padding | All sides | `p-6` |

### Expected Outcome
- Clean personal information section
- First and last name fields grouped
- Consistent styling with contact section
- Responsive layout
- Clear visual hierarchy

### Verification Checklist
- [ ] `PersonalInfoSection.tsx` component created
- [ ] Section title displays "Personal Information"
- [ ] FirstNameInput component rendered
- [ ] LastNameInput component rendered
- [ ] Proper spacing between elements
- [ ] Layout responsive (if applicable)
- [ ] Styling matches ContactSection
- [ ] Section renders without errors

---

## Task 26: Create First Name Input

### Overview
Create the FirstNameInput component for collecting the customer's first name. This input field integrates with React Hook Form, includes proper autocomplete attributes for browser autofill, and provides a clean, accessible interface. The field is marked as required and will be validated in Task 28.

### Dependencies
- Task 25: Create Personal Info Section
- React Hook Form configured in parent

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `FirstNameInput.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import React Hook Form utilities (useFormContext, Controller)
   - Import UI input components (Input, Label, FormField)
   - Import any utilities needed

3. **Access form context**
   - Use useFormContext hook
   - Extract register, control, and formState
   - Access firstName field errors

4. **Create input field structure**
   - Add label with "First name" text
   - Mark field as required
   - Add input field with proper attributes

5. **Configure input attributes**
   - Set type to "text"
   - Add placeholder "John"
   - Set autocomplete to "given-name"
   - Set autoCapitalize to "words" for proper name capitalization
   - Set autoCorrect to "off"

6. **Register field with React Hook Form**
   - Use register or Controller
   - Set field name as "firstName"
   - Validation will be handled in Task 28

7. **Add error message display**
   - Show validation errors below input
   - Style error text in red
   - Display only when field touched

### Input Structure

```
First name *
┌─────────────────────────────────────┐
│ John                                │
└─────────────────────────────────────┘
[Error message displays here if invalid]
```

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | text | Standard text input |
| name | firstName | Form field identifier |
| placeholder | John | Example first name |
| autocomplete | given-name | Browser autofill |
| autoCapitalize | words | Capitalize first letter |
| autoCorrect | off | Prevent auto-correction |
| required | true | Field is mandatory |

### Autocomplete Standards

```
autocomplete="given-name"
    ↓
Browser recognizes first name field
    ↓
Offers saved first names
    ↓
Faster checkout experience
```

### Capitalization Behavior

| Input | With autoCapitalize="words" | Purpose |
|-------|----------------------------|---------|
| john | John | Proper name format |
| mary jane | Mary Jane | Multiple words |
| o'brien | O'Brien | Handles apostrophes |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | Associated with input |
| Required | Indicated visually (*) |
| Error | Screen reader announcement |
| Autocomplete | Standard attribute |

### Expected Outcome
- Functional first name input
- Integrated with React Hook Form
- Proper autocomplete configuration
- Name capitalization enabled
- Ready for validation

### Verification Checklist
- [ ] `FirstNameInput.tsx` component created
- [ ] Label displays "First name" with required indicator
- [ ] Input type set to "text"
- [ ] Placeholder shows example
- [ ] Autocomplete set to "given-name"
- [ ] autoCapitalize set to "words"
- [ ] Field registered with React Hook Form
- [ ] Error message area prepared
- [ ] Input accepts text properly

---

## Task 27: Create Last Name Input

### Overview
Create the LastNameInput component for collecting the customer's last name. This input field mirrors the FirstNameInput component with appropriate autocomplete attributes for the last name field. It integrates with React Hook Form and provides a consistent user experience with the first name field.

### Dependencies
- Task 25: Create Personal Info Section
- React Hook Form configured in parent

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/storefront/checkout/Information/` directory
   - Create new file named `LastNameInput.tsx`
   - Set up as a client component

2. **Import required dependencies**
   - Import React Hook Form utilities (useFormContext, Controller)
   - Import UI input components (Input, Label, FormField)
   - Import any utilities needed

3. **Access form context**
   - Use useFormContext hook
   - Extract register, control, and formState
   - Access lastName field errors

4. **Create input field structure**
   - Add label with "Last name" text
   - Mark field as required
   - Add input field with proper attributes

5. **Configure input attributes**
   - Set type to "text"
   - Add placeholder "Doe"
   - Set autocomplete to "family-name"
   - Set autoCapitalize to "words"
   - Set autoCorrect to "off"

6. **Register field with React Hook Form**
   - Use register or Controller
   - Set field name as "lastName"
   - Validation will be handled in Task 28

7. **Add error message display**
   - Show validation errors below input
   - Style error text in red
   - Display only when field touched

8. **Ensure consistency with FirstNameInput**
   - Match styling exactly
   - Use same spacing
   - Apply same validation patterns

### Input Structure

```
Last name *
┌─────────────────────────────────────┐
│ Doe                                 │
└─────────────────────────────────────┘
[Error message displays here if invalid]
```

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | text | Standard text input |
| name | lastName | Form field identifier |
| placeholder | Doe | Example last name |
| autocomplete | family-name | Browser autofill |
| autoCapitalize | words | Capitalize first letter |
| autoCorrect | off | Prevent auto-correction |
| required | true | Field is mandatory |

### Autocomplete Standards

```
autocomplete="family-name"
    ↓
Browser recognizes last name field
    ↓
Offers saved last names
    ↓
Paired with given-name for full autofill
```

### Name Field Pairing

| Field | Autocomplete | Example |
|-------|--------------|---------|
| First Name | given-name | John |
| Last Name | family-name | Doe |
| Full Name | name | John Doe |

### Consistency with FirstNameInput

| Aspect | Both Fields |
|--------|-------------|
| Styling | Identical |
| Spacing | Same margins/padding |
| Validation | Same patterns |
| Error Display | Same format |
| Autocapitalize | "words" |
| Autocorrect | "off" |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | Associated with input |
| Required | Indicated visually (*) |
| Error | Screen reader announcement |
| Autocomplete | Standard attribute |

### Expected Outcome
- Functional last name input
- Integrated with React Hook Form
- Consistent with first name input
- Proper autocomplete configuration
- Ready for validation

### Verification Checklist
- [ ] `LastNameInput.tsx` component created
- [ ] Label displays "Last name" with required indicator
- [ ] Input type set to "text"
- [ ] Placeholder shows example
- [ ] Autocomplete set to "family-name"
- [ ] autoCapitalize set to "words"
- [ ] Field registered with React Hook Form
- [ ] Error message area prepared
- [ ] Styling matches FirstNameInput
- [ ] Input accepts text properly

---

## Summary and Next Steps

### What We've Built

This document covered the creation of the information page (Step 1) with comprehensive contact and personal information sections:

**Page Structure (Task 19):**
- Main InformationStep component
- React Hook Form integration
- Two-section layout with continue button

**Contact Section (Tasks 20-24):**
- ContactSection container
- Email input with HTML5 validation
- Phone input with +94 Sri Lanka formatting
- WhatsApp opt-in checkbox (default checked)
- Login prompt for returning customers

**Personal Info Section (Tasks 25-27):**
- PersonalInfoSection container
- First name input with proper autocomplete
- Last name input with proper autocomplete

### Key Implementation Points

| Component | Key Features |
|-----------|-------------|
| InformationStep | Form provider, navigation, store integration |
| ContactSection | Email, phone, WhatsApp, login grouping |
| EmailInput | Email type, autocomplete, validation ready |
| PhoneInput | +94 prefix, XX XXX XXXX format, numeric input |
| WhatsAppCheckbox | Default checked, brand color, optional |
| LoginPrompt | Return URL, clear CTA, accessible |
| PersonalInfoSection | Name fields grouping, responsive layout |
| FirstNameInput | given-name autocomplete, word capitalization |
| LastNameInput | family-name autocomplete, consistent styling |

### Complete File Structure

```
frontend/components/storefront/checkout/Information/
├── InformationStep.tsx          # Main page component
├── ContactSection.tsx            # Contact fields container
├── EmailInput.tsx                # Email field
├── PhoneInput.tsx                # Phone field with +94
├── WhatsAppCheckbox.tsx          # WhatsApp opt-in
├── LoginPrompt.tsx               # Login link
├── PersonalInfoSection.tsx       # Personal fields container
├── FirstNameInput.tsx            # First name field
├── LastNameInput.tsx             # Last name field
└── index.ts                      # Barrel export
```

### Integration Points for Next Document

The next document (Tasks 28-34) will add:

1. **Form Validation (Task 28):** Zod schema for all fields
2. **Email Validation (Task 29):** Email format rules
3. **Phone Validation (Task 30):** Sri Lanka mobile validation
4. **Error Display (Task 31):** Field-level error messages
5. **Store Save (Task 32):** Persist to checkout store
6. **Pre-fill (Task 33):** Load data for logged-in users
7. **Verification (Task 34):** End-to-end step 1 testing

### Testing Preparation

Before moving to the next document, ensure:
- All components compile without errors
- React Hook Form is properly configured
- All imports are correct
- Components render in the browser
- No console errors or warnings

### Component Export Checklist

Create `index.ts` file to export all components:
- [ ] InformationStep exported
- [ ] ContactSection exported
- [ ] EmailInput exported
- [ ] PhoneInput exported
- [ ] WhatsAppCheckbox exported
- [ ] LoginPrompt exported
- [ ] PersonalInfoSection exported
- [ ] FirstNameInput exported
- [ ] LastNameInput exported

---

## Continue to Next Document

Proceed to [02_Tasks-28-34_Validation-Store-Verify.md](02_Tasks-28-34_Validation-Store-Verify.md) to implement form validation, error handling, store integration, and complete the information step.

---

**Document End** - Tasks 19-27 Complete
