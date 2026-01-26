# Tasks 63-70: Email Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** E - Email Verification & 2FA  
> **Document:** 01 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-71-76_2FA-Setup-Verification.md](02_Tasks-71-76_2FA-Setup-Verification.md)

---

## Document Overview

This document covers the complete email verification flow including the verification page that extracts tokens from URLs, calls the backend API, and handles success/failure scenarios. It also includes the resend verification page with form and API integration for users whose verification links have expired.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create Verify Email Page | Low | 20 min |
| 64 | Extract Verification Token | Low | 15 min |
| 65 | Implement Verification Request | Low | 25 min |
| 66 | Handle Verification Success | Low | 20 min |
| 67 | Handle Verification Failure | Low | 25 min |
| 68 | Create Resend Verification Page | Low | 20 min |
| 69 | Create Resend Verification Form | Low | 25 min |
| 70 | Implement Resend Logic | Low | 30 min |

---

## Task 63: Create Verify Email Page

### Overview
Create the email verification page that users land on after clicking the verification link in their email. This page automatically extracts the verification token from the URL, calls the backend API, and displays the appropriate success or failure message.

### Dependencies
- Task 14: Verify Auth Layout Structure

### Instructions

1. **Create verify-email directory**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new directory named `verify-email`
   - This follows Next.js App Router convention

2. **Create page component file**
   - Create `page.tsx` file inside `verify-email/` directory
   - This will be a client component due to URL parameter handling

3. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for useSearchParams and dynamic rendering

4. **Import required dependencies**
   - Import React hooks (useEffect, useState)
   - Import useSearchParams from next/navigation
   - Import useRouter from next/navigation
   - Import AuthCard and AuthHeading components
   - Import UI components (Button, Alert)

5. **Define page metadata**
   - Note: Metadata cannot be exported from client components
   - Set page title using useEffect with document.title

6. **Set up page state**
   - Create state for verification status (idle, loading, success, error)
   - Create state for error message
   - Create state for countdown timer (auto-redirect)

7. **Create page component structure**
   - Define default export function `VerifyEmailPage`
   - Wrap content in AuthCard component
   - Add AuthHeading with dynamic title based on status

8. **Implement conditional rendering**
   - Show loading spinner during verification
   - Show success message with checkmark icon
   - Show error message with error details
   - Show resend link for expired tokens

9. **Add redirect countdown**
   - Display countdown timer on success (3 seconds)
   - Show manual "Go to Login" link
   - Prepare for auto-redirect in Task 66

### Page Structure

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │  Verifying Your Email        │   │
│    │                              │   │
│    │  [Loading Spinner]           │   │
│    │  Please wait...              │   │
│    │                              │   │
│    │  OR                          │   │
│    │                              │   │
│    │  ✓ Email Verified!           │   │
│    │  Redirecting to login...     │   │
│    │  [Go to Login Button]        │   │
│    │                              │   │
│    │  OR                          │   │
│    │                              │   │
│    │  ✗ Verification Failed       │   │
│    │  [Error Message]             │   │
│    │  [Resend Verification Link]  │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/verify-email/page.tsx` | `/verify-email?token=abc123` | Email verification handler |

### Verification States

| State | Display | Icon | Actions |
|-------|---------|------|---------|
| idle | Initial load | - | Extract token |
| loading | "Verifying..." | Spinner | Show progress |
| success | "Email Verified!" | Checkmark | Redirect countdown |
| error | Error message | X icon | Resend link |

### Page State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| status | 'idle' \| 'loading' \| 'success' \| 'error' | Current verification state |
| errorMessage | string \| null | Error details |
| countdown | number | Seconds until redirect |

### Expected Outcome
- Functional email verification page at `/verify-email`
- Clean UI for all verification states
- Ready to receive token extraction logic
- Proper error and success states defined

### Verification Checklist
- [ ] `frontend/app/(auth)/verify-email/` directory created
- [ ] `frontend/app/(auth)/verify-email/page.tsx` file created
- [ ] 'use client' directive added
- [ ] Page state variables defined
- [ ] AuthCard and AuthHeading components used
- [ ] Conditional rendering implemented
- [ ] Loading, success, and error states designed
- [ ] Page accessible at `/verify-email` URL

---

## Task 64: Extract Verification Token

### Overview
Implement logic to extract the verification token from the URL query parameters when the page loads. This token is sent to users via email and must be captured from the URL to make the verification API request.

### Dependencies
- Task 63: Create Verify Email Page

### Instructions

1. **Import useSearchParams hook**
   - Ensure useSearchParams is imported from next/navigation
   - This hook provides access to URL query parameters

2. **Initialize searchParams in component**
   - Call useSearchParams() at component top level
   - Store result in constant variable

3. **Create token extraction function**
   - Define function to get token from searchParams
   - Call searchParams.get('token')
   - Return token value or null

4. **Add useEffect for token extraction**
   - Create useEffect hook that runs on component mount
   - Extract token using searchParams
   - Store token in component state or ref

5. **Implement token validation**
   - Check if token exists
   - Verify token is not empty string
   - Check token format (alphanumeric, minimum length)

6. **Handle missing token scenario**
   - If no token found, set error state
   - Display clear error message
   - Show link to resend verification

7. **Handle invalid token format**
   - If token exists but invalid format, show error
   - Explain that link may be corrupted
   - Provide resend verification option

8. **Trigger verification on valid token**
   - If token is valid, proceed to Task 65
   - Set status to 'loading'
   - Prepare to call verification API

### Token Extraction Flow

```
Page Load
    │
    ▼
