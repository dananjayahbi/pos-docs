# SubPhase 08: Customer Authentication - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 08 of 14  
> **SubPhase Goal:** Build customer registration, login, and password reset with email/phone and OTP support  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_Checkout-Flow](../SubPhase-07_Checkout-Flow/)
- **→ Next SubPhase:** [SubPhase-09_Customer-Portal](../SubPhase-09_Customer-Portal/)

---

## SubPhase Overview

This sub-phase creates the customer authentication system including registration, login, password reset, and session management for the webstore.

### Key Outcomes
- Customer registration (email/phone)
- Login with email or phone
- Password reset via email
- WhatsApp OTP for password reset
- Guest checkout option
- Remember me functionality
- Session management
- Social login preparation (Google, Facebook)

### Pages
- `/account/login` - Customer login
- `/account/register` - Customer registration
- `/account/forgot-password` - Password reset request
- `/account/reset-password` - Password reset form

### Technology Context
- **Auth:** JWT tokens with refresh
- **Forms:** React Hook Form + Zod
- **State:** Zustand auth store
- **Storage:** httpOnly cookies for tokens

---

## Task Execution Order

```
TASK GROUP A: Auth Routes & Store (Tasks 01-16)
        │
        ▼
TASK GROUP B: Registration Flow (Tasks 17-34)
        │
        ▼
TASK GROUP C: Login Flow (Tasks 35-52)
        │
        ▼
TASK GROUP D: Password Reset (Tasks 53-68)
        │
        ▼
TASK GROUP E: Session & Remember Me (Tasks 69-82)
        │
        ▼
TASK GROUP F: Social Login Prep & Testing (Tasks 83-94)
```

---

## Task Index

### Group A: Auth Routes & Store (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Account Directory** | Set up account/ route | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Account Layout** | Shared auth layout | Task 01 | 🔴 Not Created |
| 03 | **Create Login Page Route** | account/login/page.tsx | Task 01 | 🔴 Not Created |
| 04 | **Create Register Page Route** | account/register/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Forgot Password Route** | account/forgot-password/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Reset Password Route** | account/reset-password/page.tsx | Task 01 | 🔴 Not Created |
| 07 | **Create Auth Store** | Zustand auth state | Task 01 | 🔴 Not Created |
| 08 | **Create User Type** | TypeScript User interface | Task 07 | 🔴 Not Created |
| 09 | **Create Auth State Type** | Auth state interface | Task 08 | 🔴 Not Created |
| 10 | **Create Login Action** | login action in store | Task 07 | 🔴 Not Created |
| 11 | **Create Logout Action** | logout action in store | Task 07 | 🔴 Not Created |
| 12 | **Create Set User Action** | setUser action | Task 07 | 🔴 Not Created |
| 13 | **Create Auth Context Provider** | Context wrapper | Task 07 | 🔴 Not Created |
| 14 | **Create Auth Guard Component** | Protect routes | Task 13 | 🔴 Not Created |
| 15 | **Create Guest Guard Component** | Redirect if logged in | Task 13 | 🔴 Not Created |
| 16 | **Verify Auth Routes** | Test all auth routes | Task 15 | 🔴 Not Created |

---

### Group B: Registration Flow (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Register Page** | Registration page component | Task 16 | 🔴 Not Created |
| 18 | **Create Register Form** | Form wrapper | Task 17 | 🔴 Not Created |
| 19 | **Create Email Input** | Email field | Task 18 | 🔴 Not Created |
| 20 | **Create Phone Input** | Phone field (+94) | Task 18 | 🔴 Not Created |
| 21 | **Create Email OR Phone Toggle** | Choose registration method | Task 19 | 🔴 Not Created |
| 22 | **Create First Name Input** | First name field | Task 18 | 🔴 Not Created |
| 23 | **Create Last Name Input** | Last name field | Task 18 | 🔴 Not Created |
| 24 | **Create Password Input** | Password field | Task 18 | 🔴 Not Created |
| 25 | **Create Confirm Password Input** | Confirm password | Task 24 | 🔴 Not Created |
| 26 | **Create Password Strength Meter** | Visual strength indicator | Task 24 | 🔴 Not Created |
| 27 | **Create Password Requirements** | List of requirements | Task 24 | 🔴 Not Created |
| 28 | **Create Terms Checkbox** | Agree to terms | Task 18 | 🔴 Not Created |
| 29 | **Create Register Validation** | Zod schema for form | Task 18 | 🔴 Not Created |
| 30 | **Create Register Submit** | Form submission logic | Task 29 | 🔴 Not Created |
| 31 | **Create Register API Service** | Register API call | Task 30 | 🔴 Not Created |
| 32 | **Create Register Success** | Success message/redirect | Task 31 | 🔴 Not Created |
| 33 | **Create Login Link** | "Already have account?" | Task 17 | 🔴 Not Created |
| 34 | **Verify Registration Flow** | Test full registration | Task 33 | 🔴 Not Created |

