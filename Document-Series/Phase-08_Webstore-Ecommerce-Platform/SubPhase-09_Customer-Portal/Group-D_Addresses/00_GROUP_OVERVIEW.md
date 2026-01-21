# Group D: Addresses

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create address management with Sri Lanka format and CRUD operations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Order-Details-Tracking](../Group-C_Order-Details-Tracking/)
- **→ Next Group:** [Group-E_Wishlist-Reviews](../Group-E_Wishlist-Reviews/)

---

## Group Overview

This group creates address management. Creates addresses page with header and grid layout. Creates address card with default badge, address type label, and action buttons for edit, delete, and set default. Creates add new address button. Creates address form modal with Province, District, City cascade dropdowns following Sri Lanka format. Creates form validation and save address API integration. Creates delete confirmation modal. Verifies all address CRUD operations work correctly.

### Key Outcomes

- Addresses page
- Addresses header
- Address grid
- Address card
- Default badge
- Address type label
- Edit address button
- Delete address button
- Set default button
- Add new address button
- Address form modal
- Address form (cascade)
- Address validation
- Save address API
- Delete confirmation modal
- Address management verified

### Technology Context

- **Format:** Province → District → City
- **No Zip:** Sri Lanka addresses
- **Modal:** Add/edit in modal
- **Default:** One per type

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-61_Grid-Cards.md` | Create grid and card components | 53-61 |
| 02 | `02_Tasks-62-68_Modal-Form-Verify.md` | Create modal, form, and verification | 62-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Addresses Page | Low | Task 52 |
| 54 | Create Addresses Header | Low | Task 53 |
| 55 | Create Address Grid | Low | Task 53 |
| 56 | Create Address Card | Medium | Task 55 |
| 57 | Create Default Badge | Low | Task 56 |
| 58 | Create Address Type | Low | Task 56 |
| 59 | Create Edit Address Button | Low | Task 56 |
| 60 | Create Delete Address Button | Low | Task 56 |
| 61 | Create Set Default Button | Low | Task 56 |
| 62 | Create Add New Address | Low | Task 53 |
| 63 | Create Address Form Modal | Medium | Task 62 |
| 64 | Create Address Form | High | Task 63 |
| 65 | Create Address Validation | Medium | Task 64 |
| 66 | Create Save Address | Medium | Task 65 |
| 67 | Create Delete Confirmation | Low | Task 60 |
| 68 | Verify Address Management | Low | Task 67 |

---

## Execution Order

```
Task 53: Addresses Page
    │
    ├────────┬────────┐
    ▼        ▼        │
T-54     T-55     T-62
(Header) (Grid)   (Add)
    │        │        │
    │        ▼        ▼
    │     T-56    T-63
    │    (Card)  (Modal)
    │        │        │
    │   ┌────┴────┬────┐
    │   ▼    ▼    ▼    │
    │ T-57  T-58  T-59 T-60  T-61
    │ (Def)(Type)(Edit)(Del) (SetDef)
    │   │    │    │    │      │
    │   │    │    │    ▼      │
    │   │    │    │  T-67     │
    │   │    │    │ (Confirm) │
    │   │    │    │    │      │
    └───┴────┴────┴────┴──────┘
              │
              ▼
        Task 64: Address Form
              │
              ▼
        Task 65: Validation
              │
              ▼
        Task 66: Save Address
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
│       └── portal/
│           └── Addresses/
│               ├── AddressesPage.tsx
│               ├── AddressesHeader.tsx
│               ├── AddressGrid.tsx
│               ├── AddressCard.tsx
│               ├── DefaultBadge.tsx
│               ├── AddressType.tsx
│               ├── AddressActions.tsx
│               ├── AddNewAddress.tsx
│               ├── AddressFormModal.tsx
│               ├── AddressForm.tsx
│               ├── DeleteConfirmation.tsx
│               └── index.ts
├── services/
│   └── storefront/
│       └── portal/
│           └── addressService.ts
└── lib/
    └── validations/
        └── addressSchema.ts
```

---

## Notes for AI Agents

### Addresses Page (Task 53)
| Section | Order |
|---------|-------|
| 1 | Header with add button |
| 2 | Address grid |
| 3 | Empty state if none |

### Address Grid (Task 55)
| Layout | Description |
|--------|-------------|
| Desktop | 2 columns |
| Tablet | 2 columns |
| Mobile | 1 column |
| Gap | 16-24px |

### Address Card (Task 56)
| Element | Position |
|---------|----------|
| Type + Default | Top |
| Full address | Middle |
| Actions | Bottom |

### Default Badge (Task 57)
| Feature | Style |
|---------|-------|
| Text | "Default" |
| Color | Green badge |
| Position | Next to type |

### Address Type (Task 58)
| Type | Label |
|------|-------|
| shipping | "Shipping Address" |
| billing | "Billing Address" |

### Address Card Actions
| Button | Action |
|--------|--------|
| Edit | Open modal |
| Delete | Confirm modal |
| Set Default | API call |

### Address Form Modal (Task 63)
| Mode | Title |
|------|-------|
| Add | "Add New Address" |
| Edit | "Edit Address" |
| Style | Centered modal |

### Address Form (Task 64)
| Field | Order | Required |
|-------|-------|----------|
| Province | 1 | Yes |
| District | 2 | Yes |
| City | 3 | Yes |
| Address Line 1 | 4 | Yes |
| Address Line 2 | 5 | No |
| Landmark | 6 | No |
| Type | 7 | Yes |
| Default | 8 | Checkbox |

### Address Cascade
| Selection | Updates |
|-----------|---------|
| Province | Filter districts |
| District | Filter cities |
| City | No cascade |

### Save Address (Task 66)
| Endpoint | Method |
|----------|--------|
| /api/addresses | POST (create) |
| /api/addresses/:id | PATCH (update) |
| Response | Updated address |

### Delete Confirmation (Task 67)
| Element | Content |
|---------|---------|
| Title | "Delete Address?" |
| Message | "This cannot be undone" |
| Cancel | Close modal |
| Confirm | Delete API call |
