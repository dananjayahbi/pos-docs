# Tasks 25-29: Tax, Total, Notes, Ordering & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** B - Quote Line Items & Calculations  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28, 29

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_LineItem-Model-Core.md](01_Tasks-19-24_LineItem-Model-Core.md)
- **→ Next Document:** [03_Tasks-30-36_Calculation-Services.md](03_Tasks-30-36_Calculation-Services.md)

---

## Document Overview

This document covers the addition of tax fields, line total calculations, notes field, ordering functionality, and database migrations for the QuoteLineItem model.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Add Line Item Tax Fields | Medium | 20 min |
| 26 | Add Line Item Total Field | Medium | 20 min |
| 27 | Add Line Item Notes Field | Low | 15 min |
| 28 | Create Line Item Ordering | Medium | 20 min |
| 29 | Run QuoteLineItem Migrations | Low | 15 min |

---

## Task 25: Add Line Item Tax Fields

### Overview
Add tax calculation fields to support VAT and other taxes on individual line items, with configurable tax rates and taxable status.

### Dependencies
- Task 24: Discount fields exist

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Add is_taxable field**
   - BooleanField
   - default=True
   - Help text: "Whether this item is subject to tax"
   - Use for tax-exempt items

3. **Add tax_rate field**
   - DecimalField
   - max_digits=5, decimal_places=2
   - default=Decimal('0.00')
   - Help text: "Tax rate percentage (e.g., 15 for 15% VAT)"
   - Validators: MinValueValidator(0), MaxValueValidator(100)

4. **Add tax_amount field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - editable=False (calculated field)
   - Help text: "Calculated tax amount in LKR"

5. **Add calculate_tax_amount method**
   - Calculate taxable_base = (quantity * unit_price) - discount_amount
   - If is_taxable is False: tax_amount = 0
   - If is_taxable is True: tax_amount = taxable_base * (tax_rate / 100)
   - Store result in tax_amount field
   - Return tax_amount

6. **Add property get_taxable_amount**
   - @property decorator
   - Return amount before tax: (quantity * unit_price) - discount_amount
   - This is the base for tax calculation

7. **Add property get_tax_percentage**
   - @property decorator
   - Return tax_rate formatted as percentage string
   - Example: "15%" or "0%"

8. **Import validators**
   - from django.core.validators import MinValueValidator, MaxValueValidator

9. **Update save method**
   - Call calculate_discount_amount()
   - Call calculate_tax_amount()
   - Then call super().save()

10. **Add default_tax_from_product method**
    - Accept product parameter
    - Set tax_rate from product.tax_rate or product.category.tax_rate
    - Set is_taxable from product.is_taxable
    - Called when line item created from product

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| is_taxable | BooleanField | default=True |
| tax_rate | DecimalField | max_digits=5, decimal_places=2, 0-100, default=0 |
| tax_amount | DecimalField | max_digits=12, decimal_places=2, calculated |

### Tax Calculation Logic

```python
# Step 1: Calculate taxable base
taxable_base = (quantity × unit_price) - discount_amount

# Step 2: Apply tax if taxable
IF is_taxable == True:
    tax_amount = taxable_base × (tax_rate / 100)
ELSE:
    tax_amount = 0
```

### Sri Lanka VAT Context
- Standard VAT rate: 15% (as of 2026)
- Some items exempt from VAT (essential foods, medicines)
- VAT registration threshold for businesses
- Tax-inclusive vs tax-exclusive pricing

### Usage Examples

```python
# VAT-taxable item
line = QuoteLineItem(
    quantity=Decimal('5'),
    unit_price=Decimal('1000.00'),
    discount_amount=Decimal('500.00'),
    is_taxable=True,
    tax_rate=Decimal('15.00')  # 15% VAT
)
line.calculate_tax_amount()
# taxable_base = 4,500.00
# tax_amount = 675.00 LKR

# Tax-exempt item (essential food)
line = QuoteLineItem(
    quantity=Decimal('10'),
    unit_price=Decimal('500.00'),
    is_taxable=False,
    tax_rate=Decimal('0.00')
)
line.calculate_tax_amount()
# tax_amount = 0.00 LKR
```

### Common Tax Scenarios

