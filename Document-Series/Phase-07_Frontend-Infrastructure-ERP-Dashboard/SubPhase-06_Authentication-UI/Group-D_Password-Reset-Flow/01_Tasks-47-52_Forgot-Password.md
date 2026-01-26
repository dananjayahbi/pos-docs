# Tasks 47-52: Forgot Password Page and Flow

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** D - Password Reset Flow  
> **Document:** 01 of 02  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-53-62_Reset-Password.md](02_Tasks-53-62_Reset-Password.md)

---

## Document Overview

This document covers the creation of the forgot password page and complete flow for requesting a password reset. It includes setting up the forgot password route, creating Zod validation schema for email input, building the ForgotPasswordForm component, implementing submission to the backend API, handling success states with user feedback, and comprehensive error handling including email not found and rate limiting scenarios.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Create Forgot Password Page | Low | 15 min |
| 48 | Create Forgot Password Schema | Low | 15 min |
| 49 | Create Forgot Password Form | Low | 25 min |
| 50 | Implement Reset Request Submission | Low | 30 min |
| 51 | Handle Reset Request Success | Low | 20 min |
| 52 | Handle Reset Request Errors | Low | 25 min |

---

## Task 47: Create Forgot Password Page

### Overview
Create the forgot password page route within the (auth) route group. This page allows users who have forgotten their credentials to initiate a password reset process by submitting their email address. The system will send a reset link to the provided email if it exists in the database.

### Dependencies
- Task 14: Verify Auth Layout Structure

### Instructions

1. **Create forgot-password directory**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new directory named `forgot-password`
   - This follows Next.js App Router convention

2. **Create page component file**
   - Create `page.tsx` file inside `forgot-password/` directory
   - This file will be the forgot password page component

3. **Import required dependencies**
   - Import React types
   - Import Metadata type from Next.js
   - Import auth components (AuthCard, AuthHeading)
   - Import ForgotPasswordForm component (to be created in Task 49)

4. **Define page metadata**
   - Export metadata object with type `Metadata`
   - Set title to "Forgot Password"
   - Set description: "Reset your password via email"

5. **Create page component**
   - Define default export function `ForgotPasswordPage`
   - Return JSX structure using auth components

6. **Implement page structure**
   - Wrap ForgotPasswordForm in AuthCard component
   - Add AuthHeading with title and descriptive subtitle
   - Add link back to login page below form

7. **Add informational text**
   - Include helper text explaining the process
   - "Enter your email and we'll send you a reset link"
   - Position above form for clarity

8. **Configure page styling**
   - Use existing auth layout for centering
   - No additional container needed (layout handles it)
   - Ensure consistent spacing with other auth pages

