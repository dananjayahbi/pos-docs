# Group B: General & Company Settings

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Build general settings and company profile configuration pages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Settings-Routes-Layout](../Group-A_Settings-Routes-Layout/)
- **→ Next Group:** [Group-C_User-Management](../Group-C_User-Management/)

---

## Group Overview

This group creates the general settings and company profile pages. Creates main general settings page with reusable settings section card. Builds localization settings with timezone select (Asia/Colombo default), currency select (LKR default), and date format select. Creates notification settings for email and push notifications. Creates company settings page with form schema. Builds company name input and logo upload with preview. Creates company address form and tax information section. Creates contact information and save action.

### Key Outcomes

- General settings page
- Settings section card component
- Localization settings section
- Timezone select (Asia/Colombo)
- Currency select (LKR)
- Date format select
- Notification settings section
- Company settings page
- Company form schema
- Company name input
- Logo upload component
- Logo preview component
- Company address form
- Tax information section
- Contact information section
- Save company settings action

### Technology Context

- **Form:** React Hook Form + Zod
- **Upload:** File upload for logo
- **Timezone:** Asia/Colombo default
- **Currency:** LKR (Sri Lankan Rupees)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-21_General-Settings.md` | Create general settings page | 15-21 |
| 02 | `02_Tasks-22-30_Company-Settings.md` | Create company profile settings | 22-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create General Settings Page | Low | Task 14 |
| 16 | Create Settings Section Card | Low | Task 15 |
| 17 | Create Localization Settings | Medium | Task 15 |
| 18 | Create Timezone Select | Low | Task 17 |
| 19 | Create Currency Select | Low | Task 17 |
| 20 | Create Date Format Select | Low | Task 17 |
| 21 | Create Notification Settings | Medium | Task 15 |
| 22 | Create Company Settings Page | Medium | Task 14 |
| 23 | Create Company Form Schema | Medium | Task 22 |
| 24 | Create Company Name Input | Low | Task 23 |
| 25 | Create Logo Upload | Medium | Task 22 |
| 26 | Create Logo Preview | Low | Task 25 |
| 27 | Create Company Address Form | Medium | Task 23 |
| 28 | Create Tax Information Section | Medium | Task 22 |
| 29 | Create Contact Information | Low | Task 22 |
| 30 | Create Save Company Settings | Medium | Task 29 |

---

## Execution Order

```
Task 15: General Settings Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 16: Settings Section Card                         │
    │                                                  │
    ▼                                                  │
Task 17: Localization Settings                         │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 18    Task 19    Task 20       │                 │
(Timezone) (Currency) (Date)        │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 21: Notifications      │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
                          ▼                            │
                    Task 22: Company Settings Page     │
                          │                            │
                          ▼                            │
                    Task 23: Form Schema               │
                          │                            │
                    ┌─────┴─────┐                      │
                    ▼           ▼                      │
              Task 24     Task 25                      │
              (Name)      (Logo)                       │
                    │           │                      │
                    │           ▼                      │
                    │     Task 26: Preview             │
                    │           │                      │
                    └─────┬─────┘                      │
                          ▼                            │
                    Task 27: Address Form              │
                          │                            │
                          ▼                            │
                    Task 28: Tax Info                  │
                          │                            │
                          ▼                            │
                    Task 29: Contact Info              │
                          │                            │
                          ▼
                    Task 30: Save
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── settings/
│           ├── General/
│           │   ├── GeneralSettings.tsx
│           │   ├── SettingsSectionCard.tsx
│           │   ├── LocalizationSettings.tsx
│           │   ├── TimezoneSelect.tsx
│           │   ├── CurrencySelect.tsx
│           │   ├── DateFormatSelect.tsx
│           │   ├── NotificationSettings.tsx
│           │   └── index.ts
│           ├── Company/
│           │   ├── CompanySettings.tsx
│           │   ├── CompanyNameInput.tsx
│           │   ├── LogoUpload.tsx
│           │   ├── LogoPreview.tsx
│           │   ├── CompanyAddressForm.tsx
│           │   ├── TaxInfoSection.tsx
│           │   ├── ContactInfoSection.tsx
│           │   └── index.ts
│           └── index.ts
└── lib/
    └── validations/
        └── company.ts
```

---

## Notes for AI Agents

### Settings Section Card (Task 16)
| Element | Content |
|---------|---------|
| Title | Section title |
| Description | Section description |
| Content | Form fields |
| Border | Subtle border |

### Timezone Select (Task 18)
| Option | Value |
|--------|-------|
| Sri Lanka (Default) | Asia/Colombo |
| India | Asia/Kolkata |
| Singapore | Asia/Singapore |
| Dubai | Asia/Dubai |
| London | Europe/London |

### Currency Select (Task 19)
| Option | Symbol | Value |
|--------|--------|-------|
| Sri Lankan Rupee | ₨ | LKR |
| US Dollar | $ | USD |
| Euro | € | EUR |
| Indian Rupee | ₹ | INR |

### Date Format Select (Task 20)
| Option | Example |
|--------|---------|
| DD/MM/YYYY | 25/01/2026 |
| MM/DD/YYYY | 01/25/2026 |
| YYYY-MM-DD | 2026-01-25 |

### Notification Settings (Task 21)
| Setting | Type | Default |
|---------|------|---------|
| Email Notifications | Toggle | On |
| Order Alerts | Toggle | On |
| Low Stock Alerts | Toggle | On |
| Daily Reports | Toggle | Off |
| Push Notifications | Toggle | On |

### Company Form Schema (Task 23)
| Field | Type | Validation |
|-------|------|------------|
| name | string | Required, 2-200 chars |
| logo | file | Optional, image |
| address | object | Required |
| tin | string | Optional, format |
| vat_number | string | Optional |
| phone | string | Sri Lankan format |
| email | string | Valid email |

### Logo Upload (Task 25)
| Feature | Description |
|---------|-------------|
| Formats | PNG, JPG, SVG |
| Max Size | 2MB |
| Preview | Show thumbnail |
| Remove | Delete option |

### Tax Information (Task 28)
| Field | Description |
|-------|-------------|
| TIN | Tax Identification Number |
| VAT Number | VAT registration |
| Tax Type | Registered/Non-registered |

### Contact Information (Task 29)
| Field | Type |
|-------|------|
| Phone | Phone input (+94) |
| Email | Email input |
| Website | URL input |