```python
# Standard VAT (15%)
tax_rate = Decimal('15.00')

# Service tax (different rate if applicable)
tax_rate = Decimal('12.00')

# Tax-exempt
is_taxable = False
tax_rate = Decimal('0.00')
```

### Expected Outcome
Line items correctly calculate:
1. Taxable base (after discount)
2. Tax amount based on rate
3. Support for tax-exempt items

### Verification Checklist
- [ ] is_taxable BooleanField added
- [ ] tax_rate DecimalField with validators
- [ ] tax_amount calculated field
- [ ] calculate_tax_amount() method implemented
- [ ] get_taxable_amount property
- [ ] get_tax_percentage property
- [ ] Validators prevent invalid tax rates
- [ ] save() method auto-calculates tax
- [ ] default_tax_from_product() method
- [ ] Tax calculation respects is_taxable flag

---

## Task 26: Add Line Item Total Field

### Overview
Add the line_total field that represents the final amount for a line item after all calculations (quantity, price, discount, tax).

### Dependencies
- Task 25: Tax fields exist

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Add line_total field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - editable=False (calculated field)
   - Help text: "Total for this line (quantity × price - discount + tax)"

3. **Add calculate_line_total method**
   - Calculate: (quantity * unit_price) - discount_amount + tax_amount
   - Store result in line_total field
   - Return line_total

4. **Add property get_line_total_formatted**
   - @property decorator
   - Format line_total as currency string
   - Return "₨ 1,234.56"
   - Use thousand separators

5. **Update save method**
   - Call calculate_discount_amount()
   - Call calculate_tax_amount()
   - Call calculate_line_total()
   - Then call super().save()

6. **Add recalculate method**
   - Public method to recalculate all amounts
   - Call calculate_discount_amount()
   - Call calculate_tax_amount()
   - Call calculate_line_total()
   - Don't save, just update in memory
   - Return self for chaining

7. **Add breakdown property**
   - @property decorator
   - Return dict with all line calculations:
     - subtotal
     - discount_amount
     - taxable_amount
     - tax_amount
     - line_total
   - Useful for debugging and display

8. **Add validation in clean() method**
   - Ensure line_total >= 0
   - Negative totals indicate calculation error

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| line_total | DecimalField | max_digits=12, decimal_places=2, calculated |

### Line Total Calculation

```python
# Full calculation
subtotal = quantity × unit_price
after_discount = subtotal - discount_amount
line_total = after_discount + tax_amount

# Simplified
line_total = (quantity × unit_price) - discount_amount + tax_amount
```

### Calculation Flow Diagram

```
Quantity × Unit Price
         │
         ▼
    Subtotal
         │
         ▼
  - Discount Amount
         │
         ▼
  Taxable Amount
         │
         ▼
   + Tax Amount
         │
         ▼
   Line Total
```

### Usage Examples

```python
# Complete line item calculation
line = QuoteLineItem(
    quantity=Decimal('10'),
    unit_price=Decimal('1000.00'),
    discount_type='PERCENTAGE',
    discount_value=Decimal('10.00'),  # 10% off
    is_taxable=True,
    tax_rate=Decimal('15.00')  # 15% VAT
)

line.calculate_discount_amount()  # 1,000.00
line.calculate_tax_amount()        # 1,350.00
line.calculate_line_total()        # 10,350.00

# Breakdown:
# Subtotal: 10,000.00
# Discount: -1,000.00
# After Discount: 9,000.00
# Tax (15%): +1,350.00
# Line Total: 10,350.00
```

### Breakdown Dictionary

```python
line.breakdown
# Returns:
{
    'subtotal': Decimal('10000.00'),
    'discount_amount': Decimal('1000.00'),
    'taxable_amount': Decimal('9000.00'),
    'tax_amount': Decimal('1350.00'),
    'line_total': Decimal('10350.00')
}
```

### Expected Outcome
```python
# Automatic calculation on save
line_item = QuoteLineItem.objects.create(
    quote=quote,
    product=product,
    quantity=Decimal('5'),
    unit_price=Decimal('2000.00')
)
# line_item.line_total automatically calculated
print(line_item.line_total)  # 10,000.00
```

