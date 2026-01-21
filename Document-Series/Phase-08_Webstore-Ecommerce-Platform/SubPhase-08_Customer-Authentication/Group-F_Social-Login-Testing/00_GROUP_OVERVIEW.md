# Group F: Social Login Prep & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** F of F  
> **Tasks Covered:** 83-94  
> **Group Goal:** Prepare social login UI and perform comprehensive authentication testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Session-Remember-Me](../Group-E_Session-Remember-Me/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-09_Customer-Portal](../SubPhase-09_Customer-Portal/)

---

## Group Overview

This group prepares social login UI and performs testing. Creates social login section with divider "Or continue with". Creates Google and Facebook login buttons with placeholder functionality for later implementation. Creates auth loading states for form submissions. Creates auth error toast for displaying errors. Performs comprehensive testing: registration flow, login flow, password reset via email, password reset via WhatsApp OTP, and session persistence with remember me.

### Key Outcomes

- Social login section
- "Or continue with" divider
- Google login button
- Facebook login button
- Social login placeholder
- Auth loading states
- Auth error toast
- Registration tested
- Login tested
- Password reset email tested
- Password reset OTP tested
- Session persistence tested

### Technology Context

- **Social:** UI only (Phase-09 implementation)
- **Loading:** Spinners, disabled buttons
- **Testing:** Manual + automated
- **Toast:** Error notifications

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-89_Social-Loading-Errors.md` | Create social login UI and loading states | 83-89 |
| 02 | `02_Tasks-90-94_Comprehensive-Testing.md` | Perform comprehensive testing | 90-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Social Login Section | Low | Task 82 |
| 84 | Create Divider "Or continue with" | Low | Task 83 |
| 85 | Create Google Login Button | Low | Task 84 |
| 86 | Create Facebook Login Button | Low | Task 84 |
| 87 | Create Social Login Placeholder | Low | Task 85 |
| 88 | Create Auth Loading States | Medium | Task 30 |
| 89 | Create Auth Error Toast | Low | Task 47 |
| 90 | Test Registration | Low | Task 34 |
| 91 | Test Login | Low | Task 52 |
| 92 | Test Password Reset Email | Low | Task 68 |
| 93 | Test Password Reset OTP | Low | Task 68 |
| 94 | Test Session Persistence | Low | Task 82 |

---

## Execution Order

```
Task 83: Social Login Section
    │
    ▼
Task 84: Divider
    │
    ├────────┬────────┐
    ▼        ▼        │
T-85     T-86        │
(Google)(Facebook)   │
    │        │        │
    └────────┘        │
         │            │
         ▼            │
    Task 87: Placeholder
         │            │
         └────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
Task 88: Loading    Task 89: Error Toast
    │                   │
    └─────────┬─────────┘
              │
    ┌─────────┴─────────┬─────────┬─────────┐
    ▼                   ▼         ▼         ▼
T-90              T-91       T-92       T-93
(Register)       (Login)   (Email)    (OTP)
    │                   │         │         │
    └───────────────────┴─────────┴─────────┘
                        │
                        ▼
                  Task 94: Session Test
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── auth/
│           ├── SocialLogin/
│           │   ├── SocialLoginSection.tsx
│           │   ├── SocialDivider.tsx
│           │   ├── GoogleLoginButton.tsx
│           │   ├── FacebookLoginButton.tsx
│           │   └── index.ts
│           └── common/
│               ├── AuthLoadingSpinner.tsx
│               ├── AuthErrorToast.tsx
│               └── index.ts
└── tests/
    └── e2e/
        └── auth/
            ├── registration.spec.ts
            ├── login.spec.ts
            ├── passwordReset.spec.ts
            └── session.spec.ts
```

---

## Notes for AI Agents

### Social Login Section (Task 83)
| Position | Description |
|----------|-------------|
| Location | Below main form |
| Style | Centered, spaced |
| Width | Match form width |

### Divider (Task 84)
| Element | Style |
|---------|-------|
| Line | Light gray |
| Text | "Or continue with" |
| Style | Centered on line |

### Google Login Button (Task 85)
| Feature | Value |
|---------|-------|
| Text | "Continue with Google" |
| Icon | Google G logo |
| Colors | White bg, dark text |
| Style | Full width button |

### Facebook Login Button (Task 86)
| Feature | Value |
|---------|-------|
| Text | "Continue with Facebook" |
| Icon | Facebook F logo |
| Colors | Facebook blue |
| Style | Full width button |

### Social Login Placeholder (Task 87)
| Option 1 | "Coming soon" tooltip |
| Option 2 | Disabled button style |
| Option 3 | Click shows "Not available yet" |
| Future | Full OAuth in Phase-09 |

### Auth Loading States (Task 88)
| State | UI |
|-------|-----|
| Submitting | Button spinner |
| Button text | "Logging in..." |
| Form | Disabled inputs |
| Overlay | Optional dim |

### Auth Error Toast (Task 89)
| Type | Style |
|------|-------|
| Error | Red, with icon |
| Position | Top right |
| Duration | 5 seconds |
| Dismiss | X button |

### Test Registration (Task 90)
| Test Case | Expected |
|-----------|----------|
| Valid email + password | Success, auto-login |
| Valid phone + password | Success, auto-login |
| Invalid email | Validation error |
| Weak password | Strength error |
| Terms unchecked | Required error |
| Existing email | "Already registered" |

### Test Login (Task 91)
| Test Case | Expected |
|-----------|----------|
| Valid email/password | Success, redirect |
| Valid phone/password | Success, redirect |
| Wrong password | Error message |
| Non-existent user | Error message |
| From checkout | Return to checkout |

### Test Password Reset Email (Task 92)
| Test Case | Expected |
|-----------|----------|
| Valid email | "Check email" message |
| Click link | Reset page opens |
| Set new password | Success redirect |
| Invalid token | Error message |

### Test Password Reset OTP (Task 93)
| Test Case | Expected |
|-----------|----------|
| Valid phone | OTP sent to WhatsApp |
| Enter correct OTP | Proceed to reset |
| Wrong OTP | Error, retry |
| Resend OTP | New code sent |

### Test Session Persistence (Task 94)
| Test Case | Expected |
|-----------|----------|
| Remember me checked | 30 day session |
| Remember me unchecked | 7 day session |
| Refresh page | Still logged in |
| Token expired | Auto refresh |
| Logout | Session cleared |
