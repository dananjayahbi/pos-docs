# Tasks 25-28: Tax, HSN, Total & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** B - Invoice Line Items & Tax Calculation  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_LineItem-Model-Core.md](01_Tasks-19-24_LineItem-Model-Core.md)
- **→ Next Document:** [03_Tasks-29-34_Calculation-Services.md](03_Tasks-29-34_Calculation-Services.md)

---

## Document Overview

This document covers adding tax-related fields to the InvoiceLineItem model, HSN/SAC product classification codes, line total calculation, and generating migrations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Add Line Item Tax Fields | Medium |
| 26 | Add Line Item HSN/SAC Code | Low |
| 27 | Add Line Item Total Field | Medium |
| 28 | Run InvoiceLineItem Migrations | Low |

---

## Task 25: Add Line Item Tax Fields

### Overview
Add fields to track tax information for each line item including tax rate, tax amount, taxability status, and tax code for classification.

### Dependencies
- Task 24: Add Line Item Discount Fields

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add tax fields after discount fields

2. **Add tax_rate field**
   - Use DecimalField with max_digits=5, decimal_places=2
   - Purpose: Tax percentage rate (e.g., 12.00 for 12% VAT)
   - Set default=Decimal('0.00')
   - Add help_text: "Tax rate percentage (e.g., 12.00 for 12% VAT)"

3. **Add tax_amount field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Calculated tax amount in currency
   - Set default=Decimal('0.00')
   - Add help_text: "Calculated tax amount"
   - Auto-calculated by service layer

4. **Add is_taxable field**
   - Use BooleanField
   - Purpose: Flag to enable/disable tax for this line
   - Set default=True
   - Add help_text: "Whether this line item is taxable"
   - Allows for tax-exempt items

5. **Add tax_code field**
   - Use CharField with max_length=50
   - Purpose: Tax category or code
   - Set blank=True, null=True
   - Add help_text: "Tax category code (e.g., STANDARD_RATE, EXEMPT)"
   - Used for tax reporting and classification

6. **Add tax_description field**
   - Use CharField with max_length=100
   - Purpose: Human-readable tax description
   - Set blank=True, null=True
   - Add help_text: "Tax description (e.g., 'VAT 12%', 'Tax Exempt')"

### Tax Fields Structure
```python
from decimal import Decimal

# Tax Fields
tax_rate = models.DecimalField(
    max_digits=5,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Tax rate percentage (e.g., 12.00 for 12% VAT)"
)
tax_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Calculated tax amount"
)
is_taxable = models.BooleanField(
    default=True,
    help_text="Whether this line item is taxable"
)
tax_code = models.CharField(
    max_length=50,
    blank=True,
    null=True,
    help_text="Tax category code"
)
tax_description = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    help_text="Tax description (e.g., 'VAT 12%')"
)
```

### Sri Lanka Tax Rates

| Tax Type | Rate | tax_code | tax_description |
|----------|------|----------|-----------------|
| Standard VAT | 12% | STANDARD_RATE | VAT 12% |
| SVAT | 0% | SVAT | Simplified VAT |
| Exempt | 0% | EXEMPT | Tax Exempt |
| Zero-Rated | 0% | ZERO_RATED | Zero-Rated (exports) |
| NBT | 2% | NBT | Nation Building Tax 2% |

### Tax Calculation Formula
```python
# Calculate taxable amount (after discounts)
line_subtotal = quantity × unit_price
taxable_amount = line_subtotal - discount_amount

# Calculate tax
if is_taxable and tax_rate > 0:
    tax_amount = taxable_amount × (tax_rate / 100)
else:
    tax_amount = 0

# Calculate line total
line_total = taxable_amount + tax_amount
```

### Tax Calculation Examples

**Standard VAT (12%):**
```
quantity: 10
unit_price: 5,000
discount: None
---
line_subtotal: 50,000
taxable_amount: 50,000
tax_rate: 12.00
tax_amount: 50,000 × 0.12 = 6,000
line_total: 50,000 + 6,000 = 56,000
```

**Tax-Exempt Item:**
```
quantity: 5
unit_price: 2,000
is_taxable: False
---
line_subtotal: 10,000
taxable_amount: 10,000
tax_rate: 0.00
tax_amount: 0
line_total: 10,000
```