Extract searchParams
    │
    ▼
Get 'token' parameter
    │
    ├─────────────────┬─────────────────┐
    ▼                 ▼                 ▼
Token Missing    Token Invalid    Token Valid
    │                 │                 │
    ▼                 ▼                 ▼
Show Error       Show Error       Call API
+ Resend Link    + Resend Link    (Task 65)
```

### URL Parameter Structure

| Parameter | Example | Purpose |
|-----------|---------|---------|
| token | `abc123def456ghi789` | Verification token from email |

### Token Validation Rules

| Check | Rule | Error Message |
|-------|------|---------------|
| Exists | Token must be present | "No verification token found. Please check your email link." |
| Not Empty | Token length > 0 | "Invalid verification link. Please request a new one." |
| Format | Alphanumeric, 20-64 chars | "Invalid token format. Please request a new verification email." |

### Missing Token Error Display

```
┌────────────────────────────────────┐
│  Verification Link Invalid         │
│                                    │
│  No verification token was found   │
│  in the link. Please check your    │
│  email or request a new            │
│  verification email.               │
│                                    │
│  [Resend Verification Email]       │
└────────────────────────────────────┘
```

### Token State Management

| Variable | Type | Purpose |
|----------|------|---------|
| token | string \| null | Extracted token value |
| tokenError | string \| null | Token validation error |

### Expected Outcome
- Token extracted from URL on page load
- Token validation logic in place
- Clear error messages for missing/invalid tokens
- Ready to proceed with API call for valid tokens

### Verification Checklist
- [ ] useSearchParams hook imported and used
- [ ] Token extraction function implemented
- [ ] useEffect hook extracts token on mount
- [ ] Token validation rules applied
- [ ] Missing token error handling
- [ ] Invalid token error handling
- [ ] Error messages displayed clearly
- [ ] Valid token triggers verification flow

---

## Task 65: Implement Verification Request

### Overview
Implement the API request to the backend verification endpoint. This task sends the extracted token to the backend, handles the response, and updates the UI state based on success or failure.

### Dependencies
- Task 64: Extract Verification Token

### Instructions

1. **Create API service function**
   - Navigate to `frontend/lib/api/` directory
   - Open or create `auth.ts` file
   - Add verifyEmail function

2. **Define verifyEmail API function**
   - Accept token as parameter
   - Use fetch or axios to call backend
   - Set endpoint to `/api/auth/verify-email/`
   - Use POST method

3. **Configure request structure**
   - Set Content-Type header to application/json
   - Include token in request body
   - Handle CORS if needed
   - Set appropriate timeout (10 seconds)

4. **Add error handling to API function**
   - Use try-catch block
   - Handle network errors
   - Handle timeout errors
   - Parse error response from backend

5. **Create verification handler in component**
   - Define async function `handleVerification`
   - Accept token parameter
   - Set status to 'loading' before call

6. **Call API function from component**
   - Within handleVerification, call verifyEmail(token)
   - Await response
   - Handle success response (Task 66)
   - Handle error response (Task 67)

7. **Integrate with useEffect**
   - After token validation in Task 64
   - If token is valid, call handleVerification
   - Ensure it only runs once (dependency array)

8. **Add loading indicators**
   - Show spinner during API call
   - Disable any interactive elements
   - Display "Verifying your email..." message

### API Request Structure

| Property | Value | Purpose |
|----------|-------|---------|
| Method | POST | Submit token |
| Endpoint | `/api/auth/verify-email/` | Backend verification |
| Headers | Content-Type: application/json | JSON payload |
| Body | { "token": "abc123..." } | Verification token |
| Timeout | 10000ms | Prevent hanging |

### Request Flow Diagram

```
Component Mount
    │
    ▼
Extract Token (Task 64)
    │
    ▼
Validate Token
    │
    ▼
Set Status: Loading
    │
    ▼
Call verifyEmail(token)
    │
    ├──────────────────┐
    ▼                  ▼
API Success     API Error
    │                  │
    ▼                  ▼