---

### Group C: Login Flow (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Login Page** | Login page component | Task 34 | 🔴 Not Created |
| 36 | **Create Login Form** | Form wrapper | Task 35 | 🔴 Not Created |
| 37 | **Create Email/Phone Input** | Combined identifier input | Task 36 | 🔴 Not Created |
| 38 | **Create Detect Input Type** | Detect email vs phone | Task 37 | 🔴 Not Created |
| 39 | **Create Password Input** | Password field | Task 36 | 🔴 Not Created |
| 40 | **Create Show Password Toggle** | Eye icon toggle | Task 39 | 🔴 Not Created |
| 41 | **Create Remember Me Checkbox** | Remember me option | Task 36 | 🔴 Not Created |
| 42 | **Create Forgot Password Link** | Link to reset | Task 36 | 🔴 Not Created |
| 43 | **Create Login Validation** | Zod schema | Task 36 | 🔴 Not Created |
| 44 | **Create Login Submit** | Form submission | Task 43 | 🔴 Not Created |
| 45 | **Create Login API Service** | Login API call | Task 44 | 🔴 Not Created |
| 46 | **Create Handle Token Response** | Store JWT tokens | Task 45 | 🔴 Not Created |
| 47 | **Create Login Error Handling** | Invalid credentials | Task 45 | 🔴 Not Created |
| 48 | **Create Too Many Attempts** | Rate limit message | Task 47 | 🔴 Not Created |
| 49 | **Create Login Success Redirect** | Redirect after login | Task 46 | 🔴 Not Created |
| 50 | **Create Checkout Return** | Return to checkout if from cart | Task 49 | 🔴 Not Created |
| 51 | **Create Register Link** | "Create account" link | Task 35 | 🔴 Not Created |
| 52 | **Verify Login Flow** | Test full login | Task 51 | 🔴 Not Created |

---

### Group D: Password Reset (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Forgot Password Page** | Forgot password component | Task 52 | 🔴 Not Created |
| 54 | **Create Forgot Password Form** | Form wrapper | Task 53 | 🔴 Not Created |
| 55 | **Create Email/Phone Input** | Identifier input | Task 54 | 🔴 Not Created |
| 56 | **Create Request Reset Submit** | Send reset request | Task 55 | 🔴 Not Created |
| 57 | **Create Reset Request API** | API to request reset | Task 56 | 🔴 Not Created |
| 58 | **Create Email Sent Message** | "Check email" message | Task 57 | 🔴 Not Created |
| 59 | **Create WhatsApp OTP Option** | OTP via WhatsApp | Task 57 | 🔴 Not Created |
| 60 | **Create OTP Input** | 6-digit OTP field | Task 59 | 🔴 Not Created |
| 61 | **Create OTP Verification** | Verify OTP API | Task 60 | 🔴 Not Created |
| 62 | **Create Resend OTP** | Resend with countdown | Task 60 | 🔴 Not Created |
| 63 | **Create Reset Password Page** | New password page | Task 61 | 🔴 Not Created |
| 64 | **Create New Password Input** | New password field | Task 63 | 🔴 Not Created |
| 65 | **Create Confirm New Password** | Confirm password | Task 64 | 🔴 Not Created |
| 66 | **Create Reset Password Submit** | Submit new password | Task 65 | 🔴 Not Created |
| 67 | **Create Reset Success** | Success redirect to login | Task 66 | 🔴 Not Created |
| 68 | **Verify Password Reset Flow** | Test full reset flow | Task 67 | 🔴 Not Created |

---

### Group E: Session & Remember Me (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Token Storage** | Store tokens in cookies | Task 68 | 🔴 Not Created |
| 70 | **Create Access Token Cookie** | Short-lived access token | Task 69 | 🔴 Not Created |
| 71 | **Create Refresh Token Cookie** | Long-lived refresh token | Task 69 | 🔴 Not Created |
| 72 | **Create Token Refresh Logic** | Auto refresh access token | Task 71 | 🔴 Not Created |
| 73 | **Create Axios Interceptor** | Attach token to requests | Task 72 | 🔴 Not Created |
| 74 | **Create 401 Handler** | Handle expired tokens | Task 73 | 🔴 Not Created |
| 75 | **Create Remember Me Logic** | Extended session | Task 41 | 🔴 Not Created |
| 76 | **Create Hydrate Auth State** | Restore auth on load | Task 69 | 🔴 Not Created |
| 77 | **Create Logout Logic** | Clear tokens on logout | Task 11 | 🔴 Not Created |
| 78 | **Create Logout API Call** | Invalidate refresh token | Task 77 | 🔴 Not Created |
| 79 | **Create Logout Redirect** | Redirect to home | Task 78 | 🔴 Not Created |
| 80 | **Create Session Expiry Warning** | Warn before expiry | Task 72 | 🔴 Not Created |
| 81 | **Create Cart Merge on Login** | Merge guest cart | Task 46 | 🔴 Not Created |
| 82 | **Verify Session Management** | Test token lifecycle | Task 81 | 🔴 Not Created |