**With Discount and Tax:**
```
quantity: 10
unit_price: 5,000
discount_type: PERCENTAGE
discount_value: 10.00
tax_rate: 12.00
---
line_subtotal: 50,000
discount_amount: 5,000
taxable_amount: 45,000
tax_amount: 45,000 × 0.12 = 5,400
line_total: 45,000 + 5,400 = 50,400
```

### Invoice Display with Tax
```
┌──────────────────────────────────────────────────────────────┐
│ Description   │ Qty │ Rate    │ Disc │ Tax    │ Amount      │
├───────────────┼─────┼─────────┼──────┼────────┼─────────────┤
│ Laptop        │ 10  │ 125,000 │ 10%  │ 12%VAT │ 1,260,000.00│
│               │     │         │      │        │             │
├───────────────┼─────┼─────────┼──────┼────────┼─────────────┤
│ Books         │ 5   │ 1,500   │ -    │ Exempt │     7,500.00│
│ (Tax Exempt)  │     │         │      │        │             │
├───────────────┼─────┼─────────┼──────┼────────┼─────────────┤
│ Service       │ 1   │ 50,000  │ -    │ 12%VAT │    56,000.00│
└───────────────┴─────┴─────────┴──────┴────────┴─────────────┘
```

### Tax by Product Category
When creating line items from products:
```python
# Taxable product
if product.tax_category == 'STANDARD':
    line_item.is_taxable = True
    line_item.tax_rate = Decimal('12.00')
    line_item.tax_code = 'STANDARD_RATE'
    line_item.tax_description = 'VAT 12%'

# Tax-exempt product (books, education)
elif product.tax_category == 'EXEMPT':
    line_item.is_taxable = False
    line_item.tax_rate = Decimal('0.00')
    line_item.tax_code = 'EXEMPT'
    line_item.tax_description = 'Tax Exempt'
```

### Tax Reporting
Tax fields enable detailed tax reporting:
- Group by tax_rate for tax summary
- Filter by tax_code for compliance reports
- Track tax_amount for tax filing
- Separate taxable vs tax-exempt sales

### Verification Checklist
- [ ] tax_rate DecimalField is added
- [ ] tax_rate has max_digits=5, decimal_places=2
- [ ] tax_amount DecimalField is added
- [ ] is_taxable BooleanField is added with default=True
- [ ] tax_code CharField is added (optional)
- [ ] tax_description CharField is added (optional)
- [ ] Help text explains purpose of each field
- [ ] Decimal type used for default values

---

## Task 26: Add Line Item HSN/SAC Code

### Overview
Add HSN/SAC code field for product classification according to the Harmonized System of Nomenclature, used for tax compliance and international trade.

### Dependencies
- Task 25: Add Line Item Tax Fields

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add HSN/SAC field after tax fields

2. **Add hsn_code field**
   - Use CharField with max_length=20
   - Purpose: HSN (goods) or SAC (services) classification code
   - Set blank=True, null=True (optional)
   - Add help_text: "HSN/SAC code for product classification"

3. **Add hsn_description field**
   - Use CharField with max_length=200
   - Purpose: Description of HSN/SAC category
   - Set blank=True, null=True
   - Add help_text: "HSN/SAC code description"

### HSN/SAC Field Structure
```python
# HSN/SAC Code (Product Classification)
hsn_code = models.CharField(
    max_length=20,
    blank=True,
    null=True,
    help_text="HSN/SAC code for product classification"
)
hsn_description = models.CharField(
    max_length=200,
    blank=True,
    null=True,
    help_text="HSN/SAC code description"
)
```

### HSN vs SAC

| Type | Full Name | Used For | Code Format | Example |
|------|-----------|----------|-------------|---------|
| HSN | Harmonized System of Nomenclature | Goods | 4-8 digits | 8471 (Computers) |
| SAC | Services Accounting Code | Services | 6 digits | 998314 (IT Services) |

### Common HSN Codes (Sri Lanka)

