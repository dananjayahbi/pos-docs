# Tasks 35-44: Login Form and Validation

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** C - Login Flow  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-52_API-Errors-Redirect.md](02_Tasks-45-52_API-Errors-Redirect.md)

---

## Document Overview

This document covers the creation of the customer login page with form components and validation. It establishes the login page structure, creates the login form wrapper with React Hook Form integration, implements a combined email/phone input with auto-detection, creates password input with show/hide toggle, adds remember me checkbox and forgot password link, and implements Zod validation schema with form submission logic.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Login Page | Low | 20 min |
| 36 | Create Login Form | Medium | 30 min |
| 37 | Create Email/Phone Input | Low | 25 min |
| 38 | Create Detect Input Type | Medium | 25 min |
| 39 | Create Password Input | Low | 20 min |
| 40 | Create Show Password Toggle | Low | 15 min |
| 41 | Create Remember Me Checkbox | Low | 15 min |
| 42 | Create Forgot Password Link | Low | 15 min |
| 43 | Create Login Validation | Medium | 25 min |
| 44 | Create Login Submit | Medium | 30 min |

---

## Task 35: Create Login Page

### Overview
Create the customer login page component that serves as the main entry point for customer authentication. This page renders within the storefront authentication layout and displays the login form, social login options (for future implementation), and a link to the registration page for new customers.

### Dependencies
- SubPhase-07 (Storefront Auth Layout) must be complete
- Task 34: Create Auth Layout (from SubPhase-07)
- React Hook Form and Zod validation libraries installed

### Instructions

1. **Navigate to storefront components directory**
   - Go to `frontend/components/storefront/auth/` directory
   - Create a new subdirectory named `Login`
   - This directory will contain all login-related components

2. **Create LoginPage component file**
   - Create `LoginPage.tsx` in `components/storefront/auth/Login/` directory
   - This is the main page component for the login route
   - Set up TypeScript React functional component structure

3. **Define page layout structure**
   - Import AuthCard component from storefront auth layout
   - Create container for login content
   - Plan sections: title, form, divider, social login, register link

4. **Add page heading**
   - Display "Welcome Back" or "Sign In" as main heading
   - Include subtitle text like "Sign in to your account"
   - Style with proper typography (text-2xl, font-bold)

5. **Add login form section**
   - Import LoginForm component (created in Task 36)
   - Render within AuthCard container
   - Ensure proper spacing between sections

6. **Add social login placeholder**
   - Add divider with "Or continue with" text
   - Add placeholder section for social login buttons
   - Note: Implementation in future group/phase

7. **Add register link section**
   - Add text: "Don't have an account?"
   - Add link to registration page: "Sign up"
   - Style link with brand color and hover effect

8. **Implement responsive design**
   - Ensure proper spacing on mobile and desktop
   - Center content appropriately
   - Test on various screen sizes

### Page Structure

```
┌─────────────────────────────────────┐
│           Welcome Back              │
│      Sign in to your account        │
│                                     │
│   ┌───────────────────────────┐   │
│   │     LoginForm             │   │
│   │   (Email/Phone)           │   │
│   │   (Password)              │   │
│   │   (Remember Me)           │   │
│   │   (Forgot Password)       │   │
│   │   [Sign In Button]        │   │
│   └───────────────────────────┘   │
│                                     │
│   ────── Or continue with ──────   │
│                                     │
│   [Google] [Facebook] (Future)     │
│                                     │
│   Don't have an account? Sign up   │
└─────────────────────────────────────┘
```

### Page Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Title and subtitle | Page identification |
| Form | LoginForm component | Main authentication |
| Divider | "Or continue with" | Section separator |
| Social | Social login buttons | Alternative login (future) |
| Register Link | "Sign up" link | New user registration |

### Component Composition

| Component | Source | Purpose |
|-----------|--------|---------|
| AuthCard | Storefront layout | Card wrapper |
| LoginForm | Task 36 | Login form |
| RegisterLink | Task 51 | Registration navigation |

### Heading Specifications

| Element | Value | Purpose |
|---------|-------|---------|
| Main Title | "Welcome Back" | Friendly greeting |
| Subtitle | "Sign in to your account" | Context |
| Title Style | `text-2xl font-bold` | Prominence |
| Subtitle Style | `text-gray-600` | Secondary text |

### Expected Outcome
- Complete login page component with proper structure
- Login form integrated within AuthCard
- Page heading with title and subtitle
- Register link for new users
- Ready for social login integration (future)

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/LoginPage.tsx` created
- [ ] Page renders within AuthCard component
- [ ] Heading with title and subtitle displayed
- [ ] LoginForm component integrated
- [ ] Register link implemented
- [ ] Responsive design on mobile and desktop
- [ ] Component exports properly

---

## Task 36: Create Login Form

### Overview
Create the LoginForm component that wraps all login form elements using React Hook Form. This component manages form state, validation, submission, and error handling. It integrates the email/phone input, password input, remember me checkbox, forgot password link, and submit button.

### Dependencies
- Task 35: Create Login Page
- React Hook Form installed and configured
- Zod validation library available

### Instructions

1. **Create LoginForm component file**
   - Create `LoginForm.tsx` in `components/storefront/auth/Login/` directory
   - Set up React functional component with TypeScript

2. **Import React Hook Form dependencies**
   - Import `useForm` hook from react-hook-form
   - Import `zodResolver` for Zod integration
   - Import validation schema (created in Task 43)

3. **Define form data interface**
   - Create `LoginFormData` interface
   - Include fields: identifier (string), password (string), rememberMe (boolean)
   - Export interface for use in other components

4. **Initialize React Hook Form**
   - Call `useForm` hook with generic type `LoginFormData`
   - Configure with zodResolver and validation schema
   - Set default values (rememberMe: false)

5. **Create form submit handler**
   - Define `onSubmit` function with form data parameter
   - Add loading state management
   - Connect to submit logic (Task 44)

6. **Build form JSX structure**
   - Use HTML form element with onSubmit
   - Integrate EmailPhoneInput (Task 37)
   - Integrate PasswordInput (Task 39)
   - Integrate RememberMe checkbox (Task 41)
   - Integrate ForgotPasswordLink (Task 42)

7. **Add submit button**
   - Create submit button with proper styling
   - Show loading state during submission
   - Disable button when loading
   - Display "Sign In" or loading spinner text

8. **Implement error display**
   - Show form-level errors above submit button
   - Display field-level errors below inputs
   - Use error component or styling from design system

### Form Data Structure

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| identifier | string | "" | Email or phone number |
| password | string | "" | User password |
| rememberMe | boolean | false | Extended session flag |

### Form Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| mode | "onBlur" | Validate on blur |
| resolver | zodResolver(loginSchema) | Zod validation |
| defaultValues | See above | Initial form state |

### Form Layout Structure

```
<form>
  ┌─────────────────────────────┐
  │  EmailPhoneInput            │
  │  (identifier field)         │
  └─────────────────────────────┘
  
  ┌─────────────────────────────┐
  │  PasswordInput              │
  │  (password field)           │
  └─────────────────────────────┘
  
  ┌──────────┐  ┌──────────────┐
  │RememberMe│  │ForgotPassword│
  └──────────┘  └──────────────┘
  
  ┌─────────────────────────────┐
  │   [Sign In Button]          │
  └─────────────────────────────┘