### Verification Checklist
- [ ] line_total DecimalField added
- [ ] calculate_line_total() method implemented
- [ ] get_line_total_formatted property
- [ ] save() method includes line_total calculation
- [ ] recalculate() method for in-memory updates
- [ ] breakdown property returns calculation dict
- [ ] Validation ensures non-negative total
- [ ] Line total updates automatically on field changes

---

## Task 27: Add Line Item Notes Field

### Overview
Add a notes field for line-specific comments, instructions, or clarifications that apply to individual items.

### Dependencies
- Task 26: Line total field exists

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Add notes field**
   - TextField
   - blank=True (optional)
   - default=''
   - Help text: "Additional notes or instructions for this line item"

3. **Add has_notes property**
   - @property decorator
   - Return True if notes is not empty
   - Return False if notes is empty or whitespace only

4. **Add get_notes_preview method**
   - Method accepting length parameter (default=50)
   - Return first N characters of notes
   - Add "..." if notes is longer
   - Use for list displays

5. **Update admin configuration**
   - Add notes to QuoteLineItemAdmin if it exists
   - Use TextField widget for better editing

6. **Add common notes examples in docstring**
   - Document typical use cases:
     - "Custom engraving: Company logo"
     - "Delivery required by Friday"
     - "Gift wrapping included"
     - "Setup and installation included"

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| notes | TextField | blank=True, default='' |

### Usage Examples

```python
# Product with customization
line = QuoteLineItem(
    product=product,
    product_name="Business Cards",
    quantity=Decimal('1000'),
    unit_price=Decimal('5.00'),
    notes="Premium matte finish, rounded corners, custom logo"
)

# Service with special instructions
line = QuoteLineItem(
    product=None,
    product_name="Website Development",
    quantity=Decimal('1'),
    unit_price=Decimal('50000.00'),
    notes="""
    Project includes:
    - 5 page responsive website
    - Contact form integration
    - Google Analytics setup
    - 2 rounds of revisions
    """
)
```

### Common Note Types

1. **Customization Instructions**
   - Engraving text
   - Color selections
   - Size specifications

2. **Delivery Requirements**
   - Delivery dates
   - Special handling
   - Location details

3. **Service Scope**
   - Included services
   - Exclusions
   - Timeframes

4. **Sri Lanka Context**
   - Language preference (Sinhala/Tamil/English)
   - Local delivery areas
   - Festival-specific requirements

### Expected Outcome
```python
# Notes display in quote PDF
line.notes = "Free delivery to Colombo area. Setup included."
print(line.has_notes)  # True
print(line.get_notes_preview(20))  # "Free delivery to C..."
```

### Verification Checklist
- [ ] notes TextField added
- [ ] Field is optional (blank=True)
- [ ] has_notes property implemented
- [ ] get_notes_preview() method with configurable length
- [ ] Admin widget configured if applicable
- [ ] Documentation includes use case examples

---

## Task 28: Create Line Item Ordering

### Overview
Implement drag-and-drop ordering functionality for line items using the position field, including methods to reorder items.

### Dependencies
- Task 19: position field exists
- Task 27: All line item fields complete

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Update Meta class ordering**
   - Confirm ordering = ['position', 'created_at']
   - Add unique_together constraint if needed
   - Ensure db_index on position

3. **Add auto_position method**
   - Class method or manager method
   - Automatically assign position when creating line item
   - Query max position for quote
   - Set new position = max + 1
   - Handle case when no items exist (position = 0)

4. **Override save method for auto-positioning**
   - If self.pk is None (new object) and position == 0:
     - Call auto_position()
   - Then proceed with calculations and super().save()

5. **Add move_up method**
   - Instance method
   - Swap position with previous item
   - Get previous item: position < self.position, order by position desc
   - Swap positions
   - Save both items

6. **Add move_down method**
   - Instance method
   - Swap position with next item
   - Get next item: position > self.position, order by position asc
   - Swap positions
   - Save both items

7. **Add move_to_position method**
   - Accept target_position parameter
   - Reorder all items in quote
   - Update positions to accommodate move
   - Use database transaction

8. **Add reorder_quote_items class method**
   - Accept quote and list of line_item_ids
   - Update position for each item based on list order
   - Use enumerate to assign positions
   - Bulk update for efficiency

9. **Add get_previous_item method**
   - Return line item with next lower position
   - Return None if first item