Task 66         Task 67
```

### API Response Handling

| Response Type | Status Code | Action |
|---------------|-------------|--------|
| Success | 200 | Proceed to Task 66 |
| Token Invalid | 400 | Show invalid token error |
| Token Expired | 400 | Show expired token error |
| Already Verified | 400 | Show already verified message |
| Server Error | 500 | Show generic error |
| Network Error | - | Show connection error |

### Error Response Structure (Expected)

```json
{
  "error": "token_expired",
  "message": "This verification link has expired.",
  "detail": "Verification tokens expire after 24 hours."
}
```

### Loading State Display

```
┌────────────────────────────────────┐
│  Verifying Your Email              │
│                                    │
│      [Spinning Icon]               │
│                                    │
│  Please wait while we verify       │
│  your email address...             │
└────────────────────────────────────┘
```

### API Service Location

| File | Function | Purpose |
|------|----------|---------|
| `frontend/lib/api/auth.ts` | verifyEmail(token: string) | Verification API call |

### Expected Outcome
- API service function created for verification
- Component calls API with extracted token
- Loading state displayed during request
- Ready to handle success and error responses

### Verification Checklist
- [ ] API service file created or updated
- [ ] verifyEmail function implemented
- [ ] Request structure configured correctly
- [ ] Error handling in API function
- [ ] handleVerification function in component
- [ ] API call integrated with useEffect
- [ ] Loading state displayed during request
- [ ] Timeout configured
- [ ] Response types handled

---

## Task 66: Handle Verification Success

### Overview
Implement the success flow when email verification completes successfully. This includes displaying a success message, showing a countdown timer, and automatically redirecting the user to the login page after a few seconds.

### Dependencies
- Task 65: Implement Verification Request

### Instructions

1. **Process success response**
   - In handleVerification function after API call
   - Check if response status is 200
   - Parse success response data

2. **Update component state**
   - Set status to 'success'
   - Clear any error messages
   - Initialize countdown timer (3 seconds)

3. **Display success message**
   - Show large checkmark icon (green)
   - Display "Email Verified!" heading
   - Add confirmation message
   - Use success color scheme

4. **Implement countdown timer**
   - Create state variable for countdown (initial: 3)
   - Use setInterval to decrement every second
   - Display countdown in UI
   - Clear interval on unmount

5. **Add auto-redirect logic**
   - When countdown reaches 0, redirect to login
   - Use useRouter hook with router.push('/login')
   - Ensure cleanup to prevent memory leaks

6. **Create manual redirect button**
   - Add "Go to Login" button below countdown
   - Allow users to skip countdown
   - Use router.push on click
   - Style as primary action button

7. **Add success icon**
   - Use CheckCircle icon from Lucide or similar
   - Size: large (48px or larger)
   - Color: green (success theme)
   - Center on page

8. **Implement cleanup**
   - Clear countdown interval on component unmount
   - Clear interval after redirect
   - Prevent redirect if user navigates away

### Success Response Structure (Expected)

```json
{
  "success": true,
  "message": "Email verified successfully",
  "email": "user@example.com"
}
```

### Success State Display

```
┌────────────────────────────────────┐
│  Email Verified!                   │
│                                    │
│          ✓                         │
│      [Green Check]                 │
│                                    │
│  Your email has been verified      │
│  successfully!                     │
│                                    │
│  Redirecting to login in 3         │
│  seconds...                        │
│                                    │
│  [Go to Login Now]                 │
└────────────────────────────────────┘
```

### Countdown Timer Logic

```
Success State Set
    │
    ▼
Initialize countdown = 3
    │
    ▼
setInterval (1 second)
    │
    ├──────────┐
    ▼          │
countdown--    │
    │          │
    ▼          │
Display number │
    │          │
    ▼          │
countdown = 0? │
    │          │
Yes │          │ No
    │          └──────┘
    ▼