### Page Structure

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │      Forgot Password?        │   │
│    │  Enter your email address    │   │
│    │  and we'll send a reset link │   │
│    │                              │   │
│    │  [Forgot Password Form]      │   │
│    │                              │   │
│    │  Remember your password?     │   │
│    │      [Back to Login]         │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/forgot-password/page.tsx` | `/forgot-password` | Password reset request |

### Page Metadata

| Field | Value | Purpose |
|-------|-------|---------|
| title | "Forgot Password" | Browser tab title |
| description | "Reset your LankaCommerce Cloud account password" | SEO description |

### Informational Text Guidelines

| Section | Content | Purpose |
|---------|---------|---------|
| Main heading | "Forgot Password?" | Clear page purpose |
| Subtitle | "Enter your email address and we'll send you a reset link" | User instruction |
| Helper text | "Check your spam folder if you don't receive the email" | Prevent support requests |

### Expected Outcome
- Functional forgot password page accessible at `/forgot-password`
- Page uses auth layout with centered content
- Proper metadata for SEO
- Clear instructions for users
- Ready to receive ForgotPasswordForm component

### Verification Checklist
- [ ] `frontend/app/(auth)/forgot-password/` directory created
- [ ] `frontend/app/(auth)/forgot-password/page.tsx` file created
- [ ] Metadata exported with title and description
- [ ] Page component structure implemented
- [ ] AuthCard and AuthHeading components used
- [ ] Informational text added
- [ ] Back to login link included
- [ ] Page accessible at `/forgot-password` URL

---

## Task 48: Create Forgot Password Schema

### Overview
Create a Zod validation schema for the forgot password form that validates the email input. This schema ensures that only properly formatted email addresses are submitted to the password reset endpoint, providing immediate validation feedback to users.

### Dependencies
- Task 47: Create Forgot Password Page

### Instructions

1. **Create validation file**
   - Navigate to `frontend/lib/validations/` directory
   - Create `forgotPassword.ts` file
   - This will contain forgot password-specific schema

2. **Import Zod library**
   - Import z from 'zod'
   - Ensure Zod is installed in project dependencies

3. **Define forgot password schema**
   - Create `forgotPasswordSchema` using `z.object()`
   - Define email field with comprehensive validation
   - Add clear, user-friendly error messages

4. **Configure email validation**
   - Set as required field
   - Add email format validation
   - Add custom error messages
   - Consider max length validation

5. **Add email normalization**
   - Transform email to lowercase
   - Trim whitespace from both ends
   - Ensure consistent formatting

6. **Export TypeScript type**
   - Infer TypeScript type from schema
   - Export as `ForgotPasswordFormData` type
   - Use for type safety throughout components

7. **Add schema documentation**
   - Include JSDoc comments explaining schema purpose
   - Document each validation rule
   - Add usage examples in comments

### Schema Structure

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| email | string | Yes | Valid email format, trimmed, lowercase |

### Validation Rules Detail

```
Email Field:
├── Required: Cannot be empty
├── Format: Must be valid email (user@domain.com)
├── Transform: Lowercase and trimmed
├── Max Length: 254 characters (RFC 5321)
└── Error Messages:
    ├── Empty: "Email is required"
    ├── Invalid: "Please enter a valid email address"
    └── Too Long: "Email address is too long"
```

### Email Validation Examples

| Input | Valid | Transformed To | Error Message |
|-------|-------|----------------|---------------|
| "" | No | - | "Email is required" |
| "  test@example.com  " | Yes | "test@example.com" | - |
| "Test@EXAMPLE.COM" | Yes | "test@example.com" | - |
| "invalid" | No | - | "Please enter a valid email address" |
| "test@" | No | - | "Please enter a valid email address" |

### Schema Implementation Pattern

```
forgotPasswordSchema:
  └── email field
      ├── z.string()
      ├── .trim()
      ├── .toLowerCase()
      ├── .min(1, "Email is required")
      ├── .email("Please enter a valid email address")
      └── .max(254, "Email address is too long")