</form>
```

### Component Integration

| Child Component | Task | Purpose |
|-----------------|------|---------|
| EmailPhoneInput | 37 | Identifier input |
| PasswordInput | 39 | Password entry |
| RememberMe | 41 | Session extension |
| ForgotPasswordLink | 42 | Password recovery |

### Submit Button States

| State | Text | Appearance | Enabled |
|-------|------|------------|---------|
| Idle | "Sign In" | Primary button | Yes |
| Loading | "Signing In..." | With spinner | No |
| Error | "Sign In" | Primary button | Yes |

### Form Submission Flow

```
User fills form
      ↓
Validation triggers (onBlur)
      ↓
User clicks "Sign In"
      ↓
Form validation (Zod schema)
      ↓
   Valid? ──No──→ Show errors
      ↓ Yes
Set loading state
      ↓
Call onSubmit handler
      ↓
(API call in Task 44)
```

### Error Handling

| Error Type | Display Location | Example |
|------------|------------------|---------|
| Field Error | Below input | "Email or phone required" |
| Form Error | Above button | "Invalid credentials" |
| Network Error | Above button | "Connection error" |

### Expected Outcome
- Functional login form with React Hook Form integration
- All form fields integrated and working
- Form validation connected to Zod schema
- Submit button with loading states
- Error display for validation and submission errors

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/LoginForm.tsx` created
- [ ] React Hook Form initialized correctly
- [ ] LoginFormData interface defined
- [ ] All child components integrated
- [ ] Submit button with loading state
- [ ] Error display implemented
- [ ] Form validation working
- [ ] Component exports properly

---

## Task 37: Create Email/Phone Input

### Overview
Create the EmailPhoneInput component that accepts either an email address or phone number as the login identifier. This combined input field provides a user-friendly experience by allowing customers to use their preferred login method without selecting between separate email or phone fields.

### Dependencies
- Task 36: Create Login Form
- React Hook Form Controller available

### Instructions

1. **Create EmailPhoneInput component file**
   - Create `EmailPhoneInput.tsx` in `components/storefront/auth/Login/` directory
   - Set up React functional component with TypeScript

2. **Define component props interface**
   - Create `EmailPhoneInputProps` interface
   - Include React Hook Form control prop
   - Include name prop for field registration
   - Include error prop for validation errors

3. **Import required dependencies**
   - Import Controller from react-hook-form
   - Import Input component from form library
   - Import icon component (Mail icon)

4. **Create input field structure**
   - Use React Hook Form Controller component
   - Wrap controlled input component
   - Set input type to "text" (not email or tel)

5. **Configure input attributes**
   - Set label: "Email or Phone"
   - Set placeholder: "email@example.com or +94771234567"
   - Set name: "identifier"
   - Add Mail icon to input

6. **Add input styling**
   - Apply consistent styling with other form inputs
   - Add proper padding for icon
   - Ensure accessible focus states

7. **Implement error display**
   - Show validation error below input
   - Display error message from form state
   - Apply error styling to input border

8. **Add helpful hints**
   - Consider adding helper text
   - Example: "Enter your email address or phone number"
   - Style as secondary text below input

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| control | Control<LoginFormData> | Yes | React Hook Form control |
| name | string | Yes | Field name ("identifier") |
| error | FieldError | No | Validation error object |

### Input Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "text" | Accept any text format |
| label | "Email or Phone" | Clear field description |
| placeholder | "email@example.com or +94..." | Input examples |
| autoComplete | "username" | Browser autofill |
| required | true | Mark as required |

### Input Layout

```
┌─────────────────────────────────────┐
│ Email or Phone                      │
│ ┌─────────────────────────────────┐ │
│ │ 📧  email@example.com or +94... │ │
│ └─────────────────────────────────┘ │
│ Enter your email or phone number    │
└─────────────────────────────────────┘
```

### Accepted Input Formats

| Format | Example | Valid |
|--------|---------|-------|
| Email | user@example.com | ✓ |
| Email | user.name@domain.co.uk | ✓ |
| Phone (Sri Lanka) | +94771234567 | ✓ |
| Phone (Sri Lanka) | 0771234567 | ✓ |
| Phone (International) | +1234567890 | ✓ |

### Icon Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Icon | Mail | Visual indicator |
| Position | Left side | Prefix position |
| Size | 16px-20px | Proportional |
| Color | text-gray-400 | Subtle appearance |

### Error Display Example