Redirect to /login
```

### Countdown State Management

| Variable | Type | Initial | Purpose |
|----------|------|---------|---------|
| countdown | number | 3 | Seconds remaining |
| intervalId | NodeJS.Timeout \| null | null | Interval reference |

### Auto-Redirect Implementation

| Step | Action | Timing |
|------|--------|--------|
| 1 | Set countdown to 3 | Immediate |
| 2 | Decrement every second | 1s intervals |
| 3 | Display current count | Real-time |
| 4 | Redirect when 0 | After 3s |

### Success Message Variations

| Scenario | Message |
|----------|---------|
| New user | "Email verified! You can now sign in to your account." |
| Existing user | "Email verified successfully!" |
| With name | "Welcome {name}! Your email has been verified." |

### Expected Outcome
- Clear success message with visual feedback
- Countdown timer displayed prominently
- Auto-redirect after 3 seconds
- Manual redirect button available
- Clean, professional success UI

### Verification Checklist
- [ ] Success response processed correctly
- [ ] Component state updated to 'success'
- [ ] Success message displayed
- [ ] Checkmark icon shown (green)
- [ ] Countdown timer initialized at 3
- [ ] setInterval decrements countdown
- [ ] Countdown displayed in UI
- [ ] Auto-redirect after countdown
- [ ] Manual "Go to Login" button added
- [ ] Interval cleanup implemented

---

## Task 67: Handle Verification Failure

### Overview
Implement comprehensive error handling for verification failures including expired tokens, invalid tokens, already verified accounts, and server errors. Each error type should display a specific, helpful message with appropriate actions.

### Dependencies
- Task 65: Implement Verification Request

### Instructions

1. **Process error response**
   - In handleVerification function catch block
   - Parse error response from backend
   - Extract error type and message

2. **Update error state**
   - Set status to 'error'
   - Store error message for display
   - Clear success state if any

3. **Categorize error types**
   - Token expired error
   - Token invalid error
   - Already verified error
   - Server error
   - Network error

4. **Handle token expired error**
   - Display "Verification Link Expired" heading
   - Explain that links expire after 24 hours
   - Show "Resend Verification Email" button
   - Link to resend verification page

5. **Handle invalid token error**
   - Display "Invalid Verification Link" heading
   - Explain that link may be corrupted
   - Suggest checking email for correct link
   - Provide resend option

6. **Handle already verified error**
   - Display "Email Already Verified" heading
   - Explain account is already active
   - Show "Go to Login" button
   - No resend option needed

7. **Handle server errors**
   - Display "Verification Failed" heading
   - Show generic error message
   - Suggest trying again later
   - Provide support contact option

8. **Handle network errors**
   - Display "Connection Error" heading
   - Explain network issue
   - Add "Try Again" button
   - Check internet connection message

9. **Add error icon**
   - Use XCircle or AlertCircle icon
   - Color: red for errors, yellow for warnings
   - Size: large (48px)
   - Center on page

10. **Implement action buttons**
    - Resend verification button for expired/invalid
    - Go to login button for already verified
    - Try again button for network errors
    - Contact support link for server errors

### Error Types and Responses

| Error Type | Backend Code | Display Message | Action |
|------------|--------------|-----------------|--------|
| Token Expired | token_expired | "This verification link has expired." | Resend link |
| Token Invalid | token_invalid | "This verification link is invalid." | Resend link |
| Already Verified | already_verified | "This email is already verified." | Go to login |
| Token Not Found | token_not_found | "Verification token not found." | Resend link |
| Server Error | server_error | "An error occurred. Please try again." | Try again |
| Network Error | - | "Unable to connect. Check your connection." | Try again |

### Error Display: Token Expired

```
┌────────────────────────────────────┐
│  Verification Link Expired         │
│                                    │
│          ✗                         │
│      [Red X Icon]                  │
│                                    │
│  This verification link has        │
│  expired. Verification links are   │
│  valid for 24 hours.               │
│                                    │
│  [Resend Verification Email]       │
└────────────────────────────────────┘
```

### Error Display: Already Verified

```
┌────────────────────────────────────┐
│  Email Already Verified            │
│                                    │
│          ✓                         │
│    [Check Icon - Yellow]           │
│                                    │
│  Your email address has already    │
│  been verified. You can sign in    │
│  to your account now.              │
│                                    │
│  [Go to Login]                     │
└────────────────────────────────────┘
```

### Error Display: Server Error

```
┌────────────────────────────────────┐
│  Verification Failed               │
│                                    │
│          ⚠                         │
│    [Warning Icon - Yellow]         │
│                                    │
│  We couldn't verify your email at  │
│  this time. Please try again in a  │
│  few moments.                      │
│                                    │
│  [Try Again]                       │
│  [Contact Support]                 │
└────────────────────────────────────┘
```

### Error Handling Flow

```
API Error Response
    │
    ▼
Parse Error Data
    │
    ├─────────────┬─────────────┬─────────────┬─────────────┐
    ▼             ▼             ▼             ▼             ▼
Token         Token       Already      Server       Network
Expired       Invalid     Verified     Error        Error
    │             │             │             │             │
    ▼             ▼             ▼             ▼             ▼
