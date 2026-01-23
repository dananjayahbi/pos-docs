# Tasks 63-68: SriLanka Module & Currency Helpers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** E - Sri Lanka Specific Utilities  
> **Document:** 01 of 03  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_DateTime-Helpers/](../Group-D_DateTime-Helpers/)
- **→ Next Document:** [02_Tasks-69-74_Phone-NIC-Validation.md](02_Tasks-69-74_Phone-NIC-Validation.md)

---

## Document Overview

This document covers the creation of the srilanka module and implementation of LKR currency formatting and conversion utilities.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create srilanka Module | Low |
| 64 | Create srilanka __init__.py | Low |
| 65 | Create currency.py File | Low |
| 66 | Add format_lkr Function | Medium |
| 67 | Add parse_lkr Function | Medium |
| 68 | Add convert_currency Function | High |

---

## Task 63: Create srilanka Module

### Overview
Create the srilanka module for Sri Lanka-specific utilities including currency, phone numbers, NIC validation, and administrative divisions.

### Dependencies
- Group D: Date/Time Helpers (completed)

### Instructions

1. **Navigate to core app**
   - Go to `backend/apps/core/` directory

2. **Create srilanka directory**
   - Create new directory named `srilanka`

3. **Plan module organization**
   - `currency.py`: LKR formatting and conversion
   - `phone.py`: Phone number validation and formatting
   - `nic.py`: National Identity Card validation
   - `provinces.py`: Administrative divisions

### Expected Structure
```
backend/apps/core/
├── pagination/
├── filters/
├── validators/
├── datetime/
└── srilanka/              # New directory
```

### Verification Checklist
- [ ] srilanka/ directory created
- [ ] Ready for utility files

---

## Task 64: Create srilanka __init__.py

### Overview
Create the package initialization file for the srilanka module.

### Dependencies
- Task 63: Create srilanka Module

### Instructions

1. **Create __init__.py file**
   - In srilanka/ directory

2. **Add module docstring**
   - Document Sri Lankan context utilities
   - List utility categories

3. **Add version**
   - Set to '1.0.0'

### File Structure
```python
"""
Sri Lankan utilities for LankaCommerce Cloud.

Utilities:
    - Currency: LKR formatting and conversion
    - Phone: Sri Lankan phone number validation
    - NIC: National Identity Card validation
    - Administrative: Provinces and districts
"""

__version__ = '1.0.0'

__all__ = []  # Will populate later
```

### Verification Checklist
- [ ] __init__.py file created
- [ ] Module docstring present

---

## Task 65: Create currency.py File

### Overview
Create the currency.py file for LKR (Sri Lankan Rupee) formatting and conversion functions.

### Dependencies
- Task 64: Create srilanka __init__.py

### Instructions

1. **Create currency.py file**
   - In srilanka/ directory

2. **Add file docstring**
   - Document LKR currency handling
   - Note format: Rs. 1,500.00

3. **Import dependencies**
   - Import Decimal for precision

### File Structure
```python
"""
Currency utilities for Sri Lankan Rupees (LKR).

Format: Rs. 1,500.00
Symbol: Rs. or රු
ISO Code: LKR
Decimal places: 2
"""

from decimal import Decimal
```

### Sri Lankan Currency Details

| Property | Value |
|----------|-------|
| **Currency Name** | Sri Lankan Rupee |
| **Symbol** | Rs. or රු (Sinhala) |
| **ISO Code** | LKR |
| **Decimal Places** | 2 |
| **Format** | Rs. 1,500.00 |

### Verification Checklist
- [ ] currency.py file created
- [ ] File docstring present
- [ ] Currency details documented

---

## Task 66: Add format_lkr Function

### Overview
Create a function to format amounts as Sri Lankan Rupees with proper thousand separators and decimal places.

### Dependencies
- Task 65: Create currency.py File

### Instructions

1. **Create format_lkr function**
   - Parameter: amount (Decimal or number)
   - Returns: formatted string

2. **Implementation**
   - Add Rs. prefix
   - Add thousand separators (commas)
   - Two decimal places
   - Handle negative amounts

3. **Document format examples**
   - 1500 → "Rs. 1,500.00"
   - 1500000 → "Rs. 1,500,000.00"
   - -500 → "Rs. -500.00"

### Implementation Pattern
```python
def format_lkr(amount, show_symbol=True):
    """
    Format amount as Sri Lankan Rupees.
    
    Args:
        amount: Numeric amount
        show_symbol: Include Rs. symbol (default True)
    
    Returns:
        str: Formatted currency string
    
    Examples:
        >>> format_lkr(1500)
        'Rs. 1,500.00'
        
        >>> format_lkr(1500000)
        'Rs. 1,500,000.00'
        
        >>> format_lkr(1500.50, show_symbol=False)
        '1,500.50'
    """
    amount_decimal = Decimal(str(amount))
    
    # Format with commas and 2 decimal places
    formatted = "{:,.2f}".format(amount_decimal)
    
    if show_symbol:
        return f"Rs. {formatted}"
    return formatted
```

### Use Cases

| Scenario | Format |
|----------|--------|
| **Product price** | Rs. 2,500.00 |
| **Invoice total** | Rs. 125,750.50 |
| **Discount** | Rs. -250.00 |
| **Report (no symbol)** | 1,500.00 |

### Verification Checklist
- [ ] format_lkr function defined
- [ ] Proper thousand separators
- [ ] Two decimal places
- [ ] Symbol parameter supported

---

## Task 67: Add parse_lkr Function

### Overview
Create a function to parse LKR formatted strings back to Decimal numbers.