```
┌─────────────────────────────────────┐
│ Email or Phone *                    │
│ ┌─────────────────────────────────┐ │
│ │ 📧  [user input]                │ │ ← Red border
│ └─────────────────────────────────┘ │
│ ⚠️ Please enter email or phone      │ ← Error text
└─────────────────────────────────────┘
```

### Validation States

| State | Border Color | Message |
|-------|--------------|---------|
| Empty | Gray | None (until blur) |
| Valid | Gray/Green | None |
| Invalid | Red | Error message shown |
| Focused | Blue | None |

### Expected Outcome
- Combined email/phone input field
- Proper integration with React Hook Form
- Clear label and helpful placeholder
- Error display for validation failures
- Accessible and user-friendly design

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/EmailPhoneInput.tsx` created
- [ ] Component accepts control and name props
- [ ] Input field with appropriate label
- [ ] Placeholder with examples shown
- [ ] Mail icon displayed
- [ ] Error message displayed when validation fails
- [ ] Proper styling applied
- [ ] Component exports properly

---

## Task 38: Create Detect Input Type

### Overview
Create utility function and logic to automatically detect whether the user has entered an email address or phone number in the identifier field. This detection enables appropriate validation rules and can be used for backend API routing or display purposes.

### Dependencies
- Task 37: Create Email/Phone Input
- Task 43: Create Login Validation

### Instructions

1. **Create utility file for detection**
   - Navigate to `frontend/lib/utils/` or `frontend/utils/` directory
   - Create `inputDetection.ts` file
   - This file will house input detection utilities

2. **Create detectInputType function**
   - Define function that accepts input string
   - Return type: "email" | "phone" | "unknown"
   - Export function for use in components

3. **Implement email detection logic**
   - Check if input contains "@" symbol
   - Verify "@" is not at start or end
   - Consider as email if "@" present

4. **Implement phone detection logic**
   - Check if input starts with "+" (international format)
   - Check if input starts with "0" (Sri Lanka local format)
   - Check if input contains only digits (after removing + and spaces)
   - Verify minimum length (10 digits for Sri Lanka)

5. **Handle edge cases**
   - Empty string → "unknown"
   - Only special characters → "unknown"
   - Partial input during typing → detect in progress

6. **Create validation helper functions**
   - `isLikelyEmail(input: string): boolean`
   - `isLikelyPhone(input: string): boolean`
   - Use regex patterns for accurate detection

7. **Add Sri Lanka specific phone detection**
   - Detect "+94" prefix (Sri Lanka country code)
   - Detect "07" prefix (Sri Lanka mobile)
   - Validate Sri Lanka phone number format (10 digits)

8. **Export detection utilities**
   - Export main `detectInputType` function
   - Export helper functions
   - Add JSDoc comments for documentation

### Detection Logic Flow

```
Input received
      ↓
Contains "@" ? ──Yes──→ EMAIL
      ↓ No
Starts with "+" or "0" ? ──Yes──→ PHONE
      ↓ No
All digits ? ──Yes──→ PHONE
      ↓ No
      UNKNOWN
```

### Detection Rules

| Pattern | Input Type | Example |
|---------|-----------|---------|
| Contains @ | Email | user@example.com |
| Starts with + | Phone | +94771234567 |
| Starts with 0 | Phone | 0771234567 |
| All digits | Phone | 771234567 |
| Mixed chars | Unknown | abc123 |

### Phone Number Patterns (Sri Lanka)

| Format | Pattern | Example | Valid |
|--------|---------|---------|-------|
| International | +94XXXXXXXXX | +94771234567 | ✓ |
| Local Mobile | 07XXXXXXXX | 0771234567 | ✓ |
| Without prefix | 7XXXXXXXX | 771234567 | ✓ |
| Landline | 01XXXXXXXX | 0112345678 | ✓ |

### Email Detection Patterns

| Pattern | Example | Valid |
|---------|---------|-------|
| Standard | user@domain.com | ✓ |
| Subdomain | user@mail.domain.com | ✓ |
| Plus addressing | user+tag@domain.com | ✓ |
| Hyphen | user-name@domain.com | ✓ |
| Dots | user.name@domain.co.uk | ✓ |

### Function Signatures

```typescript
// Main detection function
detectInputType(input: string): "email" | "phone" | "unknown"

// Helper functions
isLikelyEmail(input: string): boolean
isLikelyPhone(input: string): boolean
isValidSriLankaPhone(phone: string): boolean
normalizePhoneNumber(phone: string): string
```

### Detection Examples

| Input | Detected As | Reason |
|-------|-------------|--------|
| john@example.com | email | Contains @ |
| +94771234567 | phone | Starts with + |
| 0771234567 | phone | Starts with 0 |
| 771234567 | phone | All digits |
| john123 | unknown | Mixed, no @ or + |
| @test | unknown | @ at start |

### Usage in Validation

```typescript
// In validation schema or component
const inputType = detectInputType(identifier);