Show Error    Show Error  Show Info    Show Error   Show Error
+ Resend      + Resend    + Login      + Try Again  + Try Again
```

### Error Message Guidelines

| Guideline | Implementation |
|-----------|----------------|
| Clear | Use simple, non-technical language |
| Specific | Explain what went wrong |
| Actionable | Provide next steps |
| Helpful | Offer solutions |
| Professional | Maintain brand tone |

### Error State Management

| Variable | Type | Purpose |
|----------|------|---------|
| errorType | string \| null | Type of error |
| errorMessage | string \| null | Display message |
| canResend | boolean | Show resend button |

### Expected Outcome
- Specific error messages for each failure type
- Appropriate action buttons for each error
- Clear visual distinction between error types
- User-friendly error explanations
- Easy path to resolution

### Verification Checklist
- [ ] Error response parsing implemented
- [ ] Error state updated correctly
- [ ] Token expired error handled
- [ ] Invalid token error handled
- [ ] Already verified error handled
- [ ] Server error handled
- [ ] Network error handled
- [ ] Error icons displayed
- [ ] Appropriate action buttons shown
- [ ] Error messages are clear and helpful

---

## Task 68: Create Resend Verification Page

### Overview
Create a dedicated page for users to request a new verification email. This page is accessed when verification links expire or are lost, allowing users to receive a fresh verification link via email.

### Dependencies
- Task 63: Create Verify Email Page

### Instructions

1. **Create resend-verification directory**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new directory named `resend-verification`
   - Follows Next.js App Router structure

2. **Create page component file**
   - Create `page.tsx` file inside `resend-verification/` directory
   - This will be a client component for form handling

3. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for form state and submission

4. **Import required dependencies**
   - Import React hooks (useState)
   - Import useRouter from next/navigation
   - Import AuthCard and AuthHeading components
   - Import ResendVerificationForm (to be created in Task 69)
   - Import UI components (Alert)

5. **Define page metadata**
   - Set document.title in useEffect
   - Title: "Resend Verification Email"

6. **Set up page state**
   - Create state for submission success
   - Create state for success message
   - No need for loading state (form handles it)

7. **Create page component structure**
   - Define default export function `ResendVerificationPage`
   - Wrap content in AuthCard component
   - Add AuthHeading with title and description

8. **Implement conditional rendering**
   - Show form by default
   - Show success message after submission
   - Include link back to login page

9. **Add informational text**
   - Explain purpose of page
   - Mention email delivery time (few minutes)
   - Check spam folder reminder
   - Link to support if issues persist

10. **Create success callback**
    - Define onSuccess handler
    - Receives email address as parameter
    - Updates state to show success message
    - Hides form after successful submission

### Page Structure

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │  Resend Verification Email   │   │
│    │  Enter your email to receive │   │
│    │  a new verification link     │   │
│    │                              │   │
│    │  [Resend Form Component]     │   │
│    │                              │   │
│    │  Remember your password?     │   │
│    │  [Back to Login]             │   │
│    │                              │   │
│    │  OR (after success)          │   │
│    │                              │   │
│    │  ✓ Verification Email Sent!  │   │
│    │  Check your inbox...         │   │
│    │  [Go to Login]               │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/resend-verification/page.tsx` | `/resend-verification` | Resend verification email |

### Page States

| State | Display | Action |
|-------|---------|--------|
| Form | Show email input form | User enters email |
| Success | Show confirmation message | Link to login |

### Success Message Display

```
┌────────────────────────────────────┐
│  Verification Email Sent!          │
│                                    │
│          ✓                         │
│      [Green Check]                 │
│                                    │
│  We've sent a new verification     │
│  email to:                         │
│  user@example.com                  │
│                                    │
│  Please check your inbox and click │
│  the verification link. The email  │
│  should arrive within a few        │
│  minutes.                          │
│                                    │
│  Didn't receive it?                │
│  • Check your spam folder          │
│  • Try again in a few minutes      │
│  • Contact support if the problem  │
│    persists                        │
│                                    │
│  [Go to Login]                     │
└────────────────────────────────────┘
```

### Informational Text

| Section | Content |
|---------|---------|
| Header | "Resend Verification Email" |
| Subtitle | "Enter your email address to receive a new verification link" |
| Help Text | "The email should arrive within a few minutes. Be sure to check your spam folder." |

### Page State Management

| Variable | Type | Purpose |
|----------|------|---------|
| isSuccess | boolean | Show success message |
| emailSent | string \| null | Email address for confirmation |

### Expected Outcome
- Dedicated page for resending verification emails
- Clear instructions for users
- Success confirmation after submission
- Professional, helpful UI
- Easy navigation back to login

### Verification Checklist
- [ ] `frontend/app/(auth)/resend-verification/` directory created
- [ ] `frontend/app/(auth)/resend-verification/page.tsx` file created
- [ ] 'use client' directive added
- [ ] Page state variables defined
- [ ] AuthCard and AuthHeading components used
- [ ] Success state rendering implemented
- [ ] Informational text added
- [ ] Success callback defined
- [ ] Page accessible at `/resend-verification` URL

---

## Task 69: Create Resend Verification Form

### Overview
Create the ResendVerificationForm component that allows users to enter their email address to request a new verification email. The form includes email validation, submission handling, and error display.

### Dependencies
- Task 68: Create Resend Verification Page

### Instructions

1. **Create ResendVerificationForm component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `ResendVerificationForm.tsx` file
   - This will be a client component

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for form state and interaction

3. **Import required dependencies**
   - Import React hooks (useState)
   - Import useForm from react-hook-form
   - Import zodResolver from @hookform/resolvers/zod
   - Import Zod for validation
   - Import Form components from Shadcn/UI
   - Import Button and Input components