---

### Group F: Social Login Prep & Testing (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Social Login Section** | Social buttons area | Task 82 | 🔴 Not Created |
| 84 | **Create Divider "Or continue with"** | Visual divider | Task 83 | 🔴 Not Created |
| 85 | **Create Google Login Button** | Google sign-in button | Task 84 | 🔴 Not Created |
| 86 | **Create Facebook Login Button** | Facebook sign-in button | Task 84 | 🔴 Not Created |
| 87 | **Create Social Login Placeholder** | "Coming soon" or disable | Task 85 | 🔴 Not Created |
| 88 | **Create Auth Loading States** | Loading spinners | Task 30 | 🔴 Not Created |
| 89 | **Create Auth Error Toast** | Error notifications | Task 47 | 🔴 Not Created |
| 90 | **Test Registration** | Full registration test | Task 34 | 🔴 Not Created |
| 91 | **Test Login** | Full login test | Task 52 | 🔴 Not Created |
| 92 | **Test Password Reset Email** | Test email flow | Task 68 | 🔴 Not Created |
| 93 | **Test Password Reset OTP** | Test WhatsApp OTP | Task 68 | 🔴 Not Created |
| 94 | **Test Session Persistence** | Test remember me | Task 82 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── app/
    └── (storefront)/
        └── account/
            ├── layout.tsx                      # Auth layout (Task 02)
            ├── login/
            │   └── page.tsx                    # Login page (Task 03)
            ├── register/
            │   └── page.tsx                    # Register page (Task 04)
            ├── forgot-password/
            │   └── page.tsx                    # Forgot password (Task 05)
            └── reset-password/
                └── page.tsx                    # Reset password (Task 06)
└── components/
    └── storefront/
        └── auth/
            ├── AuthLayout/
            │   ├── AuthLayout.tsx              # Layout (Task 02)
            │   ├── AuthGuard.tsx               # Protected routes (Task 14)
            │   └── GuestGuard.tsx              # Guest only (Task 15)
            ├── Register/
            │   ├── RegisterForm.tsx            # Form (Task 18)
            │   ├── PasswordStrength.tsx        # Strength (Task 26)
            │   └── PasswordRequirements.tsx    # Requirements (Task 27)
            ├── Login/
            │   ├── LoginForm.tsx               # Form (Task 36)
            │   ├── RememberMe.tsx              # Checkbox (Task 41)
            │   └── SocialLogin.tsx             # Social buttons (Task 83)
            ├── ForgotPassword/
            │   ├── ForgotPasswordForm.tsx      # Form (Task 54)
            │   ├── EmailSentMessage.tsx        # Email sent (Task 58)
            │   └── OTPInput.tsx                # OTP entry (Task 60)
            └── ResetPassword/
                └── ResetPasswordForm.tsx       # Form (Task 63)
└── stores/
    └── storefront/
        └── authStore.ts                        # Zustand store (Task 07)
└── hooks/
    └── storefront/
        ├── useAuth.ts                          # Auth hook wrapper (Task 13)
        └── useTokenRefresh.ts                  # Token refresh (Task 72)
└── services/
    └── storefront/
        └── auth/
            ├── authService.ts                  # Auth API (Task 45)
            └── tokenService.ts                 # Token management (Task 69)
└── types/
    └── storefront/
        └── auth.types.ts                       # Auth types (Task 08)
└── lib/
    └── axios/
        └── axiosInterceptor.ts                 # Token interceptor (Task 73)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Auth Routes & Store | 16 | 0 | 0% |
| B | Registration Flow | 18 | 0 | 0% |
| C | Login Flow | 18 | 0 | 0% |
| D | Password Reset | 16 | 0 | 0% |
| E | Session & Remember Me | 14 | 0 | 0% |
| F | Social Login Prep & Testing | 12 | 0 | 0% |
| **Total** | | **94** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **JWT tokens** - Access (15min) + Refresh (7 days)
3. **httpOnly cookies** - Store tokens securely
4. **Phone format** - Sri Lanka +94 format
5. **WhatsApp OTP** - Alternative to email reset
6. **Cart merge** - Merge guest cart on login
7. **Social login** - Prepare buttons, full implementation later
8. **Remember me** - Extend refresh token to 30 days
9. **Rate limiting** - Handle too many login attempts