if (inputType === "email") {
  // Apply email validation
} else if (inputType === "phone") {
  // Apply phone validation
} else {
  // Show generic error
}
```

### Integration Points

| Component/File | Usage | Purpose |
|----------------|-------|---------|
| LoginForm | Real-time detection | Show appropriate validation |
| Zod Schema | Validation rules | Apply correct format check |
| API Service | Request formatting | Send correct field name |
| Display | User feedback | Show detected type |

### Expected Outcome
- Utility function that accurately detects email vs phone
- Support for Sri Lanka phone number formats
- Helper functions for validation
- Clear return types for type safety

### Verification Checklist
- [ ] `frontend/lib/utils/inputDetection.ts` created
- [ ] `detectInputType` function implemented
- [ ] Email detection logic working
- [ ] Phone detection logic working
- [ ] Sri Lanka phone formats supported
- [ ] Helper functions exported
- [ ] Edge cases handled
- [ ] TypeScript types defined

---

## Task 39: Create Password Input

### Overview
Create the PasswordInput component that provides a secure password entry field for the login form. This component masks the password by default and will integrate with the show/hide toggle (Task 40) to allow users to reveal their password when needed.

### Dependencies
- Task 36: Create Login Form
- React Hook Form Controller available

### Instructions

1. **Create PasswordInput component file**
   - Create `PasswordInput.tsx` in `components/storefront/auth/Login/` directory
   - Set up React functional component with TypeScript

2. **Define component props interface**
   - Create `PasswordInputProps` interface
   - Include React Hook Form control prop
   - Include name prop for field registration
   - Include error prop for validation errors
   - Include showPassword prop (boolean)
   - Include onTogglePassword prop (function)

3. **Import required dependencies**
   - Import Controller from react-hook-form
   - Import Input component from form library
   - Import icon component (Lock icon)

4. **Create password input field**
   - Use React Hook Form Controller component
   - Set input type to "password" (initially)
   - Toggle type based on showPassword prop

5. **Configure input attributes**
   - Set label: "Password"
   - Set placeholder: "Enter your password"
   - Set name: "password"
   - Add Lock icon as prefix
   - Set autoComplete: "current-password"

6. **Add toggle button slot**
   - Create slot for ShowPasswordToggle component (Task 40)
   - Position toggle button on right side of input
   - Pass showPassword state and toggle function

7. **Implement error display**
   - Show validation error below input
   - Display error message from form state
   - Apply error styling to input border

8. **Add security features**
   - Prevent autocomplete suggestions (optional)
   - Add paste prevention (optional, for security)
   - Consider password strength indicator (future)

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| control | Control<LoginFormData> | Yes | React Hook Form control |
| name | string | Yes | Field name ("password") |
| error | FieldError | No | Validation error object |
| showPassword | boolean | No | Password visibility state |
| onTogglePassword | () => void | No | Toggle visibility function |

### Input Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "password" or "text" | Mask/show password |
| label | "Password" | Field label |
| placeholder | "Enter your password" | Input hint |
| autoComplete | "current-password" | Browser autofill |
| required | true | Mark as required |

### Input Layout

```
┌─────────────────────────────────────┐
│ Password *                          │
│ ┌─────────────────────────────────┐ │
│ │ 🔒  •••••••••           👁️      │ │
│ └─────────────────────────────────┘ │
│   ↑ Lock icon        ↑ Toggle       │
└─────────────────────────────────────┘
```

### Password Visibility States

| State | Input Type | Display | Icon |
|-------|-----------|---------|------|
| Hidden | password | ••••••• | Eye |
| Visible | text | MyPass123 | EyeOff |

### Icon Specifications

| Icon | Position | Purpose | Color |
|------|----------|---------|-------|
| Lock | Left (prefix) | Security indicator | text-gray-400 |
| Eye/EyeOff | Right (suffix) | Toggle visibility | text-gray-400 |

### Input States

| State | Border | Icon | Behavior |
|-------|--------|------|----------|
| Default | Gray | Lock | Type masked |
| Focused | Blue | Lock | Type based on state |
| Error | Red | Lock | Show error message |
| Filled | Gray | Lock | Value masked/shown |

### Error Display Example

```
┌─────────────────────────────────────┐
│ Password *                          │
│ ┌─────────────────────────────────┐ │
│ │ 🔒  •••••                       │ │ ← Red border
│ └─────────────────────────────────┘ │
│ ⚠️ Password is required             │ ← Error text
└─────────────────────────────────────┘
```

### Security Considerations

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Type masking | type="password" | Hide characters |
| No maxLength | Unlimited input | Support long passwords |
| Autocomplete | "current-password" | Browser integration |
| Copy/paste | Allow | User convenience |

### Integration with Toggle

```typescript
// Parent component manages state
const [showPassword, setShowPassword] = useState(false);

// Pass to PasswordInput
<PasswordInput
  control={control}
  name="password"
  showPassword={showPassword}
  onTogglePassword={() => setShowPassword(!showPassword)}
/>
```

### Expected Outcome
- Secure password input field with masking
- Lock icon for visual security indication
- Integration point for show/hide toggle
- Error display for validation failures
- Proper React Hook Form integration

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/PasswordInput.tsx` created
- [ ] Component accepts all required props
- [ ] Password masking works correctly
- [ ] Lock icon displayed
- [ ] Toggle button slot prepared
- [ ] Error messages displayed
- [ ] AutoComplete configured
- [ ] Component exports properly

---

## Task 40: Create Show Password Toggle

### Overview
Create the ShowPasswordToggle component that provides a clickable button to toggle password visibility in the PasswordInput component. This enhances user experience by allowing users to verify their password entry while maintaining security by default.

### Dependencies
- Task 39: Create Password Input

### Instructions

1. **Create ShowPasswordToggle component file**
   - Create `ShowPasswordToggle.tsx` in `components/storefront/auth/Login/` directory
   - Set up React functional component with TypeScript

2. **Define component props interface**
   - Create `ShowPasswordToggleProps` interface
   - Include showPassword prop (boolean)
   - Include onToggle prop (function)
   - Optional: include className prop

3. **Import required dependencies**
   - Import icon components (Eye and EyeOff from Lucide)
   - Import button component or use HTML button
   - Import any utility classes

4. **Create toggle button element**
   - Use button element with type="button"
   - Ensure it doesn't trigger form submission
   - Add onClick handler to call onToggle prop

5. **Implement icon switching logic**
   - Show Eye icon when password is hidden
   - Show EyeOff icon when password is visible
   - Conditionally render based on showPassword prop

6. **Apply button styling**
   - Make button transparent or subtle
   - Position within input field (absolute positioning)
   - Add hover effect for interactivity
   - Ensure proper size (not too large)

7. **Add accessibility features**
   - Add aria-label: "Show password" or "Hide password"
   - Ensure keyboard accessible (tabbable)
   - Add proper focus indicators
   - Consider aria-pressed state

