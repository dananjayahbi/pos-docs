# Group B: Registration Flow

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create customer registration with email/phone, password strength, and form validation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Auth-Routes-Store](../Group-A_Auth-Routes-Store/)
- **→ Next Group:** [Group-C_Login-Flow](../Group-C_Login-Flow/)

---

## Group Overview

This group creates the registration flow. Creates register page and form components. Creates email input and phone input with +94 Sri Lanka format. Creates email OR phone toggle for choosing registration method. Creates first name and last name inputs. Creates password input with confirm password, password strength meter, and password requirements display. Creates terms checkbox for accepting terms of service. Creates Zod validation schema and form submission logic. Creates register API service and success handling with redirect. Creates login link for existing users. Verifies complete registration flow.

### Key Outcomes

- Register page component
- Register form wrapper
- Email input field
- Phone input (+94 format)
- Email or phone toggle
- First name input
- Last name input
- Password input
- Confirm password input
- Password strength meter
- Password requirements list
- Terms checkbox
- Zod validation schema
- Register submit logic
- Register API service
- Registration success
- Login link
- Registration flow verified

### Technology Context

- **Forms:** React Hook Form
- **Validation:** Zod schema
- **Phone:** +94 XX XXX XXXX
- **Password:** Strength indicator

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Form-Inputs.md` | Create form and input fields | 17-26 |
| 02 | `02_Tasks-27-34_Validation-Submit-Verify.md` | Create validation, submission, and verification | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Register Page | Low | Task 16 |
| 18 | Create Register Form | Medium | Task 17 |
| 19 | Create Email Input | Low | Task 18 |
| 20 | Create Phone Input | Medium | Task 18 |
| 21 | Create Email OR Phone Toggle | Low | Task 19 |
| 22 | Create First Name Input | Low | Task 18 |
| 23 | Create Last Name Input | Low | Task 18 |
| 24 | Create Password Input | Low | Task 18 |
| 25 | Create Confirm Password Input | Low | Task 24 |
| 26 | Create Password Strength Meter | Medium | Task 24 |
| 27 | Create Password Requirements | Low | Task 24 |
| 28 | Create Terms Checkbox | Low | Task 18 |
| 29 | Create Register Validation | Medium | Task 18 |
| 30 | Create Register Submit | Medium | Task 29 |
| 31 | Create Register API Service | Medium | Task 30 |
| 32 | Create Register Success | Low | Task 31 |
| 33 | Create Login Link | Low | Task 17 |
| 34 | Verify Registration Flow | Low | Task 33 |

---

## Execution Order

```
Task 17: Register Page
    │
    ▼
Task 18: Register Form
    │
    ├──────────────────────────────────────────────────┐
    │                                                  │
    ├────────┬────────┬────────┬────────┬────────┐     │
    ▼        ▼        ▼        ▼        ▼        │     │
T-19     T-20     T-22     T-23     T-24     T-28    │
(Email) (Phone) (First) (Last)  (Pass)  (Terms)    │
    │        │        │        │        │        │     │
    ▼        │        │        │     ┌──┴──┬─────┐     │
T-21        │        │        │     ▼     ▼     │     │
(Toggle)    │        │        │   T-25  T-26  T-27   │
    │        │        │        │  (Conf)(Str)(Reqs)  │
    │        │        │        │     │     │     │     │
    └────────┴────────┴────────┴─────┴─────┴─────┘     │
                          │                            │
                          ▼                            │
                    Task 29: Validation                │
                          │                            │
                          ▼                            │
                    Task 30: Submit                    │
                          │                            │
                          ▼                            │
                    Task 31: API Service               │
                          │                            │
                          ▼                            │
                    Task 32: Success                   │
                          │                            │
Task 33: Login Link ──────┘                            │
    │                                                  │
    └──────────────────────────────────────────────────┘
                          │
                          ▼
                    Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── auth/
│           └── Register/
│               ├── RegisterPage.tsx
│               ├── RegisterForm.tsx
│               ├── EmailInput.tsx
│               ├── PhoneInput.tsx
│               ├── EmailPhoneToggle.tsx
│               ├── NameInputs.tsx
│               ├── PasswordInput.tsx
│               ├── ConfirmPassword.tsx
│               ├── PasswordStrength.tsx
│               ├── PasswordRequirements.tsx
│               ├── TermsCheckbox.tsx
│               ├── LoginLink.tsx
│               └── index.ts
├── services/
│   └── storefront/
│       └── auth/
│           └── registerService.ts
└── lib/
    └── validations/
        └── registerSchema.ts
```

---

## Notes for AI Agents

### Register Page (Task 17)
| Section | Order |
|---------|-------|
| 1 | Logo / Title |
| 2 | Register form |
| 3 | Login link |

### Email OR Phone Toggle (Task 21)
| Option | Default |
|--------|---------|
| Email | Selected |
| Phone | Alternative |
| Style | Tab buttons |

### Phone Input (Task 20)
| Feature | Value |
|---------|-------|
| Prefix | +94 (fixed) |
| Format | 7X XXX XXXX |
| Mask | Input masking |
| Validate | Sri Lanka mobile |

### Password Strength Meter (Task 26)
| Level | Criteria | Color |
|-------|----------|-------|
| Weak | < 8 chars | Red |
| Fair | 8+ chars | Orange |
| Good | + number | Yellow |
| Strong | + special | Green |

### Password Requirements (Task 27)
| Requirement | Description |
|-------------|-------------|
| Length | Minimum 8 characters |
| Uppercase | At least one uppercase |
| Lowercase | At least one lowercase |
| Number | At least one digit |
| Special | One special character |

### Terms Checkbox (Task 28)
| Feature | Value |
|---------|-------|
| Label | "I agree to Terms & Privacy Policy" |
| Links | Terms, Privacy (open modal or new tab) |
| Required | Yes |

### Register Validation (Task 29)
| Field | Rules |
|-------|-------|
| email | Valid format (if chosen) |
| phone | +94 mobile format (if chosen) |
| firstName | Required, min 2 chars |
| lastName | Required, min 2 chars |
| password | 8+ chars, strength rules |
| confirmPassword | Match password |
| terms | Must be checked |

### Register API Service (Task 31)
| Endpoint | Method |
|----------|--------|
| /api/auth/register | POST |
| Payload | email/phone, name, password |
| Response | User object, tokens |

### Register Success (Task 32)
| Action | Description |
|--------|-------------|
| Toast | "Account created!" |
| Redirect | /account or returnUrl |
| Auto-login | Yes (tokens stored) |
