# Tasks 15-23: Login Form and Submission

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** B - Login Page & Form  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-24-30_Success-Error-UX.md](02_Tasks-24-30_Success-Error-UX.md)

---

## Document Overview

This document covers the creation of the login page and form with complete validation and submission logic. It includes setting up the login route, creating Zod validation schema, building the LoginForm component with all input fields, and implementing the authentication submission flow that connects to the backend API.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Login Page Route | Low | 15 min |
| 16 | Create Login Form Schema | Low | 20 min |
| 17 | Create Login Form Component | Medium | 30 min |
| 18 | Add Email Input Field | Low | 15 min |
| 19 | Add Password Input Field | Low | 20 min |
| 20 | Add Remember Me Checkbox | Low | 10 min |
| 21 | Add Forgot Password Link | Low | 10 min |
| 22 | Create Submit Button | Low | 15 min |
| 23 | Implement Login Submission | Medium | 35 min |

---

## Task 15: Create Login Page Route

### Overview
Create the login page route within the (auth) route group. This page serves as the entry point for users to authenticate into the LankaCommerce Cloud ERP system. The page uses the auth layout created in Group A and displays the login form component.

### Dependencies
- Task 14: Verify Auth Layout Structure

### Instructions

1. **Create login directory**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new directory named `login`
   - This follows Next.js App Router convention

2. **Create page component file**
   - Create `page.tsx` file inside `login/` directory
   - This file will be the login page component

3. **Import required dependencies**
   - Import React types
   - Import Metadata type from Next.js
   - Import auth components (AuthCard, AuthHeading)
   - Import LoginForm component (to be created in Task 17)

4. **Define page metadata**
   - Export metadata object with type `Metadata`
   - Set title to "Login"
   - Set description for SEO purposes

5. **Create page component**
   - Define default export function `LoginPage`
   - Return JSX structure using auth components

6. **Implement page structure**
   - Wrap LoginForm in AuthCard component
   - Add AuthHeading with title and subtitle
   - Add link to registration page below form

7. **Configure page styling**
   - Use existing auth layout for centering
   - No additional container needed (layout handles it)

### Page Structure

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │      Welcome Back            │   │
│    │  Sign in to your account     │   │
│    │                              │   │
│    │  [Login Form Component]      │   │
│    │                              │   │
│    │  Don't have an account?      │   │
│    │      [Register Link]         │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/login/page.tsx` | `/login` | Main login page |

### Page Metadata

| Field | Value | Purpose |
|-------|-------|---------|
| title | "Login" | Browser tab title |
| description | "Sign in to your LankaCommerce Cloud account" | SEO description |

### Expected Outcome
- Functional login page accessible at `/login`
- Page uses auth layout with centered content
- Proper metadata for SEO
- Ready to receive LoginForm component

### Verification Checklist
- [ ] `frontend/app/(auth)/login/` directory created
- [ ] `frontend/app/(auth)/login/page.tsx` file created
- [ ] Metadata exported with title and description
- [ ] Page component structure implemented
- [ ] AuthCard and AuthHeading components used
- [ ] Page accessible at `/login` URL

---

## Task 16: Create Login Form Schema

### Overview
Create a Zod validation schema for the login form that defines the structure and validation rules for user credentials. This schema ensures data integrity before submission and provides type safety throughout the application.

### Dependencies
- Task 15: Create Login Page Route

### Instructions

1. **Create validations directory**
   - Navigate to `frontend/lib/` directory
   - Create `validations/` directory if it doesn't exist
   - This will house all form validation schemas

2. **Create login validation file**
   - Create `login.ts` file in `lib/validations/` directory
   - This file will contain login-specific schemas

3. **Import Zod library**
   - Import z from 'zod'
   - Ensure Zod is installed in project dependencies

4. **Define login schema**
   - Create `loginSchema` using `z.object()`
   - Define email field with validation rules
   - Define password field with validation rules
   - Define optional rememberMe field

5. **Configure email validation**
   - Set as required field
   - Add email format validation
   - Add custom error messages for clarity

6. **Configure password validation**
   - Set as required field
   - Add minimum length validation (8 characters)
   - Add custom error messages

7. **Configure remember me validation**
   - Set as optional boolean field
   - Default value: false

8. **Export TypeScript type**
   - Infer TypeScript type from schema
   - Export as `LoginFormData` type
   - Use for type safety in components

### Schema Structure

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Min 8 characters |
| rememberMe | boolean | No | Default: false |

### Validation Rules Detail

```
Email Field:
├── Required: Cannot be empty
├── Format: Must be valid email (user@domain.com)
└── Error Messages:
    ├── Empty: "Email is required"
    └── Invalid: "Please enter a valid email address"