4. **Define form schema**
   - Create Zod schema for email validation
   - Email field: required, valid email format
   - Export schema and infer TypeScript type

5. **Set up React Hook Form**
   - Initialize useForm with zodResolver
   - Pass email schema to resolver
   - Configure default values (empty email)

6. **Create form state management**
   - Use useState for loading state
   - Use useState for error messages
   - Track submission status

7. **Define component props interface**
   - onSuccess callback prop (receives email address)
   - Optional className prop for styling

8. **Create form structure**
   - Use Shadcn/UI Form component wrapper
   - Add email FormField with label
   - Add submit button
   - Add error alert display

9. **Implement email input field**
   - Use FormField component
   - Add FormLabel "Email Address"
   - Add Input with type="email"
   - Set placeholder text
   - Configure autocomplete="email"
   - Add FormMessage for validation errors

10. **Create submit button**
    - Label: "Send Verification Email"
    - Show loading state during submission
    - Disable when form is invalid or submitting
    - Full width styling

11. **Prepare onSubmit handler**
    - Define async function to handle form submission
    - Accept validated email data
    - Implementation details in Task 70

### Form Structure

```
┌─────────────────────────────────────┐
│  Email Address *                    │
│  ┌───────────────────────────────┐ │
│  │ Enter your email address      │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Send Verification Email]          │
│  (Full-width button)                │
│                                     │
│  [Error Alert - if any]             │
└─────────────────────────────────────┘
```

### Form Schema

```typescript
// Conceptual structure
resendVerificationSchema = {
  email: string (required, valid email format)
}
```

### Email Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Required | Cannot be empty | "Email address is required" |
| Format | Must be valid email | "Please enter a valid email address" |

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | (email: string) => void | Yes | Callback after successful submission |
| className | string | No | Additional CSS classes |

### Form States

| State | Display | Button State |
|-------|---------|--------------|
| Idle | Empty form | Enabled |
| Validating | Validation errors shown | Disabled |
| Submitting | Loading spinner in button | Disabled |
| Error | Error alert displayed | Enabled |

### Submit Button States

| State | Label | Icon | Disabled |
|-------|-------|------|----------|
| Idle | "Send Verification Email" | None | No |
| Loading | "Sending..." | Spinner | Yes |
| Error | "Send Verification Email" | None | No |

### Error Display

```
┌─────────────────────────────────────┐
│  ⚠ Error Sending Email              │
│                                     │
│  [Error message from backend]       │
│                                     │
│  Please try again in a few moments. │
└─────────────────────────────────────┘
```

### Expected Outcome
- Functional resend verification form component
- Email validation with clear error messages
- Loading state during submission
- Error handling and display
- Ready to integrate with API (Task 70)

### Verification Checklist
- [ ] `frontend/components/auth/ResendVerificationForm.tsx` file created
- [ ] 'use client' directive added
- [ ] Form schema defined with Zod
- [ ] React Hook Form initialized
- [ ] Email input field implemented
- [ ] Submit button created
- [ ] Loading state management
- [ ] Error state management
- [ ] onSuccess prop interface defined
- [ ] Form validation working
- [ ] Component exports properly

---

## Task 70: Implement Resend Logic

### Overview
Implement the API integration for resending verification emails. This task creates the API service function, integrates it with the form component, handles responses, and displays appropriate success or error messages.

### Dependencies
- Task 69: Create Resend Verification Form

### Instructions

1. **Create API service function**
   - Navigate to `frontend/lib/api/auth.ts` file
   - Add resendVerificationEmail function
   - Export function for component use

2. **Define resendVerificationEmail function**
   - Accept email as parameter (string)
   - Use fetch or axios to call backend
   - Set endpoint to `/api/auth/resend-verification/`
   - Use POST method

3. **Configure request structure**
   - Set Content-Type header to application/json
   - Include email in request body
   - Handle CORS if needed
   - Set timeout (10 seconds)

4. **Add error handling to API function**
   - Use try-catch block
   - Handle network errors
   - Handle timeout errors
   - Parse error response from backend

5. **Implement onSubmit in form component**
   - In ResendVerificationForm component
   - Define async onSubmit function
   - Accept validated form data (email)

6. **Add submission logic**
   - Set loading state to true
   - Clear previous error messages
   - Call resendVerificationEmail API function
   - Pass email from form data

7. **Handle success response**
   - Check if response status is 200
   - Set loading to false
   - Call onSuccess prop with email address
   - Form disappears (parent handles display)

8. **Handle error responses**
   - Parse error message from backend
   - Set loading to false
   - Update error state with message
   - Display error alert in form

9. **Implement rate limiting handling**
   - Backend may limit resend frequency
   - Show specific message for rate limit errors
   - Display time until next allowed attempt

