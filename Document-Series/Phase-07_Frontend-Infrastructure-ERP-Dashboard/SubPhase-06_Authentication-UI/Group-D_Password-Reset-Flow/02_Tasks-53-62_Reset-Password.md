# Tasks 53-62: Reset Password Page and Flow

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** D - Password Reset Flow  
> **Document:** 02 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-47-52_Forgot-Password.md](01_Tasks-47-52_Forgot-Password.md)

---

## Document Overview

This document covers the creation of the reset password page and complete flow for setting a new password using a reset token. It includes setting up the reset password route, creating Zod validation schema for password fields, building the ResetPasswordForm component, extracting and validating the reset token from URL, handling expired tokens, implementing submission to the backend API, handling success with automatic redirect to login, comprehensive error handling, and testing the complete password reset flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create Reset Password Page | Low | 20 min |
| 54 | Create Reset Password Schema | Low | 25 min |
| 55 | Create Reset Password Form | Medium | 35 min |
| 56 | Extract Token from URL | Low | 15 min |
| 57 | Validate Reset Token | Medium | 30 min |
| 58 | Handle Expired Token | Low | 20 min |
| 59 | Implement Reset Submission | Medium | 35 min |
| 60 | Handle Reset Success | Low | 25 min |
| 61 | Handle Reset Errors | Low | 25 min |
| 62 | Test Password Reset Flow | Low | 30 min |

---

## Task 53: Create Reset Password Page

### Overview
Create the reset password page route that users land on after clicking the reset link from their email. This page extracts the reset token from the URL, validates it, and displays a form for users to enter their new password. The page provides clear feedback throughout the token validation and password reset process.

### Dependencies
- Task 14: Verify Auth Layout Structure

### Instructions

1. **Create reset-password directory**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new directory named `reset-password`
   - This follows Next.js App Router convention

2. **Create page component file**
   - Create `page.tsx` file inside `reset-password/` directory
   - This will be the reset password page component

3. **Import required dependencies**
   - Import React types
   - Import Metadata type from Next.js
   - Import useSearchParams from next/navigation
   - Import auth components (AuthCard, AuthHeading)
   - Import ResetPasswordForm component (to be created in Task 55)

4. **Define page metadata**
   - Export metadata object with type `Metadata`
   - Set title to "Reset Password"
   - Set description: "Set your new password"

5. **Create page component**
   - Define default export function `ResetPasswordPage`
   - Mark as client component with 'use client'
   - Extract token from URL query parameters

6. **Implement token extraction logic**
   - Use useSearchParams hook
   - Get token parameter from URL
   - Handle missing token scenario

7. **Create conditional rendering**
   - If token missing: Show error message
   - If token present: Show ResetPasswordForm
   - Pass token to form component

8. **Add error state for missing token**
   - Show clear error message
   - "Invalid or missing reset token"
   - Add link to request new reset

9. **Implement page structure**
   - Wrap content in AuthCard component
   - Add AuthHeading with title and subtitle
   - Conditionally render form or error

### Page Structure with Token

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │      Reset Password          │   │
│    │  Enter your new password     │   │
│    │                              │   │
│    │  [Reset Password Form]       │   │
│    │                              │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### Page Structure without Token

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │      Invalid Link            │   │
│    │                              │   │
│    │  ⚠️ The reset link is        │   │
│    │     invalid or missing.      │   │
│    │                              │   │
│    │  [Request New Reset Link]    │   │
│    │                              │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL Example | Purpose |
|-----------|-------------|---------|
| `app/(auth)/reset-password/page.tsx` | `/reset-password?token=abc123xyz` | Reset password with token |

### Page Metadata

| Field | Value | Purpose |
|-------|-------|---------|
| title | "Reset Password" | Browser tab title |
| description | "Set your new password for LankaCommerce Cloud" | SEO description |

### Token Parameter Handling

| Scenario | URL | Display |
|----------|-----|---------|
| Token present | `/reset-password?token=abc123` | ResetPasswordForm |
| Token missing | `/reset-password` | Error message |
| Invalid token | `/reset-password?token=invalid` | Form (validated in Task 57) |

### Missing Token Error Structure

```
┌─────────────────────────────────────┐
│         Invalid Reset Link          │
│                                     │
│  ⚠️  The reset link is invalid or   │
│      missing.                       │
│                                     │
│  Please request a new password      │
│  reset link.                        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Request New Reset Link       │ │
│  └───────────────────────────────┘ │
│                                     │
│         Back to Login               │
└─────────────────────────────────────┘
```

### Expected Outcome
- Functional reset password page accessible at `/reset-password`
- Token extracted from URL query parameters
- Conditional rendering based on token presence
- Clear error handling for missing token
- Ready to receive ResetPasswordForm component
- Proper metadata for SEO

### Verification Checklist
- [ ] `frontend/app/(auth)/reset-password/` directory created
- [ ] `frontend/app/(auth)/reset-password/page.tsx` file created
- [ ] 'use client' directive added
- [ ] useSearchParams hook used for token extraction
- [ ] Metadata exported with title and description
- [ ] Page component structure implemented
- [ ] Token extraction logic implemented
- [ ] Conditional rendering for missing token
- [ ] Error message for missing token
- [ ] Link to request new reset
- [ ] ResetPasswordForm component imported
- [ ] Page accessible at `/reset-password` URL

---

## Task 54: Create Reset Password Schema

### Overview
Create a Zod validation schema for the reset password form that validates both password fields with comprehensive security requirements including minimum length, strength rules, and confirmation matching. This schema ensures that users set strong, secure passwords that meet the application's security standards.

### Dependencies
- Task 53: Create Reset Password Page

### Instructions

1. **Create validation file**
   - Navigate to `frontend/lib/validations/` directory
   - Create `resetPassword.ts` file
   - This will contain reset password-specific schemas

2. **Import Zod library**
   - Import z from 'zod'
   - Ensure Zod is installed in project dependencies

3. **Define password validation rules**
   - Create password base schema
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character (optional but recommended)

4. **Define reset password schema**
   - Create `resetPasswordSchema` using `z.object()`
   - Define password field with validation
   - Define confirmPassword field
   - Add refinement for password matching

5. **Configure password field**
   - Set as required field
   - Add minimum length validation (8 characters)
   - Add maximum length validation (128 characters)
   - Add pattern validation for strength
   - Add custom error messages for each rule

6. **Configure confirmPassword field**
   - Set as required field
   - Basic string validation
   - Will be compared with password in refinement

7. **Add password matching refinement**
   - Use z.refine() or z.superRefine()
   - Compare password and confirmPassword
   - Add custom error message
   - Set error path to confirmPassword field

8. **Create password strength helper**
   - Define helper function to check strength
   - Return strength level (weak, medium, strong)
   - Use for client-side feedback

9. **Export TypeScript type**
   - Infer TypeScript type from schema
   - Export as `ResetPasswordFormData` type
   - Use for type safety throughout components

10. **Add schema documentation**
    - Include JSDoc comments explaining rules
    - Document password requirements
    - Add usage examples in comments

### Schema Structure

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| password | string | Yes | Min 8, max 128, strength requirements |
| confirmPassword | string | Yes | Must match password |

### Password Validation Rules Detail

```
Password Field:
├── Required: Cannot be empty
├── Min Length: At least 8 characters
├── Max Length: Maximum 128 characters
├── Pattern: At least one uppercase letter
├── Pattern: At least one lowercase letter
├── Pattern: At least one number
├── Pattern: At least one special character (recommended)
└── Error Messages:
    ├── Empty: "Password is required"
    ├── Too Short: "Password must be at least 8 characters"
    ├── Too Long: "Password must not exceed 128 characters"
    ├── No Uppercase: "Password must contain at least one uppercase letter"
    ├── No Lowercase: "Password must contain at least one lowercase letter"
    ├── No Number: "Password must contain at least one number"
    └── No Special: "Password should contain at least one special character"

Confirm Password Field:
├── Required: Cannot be empty
└── Match: Must match password field

Password Matching Refinement:
└── Validation: password === confirmPassword
    └── Error: "Passwords do not match"
```