8. **Implement visual feedback**
   - Change icon color on hover
   - Add transition animation for icon change
   - Ensure sufficient contrast ratios

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| showPassword | boolean | Yes | Current visibility state |
| onToggle | () => void | Yes | Toggle function |
| className | string | No | Additional CSS classes |

### Icon States

| State | Icon | Aria Label | Meaning |
|-------|------|-----------|---------|
| Hidden (false) | Eye | "Show password" | Password is masked |
| Visible (true) | EyeOff | "Hide password" | Password is visible |

### Button Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Type | button | Prevent form submission |
| Position | Absolute right | Inside input field |
| Padding | p-2 | Click target size |
| Background | Transparent | Blend with input |
| Hover | bg-gray-100 | Visual feedback |

### Toggle Button Layout

```
┌──────────────────────────────┐
│ Password input field     [👁️] │ ← Toggle button
└──────────────────────────────┘
```

### Visual States

| State | Icon Color | Background | Cursor |
|-------|-----------|------------|--------|
| Default | text-gray-400 | transparent | pointer |
| Hover | text-gray-600 | bg-gray-100 | pointer |
| Active | text-gray-700 | bg-gray-200 | pointer |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| aria-label | Dynamic text | Screen reader description |
| role | "button" | Semantic meaning |
| tabindex | Default (0) | Keyboard navigation |
| focus-visible | Visible ring | Focus indicator |

### Aria Label Logic

```typescript
const ariaLabel = showPassword 
  ? "Hide password" 
  : "Show password";
```

### Click Behavior Flow

```
User clicks toggle
      ↓
onToggle() called
      ↓
Parent updates showPassword state
      ↓
Icon changes (Eye ↔ EyeOff)
      ↓
Input type changes (password ↔ text)
```

### Integration Example

```typescript
// In LoginForm component
const [showPassword, setShowPassword] = useState(false);

// In PasswordInput
<div className="relative">
  <input type={showPassword ? "text" : "password"} />
  <ShowPasswordToggle 
    showPassword={showPassword}
    onToggle={() => setShowPassword(!showPassword)}
  />
</div>
```

### Icon Transition

| Property | Value | Purpose |
|----------|-------|---------|
| Transition | all 0.2s ease | Smooth change |
| Opacity | Fade in/out | Gentle appearance |
| Transform | Optional scale | Subtle emphasis |

### Expected Outcome
- Clickable button to toggle password visibility
- Eye/EyeOff icons switch based on state
- Proper positioning within password input
- Accessible for keyboard and screen readers
- Smooth visual transitions

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/ShowPasswordToggle.tsx` created
- [ ] Component accepts showPassword and onToggle props
- [ ] Eye icon shows when password hidden
- [ ] EyeOff icon shows when password visible
- [ ] Button doesn't submit form
- [ ] Aria-label updates correctly
- [ ] Hover effects applied
- [ ] Keyboard accessible
- [ ] Component exports properly

---

## Task 41: Create Remember Me Checkbox

### Overview
Create the RememberMe checkbox component that allows users to opt into extended session duration. When checked, the authentication tokens will have longer expiry times, keeping users logged in across browser sessions. This component integrates with React Hook Form for state management.

### Dependencies
- Task 36: Create Login Form
- React Hook Form Controller available

### Instructions

1. **Create RememberMe component file**
   - Create `RememberMe.tsx` in `components/storefront/auth/Login/` directory
   - Set up React functional component with TypeScript

2. **Define component props interface**
   - Create `RememberMeProps` interface
   - Include React Hook Form control prop
   - Include name prop for field registration

3. **Import required dependencies**
   - Import Controller from react-hook-form
   - Import Checkbox component from form library
   - Import any label components

4. **Create checkbox input field**
   - Use React Hook Form Controller component
   - Wrap controlled checkbox component
   - Set field name to "rememberMe"

5. **Configure checkbox attributes**
   - Set label text: "Remember me"
   - Set default value: false (unchecked)
   - Set type: checkbox

6. **Add checkbox styling**
   - Apply consistent styling with design system
   - Ensure proper size (not too small)
   - Add hover and focus states
   - Match brand colors when checked

7. **Position in form layout**
   - Place checkbox in same row as Forgot Password link
   - Align to left side of form
   - Ensure proper spacing

8. **Add optional tooltip or info**
   - Consider adding info icon with explanation
   - Tooltip text: "Stay signed in for 30 days"
   - Help users understand the feature

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| control | Control<LoginFormData> | Yes | React Hook Form control |
| name | string | Yes | Field name ("rememberMe") |

### Checkbox Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | checkbox | Boolean input |
| label | "Remember me" | User-facing text |
| defaultValue | false | Unchecked by default |
| name | rememberMe | Form field name |

### Layout Position

```
┌─────────────────────────────────────┐
│ [✓] Remember me    Forgot password? │
│  ↑ Checkbox         ↑ Link          │
└─────────────────────────────────────┘
```

### Checkbox States

| State | Visual | Behavior |
|-------|--------|----------|
| Unchecked | Empty box | Default, shorter session |
| Checked | Box with checkmark | Extended session |
| Hover | Subtle border change | Interactive feedback |
| Focused | Visible focus ring | Keyboard accessible |

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Size | 16px × 16px | Proportional |
| Border | border border-gray-300 | Visible boundary |
| Checked | bg-blue-600 | Brand color |
| Label spacing | ml-2 | Text separation |

### Session Duration Impact

| Remember Me | Access Token | Refresh Token | Total Session |
|-------------|-------------|---------------|---------------|
| Unchecked | 15 min | 7 days | ~7 days |
| Checked | 15 min | 30 days | ~30 days |

### Checkbox Behavior

```
User checks box
      ↓
Form state updates (rememberMe: true)
      ↓
Form submits
      ↓
Backend receives rememberMe flag
      ↓
