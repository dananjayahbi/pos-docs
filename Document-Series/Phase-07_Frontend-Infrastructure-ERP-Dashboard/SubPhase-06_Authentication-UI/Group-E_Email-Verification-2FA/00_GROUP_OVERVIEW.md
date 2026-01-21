# Group E: Email Verification & 2FA

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** E of F  
> **Tasks Covered:** 63-76  
> **Group Goal:** Build email verification pages and two-factor authentication setup and verify flows

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Password-Reset-Flow](../Group-D_Password-Reset-Flow/)
- **→ Next Group:** [Group-F_Route-Protection-Session](../Group-F_Route-Protection-Session/)

---

## Group Overview

This group creates email verification and two-factor authentication pages. Email verification: creates verify page, extracts token from URL, calls verify API, handles success (auto-redirect to login) and failure (invalid/expired token). Creates resend verification page with form and API integration. 2FA: creates setup page with QR code and backup codes, creates verify page with 6-digit OTP input component (auto-focus, paste support), and implements 2FA verification API call.

### Key Outcomes

- Verify email page route
- Token extraction from URL
- Verification API request
- Verification success handling
- Verification failure handling
- Resend verification page
- Resend verification form
- Resend API logic
- 2FA setup page
- 2FA verification page
- OTP input component (6-digit)
- Backup codes display
- 2FA verification API
- All flows tested

### Technology Context

- **Email Verification:** Token-based
- **2FA:** TOTP (Time-based OTP)
- **OTP Input:** 6 separate inputs
- **Backup Codes:** 8 codes, downloadable

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-63-70_Email-Verification.md` | Create email verification and resend pages | 63-70 |
| 02 | `02_Tasks-71-76_2FA-Setup-Verification.md` | Create 2FA setup and verification pages | 71-76 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 63 | Create Verify Email Page | Low | Task 14 |
| 64 | Extract Verification Token | Low | Task 63 |
| 65 | Implement Verification Request | Low | Task 64 |
| 66 | Handle Verification Success | Low | Task 65 |
| 67 | Handle Verification Failure | Low | Task 65 |
| 68 | Create Resend Verification Page | Low | Task 63 |
| 69 | Create Resend Verification Form | Low | Task 68 |
| 70 | Implement Resend Logic | Low | Task 69 |
| 71 | Create 2FA Setup Page | Medium | Task 14 |
| 72 | Create 2FA Verification Page | Medium | Task 71 |
| 73 | Create OTP Input Component | Medium | Task 72 |
| 74 | Create Backup Codes Display | Low | Task 71 |
| 75 | Implement 2FA Verification | Medium | Task 73 |
| 76 | Test Email & 2FA Flows | Low | Task 75 |

---

## Execution Order

```
Task 63: Verify Email Page
    │
    ▼
Task 64: Extract Token
    │
    ▼
Task 65: Verification Request
    │
    ├──────────────────────┐
    ▼                      ▼
Task 66               Task 67
(Success)             (Failure)
    │                      │
    └──────────┬───────────┘
               │
               ▼
         Task 68: Resend Page
               │
               ▼
         Task 69: Resend Form
               │
               ▼
         Task 70: Resend Logic
               │
               ▼
         Task 71: 2FA Setup Page
               │
               ├──────────────────────┐
               ▼                      ▼
         Task 72               Task 74
         (Verify Page)         (Backup Codes)
               │
               ▼
         Task 73: OTP Input
               │
               ▼
         Task 75: 2FA Verification
               │
               ▼
         Task 76: Test
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (auth)/
│       ├── verify-email/
│       │   └── page.tsx
│       ├── resend-verification/
│       │   └── page.tsx
│       └── two-factor/
│           ├── setup/
│           │   └── page.tsx
│           └── verify/
│               └── page.tsx
└── components/
    └── auth/
        ├── OTPInput.tsx
        └── BackupCodesDisplay.tsx
```

---

## Notes for AI Agents

### Email Verification Flow
1. User clicks link in email
2. Page loads with token in URL
3. Auto-call verify API
4. Show success or failure
5. Redirect to login on success

### Verification Success (Task 66)
- Show success message
- Show checkmark icon
- Auto-redirect after 3 seconds
- Manual "Go to Login" link

### Verification Failure (Task 67)
| Error | Display |
|-------|---------|
| Token expired | Expiry message + resend link |
| Token invalid | Invalid message + support |
| Already verified | Already verified message |

### Resend Verification Form (Task 69)
| Field | Validation |
|-------|------------|
| email | Required, valid email |

### 2FA Setup Page (Task 71)
| Element | Description |
|---------|-------------|
| QR Code | TOTP secret as QR |
| Manual code | Text version of secret |
| Input | Verify first OTP |
| Backup codes | Generated after setup |

### OTP Input Component (Task 73)
| Feature | Description |
|---------|-------------|
| Inputs | 6 separate inputs |
| Auto-focus | Move to next on input |
| Backspace | Move to previous |
| Paste | Handle full paste |
| Submit | Auto-submit when filled |

### Backup Codes Display (Task 74)
| Feature | Description |
|---------|-------------|
| Codes | 8 backup codes |
| Format | XXXX-XXXX each |
| Download | Text file download |
| Copy | Copy all button |
| Warning | Show only once notice |

### 2FA Verification (Task 75)
- Call during login if 2FA enabled
- Submit 6-digit OTP
- Handle invalid code
- Use backup code option