### Password Strength Levels

| Strength | Criteria | Example |
|----------|----------|---------|
| Weak | Only meets minimum length | "password123" |
| Medium | Has 3 of 4 character types | "Password123" |
| Strong | Has all 4 character types | "P@ssw0rd123" |

### Character Type Requirements

| Type | Pattern | Example |
|------|---------|---------|
| Uppercase | /[A-Z]/ | A, B, C... Z |
| Lowercase | /[a-z]/ | a, b, c... z |
| Number | /[0-9]/ | 0, 1, 2... 9 |
| Special | /[!@#$%^&*(),.?":{}|<>]/ | !@#$%^&* |

### Validation Examples

| Password | Confirm | Valid | Error Message |
|----------|---------|-------|---------------|
| "" | "" | No | "Password is required" |
| "Pass1" | "Pass1" | No | "Password must be at least 8 characters" |
| "password123" | "password123" | No | "Password must contain at least one uppercase letter" |
| "PASSWORD123" | "PASSWORD123" | No | "Password must contain at least one lowercase letter" |
| "Password" | "Password" | No | "Password must contain at least one number" |
| "Password123" | "Password123" | Yes | - |
| "P@ssw0rd123" | "P@ssw0rd123" | Yes | - (Strong) |
| "Password123" | "Password456" | No | "Passwords do not match" |

### Schema Implementation Pattern

```
resetPasswordSchema:
  └── password field
      ├── z.string()
      ├── .min(8, "Password must be at least 8 characters")
      ├── .max(128, "Password must not exceed 128 characters")
      ├── .regex(/[A-Z]/, "Must contain uppercase letter")
      ├── .regex(/[a-z]/, "Must contain lowercase letter")
      └── .regex(/[0-9]/, "Must contain number")
  └── confirmPassword field
      └── z.string()
  └── refinement
      └── password === confirmPassword
```

### Type Safety

| Export | Purpose | Usage |
|--------|---------|-------|
| resetPasswordSchema | Runtime validation | Form validation |
| ResetPasswordFormData | TypeScript type | Component props, state |
| checkPasswordStrength | Helper function | UI strength indicator |

### Security Considerations

| Rule | Purpose | Security Benefit |
|------|---------|------------------|
| Min 8 characters | Increase entropy | Harder to brute force |
| Mixed case | Complexity | Increase keyspace |
| Numbers required | Complexity | Increase keyspace |
| Special characters | Complexity | Maximum security |
| Max 128 characters | Prevent abuse | DOS protection |

### Expected Outcome
- Zod schema for reset password validation
- Comprehensive password strength requirements
- Password matching validation
- TypeScript type for form data
- Clear, specific error messages
- Password strength helper function
- Reusable validation logic

### Verification Checklist
- [ ] `frontend/lib/validations/resetPassword.ts` file created
- [ ] Zod library imported
- [ ] resetPasswordSchema defined
- [ ] Password field with min/max length
- [ ] Password pattern validation (uppercase, lowercase, number)
- [ ] confirmPassword field defined
- [ ] Password matching refinement added
- [ ] Custom error messages for all rules
- [ ] ResetPasswordFormData type exported
- [ ] Password strength helper function created
- [ ] JSDoc documentation added

---

## Task 55: Create Reset Password Form

### Overview
Create the ResetPasswordForm component that provides the interface for users to set a new password. This component uses React Hook Form with Zod validation, displays password strength feedback, manages form state, and handles the submission process. The form includes password visibility toggles and clear validation feedback.

### Dependencies
- Task 54: Create Reset Password Schema

### Instructions

1. **Create ResetPasswordForm component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `ResetPasswordForm.tsx` file
   - This will be a client component

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for form interactivity and state management

3. **Import required dependencies**
   - Import React hooks (useState)
   - Import useForm from react-hook-form
   - Import zodResolver from @hookform/resolvers/zod
   - Import resetPasswordSchema and ResetPasswordFormData type
   - Import Form components from Shadcn/UI
   - Import icons (Eye, EyeOff) from Lucide React
   - Import auth service methods

4. **Define component props**
   - token: string (required) - Reset token from URL
   - onSuccess?: () => void (optional) - Success callback

5. **Set up React Hook Form**
   - Initialize useForm with zodResolver
   - Pass resetPasswordSchema to resolver
   - Configure default values for both password fields
   - Set validation mode to "onChange" for immediate feedback

6. **Create form state management**
   - Use useState for isLoading state
   - Use useState for error message
   - Use useState for showPassword (visibility toggle)
   - Use useState for showConfirmPassword (visibility toggle)
   - Use useState for passwordStrength (weak/medium/strong)

7. **Implement password strength calculation**
   - Watch password field value
   - Calculate strength on change
   - Update passwordStrength state
   - Use for visual strength indicator

8. **Create form submission handler**
   - Create onSubmit function (async)
   - Accept validated form data
   - Will be implemented in Task 59

9. **Implement password input field**
   - Use FormField with control
   - Add FormLabel "New Password"
   - Add Input with type toggle (password/text)
   - Add password visibility toggle button
   - Add FormMessage for errors

10. **Add password strength indicator**
    - Display below password field
    - Show colored bar (red/yellow/green)
    - Show text label (Weak/Medium/Strong)
    - Update based on password strength

11. **Implement confirm password field**
    - Use FormField structure
    - Add FormLabel "Confirm Password"
    - Add Input with type toggle
    - Add visibility toggle button
    - Add FormMessage for errors

12. **Add password requirements list**
    - Display below password field
    - Show all requirements as checklist
    - Check/uncheck based on validation
    - Use icons (check/x) for visual feedback

13. **Add submit button**
    - Text: "Reset Password"
    - Full width button
    - Show loading state with spinner
    - Disable when loading

### Component Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| token | string | Yes | - | Reset token from URL |
| onSuccess | () => void | No | undefined | Callback after successful reset |

### Component Structure

```
┌─────────────────────────────────────┐
│  New Password *                     │
│  ┌───────────────────────────────┐ │
│  │ ••••••••••••          [👁]    │ │ ← Visibility toggle
│  └───────────────────────────────┘ │
│  [Strength indicator bar]         │
│  Password Strength: Medium         │
│                                     │
│  Requirements:                      │
│  ✓ At least 8 characters            │
│  ✓ One uppercase letter             │
│  ✓ One lowercase letter             │
│  ✓ One number                       │
│  ✗ One special character            │
│                                     │
│  Confirm Password *                 │
│  ┌───────────────────────────────┐ │
│  │ ••••••••••••          [👁]    │ │
│  └───────────────────────────────┘ │
│  [Error: Passwords do not match]  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Reset Password             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Form State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| isLoading | boolean | false | Submission in progress |
| error | string \| null | null | Error message to display |
| showPassword | boolean | false | Password visibility |
| showConfirmPassword | boolean | false | Confirm password visibility |
| passwordStrength | 'weak' \| 'medium' \| 'strong' | 'weak' | Strength level |

### React Hook Form Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| resolver | zodResolver(resetPasswordSchema) | Zod validation |
| mode | "onChange" | Immediate validation |
| defaultValues | { password: "", confirmPassword: "" } | Initial state |

### Password Input Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | password/text | Toggle visibility |
| name | "password" | React Hook Form field name |
| placeholder | "Enter new password" | User guidance |
| autocomplete | "new-password" | Browser behavior |

### Password Strength Indicator

| Strength | Color | Bar Width | Text |
|----------|-------|-----------|------|
| Weak | Red (#EF4444) | 33% | "Weak" |
| Medium | Yellow (#F59E0B) | 66% | "Medium" |
| Strong | Green (#10B981) | 100% | "Strong" |

### Strength Indicator Structure

```
┌─────────────────────────────────────┐
│  [████████░░░░░░░░░░░░░░░░░░░░░]   │ ← 33% (Red - Weak)
│  Password Strength: Weak            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [████████████████░░░░░░░░░░░░░░]   │ ← 66% (Yellow - Medium)
│  Password Strength: Medium          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [████████████████████████████████] │ ← 100% (Green - Strong)
│  Password Strength: Strong          │
└─────────────────────────────────────┘
```

### Password Requirements Checklist

| Requirement | Validation | Icon |
|-------------|------------|------|
| At least 8 characters | password.length >= 8 | ✓ / ✗ |
| One uppercase letter | /[A-Z]/.test(password) | ✓ / ✗ |
| One lowercase letter | /[a-z]/.test(password) | ✓ / ✗ |
| One number | /[0-9]/.test(password) | ✓ / ✗ |
| One special character | /[!@#$%^&*]/.test(password) | ✓ / ✗ |

### Visibility Toggle Implementation

| State | Icon | Input Type | Purpose |
|-------|------|------------|---------|
| Hidden | Eye | password | Default secure state |
| Visible | EyeOff | text | Show password |

### Form Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Labels | Associated with inputs via htmlFor |
| Error Messages | Announced to screen readers |
| Required Fields | Marked with aria-required |
| Password Strength | Aria-live region for updates |
| Visibility Toggle | Aria-label on button |
| Keyboard Navigation | Logical tab order |

### Expected Outcome
- Functional reset password form component
- React Hook Form integration with Zod validation
- Password and confirm password fields
- Password visibility toggles
- Password strength indicator with visual feedback
- Password requirements checklist
- Submit button with loading state
- Accessibility features implemented

### Verification Checklist
- [ ] `frontend/components/auth/ResetPasswordForm.tsx` file created
- [ ] 'use client' directive added
- [ ] Component props interface defined
- [ ] React Hook Form initialized with zodResolver
- [ ] resetPasswordSchema integrated
- [ ] Form state (loading, error, visibility, strength) managed
- [ ] Password FormField added
- [ ] Password visibility toggle implemented
- [ ] Password strength indicator created
- [ ] Password requirements checklist added
- [ ] Confirm password FormField added
- [ ] Confirm password visibility toggle implemented
- [ ] Submit button with loading state
- [ ] onSubmit handler defined (stub)
- [ ] Accessibility attributes set
- [ ] Component exports properly

---

## Task 56: Extract Token from URL

### Overview
Implement the logic to extract the reset token from the URL query parameters in the reset password page. This task ensures the token is properly retrieved, validated for presence, and passed to the ResetPasswordForm component for use in the password reset API call.

### Dependencies
- Task 53: Create Reset Password Page

### Instructions

1. **Import useSearchParams hook**
   - Import from 'next/navigation'
   - This is the App Router way to access query parameters
   - Provides type-safe access to URL search params

2. **Initialize useSearchParams in page component**
   - Call useSearchParams() hook
   - Store result in searchParams constant
   - Use in component body (not during render)

3. **Extract token parameter**
   - Call searchParams.get('token')
   - Store in token constant
   - Handle null case (token not present)

4. **Validate token presence**
   - Check if token is null or empty string
   - Use for conditional rendering
   - Show error state if missing

5. **Pass token to form component**
   - Pass as prop to ResetPasswordForm
   - Ensure token is string type (not null)
   - Handle TypeScript type safety

6. **Add loading state for client-side hydration**
   - Use useState for mounted state
   - Prevent hydration mismatch
   - Show loading spinner during hydration

7. **Implement error state for missing token**
   - Create error message component
   - Show when token is null
   - Include link to request new reset

8. **Add token format validation**
   - Check token length (minimum)
   - Check token format (alphanumeric)
   - Show error if format invalid

### URL Parameter Structure

| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| token | string | Yes | abc123xyz789 |

### URL Examples

| URL | Token Value | Valid |
|-----|-------------|-------|
| `/reset-password?token=abc123` | "abc123" | Yes (if verified by backend) |
| `/reset-password` | null | No |
| `/reset-password?token=` | "" | No |
| `/reset-password?token=abc` | "abc" | Maybe (depends on backend) |

### Token Extraction Flow

```
Page Loads
    │
    ▼
useSearchParams() initializes
    │
    ▼
Extract token parameter
    │
    ├──── Token present ──────┐
    │                         ▼
    │                    Validate format
    │                         │
    │                    ├─── Valid ────┐
    │                    │               ▼
    │                    │          Pass to form
    │                    │          Show form
    │                    │
    │                    └─── Invalid ──┐
    │                                   ▼
    │                              Show error
    │
    └──── Token missing ──────────────────┐
                                          ▼
                                     Show error
                                     Link to forgot password
```

### Token Validation Logic

| Check | Condition | Error Message |
|-------|-----------|---------------|
| Presence | token !== null && token !== "" | "Reset token is missing" |
| Length | token.length >= 20 | "Invalid reset token" |
| Format | /^[a-zA-Z0-9-_]+$/.test(token) | "Invalid reset token format" |

### Client-Side Hydration Handling

```
Component Mounts (Server)
    │
    ▼
Render loading state
    │
    ▼
Component Hydrates (Client)
    │
    ▼
useSearchParams available
    │
    ▼
Extract token
    │
    ▼
Render form or error
```

### Implementation Pattern

```typescript
'use client'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return <LoadingSpinner />
  }
  
  const token = searchParams.get('token')
  
  if (!token) {
    return <MissingTokenError />
  }
  
  return <ResetPasswordForm token={token} />
}
```

### Error Display for Missing Token

```
┌─────────────────────────────────────┐
│  ⚠️  Invalid or Missing Token       │
│                                     │
│  The password reset link is         │
│  invalid or has been removed.       │
│                                     │
│  Please request a new password      │
│  reset link.                        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Request New Reset Link       │ │
│  └───────────────────────────────┘ │
│                                     │
│         Back to Login               │
└─────────────────────────────────────┘
```

### Expected Outcome
- Token successfully extracted from URL
- Proper handling of missing token
- Client-side hydration handled correctly
- Token passed to form component
- Error state displayed when token missing
- Type-safe implementation

### Verification Checklist
- [ ] useSearchParams imported from next/navigation
- [ ] useSearchParams hook initialized
- [ ] Token extracted with searchParams.get('token')
- [ ] Token presence validation implemented
- [ ] Conditional rendering based on token
- [ ] Error component for missing token
- [ ] Link to request new reset in error
- [ ] Token passed to ResetPasswordForm as prop
- [ ] Client-side hydration handled
- [ ] Loading state during hydration
- [ ] TypeScript types correctly applied

---

## Task 57: Validate Reset Token

### Overview
Implement token validation logic that verifies the reset token with the backend API before allowing the user to proceed with password reset. This task ensures tokens are valid, not expired, and not already used, providing immediate feedback to users about the token status.

### Dependencies
- Task 56: Extract Token from URL

### Instructions

1. **Create token validation state**
   - Add isValidating state (boolean)
   - Add isTokenValid state (boolean | null)
   - Add tokenError state (string | null)
   - Use in ResetPasswordForm component

2. **Import authentication service**
   - Import authService from lib/services
   - Ensure validateResetToken method exists
   - Configure API endpoint

3. **Create validateToken function**
   - Define async function
   - Accept token parameter
   - Call API to validate token

4. **Implement validation on mount**
   - Use useEffect hook
   - Trigger validation when component mounts
   - Depend on token prop

5. **Set validating state**
   - Set isValidating to true before API call
   - Show loading spinner during validation
   - Disable form inputs

6. **Call validation API**
   - Invoke authService.validateResetToken(token)
   - Pass token from props
   - Await response

7. **Handle valid token response**
   - Set isTokenValid to true
   - Clear any errors
   - Enable form for password input
   - Set isValidating to false

8. **Handle invalid token response**
   - Set isTokenValid to false
   - Set tokenError with message
   - Show error UI (Task 58)
   - Set isValidating to false

9. **Handle expired token specifically**
   - Detect expired token error from API
   - Set specific error message
   - Show expired token UI (Task 58)

10. **Add retry functionality**
    - Allow user to retry validation
    - Button: "Try Again"
    - Reset validation state
    - Re-run validation

11. **Implement loading UI**
    - Show spinner during validation
    - Message: "Validating reset link..."
    - Prevent form interaction

### Token Validation Flow

```
Component Mounts
    │
    ▼