Password Field:
├── Required: Cannot be empty
├── Min Length: At least 8 characters
└── Error Messages:
    ├── Empty: "Password is required"
    └── Too Short: "Password must be at least 8 characters"

Remember Me Field:
├── Optional: Can be omitted
├── Type: Boolean
└── Default: false
```

### Error Message Guidelines

| Type | Message Style | Example |
|------|---------------|---------|
| Required | Direct and clear | "Email is required" |
| Format | Helpful instruction | "Please enter a valid email address" |
| Length | Specific requirement | "Password must be at least 8 characters" |

### Type Safety

| Export | Purpose | Usage |
|--------|---------|-------|
| loginSchema | Runtime validation | Form validation |
| LoginFormData | TypeScript type | Component props, state |

### Schema Usage Flow

```
1. User enters form data
   ↓
2. React Hook Form validates against schema
   ↓
3. If valid: Proceed to submission
   ↓
4. If invalid: Display error messages
```

### Expected Outcome
- Zod schema for login form validation
- TypeScript type for form data
- Clear, user-friendly error messages
- Reusable validation logic

### Verification Checklist
- [ ] `frontend/lib/validations/` directory exists
- [ ] `frontend/lib/validations/login.ts` file created
- [ ] Zod library imported
- [ ] loginSchema defined with all fields
- [ ] Email validation rules configured
- [ ] Password validation rules configured
- [ ] Remember me field defined as optional
- [ ] LoginFormData type exported
- [ ] Custom error messages provided

---

## Task 17: Create Login Form Component

### Overview
Create the LoginForm component that serves as the main authentication form. This component uses React Hook Form with Zod validation to provide a robust, type-safe form experience. It manages form state, validation, and serves as the container for all login form fields.

### Dependencies
- Task 16: Create Login Form Schema

### Instructions

1. **Create LoginForm component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `LoginForm.tsx` file
   - This will be a client component

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for form interactivity and state management

3. **Import required dependencies**
   - Import React hooks (useState, useTransition)
   - Import useForm from react-hook-form
   - Import zodResolver from @hookform/resolvers/zod
   - Import loginSchema and LoginFormData type
   - Import Form components from Shadcn/UI
   - Import auth components and utilities

4. **Set up React Hook Form**
   - Initialize useForm with zodResolver
   - Pass loginSchema to resolver
   - Configure default values for form fields
   - Set validation mode (onChange or onBlur)

5. **Create form state management**
   - Use useState for loading state
   - Use useState for error messages
   - Consider using useTransition for transitions

6. **Define form submission handler**
   - Create onSubmit function (async)
   - Accept validated form data as parameter
   - This will be implemented in Task 23

7. **Implement form structure**
   - Use Shadcn/UI Form component wrapper
   - Pass form methods to Form component
   - Add form element with onSubmit handler

8. **Prepare field containers**
   - Create sections for form fields (Tasks 18-22)
   - Add proper spacing between sections
   - Use FormField components from Shadcn/UI

9. **Add form accessibility**
   - Set proper form attributes
   - Configure ARIA labels
   - Ensure keyboard navigation works

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onSuccess | () => void | No | undefined | Callback after successful login |
| redirectUrl | string | No | "/dashboard" | Redirect destination |

### Form Structure

```
┌─────────────────────────────────────┐
│  [Email Input]                      │ ← Task 18
│                                     │
│  [Password Input]                   │ ← Task 19
│                                     │
│  [ ] Remember me                    │ ← Task 20
│                                     │
│  Forgot password?                   │ ← Task 21
│                                     │
│  [Sign In Button]                   │ ← Task 22
│                                     │
│  ─────────── or ────────────        │
│                                     │
│  [Social Login Buttons]             │
│                                     │
│  [Error Alert]                      │ ← Task 25
└─────────────────────────────────────┘
```

### React Hook Form Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| resolver | zodResolver(loginSchema) | Zod validation |
| mode | "onBlur" or "onChange" | Validation timing |
| defaultValues | { email: "", password: "", rememberMe: false } | Initial state |

### Form State Management

| State | Type | Purpose |
|-------|------|---------|
| isLoading | boolean | Submission state |
| error | string \| null | Error message |
| isPending | boolean | Transition state |

### Form Validation Modes

| Mode | When Validation Runs | Use Case |
|------|---------------------|----------|
| onBlur | After field loses focus | Less intrusive |
| onChange | On every keystroke | Immediate feedback |
| onSubmit | Only on submit | Minimal validation |
| onTouched | After first blur | Balanced approach |

### Form Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Labels | Associated with inputs via htmlFor |
| Error Messages | Announced to screen readers |
| Required Fields | Marked with aria-required |
| Focus Management | Logical tab order |
| Keyboard Submit | Enter key submits form |

### Expected Outcome
- Functional form component with React Hook Form integration
- Zod validation configured
- Form state management in place
- Container ready for form fields (Tasks 18-22)
- Accessibility features implemented

### Verification Checklist
- [ ] `frontend/components/auth/LoginForm.tsx` file created
- [ ] 'use client' directive added
- [ ] React Hook Form initialized with zodResolver
- [ ] loginSchema integrated for validation
- [ ] Default values configured
- [ ] Form state (loading, error) managed
- [ ] Form structure with Shadcn/UI components
- [ ] onSubmit handler defined (stub)
- [ ] Accessibility attributes set
- [ ] Component exports properly

---

## Task 18: Add Email Input Field

### Overview
Add the email input field to the login form with proper validation, error handling, and accessibility features. This field uses FormField from Shadcn/UI and integrates with React Hook Form for automatic validation and state management.

### Dependencies
- Task 17: Create Login Form Component

### Instructions

1. **Create email FormField**
   - Use Shadcn/UI FormField component
   - Control with form.control from React Hook Form
   - Set name prop to "email"

2. **Implement FormItem structure**
   - Wrap input in FormItem component
   - Add FormLabel with text "Email"
   - Add FormControl wrapper for input
   - Add FormMessage for error display

3. **Configure input element**
   - Use Input component from Shadcn/UI
   - Set type attribute to "email"
   - Add placeholder text
   - Set autocomplete to "email"

4. **Add input attributes**
   - Set id for label association
   - Add aria-label for screen readers
   - Configure required attribute
   - Add inputMode="email" for mobile keyboards

5. **Style input field**
   - Apply consistent width (full width)
   - Set appropriate height and padding
   - Ensure proper focus states
   - Match brand styling

6. **Configure validation display**
   - Error messages appear below input automatically
   - Use FormMessage component for errors
   - Errors display in red color
   - Clear, actionable error text

### Email Input Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "email" | HTML5 email validation |
| name | "email" | React Hook Form field name |
| placeholder | "name@company.com" | Example format |
| autocomplete | "email" | Browser autofill |
| inputMode | "email" | Mobile keyboard type |
| required | true | Accessibility |

### Input Structure

```
┌─────────────────────────────────────┐
│  Email *                            │ ← Label
│  ┌───────────────────────────────┐ │
│  │ name@company.com              │ │ ← Input
│  └───────────────────────────────┘ │
│  Please enter a valid email       │ ← Error (if any)
└─────────────────────────────────────┘
```

### Validation States

| State | Display | Styling |
|-------|---------|---------|
| Default | Normal border | border-gray-300 |
| Focus | Blue border | border-blue-500 |
| Valid | Normal border | border-gray-300 |
| Error | Red border, error message | border-red-500 |
| Disabled | Gray background | bg-gray-100 |

### Email Validation Examples

| Input | Valid | Error Message |
|-------|-------|---------------|
| "" | No | "Email is required" |
| "invalid" | No | "Please enter a valid email address" |
| "test@" | No | "Please enter a valid email address" |
| "test@example" | No | "Please enter a valid email address" |
| "test@example.com" | Yes | - |

### Mobile Keyboard Optimization

| Attribute | Mobile Impact |
|-----------|---------------|
| type="email" | Shows @ and .com keys |
| inputMode="email" | Email-optimized keyboard |
| autocomplete="email" | Suggests saved emails |

### Expected Outcome
- Fully functional email input field
- Real-time validation with error messages
- Proper autocomplete and mobile optimization
- Accessible to all users

### Verification Checklist
- [ ] Email FormField added to LoginForm
- [ ] FormLabel displays "Email"
- [ ] Input type set to "email"
- [ ] Placeholder text added
- [ ] Autocomplete configured
- [ ] inputMode set to "email"
- [ ] Required attribute set
- [ ] FormMessage displays validation errors
- [ ] Focus styles work correctly
- [ ] Mobile keyboard shows email layout

---

## Task 19: Add Password Input Field

### Overview
Add the password input field to the login form with show/hide toggle functionality. This field includes proper security attributes, validation, and an eye icon button that allows users to toggle password visibility for easier verification while maintaining security.

### Dependencies
- Task 17: Create Login Form Component

### Instructions

1. **Create password FormField**
   - Use Shadcn/UI FormField component
   - Control with form.control from React Hook Form
   - Set name prop to "password"

2. **Set up show/hide state**
   - Use useState hook for visibility toggle
   - Initial state: false (password hidden)
   - Toggle between "password" and "text" types

3. **Implement FormItem structure**
   - Wrap input in FormItem component
   - Add FormLabel with text "Password"
   - Add FormControl with relative positioning
   - Add FormMessage for error display

4. **Configure password input**
   - Use Input component from Shadcn/UI
   - Set dynamic type (password or text)
   - Add placeholder text
   - Set autocomplete to "current-password"

5. **Add toggle button**
   - Create button for show/hide functionality
   - Position absolutely inside input (right side)
   - Use eye icon (open/closed states)
   - Toggle visibility state on click

6. **Style toggle button**
   - Position on right side of input
   - Apply proper z-index
   - Add hover effects
   - Ensure button doesn't overlap text

7. **Add input attributes**
   - Set id for label association
   - Configure required attribute
   - Add aria-label for accessibility
   - Set minLength if needed

### Password Input Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "password" or "text" | Dynamic visibility |
| name | "password" | React Hook Form field name |
| placeholder | "Enter your password" | Instructional text |
| autocomplete | "current-password" | Browser autofill |
| required | true | Accessibility |
| minLength | 8 | Minimum security |

### Input Structure with Toggle

```
┌─────────────────────────────────────┐
│  Password *                         │ ← Label
│  ┌───────────────────────────────┐ │
│  │ ••••••••••••          [👁]    │ │ ← Input + Toggle
│  └───────────────────────────────┘ │
│  Password must be at least 8...   │ ← Error (if any)
└─────────────────────────────────────┘
```

### Show/Hide Toggle States

| State | Input Type | Icon | Purpose |
|-------|------------|------|---------|
| Hidden | password | Eye | Default secure state |
| Visible | text | Eye-off | Verify input |

### Toggle Button Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Position | absolute right-3 | Inside input |
| Type | button | Prevent form submit |
| Cursor | pointer | Indicate clickable |
| Color | text-gray-500 | Subtle appearance |
| Hover | text-gray-700 | Interactive feedback |

### Password Validation

| Condition | Valid | Error Message |
|-----------|-------|---------------|
| Empty | No | "Password is required" |
| < 8 chars | No | "Password must be at least 8 characters" |
| ≥ 8 chars | Yes | - |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Button Label | aria-label="Toggle password visibility" |
| Input Label | Associated via htmlFor |
| Toggle State | Announce state change to screen readers |
| Focus Order | Toggle button in logical sequence |

### Security Considerations

| Feature | Purpose |
|---------|---------|
| autocomplete="current-password" | Enable password managers |
| No autocomplete="off" | Allow password saving |
| Toggle default off | Start secure |
| Clear after failed attempts | Optional security measure |

### Expected Outcome
- Functional password input with toggle
- Show/hide functionality works smoothly
- Proper validation and error display
- Accessible and secure implementation

### Verification Checklist
- [ ] Password FormField added to LoginForm
- [ ] FormLabel displays "Password"
- [ ] Input type toggles between password and text
- [ ] Toggle button with eye icon added
- [ ] Toggle button positioned correctly
- [ ] Placeholder text added
- [ ] Autocomplete set to "current-password"
- [ ] FormMessage displays validation errors
- [ ] minLength validation works
- [ ] Toggle button is accessible
- [ ] Focus styles work correctly

---

## Task 20: Add Remember Me Checkbox

### Overview
Add a "Remember Me" checkbox to the login form that allows users to stay logged in for extended periods. This optional field uses Shadcn/UI Checkbox component and integrates with React Hook Form for state management.

### Dependencies
- Task 17: Create Login Form Component

### Instructions

1. **Create remember me FormField**
   - Use Shadcn/UI FormField component
   - Control with form.control from React Hook Form
   - Set name prop to "rememberMe"

2. **Implement checkbox structure**
   - Use FormItem with flex layout
   - Add Checkbox component from Shadcn/UI
   - Add FormLabel next to checkbox (not above)
   - Position label to the right of checkbox

3. **Configure checkbox**
   - Set default value to false
   - Bind to form state via React Hook Form
   - Add proper id for label association

4. **Style checkbox and label**
   - Align checkbox and label vertically centered
   - Add appropriate spacing between elements
   - Use smaller font size for label
   - Apply subtle gray color to label text

5. **Add label text**
   - Text: "Remember me"
   - Consider adding tooltip/description
   - Explain functionality if space allows

6. **Configure checkbox behavior**
   - Toggle on click
   - Show checked state visually
   - Update form state automatically

### Remember Me Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| name | "rememberMe" | Form field name |
| type | boolean | Checkbox value |
| defaultValue | false | Unchecked by default |
| required | false | Optional field |

### Checkbox Structure

```
┌────────────────────────────────────┐
│  [ ]  Remember me                  │
└────────────────────────────────────┘
     ↑         ↑
  Checkbox   Label
