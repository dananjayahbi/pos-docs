# Group B: Step 1 - Information

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Create checkout step 1 with contact information and personal details

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Checkout-Routes-Structure](../Group-A_Checkout-Routes-Structure/)
- **→ Next Group:** [Group-C_Step2-Shipping](../Group-C_Step2-Shipping/)

---

## Group Overview

This group creates the information step (step 1). Creates information page component. Creates contact section with email input and phone input with +94 Sri Lanka format. Creates WhatsApp checkbox for order updates. Creates login prompt for existing customers. Creates personal info section with first name and last name inputs. Creates form validation with Zod schema including email and Sri Lanka phone format validation. Creates error display for field errors. Creates save to store functionality and pre-fill for logged-in users. Verifies complete step 1 flow.

### Key Outcomes

- Information page component
- Contact section
- Email input
- Phone input (+94 format)
- WhatsApp checkbox
- Login prompt link
- Personal info section
- First name input
- Last name input
- Zod form validation
- Email validation
- Sri Lanka phone validation
- Field error display
- Save to checkout store
- Pre-fill for logged-in users
- Step 1 flow verified

### Technology Context

- **Forms:** React Hook Form
- **Validation:** Zod schema
- **Phone:** +94 XX XXX XXXX
- **WhatsApp:** Primary channel

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-27_Page-Contact-Personal.md` | Create page, contact, and personal sections | 19-27 |
| 02 | `02_Tasks-28-34_Validation-Store-Verify.md` | Create validation, store save, and verification | 28-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create Information Page | Low | Task 18 |
| 20 | Create Contact Section | Low | Task 19 |
| 21 | Create Email Input | Low | Task 20 |
| 22 | Create Phone Input | Medium | Task 20 |
| 23 | Create WhatsApp Checkbox | Low | Task 22 |
| 24 | Create Login Prompt | Low | Task 20 |
| 25 | Create Personal Info Section | Low | Task 19 |
| 26 | Create First Name Input | Low | Task 25 |
| 27 | Create Last Name Input | Low | Task 25 |
| 28 | Create Form Validation | Medium | Task 21 |
| 29 | Create Email Validation | Low | Task 28 |
| 30 | Create Phone Validation | Medium | Task 28 |
| 31 | Create Error Display | Low | Task 28 |
| 32 | Create Save to Store | Low | Task 09 |
| 33 | Create Pre-fill for Logged In | Medium | Task 16 |
| 34 | Verify Step 1 Flow | Low | Task 33 |

---

## Execution Order

```
Task 19: Information Page
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 20    Task 25       │
(Contact) (Personal)     │
    │          │          │
    ├────────┬─┼──────────┐
    ▼        ▼ ▼          │
T-21     T-22  T-26  T-27 │
(Email) (Phone)(First)(Last)
    │        │    │    │   │
    │        ▼    │    │   │
    │     T-23    │    │   │
    │  (WhatsApp) │    │   │
    │        │    │    │   │
    ▼        │    │    │   │
T-24        │    │    │   │
(Login)     │    │    │   │
    │        │    │    │   │
    └────────┴────┴────┘   │
               │           │
               ▼           │
         Task 28: Form Validation
               │           │
          ┌────┴────┐      │
          ▼         ▼      │
       T-29      T-30     │
      (Email)  (Phone)    │
          │         │      │
          └────┬────┘      │
               ▼           │
         Task 31: Error Display
               │           │
               ▼           │
         Task 32: Save to Store
               │           │
               ▼           │
         Task 33: Pre-fill │
               │           │
               ▼
         Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── checkout/
│           └── Information/
│               ├── InformationStep.tsx
│               ├── ContactSection.tsx
│               ├── EmailInput.tsx
│               ├── PhoneInput.tsx
│               ├── WhatsAppCheckbox.tsx
│               ├── LoginPrompt.tsx
│               ├── PersonalInfoSection.tsx
│               ├── FirstNameInput.tsx
│               ├── LastNameInput.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── checkoutSchemas.ts
```

---

## Notes for AI Agents

### Information Page (Task 19)
| Section | Order |
|---------|-------|
| 1 | Contact section |
| 2 | Personal info section |
| 3 | Continue button |

### Contact Section (Task 20)
| Field | Required |
|-------|----------|
| Email | Yes |
| Phone | Yes |
| WhatsApp | Optional checkbox |

### Email Input (Task 21)
| Feature | Value |
|---------|-------|
| Type | email |
| Placeholder | "Email address" |
| Autocomplete | email |
| Validation | Valid email format |

### Phone Input (Task 22)
| Feature | Value |
|---------|-------|
| Format | +94 XX XXX XXXX |
| Prefix | +94 (fixed) |
| Mask | XX XXX XXXX |
| Placeholder | "7X XXX XXXX" |

### WhatsApp Checkbox (Task 23)
| Feature | Value |
|---------|-------|
| Label | "Send order updates via WhatsApp" |
| Default | Checked |
| Icon | WhatsApp icon |

### Login Prompt (Task 24)
| Element | Content |
|---------|---------|
| Text | "Already have an account?" |
| Link | "Log in" |
| Action | Open login modal or redirect |

### Personal Info Section (Task 25)
| Layout | Description |
|--------|-------------|
| Grid | 2 columns |
| Fields | First name, Last name |

### Phone Validation (Task 30)
| Rule | Pattern |
|------|---------|
| Length | 9 digits (after +94) |
| Start | 7 (mobile) |
| Format | ^7[0-9]{8}$ |
| Error | "Enter valid Sri Lankan mobile" |

### Error Display (Task 31)
| Feature | Description |
|---------|-------------|
| Position | Below field |
| Color | Red text |
| Icon | Error icon |
| Animation | Fade in |

### Pre-fill for Logged In (Task 33)
| Field | Source |
|-------|--------|
| Email | User account |
| Phone | User profile |
| First name | User profile |
| Last name | User profile |
| Disabled | Email if verified |