| HSN Code | Category | Example Products |
|----------|----------|------------------|
| 8471 | Computers | Laptops, Desktops, Tablets |
| 8517 | Phones | Mobile Phones, Smartphones |
| 6203 | Clothing | Men's Suits, Jackets |
| 8528 | TVs | LED TVs, Smart TVs |
| 4901 | Books | Printed Books, Magazines |
| 8703 | Vehicles | Cars, Automobiles |

### Common SAC Codes (Sri Lanka)

| SAC Code | Service Category |
|----------|------------------|
| 998314 | IT Design & Development |
| 998311 | Consultancy Services |
| 996511 | Restaurant Services |
| 996791 | Beauty Services |
| 996411 | Transport Services |

### HSN/SAC on Invoice
```
┌────────────────────────────────────────────────────────┐
│ # │ HSN/SAC │ Description        │ Qty │ Rate │ Tax │
├───┼─────────┼────────────────────┼─────┼──────┼─────┤
│ 1 │ 8471    │ Laptop Computer    │ 10  │ 125k │ 12% │
│ 2 │ 8517    │ Mobile Phone       │ 5   │ 85k  │ 12% │
│ 3 │ 998314  │ IT Consulting      │ 1   │ 150k │ 12% │
│ 4 │ 4901    │ Books (Exempt)     │ 20  │ 1.5k │ 0%  │
└───┴─────────┴────────────────────┴─────┴──────┴─────┘
```

### HSN/SAC Source
When creating line item from product:
```python
if product.hsn_code:
    line_item.hsn_code = product.hsn_code
    line_item.hsn_description = product.hsn_description
```

For custom/service line items:
```python
# Manual entry or service-specific
line_item.hsn_code = '998314'
line_item.hsn_description = 'IT Design and Development Services'
```

### Compliance Requirements
- **GST/VAT Compliance**: Required for tax invoices in many jurisdictions
- **International Trade**: Required for export/import documentation
- **Tax Reporting**: Used in tax return filings
- **Audit Trail**: Helps classify sales for auditing

### Sri Lanka Context
- HSN/SAC codes increasingly required for VAT compliance
- Essential for export documentation
- Used in tax returns and audit processes
- Helps determine applicable tax rates

### Verification Checklist
- [ ] hsn_code CharField is added
- [ ] hsn_code is optional (blank=True, null=True)
- [ ] hsn_code max_length=20 supports both HSN and SAC
- [ ] hsn_description CharField is added
- [ ] hsn_description is optional
- [ ] Help text explains HSN/SAC purpose

---

## Task 27: Add Line Item Total Field

### Overview
Add a calculated line_total field that represents the final amount for the line item after applying quantity, unit price, discounts, and tax.

### Dependencies
- Task 26: Add Line Item HSN/SAC Code

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add line_total field after HSN/SAC fields

2. **Add line_total field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Final line item amount including all calculations
   - Set default=Decimal('0.00')
   - Add help_text: "Line item total (quantity × price - discount + tax)"

3. **Document calculation formula**
   - Add comment explaining calculation order
   - Note that it's auto-calculated by service
   - Should not be manually edited

4. **Add property method for subtotal**
   - Create property to calculate pre-tax subtotal
   - Useful for display and reporting

### Line Total Field Structure
```python
from decimal import Decimal

# Line Total (Calculated)
line_total = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Line item total (quantity × price - discount + tax)"
)
```

### Line Total Calculation Formula
```python
def calculate_line_total(self):
    """
    Calculate line total with this order:
    1. line_subtotal = quantity × unit_price
    2. Apply line discount → taxable_amount
    3. Calculate tax on taxable_amount
    4. line_total = taxable_amount + tax_amount
    """
    # Step 1: Calculate subtotal
    line_subtotal = self.quantity * self.unit_price
    
    # Step 2: Apply discount
    if self.discount_type == 'PERCENTAGE':
        self.discount_amount = line_subtotal * (self.discount_value / 100)
    elif self.discount_type == 'FIXED':
        self.discount_amount = self.discount_value
    else:
        self.discount_amount = Decimal('0.00')
    
    # Taxable amount after discount
    taxable_amount = line_subtotal - self.discount_amount
    
    # Step 3: Calculate tax
    if self.is_taxable and self.tax_rate > 0:
        self.tax_amount = taxable_amount * (self.tax_rate / 100)
    else:
        self.tax_amount = Decimal('0.00')
    
    # Step 4: Final total
    self.line_total = taxable_amount + self.tax_amount
    
    return self.line_total
```