```

### Layout Options

```
Option A - Inline with Label:
[ ] Remember me

Option B - With Description:
[ ] Remember me
    Keep me signed in for 30 days

Option C - Between Password and Submit:
[Password Input]
[ ] Remember me        [Forgot Password?]
[Submit Button]
```

### Checkbox States

| State | Visual | Behavior |
|-------|--------|----------|
| Unchecked | Empty box | Default state |
| Checked | Box with checkmark | User wants to stay logged in |
| Focus | Focus ring | Keyboard navigation |
| Hover | Background change | Interactive feedback |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| FormItem | `flex flex-row items-center space-x-2` | Horizontal layout |
| Checkbox | Default Shadcn styling | Checkbox appearance |
| FormLabel | `text-sm font-normal cursor-pointer` | Label styling |

### Remember Me Functionality

| Duration | Implementation |
|----------|----------------|
| Without Remember Me | Session token (expires on browser close) |
| With Remember Me | Persistent token (expires in 30 days) |

### Expected Outcome
- Functional remember me checkbox
- Properly integrated with form state
- Clear label and styling
- Accessible checkbox component

### Verification Checklist
- [ ] Remember me FormField added to LoginForm
- [ ] Checkbox component from Shadcn/UI used
- [ ] Checkbox and label aligned horizontally
- [ ] Label text displays "Remember me"
- [ ] Default value is false (unchecked)
- [ ] Checkbox toggles on click
- [ ] Form state updates when checked/unchecked
- [ ] Checkbox is accessible via keyboard
- [ ] Focus styles work correctly

---

## Task 21: Add Forgot Password Link

### Overview
Add a "Forgot Password?" link to the login form that directs users to the password reset flow. This link is positioned near the password field for easy discovery when users can't remember their credentials.

### Dependencies
- Task 17: Create Login Form Component

### Instructions

1. **Determine link placement**
   - Position near password field
   - Option A: Right side of password label
   - Option B: Below password field
   - Option C: Same row as remember me checkbox

2. **Import Next.js Link component**
   - Import Link from 'next/link'
   - Use for client-side navigation

3. **Create link element**
   - Use Next.js Link component
   - Set href to "/forgot-password" (or appropriate route)
   - Add descriptive link text

4. **Style the link**
   - Apply text color (blue or brand color)
   - Add hover effect (darker shade or underline)
   - Set appropriate font size (text-sm)
   - Ensure sufficient contrast for accessibility

5. **Position link in form**
   - Add to form structure after password field
   - Use flexbox for alignment if needed
   - Consider pairing with remember me checkbox

6. **Add accessibility attributes**
   - Ensure link is keyboard accessible
   - Add aria-label if link text isn't descriptive enough
   - Test focus indicators

### Link Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| href | "/forgot-password" | Password reset route |
| text | "Forgot password?" | Clear call to action |
| target | "_self" | Same window navigation |

### Link Placement Options

```
Option A - Right Aligned:
Password *                      Forgot password?
[password input field                         ]