Extract token from URL
    │
    ▼
Set isValidating = true
Show loading spinner
    │
    ▼
Call authService.validateResetToken(token)
    │
    ├──── Valid Token ────────┐
    │                         ▼
    │                    Set isTokenValid = true
    │                    Clear errors
    │                    Show form
    │
    ├──── Expired Token ──────┐
    │                         ▼
    │                    Set isTokenValid = false
    │                    Set tokenError = "expired"
    │                    Show expired UI (Task 58)
    │
    ├──── Invalid Token ──────┐
    │                         ▼
    │                    Set isTokenValid = false
    │                    Set tokenError = "invalid"
    │                    Show error UI
    │
    └──── Network Error ──────┐
                              ▼
                         Set tokenError = "network"
                         Allow retry
    │
    ▼
Set isValidating = false
```

### Validation State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| isValidating | boolean | true | Validation in progress |
| isTokenValid | boolean \| null | null | Token validity status |
| tokenError | string \| null | null | Error type/message |

### Validation States

| isValidating | isTokenValid | Display |
|--------------|--------------|---------|
| true | null | Loading spinner |
| false | true | Show form |
| false | false | Show error |
| false | null | Show error (validation failed) |

### Token Validation Error Types

| Error Type | API Response | User Message |
|------------|--------------|--------------|
| expired | 410 Gone | "This reset link has expired" |
| invalid | 400 Bad Request | "This reset link is invalid" |
| used | 409 Conflict | "This reset link has already been used" |
| network | Connection error | "Network error. Please try again." |
| server | 500 Server Error | "Server error. Please try again." |

### Loading UI During Validation

```
┌─────────────────────────────────────┐
│           [Spinner Icon]            │
│                                     │
│      Validating reset link...       │
│                                     │
│         Please wait                 │
└─────────────────────────────────────┘
```

### Authentication Service Method

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| validateResetToken | token: string | Promise<{ valid: boolean }> | Validate token with backend |

### API Endpoint

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/auth/validate-reset-token` | POST | { token: string } | { valid: boolean, error?: string } |

