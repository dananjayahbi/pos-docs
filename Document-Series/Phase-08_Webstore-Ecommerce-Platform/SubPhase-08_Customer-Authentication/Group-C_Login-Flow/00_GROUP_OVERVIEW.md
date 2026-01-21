# Group C: Login Flow

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Create customer login with email/phone detection, remember me, and error handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Registration-Flow](../Group-B_Registration-Flow/)
- **→ Next Group:** [Group-D_Password-Reset](../Group-D_Password-Reset/)

---

## Group Overview

This group creates the login flow. Creates login page and form components. Creates combined email/phone input with auto-detection of input type. Creates password input with show/hide toggle. Creates remember me checkbox and forgot password link. Creates Zod validation schema and login submission logic. Creates login API service and token response handling. Creates error handling for invalid credentials and rate limiting (too many attempts). Creates success redirect with support for checkout return. Creates register link for new users. Verifies complete login flow.

### Key Outcomes

- Login page component
- Login form wrapper
- Email/phone input (combined)
- Input type detection
- Password input
- Show password toggle
- Remember me checkbox
- Forgot password link
- Zod validation schema
- Login submit logic
- Login API service
- Token response handling
- Invalid credentials error
- Too many attempts error
- Login success redirect
- Checkout return logic
- Register link
- Login flow verified

### Technology Context

- **Forms:** React Hook Form
- **Validation:** Zod schema
- **Detection:** Email vs phone auto
- **Tokens:** JWT storage

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Form-Validation.md` | Create form and validation | 35-44 |
| 02 | `02_Tasks-45-52_API-Errors-Redirect.md` | Create API, error handling, and redirect | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Login Page | Low | Task 34 |
| 36 | Create Login Form | Medium | Task 35 |
| 37 | Create Email/Phone Input | Low | Task 36 |
| 38 | Create Detect Input Type | Medium | Task 37 |
| 39 | Create Password Input | Low | Task 36 |
| 40 | Create Show Password Toggle | Low | Task 39 |
| 41 | Create Remember Me Checkbox | Low | Task 36 |
| 42 | Create Forgot Password Link | Low | Task 36 |
| 43 | Create Login Validation | Medium | Task 36 |
| 44 | Create Login Submit | Medium | Task 43 |
| 45 | Create Login API Service | Medium | Task 44 |
| 46 | Create Handle Token Response | Medium | Task 45 |
| 47 | Create Login Error Handling | Low | Task 45 |
| 48 | Create Too Many Attempts | Low | Task 47 |
| 49 | Create Login Success Redirect | Low | Task 46 |
| 50 | Create Checkout Return | Low | Task 49 |
| 51 | Create Register Link | Low | Task 35 |
| 52 | Verify Login Flow | Low | Task 51 |

---

## Execution Order

```
Task 35: Login Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 36: Login Form                                    │
    │                                                  │
    ├────────┬────────┬────────┬────────┐              │
    ▼        ▼        ▼        ▼        │              │
T-37     T-39     T-41     T-42        │              │
(Input) (Pass)  (Remember)(Forgot)     │              │
    │        │        │        │        │              │
    ▼        ▼        │        │        │              │
T-38     T-40        │        │        │              │
(Detect)(Toggle)     │        │        │              │
    │        │        │        │        │              │
    └────────┴────────┴────────┘        │              │
                   │                    │              │
                   ▼                    │              │
             Task 43: Validation        │              │
                   │                    │              │
                   ▼                    │              │
             Task 44: Submit            │              │
                   │                    │              │
                   ▼                    │              │
             Task 45: API Service       │              │
                   │                    │              │
              ┌────┴────┐               │              │
              ▼         ▼               │              │
           T-46      T-47              │              │
          (Token)  (Error)             │              │
              │         │               │              │
              │         ▼               │              │
              │      T-48              │              │
              │   (Rate Limit)         │              │
              │         │               │              │
              ▼         │               │              │
           T-49        │               │              │
         (Redirect)    │               │              │
              │         │               │              │
              ▼         │               │              │
           T-50        │               │              │
        (Checkout)     │               │              │
              │         │               │              │
              └────┬────┘               │              │
                   │                    │              │
Task 51: Register Link ─────────────────┘              │
    │                                                  │
    └──────────────────────────────────────────────────┘
                          │
                          ▼
                    Task 52: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── auth/
│           └── Login/
│               ├── LoginPage.tsx
│               ├── LoginForm.tsx
│               ├── EmailPhoneInput.tsx
│               ├── PasswordInput.tsx
│               ├── ShowPasswordToggle.tsx
│               ├── RememberMe.tsx
│               ├── ForgotPasswordLink.tsx
│               ├── RegisterLink.tsx
│               └── index.ts
├── services/
│   └── storefront/
│       └── auth/
│           └── loginService.ts
└── lib/
    └── validations/
        └── loginSchema.ts
```

---

## Notes for AI Agents

### Login Page (Task 35)
| Section | Order |
|---------|-------|
| 1 | Logo / Title |
| 2 | Login form |
| 3 | Social login (later) |
| 4 | Register link |

### Email/Phone Input (Task 37)
| Feature | Value |
|---------|-------|
| Label | "Email or Phone" |
| Placeholder | "email@example.com or +94..." |
| Icon | Mail icon |

### Detect Input Type (Task 38)
| Input | Detection |
|-------|-----------|
| Contains @ | Email |
| Starts +94 or 07 | Phone |
| All digits | Phone |
| Otherwise | Email |

### Show Password Toggle (Task 40)
| State | Icon |
|-------|------|
| Hidden | Eye |
| Shown | EyeOff |
| Click | Toggle visibility |

### Remember Me Checkbox (Task 41)
| Feature | Value |
|---------|-------|
| Label | "Remember me" |
| Effect | Extend token expiry |
| Default | Unchecked |

### Login Validation (Task 43)
| Field | Rules |
|-------|-------|
| identifier | Required, email or phone format |
| password | Required, min 6 chars |

### Token Response (Task 46)
| Token | Storage | Expiry |
|-------|---------|--------|
| accessToken | httpOnly cookie | 15 min |
| refreshToken | httpOnly cookie | 7 days (or 30 if remember) |

### Login Error Handling (Task 47)
| Error | Message |
|-------|---------|
| 401 | "Invalid email/phone or password" |
| 404 | "Account not found" |
| Network | "Connection error. Try again." |

### Too Many Attempts (Task 48)
| Error | Message |
|-------|---------|
| 429 | "Too many attempts. Try again in X minutes." |
| Action | Disable form temporarily |
| Show | Countdown timer |

### Login Success Redirect (Task 49)
| Source | Redirect |
|--------|----------|
| Direct | /account |
| From checkout | /checkout |
| returnUrl param | That URL |

### Checkout Return (Task 50)
| Check | Action |
|-------|--------|
| returnUrl = /checkout | Redirect to checkout |
| Cart has items | Continue checkout |
| Merge guest cart | If applicable |