10. **Add get_next_item method**
    - Return line item with next higher position
    - Return None if last item

### Ordering Methods

| Method | Purpose |
|--------|---------|
| auto_position() | Auto-assign position to new items |
| move_up() | Move item up one position |
| move_down() | Move item down one position |
| move_to_position(n) | Move item to specific position |
| reorder_quote_items() | Bulk reorder all items |
| get_previous_item() | Get item above |
| get_next_item() | Get item below |

### Position Logic

```python
# Auto-assign position
IF line_item is new AND position == 0:
    max_position = max(quote.line_items.all().values_list('position'))
    line_item.position = max_position + 1

# Move up
current_position = 5
previous_item.position = 5
current_item.position = 4

# Move to position
move_item from position 7 to position 2
    items at positions 2-6 shift down to 3-7
    moved item takes position 2
```

### Usage Examples

```python
# Automatic positioning
line1 = QuoteLineItem.objects.create(quote=quote, ...)  # position = 0
line2 = QuoteLineItem.objects.create(quote=quote, ...)  # position = 1
line3 = QuoteLineItem.objects.create(quote=quote, ...)  # position = 2

# Manual reordering
line2.move_up()  # Now position = 0, line1 becomes position = 1

# Bulk reorder (for drag-drop)
new_order = [line3.id, line1.id, line2.id]
QuoteLineItem.reorder_quote_items(quote, new_order)
# line3: position = 0
# line1: position = 1
# line2: position = 2
```

### Database Transaction

```python
from django.db import transaction

@transaction.atomic
def move_to_position(self, target_position):
    # Atomic operation to prevent race conditions
    # Update all positions in single transaction
    pass
```

### Expected Outcome
```python
# Line items maintain consistent ordering
quote.line_items.all()
# Returns: [item at position 0, item at position 1, item at position 2]

# Support drag-and-drop in frontend
# Frontend sends new order: [id3, id1, id2]
# Backend reorders: positions updated atomically
```

### Verification Checklist
- [ ] Meta class ordering by position confirmed
- [ ] auto_position() method implemented
- [ ] save() method auto-assigns position to new items
- [ ] move_up() method swaps with previous
- [ ] move_down() method swaps with next
- [ ] move_to_position() handles complex reordering
- [ ] reorder_quote_items() bulk updates positions
- [ ] get_previous_item() and get_next_item() methods
- [ ] Database transactions used for reordering
- [ ] Positions remain consistent after operations

---

## Task 29: Run QuoteLineItem Migrations

### Overview
Generate and apply database migrations for the QuoteLineItem model with all fields completed.

### Dependencies
- Tasks 19-28: All QuoteLineItem fields added

### Instructions

1. **Review model completeness**
   - Open `apps/quotes/models/line_item.py`
   - Verify all fields from Tasks 19-28 are present
   - Check imports are complete
   - Ensure model is imported in `__init__.py`

2. **Check for migration conflicts**
   - Look for existing migrations in `apps/quotes/migrations/`
   - Ensure no uncommitted changes
   - Check if model has been partially migrated

3. **Generate migration**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations quotes`
   - Review generated migration file

4. **Verify migration contents**
   - Open generated migration file (e.g., `0002_quotelineitem.py`)
   - Verify CreateModel operation includes all fields
   - Check ForeignKey relationships
   - Confirm indexes and constraints

5. **Check migration dependencies**
   - Ensure depends_on includes previous quote migrations
   - Verify dependencies on products app if needed

6. **Run migration**
   - Execute: `python manage.py migrate quotes`
   - Verify migration applied successfully
   - Check for any errors or warnings

7. **Verify database schema**
   - Connect to database
   - Verify `quotes_quotelineitem` table created
   - Check all columns exist
   - Verify indexes created
   - Check foreign key constraints

8. **Test model operations**
   - Open Django shell: `python manage.py shell`
   - Import QuoteLineItem model
   - Create test instance
   - Verify save/retrieve works

9. **Document migration**
   - Add comment in migration file explaining changes
   - Update project migration log if maintained
   - Document any special considerations

10. **Commit migration**
    - Add migration file to git
    - Commit with descriptive message
    - Example: "Add QuoteLineItem model with pricing and tax fields"

### Migration Checklist

| Item | Check |
|------|-------|
| All model fields present | ✓ |
| Model imported in __init__.py | ✓ |
| makemigrations executed | ✓ |
| Migration file reviewed | ✓ |
| migrate executed successfully | ✓ |
| Database table created | ✓ |
| Model operations tested | ✓ |
| Migration committed | ✓ |

### Expected Migration File Structure

```python
# apps/quotes/migrations/0002_quotelineitem.py