```

### Type Safety

| Export | Purpose | Usage |
|--------|---------|-------|
| forgotPasswordSchema | Runtime validation | Form validation |
| ForgotPasswordFormData | TypeScript type | Component props, state |

### Error Message Guidelines

| Type | Message Style | Example |
|------|---------------|---------|
| Required | Direct and clear | "Email is required" |
| Format | Helpful instruction | "Please enter a valid email address" |
| Length | Specific constraint | "Email address is too long" |

### Expected Outcome
- Zod schema for forgot password validation
- Email normalization (lowercase, trimmed)
- TypeScript type for form data
- Clear, actionable error messages
- Reusable validation logic

### Verification Checklist
- [ ] `frontend/lib/validations/forgotPassword.ts` file created
- [ ] Zod library imported
- [ ] forgotPasswordSchema defined
- [ ] Email validation rules configured
- [ ] Email transformation (lowercase, trim) added
- [ ] Max length validation included
- [ ] ForgotPasswordFormData type exported
- [ ] Custom error messages provided
- [ ] JSDoc documentation added

---

## Task 49: Create Forgot Password Form

### Overview
Create the ForgotPasswordForm component that provides the interface for users to request a password reset. This component uses React Hook Form with Zod validation and manages the form state including loading, success, and error states. The form provides clear feedback throughout the reset request process.

### Dependencies
- Task 48: Create Forgot Password Schema

### Instructions

1. **Create ForgotPasswordForm component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `ForgotPasswordForm.tsx` file
   - This will be a client component

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for form interactivity and state management

3. **Import required dependencies**
   - Import React hooks (useState)
   - Import useForm from react-hook-form
   - Import zodResolver from @hookform/resolvers/zod
   - Import forgotPasswordSchema and ForgotPasswordFormData type
   - Import Form components from Shadcn/UI
   - Import auth service methods

4. **Set up React Hook Form**
   - Initialize useForm with zodResolver
   - Pass forgotPasswordSchema to resolver
   - Configure default values for email field
   - Set validation mode to "onBlur" for better UX

5. **Create form state management**
   - Use useState for isLoading state
   - Use useState for isSuccess state
   - Use useState for error message
   - Use useState for countdown timer (optional)

6. **Define form submission handler**
   - Create onSubmit function (async)
   - Accept validated form data
   - Will be implemented in Task 50

7. **Implement form structure**
   - Use Shadcn/UI Form component wrapper
   - Add email FormField with proper structure
   - Include submit button
   - Add form-level error display

8. **Add email input field**
   - Use FormField with control from React Hook Form
   - Add FormLabel with text "Email Address"
   - Add Input component with proper attributes
   - Add FormMessage for error display

9. **Configure email input attributes**
   - Set type="email"
   - Add placeholder: "name@company.com"
   - Set autocomplete="email"
   - Add inputMode="email"
   - Disable input when isSuccess or isLoading

10. **Add submit button**
    - Text: "Send Reset Link"
    - Full width button
    - Show loading state with spinner
    - Disable when loading or success

11. **Add back to login link**
    - Position below submit button
    - Center-aligned text
    - Use Next.js Link component
    - Text: "Back to Login"

### Component Structure

```
┌─────────────────────────────────────┐
│  Email Address *                    │
│  ┌───────────────────────────────┐ │
│  │ name@company.com              │ │
│  └───────────────────────────────┘ │
│  [Error message if invalid]       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Send Reset Link            │ │
│  └───────────────────────────────┘ │
│                                     │
│         Back to Login               │
└─────────────────────────────────────┘
```

### Form State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| isLoading | boolean | false | Submission in progress |
| isSuccess | boolean | false | Reset link sent successfully |
| error | string \| null | null | Error message to display |

### React Hook Form Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| resolver | zodResolver(forgotPasswordSchema) | Zod validation |
| mode | "onBlur" | Validation timing |
| defaultValues | { email: "" } | Initial state |

### Email Input Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "email" | HTML5 email validation |
| name | "email" | React Hook Form field name |
| placeholder | "name@company.com" | Example format |
| autocomplete | "email" | Browser autofill |
| inputMode | "email" | Mobile keyboard type |
| disabled | isLoading \|\| isSuccess | Prevent changes |

### Button States

| State | Display Text | Disabled | Icon |
|-------|-------------|----------|------|
| Default | "Send Reset Link" | No | None |
| Loading | "Sending..." | Yes | Spinner |
| Success | "Email Sent" | Yes | Check mark |

### Form Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Labels | Associated with inputs via htmlFor |
| Error Messages | Announced to screen readers |
| Required Fields | Marked with aria-required |
| Focus Management | Focus on email input on mount |
| Keyboard Submit | Enter key submits form |

### Expected Outcome
- Functional forgot password form component
- React Hook Form integration with Zod validation
- Proper state management for loading and success
- Email input with validation and error display
- Submit button with loading states
- Accessibility features implemented

### Verification Checklist
- [ ] `frontend/components/auth/ForgotPasswordForm.tsx` file created
- [ ] 'use client' directive added
- [ ] React Hook Form initialized with zodResolver
- [ ] forgotPasswordSchema integrated
- [ ] Form state (loading, success, error) managed
- [ ] Email FormField added with proper structure
- [ ] Email input configured with all attributes
- [ ] Submit button with loading state
- [ ] Back to login link included
- [ ] onSubmit handler defined (stub)
- [ ] Accessibility attributes set
- [ ] Component exports properly

---

## Task 50: Implement Reset Request Submission

### Overview
Implement the form submission logic that sends the password reset request to the backend API. This task connects the ForgotPasswordForm to the authentication service, handles the API call, manages loading states, and coordinates the transition between different UI states based on the API response.

### Dependencies
- Task 49: Create Forgot Password Form

### Instructions

1. **Import authentication service**
   - Import authService from lib/services
   - Ensure forgotPassword method is available
   - Verify API endpoint configuration

2. **Implement onSubmit function**
   - Make function async
   - Accept form data from React Hook Form
   - Handle try-catch for error management

3. **Add pre-submission validation**
   - Reset any existing error state
   - Verify form data is valid
   - Check if already in loading/success state

4. **Set loading state**
   - Set isLoading to true at start of submission
   - Clear any previous error messages
   - Disable form inputs

5. **Call forgot password API**
   - Invoke authService.forgotPassword(email)
   - Pass the validated email address
   - Await the API response

6. **Handle API response**
   - Check if response indicates success
   - Extract any relevant data from response
   - Prepare for success state transition

7. **Update success state**
   - Set isSuccess to true
   - Keep isLoading to false
   - Clear any error state
   - Trigger success handling (Task 51)

8. **Implement error handling**
   - Catch any thrown errors
   - Parse error response from API
   - Extract meaningful error message
   - Update error state with message

9. **Reset loading state**
   - Always set isLoading to false in finally block
   - Ensure UI returns to interactive state
   - Re-enable form if needed (unless success)

10. **Add request timeout**
    - Implement timeout for API call (30 seconds)
    - Handle timeout as specific error case
    - Provide clear timeout error message

### Submission Flow Diagram

```
User Submits Form
    │
    ▼