10. **Add email not found handling**
    - If email doesn't exist in system
    - Show generic success message (security)
    - Don't reveal if email exists or not

### API Request Structure

| Property | Value | Purpose |
|----------|-------|---------|
| Method | POST | Submit email |
| Endpoint | `/api/auth/resend-verification/` | Resend endpoint |
| Headers | Content-Type: application/json | JSON payload |
| Body | { "email": "user@example.com" } | User email |
| Timeout | 10000ms | Prevent hanging |

### Request Flow

```
User Enters Email
    │
    ▼
Form Validation
    │
    ▼
Set Loading State
    │
    ▼
Call API: resendVerificationEmail(email)
    │
    ├──────────────────┬──────────────────┐
    ▼                  ▼                  ▼
Success (200)    Rate Limit (429)   Error (4xx/5xx)
    │                  │                  │
    ▼                  ▼                  ▼
Call onSuccess   Show Wait Msg      Show Error Msg
    │                  │                  │
    ▼                  ▼                  ▼
Show Success     Stay on Form       Stay on Form
```

### API Response Handling

| Response Type | Status Code | Action |
|---------------|-------------|--------|
| Success | 200 | Call onSuccess, show confirmation |
| Email Not Found | 200 | Same as success (security) |
| Rate Limited | 429 | Show wait message |
| Invalid Email | 400 | Show validation error |
| Server Error | 500 | Show generic error |
| Network Error | - | Show connection error |

### Success Response Structure (Expected)

```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "email": "user@example.com"
}
```

### Error Response Structure (Expected)

```json
{
  "error": "rate_limit_exceeded",
  "message": "Please wait before requesting another email",
  "retry_after": 300
}
```

### Error Types and Messages

| Error Type | Backend Code | Display Message |
|------------|--------------|-----------------|
| Rate Limit | rate_limit_exceeded | "Please wait {X} minutes before requesting another email." |
| Invalid Email | invalid_email | "Please enter a valid email address." |
| Server Error | server_error | "Unable to send email. Please try again later." |
| Network Error | - | "Connection error. Please check your internet connection." |

### Rate Limit Handling

```
API Returns 429
    │
    ▼
Parse retry_after value (seconds)
    │
    ▼
Convert to minutes
    │
    ▼
Display: "Please wait X minutes before
requesting another verification email."
    │
    ▼
Optionally: Show countdown timer
```

### Security Consideration: Email Enumeration

| Scenario | Response | Reason |
|----------|----------|--------|
| Email exists | Success message | Send email |
| Email doesn't exist | Success message | Prevent enumeration |

Display same success message regardless of whether email exists in the system to prevent attackers from discovering valid email addresses.

### onSubmit Implementation Steps

| Step | Action |
|------|--------|
| 1 | Validate form data (React Hook Form) |
| 2 | Set isLoading = true |
| 3 | Clear error state |
| 4 | Call resendVerificationEmail(email) |
| 5 | Await response |
| 6 | If success: call onSuccess(email) |
| 7 | If error: set error message |
| 8 | Set isLoading = false |

### Expected Outcome
- API service function for resending verification
- Form integrated with API
- Success and error handling implemented
- Rate limiting handled gracefully
- Security best practices followed
- Clear user feedback for all scenarios

### Verification Checklist
- [ ] API service function created (resendVerificationEmail)
- [ ] Request structure configured correctly
- [ ] Error handling in API function
- [ ] onSubmit handler implemented in form
- [ ] Loading state set during submission
- [ ] Success response handled
- [ ] Error responses handled
- [ ] Rate limiting handled
- [ ] Email enumeration prevented
- [ ] User feedback clear and helpful

---

## Verification Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Email Verification Flow                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
            User Clicks Email Link
                          │
                          ▼
            ┌─────────────────────────┐
            │  /verify-email?token=X  │
            └─────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────┐
            │   Extract Token (T64)   │
            └─────────────────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
              Token Valid   Token Invalid
                    │           │
                    ▼           ▼
            ┌──────────┐  ┌──────────┐
            │  API     │  │  Show    │
            │  Call    │  │  Error   │
            │  (T65)   │  │  (T67)   │
            └──────────┘  └──────────┘
                    │           │
              ┌─────┴─────┐     │
              ▼           ▼     │
        Success (T66)  Error    │
              │         (T67)   │
              │           │     │
              ▼           ▼     ▼
      ┌───────────┐  ┌──────────────────┐
      │ Show      │  │ Offer Resend     │
      │ Success   │  │ Option           │
      │ + Timer   │  │ → /resend-       │
      └───────────┘  │   verification   │
              │      └──────────────────┘
              │               │
              ▼               ▼
        Auto-Redirect    ┌──────────────┐
        to /login        │ Resend Page  │
                         │ (T68)        │
                         └──────────────┘
                                 │
                                 ▼
                         ┌──────────────┐
                         │ Resend Form  │
                         │ (T69)        │
                         └──────────────┘
                                 │
                                 ▼
                         ┌──────────────┐
                         │ Submit Email │
                         │ (T70)        │
                         └──────────────┘
                                 │
                           ┌─────┴─────┐
                           ▼           ▼
                       Success      Error
                           │           │
                           ▼           ▼
                    ┌──────────┐  ┌──────────┐
                    │ Check    │  │ Retry    │
                    │ Email    │  │ Again    │
                    └──────────┘  └──────────┘
