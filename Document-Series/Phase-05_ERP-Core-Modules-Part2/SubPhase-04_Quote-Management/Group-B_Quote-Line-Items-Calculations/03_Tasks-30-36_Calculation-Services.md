# Tasks 30-36: Calculation Services & Signals

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** B - Quote Line Items & Calculations  
> **Document:** 03 of 03  
> **Tasks Covered:** 30, 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-29_Tax-Total-Notes-Migration.md](02_Tasks-25-29_Tax-Total-Notes-Migration.md)
- **→ Next Group:** [../Group-C_Quote-Services-Business-Logic/](../Group-C_Quote-Services-Business-Logic/)

---

## Document Overview

This document covers the implementation of quote calculation services that encapsulate all financial calculations, including line totals, tax calculations, header discounts, grand totals, automatic recalculation signals, and price snapshotting logic.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 30 | Create Quote Calculation Service | Medium | 25 min |
| 31 | Implement Line Total Calculator | Medium | 25 min |
| 32 | Implement Tax Calculator | Medium | 25 min |
| 33 | Implement Header Discount Applicator | Medium | 25 min |
| 34 | Implement Grand Total Calculator | Medium | 25 min |
| 35 | Create Quote Recalculation Signal | Medium | 25 min |
| 36 | Add Price Snapshotting | Medium | 25 min |

---

## Task 30: Create Quote Calculation Service

### Overview
Create the QuoteCalculationService class that provides a centralized service for all quote-related financial calculations.

### Dependencies
- Group B Tasks 19-29: QuoteLineItem model complete
- Group A: Quote model with financial fields

### Instructions

1. **Create calculation service file**
   - Navigate to `apps/quotes/services/`
   - Create new file `calculation.py`

2. **Import required modules**
   - Import Decimal from decimal
   - Import Quote, QuoteLineItem models
   - Import typing annotations (Optional, List, Dict)

3. **Define QuoteCalculationService class**
   - Add comprehensive docstring
   - Explain service purpose: centralized calculation logic
   - List main methods

4. **Add __init__ method**
   - Accept quote instance as parameter
   - Store as self.quote
   - Initialize any caching attributes if needed

5. **Add calculate_all method**
   - Main orchestrator method
   - Call all calculation methods in sequence:
     1. Calculate line items
     2. Calculate subtotal
     3. Apply header discount
     4. Calculate tax
     5. Calculate grand total
   - Update quote fields
   - Save quote if save parameter is True
   - Return updated quote

6. **Add get_line_items method**
   - Return quote.line_items.all().order_by('position')
   - Prefetch related data for efficiency
   - Return QuerySet

7. **Add _ensure_decimal helper method**
   - Private method
   - Convert any numeric value to Decimal
   - Handle None values (return Decimal('0'))
   - Prevent floating point errors

8. **Add get_calculation_summary method**
   - Return dict with complete breakdown:
     - line_items_count
     - subtotal
     - header_discount_amount
     - taxable_amount
     - tax_amount
     - grand_total
   - Useful for API responses and debugging

9. **Update services __init__.py**
   - Import QuoteCalculationService
   - Add to __all__

10. **Add usage example in docstring**
    - Show how to use service
    - Example with create and calculate

### Service Structure

```python
class QuoteCalculationService:
    """
    Service for quote financial calculations.
    
    Handles:
    - Line item calculations
    - Subtotal aggregation
    - Header discount application
    - Tax calculations
    - Grand total computation
    """
    
    def __init__(self, quote):
        self.quote = quote
    
    def calculate_all(self, save=True):
        """Calculate all quote totals"""
        pass
    
    def calculate_line_totals(self):
        """Calculate all line item totals"""
        pass
    
    def calculate_subtotal(self):
        """Sum all line totals"""
        pass
    
    def apply_header_discount(self):
        """Apply quote-level discount"""
        pass
    
    def calculate_tax(self):
        """Calculate total tax"""
        pass
    
    def calculate_grand_total(self):
        """Calculate final total"""
        pass
```

### Usage Pattern

```python
from apps.quotes.services import QuoteCalculationService

# After creating or updating quote
service = QuoteCalculationService(quote)
quote = service.calculate_all(save=True)

# Get calculation breakdown
summary = service.get_calculation_summary()
```

### Expected Outcome
```
apps/quotes/services/
├── __init__.py
└── calculation.py           # New service created
```

### Verification Checklist
- [ ] calculation.py file created in services/
- [ ] QuoteCalculationService class defined
- [ ] __init__ accepts quote parameter
- [ ] calculate_all() orchestrator method
- [ ] get_line_items() method
- [ ] _ensure_decimal() helper method
- [ ] get_calculation_summary() returns dict
- [ ] Imported in services __init__.py
- [ ] Comprehensive docstrings

---

## Task 31: Implement Line Total Calculator

### Overview
Implement the line total calculation method that triggers recalculation for all line items and aggregates their totals.

### Dependencies
- Task 30: QuoteCalculationService exists

### Instructions

1. **Open calculation.py**
   - Navigate to `apps/quotes/services/calculation.py`