### Calculation Examples

**Example 1: Simple Line (No Discount)**
```
quantity: 10
unit_price: 5,000
discount: NONE
tax_rate: 12%
is_taxable: True
---
line_subtotal: 10 × 5,000 = 50,000
discount_amount: 0
taxable_amount: 50,000
tax_amount: 50,000 × 0.12 = 6,000
line_total: 50,000 + 6,000 = 56,000
```

**Example 2: With Percentage Discount**
```
quantity: 10
unit_price: 5,000
discount_type: PERCENTAGE
discount_value: 10
tax_rate: 12%
---
line_subtotal: 50,000
discount_amount: 50,000 × 0.10 = 5,000
taxable_amount: 45,000
tax_amount: 45,000 × 0.12 = 5,400
line_total: 45,000 + 5,400 = 50,400
```

**Example 3: Tax-Exempt with Discount**
```
quantity: 5
unit_price: 10,000
discount_type: FIXED
discount_value: 5,000
is_taxable: False
---
line_subtotal: 50,000
discount_amount: 5,000
taxable_amount: 45,000
tax_amount: 0 (tax-exempt)
line_total: 45,000
```

**Example 4: Complex (Original Price + Line Discount + Tax)**
```
original_price: 10,000 (shown for reference)
unit_price: 9,000 (already discounted from original)
quantity: 10
discount_type: PERCENTAGE
discount_value: 5 (bulk discount)
tax_rate: 12%
---
line_subtotal: 10 × 9,000 = 90,000
discount_amount: 90,000 × 0.05 = 4,500
taxable_amount: 85,500
tax_amount: 85,500 × 0.12 = 10,260
line_total: 85,500 + 10,260 = 95,760
```

### Property Methods
```python
@property
def subtotal_before_tax(self):
    """Get subtotal after discount but before tax"""
    line_subtotal = self.quantity * self.unit_price
    return line_subtotal - self.discount_amount

@property
def subtotal_before_discount(self):
    """Get subtotal before any discounts"""
    return self.quantity * self.unit_price
```

### Invoice Summary Calculation
```python
# Invoice totals from line items
invoice.subtotal = sum(item.subtotal_before_discount for item in line_items)
invoice.total_discount = sum(item.discount_amount for item in line_items)
invoice.tax_amount = sum(item.tax_amount for item in line_items)
invoice.total = sum(item.line_total for item in line_items)
```

### Invoice Display
```
┌────────────────────────────────────────────────────────┐
│ Description   │ Qty │ Rate   │ Disc  │ Tax   │ Total  │
├───────────────┼─────┼────────┼───────┼───────┼────────┤
│ Laptop        │ 10  │ 5,000  │ 10%   │ 12%   │ 50,400 │
│ Mouse         │ 10  │ 1,500  │ -     │ 12%   │ 16,800 │
│ Service       │ 1   │ 50,000 │ -     │ 12%   │ 56,000 │
├───────────────┴─────┴────────┴───────┴───────┼────────┤
│                              SUBTOTAL        │123,200 │
│                          (After discounts)   │        │
└──────────────────────────────────────────────┴────────┘
```

### Recalculation Trigger
Line total should be recalculated when:
- Quantity changes
- Unit price changes
- Discount type/value changes
- Tax rate changes
- is_taxable changes

This will be handled by signals (Task 34) or service methods.

### Verification Checklist
- [ ] line_total DecimalField is added
- [ ] line_total has max_digits=15, decimal_places=2
- [ ] line_total default is Decimal('0.00')
- [ ] Help text explains calculation formula
- [ ] Comments document calculation order
- [ ] Property methods added for subtotals (optional)

---

## Task 28: Run InvoiceLineItem Migrations

### Overview
Generate and apply Django migrations for the complete InvoiceLineItem model with all fields from Tasks 19-27.