Validate Form Data
    │
    ├─── Invalid ──→ Show Validation Errors
    │
    ▼
Set isLoading = true
    │
    ▼
Call authService.forgotPassword(email)
    │
    ├──── Success ────┐
    │                 ▼
    │         Set isSuccess = true
    │         Clear errors
    │         Show success message (Task 51)
    │
    ├──── Error ──────┐
    │                 ▼
    │         Parse error type
    │         Set error message
    │         Show error UI (Task 52)
    │
    ▼
Set isLoading = false
    │
    ▼
Update UI State
```

### API Call Structure

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Reset state | Clear previous errors |
| 2 | Set loading | Show loading indicator |
| 3 | Call API | Send reset request |
| 4 | Parse response | Extract success/error |
| 5 | Update state | Show result to user |
| 6 | Reset loading | Re-enable UI |

### Authentication Service Method

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| forgotPassword | email: string | Promise<void> | Request password reset |

### Error Types to Handle

| Error Type | HTTP Status | User Message |
|------------|-------------|--------------|
| Network Error | - | "Network error. Please check your connection." |
| Email Not Found | 404 | "If this email exists, a reset link has been sent." |
| Rate Limited | 429 | "Too many attempts. Please wait before trying again." |
| Server Error | 500 | "Server error. Please try again later." |
| Timeout | - | "Request timed out. Please try again." |

### State Management During Submission

| State | Before | During | Success | Error |
|-------|--------|--------|---------|-------|
| isLoading | false | true | false | false |
| isSuccess | false | false | true | false |
| error | null | null | null | "message" |

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Email enumeration | Always show success message, even if email not found |
| Rate limiting | Respect backend rate limits, show countdown |
| CSRF protection | Include CSRF token if required |
| Data sanitization | Email already validated by schema |

### Expected Outcome
- Complete submission logic implemented
- API call to backend forgot password endpoint
- Proper error handling for all scenarios
- State management coordinated correctly
- Loading states displayed appropriately
- Foundation for success/error handling (Tasks 51-52)

### Verification Checklist
- [ ] authService.forgotPassword imported
- [ ] onSubmit function implemented as async
- [ ] Pre-submission validation added
- [ ] isLoading state managed properly
- [ ] API call to forgotPassword method
- [ ] Success response handled
- [ ] isSuccess state updated on success
- [ ] Error handling with try-catch
- [ ] Error message extracted and set
- [ ] Loading state reset in finally block
- [ ] Timeout handling implemented
- [ ] Email enumeration protection considered

---

## Task 51: Handle Reset Request Success

### Overview
Implement the success state UI and user feedback when a password reset request is successfully submitted. This task creates a clear, informative success message that guides users to check their email, hides the form to prevent duplicate submissions, and provides navigation options back to the login page.

### Dependencies
- Task 50: Implement Reset Request Submission

### Instructions

1. **Create success state check**
   - In ForgotPasswordForm component
   - Add conditional rendering based on isSuccess state
   - Show success UI when isSuccess is true

2. **Implement success message container**
   - Create success section that replaces form
   - Use appropriate success styling (green theme)
   - Center-align content for prominence

3. **Add success icon**
   - Use checkmark or email sent icon
   - Import from icon library (Lucide React)
   - Size appropriately (large, visible)
   - Use success color (green)

4. **Create success heading**
   - Text: "Check Your Email"
   - Use prominent heading size (h2 or h3)
   - Apply success color

5. **Add instructional message**
   - Explain what happens next
   - "We've sent a password reset link to your email address."
   - Include additional helper text
   - "If you don't see it, check your spam folder."

6. **Display submitted email**
   - Show the email address used
   - Use subtle styling to differentiate
   - Help user confirm correct email

7. **Add email validity notice**
   - Inform about link expiration
   - "This link will expire in 1 hour."
   - Set expectations for time sensitivity

8. **Create action buttons**
   - Primary: "Back to Login" button
   - Links to `/login` page
   - Use full-width button
   - Secondary: "Resend Email" link (optional)

9. **Implement resend functionality (optional)**
   - Add button to resend reset email
   - Include cooldown timer
   - Prevent spam by limiting resends
   - Show countdown: "Resend in 60s"

10. **Add analytics tracking**
    - Track successful reset requests
    - Log email domain for analytics
    - Monitor conversion funnel

### Success UI Structure

```
┌─────────────────────────────────────┐
│                                     │
│         [✓ Success Icon]            │
│                                     │
│        Check Your Email!            │
│                                     │
│  We've sent a password reset link  │
│  to name@company.com                │
│                                     │
│  Please check your email inbox     │
│  and click the reset link.         │
│                                     │
│  The link will expire in 1 hour.   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Back to Login              │ │
│  └───────────────────────────────┘ │
│                                     │
│     Didn't receive the email?       │
│        Resend (60s)                 │
│                                     │
└─────────────────────────────────────┘
```

### Success Message Components

| Component | Content | Purpose |
|-----------|---------|---------|
| Icon | Checkmark or email icon | Visual success indicator |
| Heading | "Check Your Email" | Primary message |
| Email | User's submitted email | Confirmation |
| Instructions | What to do next | Guide user |
| Expiration | "Expires in 1 hour" | Set expectation |
| Action Button | "Back to Login" | Primary CTA |

### Success Styling

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | Success background | Visual feedback |
| Icon | Green, large | Positive confirmation |
| Heading | Bold, prominent | Clear messaging |
| Text | Readable, centered | Easy comprehension |
| Button | Primary style | Clear action |

### Resend Functionality

| State | Button Text | Enabled |
|-------|-------------|---------|
| Initial | "Resend Email" | No (60s cooldown) |
| Countdown | "Resend in 45s" | No |
| Ready | "Resend Email" | Yes |
| Sending | "Sending..." | No |

### Success Message Variations

| Scenario | Additional Message |
|----------|-------------------|
| Gmail user | "Check your Promotions or Spam folder" |
| Corporate email | "Email may take a few minutes to arrive" |
| First time | "Mark our emails as not spam" |

### Resend Cooldown Logic

```
Resend Button Clicked
    │
    ▼