Option B - Below Password:
Password *
[password input field                         ]
Forgot password?

Option C - Same Row as Remember Me:
[ ] Remember me              Forgot password?
```

### Link Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Link | `text-sm text-blue-600 hover:text-blue-800` | Brand styling |
| Link | `hover:underline` | Interactive feedback |
| Link | `font-medium` | Emphasis |
| Link | `transition-colors` | Smooth hover |

### Recommended Layout

```
┌─────────────────────────────────────┐
│  Password *              [Show/Hide]│
│  [password input field            ] │
│                                     │
│  [ ] Remember me    Forgot password?│
└─────────────────────────────────────┘
```

### Link Accessibility

| Feature | Implementation |
|---------|----------------|
| Contrast Ratio | Minimum 4.5:1 |
| Focus Indicator | Visible outline |
| Hover State | Color change or underline |
| Touch Target | Minimum 44x44px |

### Expected Outcome
- Functional link to password reset page
- Properly positioned for easy discovery
- Clear styling with brand colors
- Accessible to all users

### Verification Checklist
- [ ] Forgot password link added to LoginForm
- [ ] Link uses Next.js Link component
- [ ] href points to "/forgot-password" or correct route
- [ ] Link text is clear and descriptive
- [ ] Link positioned logically in form
- [ ] Hover effects work correctly
- [ ] Link color meets contrast requirements
- [ ] Link is keyboard accessible
- [ ] Focus indicator visible

---

## Task 22: Create Submit Button

### Overview
Create the submit button for the login form with loading states, proper styling, and accessibility features. The button displays different states (default, loading, disabled) and provides clear visual feedback to users during the authentication process.

### Dependencies
- Task 17: Create Login Form Component

### Instructions

1. **Import Button component**
   - Import Button from Shadcn/UI
   - Import loading icon (Loader2 or similar)

2. **Create submit button**
   - Use Button component with type="submit"
   - Add button text: "Sign In"
   - Apply full width styling

3. **Implement loading state**
   - Disable button when isLoading is true
   - Show loading spinner when submitting
   - Change button text during loading (optional)

4. **Add loading indicator**
   - Use Loader2 icon with spin animation
   - Position icon before button text
   - Show only when loading

5. **Configure button styling**
   - Use primary variant (brand color)
   - Set full width (w-full)
   - Add appropriate height and padding
   - Ensure sufficient touch target size

6. **Add disabled state**
   - Reduce opacity when disabled
   - Change cursor to not-allowed
   - Prevent click events

7. **Add accessibility attributes**
   - Set aria-label for clarity
   - Add aria-busy during loading
   - Ensure focus styles are visible

### Button Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| type | "submit" | Form submission |
| variant | "default" or "primary" | Brand styling |
| className | "w-full" | Full width |
| disabled | isLoading \|\| !isValid | Prevent duplicate submissions |

### Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | Blue button, "Sign In" | Ready to submit |
| Hover | Darker blue | Interactive feedback |
| Loading | Spinner + "Signing in..." | Submission in progress |
| Disabled | Grayed out | Cannot click |
| Focus | Focus ring visible | Keyboard accessible |

### Button Structure

```
Default State:
┌─────────────────────────────────┐
│          Sign In                │
└─────────────────────────────────┘

