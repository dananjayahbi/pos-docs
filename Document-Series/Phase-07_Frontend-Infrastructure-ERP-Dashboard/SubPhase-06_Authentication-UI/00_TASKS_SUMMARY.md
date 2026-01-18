# SubPhase 06: Authentication UI - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 06 of 14  
> **SubPhase Goal:** Build complete authentication flow interfaces including login, registration, password reset, and email verification  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 8-10 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_State-Management](../SubPhase-05_State-Management/)
- **→ Next SubPhase:** [SubPhase-07_Dashboard-Layout](../SubPhase-07_Dashboard-Layout/)

---

## SubPhase Overview

This sub-phase builds all authentication-related user interfaces for the ERP dashboard. It includes login pages, registration flows, password recovery, email verification, and session management. All forms use React Hook Form with Zod validation.

### Key Outcomes
- Login page with tenant selection
- New tenant registration flow
- Password reset request and confirmation
- Email verification flow
- Two-factor authentication UI (optional)
- Session expiry handling
- Remember me functionality
- Protected route wrapper

### Technology Context
- **Form Library:** React Hook Form
- **Validation:** Zod schemas
- **State:** Zustand (auth store) + TanStack Query
- **API:** Auth service from SubPhase-04
- **Routing:** Next.js App Router with route groups

### Authentication Flow
1. User enters credentials on login page
2. API validates and returns JWT tokens
3. Tokens stored securely (httpOnly cookies preferred)
4. User/tenant data stored in auth store
5. Redirect to dashboard with permissions loaded

---

## Task Execution Order

```
TASK GROUP A: Auth Route Group & Layout (Tasks 01-14)
        │
        ▼
TASK GROUP B: Login Page & Form (Tasks 15-30)
        │
        ▼
TASK GROUP C: Registration Flow (Tasks 31-46)
        │
        ▼
TASK GROUP D: Password Reset Flow (Tasks 47-62)
        │
        ▼
TASK GROUP E: Email Verification & 2FA (Tasks 63-76)
        │
        ▼
TASK GROUP F: Route Protection & Session (Tasks 77-86)
```

---

## Task Index

### Group A: Auth Route Group & Layout (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create (auth) Route Group** | Set up app/(auth)/ directory for auth pages | SubPhase-05 | 🔴 Not Created |
| 02 | **Create Auth Layout Component** | Create centered layout for auth pages | Task 01 | 🔴 Not Created |
| 03 | **Design Auth Layout Styling** | Style auth layout with brand colors, logo | Task 02 | 🔴 Not Created |
| 04 | **Add Auth Background Pattern** | Add subtle background pattern or gradient | Task 03 | 🔴 Not Created |
| 05 | **Create Auth Card Component** | Create card wrapper for auth forms | Task 03 | 🔴 Not Created |
| 06 | **Create Auth Logo Component** | Create logo component for auth pages | Task 02 | 🔴 Not Created |
| 07 | **Create Auth Footer Component** | Create footer with links (privacy, terms) | Task 02 | 🔴 Not Created |
| 08 | **Create Auth Heading Component** | Create reusable heading with subtitle | Task 02 | 🔴 Not Created |
| 09 | **Create Auth Divider Component** | Create "or" divider for social login | Task 02 | 🔴 Not Created |
| 10 | **Create Social Login Buttons** | Create Google, Facebook login buttons (UI only) | Task 02 | 🔴 Not Created |
| 11 | **Create Auth Alert Component** | Create error/success alert for auth forms | Task 02 | 🔴 Not Created |
| 12 | **Create Auth Loading State** | Create loading overlay for auth actions | Task 02 | 🔴 Not Created |
| 13 | **Configure Auth Metadata** | Set up page metadata for SEO | Task 01 | 🔴 Not Created |
| 14 | **Verify Auth Layout Structure** | Test layout renders correctly | Task 13 | 🔴 Not Created |

---

### Group B: Login Page & Form (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Login Page Route** | Create app/(auth)/login/page.tsx | Task 14 | 🔴 Not Created |
| 16 | **Create Login Form Schema** | Define Zod schema for login validation | Task 15 | 🔴 Not Created |
| 17 | **Create Login Form Component** | Create LoginForm with React Hook Form | Task 16 | 🔴 Not Created |
| 18 | **Add Email Input Field** | Email input with validation feedback | Task 17 | 🔴 Not Created |
| 19 | **Add Password Input Field** | Password input with show/hide toggle | Task 17 | 🔴 Not Created |
| 20 | **Add Remember Me Checkbox** | Checkbox to persist session | Task 17 | 🔴 Not Created |
| 21 | **Add Forgot Password Link** | Link to password reset page | Task 17 | 🔴 Not Created |
| 22 | **Create Submit Button** | Submit button with loading state | Task 17 | 🔴 Not Created |
| 23 | **Implement Login Submission** | Connect form to auth service login | Task 22 | 🔴 Not Created |
| 24 | **Handle Login Success** | Store tokens, update auth store, redirect | Task 23 | 🔴 Not Created |
| 25 | **Handle Login Errors** | Display validation and API errors | Task 23 | 🔴 Not Created |
| 26 | **Add Tenant Selection** | Dropdown for multi-tenant user access | Task 17 | 🔴 Not Created |
| 27 | **Add Registration Link** | Link to registration page | Task 17 | 🔴 Not Created |
| 28 | **Implement Redirect After Login** | Redirect to intended page or dashboard | Task 24 | 🔴 Not Created |
| 29 | **Add Login Page Animations** | Fade-in animations for form elements | Task 17 | 🔴 Not Created |
| 30 | **Test Login Flow** | Verify complete login flow works | Task 29 | 🔴 Not Created |

