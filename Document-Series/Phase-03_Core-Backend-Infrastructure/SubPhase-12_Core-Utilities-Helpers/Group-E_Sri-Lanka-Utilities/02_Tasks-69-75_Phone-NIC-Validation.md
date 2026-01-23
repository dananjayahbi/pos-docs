# Tasks 69-74: Phone & NIC Validation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** E - Sri Lanka Specific Utilities  
> **Document:** 02 of 03  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-68_SriLanka-Module-Currency.md](01_Tasks-63-68_SriLanka-Module-Currency.md)
- **→ Next Document:** [03_Tasks-76-78_Administrative-Divisions.md](03_Tasks-76-78_Administrative-Divisions.md)

---

## Document Overview

This document covers Sri Lankan phone number validation/formatting and National Identity Card (NIC) validation with date of birth extraction.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 69 | Create phone.py File | Low |
| 70 | Add validate_sl_phone Function | Medium |
| 71 | Add format_sl_phone Function | Medium |
| 72 | Add normalize_sl_phone Function | Medium |
| 73 | Create nic.py File | Low |
| 74 | Add validate_nic Function | High |
| 75 | Add parse_nic_dob Function | High |

---

## Task 69: Create phone.py File

### Instructions
1. Create `phone.py` in srilanka/ directory
2. Add docstring explaining SL phone formats
3. Import regex for pattern matching

### Sri Lankan Phone Format
- **International:** +94 XX XXX XXXX
- **Mobile prefixes:** 70, 71, 72, 74, 75, 76, 77, 78
- **Landline:** Area code + 7 digits

### Verification Checklist
- [ ] phone.py file created with docstring

---

## Task 70: Add validate_sl_phone Function

### Instructions
Create function to validate Sri Lankan phone numbers.

### Implementation Pattern
```python
import re

def validate_sl_phone(phone):
    """
    Validate Sri Lankan phone number.
    
    Formats accepted:
        - +94 XX XXX XXXX
        - +94XXXXXXXXX
        - 0XXXXXXXXX
        - XXXXXXXXX
    
    Valid mobile prefixes: 70, 71, 72, 74, 75, 76, 77, 78
    """
    # Remove spaces and dashes
    cleaned = re.sub(r'[\s\-]', '', phone)
    
    # Pattern: +94 followed by mobile prefix and 7 digits
    pattern = r'^(\+94|0)?(7[0-8])\d{7}$'
    
    return bool(re.match(pattern, cleaned))
```

### Valid Examples
- +94 71 234 5678 ✓
- +94712345678 ✓
- 0712345678 ✓
- 712345678 ✓

### Verification Checklist
- [ ] Function validates mobile numbers
- [ ] Handles various formats

---

## Task 71: Add format_sl_phone Function

### Instructions
Create function to format phone numbers in standard format.

### Implementation Pattern
```python
def format_sl_phone(phone):
    """
    Format phone number: +94 XX XXX XXXX
    
    Example:
        >>> format_sl_phone("0712345678")
        '+94 71 234 5678'
    """
    cleaned = re.sub(r'[\s\-\+]', '', phone)
    
    # Remove leading 0 if present
    if cleaned.startswith('94'):
        cleaned = cleaned[2:]
    elif cleaned.startswith('0'):
        cleaned = cleaned[1:]
    
    # Format as +94 XX XXX XXXX
    return f"+94 {cleaned[:2]} {cleaned[2:5]} {cleaned[5:]}"
```

### Verification Checklist
- [ ] Function formats to +94 XX XXX XXXX

---

## Task 72: Add normalize_sl_phone Function

### Instructions
Create function to normalize phone to storage format.

### Implementation Pattern
```python
def normalize_sl_phone(phone):
    """
    Normalize to storage format: +94XXXXXXXXX
    
    Example:
        >>> normalize_sl_phone("0712345678")
        '+94712345678'
    """
    cleaned = re.sub(r'[\s\-\+]', '', phone)
    
    if cleaned.startswith('94'):
        return f"+{cleaned}"
    elif cleaned.startswith('0'):
        return f"+94{cleaned[1:]}"
    else:
        return f"+94{cleaned}"
```

### Verification Checklist
- [ ] Function returns +94XXXXXXXXX format

---

## Task 73: Create nic.py File

### Instructions
1. Create `nic.py` in srilanka/ directory
2. Document NIC formats (old and new)

### NIC Formats

| Format | Example | Structure |
|--------|---------|-----------|
| **Old** | 881234567V | 9 digits + V/X |
| **New** | 198812345678 | 12 digits |