Start 60-second countdown
    │
    ├──── During countdown ───→ Show "Resend in Xs"
    │                           Button disabled
    │
    ▼
Countdown reaches 0
    │
    ▼
Enable resend button
    │
    ▼
User clicks resend
    │
    ▼
Call forgotPassword API again
    │
    ▼
Restart countdown
```

### Expected Outcome
- Clear, informative success message
- Form hidden after successful submission
- Email address displayed for confirmation
- Link expiration communicated
- Back to login action provided
- Optional resend functionality with cooldown
- Positive user experience

### Verification Checklist
- [ ] Success state conditional rendering implemented
- [ ] Success icon added and styled
- [ ] Success heading created
- [ ] Instructional message added
- [ ] Submitted email displayed
- [ ] Link expiration notice included
- [ ] "Back to Login" button added
- [ ] Button links to `/login` page
- [ ] Optional resend functionality implemented
- [ ] Resend cooldown timer working
- [ ] Success UI matches brand styling
- [ ] Analytics tracking added

---

## Task 52: Handle Reset Request Errors

### Overview
Implement comprehensive error handling for the forgot password flow, including specific error types such as email not found, rate limiting, network errors, and server errors. This task ensures users receive clear, actionable feedback when issues occur, while maintaining security best practices like preventing email enumeration.

### Dependencies
- Task 50: Implement Reset Request Submission

### Instructions

1. **Create error state display**
   - Add error message container below form
   - Use Alert component from Shadcn/UI
   - Style with error/destructive variant
   - Show only when error state exists

2. **Implement generic error handler**
   - Parse error response from API
   - Extract error message and type
   - Map error codes to user-friendly messages
   - Set error state with message

3. **Handle email not found error**
   - API returns 404 status
   - Show success message instead of error
   - Prevents email enumeration attack
   - Security best practice

4. **Implement rate limiting error**
   - Detect 429 status code
   - Show rate limit message
   - Display countdown timer
   - Disable form during cooldown

5. **Create rate limit countdown**
   - Parse retry-after header from API
   - Display remaining time
   - Update every second
   - Re-enable form when countdown ends

6. **Handle network errors**
   - Detect connection failures
   - Show network error message
   - Suggest checking internet connection
   - Provide retry option

7. **Handle server errors**
   - Detect 500 status codes
   - Show generic server error message
   - Avoid exposing technical details
   - Suggest trying again later

8. **Add validation errors**
   - Display form-level validation errors
   - Show below submit button
   - Use error styling
   - Clear on next submission attempt

9. **Implement error dismissal**
   - Add close button to error alert
   - Clear error state on dismiss
   - Clear error on new submission
   - Clear error on form field change

10. **Add error recovery**
    - Keep form data on error
    - Don't reset form fields
    - Allow user to correct and resubmit
    - Focus on email input after error

### Error Handling Flow

```
API Error Occurs
    │
    ▼