### Dependencies
- All previous tasks (19-27)
- Complete InvoiceLineItem model definition
- Invoice model migrations must be applied (Group A, Task 18)

### Instructions

1. **Verify InvoiceLineItem model is complete**
   - Open apps/invoices/models/invoice_line_item.py
   - Verify all fields from Tasks 19-27 are present
   - Check Meta class configuration
   - Ensure no syntax errors

2. **Update models __init__.py**
   - Open apps/invoices/models/__init__.py
   - Import InvoiceLineItem model
   - Example: `from .invoice_line_item import InvoiceLineItem`
   - Ensure Invoice is also imported

3. **Generate migrations**
   - Open terminal in Django project root
   - Activate virtual environment if needed
   - Run: `python manage.py makemigrations invoices`
   - Review generated migration file

4. **Review migration file**
   - Navigate to apps/invoices/migrations/
   - Open the generated migration (likely 0002_invoicelineitem.py)
   - Verify all fields are included
   - Check foreign key relationships
   - Verify default values use Decimal

5. **Check for migration warnings**
   - Review makemigrations output for warnings
   - Ensure FK to Invoice is correctly defined
   - Verify FK to Product and ProductVariant
   - Check decimal field defaults

6. **Apply migrations**
   - Run: `python manage.py migrate invoices`
   - Migrations will create invoice_line_items table
   - Foreign key constraints will be added

7. **Verify database schema**
   - Connect to database
   - Check invoice_line_items table exists
   - Verify all columns present
   - Check foreign key constraints
   - Verify indexes on FK fields

8. **Test model in Django shell**
   - Run: `python manage.py shell`
   - Import models
   - Create test instances
   - Verify relationships work

### Migration Commands
```bash
# Generate migrations
python manage.py makemigrations invoices

# Expected output:
# Migrations for 'invoices':
#   apps/invoices/migrations/0002_invoicelineitem.py
#     - Create model InvoiceLineItem

# Apply migrations
python manage.py migrate invoices

# Expected output:
# Running migrations:
#   Applying invoices.0002_invoicelineitem... OK

# Check migration status
python manage.py showmigrations invoices

# Expected output:
# invoices
#  [X] 0001_initial
#  [X] 0002_invoicelineitem
```

### Migration File Structure
```python
# apps/invoices/migrations/0002_invoicelineitem.py
from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):
    dependencies = [
        ('invoices', '0001_initial'),
        ('products', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='InvoiceLineItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('position', models.PositiveIntegerField(default=0)),
                ('description', models.TextField()),
                ('sku', models.CharField(max_length=100, blank=True, null=True)),
                ('quantity', models.DecimalField(max_digits=10, decimal_places=3, default=Decimal('1.000'))),
                # ... all other fields ...
                ('invoice', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='line_items',
                    to='invoices.invoice'
                )),
                ('product', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='invoice_line_items',
                    to='products.product'
                )),
                # ... other FKs ...
            ],
            options={
                'db_table': 'invoice_line_items',
                'verbose_name': 'Invoice Line Item',
                'verbose_name_plural': 'Invoice Line Items',
                'ordering': ['position'],
            },
        ),
    ]
```

### Test in Django Shell
```python
# Start shell
python manage.py shell

# Import models
from apps.invoices.models import Invoice, InvoiceLineItem
from apps.products.models import Product
from decimal import Decimal

# Get or create test invoice
invoice = Invoice.objects.first()

# Create line item
line = InvoiceLineItem.objects.create(
    invoice=invoice,
    position=1,
    description="Test Product",
    quantity=Decimal('10.000'),
    unit_price=Decimal('5000.00'),
    tax_rate=Decimal('12.00'),
    is_taxable=True
)

# Check defaults
print(line.quantity)  # 10.000
print(line.unit_of_measure)  # pcs
print(line.discount_type)  # NONE
print(line.line_total)  # 0.00 (will be calculated)

# Test relationship
print(invoice.line_items.all())  # QuerySet with line items
print(line.invoice)  # Invoice instance

# Calculate line total (will be done by service)
line_subtotal = line.quantity * line.unit_price
print(line_subtotal)  # 50000.00
```