2. **Implement calculate_line_totals method**
   - Get all line items for quote
   - Iterate through each line item
   - Call line_item.recalculate()
   - Call line_item.save()
   - Return count of items calculated

3. **Add bulk calculation optimization**
   - Use select_for_update() to prevent race conditions
   - Consider bulk_update for performance on large quotes
   - Transaction wrapper for atomicity

4. **Implement calculate_subtotal method**
   - Get all line items
   - Sum all line_total fields
   - Use aggregate() for efficiency
   - Update quote.subtotal field
   - Return subtotal value

5. **Add line items validation**
   - Check if quote has any line items
   - Raise ValueError if no items (can't calculate empty quote)
   - Or return Decimal('0') based on business logic

6. **Add get_lines_breakdown method**
   - Return list of dicts for each line item
   - Include: product_name, quantity, unit_price, line_total
   - Useful for itemized displays

7. **Add optimization for unchanged lines**
   - Check if line item already calculated
   - Skip recalculation if not modified
   - Use updated_at timestamp

8. **Import database utilities**
   - from django.db.models import Sum, F
   - from django.db import transaction

### Implementation

```python
def calculate_line_totals(self):
    """
    Recalculate all line item totals.
    
    Returns:
        int: Number of line items calculated
    """
    line_items = self.get_line_items()
    
    if not line_items.exists():
        return 0
    
    count = 0
    with transaction.atomic():
        for line_item in line_items:
            line_item.recalculate()
            line_item.save(update_fields=[
                'discount_amount',
                'tax_amount',
                'line_total',
                'updated_at'
            ])
            count += 1
    
    return count

def calculate_subtotal(self):
    """
    Calculate subtotal by summing all line totals.
    
    Returns:
        Decimal: Subtotal amount
    """
    result = self.get_line_items().aggregate(
        subtotal=Sum('line_total')
    )
    
    subtotal = result['subtotal'] or Decimal('0.00')
    self.quote.subtotal = subtotal
    
    return subtotal
```

### Calculation Flow

```
For each line item:
    1. Calculate discount_amount
    2. Calculate tax_amount  
    3. Calculate line_total
    4. Save line item

Then:
    5. Sum all line_total values
    6. Update quote.subtotal
```

### Performance Considerations

```python
# Efficient query
line_items = self.quote.line_items.select_related(
    'product', 'variant'
).prefetch_related(
    'product__category'
)

# Aggregate in database
subtotal = line_items.aggregate(
    total=Sum('line_total')
)['total']
```

### Usage Examples

```python
service = QuoteCalculationService(quote)

# Calculate all line totals
count = service.calculate_line_totals()
print(f"Calculated {count} line items")

# Calculate subtotal
subtotal = service.calculate_subtotal()
print(f"Subtotal: ₨ {subtotal}")
```

### Expected Outcome
- All line items have current calculated totals
- Quote subtotal reflects sum of line totals
- Calculations atomic (all or nothing)

### Verification Checklist
- [ ] calculate_line_totals() method implemented
- [ ] Iterates through all line items
- [ ] Calls recalculate() on each item
- [ ] Saves each item after calculation
- [ ] calculate_subtotal() sums line totals
- [ ] Uses aggregate() for efficiency
- [ ] Transaction wrapper for atomicity
- [ ] Validates quote has line items
- [ ] get_lines_breakdown() returns itemized data
- [ ] Performance optimized with select_related

---

## Task 32: Implement Tax Calculator

### Overview
Implement tax calculation method that aggregates tax from all line items and handles any additional quote-level taxes.

### Dependencies
- Task 31: Line total calculator implemented

### Instructions

1. **Open calculation.py**
   - Navigate to `apps/quotes/services/calculation.py`

2. **Implement calculate_tax method**
   - Sum tax_amount from all line items
   - Add any quote-level additional tax if applicable
   - Update quote.tax_amount field
   - Return total tax

3. **Add get_tax_breakdown method**
   - Group tax by tax rate
   - Return dict: {rate: amount}
   - Example: {'15.00': Decimal('750.00'), '0.00': Decimal('0.00')}
   - Useful for tax reports

4. **Add get_taxable_amount method**
   - Calculate total amount subject to tax
   - Sum (line subtotal - discount) for taxable items only
   - Exclude is_taxable=False items
   - Return taxable base

5. **Add validate_tax_rates method**
   - Check all line items have valid tax rates
   - Ensure rates are within 0-100 range
   - Warn if mixed rates (might be intentional)

6. **Handle Sri Lanka VAT specifics**
   - Standard rate: 15%
   - Support for exempt items
   - Tax-inclusive vs exclusive handling

7. **Add tax_summary property**
   - Return formatted tax breakdown for display
   - Include rate, base amount, tax amount
   - Format for PDF/invoice display

### Implementation

```python
def calculate_tax(self):
    """
    Calculate total tax from all line items.
    
    Returns:
        Decimal: Total tax amount
    """
    # Sum tax from line items
    result = self.get_line_items().aggregate(
        total_tax=Sum('tax_amount')
    )
    
    tax_amount = result['total_tax'] or Decimal('0.00')
    
    # Add quote-level tax if any
    if hasattr(self.quote, 'additional_tax'):
        tax_amount += self._ensure_decimal(self.quote.additional_tax)
    
    self.quote.tax_amount = tax_amount
    return tax_amount

def get_tax_breakdown(self):
    """
    Get tax breakdown by rate.
    
    Returns:
        dict: Tax rates with amounts
    """
    line_items = self.get_line_items()
    breakdown = {}
    
    for item in line_items:
        rate = str(item.tax_rate)
        if rate not in breakdown:
            breakdown[rate] = Decimal('0.00')
        breakdown[rate] += item.tax_amount
    
    return breakdown

def get_taxable_amount(self):
    """
    Calculate total taxable base amount.
    
    Returns:
        Decimal: Amount subject to tax
    """
    taxable_items = self.get_line_items().filter(is_taxable=True)
    
    result = taxable_items.aggregate(
        taxable=Sum(
            F('quantity') * F('unit_price') - F('discount_amount')
        )
    )
    
    return result['taxable'] or Decimal('0.00')
```

### Tax Calculation Logic

```
For each line item:
    IF is_taxable:
        taxable_base = (quantity × unit_price) - discount_amount
        tax_amount = taxable_base × (tax_rate / 100)
    ELSE:
        tax_amount = 0

Total Tax = SUM(all line_item.tax_amount) + additional_tax
```

### Tax Breakdown Example

```python
service = QuoteCalculationService(quote)

# Calculate tax
total_tax = service.calculate_tax()
print(f"Total Tax: ₨ {total_tax}")

# Get breakdown
breakdown = service.get_tax_breakdown()
# {
#     '15.00': Decimal('1500.00'),  # VAT items
#     '0.00': Decimal('0.00')        # Exempt items
# }

# Get taxable base
taxable = service.get_taxable_amount()
print(f"Taxable Amount: ₨ {taxable}")
```

### Sri Lanka VAT Handling

```python
# Standard VAT rate
STANDARD_VAT_RATE = Decimal('15.00')

# VAT calculation
vat_amount = taxable_base * (STANDARD_VAT_RATE / 100)

# Tax-exempt items
# Essential foods, medicines, etc.
line_item.is_taxable = False
line_item.tax_rate = Decimal('0.00')
```

### Expected Outcome
```python
# Quote with mixed tax rates
quote.line_items:
    Item 1: taxable, 15% VAT → ₨150 tax
    Item 2: taxable, 15% VAT → ₨200 tax
    Item 3: exempt, 0% → ₨0 tax

service.calculate_tax()
# quote.tax_amount = ₨350.00
```

### Verification Checklist
- [ ] calculate_tax() method implemented
- [ ] Sums tax_amount from all line items
- [ ] Handles additional quote-level tax if present
- [ ] get_tax_breakdown() groups by rate
- [ ] get_taxable_amount() calculates base correctly
- [ ] Filters for is_taxable=True items
- [ ] validate_tax_rates() checks validity
- [ ] Sri Lanka VAT (15%) supported
- [ ] Tax-exempt items handled
- [ ] Uses aggregate() for efficiency

---

## Task 33: Implement Header Discount Applicator

### Overview
Implement header-level discount application that applies to the entire quote subtotal (after line items are calculated).

### Dependencies
- Task 31: Subtotal calculation complete

### Instructions

1. **Open calculation.py**
   - Navigate to `apps/quotes/services/calculation.py`

2. **Implement apply_header_discount method**
   - Get subtotal from quote
   - Check if discount_type is set
   - Calculate discount_amount based on type
   - Update quote.discount_amount
   - Return discount amount

3. **Support PERCENTAGE discount type**
   - Calculate: subtotal * (discount_value / 100)
   - Validate: discount_value <= 100
   - Round to 2 decimal places

4. **Support FIXED discount type**
   - Use discount_value as is
   - Validate: discount_value <= subtotal
   - Prevent discount > subtotal

5. **Add validate_header_discount method**
   - Check discount doesn't exceed subtotal
   - Check percentage is valid (0-100)
   - Raise ValueError for invalid discounts
   - Return True if valid

6. **Add get_discounted_subtotal method**
   - Calculate: subtotal - discount_amount
   - Return amount after header discount
   - This becomes the taxable base if tax is post-discount

7. **Add get_discount_percentage_actual method**
   - Calculate actual percentage even if fixed amount
   - Formula: (discount_amount / subtotal) * 100
   - Useful for display ("You saved 15%")

8. **Handle edge cases**
   - No discount (discount_type is None)
   - Zero subtotal (prevent division by zero)
   - Discount equal to subtotal (100% discount)

### Implementation

```python
def apply_header_discount(self):
    """
    Apply quote-level discount to subtotal.
    
    Returns:
        Decimal: Discount amount applied
    """
    # Ensure subtotal is calculated
    if not hasattr(self.quote, 'subtotal'):
        self.calculate_subtotal()
    
    subtotal = self._ensure_decimal(self.quote.subtotal)
    
    # No discount
    if not self.quote.discount_type:
        self.quote.discount_amount = Decimal('0.00')
        return Decimal('0.00')
    
    # Calculate based on type
    if self.quote.discount_type == 'PERCENTAGE':
        discount_value = self._ensure_decimal(self.quote.discount_value)
        if discount_value > 100:
            raise ValueError("Discount percentage cannot exceed 100%")
        discount_amount = subtotal * (discount_value / 100)
    
    elif self.quote.discount_type == 'FIXED':
        discount_amount = self._ensure_decimal(self.quote.discount_value)
        if discount_amount > subtotal:
            raise ValueError("Fixed discount cannot exceed subtotal")
    
    else:
        discount_amount = Decimal('0.00')
    
    # Round and update
    discount_amount = discount_amount.quantize(Decimal('0.01'))
    self.quote.discount_amount = discount_amount
    
    return discount_amount

def validate_header_discount(self):
    """
    Validate header discount is within acceptable range.
    
    Returns:
        bool: True if valid
    
    Raises:
        ValueError: If discount is invalid
    """
    if not self.quote.discount_type:
        return True
    
    subtotal = self._ensure_decimal(self.quote.subtotal)
    discount_value = self._ensure_decimal(self.quote.discount_value)
    
    if self.quote.discount_type == 'PERCENTAGE':
        if discount_value < 0 or discount_value > 100:
            raise ValueError("Percentage must be between 0 and 100")
    
    elif self.quote.discount_type == 'FIXED':
        if discount_value < 0:
            raise ValueError("Discount cannot be negative")
        if discount_value > subtotal:
            raise ValueError(
                f"Discount ₨{discount_value} exceeds subtotal ₨{subtotal}"
            )
    
    return True

def get_discounted_subtotal(self):
    """
    Get subtotal after header discount.
    
    Returns:
        Decimal: Subtotal minus discount
    """
    subtotal = self._ensure_decimal(self.quote.subtotal)
    discount = self._ensure_decimal(self.quote.discount_amount)
    return subtotal - discount
```

### Discount Types

| Type | Calculation | Example |
|------|-------------|---------|
| PERCENTAGE | subtotal × (value / 100) | Subtotal ₨10,000 × 15% = ₨1,500 off |
| FIXED | value | Flat ₨1,000 off |
| None | 0 | No discount |

### Usage Examples

```python
service = QuoteCalculationService(quote)

# 10% discount
quote.discount_type = 'PERCENTAGE'
quote.discount_value = Decimal('10.00')
quote.subtotal = Decimal('10000.00')

discount = service.apply_header_discount()
# discount_amount = ₨1,000.00
# discounted_subtotal = ₨9,000.00

# Fixed discount
quote.discount_type = 'FIXED'
quote.discount_value = Decimal('500.00')

discount = service.apply_header_discount()
# discount_amount = ₨500.00
# discounted_subtotal = ₨9,500.00
```

### Sri Lanka Context
- Common discounts: 10%, 15%, 25% off
- Festival discounts (Avurudu, Vesak)
- Early payment discounts
- Bulk order discounts

### Expected Outcome
```python
# Complete calculation flow
service = QuoteCalculationService(quote)
service.calculate_line_totals()
service.calculate_subtotal()  # ₨10,000
service.apply_header_discount()  # -₨1,000 (10%)
# quote.discount_amount = ₨1,000
# Discounted subtotal = ₨9,000
```

### Verification Checklist
- [ ] apply_header_discount() method implemented
- [ ] Supports PERCENTAGE discount type
- [ ] Supports FIXED discount type
- [ ] Handles no discount (None)
- [ ] validate_header_discount() checks validity
- [ ] Percentage capped at 100%
- [ ] Fixed discount validated against subtotal
- [ ] get_discounted_subtotal() calculates correctly
- [ ] get_discount_percentage_actual() method
- [ ] Edge cases handled (zero subtotal, 100% off)
- [ ] Decimal rounding to 2 places

---

## Task 34: Implement Grand Total Calculator

### Overview
Implement the grand total calculation that combines all components (subtotal, discount, tax) into the final quote total.

### Dependencies
- Task 33: Header discount applicator complete

### Instructions

1. **Open calculation.py**
   - Navigate to `apps/quotes/services/calculation.py`

2. **Implement calculate_grand_total method**
   - Start with subtotal
   - Subtract header discount
   - Add tax amount
   - Add any additional charges (shipping, handling)
   - Update quote.total
   - Return grand total

3. **Add get_total_breakdown method**
   - Return complete breakdown dict:
     - subtotal
     - discount_amount
     - after_discount
     - tax_amount
     - additional_charges
     - grand_total
   - Format for display/PDF

4. **Add apply_additional_charges method**
   - Handle shipping_cost if present
   - Handle handling_fee if present
   - Sum and add to total
   - Update quote fields

5. **Add get_amount_due method**
   - Same as grand_total initially
   - Can be extended for partial payments later
   - Return amount customer needs to pay

6. **Add format_currency helper method**
   - Format Decimal as LKR currency string
   - Add thousand separators
   - Add ₨ symbol
   - Example: ₨ 12,345.67

7. **Update calculate_all orchestrator**
   - Ensure calls methods in correct order:
     1. calculate_line_totals()
     2. calculate_subtotal()
     3. apply_header_discount()
     4. calculate_tax()
     5. calculate_grand_total()
   - Save quote after all calculations

### Implementation

```python
def calculate_grand_total(self):
    """
    Calculate final quote total.
    
    Formula: subtotal - discount + tax + additional_charges
    
    Returns:
        Decimal: Grand total amount
    """
    # Get components
    subtotal = self._ensure_decimal(self.quote.subtotal)
    discount = self._ensure_decimal(self.quote.discount_amount)
    tax = self._ensure_decimal(self.quote.tax_amount)
    
    # Additional charges
    additional = Decimal('0.00')
    if hasattr(self.quote, 'shipping_cost'):
        additional += self._ensure_decimal(self.quote.shipping_cost)
    if hasattr(self.quote, 'handling_fee'):
        additional += self._ensure_decimal(self.quote.handling_fee)
    
    # Calculate total
    grand_total = subtotal - discount + tax + additional
    
    # Ensure non-negative
    if grand_total < 0:
        raise ValueError("Grand total cannot be negative")
    
    self.quote.total = grand_total
    return grand_total

def get_total_breakdown(self):
    """
    Get complete financial breakdown.
    
    Returns:
        dict: All financial components
    """
    return {
        'subtotal': self.quote.subtotal,
        'discount_type': self.quote.discount_type,
        'discount_value': self.quote.discount_value,
        'discount_amount': self.quote.discount_amount,
        'after_discount': self.quote.subtotal - self.quote.discount_amount,
        'tax_amount': self.quote.tax_amount,
        'additional_charges': self._get_additional_charges(),
        'grand_total': self.quote.total,
        'currency': 'LKR',
        'formatted_total': self.format_currency(self.quote.total)
    }

def format_currency(self, amount):
    """
    Format amount as LKR currency.
    
    Args:
        amount: Decimal amount
    
    Returns:
        str: Formatted currency string
    """
    amount = self._ensure_decimal(amount)
    # Format with thousand separators
    formatted = f"{amount:,.2f}"
    return f"₨ {formatted}"

def calculate_all(self, save=True):
    """
    Calculate all quote financial totals.
    
    Args:
        save: Whether to save quote after calculation
    
    Returns:
        Quote: Updated quote instance
    """
    with transaction.atomic():
        # Calculate in correct order
        self.calculate_line_totals()
        self.calculate_subtotal()
        self.apply_header_discount()
        self.calculate_tax()
        self.calculate_grand_total()
        
        if save:
            self.quote.save(update_fields=[
                'subtotal',
                'discount_amount',
                'tax_amount',
                'total',
                'updated_at'
            ])
    
    return self.quote
```

### Grand Total Formula

```
Grand Total = Subtotal - Discount + Tax + Additional Charges

Where:
    Subtotal = Σ(line_item.line_total)
    Discount = Header discount amount
    Tax = Σ(line_item.tax_amount)
    Additional = Shipping + Handling + Other fees
```

### Calculation Flow Diagram

```
Line Items → Calculate → Line Totals
                ↓
         Sum Line Totals
                ↓
            Subtotal
                ↓
        Apply Discount
                ↓
      Discounted Subtotal
                ↓
          Calculate Tax
                ↓
       Add Additional Charges
                ↓
          Grand Total
```

### Usage Examples

```python
service = QuoteCalculationService(quote)

# Full calculation
quote = service.calculate_all(save=True)

# Get breakdown
breakdown = service.get_total_breakdown()
# {
#     'subtotal': Decimal('10000.00'),
#     'discount_amount': Decimal('1000.00'),
#     'after_discount': Decimal('9000.00'),
#     'tax_amount': Decimal('1350.00'),
#     'grand_total': Decimal('10350.00'),
#     'formatted_total': '₨ 10,350.00'
# }

# Format for display
print(service.format_currency(quote.total))
# Output: ₨ 10,350.00
```

### Complete Example

```python
# Quote with all components
quote = Quote.objects.create(
    customer=customer,
    discount_type='PERCENTAGE',
    discount_value=Decimal('10.00')
)

# Add line items
QuoteLineItem.objects.create(
    quote=quote,
    quantity=Decimal('10'),
    unit_price=Decimal('1000.00'),
    is_taxable=True,
    tax_rate=Decimal('15.00')
)

# Calculate everything
service = QuoteCalculationService(quote)
quote = service.calculate_all(save=True)

# Results:
# Line total: ₨10,000
# Subtotal: ₨10,000
# Discount (10%): -₨1,000
# After discount: ₨9,000
# Tax (15%): +₨1,350
# Grand Total: ₨10,350
```

### Expected Outcome
```python
# Single method call calculates everything
service = QuoteCalculationService(quote)
updated_quote = service.calculate_all(save=True)

print(f"Grand Total: {service.format_currency(updated_quote.total)}")
# Grand Total: ₨ 10,350.00
```

### Verification Checklist
- [ ] calculate_grand_total() method implemented
- [ ] Combines subtotal, discount, tax correctly
- [ ] Handles additional charges (shipping, handling)
- [ ] get_total_breakdown() returns complete dict
- [ ] format_currency() formats LKR correctly
- [ ] Thousand separators in formatting
- [ ] calculate_all() orchestrates all methods
- [ ] Transaction wrapper for atomicity
- [ ] Validates non-negative total
- [ ] Proper method call ordering

---

## Task 35: Create Quote Recalculation Signal

### Overview
Implement Django signals to automatically recalculate quote totals when line items are added, modified, or deleted.

### Dependencies
- Task 34: Complete calculation service

### Instructions

1. **Create signals directory and file**
   - Create directory `apps/quotes/signals/`
   - Create `__init__.py`
   - Create `recalculation.py`

2. **Import required modules**
   - from django.db.models.signals import post_save, post_delete, pre_save
   - from django.dispatch import receiver
   - Import Quote, QuoteLineItem models
   - Import QuoteCalculationService

3. **Create line_item_changed signal handler**
   - Use @receiver decorator for post_save on QuoteLineItem
   - Get quote from line_item.quote
   - Create QuoteCalculationService instance
   - Call calculate_all(save=True)

4. **Create line_item_deleted signal handler**
   - Use @receiver decorator for post_delete on QuoteLineItem
   - Similar logic to post_save
   - Recalculate quote after line deletion

5. **Add signal throttling**
   - Prevent infinite loops
   - Check if calculation already in progress
   - Use thread-local storage or flag

6. **Add conditional recalculation**
   - Only recalculate if quote is DRAFT or SENT
   - Don't recalculate locked quotes (ACCEPTED, CONVERTED)
   - Check quote.status before running

7. **Create register_signals function**
   - Function to connect all signals
   - Call from apps.py ready() method
   - Ensure signals registered once

8. **Update apps.py**
   - Import signals in ready() method
   - Prevent duplicate signal registration

9. **Add signal logging**
   - Log when recalculation triggered
   - Use Python logging module
   - Debug level for signal firing

10. **Add disable_signals context manager**
    - Context manager to temporarily disable signals
    - Use during bulk operations
    - Prevent multiple recalculations

### Implementation

```python
# apps/quotes/signals/recalculation.py

import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.quotes.models import Quote, QuoteLineItem
from apps.quotes.services import QuoteCalculationService

logger = logging.getLogger(__name__)

# Flag to prevent infinite loops
_recalculating = False


@receiver(post_save, sender=QuoteLineItem)
def recalculate_on_line_save(sender, instance, created, **kwargs):
    """
    Recalculate quote totals when line item is saved.
    """
    global _recalculating
    
    # Prevent infinite loop
    if _recalculating:
        return
    
    # Only recalculate for editable quotes
    if instance.quote.status not in ['DRAFT', 'SENT']:
        return
    
    try:
        _recalculating = True
        logger.debug(
            f"Recalculating quote {instance.quote.quote_number} "
            f"after line item {'created' if created else 'updated'}"
        )
        
        service = QuoteCalculationService(instance.quote)
        service.calculate_all(save=True)
        
    except Exception as e:
        logger.error(f"Error recalculating quote: {e}")
        raise
    finally:
        _recalculating = False


@receiver(post_delete, sender=QuoteLineItem)
def recalculate_on_line_delete(sender, instance, **kwargs):
    """
    Recalculate quote totals when line item is deleted.
    """
    global _recalculating
    
    if _recalculating:
        return
    
    if instance.quote.status not in ['DRAFT', 'SENT']:
        return
    
    try:
        _recalculating = True
        logger.debug(
            f"Recalculating quote {instance.quote.quote_number} "
            f"after line item deleted"
        )
        
        service = QuoteCalculationService(instance.quote)
        service.calculate_all(save=True)
        
    except Exception as e:
        logger.error(f"Error recalculating quote: {e}")
        raise
    finally:
        _recalculating = False
```

### Apps Configuration

```python
# apps/quotes/apps.py

from django.apps import AppConfig

class QuotesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.quotes'
    
    def ready(self):
        """Import signal handlers."""
        import apps.quotes.signals.recalculation
```

### Disable Signals Context Manager

```python
# apps/quotes/signals/recalculation.py

from contextlib import contextmanager
from django.db.models.signals import post_save, post_delete

@contextmanager
def disable_quote_signals():
    """
    Context manager to temporarily disable quote recalculation signals.
    
    Usage:
        with disable_quote_signals():
            # Bulk create line items
            QuoteLineItem.objects.bulk_create(items)
            # Manual recalculation
            service.calculate_all()
    """
    post_save.disconnect(recalculate_on_line_save, sender=QuoteLineItem)
    post_delete.disconnect(recalculate_on_line_delete, sender=QuoteLineItem)
    
    try:
        yield
    finally:
        post_save.connect(recalculate_on_line_save, sender=QuoteLineItem)
        post_delete.connect(recalculate_on_line_delete, sender=QuoteLineItem)
```

### Usage Examples

```python
# Automatic recalculation
line_item = QuoteLineItem.objects.create(
    quote=quote,
    quantity=Decimal('5'),
    unit_price=Decimal('1000.00')
)
# Signal fires, quote totals automatically updated

# Bulk operations without signals
with disable_quote_signals():
    items = [
        QuoteLineItem(quote=quote, quantity=1, unit_price=100),
        QuoteLineItem(quote=quote, quantity=2, unit_price=200),
        QuoteLineItem(quote=quote, quantity=3, unit_price=300),
    ]
    QuoteLineItem.objects.bulk_create(items)
    
    # Manual recalculation once
    service = QuoteCalculationService(quote)
    service.calculate_all(save=True)
```

### Signal Flow

```
Line Item Saved
       │
       ▼
  Signal Fires
       │
       ▼
Check if recalculating (prevent loop)
       │
       ▼
Check quote status (editable?)
       │
       ▼
Set recalculating flag
       │
       ▼
Create QuoteCalculationService
       │
       ▼
Call calculate_all()
       │
       ▼
Clear recalculating flag
```

### Expected Outcome
```
apps/quotes/signals/
├── __init__.py
└── recalculation.py          # New signal handlers
```

### Verification Checklist
- [ ] signals/ directory created
- [ ] recalculation.py file created
- [ ] post_save signal handler for QuoteLineItem
- [ ] post_delete signal handler for QuoteLineItem
- [ ] Infinite loop prevention with flag
- [ ] Status check before recalculation
- [ ] Signal registration in apps.py
- [ ] Logging for debugging
- [ ] disable_quote_signals context manager
- [ ] Signals properly connected/disconnected

---

## Task 36: Add Price Snapshotting

### Overview
Implement price snapshotting functionality that captures and freezes product prices at quote creation time to protect quotes from future price changes.

### Dependencies
- Task 35: Signals implemented
- QuoteLineItem model with price fields

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Implement snapshot_from_product method**
   - Accept product and optional variant parameters
   - Copy product_name from product
   - Copy unit_price from product.selling_price or variant.price
   - Copy original_price (for discount display)
   - Copy cost_price (for margin tracking)
   - Copy tax_rate from product
   - Copy is_taxable from product
   - Don't save, return self

3. **Add create_from_product class method**
   - Accept quote, product, variant, quantity parameters
   - Create new QuoteLineItem instance
   - Call snapshot_from_product
   - Set quantity and position
   - Save and return instance

4. **Add snapshot_prices signal**
   - In pre_save signal
   - If product is set and prices not yet snapshotted
   - Automatically snapshot prices
   - Set flag to indicate snapshot complete

5. **Add price_snapshot_at field**
   - DateTimeField
   - auto_now_add equivalent logic
   - Records when prices were captured
   - Useful for price history tracking

6. **Add has_price_changed method**
   - Compare current product price with unit_price
   - Return True if product price changed since snapshot
   - Useful for price update notifications

7. **Add get_price_difference method**
   - Calculate: current_product_price - unit_price
   - Return Decimal (positive if price increased)
   - Return None if no product linked

8. **Add update_prices_from_product method**
   - Re-snapshot prices from current product
   - Update unit_price, original_price, cost_price
   - Record new snapshot time
   - Used when explicitly updating prices

9. **Update QuoteCalculationService**
   - Add snapshot_all_prices method
   - Iterate all line items with products
   - Snapshot prices for each
   - Used when converting DRAFT to SENT

10. **Add documentation comments**
    - Explain price snapshotting concept
    - Document when prices are captured
    - Explain protection from price changes

### Implementation

```python
# In apps/quotes/models/line_item.py

def snapshot_from_product(self, product, variant=None):
    """
    Snapshot prices and details from product.
    
    Captures current product pricing to protect quote
    from future price changes.
    
    Args:
        product: Product instance
        variant: Optional ProductVariant instance
    
    Returns:
        self: For method chaining
    """
    self.product = product
    self.variant = variant
    self.product_name = product.name
    
    # Snapshot prices
    if variant and variant.price:
        self.unit_price = variant.price
    else:
        self.unit_price = product.selling_price or Decimal('0.00')
    
    self.original_price = self.unit_price
    self.cost_price = product.cost_price
    
    # Snapshot tax settings
    if hasattr(product, 'tax_rate'):
        self.tax_rate = product.tax_rate
    if hasattr(product, 'is_taxable'):
        self.is_taxable = product.is_taxable
    
    # Record snapshot time
    if not self.price_snapshot_at:
        from django.utils import timezone
        self.price_snapshot_at = timezone.now()
    
    return self

@classmethod
def create_from_product(cls, quote, product, quantity, variant=None):
    """
    Create line item from product with price snapshot.
    
    Args:
        quote: Quote instance
        product: Product instance
        quantity: Decimal quantity
        variant: Optional ProductVariant
    
    Returns:
        QuoteLineItem: Created instance
    """
    line_item = cls(
        quote=quote,
        quantity=quantity
    )
    line_item.snapshot_from_product(product, variant)
    line_item.save()
    
    return line_item

def has_price_changed(self):
    """
    Check if product price has changed since snapshot.
    
    Returns:
        bool: True if product price differs from snapshot
    """
    if not self.product:
        return False
    
    current_price = (
        self.variant.price if self.variant and self.variant.price
        else self.product.selling_price
    )
    
    return current_price != self.unit_price

def get_price_difference(self):
    """
    Get difference between current and snapshot price.
    
    Returns:
        Decimal: Price difference (positive if increased)
        None: If no product linked
    """
    if not self.product:
        return None
    
    current_price = (
        self.variant.price if self.variant and self.variant.price
        else self.product.selling_price
    )
    
    return current_price - self.unit_price
```

### QuoteCalculationService Extension

```python
# In apps/quotes/services/calculation.py

def snapshot_all_prices(self):
    """
    Snapshot prices for all line items linked to products.
    
    Should be called when sending quote to customer to lock prices.
    """
    line_items = self.get_line_items().filter(product__isnull=False)
    
    for line_item in line_items:
        if line_item.product:
            line_item.snapshot_from_product(
                line_item.product,
                line_item.variant
            )
            line_item.save(update_fields=[
                'unit_price',
                'original_price',
                'cost_price',
                'tax_rate',
                'is_taxable',
                'price_snapshot_at',
                'updated_at'
            ])
```

### Usage Examples

```python
# Create line item with price snapshot
product = Product.objects.get(sku='PROD-001')
line_item = QuoteLineItem.create_from_product(
    quote=quote,
    product=product,
    quantity=Decimal('10')
)
# Prices captured from product at creation time

# Check if price changed
product.selling_price = Decimal('1200.00')  # Price increased
product.save()

if line_item.has_price_changed():
    diff = line_item.get_price_difference()
    print(f"Price increased by ₨{diff}")
    # Price increased by ₨200.00

# Re-snapshot if needed (explicit action)
line_item.snapshot_from_product(product)
line_item.save()
```

### Price Protection Diagram

```
Product Price: ₨1000
       │
       ▼
Create Quote Line Item
       │
       ▼
Snapshot Price: ₨1000
       │
       ▼
[Time Passes]
       │
       ▼
Product Price Changes: ₨1200
       │
       ▼
Quote Line Item: Still ₨1000 (protected)
```

### Expected Outcome
```python
# Quote protected from price changes
product.selling_price = Decimal('1000.00')

quote = Quote.objects.create(customer=customer)
line = QuoteLineItem.create_from_product(
    quote=quote,
    product=product,
    quantity=Decimal('5')
)
# line.unit_price = ₨1000.00

# Product price increases
product.selling_price = Decimal('1500.00')
product.save()

# Quote still shows original price
print(line.unit_price)  # ₨1000.00 (unchanged)
print(line.has_price_changed())  # True
print(line.get_price_difference())  # ₨500.00
```

### Verification Checklist
- [ ] snapshot_from_product() method implemented
- [ ] Copies product_name from product
- [ ] Copies unit_price from product/variant
- [ ] Copies original_price for display
- [ ] Copies cost_price for margins
- [ ] Copies tax settings
- [ ] create_from_product() class method
- [ ] price_snapshot_at field added
- [ ] has_price_changed() detects changes
- [ ] get_price_difference() calculates delta
- [ ] snapshot_all_prices() in service
- [ ] Documentation explains snapshotting
- [ ] Protection from future price changes verified

---

## Summary

After completing Tasks 30-36, the Quote Calculation system will have:

### Calculation Service
- Centralized QuoteCalculationService class
- Orchestrated calculation flow
- calculate_all() method for complete recalculation

### Line Total Calculator
- Recalculates all line items
- Aggregates subtotal efficiently
- Transaction-safe operations

### Tax Calculator
- Aggregates tax from line items
- Tax breakdown by rate
- Taxable amount calculation
- Sri Lanka VAT (15%) support

### Header Discount
- Percentage and fixed discounts
- Validation against subtotal
- Discounted subtotal calculation

### Grand Total
- Complete financial breakdown
- Combines all components
- Currency formatting (LKR)
- Non-negative validation

### Auto-Recalculation
- Django signals for automatic updates
- Triggers on line item save/delete
- Status-aware (only editable quotes)
- Infinite loop prevention
- Bulk operation support

### Price Snapshotting
- Captures prices at quote creation
- Protects from future price changes
- Price change detection
- Re-snapshot capability
- Snapshot timestamp tracking

### Complete Flow

```
1. Create/Update Line Items
2. Signal Triggers
3. QuoteCalculationService.calculate_all()
   ├── Calculate line totals
   ├── Calculate subtotal
   ├── Apply header discount
   ├── Calculate tax
   └── Calculate grand total
4. Quote Updated with Current Totals
```

### Next Steps
Proceed to [Group-C_Quote-Services-Business-Logic/](../Group-C_Quote-Services-Business-Logic/) to implement quote business operations and lifecycle management.