### Retry Functionality

```
Validation Failed
    │
    ▼
Show error message
    │
    ▼
Show "Try Again" button
    │
    ▼
User clicks button
    │
    ▼
Reset validation state
    │
    ▼
Re-run validation
```

### Expected Outcome
- Token validation on page load
- Loading state during validation
- Valid tokens allow form display
- Invalid/expired tokens show error
- Network errors allow retry
- Clear user feedback throughout
- Foundation for expired token handling (Task 58)

### Verification Checklist
- [ ] Validation state variables created
- [ ] authService.validateResetToken imported
- [ ] validateToken function implemented
- [ ] useEffect triggers validation on mount
- [ ] isValidating state managed properly
- [ ] Loading UI displayed during validation
- [ ] Valid token enables form
- [ ] Invalid token shows error
- [ ] Expired token detected separately
- [ ] Network errors handled with retry
- [ ] Retry functionality implemented
- [ ] Error messages are clear and actionable

---

## Task 58: Handle Expired Token

### Overview
Implement specific UI and user experience for expired reset tokens. This task creates a dedicated expired token state that clearly communicates to users that their reset link has expired, provides information about token expiration, and offers a clear path to request a new reset link.

### Dependencies
- Task 57: Validate Reset Token

### Instructions

1. **Detect expired token state**
   - Check tokenError === 'expired' or similar
   - Check API response for expiration indicator
   - Separate from other error types

2. **Create expired token UI component**
   - Design dedicated expired token message
   - Use warning/info styling (not destructive)
   - Clear, user-friendly messaging

3. **Add expired token icon**
   - Use clock or expired icon
   - Import from Lucide React
   - Size appropriately
   - Use warning color (orange/yellow)

4. **Create expired token heading**
   - Text: "Reset Link Expired"
   - Prominent heading size
   - Clear, direct language

5. **Add expiration explanation**
   - Explain why it expired
   - "For security, reset links expire after 1 hour"
   - Set user expectations

6. **Include request new link button**
   - Primary action button
   - Text: "Request New Reset Link"
   - Links to forgot password page
   - Full-width button

7. **Add secondary action**
   - Link to login page
   - Text: "Back to Login"
   - Secondary styling

8. **Show timestamp information (optional)**
   - Display when link was sent
   - Show time elapsed
   - Help user understand timing

9. **Implement redirect to forgot password**
   - Use Next.js router
   - Navigate to /forgot-password
   - Optionally pre-fill email if available

10. **Add analytics tracking**
    - Track expired token views
    - Monitor conversion to new request
    - Identify expiration issues

### Expired Token UI Structure

```
┌─────────────────────────────────────┐
│         [⏰ Clock Icon]              │
│                                     │
│      Reset Link Expired             │
│                                     │
│  This password reset link has       │
│  expired.                           │
│                                     │
│  For security, reset links are      │
│  valid for 1 hour only.             │
│                                     │
│  Please request a new reset link    │
│  to continue.                       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Request New Reset Link       │ │
│  └───────────────────────────────┘ │
│                                     │
│         Back to Login               │
└─────────────────────────────────────┘
```

### Expired Token Detection

| Source | Indicator | Action |
|--------|-----------|--------|
| API status | 410 Gone | Set tokenError = 'expired' |
| API response | { error: 'expired' } | Show expired UI |
| API response | { message: 'Token expired' } | Show expired UI |

### Expiration Time Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Token lifetime | 1 hour | Security best practice |
| Warning threshold | 50 minutes | Optional: warn before expiry |
| Grace period | None | Strict expiration |

### Expired vs Invalid Token

| Scenario | Status | UI | Action |
|----------|--------|----|----|
| Expired token | 410 Gone | Expired UI | Request new link |
| Invalid token | 400 Bad Request | Error UI | Request new link |
| Used token | 409 Conflict | Used UI | Request new link |

### Expired Token Message Content

| Section | Content | Purpose |
|---------|---------|---------|
| Heading | "Reset Link Expired" | Clear status |
| Explanation | Token validity period | Educate user |
| Action | Request new link | Clear next step |
| Alternative | Back to login | Secondary option |

### Redirect to Forgot Password

```
User Clicks "Request New Reset Link"
    │
    ▼
router.push('/forgot-password')
    │
    ▼
Forgot password page loads
    │
    ▼
Optional: Pre-fill email if available
    │
    ▼
User submits new request
```

### Used Token UI (Similar Pattern)

```
┌─────────────────────────────────────┐
│         [✓ Check Icon]              │
│                                     │
│   Link Already Used                 │
│                                     │
│  This password reset link has       │
│  already been used.                 │
│                                     │
│  If you need to reset your password │
│  again, please request a new link.  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Request New Reset Link       │ │
│  └───────────────────────────────┘ │
│                                     │
│         Back to Login               │
└─────────────────────────────────────┘
```

### Token State Display Matrix