Backend sets longer refresh token expiry
      ↓
User stays logged in longer
```

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Label | <label> element | Clickable text |
| for attribute | Match checkbox id | Associate label |
| aria-checked | Boolean state | Screen reader state |
| keyboard | Space to toggle | Keyboard access |

### Integration with Form

```typescript
// In LoginForm component
const { control } = useForm<LoginFormData>({
  defaultValues: {
    identifier: "",
    password: "",
    rememberMe: false // Default unchecked
  }
});

// In form JSX
<div className="flex items-center justify-between">
  <RememberMe control={control} name="rememberMe" />
  <ForgotPasswordLink />
</div>
```

### Optional Tooltip Content

| Element | Text |
|---------|------|
| Tooltip title | "Remember me" |
| Tooltip body | "Keep me signed in for 30 days" |
| Tooltip icon | Info icon (optional) |

### Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Shared devices | Warn users in help text |
| Token security | Handled by backend |
| User choice | Default unchecked |
| Clear session | Provide logout button |

### Expected Outcome
- Checkbox component integrated with form
- "Remember me" label clearly visible
- Proper form state management
- Accessible for keyboard and screen readers
- Visual feedback for different states

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/RememberMe.tsx` created
- [ ] Component accepts control and name props
- [ ] Checkbox renders with correct label
- [ ] Default value is false (unchecked)
- [ ] Checkbox state updates in form
- [ ] Properly positioned with ForgotPasswordLink
- [ ] Accessible and keyboard navigable
- [ ] Component exports properly

---

## Task 42: Create Forgot Password Link

### Overview
Create the ForgotPasswordLink component that provides a link to the password reset flow. This link is positioned alongside the Remember Me checkbox and directs users to the forgot password page when they cannot remember their credentials.

### Dependencies
- Task 36: Create Login Form
- Password reset page route (from Group D)

### Instructions

1. **Create ForgotPasswordLink component file**
   - Create `ForgotPasswordLink.tsx` in `components/storefront/auth/Login/` directory
   - Set up React functional component with TypeScript

2. **Import required dependencies**
   - Import Link component from Next.js
   - Import any utility classes or styling

3. **Define component props (optional)**
   - Create `ForgotPasswordLinkProps` interface if customization needed
   - Consider className prop for styling flexibility
   - Props may be minimal or none

4. **Create link element**
   - Use Next.js Link component for navigation
   - Set href to forgot password page
   - Set link text: "Forgot password?"

5. **Apply link styling**
   - Use brand color (text-blue-600)
   - Add hover effect (hover:text-blue-700)
   - Add underline on hover (hover:underline)
   - Set font size (text-sm)

6. **Position in form layout**
   - Place link in same row as Remember Me checkbox
   - Align to right side of form
   - Ensure proper spacing and alignment

7. **Add accessibility features**
   - Ensure proper focus indicators
   - Add descriptive aria-label if needed
   - Ensure sufficient contrast ratios

### Component Props (Optional)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | No | Additional CSS classes |

### Link Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| href | /forgot-password | Password reset page |
| text | "Forgot password?" | Clear call to action |
| target | Same window | Default navigation |

### Layout Position

```
┌─────────────────────────────────────┐
│ [✓] Remember me    Forgot password? │
│                     ↑ Link          │
└─────────────────────────────────────┘
```

### Link Styling

| State | Text Color | Decoration | Cursor |
|-------|-----------|------------|--------|
| Default | text-blue-600 | none | pointer |
| Hover | text-blue-700 | underline | pointer |
| Focus | text-blue-600 | none | pointer |
| Visited | text-blue-600 | none | pointer |

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font size | text-sm | Slightly smaller |
| Color | text-blue-600 | Brand color |
| Hover | hover:underline | Interactive feedback |
| Focus ring | ring-blue-600 | Accessibility |

### Navigation Flow

```
User clicks link
      ↓
Navigate to /forgot-password
      ↓
User enters email/phone
      ↓
Password reset email sent
      ↓
(Password reset flow in Group D)
```

### Integration with Remember Me

```typescript
// In LoginForm component
<div className="flex items-center justify-between mb-4">
  <RememberMe control={control} name="rememberMe" />
  <ForgotPasswordLink />
</div>
```

### Responsive Behavior

| Screen Size | Layout | Alignment |
|-------------|--------|-----------|
| Mobile | Same row | Justified |
| Tablet | Same row | Justified |
| Desktop | Same row | Justified |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Focus ring | focus-visible:ring-2 | Keyboard navigation |
| Contrast | WCAG AA compliant | Readability |
| Text size | Minimum 12px | Legibility |
| Target size | Minimum 44×44px | Touch friendly |

### Alternative Text Options

| Option | Use Case |
|--------|----------|
| "Forgot password?" | Default (question form) |
| "Forgot your password?" | More personal |
| "Reset password" | Direct action |
| "Can't access your account?" | Alternative phrasing |