### Old NIC Structure
- First 2 digits: Birth year (88 = 1988)
- Next 3 digits: Day of year (+500 for females)
- Last 4 digits: Serial number
- Suffix: V (male) or X (female)

### New NIC Structure
- First 4 digits: Birth year (1988)
- Next 3 digits: Day of year (+500 for females)
- Last 5 digits: Serial number

### Verification Checklist
- [ ] nic.py file created with formats documented

---

## Task 74: Add validate_nic Function

### Instructions
Create function to validate both old and new NIC formats.

### Implementation Pattern
```python
import re
from datetime import datetime, timedelta

def validate_nic(nic):
    """
    Validate Sri Lankan NIC (old or new format).
    
    Old: 9 digits + V/X (e.g., 881234567V)
    New: 12 digits (e.g., 198812345678)
    
    Returns:
        bool: True if valid
    """
    nic = nic.strip().upper()
    
    # Old format: 9 digits + V/X
    old_pattern = r'^\d{9}[VX]$'
    if re.match(old_pattern, nic):
        return _validate_old_nic(nic)
    
    # New format: 12 digits
    new_pattern = r'^\d{12}$'
    if re.match(new_pattern, nic):
        return _validate_new_nic(nic)
    
    return False

def _validate_old_nic(nic):
    """Validate old NIC format."""
    year = int(nic[0:2])
    days = int(nic[2:5])
    
    # Days should be 1-366 or 501-866 (for females)
    if days > 866 or (days > 366 and days < 501):
        return False
    
    return True

def _validate_new_nic(nic):
    """Validate new NIC format."""
    year = int(nic[0:4])
    days = int(nic[4:7])
    
    # Days should be 1-366 or 501-866 (for females)
    if days > 866 or (days > 366 and days < 501):
        return False
    
    # Year should be reasonable (1900-2100)
    if year < 1900 or year > 2100:
        return False
    
    return True
```

### Verification Checklist
- [ ] Validates old format (9 digits + V/X)
- [ ] Validates new format (12 digits)
- [ ] Checks day-of-year range

---

## Task 75: Add parse_nic_dob Function

### Instructions
Create function to extract date of birth from NIC.

### Implementation Pattern
```python
def parse_nic_dob(nic):
    """
    Extract date of birth from NIC.
    
    Args:
        nic: Valid NIC number
    
    Returns:
        date: Date of birth
        str: Gender ('M' or 'F')
    
    Example:
        >>> dob, gender = parse_nic_dob("881234567V")
        >>> print(dob)  # 1988-05-03
        >>> print(gender)  # M
    """
    nic = nic.strip().upper()
    
    if len(nic) == 10:  # Old format
        year = int(nic[0:2])
        # Assume 1900s for year >= 50, else 2000s
        year = 1900 + year if year >= 50 else 2000 + year
        days = int(nic[2:5])
        gender = 'F' if days > 500 else 'M'
        if days > 500:
            days -= 500
    else:  # New format
        year = int(nic[0:4])
        days = int(nic[4:7])
        gender = 'F' if days > 500 else 'M'
        if days > 500:
            days -= 500
    
    # Calculate date from year and day-of-year
    date_of_birth = datetime(year, 1, 1) + timedelta(days=days - 1)
    
    return date_of_birth.date(), gender
```

### Examples

| NIC | DOB | Gender |
|-----|-----|--------|
| 881234567V | 1988-05-03 | Male |
| 886234567X | 1988-05-03 | Female (234+500) |
| 199812345678 | 1998-05-03 | Male |

### Verification Checklist
- [ ] Extracts date of birth
- [ ] Determines gender
- [ ] Handles both old and new formats

---

## Summary

### Tasks Completed
Tasks 69-75 complete (phone and NIC validation).

### Module Structure
```
backend/apps/core/
└── srilanka/
    ├── __init__.py
    ├── currency.py
    ├── phone.py             # Phone functions
    │   ├── validate_sl_phone()
    │   ├── format_sl_phone()
    │   └── normalize_sl_phone()
    └── nic.py               # NIC functions
        ├── validate_nic()
        └── parse_nic_dob()
```

### Next Steps
Proceed to [03_Tasks-76-78_Administrative-Divisions.md](03_Tasks-76-78_Administrative-Divisions.md) for:
- Provinces constant
- Districts constant
- Export all srilanka utilities

---

## Notes for AI Agents

1. **Mobile Prefixes:** 70-78 (not all numbers)
2. **NIC Validation:** Critical for identity verification
3. **Gender Detection:** Day > 500 indicates female
4. **Testing:** Full tests in Group F, Task 84-86
