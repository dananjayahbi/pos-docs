# Group C: Registration Flow

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Build multi-step tenant registration form with business info, admin user, and plan selection

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Login-Page-Form](../Group-B_Login-Page-Form/)
- **→ Next Group:** [Group-D_Password-Reset-Flow](../Group-D_Password-Reset-Flow/)

---

## Group Overview

This group creates the multi-step registration flow for new tenants. Creates registration page route and Zod schema. Builds RegisterForm with 4 steps: Business Info (name, type, registration number), Admin User (name, email, password), Contact Info (phone, address, timezone), and Plan Selection. Creates step indicator and navigation buttons. Adds password strength indicator and terms acceptance checkbox. Implements registration submission with success (redirect to verify) and error handling.

### Key Outcomes

- Registration page route
- Registration Zod schema
- RegisterForm with steps
- Step 1: Business Info
- Step 2: Admin User
- Step 3: Contact Info
- Step 4: Plan Selection
- Step indicator component
- Step navigation buttons
- Password strength indicator
- Terms acceptance checkbox
- Registration submission
- Success handling (verify redirect)
- Error handling
- Login link
- Registration flow tested

### Technology Context

- **Form:** React Hook Form multi-step
- **Validation:** Zod schemas per step
- **State:** Form state preserved across steps
- **API:** authService.register

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-39_Form-Steps-Navigation.md` | Create form steps and navigation | 31-39 |
| 02 | `02_Tasks-40-46_Validation-Submission.md` | Add validation, submission, and testing | 40-46 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create Registration Page Route | Low | Task 14 |
| 32 | Create Registration Form Schema | Medium | Task 31 |
| 33 | Create Registration Form Component | Medium | Task 32 |
| 34 | Create Step 1: Business Info | Medium | Task 33 |
| 35 | Create Step 2: Admin User | Medium | Task 34 |
| 36 | Create Step 3: Contact Info | Medium | Task 35 |
| 37 | Create Step 4: Plan Selection | Medium | Task 36 |
| 38 | Create Step Indicator Component | Low | Task 33 |
| 39 | Add Step Navigation Buttons | Low | Task 38 |
| 40 | Add Password Strength Indicator | Low | Task 35 |
| 41 | Add Terms Acceptance Checkbox | Low | Task 36 |
| 42 | Implement Registration Submission | Medium | Task 41 |
| 43 | Handle Registration Success | Low | Task 42 |
| 44 | Handle Registration Errors | Medium | Task 42 |
| 45 | Add Login Link | Low | Task 33 |
| 46 | Test Registration Flow | Low | Task 45 |

---

## Execution Order

```
Task 31: Registration Page Route
    │
    ▼
Task 32: Registration Schema
    │
    ▼
Task 33: RegisterForm Component
    │
    ├──────────────────────┐
    ▼                      ▼
Task 38               Task 45
(Step Indicator)      (Login Link)
    │
    ▼
Task 39: Navigation
    │
    ▼
Task 34: Step 1 (Business)
    │
    ▼
Task 35: Step 2 (Admin)
    │
    ▼
Task 40: Password Strength
    │
    ▼
Task 36: Step 3 (Contact)
    │
    ▼
Task 41: Terms Checkbox
    │
    ▼
Task 37: Step 4 (Plan)
    │
    ▼
Task 42: Submission
    │
    ├──────────────────────┐
    ▼                      ▼
Task 43               Task 44
(Success)             (Errors)
    │                      │
    └──────────┬───────────┘
               ▼
          Task 46: Test
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (auth)/
│       └── register/
│           └── page.tsx
├── components/
│   └── auth/
│       ├── RegisterForm.tsx
│       ├── StepIndicator.tsx
│       └── PasswordStrength.tsx
└── lib/
    └── validations/
        └── register.ts
```

---

## Notes for AI Agents

### Registration Steps
| Step | Name | Fields |
|------|------|--------|
| 1 | Business Info | name, type, registration |
| 2 | Admin User | name, email, password |
| 3 | Contact Info | phone, address, timezone |
| 4 | Plan Selection | subscription plan |

### Step 1: Business Info (Task 34)
| Field | Validation |
|-------|------------|
| businessName | Required, 2-100 chars |
| businessType | Required, select |
| registrationNumber | Optional |

### Step 2: Admin User (Task 35)
| Field | Validation |
|-------|------------|
| firstName | Required, 2-50 chars |
| lastName | Required, 2-50 chars |
| email | Required, valid email |
| password | Min 8, uppercase, lowercase, number |
| confirmPassword | Must match password |

### Step 3: Contact Info (Task 36)
| Field | Validation |
|-------|------------|
| phone | Valid Sri Lankan (+94) |
| address | Optional object |
| timezone | Required, default Asia/Colombo |

### Step 4: Plan Selection (Task 37)
| Plan | Features |
|------|----------|
| Starter | Basic features |
| Professional | Advanced features |
| Enterprise | All features |

### Password Strength (Task 40)
| Level | Criteria |
|-------|----------|
| Weak | < 8 chars |
| Fair | 8+ chars |
| Good | + uppercase + lowercase |
| Strong | + number + special |

### Terms Checkbox (Task 41)
- Required to submit
- Link to terms page
- Link to privacy policy

### Success Handling (Task 43)
1. Show success message
2. Inform about verification email
3. Redirect to /login or /verify-email