---

### Group C: Registration Flow (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create Registration Page Route** | Create app/(auth)/register/page.tsx | Task 14 | 🔴 Not Created |
| 32 | **Create Registration Form Schema** | Define Zod schema for registration | Task 31 | 🔴 Not Created |
| 33 | **Create Registration Form Component** | Create RegisterForm with steps | Task 32 | 🔴 Not Created |
| 34 | **Create Step 1: Business Info** | Business name, type, registration number | Task 33 | 🔴 Not Created |
| 35 | **Create Step 2: Admin User** | Admin name, email, password | Task 34 | 🔴 Not Created |
| 36 | **Create Step 3: Contact Info** | Phone, address, timezone selection | Task 35 | 🔴 Not Created |
| 37 | **Create Step 4: Plan Selection** | Subscription plan selection (if applicable) | Task 36 | 🔴 Not Created |
| 38 | **Create Step Indicator Component** | Visual step progress indicator | Task 33 | 🔴 Not Created |
| 39 | **Add Step Navigation Buttons** | Next, previous, submit buttons | Task 38 | 🔴 Not Created |
| 40 | **Add Password Strength Indicator** | Visual password strength meter | Task 35 | 🔴 Not Created |
| 41 | **Add Terms Acceptance Checkbox** | Required terms and conditions checkbox | Task 36 | 🔴 Not Created |
| 42 | **Implement Registration Submission** | Connect form to registration API | Task 41 | 🔴 Not Created |
| 43 | **Handle Registration Success** | Show success message, redirect to verify | Task 42 | 🔴 Not Created |
| 44 | **Handle Registration Errors** | Display API validation errors | Task 42 | 🔴 Not Created |
| 45 | **Add Login Link** | Link back to login page | Task 33 | 🔴 Not Created |
| 46 | **Test Registration Flow** | Verify complete registration flow | Task 45 | 🔴 Not Created |

---

### Group D: Password Reset Flow (Tasks 47-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create Forgot Password Page** | Create app/(auth)/forgot-password/page.tsx | Task 14 | 🔴 Not Created |
| 48 | **Create Forgot Password Schema** | Define Zod schema for email validation | Task 47 | 🔴 Not Created |
| 49 | **Create Forgot Password Form** | Email input form for password reset | Task 48 | 🔴 Not Created |
| 50 | **Implement Reset Request Submission** | Connect to forgot password API | Task 49 | 🔴 Not Created |
| 51 | **Handle Reset Request Success** | Show success message with email sent | Task 50 | 🔴 Not Created |
| 52 | **Handle Reset Request Errors** | Handle email not found, rate limiting | Task 50 | 🔴 Not Created |
| 53 | **Create Reset Password Page** | Create app/(auth)/reset-password/page.tsx | Task 14 | 🔴 Not Created |
| 54 | **Create Reset Password Schema** | Define schema for new password | Task 53 | 🔴 Not Created |
| 55 | **Create Reset Password Form** | New password and confirmation inputs | Task 54 | 🔴 Not Created |
| 56 | **Extract Token from URL** | Read reset token from query params | Task 53 | 🔴 Not Created |
| 57 | **Validate Reset Token** | Check token validity before showing form | Task 56 | 🔴 Not Created |
| 58 | **Handle Expired Token** | Show error for expired/invalid token | Task 57 | 🔴 Not Created |
| 59 | **Implement Reset Submission** | Connect to reset password API | Task 55 | 🔴 Not Created |
| 60 | **Handle Reset Success** | Show success, redirect to login | Task 59 | 🔴 Not Created |
| 61 | **Handle Reset Errors** | Display API errors | Task 59 | 🔴 Not Created |
| 62 | **Test Password Reset Flow** | Verify complete reset flow | Task 61 | 🔴 Not Created |

---