Parse Error Response
    │
    ├──── 404 (Not Found) ────→ Show success message
    │                           (prevent enumeration)
    │
    ├──── 429 (Rate Limit) ───→ Show rate limit error
    │                           Start countdown timer
    │                           Disable form
    │
    ├──── 500 (Server) ───────→ Show server error
    │                           Suggest retry later
    │
    ├──── Network Error ──────→ Show network error
    │                           Check connection
    │
    └──── Other ──────────────→ Show generic error
                                Generic message
```

### Error Types and Messages

| Error Type | Status | User Message | Action |
|------------|--------|--------------|--------|
| Email Not Found | 404 | "If this email exists, a reset link has been sent." | Show success state |
| Rate Limited | 429 | "Too many attempts. Please wait X seconds." | Show countdown |
| Network Error | - | "Network error. Please check your internet connection." | Allow retry |
| Server Error | 500 | "Server error. Please try again later." | Allow retry |
| Validation Error | 400 | "Please check your email address." | Focus input |
| Timeout | - | "Request timed out. Please try again." | Allow retry |

### Rate Limit Display

```
┌─────────────────────────────────────┐
│  ⚠️ Too Many Attempts               │
│                                     │
│  Please wait 60 seconds before      │
│  trying again.                      │
│                                     │
│  You can try again in: 45s          │
│                                     │
│  [X Close]                          │
└─────────────────────────────────────┘
```

### Error Display Structure

```
┌─────────────────────────────────────┐
│  Email Address *                    │
│  ┌───────────────────────────────┐ │
│  │ name@company.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │ ← Error Alert
│  │ ⚠️ Network error. Please       │ │
│  │    check your connection.      │ │
│  │                          [X]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Send Reset Link            │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Rate Limit State Management