from django.db import migrations, models
import django.db.models.deletion
from decimal import Decimal

class Migration(migrations.Migration):
    dependencies = [
        ('quotes', '0001_initial'),
        ('products', '0003_product_pricing'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuoteLineItem',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('position', models.PositiveIntegerField(default=0)),
                ('product', models.ForeignKey(null=True, blank=True, ...)),
                ('variant', models.ForeignKey(null=True, blank=True, ...)),
                # ... all other fields
                ('quote', models.ForeignKey(
                    on_delete=models.CASCADE,
                    related_name='line_items',
                    to='quotes.quote'
                )),
            ],
            options={
                'ordering': ['position', 'created_at'],
                'verbose_name': 'Quote Line Item',
            },
        ),
    ]
```

### Database Verification Commands

```sql
-- Check table created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'quotes_quotelineitem';

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quotes_quotelineitem';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'quotes_quotelineitem';
```

### Test Operations

```python
# In Django shell
from apps.quotes.models import Quote, QuoteLineItem
from apps.products.models import Product
from decimal import Decimal

# Create test quote
quote = Quote.objects.first()

# Create line item
line = QuoteLineItem.objects.create(
    quote=quote,
    product_name="Test Product",
    quantity=Decimal('5'),
    unit_price=Decimal('1000.00'),
    is_taxable=True,
    tax_rate=Decimal('15.00')
)

# Verify calculations
print(line.line_total)  # Should show calculated total
print(line.tax_amount)  # Should show calculated tax

# Verify ordering
print(line.position)    # Should show auto-assigned position
```

### Common Migration Issues

| Issue | Solution |
|-------|----------|
| Circular dependency | Reorder migration dependencies |
| Missing ForeignKey | Add dependency on referenced app |
| Field conflict | Check for duplicate field names |
| Default value required | Add default to new fields on existing data |

### Rollback Procedure

If migration fails:
```bash
# Rollback migration
python manage.py migrate quotes 0001_initial

# Fix issues in model
# Regenerate migration
python manage.py makemigrations quotes

# Apply again
python manage.py migrate quotes
```

### Expected Outcome

After successful migration:
- `quotes_quotelineitem` table exists in database
- All fields present with correct types
- Foreign keys to quote and product tables work
- Indexes created for performance
- Model CRUD operations functional

### Verification Checklist
- [ ] makemigrations executed without errors
- [ ] Migration file generated and reviewed
- [ ] Dependencies correct
- [ ] migrate executed successfully
- [ ] Database table created
- [ ] All columns present
- [ ] Foreign keys functional
- [ ] Indexes created
- [ ] Test instance created successfully
- [ ] Calculations work correctly
- [ ] Migration file committed to git

---

## Summary

After completing Tasks 25-29, the QuoteLineItem model will have:

### Tax Handling
- is_taxable flag
- tax_rate field (percentage)
- tax_amount (calculated)
- Sri Lanka VAT support (15%)

### Line Total
- line_total field (final amount)
- Complete calculation flow
- Breakdown property for transparency
- Currency formatting

### Notes
- TextField for line-specific comments
- Customization instructions
- Delivery requirements
- Service scope details

### Ordering
- position field for sorting
- Auto-positioning for new items
- move_up/move_down methods
- Bulk reordering support
- Drag-and-drop ready

### Database
- Migration generated
- Schema applied
- All fields in database
- Relationships established
- Ready for use

### Complete Calculation Flow

```
Quantity × Unit Price = Subtotal
Subtotal - Discount = After Discount
After Discount × Tax Rate = Tax Amount
After Discount + Tax Amount = Line Total
```

### Next Steps
Proceed to [03_Tasks-30-36_Calculation-Services.md](03_Tasks-30-36_Calculation-Services.md) to implement calculation services and signals.