Loading State:
┌─────────────────────────────────┐
│  [spinner]  Signing in...       │
└─────────────────────────────────┘

Disabled State:
┌─────────────────────────────────┐
│          Sign In                │ (Grayed)
└─────────────────────────────────┘
```

### Loading Indicator Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Icon | Loader2 | Spinning indicator |
| Animation | animate-spin | Continuous rotation |
| Size | 16px (h-4 w-4) | Proportional to text |
| Position | Before text | Leading position |

### Button Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button | `w-full` | Full width |
| Button | `h-11` or `h-12` | Comfortable height |
| Button | `text-base font-medium` | Readable text |
| Icon | `mr-2 h-4 w-4 animate-spin` | Loading indicator |

### Keyboard Interaction

| Key | Action |
|-----|--------|
| Enter | Submit form (when button focused) |
| Space | Submit form (when button focused) |
| Tab | Move focus to/from button |

### Expected Outcome
- Functional submit button with loading states
- Clear visual feedback during submission
- Properly disabled when form is invalid or submitting
- Accessible via keyboard and screen readers

### Verification Checklist
- [ ] Submit button added to LoginForm
- [ ] Button type set to "submit"
- [ ] Button displays "Sign In" text
- [ ] Full width styling applied
- [ ] Loading state shows spinner
- [ ] Button disabled during submission
- [ ] Button disabled when form invalid
- [ ] Hover effects work correctly
- [ ] Focus styles visible
- [ ] aria-busy attribute set during loading
- [ ] Keyboard submission works (Enter key)

---

## Task 23: Implement Login Submission

### Overview
Implement the form submission logic that sends user credentials to the authentication API, handles the request/response cycle, and manages loading states. This task connects the frontend form to the backend authentication service.

### Dependencies
- Task 22: Create Submit Button

### Instructions

1. **Import authentication service**
   - Import authService from lib/services/auth
   - Ensure service module exists (SubPhase-05)
   - Import necessary types (LoginRequest, LoginResponse)

2. **Implement onSubmit handler**
   - Define async function to handle form submission
   - Accept validated form data as parameter (LoginFormData)
   - Set loading state at beginning

3. **Prepare login request**
   - Extract email and password from form data
   - Format request payload according to API spec
   - Include rememberMe flag if applicable

4. **Make API call**
   - Call authService.login() with credentials
   - Wrap in try-catch block for error handling
   - Use await for async operation

5. **Handle loading state**
   - Set isLoading to true before API call
   - Set isLoading to false after response
   - Use finally block to ensure state is reset

6. **Add request timeout**
   - Implement timeout mechanism (optional)
   - Show timeout error if request takes too long
   - Typical timeout: 30 seconds

7. **Log submission attempts**
   - Log submission start (development only)
   - Log success/failure for debugging
   - Don't log sensitive information (passwords)

### API Request Structure

| Field | Type | Required | Source |
|-------|------|----------|--------|
| email | string | Yes | Form data |
| password | string | Yes | Form data |
| rememberMe | boolean | No | Form data |

### Submission Flow

```
1. User clicks "Sign In"
   ↓