| Token State | Icon | Color | Heading | Primary Action |
|-------------|------|-------|---------|----------------|
| Expired | Clock | Orange | "Reset Link Expired" | Request new |
| Invalid | Alert | Red | "Invalid Reset Link" | Request new |
| Used | Check | Blue | "Link Already Used" | Request new |

### Expected Outcome
- Dedicated UI for expired tokens
- Clear explanation of expiration
- Easy path to request new link
- Differentiation from other errors
- Positive user experience despite error
- Clear next steps

### Verification Checklist
- [ ] Expired token detection implemented
- [ ] Expired token UI component created
- [ ] Appropriate icon added
- [ ] Expired token heading created
- [ ] Expiration explanation added
- [ ] "Request New Reset Link" button added
- [ ] Button links to /forgot-password
- [ ] "Back to Login" link added
- [ ] Conditional rendering based on tokenError
- [ ] Similar UI for used tokens
- [ ] Clear differentiation from invalid tokens
- [ ] Analytics tracking implemented

---

## Task 59: Implement Reset Submission

### Overview
Implement the form submission logic that sends the new password and reset token to the backend API to complete the password reset. This task handles the API call, manages loading states, validates the response, and coordinates the transition to success or error states.

### Dependencies
- Task 55: Create Reset Password Form

### Instructions

1. **Import authentication service**
   - Import authService from lib/services
   - Ensure resetPassword method is available
   - Verify API endpoint configuration

2. **Implement onSubmit function**
   - Make function async
   - Accept validated form data
   - Accept token from props

3. **Add pre-submission validation**
   - Reset any existing error state
   - Verify form data is valid (React Hook Form does this)
   - Check if already in loading state

4. **Set loading state**
   - Set isLoading to true at start
   - Disable all form inputs
   - Show loading spinner on button

5. **Prepare API request data**
   - Extract password from form data
   - Include reset token from props
   - Create request payload

6. **Call reset password API**
   - Invoke authService.resetPassword(token, password)
   - Pass token and new password
   - Await the API response

7. **Handle API response**
   - Check if response indicates success
   - Extract any relevant data
   - Prepare for success state transition

8. **Update success state**
   - Set isSuccess to true
   - Clear any error state
   - Trigger success handling (Task 60)

9. **Implement error handling**
   - Catch any thrown errors
   - Parse error response from API
   - Extract meaningful error message
   - Update error state with message
   - Handle specific error types

10. **Reset loading state**
    - Always set isLoading to false in finally block
    - Ensure UI returns to interactive state

11. **Add request timeout**
    - Implement timeout for API call (30 seconds)
    - Handle timeout as specific error case
    - Provide clear timeout error message

### Reset Submission Flow

```
User Submits Form
    │
    ▼
React Hook Form Validates
    │
    ├─── Invalid ───→ Show validation errors
    │
    ▼
onSubmit called with valid data
    │
    ▼
Set isLoading = true
Disable form
    │
    ▼
Call authService.resetPassword(token, password)
    │
    ├──── Success ────────┐
    │                     ▼
    │               Set isSuccess = true
    │               Clear errors
    │               Show success UI (Task 60)
    │               Redirect to login (Task 60)
    │
    ├──── Token Error ────┐
    │                     ▼
    │               Parse error type
    │               Set error message
    │               Show error UI (Task 61)
    │
    ├──── Password Error ─┐
    │                     ▼
    │               Show password error
    │               Keep form editable
    │
    └──── Network Error ──┐
                          ▼
                     Show network error
                     Allow retry
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
| 3 | Prepare data | Format request payload |
| 4 | Call API | Send reset request |
| 5 | Parse response | Extract success/error |
| 6 | Update state | Show result to user |
| 7 | Reset loading | Re-enable UI or redirect |

### Authentication Service Method

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| resetPassword | token: string, password: string | Promise<void> | Reset password with token |

### API Endpoint

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/auth/reset-password` | POST | { token: string, password: string } | { success: boolean, message?: string } |

### Request Payload Structure

```json
{
  "token": "abc123xyz789...",
  "password": "NewSecureP@ssw0rd"
}
```

### Error Types to Handle

| Error Type | HTTP Status | User Message | Recovery |
|------------|-------------|--------------|----------|
| Token expired | 410 | "Reset link has expired" | Request new link |
| Token invalid | 400 | "Invalid reset link" | Request new link |
| Token used | 409 | "Reset link already used" | Request new link |
| Password weak | 400 | "Password does not meet requirements" | Fix password |
| Network error | - | "Network error. Please try again." | Retry |
| Server error | 500 | "Server error. Please try again." | Retry |
| Timeout | - | "Request timed out. Please try again." | Retry |

### State Management During Submission

| State | Before | During | Success | Error |
|-------|--------|--------|---------|-------|
| isLoading | false | true | false | false |
| isSuccess | false | false | true | false |
| error | null | null | null | "message" |

### Form Behavior During Submission

| Element | State | Behavior |
|---------|-------|----------|
| Password inputs | Disabled | Cannot edit |
| Submit button | Disabled | Shows spinner |
| Error alert | Hidden | Not shown |
| Form | Disabled | No interaction |

### Success Response Handling

```
API Returns Success
    │
    ▼
Set isSuccess = true
    │
    ▼
Show success message (Task 60)
    │
    ▼
Start redirect countdown (3 seconds)
    │
    ▼
Redirect to login page
```

### Error Response Parsing

```typescript
try {
  await authService.resetPassword(token, password)
  setIsSuccess(true)
} catch (error) {
  if (error.response?.status === 410) {
    setError('expired')
  } else if (error.response?.status === 409) {
    setError('used')
  } else if (error.response?.status === 400) {
    setError(error.response.data.message || 'Invalid request')
  } else {
    setError('An error occurred. Please try again.')
  }
} finally {
  setIsLoading(false)
}
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Token transmission | HTTPS only |
| Password exposure | Never logged or cached |
| CSRF protection | Include CSRF token if required |
| Rate limiting | Respect backend limits |
| Error messages | Don't expose sensitive info |

### Expected Outcome
- Complete submission logic implemented
- API call to backend reset password endpoint
- Proper error handling for all scenarios
- State management coordinated correctly
- Loading states displayed appropriately
- Foundation for success/error handling (Tasks 60-61)
- Secure password transmission

### Verification Checklist
- [ ] authService.resetPassword imported
- [ ] onSubmit function implemented as async
- [ ] Pre-submission validation added
- [ ] isLoading state managed properly
- [ ] Request payload prepared correctly
- [ ] API call to resetPassword method
- [ ] Token and password passed securely
- [ ] Success response handled
- [ ] isSuccess state updated on success
- [ ] Error handling with try-catch
- [ ] Specific error types detected
- [ ] Error message extracted and set
- [ ] Loading state reset in finally block
- [ ] Timeout handling implemented
- [ ] Form disabled during submission

---

## Task 60: Handle Reset Success

### Overview
Implement the success state UI and automatic redirect when password reset is successfully completed. This task creates a positive user experience with clear success feedback, a countdown timer, and automatic navigation to the login page where users can sign in with their new password.

### Dependencies
- Task 59: Implement Reset Submission

### Instructions

1. **Create success state check**
   - In ResetPasswordForm component
   - Add conditional rendering based on isSuccess state
   - Show success UI when isSuccess is true

2. **Implement success message container**
   - Create success section that replaces form
   - Use success styling (green theme)
   - Center-align content

3. **Add success icon**
   - Use checkmark or success icon
   - Import from Lucide React (CheckCircle)
   - Large size for visibility
   - Use success color (green)

4. **Create success heading**
   - Text: "Password Reset Successful!"
   - Use prominent heading size
   - Apply success color

5. **Add success message**
   - Congratulate user
   - "Your password has been successfully reset."
   - Inform about next step
   - "You can now sign in with your new password."

6. **Implement countdown timer**
   - Start 3-second countdown
   - Display: "Redirecting to login in 3..."
   - Update every second
   - Use useEffect and setTimeout

7. **Create auto-redirect logic**
   - Use Next.js router
   - Import from 'next/navigation'
   - Redirect to /login after countdown
   - Clean up timer on unmount

8. **Add manual redirect button**
   - Text: "Sign In Now"
   - Allow immediate redirect
   - Don't wait for countdown
   - Use full-width button

9. **Show new password reminder (optional)**
   - Subtle message about remembering password
   - Encourage using password manager
   - Security best practice

10. **Add analytics tracking**
    - Track successful password resets
    - Monitor redirect conversion
    - Track manual vs auto redirects

### Success UI Structure

```
┌─────────────────────────────────────┐
│         [✓ Success Icon]            │
│                                     │
│   Password Reset Successful!        │
│                                     │
│  Your password has been             │
│  successfully reset.                │
│                                     │
│  You can now sign in with your      │
│  new password.                      │
│                                     │
│  Redirecting to login in 3s...      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Sign In Now                │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Success Message Components

