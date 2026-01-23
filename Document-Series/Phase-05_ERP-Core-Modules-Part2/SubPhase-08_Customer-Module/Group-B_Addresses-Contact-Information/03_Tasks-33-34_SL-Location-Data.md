# Tasks 33-34: Sri Lanka Location Data

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** B - Addresses & Contact Information  
> **Document:** 03 of 03  
> **Tasks Covered:** 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-27-32_Phone-Model.md](02_Tasks-27-32_Phone-Model.md)

---

## Document Overview

This document covers the creation of reference data files for Sri Lanka provinces and districts to support address validation and form dropdowns.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create Sri Lanka Provinces List | Medium | 25 min |
| 34 | Create Sri Lanka Districts List | Medium | 30 min |

---

## Task 33: Create Sri Lanka Provinces List

### Overview
Create a data file containing all 9 provinces of Sri Lanka with their metadata for use in address forms and validation.

### Dependencies
- None (reference data)

### Instructions

1. **Create data directory**
   - Create `apps/customers/data/` directory
   - Create `__init__.py` in data directory

2. **Create provinces.py file**
   - Create `apps/customers/data/provinces.py`

3. **Define PROVINCES list**
   - List of dictionaries containing province data
   - Include: code, name, sinhala_name, tamil_name

4. **Add province data**
   - Western Province
   - Central Province
   - Southern Province
   - Northern Province
   - Eastern Province
   - North Western Province
   - North Central Province
   - Uva Province
   - Sabaragamuwa Province

5. **Create helper functions**
   - get_province_names() - Returns list of province names
   - get_province_choices() - Returns Django choices tuple

### Sri Lanka Provinces Data Structure

```
Province Data Format
════════════════════

{
    'code': 'WP',
    'name': 'Western Province',
    'sinhala_name': 'බස්නාහිර පළාත',
    'tamil_name': 'மேல் மாகாணம்',
    'districts': ['Colombo', 'Gampaha', 'Kalutara']
}
```

### All 9 Provinces

| Code | Province | Sinhala | Tamil |
|------|----------|---------|-------|
| WP | Western Province | බස්නාහිර පළාත | மேல் மாகாணம் |
| CP | Central Province | මධ්‍යම පළාත | மத்திய மாகாணம் |
| SP | Southern Province | දකුණු පළාත | தென் மாகாணம் |
| NP | Northern Province | උතුරු පළාත | வடக்கு மாகாணம் |
| EP | Eastern Province | නැගෙනහිර පළාත | கிழக்கு மாகாணம் |
| NWP | North Western Province | වයඹ පළාත | வடமேல் மாகாணம் |
| NCP | North Central Province | උතුරු මැද පළාත | வட மத்திய மாகாணம் |
| UP | Uva Province | ඌව පළාත | ஊவா மாகாணம் |
| SGP | Sabaragamuwa Province | සබරගමුව පළාත | சபரகமுவ மாகாணம் |

### Expected Outcome
- Complete province reference data
- Multi-language support
- Helper functions for forms

### Verification Checklist
- [ ] data directory created
- [ ] provinces.py file created
- [ ] All 9 provinces added
- [ ] Sinhala names included
- [ ] Tamil names included
- [ ] Helper functions created

---

## Task 34: Create Sri Lanka Districts List

### Overview
Create a data file containing all 25 districts of Sri Lanka with province mappings for address validation.

### Dependencies
- Task 33: Create Sri Lanka Provinces List

### Instructions

1. **Create districts.py file**
   - Create `apps/customers/data/districts.py`

2. **Define DISTRICTS list**
   - List of dictionaries containing district data
   - Include: code, name, province, major_cities

3. **Add all 25 districts**
   - Western: Colombo, Gampaha, Kalutara
   - Central: Kandy, Matale, Nuwara Eliya
   - Southern: Galle, Matara, Hambantota
   - Northern: Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya
   - Eastern: Batticaloa, Ampara, Trincomalee
   - North Western: Kurunegala, Puttalam
   - North Central: Anuradhapura, Polonnaruwa
   - Uva: Badulla, Monaragala
   - Sabaragamuwa: Ratnapura, Kegalle

4. **Create helper functions**
   - get_districts_by_province(province) - Returns districts for province
   - get_district_choices() - Returns Django choices tuple
   - validate_district_province(district, province) - Validation function

5. **Add major cities per district**
   - Include 3-5 major cities per district
   - Used for city dropdown suggestions

### Sri Lanka Districts Data Structure

```
District Data Format
════════════════════

{
    'code': 'CMB',
    'name': 'Colombo District',
    'province': 'Western Province',
    'major_cities': [
        'Colombo',
        'Dehiwala-Mount Lavinia',
        'Moratuwa',
        'Sri Jayawardenepura Kotte',
        'Kolonnawa'
    ]
}
```

### All 25 Districts by Province

**Western Province (3)**
- Colombo District
- Gampaha District
- Kalutara District

**Central Province (3)**
- Kandy District
- Matale District
- Nuwara Eliya District

**Southern Province (3)**
- Galle District
- Matara District
- Hambantota District

**Northern Province (5)**
- Jaffna District
- Kilinochchi District
- Mannar District
- Mullaitivu District
- Vavuniya District

**Eastern Province (3)**
- Batticaloa District
- Ampara District
- Trincomalee District

**North Western Province (2)**
- Kurunegala District
- Puttalam District

**North Central Province (2)**
- Anuradhapura District
- Polonnaruwa District

**Uva Province (2)**
- Badulla District
- Monaragala District

**Sabaragamuwa Province (2)**
- Ratnapura District
- Kegalle District

### Expected Outcome
- Complete district reference data
- Province-district mapping
- Major cities listing
- Validation helper functions

### Verification Checklist
- [ ] districts.py file created
- [ ] All 25 districts added
- [ ] Province mappings correct
- [ ] Major cities included
- [ ] Helper functions created
- [ ] validate_district_province function implemented

---

## Summary

This document created Sri Lanka location reference data:

### Completed Reference Data
- ✅ 9 provinces with Sinhala and Tamil names
- ✅ 25 districts with province mappings
- ✅ Major cities per district
- ✅ Helper functions for forms
- ✅ Validation functions

### Key Achievements
1. **Complete Coverage** - All Sri Lankan administrative divisions
2. **Multi-Language** - Sinhala and Tamil support
3. **Validation Ready** - District-province mapping validation
4. **Form Support** - Helper functions for dropdowns
5. **City Suggestions** - Major cities per district

### Group B Complete
All address and contact information functionality implemented:
- Multiple addresses per customer
- Multiple phone numbers per customer
- Sri Lanka location data
- Format validation
- Default management

---

**Document Status:** ✅ Complete  
**Total Tasks:** 2  
**Total Lines:** ~620
