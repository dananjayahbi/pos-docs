# Group B: Login Page & Form

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Build the complete login page with form, validation, and authentication flow

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Auth-Route-Group-Layout](../Group-A_Auth-Route-Group-Layout/)
- **→ Next Group:** [Group-C_Registration-Flow](../Group-C_Registration-Flow/)

---

## Group Overview

This group creates the login page and form with complete authentication flow. Creates login page route and Zod validation schema. Builds LoginForm with React Hook Form, email input, password input (with show/hide toggle), remember me checkbox, forgot password link, and submit button with loading state. Implements login submission connecting to auth service. Handles success (store tokens, update auth store, redirect) and errors. Adds tenant selection for multi-tenant users, registration link, and animations.

### Key Outcomes

- Login page route created
- Login form Zod schema
- LoginForm component
- Email input with validation
- Password input with toggle
- Remember me checkbox
- Forgot password link
- Submit button with loading
- Login submission to API
- Success handling (tokens, redirect)
- Error handling (display errors)
- Tenant selection dropdown
- Registration link
- Redirect after login
- Form animations
- Login flow tested

### Technology Context

- **Form:** React Hook Form
- **Validation:** Zod schemas
- **State:** Zustand auth store
- **API:** authService.login

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-23_Login-Form-Submission.md` | Create login form and submission | 15-23 |
| 02 | `02_Tasks-24-30_Success-Error-UX.md` | Handle success, errors, and UX polish | 24-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Login Page Route | Low | Task 14 |
| 16 | Create Login Form Schema | Low | Task 15 |
| 17 | Create Login Form Component | Medium | Task 16 |
| 18 | Add Email Input Field | Low | Task 17 |
| 19 | Add Password Input Field | Low | Task 17 |
| 20 | Add Remember Me Checkbox | Low | Task 17 |
| 21 | Add Forgot Password Link | Low | Task 17 |
| 22 | Create Submit Button | Low | Task 17 |
| 23 | Implement Login Submission | Medium | Task 22 |
| 24 | Handle Login Success | Medium | Task 23 |
| 25 | Handle Login Errors | Medium | Task 23 |
| 26 | Add Tenant Selection | Medium | Task 17 |
| 27 | Add Registration Link | Low | Task 17 |
| 28 | Implement Redirect After Login | Low | Task 24 |
| 29 | Add Login Page Animations | Low | Task 17 |
| 30 | Test Login Flow | Low | Task 29 |

---

## Execution Order

```
Task 15: Create Login Page Route
    │
    ▼
Task 16: Login Form Schema
    │
    ▼
Task 17: LoginForm Component
    │
    ├────┬────┬────┬────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼    ▼    ▼
   18   19   20   21   22   26   27
   │    │    │    │    │    │    │
   └────┴────┴────┴────┴────┴────┘
              │
              ▼
        Task 23: Submission
              │
        ┌─────┴─────┐
        ▼           ▼
      Task 24    Task 25
      (success)   (errors)
        │           │
        ▼           │
      Task 28       │
      (redirect)    │
        │           │
        └─────┬─────┘
              ▼
        Task 29: Animations
              │
              ▼
        Task 30: Test
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (auth)/
│       └── login/
│           └── page.tsx
├── components/
│   └── auth/
│       └── LoginForm.tsx
└── lib/
    └── validations/
        └── login.ts
```

---

## Notes for AI Agents

### Login Form Schema (Task 16)
| Field | Validation |
|-------|------------|
| email | Required, valid email format |
| password | Required, min 8 characters |
| rememberMe | Optional boolean |

### Email Input (Task 18)
| Feature | Description |
|---------|-------------|
| Type | email |
| Autocomplete | email |
| Validation | Real-time feedback |

### Password Input (Task 19)
| Feature | Description |
|---------|-------------|
| Type | password/text toggle |
| Show/Hide | Eye icon button |
| Autocomplete | current-password |

### Login Submission Flow (Task 23)
1. Validate form with Zod
2. Set loading state
3. Call authService.login
4. Handle response

### Success Handling (Task 24)
1. Store access token
2. Store refresh token
3. Update auth store (user, tenant, permissions)
4. Redirect to dashboard or intended URL

### Error Handling (Task 25)
| Error | Display |
|-------|---------|
| Invalid credentials | Form-level alert |
| Field validation | Field-level errors |
| Network error | Toast notification |
| Rate limited | Retry countdown |

### Tenant Selection (Task 26)
- Show for users with multiple tenants
- Dropdown with tenant names
- Selected tenant in request header

### Redirect Logic (Task 28)
| Condition | Redirect To |
|-----------|-------------|
| Intended URL saved | Saved URL |
| No intended URL | /dashboard |