### Dependencies
- Task 66: Add format_lkr Function

### Instructions

1. **Create parse_lkr function**
   - Parameter: formatted string
   - Returns: Decimal amount

2. **Implementation**
   - Remove Rs. symbol
   - Remove commas
   - Convert to Decimal
   - Handle invalid input

3. **Document examples**
   - "Rs. 1,500.00" → Decimal('1500.00')
   - "1,500" → Decimal('1500.00')

### Implementation Pattern
```python
def parse_lkr(value):
    """
    Parse LKR formatted string to Decimal.
    
    Args:
        value: Formatted currency string or number
    
    Returns:
        Decimal: Parsed amount
    
    Examples:
        >>> parse_lkr("Rs. 1,500.00")
        Decimal('1500.00')
        
        >>> parse_lkr("1,500")
        Decimal('1500.00')
        
        >>> parse_lkr(1500)
        Decimal('1500.00')
    """
    if isinstance(value, (Decimal, int, float)):
        return Decimal(str(value))
    
    # Remove currency symbols and commas
    cleaned = value.replace('Rs.', '').replace('රු', '')
    cleaned = cleaned.replace(',', '').strip()
    
    return Decimal(cleaned)
```

### Verification Checklist
- [ ] parse_lkr function defined
- [ ] Removes symbols and commas
- [ ] Returns Decimal
- [ ] Handles various input formats

---

## Task 68: Add convert_currency Function

### Overview
Create a function placeholder for currency conversion between LKR and other currencies, to be integrated with exchange rate API later.

### Dependencies
- Task 67: Add parse_lkr Function

### Instructions

1. **Create convert_currency function**
   - Parameters: amount, from_currency, to_currency
   - Returns: converted amount

2. **Implementation**
   - Placeholder for now
   - Document that exchange rates will be added later
   - Return amount * exchange_rate

3. **Document common conversions**
   - LKR to USD
   - USD to LKR
   - Note: Requires exchange rate API integration

### Implementation Pattern
```python
def convert_currency(amount, from_currency, to_currency, exchange_rate=None):
    """
    Convert between currencies.
    
    NOTE: This is a placeholder. Exchange rate API integration
    will be added in Phase 09 (Integrations).
    
    Args:
        amount: Amount to convert
        from_currency: Source currency code (e.g., 'LKR')
        to_currency: Target currency code (e.g., 'USD')
        exchange_rate: Exchange rate (required for now)
    
    Returns:
        Decimal: Converted amount
    
    Future:
        - Integrate with Central Bank of Sri Lanka API
        - Cache exchange rates
        - Support multiple currencies
    
    Example (with manual rate):
        >>> # 1 USD = 300 LKR
        >>> convert_currency(300, 'LKR', 'USD', exchange_rate=0.0033)
        Decimal('0.99')
    """
    if exchange_rate is None:
        raise ValueError(
            "Exchange rate required. API integration pending."
        )
    
    amount_decimal = Decimal(str(amount))
    rate_decimal = Decimal(str(exchange_rate))
    
    return amount_decimal * rate_decimal
```

### Future Integration

| Feature | Status | Phase |
|---------|--------|-------|
| **Manual rates** | ✅ Now | Phase 03 |
| **Exchange API** | ⏳ Planned | Phase 09 |
| **Multi-currency** | ⏳ Planned | Phase 09 |
| **Rate caching** | ⏳ Planned | Phase 09 |

### Common Exchange Rates (Approximate)

| Conversion | Typical Rate | Example |
|------------|--------------|---------|
| **1 USD to LKR** | ~300 LKR | $1 = Rs. 300 |
| **1 EUR to LKR** | ~330 LKR | €1 = Rs. 330 |
| **1 GBP to LKR** | ~380 LKR | £1 = Rs. 380 |

### Verification Checklist
- [ ] convert_currency function defined
- [ ] Placeholder implementation
- [ ] Future integration documented
- [ ] Manual rate parameter supported

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Create srilanka Module | srilanka/ directory |
| 64 | Create srilanka __init__.py | Package initialization |
| 65 | Create currency.py File | Currency utilities file |
| 66 | Add format_lkr Function | LKR formatting |
| 67 | Add parse_lkr Function | LKR parsing |
| 68 | Add convert_currency Function | Currency conversion placeholder |

### Module Structure After This Document
```
backend/apps/core/
└── srilanka/
    ├── __init__.py          # Package initialization
    └── currency.py          # Currency functions
        ├── format_lkr()
        ├── parse_lkr()
        └── convert_currency()
```

### Currency Functions Summary

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `format_lkr()` | Amount | "Rs. 1,500.00" | Display currency |
| `parse_lkr()` | "Rs. 1,500.00" | Decimal | Parse input |
| `convert_currency()` | Amount, rate | Converted amount | Currency exchange |

### LKR Currency Format
- **Symbol:** Rs. or රු
- **Format:** Rs. 1,500.00
- **Decimals:** 2 places
- **Separator:** Comma (thousands)

### Next Steps
Proceed to [02_Tasks-69-74_Phone-NIC-Validation.md](02_Tasks-69-74_Phone-NIC-Validation.md) to implement:
- Sri Lankan phone number validation
- Phone number formatting
- NIC validation (old and new formats)
- Date of birth extraction from NIC

---

## Notes for AI Agents

1. **Currency Symbol:** Use Rs. (Latin) or රු (Sinhala)
2. **Decimal Precision:** Always use Decimal for financial calculations
3. **Exchange Rates:** Placeholder for Phase 09 integration
4. **Testing:** Full tests in Group F, Task 84-85
5. **Next Document:** Phone and NIC validation