### Expected Outcome
- Clickable link to forgot password page
- Proper positioning with Remember Me checkbox
- Brand-consistent styling with hover effects
- Accessible for keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Login/ForgotPasswordLink.tsx` created
- [ ] Link uses Next.js Link component
- [ ] Href points to /forgot-password
- [ ] Link text is clear: "Forgot password?"
- [ ] Styling matches brand colors
- [ ] Hover effects applied
- [ ] Positioned correctly with RememberMe
- [ ] Accessible and keyboard navigable
- [ ] Component exports properly

---

## Task 43: Create Login Validation

### Overview
Create the Zod validation schema for the login form that validates the identifier (email or phone) and password fields. This schema ensures data integrity before submission and provides user-friendly error messages. It integrates with React Hook Form through zodResolver.

### Dependencies
- Task 36: Create Login Form
- Task 38: Create Detect Input Type
- Zod validation library installed

### Instructions

1. **Create validation schema file**
   - Navigate to `frontend/lib/validations/` directory
   - Create `loginSchema.ts` file
   - This file will house the login validation schema

2. **Import required dependencies**
   - Import `z` from "zod"
   - Import `detectInputType` utility (Task 38)
   - Import any custom validators

3. **Define base form schema**
   - Create Zod object schema for LoginFormData
   - Include identifier field validation
   - Include password field validation
   - Include rememberMe field validation

4. **Implement identifier validation**
   - Require non-empty string
   - Use refine() for custom validation
   - Detect input type (email or phone)
   - Apply appropriate validation based on type

5. **Implement email validation**
   - Use Zod email validation if input is email
   - Check for valid email format
   - Provide error message: "Please enter a valid email"

6. **Implement phone validation**
   - Validate phone number format if input is phone
   - Support Sri Lanka formats (+94, 07, etc.)
   - Provide error message: "Please enter a valid phone number"

7. **Implement password validation**
   - Require non-empty string
   - Set minimum length (6 characters)
   - Optional: check for maximum length
   - Provide error message: "Password must be at least 6 characters"

8. **Implement rememberMe validation**
   - Set as optional boolean
   - Default value: false
   - No specific validation rules needed

9. **Define custom error messages**
   - Create clear, user-friendly messages
   - Avoid technical jargon
   - Guide users to correct input

10. **Export schema and types**
    - Export validation schema
    - Export inferred TypeScript type
    - Export for use in form component

### Schema Structure

```typescript
// Schema definition
const loginSchema = z.object({
  identifier: z.string()
    .min(1, "Email or phone is required")
    .refine(/* validation logic */),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false)
});

// Type inference
type LoginFormData = z.infer<typeof loginSchema>;
```

### Identifier Validation Logic

| Input Type | Validation | Error Message |
|-----------|------------|---------------|
| Empty | Required | "Email or phone is required" |
| Email | Valid email format | "Please enter a valid email" |
| Phone | Valid phone format | "Please enter a valid phone number" |
| Unknown | Format check | "Please enter a valid email or phone" |

### Email Validation Rules

| Rule | Check | Example |
|------|-------|---------|
| Format | Contains @ | user@example.com |
| Domain | Has domain | @example.com |
| TLD | Has extension | .com, .lk |
| Length | Min 3 chars | a@b.c |

### Phone Validation Rules (Sri Lanka)

| Format | Pattern | Example | Valid |
|--------|---------|---------|-------|
| International | +94XXXXXXXXX | +94771234567 | ✓ |
| Local mobile | 07XXXXXXXX | 0771234567 | ✓ |
| Without prefix | 7XXXXXXXX | 771234567 | ✓ |
| Length | 9-12 digits | Varies | ✓ |

### Password Validation Rules

| Rule | Requirement | Error Message |
|------|------------|---------------|
| Required | Non-empty | "Password is required" |
| Min length | ≥ 6 chars | "Password must be at least 6 characters" |
| Max length | ≤ 128 chars | "Password is too long" |

### Error Messages

| Field | Condition | Message |
|-------|-----------|---------|
| identifier | Empty | "Email or phone is required" |
| identifier | Invalid email | "Please enter a valid email" |
| identifier | Invalid phone | "Please enter a valid phone number" |
| password | Empty | "Password is required" |
| password | Too short | "Password must be at least 6 characters" |

### Custom Refine Logic

```typescript
// Identifier validation with type detection
identifier: z.string()
  .min(1, "Email or phone is required")
  .refine((val) => {
    const type = detectInputType(val);
    
    if (type === "email") {
      return z.string().email().safeParse(val).success;
    } else if (type === "phone") {
      return isValidPhone(val);
    }
    
    return false;
  }, {
    message: "Please enter a valid email or phone number"
  })
```

### Integration with React Hook Form

```typescript
// In LoginForm component
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/loginSchema";

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    identifier: "",
    password: "",
    rememberMe: false
  }
});
```

### Validation Trigger Points

| Trigger | When | Purpose |
|---------|------|---------|
| onBlur | Field loses focus | Real-time feedback |
| onSubmit | Form submission | Final validation |
| onChange | After first error | Continuous validation |

### Type Safety

```typescript
// Exported type for use in components
export type LoginFormData = z.infer<typeof loginSchema>;

// Usage in components
const onSubmit = (data: LoginFormData) => {
  // data is fully typed
  console.log(data.identifier); // string
  console.log(data.password); // string
  console.log(data.rememberMe); // boolean | undefined
};
```

### Expected Outcome
- Complete Zod validation schema for login form
- Email and phone validation with auto-detection
- Password validation with minimum length
- Clear, user-friendly error messages
- Type-safe form data structure

### Verification Checklist
- [ ] `frontend/lib/validations/loginSchema.ts` created
- [ ] Zod schema defined with all fields
- [ ] Identifier validation with type detection
- [ ] Email validation rules implemented
- [ ] Phone validation rules implemented
- [ ] Password validation rules implemented
- [ ] RememberMe field included
- [ ] Error messages are user-friendly
- [ ] Schema and type exported
- [ ] Integration with React Hook Form tested

---

## Task 44: Create Login Submit

### Overview
Create the login submission handler that processes the validated form data, prepares it for API submission, manages loading states, and handles the response flow. This function connects the form validation (Task 43) with the API service (Task 45) and coordinates the login flow.

### Dependencies
- Task 43: Create Login Validation
- Task 36: Create Login Form
- Task 38: Create Detect Input Type

### Instructions

1. **Create submit handler in LoginForm**
   - Define `onSubmit` function in LoginForm component
   - Accept validated form data as parameter
   - Type parameter with LoginFormData interface

2. **Add loading state management**
   - Create `isLoading` state with useState
   - Set loading to true at start of submission
   - Set loading to false after completion or error
   - Disable form inputs during loading

3. **Prepare submission data**
   - Detect input type (email or phone)
   - Format data for API consumption
   - Create request payload object

4. **Format identifier based on type**
   - If email detected: send as `email` field
   - If phone detected: normalize and send as `phone` field
   - Include both identifier types in payload structure

5. **Include password and rememberMe**
   - Add password to payload
   - Add rememberMe flag to payload
   - Ensure data matches API expectations

6. **Call login API service**
   - Import loginService (Task 45)
   - Call loginService.login() with payload
   - Await response
   - Handle async operation with try-catch

7. **Handle successful response**
   - Extract tokens from response (Task 46)
   - Store tokens securely
   - Trigger success redirect (Task 49)
   - Show success message (optional)

8. **Handle error response**
   - Catch errors from API call
   - Parse error response (Task 47)
   - Display appropriate error message
   - Keep form editable for retry

9. **Add form reset logic (optional)**
   - Clear password field on error
   - Keep identifier for retry
   - Reset form state as needed

### Submit Handler Signature

```typescript
const onSubmit = async (data: LoginFormData) => {
  // Implementation
};
```

### Loading State Management

| State | Value | Form State | Button State |
|-------|-------|------------|--------------|
| Idle | false | Editable | Enabled |
| Loading | true | Disabled | Disabled, shows spinner |
| Success | false | N/A (redirecting) | N/A |
| Error | false | Editable | Enabled |

### Data Preparation Flow

```
Form data received
      ↓
