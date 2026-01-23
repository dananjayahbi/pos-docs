# Tasks 76-78: Administrative Divisions & Exports

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** E - Sri Lanka Specific Utilities  
> **Document:** 03 of 03  
> **Tasks Covered:** 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-69-75_Phone-NIC-Validation.md](02_Tasks-69-75_Phone-NIC-Validation.md)
- **→ Next Group:** [Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers Sri Lankan administrative divisions (provinces and districts) and exports all srilanka utilities.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 76 | Create provinces.py File | Low |
| 77 | Add DISTRICTS Constant | Medium |
| 78 | Export All Srilanka Utilities | Low |

---

## Task 76: Create provinces.py File

### Instructions
1. Create `provinces.py` in srilanka/ directory
2. Add PROVINCES constant with all 9 provinces
3. Add helper functions for province lookups

### Sri Lanka's 9 Provinces

| Code | English Name | Sinhala Name |
|------|--------------|--------------|
| WP | Western Province | බස්නාහිර පළාත |
| CP | Central Province | මධ්‍යම පළාත |
| SP | Southern Province | දකුණු පළාත |
| NP | Northern Province | උතුරු පළාත |
| EP | Eastern Province | නැගෙනහිර පළාත |
| NWP | North Western Province | වයඹ පළාත |
| NCP | North Central Province | උතුරු මැද පළාත |
| UP | Uva Province | ඌව පළාත |
| SG | Sabaragamuwa Province | සබරගමුව පළාත |

### Implementation Pattern
```python
"""Sri Lankan provinces and administrative divisions."""

PROVINCES = [
    {"code": "WP", "name": "Western Province", "sinhala": "බස්නාහිර පළාත"},
    {"code": "CP", "name": "Central Province", "sinhala": "මධ්‍යම පළාත"},
    {"code": "SP", "name": "Southern Province", "sinhala": "දකුණු පළාත"},
    {"code": "NP", "name": "Northern Province", "sinhala": "උතුරු පළාත"},
    {"code": "EP", "name": "Eastern Province", "sinhala": "නැගෙනහිර පළාත"},
    {"code": "NWP", "name": "North Western Province", "sinhala": "වයඹ පළාත"},
    {"code": "NCP", "name": "North Central Province", "sinhala": "උතුරු මැද පළාත"},
    {"code": "UP", "name": "Uva Province", "sinhala": "ඌව පළාත"},
    {"code": "SG", "name": "Sabaragamuwa Province", "sinhala": "සබරගමුව පළාත"},
]

def get_province_by_code(code):
    """Get province by code."""
    return next((p for p in PROVINCES if p['code'] == code), None)

def get_province_choices():
    """Get province choices for Django forms/models."""
    return [(p['code'], p['name']) for p in PROVINCES]
```

### Verification Checklist
- [ ] PROVINCES constant with all 9 provinces
- [ ] Includes English and Sinhala names
- [ ] Helper functions for lookups

---

## Task 77: Add DISTRICTS Constant

### Instructions
Add DISTRICTS constant with all 25 districts mapped to provinces.

### Sri Lanka's 25 Districts

| Province | Districts |
|----------|-----------|
| **Western** | Colombo, Gampaha, Kalutara |
| **Central** | Kandy, Matale, Nuwara Eliya |
| **Southern** | Galle, Matara, Hambantota |
| **Northern** | Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya |
| **Eastern** | Ampara, Batticaloa, Trincomalee |
| **North Western** | Kurunegala, Puttalam |
| **North Central** | Anuradhapura, Polonnaruwa |
| **Uva** | Badulla, Monaragala |
| **Sabaragamuwa** | Kegalle, Ratnapura |

### Implementation Pattern
```python
DISTRICTS = [
    # Western Province
    {"code": "CO", "name": "Colombo", "sinhala": "කොළඹ", "province": "WP"},
    {"code": "GM", "name": "Gampaha", "sinhala": "ගම්පහ", "province": "WP"},
    {"code": "KT", "name": "Kalutara", "sinhala": "කළුතර", "province": "WP"},
    
    # Central Province
    {"code": "KY", "name": "Kandy", "sinhala": "මහනුවර", "province": "CP"},
    {"code": "MT", "name": "Matale", "sinhala": "මාතලේ", "province": "CP"},
    {"code": "NE", "name": "Nuwara Eliya", "sinhala": "නුවරඑළිය", "province": "CP"},
    
    # Southern Province
    {"code": "GL", "name": "Galle", "sinhala": "ගාල්ල", "province": "SP"},
    {"code": "MH", "name": "Matara", "sinhala": "මාතර", "province": "SP"},
    {"code": "HB", "name": "Hambantota", "sinhala": "හම්බන්තොට", "province": "SP"},
    
    # Northern Province
    {"code": "JA", "name": "Jaffna", "sinhala": "යාපනය", "province": "NP"},
    {"code": "KL", "name": "Kilinochchi", "sinhala": "කිලිනොච්චිය", "province": "NP"},
    {"code": "MN", "name": "Mannar", "sinhala": "මන්නාරම", "province": "NP"},
    {"code": "MU", "name": "Mullaitivu", "sinhala": "මුලතිව්", "province": "NP"},
    {"code": "VA", "name": "Vavuniya", "sinhala": "වව්නියාව", "province": "NP"},
    
    # Eastern Province
    {"code": "AP", "name": "Ampara", "sinhala": "අම්පාර", "province": "EP"},
    {"code": "BD", "name": "Batticaloa", "sinhala": "මඩකලපුව", "province": "EP"},
    {"code": "TC", "name": "Trincomalee", "sinhala": "ත්‍රිකුණාමලය", "province": "EP"},
    
    # North Western Province
    {"code": "KR", "name": "Kurunegala", "sinhala": "කුරුණෑගල", "province": "NWP"},
    {"code": "PT", "name": "Puttalam", "sinhala": "පුත්තලම", "province": "NWP"},
    
    # North Central Province
    {"code": "AD", "name": "Anuradhapura", "sinhala": "අනුරාධපුරය", "province": "NCP"},
    {"code": "PO", "name": "Polonnaruwa", "sinhala": "පොළොන්නරුව", "province": "NCP"},
    
    # Uva Province
    {"code": "BA", "name": "Badulla", "sinhala": "බදුල්ල", "province": "UP"},
    {"code": "MO", "name": "Monaragala", "sinhala": "මොණරාගල", "province": "UP"},
    
    # Sabaragamuwa Province
    {"code": "KG", "name": "Kegalle", "sinhala": "කෑගල්ල", "province": "SG"},
    {"code": "RP", "name": "Ratnapura", "sinhala": "රත්නපුර", "province": "SG"},
]

def get_districts_by_province(province_code):
    """Get all districts for a province."""
    return [d for d in DISTRICTS if d['province'] == province_code]

def get_district_by_code(code):
    """Get district by code."""
    return next((d for d in DISTRICTS if d['code'] == code), None)

def get_district_choices(province_code=None):
    """Get district choices for Django forms/models."""
    districts = get_districts_by_province(province_code) if province_code else DISTRICTS
    return [(d['code'], d['name']) for d in districts]
```

### Verification Checklist
- [ ] DISTRICTS constant with all 25 districts
- [ ] Each district mapped to province
- [ ] Includes Sinhala names
- [ ] Helper functions for lookups

---

## Task 78: Export All Srilanka Utilities

### Instructions
Update `__init__.py` to export all srilanka utilities.

### Implementation Pattern
```python
"""
Sri Lanka-specific utilities.

This module provides:
- Currency formatting (LKR)
- Phone number validation/formatting
- NIC validation and parsing
- Administrative divisions (provinces, districts)
"""

# Currency utilities
from .currency import (
    format_lkr,
    parse_lkr,
    convert_currency,
)

# Phone utilities
from .phone import (
    validate_sl_phone,
    format_sl_phone,
    normalize_sl_phone,
)

# NIC utilities
from .nic import (
    validate_nic,
    parse_nic_dob,
)

# Administrative divisions
from .provinces import (
    PROVINCES,
    DISTRICTS,
    get_province_by_code,
    get_province_choices,
    get_districts_by_province,
    get_district_by_code,
    get_district_choices,
)

__all__ = [
    # Currency
    'format_lkr',
    'parse_lkr',
    'convert_currency',
    
    # Phone
    'validate_sl_phone',
    'format_sl_phone',
    'normalize_sl_phone',
    
    # NIC
    'validate_nic',
    'parse_nic_dob',
    
    # Administrative
    'PROVINCES',
    'DISTRICTS',
    'get_province_by_code',
    'get_province_choices',
    'get_districts_by_province',
    'get_district_by_code',
    'get_district_choices',
]
```

### Usage Examples
```python
# In Django models
from backend.apps.core.srilanka import get_province_choices

class Address(models.Model):
    province = models.CharField(max_length=10, choices=get_province_choices())
    
# In forms/serializers
from backend.apps.core.srilanka import validate_sl_phone, validate_nic

phone = "0712345678"
if not validate_sl_phone(phone):
    raise ValidationError("Invalid phone number")

nic = "881234567V"
if not validate_nic(nic):
    raise ValidationError("Invalid NIC")
```

### Verification Checklist
- [ ] All utilities exported
- [ ] Docstring updated
- [ ] __all__ list complete

---

## Summary

### Group E Complete
All 16 tasks (63-78) for Group E - Sri Lanka Utilities complete.

### Final Module Structure
```
backend/apps/core/
└── srilanka/
    ├── __init__.py          # Exports
    ├── currency.py          # LKR formatting
    ├── phone.py             # Phone validation
    ├── nic.py               # NIC validation
    └── provinces.py         # Administrative divisions
```

### Key Features
1. **Currency:** format_lkr, parse_lkr, convert_currency
2. **Phone:** validate_sl_phone, format_sl_phone, normalize_sl_phone
3. **NIC:** validate_nic, parse_nic_dob (extracts DOB & gender)
4. **Divisions:** 9 provinces, 25 districts with Sinhala names

### Next Group
Proceed to [Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md) for comprehensive testing and documentation of all utilities.

---

## Notes for AI Agents

1. **Administrative Data:** PROVINCES and DISTRICTS are static constants
2. **Sinhala Support:** All divisions include Sinhala translations
3. **Django Integration:** Helper functions return choices for Django forms/models
4. **Testing:** Full tests in Group F (Tasks 79-94)