| Component | Content | Purpose |
|-----------|---------|---------|
| Icon | Large green checkmark | Visual success indicator |
| Heading | "Password Reset Successful!" | Clear status |
| Message | Reset confirmation | Inform user |
| Next Steps | Sign in instruction | Guide user |
| Countdown | "Redirecting in 3s" | Set expectation |
| Button | "Sign In Now" | Immediate action |

### Countdown Timer Logic

```
Success State Triggered
    │
    ▼
Set countdown = 3
    │
    ▼
Start interval (1 second)
    │
    ├──── Every second ────┐
    │                      ▼
    │                 Decrease countdown
    │                 Update display
    │                      │
    │                 countdown > 0?
    │                      │
    │                  ┌───┴───┐
    │                  No     Yes
    │                  │       │
    │                  │       └─→ Continue
    │                  ▼
    │             Redirect to login
    │
    ▼
Component Unmounts
    │
    ▼
Clear interval
```

### Countdown Implementation

```typescript
useEffect(() => {
  if (isSuccess) {
    let countdown = 3
    setCountdown(countdown)
    
    const interval = setInterval(() => {
      countdown -= 1
      setCountdown(countdown)
      
      if (countdown === 0) {
        clearInterval(interval)
        router.push('/login')
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }
}, [isSuccess])
```

### Redirect Timing

| Event | Time | Action |
|-------|------|--------|
| Success | 0s | Show success UI |
| Countdown | 0-3s | Update countdown display |
| Auto redirect | 3s | Navigate to /login |
| Manual redirect | Any time | Immediate navigation |

### Success Styling

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | Success background | Visual feedback |
| Icon | Green, 48px | Positive confirmation |
| Heading | Bold, large | Clear messaging |
| Text | Readable, centered | Easy comprehension |
| Countdown | Subtle, gray | Non-intrusive |
| Button | Primary style | Clear action |

### Router Navigation

| Method | Target | Behavior |
|--------|--------|----------|
| router.push('/login') | Login page | Navigate and add to history |

### Manual Redirect Button

```
User Clicks "Sign In Now"
    │
    ▼
Clear countdown interval
    │
    ▼
router.push('/login')
    │
    ▼
Navigate to login page
```

### Success Message Variations

| Scenario | Additional Message |
|----------|-------------------|
| First time | "Welcome! Please sign in to get started." |
| Returning user | "Welcome back! Your account is secure." |
| After multiple attempts | "Password successfully changed." |

### Cleanup on Unmount

```typescript
useEffect(() => {
  // ... countdown logic
  
  return () => {
    // Clear interval when component unmounts
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}, [isSuccess])
```

### Expected Outcome
- Clear, positive success message
- Countdown timer with visual feedback
- Automatic redirect to login after 3 seconds
- Manual redirect option for immediate navigation
- Clean interval cleanup
- Positive user experience
- Ready for login with new password

### Verification Checklist
- [ ] Success state conditional rendering implemented
- [ ] Success icon added (CheckCircle)
- [ ] Success icon styled appropriately
- [ ] Success heading created
- [ ] Success message with clear next steps
- [ ] Countdown timer implemented
- [ ] Countdown starts at 3 seconds
- [ ] Countdown updates every second
- [ ] Countdown display shows remaining time
- [ ] Auto-redirect to /login after countdown
- [ ] "Sign In Now" button added
- [ ] Manual redirect functionality
- [ ] Interval cleanup on unmount
- [ ] Analytics tracking added
- [ ] Success UI matches brand styling

---

## Task 61: Handle Reset Errors

### Overview
Implement comprehensive error handling for the password reset submission, including specific error types such as expired tokens, invalid tokens, used tokens, weak passwords, network errors, and server errors. This task ensures users receive clear, actionable feedback when issues occur during the password reset process.

### Dependencies
- Task 59: Implement Reset Submission

### Instructions

1. **Create error state display**
   - Add error message container above submit button
   - Use Alert component from Shadcn/UI
   - Style with error/destructive variant
   - Show only when error state exists

2. **Implement generic error handler**
   - Parse error response from API
   - Extract error message and type
   - Map error codes to user-friendly messages
   - Set error state with message

3. **Handle token expired error**
   - Detect 410 status code
   - Show expired token message
   - Link to request new reset
   - Similar to Task 58 but in form context

4. **Handle token invalid error**
   - Detect 400 status with token error
   - Show invalid token message
   - Suggest requesting new reset
   - Disable form fields

5. **Handle token used error**
   - Detect 409 status code
   - Show already used message
   - Explain token is single-use
   - Link to request new reset

6. **Handle password validation errors**
   - Detect 400 status with password error
   - Show specific password requirements not met
   - Keep form editable
   - Focus on password field

7. **Handle network errors**
   - Detect connection failures
   - Show network error message
   - Suggest checking internet connection
   - Provide retry option

8. **Handle server errors**
   - Detect 500 status codes
   - Show generic server error message
   - Avoid exposing technical details
   - Suggest trying again later

9. **Implement error dismissal**
   - Add close button to error alert
   - Clear error state on dismiss
   - Clear error on new submission
   - Clear error on form field change

10. **Add error recovery**
    - For token errors: Link to forgot password
    - For password errors: Keep form editable
    - For network errors: Retry button
    - Appropriate action for each error type

### Error Handling Flow

```
API Error Occurs
    │
    ▼
Parse Error Response
    │
    ├──── 410 (Expired) ──────→ Show expired error
    │                           Link to forgot password
    │
    ├──── 409 (Used) ─────────→ Show used error
    │                           Link to forgot password
    │
    ├──── 400 (Token) ────────→ Show invalid error
    │                           Link to forgot password
    │
    ├──── 400 (Password) ─────→ Show password error
    │                           Keep form editable
    │
    ├──── 500 (Server) ───────→ Show server error
    │                           Suggest retry
    │
    └──── Network Error ──────→ Show network error
                                Retry button
```

### Error Types and Messages

| Error Type | Status | User Message | Action Available |
|------------|--------|--------------|------------------|
| Token Expired | 410 | "This reset link has expired. Please request a new one." | Request New Link |
| Token Invalid | 400 | "This reset link is invalid. Please request a new one." | Request New Link |
| Token Used | 409 | "This reset link has already been used. Please request a new one." | Request New Link |
| Password Weak | 400 | "Password does not meet security requirements." | Edit Password |
| Network Error | - | "Network error. Please check your connection and try again." | Retry |
| Server Error | 500 | "Server error. Please try again later." | Retry |
| Timeout | - | "Request timed out. Please try again." | Retry |

### Token Error Display

```
┌─────────────────────────────────────┐
│  [Password fields - disabled]       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ⚠️ This reset link has expired.│ │
│  │    Please request a new one.   │ │
│  │                          [X]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Request New Reset Link       │ │
│  └───────────────────────────────┘ │
│                                     │
│         Back to Login               │
└─────────────────────────────────────┘
```