| State | Type | Purpose |
|-------|------|---------|
| isRateLimited | boolean | Rate limit active |
| rateLimitSeconds | number | Seconds remaining |
| rateLimitInterval | NodeJS.Timeout | Countdown timer |

### Rate Limit Countdown Logic

```
Rate Limit Error (429)
    │
    ▼
Parse retry-after header
    │
    ▼
Set rateLimitSeconds = retry-after
Set isRateLimited = true
    │
    ▼
Start interval timer
    │
    ├──── Every second ────→ Decrease rateLimitSeconds
    │                        Update display
    │
    ▼
rateLimitSeconds reaches 0
    │
    ▼
Clear interval
Set isRateLimited = false
Re-enable form
```

### Error Alert Styling

| Variant | Use Case | Icon | Color |
|---------|----------|------|-------|
| destructive | Server, network errors | AlertTriangle | Red |
| warning | Rate limiting | AlertCircle | Yellow |
| default | Validation errors | Info | Gray |

### Security Considerations

| Scenario | Implementation | Reason |
|----------|----------------|--------|
| Email not found | Show success message | Prevent email enumeration |
| Rate limiting | Enforce client-side cooldown | Reduce server load |
| Error details | Hide technical details | Security |
| Generic errors | Use vague messages | Don't expose internals |

### Error Recovery Options

| Error Type | Recovery Action | User Experience |
|------------|----------------|-----------------|
| Network | Retry button | "Try Again" |
| Rate limit | Wait countdown | "Please wait..." |
| Server | Retry button | "Try Again" |
| Validation | Edit form | "Fix errors" |

### Expected Outcome
- Comprehensive error handling for all scenarios
- Clear, actionable error messages
- Rate limiting with countdown timer
- Security-conscious error handling (no enumeration)
- Graceful error recovery
- Positive user experience even during errors

### Verification Checklist
- [ ] Error alert component added
- [ ] Error state display implemented
- [ ] Email not found shows success message
- [ ] Rate limiting error detected (429)
- [ ] Rate limit countdown timer implemented
- [ ] Countdown updates every second
- [ ] Form disabled during rate limit
- [ ] Network error handling added
- [ ] Server error handling added
- [ ] Generic error handler implemented
- [ ] Error dismissal functionality
- [ ] Error cleared on new submission
- [ ] Form data preserved on error
- [ ] Focus management on error
- [ ] Security best practices followed

---

## Summary

This document covered the complete forgot password page and request flow, including:

- **Task 47:** Created forgot password page route with proper structure and metadata
- **Task 48:** Defined Zod validation schema for email input with normalization
- **Task 49:** Built ForgotPasswordForm component with React Hook Form integration
- **Task 50:** Implemented submission logic with API integration and error handling
- **Task 51:** Created success state UI with clear user feedback and navigation
- **Task 52:** Implemented comprehensive error handling including rate limiting

The forgot password flow now provides a secure, user-friendly experience for initiating password resets with proper validation, loading states, success feedback, and error handling. The implementation follows security best practices by preventing email enumeration while maintaining clear communication with users.

### Next Steps

Proceed to [02_Tasks-53-62_Reset-Password.md](02_Tasks-53-62_Reset-Password.md) to implement the reset password page that handles the actual password reset using the token sent via email.