### Relationship Testing
```python
# Test cascade delete
invoice = Invoice.objects.create(...)
line1 = InvoiceLineItem.objects.create(invoice=invoice, ...)
line2 = InvoiceLineItem.objects.create(invoice=invoice, ...)

print(invoice.line_items.count())  # 2

# Delete invoice
invoice.delete()

# Line items automatically deleted
print(InvoiceLineItem.objects.filter(id__in=[line1.id, line2.id]).count())  # 0
```

### Multi-Tenant Considerations
- If invoices in TENANT_APPS, line_items are too
- Migrations apply to all tenant schemas
- Test on a test tenant first
- Verify tenant middleware properly routes queries

### Database Indexes
The following are automatically indexed:
- id (primary key)
- invoice_id (foreign key)
- product_id (foreign key)
- variant_id (foreign key)

### Rollback Plan
```bash
# If migration fails, rollback
python manage.py migrate invoices 0001_initial

# This removes invoice_line_items table
# Use cautiously
```

### Verification Checklist
- [ ] InvoiceLineItem model is complete with all fields
- [ ] models/__init__.py imports InvoiceLineItem
- [ ] makemigrations runs without errors
- [ ] Migration file 0002_invoicelineitem.py is created
- [ ] All fields present in migration
- [ ] Foreign keys correctly defined
- [ ] migrate command runs successfully
- [ ] Database table 'invoice_line_items' exists
- [ ] All columns exist in database
- [ ] Foreign key constraints work
- [ ] Test instance can be created in shell
- [ ] Relationship to Invoice works (line_items)
- [ ] Cascade delete works

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Add Line Item Tax Fields | Tax rate, amount, taxability, tax code |
| 26 | Add Line Item HSN/SAC Code | HSN/SAC classification fields |
| 27 | Add Line Item Total Field | Calculated line_total field |
| 28 | Run InvoiceLineItem Migrations | Applied database schema |

### Complete InvoiceLineItem Model (Tasks 19-28)
```python
InvoiceLineItem Model - Complete Structure:
├── Core Fields (Task 19)
│   ├── id, invoice (FK), position
│   └── created_at, updated_at
├── Product Reference (Task 20)
│   ├── product (FK), variant (FK)
│   └── product_snapshot (JSON)
├── Description (Task 21)
│   ├── description
│   └── sku
├── Quantity (Task 22)
│   ├── quantity
│   └── unit_of_measure
├── Pricing (Task 23)
│   ├── unit_price
│   └── original_price
├── Discount (Task 24)
│   ├── discount_type, discount_value
│   └── discount_amount
├── Tax (Task 25)
│   ├── tax_rate, tax_amount
│   ├── is_taxable, tax_code
│   └── tax_description
├── HSN/SAC (Task 26)
│   ├── hsn_code
│   └── hsn_description
└── Line Total (Task 27)
    └── line_total
```

### Calculation Flow
```
Input Fields:
├── quantity
├── unit_price
├── discount_type, discount_value
├── tax_rate, is_taxable
      │
      ▼
Calculated Fields:
├── discount_amount = f(quantity, unit_price, discount_type, discount_value)
├── tax_amount = f(taxable_amount, tax_rate, is_taxable)
└── line_total = taxable_amount + tax_amount
```

### Migrations Applied
```
apps/invoices/migrations/
├── 0001_initial.py            (Group A)
│   └── Invoice model
└── 0002_invoicelineitem.py    (Task 28)
    └── InvoiceLineItem model
```

### Next Steps
Proceed to [03_Tasks-29-34_Calculation-Services.md](03_Tasks-29-34_Calculation-Services.md) to implement:
- Invoice calculation service
- VAT calculation logic
- SVAT calculation logic
- Tax breakdown generator
- Header discount applicator
- Auto-recalculation signals

---

## Notes for AI Agents

1. **Migrations Applied**: InvoiceLineItem table now exists in database
2. **Cascade Delete**: Line items deleted when invoice deleted
3. **Tax Calculation**: Applied after discounts on taxable amount
4. **HSN/SAC**: Optional but recommended for compliance
5. **Line Total**: Auto-calculated, not manually entered
6. **Testing**: Test model creation and relationships before proceeding
