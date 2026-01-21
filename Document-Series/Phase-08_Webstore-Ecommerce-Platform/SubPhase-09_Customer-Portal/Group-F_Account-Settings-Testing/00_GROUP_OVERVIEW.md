# Group F: Account Settings & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** F of F  
> **Tasks Covered:** 85-96  
> **Group Goal:** Create account settings with profile, password, notifications, and perform portal testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Wishlist-Reviews](../Group-E_Wishlist-Reviews/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-10_Theme-Engine](../SubPhase-10_Theme-Engine/)

---

## Group Overview

This group creates account settings and testing. Creates settings page with multiple sections. Creates profile section with form to edit name, email, and phone. Creates password section with change password form requiring current and new password. Creates notification settings for email and WhatsApp preferences. Creates delete account option with confirmation modal. Performs comprehensive testing: dashboard functionality, address CRUD operations, and mobile portal responsiveness.

### Key Outcomes

- Settings page
- Profile section
- Profile form
- Update profile API
- Password section
- Change password form
- Notification settings
- Delete account option
- Delete confirmation modal
- Dashboard tested
- Address CRUD tested
- Mobile portal tested

### Technology Context

- **Sections:** Accordion or tabs
- **Forms:** React Hook Form
- **Password:** Require current
- **Delete:** Serious action

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-85-93_Settings.md` | Create settings sections | 85-93 |
| 02 | `02_Tasks-94-96_Testing.md` | Perform portal testing | 94-96 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 85 | Create Settings Page | Low | Task 84 |
| 86 | Create Profile Section | Low | Task 85 |
| 87 | Create Profile Form | Medium | Task 86 |
| 88 | Create Update Profile | Medium | Task 87 |
| 89 | Create Password Section | Low | Task 85 |
| 90 | Create Change Password Form | Medium | Task 89 |
| 91 | Create Notification Settings | Low | Task 85 |
| 92 | Create Delete Account | Low | Task 85 |
| 93 | Create Delete Confirmation | Medium | Task 92 |
| 94 | Test Dashboard | Low | Task 17 |
| 95 | Test Address CRUD | Low | Task 68 |
| 96 | Test Mobile Portal | Low | Task 13 |

---

## Execution Order

```
Task 85: Settings Page
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        │
T-86     T-89     T-91     T-92        │
(Profile)(Pass)  (Notif) (Delete)      │
    │        │        │        │        │
    ▼        ▼        │        ▼        │
T-87     T-90        │     T-93        │
(Form)  (Form)       │   (Confirm)     │
    │        │        │        │        │
    ▼        │        │        │        │
T-88        │        │        │        │
(Update)    │        │        │        │
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
T-94           T-95           T-96
(Dashboard)  (Address)      (Mobile)
    │              │              │
    └──────────────┴──────────────┘
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── portal/
│           └── Settings/
│               ├── SettingsPage.tsx
│               ├── ProfileSection.tsx
│               ├── ProfileForm.tsx
│               ├── PasswordSection.tsx
│               ├── ChangePasswordForm.tsx
│               ├── NotificationSettings.tsx
│               ├── DeleteAccount.tsx
│               ├── DeleteConfirmation.tsx
│               └── index.ts
├── services/
│   └── storefront/
│       └── portal/
│           └── settingsService.ts
└── tests/
    └── e2e/
        └── portal/
            ├── dashboard.spec.ts
            ├── addresses.spec.ts
            └── mobile.spec.ts
```

---

## Notes for AI Agents

### Settings Page (Task 85)
| Section | Order |
|---------|-------|
| 1 | Profile |
| 2 | Password |
| 3 | Notifications |
| 4 | Delete Account |

### Profile Section (Task 86)
| Field | Editable |
|-------|----------|
| First Name | Yes |
| Last Name | Yes |
| Email | View only (if verified) |
| Phone | Yes |

### Profile Form (Task 87)
| Validation | Rule |
|------------|------|
| First Name | Required, min 2 |
| Last Name | Required, min 2 |
| Phone | +94 format |

### Update Profile (Task 88)
| Endpoint | Method |
|----------|--------|
| /api/users/me | PATCH |
| Payload | firstName, lastName, phone |
| Response | Updated user |

### Password Section (Task 89)
| Element | Content |
|---------|---------|
| Title | "Change Password" |
| Last changed | "Last changed 30 days ago" |

### Change Password Form (Task 90)
| Field | Required |
|-------|----------|
| Current Password | Yes |
| New Password | Yes |
| Confirm New Password | Yes |
| Validation | Strength rules |

### Notification Settings (Task 91)
| Setting | Type |
|---------|------|
| Order updates email | Toggle |
| Order updates WhatsApp | Toggle |
| Promotional emails | Toggle |
| Newsletter | Toggle |

### Delete Account (Task 92)
| Style | Description |
|-------|-------------|
| Position | Bottom of settings |
| Color | Red/danger |
| Warning | Clear warning text |

### Delete Confirmation (Task 93)
| Element | Content |
|---------|---------|
| Title | "Delete Account?" |
| Warning | "This is permanent" |
| Require | Type "DELETE" to confirm |
| Cancel | Close modal |
| Confirm | Delete API, logout |

### Test Dashboard (Task 94)
| Test | Expected |
|------|----------|
| Load dashboard | Shows welcome |
| Stats display | Correct counts |
| Recent orders | Shows 3 latest |
| Quick actions | Links work |

### Test Address CRUD (Task 95)
| Test | Expected |
|------|----------|
| View addresses | Grid displays |
| Add address | Modal opens, saves |
| Edit address | Pre-fills, updates |
| Delete address | Confirms, removes |
| Set default | Updates badge |

### Test Mobile Portal (Task 96)
| Test | Expected |
|------|----------|
| Sidebar hidden | Uses drawer |
| Menu toggle | Opens drawer |
| Navigation | Routes work |
| Forms | Touch-friendly |
| Cards | Stack properly |