### Password Error Display

```
┌─────────────────────────────────────┐
│  [Password fields - editable]       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ⚠️ Password does not meet       │ │
│  │    security requirements.      │ │
│  │    Please check the list above.│ │
│  │                          [X]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Reset Password             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Error Response Parsing

```typescript
try {
  await authService.resetPassword(token, password)
  setIsSuccess(true)
} catch (error) {
  if (error.response?.status === 410) {
    setError({
      type: 'token_expired',
      message: 'This reset link has expired. Please request a new one.',
      action: 'request_new'
    })
  } else if (error.response?.status === 409) {
    setError({
      type: 'token_used',
      message: 'This reset link has already been used.',
      action: 'request_new'
    })
  } else if (error.response?.status === 400) {
    const errorData = error.response.data
    if (errorData.field === 'password') {
      setError({
        type: 'password_invalid',
        message: errorData.message,
        action: 'edit_form'
      })
    } else {
      setError({
        type: 'token_invalid',
        message: 'This reset link is invalid.',
        action: 'request_new'
      })
    }
  } else if (error.response?.status === 500) {
    setError({
      type: 'server_error',
      message: 'Server error. Please try again later.',
      action: 'retry'
    })
  } else {
    setError({
      type: 'network_error',
      message: 'Network error. Please check your connection.',
      action: 'retry'
    })
  }
} finally {
  setIsLoading(false)
}
```

### Error State Structure

```typescript
interface ErrorState {
  type: 'token_expired' | 'token_used' | 'token_invalid' | 
        'password_invalid' | 'network_error' | 'server_error'
  message: string
  action: 'request_new' | 'edit_form' | 'retry'
}
```

### Error Action Buttons

| Error Type | Primary Action | Button Text | Destination |
|------------|---------------|-------------|-------------|
| Token expired | Request new | "Request New Reset Link" | /forgot-password |
| Token used | Request new | "Request New Reset Link" | /forgot-password |
| Token invalid | Request new | "Request New Reset Link" | /forgot-password |
| Password invalid | Edit form | Hidden | Current page |
| Network error | Retry | "Try Again" | Re-submit form |
| Server error | Retry | "Try Again" | Re-submit form |

### Form Behavior After Error

| Error Type | Form State | Fields Editable |
|------------|-----------|-----------------|
| Token errors | Disabled | No |
| Password errors | Enabled | Yes |
| Network errors | Enabled | Yes |
| Server errors | Enabled | Yes |

### Error Alert Styling

| Variant | Use Case | Icon | Color |
|---------|----------|------|-------|
| destructive | Token, server errors | AlertTriangle | Red |
| warning | Password errors | AlertCircle | Yellow |
| default | Network errors | Wifi | Gray |

### Error Recovery Options

| Error Type | Recovery Action | User Experience |
|------------|----------------|-----------------|
| Token expired | Request new reset | Navigate to forgot password |
| Token used | Request new reset | Navigate to forgot password |
| Password weak | Edit password | Fix and resubmit |
| Network | Retry submission | Click "Try Again" |
| Server | Retry later | Click "Try Again" |

### Security Considerations

| Concern | Implementation | Reason |
|---------|----------------|--------|
| Error details | Hide technical details | Security |
| Token status | Don't reveal token validity unnecessarily | Prevent token probing |
| Generic errors | Use vague messages for unexpected errors | Don't expose internals |

### Expected Outcome
- Comprehensive error handling for all scenarios
- Clear, actionable error messages
- Appropriate recovery actions for each error type
- Form state managed based on error type
- Graceful error recovery
- Positive user experience even during errors
- Security-conscious error handling

### Verification Checklist
- [ ] Error alert component added
- [ ] Error state display implemented
- [ ] Token expired error detected (410)
- [ ] Token expired message displayed
- [ ] Token used error detected (409)
- [ ] Token used message displayed
- [ ] Token invalid error detected (400)
- [ ] Password validation errors detected
- [ ] Password error keeps form editable
- [ ] Network error handling added
- [ ] Server error handling added
- [ ] Error type determines form state
- [ ] Request new link button for token errors
- [ ] Retry button for network/server errors
- [ ] Error dismissal functionality
- [ ] Error cleared on new submission
- [ ] Appropriate navigation for token errors
- [ ] Security best practices followed

---

## Task 62: Test Password Reset Flow

### Overview
Perform comprehensive testing of the complete password reset flow from requesting a reset to successfully logging in with the new password. This task ensures all components work together correctly, error handling functions properly, and the user experience is smooth across all scenarios.

### Dependencies
- Task 60: Handle Reset Success
- Task 61: Handle Reset Errors

### Instructions

1. **Set up test environment**
   - Ensure development server is running
   - Backend API is accessible
   - Test email account configured
   - Database is seeded with test users

2. **Test forgot password page**
   - Navigate to /forgot-password
   - Verify page renders correctly
   - Check layout and styling
   - Verify form components present

3. **Test email validation**
   - Submit empty email (should error)
   - Submit invalid email format (should error)
   - Submit valid email
   - Verify error messages are clear

4. **Test forgot password submission**
   - Submit valid email
   - Verify loading state displays
   - Check success message appears
   - Verify form is hidden after success

5. **Test email not found scenario**
   - Submit email not in database
   - Verify success message still shows (no enumeration)
   - Confirm security best practice

6. **Test rate limiting**
   - Submit multiple requests rapidly
   - Verify rate limit error appears
   - Check countdown timer works
   - Confirm form disabled during cooldown

7. **Test email receipt**
   - Check test email inbox
   - Verify reset email received
   - Check email formatting
   - Verify reset link is present
   - Click reset link

8. **Test reset password page load**
   - Verify redirect to /reset-password?token=...
   - Check token extracted from URL
   - Verify token validation occurs
   - Check loading state during validation

9. **Test valid token**
   - Wait for validation to complete
   - Verify form displays
   - Check all fields present
   - Verify password requirements shown

10. **Test expired token**
    - Use old/expired token URL
    - Verify expired token UI shows
    - Check error message is clear
    - Verify "Request New Link" button works

11. **Test invalid token**
    - Use malformed token URL
    - Verify invalid token error
    - Check appropriate error message
    - Verify recovery options

12. **Test password field validation**
    - Enter short password (< 8 chars)
    - Verify error message
    - Enter password without uppercase
    - Enter password without number
    - Check real-time validation feedback

13. **Test password strength indicator**
    - Enter weak password
    - Verify strength shows "Weak" (red)
    - Enter medium password
    - Verify strength shows "Medium" (yellow)
    - Enter strong password
    - Verify strength shows "Strong" (green)

14. **Test password requirements checklist**
    - Enter password
    - Verify checkmarks update in real-time
    - Check each requirement independently
    - Verify visual feedback is clear

15. **Test password visibility toggle**
    - Click eye icon on password field
    - Verify password becomes visible
    - Click again to hide
    - Test same for confirm password

16. **Test password mismatch**
    - Enter different values in password fields
    - Submit form
    - Verify "Passwords do not match" error
    - Check error appears on confirm field

17. **Test successful password reset**
    - Enter valid matching passwords
    - Submit form
    - Verify loading state
    - Check success message appears
    - Verify countdown timer works
    - Confirm form is hidden

18. **Test auto-redirect**
    - After success, wait for countdown
    - Verify redirect to /login at 0 seconds
    - Check login page loads correctly

19. **Test manual redirect**
    - Reset password again
    - Click "Sign In Now" before countdown ends
    - Verify immediate redirect to login

20. **Test login with new password**
    - On login page, enter email
    - Enter old password (should fail)
    - Enter new password (should succeed)
    - Verify successful authentication

21. **Test token reuse prevention**
    - Try to use same reset token again
    - Verify "already used" error
    - Check appropriate error message
    - Verify recovery options

22. **Test network error handling**
    - Simulate network failure (disconnect internet)
    - Submit reset request
    - Verify network error message
    - Reconnect and retry

23. **Test server error handling**
    - If possible, simulate server error
    - Verify generic error message
    - Check retry functionality

24. **Test accessibility**
    - Navigate using keyboard only
    - Tab through all form fields
    - Submit using Enter key
    - Check screen reader compatibility

25. **Test responsive design**
    - Test on desktop (1920×1080)
    - Test on tablet (768×1024)
    - Test on mobile (375×667)
    - Verify layouts adapt properly

26. **Test edge cases**
    - Very long password (128 chars)
    - Special characters in password
    - Copy-paste password
    - Browser autofill

27. **Verify analytics tracking**
    - Check analytics events fire
    - Verify proper data captured
    - Test conversion funnel

28. **Document any issues**
    - Create list of bugs found
    - Note UX improvements needed
    - Log performance issues
    - Report to team

### Test Scenarios Matrix

| Scenario | Steps | Expected Result | Pass/Fail |
|----------|-------|-----------------|-----------|
| Valid email submission | Submit valid email | Success message, check email | ☐ |
| Invalid email | Submit "invalid" | Validation error | ☐ |
| Email not found | Submit non-existent email | Success message (no enumeration) | ☐ |
| Rate limiting | Submit 5+ times | Rate limit error with countdown | ☐ |
| Valid token | Use fresh token | Form displays | ☐ |
| Expired token | Use old token | Expired error, request new link | ☐ |
| Invalid token | Use malformed token | Invalid error | ☐ |
| Weak password | Enter "Pass123" | Weak strength, missing requirements | ☐ |
| Strong password | Enter "P@ssw0rd123!" | Strong strength, all requirements met | ☐ |
| Password mismatch | Enter different passwords | Mismatch error | ☐ |
| Successful reset | Valid passwords | Success message, countdown | ☐ |
| Auto redirect | Wait for countdown | Redirect to login | ☐ |
| Login with new password | Enter new password | Successful login | ☐ |
| Token reuse | Use same token twice | Already used error | ☐ |

### Password Validation Test Cases

| Password | Length | Upper | Lower | Number | Special | Expected |
|----------|--------|-------|-------|--------|---------|----------|
| "Pass1" | ✗ | ✓ | ✓ | ✓ | ✗ | Fail (too short) |
| "password123" | ✓ | ✗ | ✓ | ✓ | ✗ | Fail (no uppercase) |
| "PASSWORD123" | ✓ | ✓ | ✗ | ✓ | ✗ | Fail (no lowercase) |
| "Password" | ✓ | ✓ | ✓ | ✗ | ✗ | Fail (no number) |
| "Password123" | ✓ | ✓ | ✓ | ✓ | ✗ | Pass (medium) |
| "P@ssw0rd123!" | ✓ | ✓ | ✓ | ✓ | ✓ | Pass (strong) |

### User Flow Test Path

```
1. User navigates to login
    ↓