### Group E: Email Verification & 2FA (Tasks 63-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create Verify Email Page** | Create app/(auth)/verify-email/page.tsx | Task 14 | 🔴 Not Created |
| 64 | **Extract Verification Token** | Read token from URL params | Task 63 | 🔴 Not Created |
| 65 | **Implement Verification Request** | Call verify email API with token | Task 64 | 🔴 Not Created |
| 66 | **Handle Verification Success** | Show success, auto-redirect to login | Task 65 | 🔴 Not Created |
| 67 | **Handle Verification Failure** | Show error for invalid/expired token | Task 65 | 🔴 Not Created |
| 68 | **Create Resend Verification Page** | Page to request new verification email | Task 63 | 🔴 Not Created |
| 69 | **Create Resend Verification Form** | Email input for resending verification | Task 68 | 🔴 Not Created |
| 70 | **Implement Resend Logic** | Connect to resend verification API | Task 69 | 🔴 Not Created |
| 71 | **Create 2FA Setup Page** | Page to set up two-factor auth | Task 14 | 🔴 Not Created |
| 72 | **Create 2FA Verification Page** | Page to enter 2FA code during login | Task 71 | 🔴 Not Created |
| 73 | **Create OTP Input Component** | 6-digit OTP input with auto-focus | Task 72 | 🔴 Not Created |
| 74 | **Create Backup Codes Display** | Display and download backup codes | Task 71 | 🔴 Not Created |
| 75 | **Implement 2FA Verification** | Connect to 2FA verify API | Task 73 | 🔴 Not Created |
| 76 | **Test Email & 2FA Flows** | Verify all verification flows | Task 75 | 🔴 Not Created |

---

### Group F: Route Protection & Session (Tasks 77-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create ProtectedRoute Component** | HOC/wrapper for protected pages | Task 30 | 🔴 Not Created |
| 78 | **Implement Auth Check Logic** | Check auth state before rendering | Task 77 | 🔴 Not Created |
| 79 | **Implement Redirect to Login** | Redirect unauthenticated users | Task 78 | 🔴 Not Created |
| 80 | **Store Intended URL** | Save intended URL for post-login redirect | Task 79 | 🔴 Not Created |
| 81 | **Create Permission Check** | Check user permissions for routes | Task 77 | 🔴 Not Created |
| 82 | **Create Unauthorized Page** | Page for insufficient permissions | Task 81 | 🔴 Not Created |
| 83 | **Implement Session Expiry Handling** | Detect and handle expired sessions | Task 77 | 🔴 Not Created |
| 84 | **Create Session Expiry Modal** | Modal prompting re-authentication | Task 83 | 🔴 Not Created |
| 85 | **Implement Auto Logout** | Auto logout on session expiry | Task 83 | 🔴 Not Created |
| 86 | **Final Verification & Testing** | Test all auth flows end-to-end | Task 85 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (auth)/
│       ├── layout.tsx            # Auth layout
│       ├── login/
│       │   └── page.tsx          # Login page
│       ├── register/
│       │   └── page.tsx          # Registration page
│       ├── forgot-password/
│       │   └── page.tsx          # Forgot password
│       ├── reset-password/
│       │   └── page.tsx          # Reset password
│       ├── verify-email/
│       │   └── page.tsx          # Email verification
│       ├── resend-verification/
│       │   └── page.tsx          # Resend verification
│       ├── two-factor/
│       │   ├── setup/
│       │   │   └── page.tsx      # 2FA setup
│       │   └── verify/
│       │       └── page.tsx      # 2FA verify
│       └── unauthorized/
│           └── page.tsx          # 403 page
├── components/
│   └── auth/
│       ├── AuthCard.tsx
│       ├── AuthDivider.tsx
│       ├── AuthFooter.tsx
│       ├── AuthHeading.tsx
│       ├── AuthLogo.tsx
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       ├── ForgotPasswordForm.tsx
│       ├── ResetPasswordForm.tsx
│       ├── OTPInput.tsx
│       ├── PasswordStrength.tsx
│       ├── ProtectedRoute.tsx
│       ├── SessionExpiryModal.tsx
│       ├── SocialLoginButtons.tsx
│       ├── StepIndicator.tsx
│       └── index.ts
└── lib/
    └── validations/
        ├── login.ts
        ├── register.ts
        ├── forgotPassword.ts
        └── resetPassword.ts
```

---

## Form Validation Rules

### Login Form
- **Email:** Valid email format, required
- **Password:** Required, min 8 characters

### Registration Form
- **Business Name:** Required, 2-100 characters
- **Admin Email:** Valid email, required
- **Admin Password:** Min 8 chars, uppercase, lowercase, number
- **Confirm Password:** Must match password
- **Phone:** Valid Sri Lankan phone (+94)
- **Terms:** Must be accepted

### Password Reset
- **Email:** Valid email format
- **New Password:** Min 8 chars, strength requirements
- **Confirm Password:** Must match

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 86 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Form Library:** Use React Hook Form with Zod resolvers
3. **Error Handling:** Display both field-level and form-level errors
4. **Loading States:** Show loading indicators during API calls
5. **Accessibility:** All forms must be keyboard navigable and screen reader friendly
6. **Security:** Never expose sensitive error details to users
7. **Rate Limiting:** Implement client-side rate limiting for sensitive forms
8. **Dependencies:** This sub-phase depends on SubPhase-03, SubPhase-04, SubPhase-05
9. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
10. **Sri Lanka Context:** Phone inputs should default to +94 prefix
11. **Multi-Tenant:** Handle tenant selection during login for users with access to multiple tenants
12. **Social Login:** Social login buttons are UI-only placeholders for future implementation