```

---

## Testing Scenarios

### Email Verification Testing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Valid Token | 1. Click email link with valid token<br>2. Page loads | Success message, auto-redirect to login after 3s |
| Expired Token | 1. Click email link with expired token<br>2. Page loads | Error message with resend link |
| Invalid Token | 1. Click email link with invalid token<br>2. Page loads | Error message with resend link |
| Missing Token | 1. Visit /verify-email without token<br>2. Page loads | Error message with resend link |
| Already Verified | 1. Click email link for already verified account<br>2. Page loads | Info message with login link |
| Network Error | 1. Click email link while offline<br>2. Page loads | Connection error with retry option |

### Resend Verification Testing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Valid Email | 1. Enter registered email<br>2. Submit form | Success message, email sent |
| Invalid Format | 1. Enter invalid email format<br>2. Submit form | Validation error displayed |
| Empty Email | 1. Leave email empty<br>2. Submit form | Required field error |
| Nonexistent Email | 1. Enter email not in system<br>2. Submit form | Generic success message (security) |
| Rate Limited | 1. Request email twice quickly<br>2. Submit second request | Rate limit error with wait time |
| Network Error | 1. Submit while offline | Connection error message |

### User Experience Testing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Countdown Timer | 1. Verify email successfully<br>2. Observe countdown | Countdown from 3 to 0, then redirect |
| Manual Redirect | 1. Verify email successfully<br>2. Click "Go to Login" | Immediate redirect to login |
| Resend Link Click | 1. See expired token error<br>2. Click resend link | Navigate to /resend-verification |
| Back to Login | 1. On resend page<br>2. Click "Back to Login" | Navigate to /login |
| Form Validation | 1. Enter invalid email<br>2. Move to next field | Error message displays |

### Edge Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Token in URL Fragment | Visit /verify-email#token=X | Token not found error |
| Multiple Tokens | Visit /verify-email?token=X&token=Y | Use first token parameter |
| Very Long Token | Click link with extremely long token | Handle gracefully or show error |
| Special Characters | Token contains special characters | Properly encoded and processed |
| Concurrent Requests | Submit resend form multiple times | Only first request processes |

---

## Notes for AI Agents

### Implementation Priority
1. Complete verification page first (Tasks 63-67)
2. Test verification flow thoroughly
3. Then build resend functionality (Tasks 68-70)
4. Ensure all error scenarios are handled

### State Management
- Use local component state (useState)
- No need for global state (Zustand/Context)
- Each page manages its own state independently

### URL Token Extraction
- Token is passed as query parameter: `?token=abc123`
- Use Next.js useSearchParams hook
- Extract on component mount
- Validate before API call

### Auto-Redirect Timing
- 3 seconds is standard for success redirect
- Use setInterval for countdown
- Clear interval on component unmount
- Provide manual redirect option immediately

### Error Message Tone
- Be helpful and clear
- Don't blame the user
- Provide actionable next steps
- Maintain professional tone

### Security Considerations
- Don't reveal if email exists (resend page)
- Show same success message for existing/non-existing emails
- Implement rate limiting client-side hints
- Don't expose sensitive error details

### API Integration
- All API calls in `lib/api/auth.ts`
- Consistent error handling across calls
- Timeout set to 10 seconds
- Parse error responses properly

### Accessibility
- All form inputs have labels
- Error messages associated with fields
- Success/error states announced to screen readers
- Keyboard navigation works throughout

### Mobile Considerations
- Email input triggers email keyboard
- Buttons are easily tappable (min 44px)
- Messages are readable on small screens
- Loading states are clear

### Component Reusability
- Form component accepts onSuccess callback
- Can be reused in different contexts if needed
- Props interface clearly defined
- No hardcoded dependencies

---

## Summary

This document covered the complete email verification flow (Tasks 63-70):

**Verification Page (63-67):**
- Created verify email page at `/verify-email`
- Extracted verification token from URL
- Implemented API call to verify token
- Handled success with auto-redirect
- Handled various error scenarios

**Resend Verification (68-70):**
- Created resend verification page at `/resend-verification`
- Built form component with email validation
- Implemented API integration for resending
- Added rate limiting handling
- Applied security best practices

All verification workflows are now complete with comprehensive error handling, clear user feedback, and proper state management. The next document covers two-factor authentication (2FA) setup and verification flows.

---

**End of Document 01**