Detect identifier type
      ↓
    Email? ──Yes──→ { email: identifier, ... }
      ↓ No
    Phone? ──Yes──→ { phone: normalizePhone(identifier), ... }
      ↓
Create payload with password & rememberMe
      ↓
Call API service
```

### Request Payload Structure

```typescript
// If email detected
{
  email: string,
  password: string,
  rememberMe: boolean
}

// If phone detected
{
  phone: string, // normalized format
  password: string,
  rememberMe: boolean
}
```

### Phone Number Normalization

| Input | Normalized | Format |
|-------|-----------|--------|
| +94771234567 | +94771234567 | Keep as is |
| 0771234567 | +94771234567 | Add country code |
| 771234567 | +94771234567 | Add prefix & code |

### Submission Flow

```
onSubmit triggered
      ↓
Set isLoading = true
      ↓
Prepare payload
      ↓
Call loginService.login(payload)
      ↓
    Success? ──No──→ Handle error (Task 47)
      ↓ Yes
Handle token response (Task 46)
      ↓
Redirect to destination (Task 49)
      ↓
Set isLoading = false
```

### Error Handling Strategy

| Error Type | Action | User Feedback |
|-----------|--------|---------------|
| Validation | Show field errors | Red text below input |
| Network | Show general error | "Connection error" |
| 401 | Show auth error | "Invalid credentials" |
| 429 | Show rate limit | "Too many attempts" |
| 500 | Show server error | "Server error. Try again." |

### Loading State UI

| Element | Idle State | Loading State |
|---------|-----------|---------------|
| Submit Button | "Sign In" | "Signing In..." + spinner |
| Form Inputs | Enabled | Disabled |
| Links | Enabled | Disabled (optional) |

### Integration with Form

```typescript
// In LoginForm component
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const onSubmit = async (data: LoginFormData) => {
  setIsLoading(true);
  setError(null);
  
  try {
    // Detect type and prepare payload
    const inputType = detectInputType(data.identifier);
    const payload = {
      ...(inputType === "email" 
        ? { email: data.identifier } 
        : { phone: normalizePhone(data.identifier) }
      ),
      password: data.password,
      rememberMe: data.rememberMe
    };
    
    // Call API
    const response = await loginService.login(payload);
    
    // Handle success (Task 46, 49)
    handleTokenResponse(response);
    
  } catch (err) {
    // Handle error (Task 47)
    handleLoginError(err);
    
  } finally {
    setIsLoading(false);
  }
};
```

### Success Response Handling

| Step | Action | Next Task |
|------|--------|----------|
| 1 | Receive tokens | Task 46 |
| 2 | Store tokens | Task 46 |
| 3 | Update auth state | Task 46 |
| 4 | Determine redirect | Task 49 |
| 5 | Navigate | Task 49 |

### Password Field Behavior on Error

| Error Type | Password Field Action |
|-----------|---------------------|
| Invalid credentials | Clear password |
| Network error | Keep password |
| Validation error | Keep password |
| Rate limit | Clear password |

### Expected Outcome
- Complete submit handler with loading states
- Data preparation with type detection
- Integration with API service (placeholder)
- Error handling structure
- Form state management during submission

### Verification Checklist
- [ ] onSubmit handler implemented in LoginForm
- [ ] isLoading state managed correctly
- [ ] Input type detection working
- [ ] Request payload prepared correctly
- [ ] Phone normalization implemented
- [ ] API service called (placeholder for Task 45)
- [ ] Success handling prepared (for Task 46)
- [ ] Error handling prepared (for Task 47)
- [ ] Form disabled during loading
- [ ] Submit button shows loading state

---

## Summary

This document established the complete login form structure with validation. It created the login page and form components, implemented combined email/phone input with auto-detection, added password input with show/hide toggle, included remember me checkbox and forgot password link, and implemented comprehensive Zod validation with form submission logic.

### Completed Tasks
1. ✓ Created login page component with proper structure
2. ✓ Created login form with React Hook Form integration
3. ✓ Created combined email/phone input field
4. ✓ Implemented input type detection utility
5. ✓ Created password input field with masking
6. ✓ Created show/hide password toggle button
7. ✓ Created remember me checkbox
8. ✓ Created forgot password link
9. ✓ Implemented Zod validation schema
10. ✓ Created form submission handler with loading states

### Next Steps
Proceed to [02_Tasks-45-52_API-Errors-Redirect.md](02_Tasks-45-52_API-Errors-Redirect.md) to create the login API service, implement token response handling, create comprehensive error handling, and implement success redirect with checkout return logic.

