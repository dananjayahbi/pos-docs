# Group D: Password Reset

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create password reset with email and WhatsApp OTP options

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Login-Flow](../Group-C_Login-Flow/)
- **→ Next Group:** [Group-E_Session-Remember-Me](../Group-E_Session-Remember-Me/)

---

## Group Overview

This group creates the password reset flow. Creates forgot password page and form with email/phone input. Creates reset request submission and API call. Creates email sent confirmation message. Creates WhatsApp OTP option as alternative to email. Creates 6-digit OTP input with verification API and resend functionality with countdown. Creates reset password page with new password input and confirmation. Creates password reset submission and success redirect to login. Verifies complete password reset flow for both email and OTP methods.

### Key Outcomes

- Forgot password page
- Forgot password form
- Email/phone input
- Reset request submit
- Reset request API
- Email sent message
- WhatsApp OTP option
- OTP input (6-digit)
- OTP verification API
- Resend OTP with countdown
- Reset password page
- New password input
- Confirm new password
- Reset password submit
- Reset success redirect
- Password reset flow verified

### Technology Context

- **Email:** Reset link
- **WhatsApp:** OTP delivery
- **OTP:** 6 digits
- **Countdown:** Resend timer

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-61_Request-OTP.md` | Create reset request and OTP | 53-61 |
| 02 | `02_Tasks-62-68_Reset-Submit-Verify.md` | Create resend, reset form, and verification | 62-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Forgot Password Page | Low | Task 52 |
| 54 | Create Forgot Password Form | Low | Task 53 |
| 55 | Create Email/Phone Input | Low | Task 54 |
| 56 | Create Request Reset Submit | Low | Task 55 |
| 57 | Create Reset Request API | Medium | Task 56 |
| 58 | Create Email Sent Message | Low | Task 57 |
| 59 | Create WhatsApp OTP Option | Medium | Task 57 |
| 60 | Create OTP Input | Medium | Task 59 |
| 61 | Create OTP Verification | Medium | Task 60 |
| 62 | Create Resend OTP | Low | Task 60 |
| 63 | Create Reset Password Page | Low | Task 61 |
| 64 | Create New Password Input | Low | Task 63 |
| 65 | Create Confirm New Password | Low | Task 64 |
| 66 | Create Reset Password Submit | Medium | Task 65 |
| 67 | Create Reset Success | Low | Task 66 |
| 68 | Verify Password Reset Flow | Low | Task 67 |

---

## Execution Order

```
Task 53: Forgot Password Page
    │
    ▼
Task 54: Forgot Password Form
    │
    ▼
Task 55: Email/Phone Input
    │
    ▼
Task 56: Request Reset Submit
    │
    ▼
Task 57: Reset Request API
    │
    ├────────┬────────┐
    ▼        ▼        │
T-58     T-59        │
(Email) (WhatsApp)   │
    │        │        │
    │        ▼        │
    │     T-60       │
    │     (OTP)      │
    │        │        │
    │   ┌────┴────┐   │
    │   ▼         ▼   │
    │ T-61      T-62 │
    │ (Verify)(Resend)│
    │   │         │   │
    │   └────┬────┘   │
    │        │        │
    └────────┴────────┘
              │
              ▼
        Task 63: Reset Password Page
              │
              ▼
        Task 64: New Password Input
              │
              ▼
        Task 65: Confirm New Password
              │
              ▼
        Task 66: Reset Password Submit
              │
              ▼
        Task 67: Reset Success
              │
              ▼
        Task 68: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── auth/
│           ├── ForgotPassword/
│           │   ├── ForgotPasswordPage.tsx
│           │   ├── ForgotPasswordForm.tsx
│           │   ├── EmailSentMessage.tsx
│           │   ├── WhatsAppOTPOption.tsx
│           │   ├── OTPInput.tsx
│           │   ├── ResendOTP.tsx
│           │   └── index.ts
│           └── ResetPassword/
│               ├── ResetPasswordPage.tsx
│               ├── ResetPasswordForm.tsx
│               ├── NewPasswordInput.tsx
│               ├── ConfirmNewPassword.tsx
│               └── index.ts
└── services/
    └── storefront/
        └── auth/
            ├── passwordResetService.ts
            └── otpService.ts
```

---

## Notes for AI Agents

### Forgot Password Page (Task 53)
| Section | Order |
|---------|-------|
| 1 | Title "Reset Password" |
| 2 | Form / OTP input |
| 3 | Back to login link |

### Email/Phone Input (Task 55)
| Feature | Value |
|---------|-------|
| Label | "Email or Phone" |
| Detect | Email or phone format |
| Required | Yes |

### Reset Request API (Task 57)
| Endpoint | Method |
|----------|--------|
| /api/auth/forgot-password | POST |
| Payload | email or phone |
| Response | Method (email or OTP) |

### Email Sent Message (Task 58)
| Element | Content |
|---------|---------|
| Icon | Email icon |
| Title | "Check your email" |
| Message | "We sent a reset link to..." |
| Tip | "Check spam folder" |

### WhatsApp OTP Option (Task 59)
| Feature | Description |
|---------|-------------|
| Show | When phone number provided |
| Text | "Receive OTP via WhatsApp" |
| Icon | WhatsApp icon |
| Send | 6-digit code |

### OTP Input (Task 60)
| Feature | Value |
|---------|-------|
| Digits | 6 |
| Style | Separate boxes |
| Auto-focus | Next box |
| Paste | Support full code |

### OTP Verification (Task 61)
| Endpoint | Method |
|----------|--------|
| /api/auth/verify-otp | POST |
| Payload | phone, otp |
| Response | Reset token |

### Resend OTP (Task 62)
| Feature | Value |
|---------|-------|
| Countdown | 60 seconds |
| Button | Disabled during countdown |
| Text | "Resend in Xs" |
| After | "Resend OTP" |

### Reset Password Page (Task 63)
| Access | Method |
|--------|--------|
| Email | Token in URL |
| OTP | After verification |
| Validate | Token still valid |

### New Password Input (Task 64)
| Feature | Value |
|---------|-------|
| Label | "New Password" |
| Show strength | Yes |
| Requirements | Same as registration |

### Reset Success (Task 67)
| Element | Content |
|---------|---------|
| Icon | Check mark |
| Title | "Password Reset!" |
| Message | "You can now login..." |
| Action | Redirect to login |
