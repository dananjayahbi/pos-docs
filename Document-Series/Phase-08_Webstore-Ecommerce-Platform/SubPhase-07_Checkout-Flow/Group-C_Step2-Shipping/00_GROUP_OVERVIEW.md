# Group C: Step 2 - Shipping

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Create checkout step 2 with Sri Lanka address format and shipping methods

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Step1-Information](../Group-B_Step1-Information/)
- **→ Next Group:** [Group-D_Step3-Payment](../Group-D_Step3-Payment/)

---

## Group Overview

This group creates the shipping step (step 2). Creates shipping page component. Creates address section with Sri Lanka-specific format: Province dropdown, District dropdown (filtered by province), and City dropdown (filtered by district). Creates address line 1, line 2 (optional), and landmark input. Creates saved addresses list with select functionality and add new address option. Creates shipping methods section with method cards for standard and express shipping showing cost in LKR and delivery estimate. Verifies complete step 2 flow.

### Key Outcomes

- Shipping page component
- Address section
- Province dropdown
- District dropdown (cascaded)
- City dropdown (cascaded)
- Address line 1
- Address line 2 (optional)
- Landmark input
- Saved addresses list
- Select saved address
- Add new address option
- Shipping methods section
- Shipping method card
- Standard shipping option
- Express shipping option
- Shipping cost display (LKR)
- Delivery estimate
- Step 2 flow verified

### Technology Context

- **Address:** Province → District → City
- **No Zip:** Sri Lanka doesn't use postal codes
- **Cascade:** Filter dropdowns
- **Methods:** Standard + Express

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-45_Address-Saved.md` | Create address form and saved addresses | 35-45 |
| 02 | `02_Tasks-46-52_Shipping-Methods-Verify.md` | Create shipping methods and verification | 46-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Shipping Page | Low | Task 34 |
| 36 | Create Address Section | Low | Task 35 |
| 37 | Create Province Dropdown | Low | Task 36 |
| 38 | Create District Dropdown | Medium | Task 37 |
| 39 | Create City Dropdown | Medium | Task 38 |
| 40 | Create Address Line 1 | Low | Task 36 |
| 41 | Create Address Line 2 | Low | Task 36 |
| 42 | Create Landmark Input | Low | Task 36 |
| 43 | Create Saved Addresses | Medium | Task 36 |
| 44 | Create Select Saved Address | Low | Task 43 |
| 45 | Create Add New Address | Low | Task 43 |
| 46 | Create Shipping Methods Section | Low | Task 35 |
| 47 | Create Shipping Method Card | Low | Task 46 |
| 48 | Create Standard Shipping | Low | Task 47 |
| 49 | Create Express Shipping | Low | Task 47 |
| 50 | Create Shipping Cost Display | Low | Task 47 |
| 51 | Create Delivery Estimate | Low | Task 47 |
| 52 | Verify Step 2 Flow | Low | Task 51 |

---

## Execution Order

```
Task 35: Shipping Page
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 36    Task 46       │
(Address) (Methods)      │
    │          │          │
    │          ▼          │
    │     Task 47        │
    │     (Card)         │
    │          │          │
    │     ┌────┴────┬────────┬────────┐
    │     ▼         ▼        ▼        │
    │  T-48      T-49     T-50     T-51
    │ (Std)    (Express) (Cost)  (Est)
    │     │         │        │        │
    │     └─────────┴────────┴────────┘
    │                   │
    ├───────────────────┘
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        │
T-37     T-40     T-41     T-42     T-43
(Prov)  (Addr1) (Addr2) (Landmark)(Saved)
    │        │        │        │        │
    ▼        │        │        │    ┌───┴───┐
T-38        │        │        │    ▼       ▼
(District)  │        │        │  T-44   T-45
    │        │        │        │ (Select)(Add)
    ▼        │        │        │    │       │
T-39        │        │        │    │       │
(City)      │        │        │    │       │
    │        │        │        │    │       │
    └────────┴────────┴────────┴────┴───────┘
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
│       └── checkout/
│           └── Shipping/
│               ├── ShippingStep.tsx
│               ├── AddressSection.tsx
│               ├── ProvinceDropdown.tsx
│               ├── DistrictDropdown.tsx
│               ├── CityDropdown.tsx
│               ├── AddressLineInputs.tsx
│               ├── LandmarkInput.tsx
│               ├── SavedAddresses.tsx
│               ├── SavedAddressCard.tsx
│               ├── ShippingMethods.tsx
│               ├── ShippingMethodCard.tsx
│               └── index.ts
└── data/
    └── srilanka/
        ├── provinces.ts
        ├── districts.ts
        └── cities.ts
```

---

## Notes for AI Agents

### Sri Lanka Address Format
| Field | Order | Required |
|-------|-------|----------|
| Province | 1 | Yes |
| District | 2 | Yes |
| City | 3 | Yes |
| Address Line 1 | 4 | Yes |
| Address Line 2 | 5 | No |
| Landmark | 6 | Recommended |

### Province Dropdown (Task 37)
| Count | Examples |
|-------|----------|
| 9 | Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, Sabaragamuwa |

### District Dropdown (Task 38)
| Feature | Description |
|---------|-------------|
| Filter | By selected province |
| Count | 25 districts total |
| Example | Colombo, Gampaha (Western) |

### City Dropdown (Task 39)
| Feature | Description |
|---------|-------------|
| Filter | By selected district |
| Source | Static data or API |
| Example | Colombo 01, Colombo 02... |

### Address Line 1 (Task 40)
| Feature | Value |
|---------|-------|
| Label | "Street Address" |
| Placeholder | "House no., Street name" |
| Required | Yes |

### Landmark Input (Task 42)
| Feature | Value |
|---------|-------|
| Label | "Landmark (for delivery)" |
| Placeholder | "Near school, opposite bank..." |
| Help | "Helps courier find address" |

### Saved Addresses (Task 43)
| Feature | Description |
|---------|-------------|
| Show | For logged-in users |
| List | User's saved addresses |
| Select | Radio button selection |
| Default | Last used address |

### Shipping Method Card (Task 47)
| Element | Description |
|---------|-------------|
| Radio | Selection indicator |
| Name | Method name |
| Cost | Price in LKR |
| Estimate | Delivery days |
| Icon | Truck icon |

### Standard Shipping (Task 48)
| Feature | Value |
|---------|-------|
| Name | "Standard Shipping" |
| Cost | ₨350 (example) |
| Days | 3-5 business days |
| Free | Orders over ₨5,000 |

### Express Shipping (Task 49)
| Feature | Value |
|---------|-------|
| Name | "Express Shipping" |
| Cost | ₨650 (example) |
| Days | 1-2 business days |
| Available | Colombo metro only |

### Delivery Estimate (Task 51)
| Format | Example |
|--------|---------|
| Range | "3-5 business days" |
| Date | "Delivery by Jan 25-27" |
| Dynamic | Based on location |