2. User clicks "Forgot Password?"
    ↓
3. User enters email
    ↓
4. User submits form
    ↓
5. Success message appears
    ↓
6. User checks email
    ↓
7. User clicks reset link
    ↓
8. Token validates successfully
    ↓
9. User enters new password
    ↓
10. User confirms password
    ↓
11. User submits reset form
    ↓
12. Success message appears
    ↓
13. Countdown completes
    ↓
14. Redirect to login
    ↓
15. User logs in with new password
    ↓
16. Success - user authenticated
```

### Error Handling Test Cases

| Error Scenario | Trigger | Expected Display |
|----------------|---------|------------------|
| Token expired | Use old token | Expired message, request new link |
| Token invalid | Malformed token | Invalid message, request new link |
| Token used | Reuse token | Already used message |
| Network error | Disconnect internet | Network error, retry button |
| Server error | Backend down | Server error, retry later |
| Rate limit | Many requests | Rate limit message, countdown |

### Accessibility Test Checklist

- [ ] All form fields have labels
- [ ] Error messages announced to screen readers
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Form can be submitted with Enter key
- [ ] Error messages have appropriate ARIA attributes
- [ ] Loading states communicated to assistive tech

### Performance Test Points

| Metric | Target | Measured |
|--------|--------|----------|
| Page load time | < 2s | |
| Token validation | < 1s | |
| Form submission | < 3s | |
| Redirect time | < 500ms | |

### Expected Outcome
- Complete password reset flow works end-to-end
- All validation functions correctly
- Error handling covers all scenarios
- User experience is smooth and intuitive
- Security measures are in place
- Accessibility standards met
- Performance is acceptable
- No critical bugs found

### Verification Checklist
- [ ] Forgot password page accessible
- [ ] Email validation working
- [ ] Forgot password submission successful
- [ ] Reset email received
- [ ] Reset link works correctly
- [ ] Token validation occurs
- [ ] Valid token shows form
- [ ] Expired token shows error
- [ ] Invalid token shows error
- [ ] Password validation working
- [ ] Password strength indicator functional
- [ ] Password requirements checklist updates
- [ ] Password visibility toggles work
- [ ] Password mismatch detected
- [ ] Successful reset displays success
- [ ] Countdown timer works
- [ ] Auto-redirect after countdown
- [ ] Manual redirect button works
- [ ] Can login with new password
- [ ] Token reuse prevented
- [ ] Network errors handled
- [ ] Server errors handled
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Responsive on all devices
- [ ] Analytics tracking working

---

## Summary

This document covered the complete reset password page and flow, including:

- **Task 53:** Created reset password page route with token extraction from URL
- **Task 54:** Defined comprehensive Zod schema for password validation with strength requirements
- **Task 55:** Built ResetPasswordForm component with password strength indicator and visibility toggles
- **Task 56:** Implemented token extraction from URL query parameters
- **Task 57:** Created token validation logic with backend API integration
- **Task 58:** Implemented dedicated UI for expired and invalid tokens
- **Task 59:** Implemented reset submission with comprehensive error handling
- **Task 60:** Created success state with countdown and auto-redirect to login
- **Task 61:** Implemented detailed error handling for all failure scenarios
- **Task 62:** Performed comprehensive end-to-end testing of password reset flow

The password reset flow is now complete with secure token handling, comprehensive validation, clear user feedback, and proper error handling. Combined with the forgot password flow from the previous document, users have a complete, secure, and user-friendly password reset experience.

### Full Password Reset Journey

```
┌─────────────────────────────────────────────────────────┐
│  1. User forgets password                               │
│     ↓                                                   │
│  2. Visits /forgot-password                             │
│     ↓                                                   │
│  3. Enters email and submits                            │
│     ↓                                                   │
│  4. Receives "Check Your Email" message                 │
│     ↓                                                   │
│  5. Opens email and clicks reset link                   │
│     ↓                                                   │
│  6. Lands on /reset-password?token=xyz                  │
│     ↓                                                   │
│  7. Token validates successfully                        │
│     ↓                                                   │
│  8. Enters new password (sees strength indicator)       │
│     ↓                                                   │
│  9. Confirms password                                   │
│     ↓                                                   │
│ 10. Submits form                                        │
│     ↓                                                   │
│ 11. Sees "Password Reset Successful!" message           │
│     ↓                                                   │
│ 12. Auto-redirects to /login after 3 seconds            │
│     ↓                                                   │
│ 13. Logs in with new password                           │
│     ↓                                                   │
│ 14. Successfully authenticated! 🎉                      │
└─────────────────────────────────────────────────────────┘
```

The password reset implementation follows security best practices including token expiration, single-use tokens, password strength requirements, rate limiting, and prevention of email enumeration attacks. The user experience prioritizes clarity, helpful feedback, and smooth navigation throughout the reset process.