2. Form validates (React Hook Form + Zod)
   ↓
3. If valid: onSubmit called
   ↓
4. Set isLoading = true
   ↓
5. Call authService.login(credentials)
   ↓
6. Wait for API response
   ↓
7. If success: Handle success (Task 24)
   ↓
8. If error: Handle error (Task 25)
   ↓
9. Set isLoading = false
```

### API Response Structure

```
Success Response:
{
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    name: string,
    ...
  },
  tenant: {
    id: string,
    name: string,
    ...
  },
  permissions: string[]
}

Error Response:
{
  error: string,
  message: string,
  statusCode: number
}
```

### Error Types to Handle

| Error Type | Status Code | Cause |
|------------|-------------|-------|
| Invalid Credentials | 401 | Wrong email/password |
| Account Locked | 423 | Too many failed attempts |
| Network Error | - | Connection issues |
| Server Error | 500 | Backend problem |
| Validation Error | 400 | Malformed request |

### Loading State Management

| State | Button | Form Fields | Purpose |
|-------|--------|-------------|---------|
| isLoading: false | Enabled | Enabled | Ready for input |
| isLoading: true | Disabled with spinner | Disabled | Submission in progress |

### Security Considerations

| Practice | Implementation |
|----------|----------------|
| HTTPS Only | Ensure API uses HTTPS |
| No Password Logging | Never log passwords |
| Token Storage | Secure storage (Task 24) |
| Rate Limiting | Handle 429 responses |
| CSRF Protection | Include CSRF token if needed |

### Expected Outcome
- Working form submission to authentication API
- Proper loading state management
- Error handling prepared for Task 25
- Success handling prepared for Task 24
- Secure credential transmission

### Verification Checklist
- [ ] authService imported and used
- [ ] onSubmit handler implemented
- [ ] Form data properly extracted
- [ ] API request payload formatted correctly
- [ ] Try-catch block for error handling
- [ ] isLoading state managed correctly
- [ ] Finally block resets loading state
- [ ] No sensitive data logged
- [ ] Function is async
- [ ] API call uses await
- [ ] Request format matches backend expectations

---

## Summary

This document established the complete login form infrastructure including the page route, validation schema, form component with all input fields, and submission logic. The form uses React Hook Form with Zod validation, provides excellent UX with show/hide password toggle, remember me option, and proper loading states.

### Completed Tasks
15. ✓ Created login page route at `/login`
16. ✓ Created Zod validation schema for credentials
17. ✓ Created LoginForm component with React Hook Form
18. ✓ Added email input with validation
19. ✓ Added password input with show/hide toggle
20. ✓ Added remember me checkbox
21. ✓ Added forgot password link
22. ✓ Created submit button with loading states
23. ✓ Implemented login submission to API

### Next Steps
Proceed to [02_Tasks-24-30_Success-Error-UX.md](02_Tasks-24-30_Success-Error-UX.md) to implement success handling (token storage, auth store updates, redirect), error handling with user-friendly messages, tenant selection for multi-tenant users, and final UX polish with animations and testing.
