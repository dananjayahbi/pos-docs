# Group B: Addresses & Contact Information

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Implement multi-address and multi-phone with Sri Lanka formats

---

## Navigation

- **↑ Parent:** [SubPhase-08 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Customer Model & Profile](../Group-A_Customer-Model-Profile/)
- **→ Next Group:** [Group C: Customer Services & Search](../Group-C_Customer-Services-Search/)

---

## Group Overview

### Key Outcomes

1. **CustomerAddress Model** - Multiple addresses per customer
2. **AddressType Choices** - BILLING, SHIPPING, HOME, WORK, OTHER
3. **Address Core Fields** - address_line_1, address_line_2, city
4. **Sri Lanka Address Fields** - district, province with SL options
5. **Address Postal Fields** - postal_code, country (default SL)
6. **Address Default Flag** - is_default_billing, is_default_shipping
7. **Address Validation** - District-province mapping validation
8. **Address Migrations** - Apply migrations
9. **CustomerPhone Model** - Multiple phone numbers per customer
10. **PhoneType Choices** - MOBILE, LANDLINE, WHATSAPP, WORK, OTHER
11. **Phone Number Fields** - phone_number, phone_type, is_primary
12. **Phone Validation** - Sri Lanka format (+94, 07X)
13. **WhatsApp Indicator** - is_whatsapp boolean
14. **Phone Migrations** - Apply migrations
15. **Sri Lanka Provinces List** - 9 provinces with districts
16. **Sri Lanka Districts List** - 25 districts with cities

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Address and phone models |
| Validators | Sri Lanka format validation |
| Data Files | Province/district data |
| Regex | Phone number validation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-26_Address-Model.md` | 19-26 | CustomerAddress model, types, core fields, SL fields, postal, defaults, validation, migrations |
| 02 | `02_Tasks-27-32_Phone-Model.md` | 27-32 | CustomerPhone model, types, fields, validation, WhatsApp, migrations |
| 03 | `03_Tasks-33-34_SL-Location-Data.md` | 33-34 | Sri Lanka provinces list, districts list with mappings |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create CustomerAddress Model | Medium | 25 min |
| 20 | Define AddressType Choices | Low | 15 min |
| 21 | Add Address Core Fields | Medium | 20 min |
| 22 | Add Sri Lanka Address Fields | Medium | 25 min |
| 23 | Add Address Postal Fields | Low | 15 min |
| 24 | Add Address Default Flag | Medium | 20 min |
| 25 | Add Address Validation | Medium | 25 min |
| 26 | Run Address Migrations | Low | 15 min |
| 27 | Create CustomerPhone Model | Medium | 25 min |
| 28 | Define PhoneType Choices | Low | 15 min |
| 29 | Add Phone Number Fields | Medium | 20 min |
| 30 | Add Phone Validation | Medium | 25 min |
| 31 | Add WhatsApp Indicator | Low | 15 min |
| 32 | Run Phone Migrations | Low | 15 min |
| 33 | Create Sri Lanka Provinces List | Medium | 25 min |
| 34 | Create Sri Lanka Districts List | Medium | 30 min |

---

## Execution Order

```
[Tasks 19-26: CustomerAddress model and validation]
         │
         ▼
[Tasks 27-32: CustomerPhone model and validation]
         │
         ▼
[Tasks 33-34: Sri Lanka location data]
```

---

## Expected Deliverables

```
apps/customers/
├── models/
│   ├── __init__.py
│   ├── customer.py
│   ├── customer_address.py       # Tasks 19-25
│   └── customer_phone.py         # Tasks 27-31
├── data/
│   ├── __init__.py
│   ├── provinces.py              # Task 33
│   └── districts.py              # Task 34
├── validators.py                 # Tasks 25, 30
└── migrations/
    ├── 0002_address.py           # Task 26
    └── 0003_phone.py             # Task 32
```

---

## Notes for AI Agents

### AddressType Choices
- **BILLING**: Billing/invoice address
- **SHIPPING**: Delivery address
- **HOME**: Home address
- **WORK**: Work/office address
- **OTHER**: Other address type

### CustomerAddress Fields
- customer: FK to Customer
- address_type: Choice field
- address_line_1: Main address line
- address_line_2: Optional secondary line
- city: City name
- district: Sri Lanka district
- province: Sri Lanka province
- postal_code: 5-digit postal code
- country: Default "Sri Lanka"
- is_default_billing: Boolean
- is_default_shipping: Boolean

### Sri Lanka Address Structure
```
Address Line 1:  No. 123, Main Street
Address Line 2:  Near Temple Junction (optional)
City:            Colombo
District:        Colombo District
Province:        Western Province
Postal Code:     00100
Country:         Sri Lanka
```

### Sri Lanka Provinces (9)
| Province | Districts |
|----------|-----------|
| Western | Colombo, Gampaha, Kalutara |
| Central | Kandy, Matale, Nuwara Eliya |
| Southern | Galle, Matara, Hambantota |
| Northern | Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya |
| Eastern | Batticaloa, Ampara, Trincomalee |
| North Western | Kurunegala, Puttalam |
| North Central | Anuradhapura, Polonnaruwa |
| Uva | Badulla, Monaragala |
| Sabaragamuwa | Ratnapura, Kegalle |

### PhoneType Choices
- **MOBILE**: Mobile phone (07X)
- **LANDLINE**: Landline phone
- **WHATSAPP**: WhatsApp number
- **WORK**: Work phone
- **OTHER**: Other phone type

### CustomerPhone Fields
- customer: FK to Customer
- phone_type: Choice field
- phone_number: CharField
- is_primary: Boolean
- is_whatsapp: Boolean
- is_verified: Boolean
- verified_at: DateTime (nullable)

### Sri Lanka Phone Format
```
Mobile:    +94 7X XXX XXXX (e.g., +94 77 123 4567)
Landline:  +94 XX XXX XXXX (e.g., +94 11 234 5678)

Mobile Prefixes: 70, 71, 72, 75, 76, 77, 78
```

### Phone Validation Regex
```
Mobile: ^\\+94\\s?7[0-8]\\s?\\d{3}\\s?\\d{4}$
Landline: ^\\+94\\s?\\d{2}\\s?\\d{3}\\s?\\d{4}$
```

### Default Address Logic
- Only one address can be default_billing per customer
- Only one address can be default_shipping per customer
- New addresses auto-become default if none exists
