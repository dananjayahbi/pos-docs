# Group D: Password Reset Flow

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** D of F  
> **Tasks Covered:** 47-62  
> **Group Goal:** Build password reset request and confirmation pages with token validation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Registration-Flow](../Group-C_Registration-Flow/)
- **→ Next Group:** [Group-E_Email-Verification-2FA](../Group-E_Email-Verification-2FA/)

---

## Group Overview

This group creates the complete password reset flow with two pages. Forgot Password page: creates route, Zod schema, form with email input, submission to forgot password API, success message (email sent), and error handling (email not found, rate limiting). Reset Password page: creates route, schema for new password, form with password and confirmation, token extraction from URL, token validation, expired token handling, reset submission to API, success with login redirect, and error handling.

### Key Outcomes

- Forgot password page route
- Forgot password Zod schema
- Forgot password form
- Reset request submission
- Success message (email sent)
- Error handling (not found, rate limit)
- Reset password page route
- Reset password Zod schema
- Reset password form
- Token extraction from URL
- Token validation
- Expired token handling
- Reset submission to API
- Success (redirect to login)
- Reset error handling
- Password reset flow tested

### Technology Context

- **Form:** React Hook Form
- **Validation:** Zod schemas
- **Token:** URL query parameter
- **API:** authService.forgotPassword, resetPassword

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-47-52_Forgot-Password.md` | Create forgot password page and flow | 47-52 |
| 02 | `02_Tasks-53-62_Reset-Password.md` | Create reset password page and flow | 53-62 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 47 | Create Forgot Password Page | Low | Task 14 |
| 48 | Create Forgot Password Schema | Low | Task 47 |
| 49 | Create Forgot Password Form | Low | Task 48 |
| 50 | Implement Reset Request Submission | Low | Task 49 |
| 51 | Handle Reset Request Success | Low | Task 50 |
| 52 | Handle Reset Request Errors | Low | Task 50 |
| 53 | Create Reset Password Page | Low | Task 14 |
| 54 | Create Reset Password Schema | Low | Task 53 |
| 55 | Create Reset Password Form | Medium | Task 54 |
| 56 | Extract Token from URL | Low | Task 53 |
| 57 | Validate Reset Token | Medium | Task 56 |
| 58 | Handle Expired Token | Low | Task 57 |
| 59 | Implement Reset Submission | Medium | Task 55 |
| 60 | Handle Reset Success | Low | Task 59 |
| 61 | Handle Reset Errors | Low | Task 59 |
| 62 | Test Password Reset Flow | Low | Task 61 |

---

## Execution Order

```
Task 47: Forgot Password Page
    │
    ▼
Task 48: Forgot Password Schema
    │
    ▼
Task 49: Forgot Password Form
    │
    ▼
Task 50: Reset Request Submission
    │
    ├──────────────────────┐
    ▼                      ▼
Task 51               Task 52
(Success)             (Errors)
    │                      │
    └──────────┬───────────┘
               │
               ▼
         Task 53: Reset Password Page
               │
               ▼
         Task 54: Reset Password Schema
               │
               ├──────────────────────┐
               ▼                      ▼
         Task 55               Task 56
         (Form)                (Token Extract)
               │                      │
               │                      ▼
               │               Task 57: Validate Token
               │                      │
               │                      ▼
               │               Task 58: Expired
               │                      │
               └──────────────────────┘
                              │
                              ▼
                        Task 59: Reset Submission
                              │
                        ┌─────┴─────┐
                        ▼           ▼
                      Task 60    Task 61
                      (Success)   (Errors)
                        │           │
                        └─────┬─────┘
                              ▼
                        Task 62: Test
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (auth)/
│       ├── forgot-password/
│       │   └── page.tsx
│       └── reset-password/
│           └── page.tsx
├── components/
│   └── auth/
│       ├── ForgotPasswordForm.tsx
│       └── ResetPasswordForm.tsx
└── lib/
    └── validations/
        ├── forgotPassword.ts
        └── resetPassword.ts
```

---

## Notes for AI Agents

### Forgot Password Schema (Task 48)
| Field | Validation |
|-------|------------|
| email | Required, valid email |

### Forgot Password Form (Task 49)
| Element | Description |
|---------|-------------|
| Email input | User's email address |
| Submit button | "Send Reset Link" |
| Back link | Return to login |

### Reset Request Success (Task 51)
- Show success message
- Inform check email
- Hide form after success
- Show "Back to Login" link

### Reset Request Errors (Task 52)
| Error | Display |
|-------|---------|
| Email not found | Form-level error |
| Rate limited | Countdown timer |
| Network error | Toast notification |

### Token Extraction (Task 56)
- Read from URL: ?token=xyz
- Use useSearchParams hook
- Validate presence

### Token Validation (Task 57)
- Call API to validate token
- Show loading during check
- Handle valid/invalid states

### Expired Token Handling (Task 58)
- Show expiry message
- Link to request new reset
- Clear instructions

### Reset Password Schema (Task 54)
| Field | Validation |
|-------|------------|
| password | Min 8, strength rules |
| confirmPassword | Must match |

### Reset Success (Task 60)
1. Show success message
2. Auto-redirect to login
3. Countdown timer (3 seconds)
