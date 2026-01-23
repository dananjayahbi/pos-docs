# Tasks 29-34: Calculation Services & Signals

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** B - Invoice Line Items & Tax Calculation  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-28_Tax-HSN-Total-Migration.md](02_Tasks-25-28_Tax-HSN-Total-Migration.md)
- **→ Next Group:** [../Group-C_Invoice-Generation-Services/](../Group-C_Invoice-Generation-Services/)

---

## Document Overview

This document covers the implementation of calculation services for invoices including VAT and SVAT calculations, tax breakdown generation, header discount application, and automatic recalculation signals.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create Invoice Calculation Service | High |
| 30 | Implement VAT Calculation | Medium |
| 31 | Implement SVAT Calculation | Medium |
| 32 | Implement Tax Breakdown Generator | Medium |
| 33 | Implement Header Discount Applicator | Medium |
| 34 | Create Invoice Recalculation Signal | Medium |

---

## Task 29: Create Invoice Calculation Service

### Overview
Create a comprehensive service class for calculating all invoice financial fields including line item calculations, invoice totals, discounts, and taxes.

### Dependencies
- Task 28: InvoiceLineItem migrations applied
- All invoice and line item models complete

### Instructions

1. **Create calculation_service.py in services directory**
   - Navigate to apps/invoices/services/
   - Create file named `calculation_service.py`
   - This will contain all calculation logic

2. **Import required modules**
   - Import Decimal from decimal module
   - Import Invoice and InvoiceLineItem models
   - Import database transaction support
   - Import logging for error tracking

3. **Create InvoiceCalculationService class**
   - Create class for encapsulating all calculations
   - Use class methods for stateless operations
   - Ensure calculations are idempotent

4. **Implement calculate_line_item method**
   - Calculate single line item totals
   - Calculate discount_amount
   - Calculate tax_amount
   - Calculate line_total
   - Update line item fields

5. **Implement calculate_all_line_items method**
   - Iterate through all invoice line items
   - Calculate each line item
   - Save updates to database

6. **Implement calculate_invoice_totals method**
   - Sum all line_item.subtotal_before_discount → invoice.subtotal
   - Sum all line_item.discount_amount → line_items_discount
   - Apply header discount if exists
   - Calculate tax_breakdown
   - Calculate invoice.total
   - Update invoice.balance_due

7. **Implement recalculate_invoice method**
   - Main entry point for full recalculation
   - Calculate all line items first
   - Then calculate invoice totals
   - Use transaction for atomicity

### Service Structure
```python
from decimal import Decimal
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class InvoiceCalculationService:
    """
    Service for calculating invoice and line item totals.
    Handles discounts, taxes, and Sri Lanka VAT/SVAT calculations.
    """
    
    @classmethod
    def calculate_line_item(cls, line_item):
        """
        Calculate a single line item's discount, tax, and total.
        
        Args:
            line_item: InvoiceLineItem instance
            
        Returns:
            Updated line_item instance
        """
        # Step 1: Calculate line subtotal
        line_subtotal = line_item.quantity * line_item.unit_price
        
        # Step 2: Calculate line discount
        if line_item.discount_type == 'PERCENTAGE':
            line_item.discount_amount = line_subtotal * (line_item.discount_value / 100)
        elif line_item.discount_type == 'FIXED':
            line_item.discount_amount = line_item.discount_value
        else:
            line_item.discount_amount = Decimal('0.00')
        
        # Step 3: Calculate taxable amount
        taxable_amount = line_subtotal - line_item.discount_amount
        
        # Step 4: Calculate tax
        if line_item.is_taxable and line_item.tax_rate > 0:
            line_item.tax_amount = taxable_amount * (line_item.tax_rate / 100)
        else:
            line_item.tax_amount = Decimal('0.00')
        
        # Step 5: Calculate line total
        line_item.line_total = taxable_amount + line_item.tax_amount
        
        return line_item
    
    @classmethod
    @transaction.atomic
    def calculate_all_line_items(cls, invoice):
        """
        Calculate all line items for an invoice.
        
        Args:
            invoice: Invoice instance
        """
        line_items = invoice.line_items.all()
        
        for line_item in line_items:
            cls.calculate_line_item(line_item)
            line_item.save(update_fields=[
                'discount_amount',
                'tax_amount',
                'line_total'
            ])
    
    @classmethod
    def calculate_invoice_totals(cls, invoice):
        """
        Calculate invoice-level totals from line items.
        
        Args:
            invoice: Invoice instance
            
        Returns:
            Updated invoice instance
        """
        line_items = invoice.line_items.all()
        
        # Calculate subtotal (sum of line subtotals before any discounts)
        invoice.subtotal = sum(
            (item.quantity * item.unit_price)
            for item in line_items
        )
        
        # Sum line item discounts
        line_items_discount = sum(
            item.discount_amount
            for item in line_items
        )
        
        # Calculate subtotal after line discounts
        subtotal_after_line_discounts = invoice.subtotal - line_items_discount
        
        # Apply header-level discount
        if invoice.discount_type == 'PERCENTAGE':
            invoice.discount_amount = subtotal_after_line_discounts * (
                invoice.discount_value / 100
            )
        elif invoice.discount_type == 'FIXED':
            invoice.discount_amount = invoice.discount_value
        else:
            invoice.discount_amount = Decimal('0.00')
        
        # Calculate total tax
        invoice.tax_amount = sum(
            item.tax_amount
            for item in line_items
        )
        
        # Calculate final total
        invoice.total = (
            subtotal_after_line_discounts
            - invoice.discount_amount
            + invoice.tax_amount
        )
        
        # Update balance
        invoice.balance_due = invoice.total - invoice.amount_paid
        
        return invoice
    
    @classmethod
    @transaction.atomic
    def recalculate_invoice(cls, invoice_id):
        """
        Fully recalculate an invoice including all line items and totals.
        
        Args:
            invoice_id: Invoice UUID
            
        Returns:
            Updated Invoice instance
        """
        try:
            invoice = Invoice.objects.select_related().get(id=invoice_id)
            
            # Calculate all line items first
            cls.calculate_all_line_items(invoice)
            
            # Calculate invoice totals
            cls.calculate_invoice_totals(invoice)
            
            # Save invoice
            invoice.save(update_fields=[
                'subtotal',
                'discount_amount',
                'tax_amount',
                'total',
                'balance_due'
            ])
            
            logger.info(f"Invoice {invoice.invoice_number} recalculated successfully")
            
            return invoice
            
        except Invoice.DoesNotExist:
            logger.error(f"Invoice {invoice_id} not found")
            raise
```

### Calculation Flow Diagram
```
recalculate_invoice()
        │
        ├──> calculate_all_line_items()
        │         │
        │         ├──> For each line item:
        │         │         │
        │         │         ├─ Calculate line subtotal
        │         │         ├─ Apply line discount
        │         │         ├─ Calculate taxable amount
        │         │         ├─ Calculate tax
        │         │         └─ Calculate line total
        │         │
        │         └──> Save all line items
        │
        └──> calculate_invoice_totals()
                  │
                  ├─ Sum line subtotals → invoice.subtotal
                  ├─ Apply header discount
                  ├─ Sum line taxes → invoice.tax_amount
                  ├─ Calculate final total
                  └─ Update balance_due
```

### Usage Examples
```python
from apps.invoices.services.calculation_service import InvoiceCalculationService

# Recalculate entire invoice
invoice = InvoiceCalculationService.recalculate_invoice(invoice_id)

# Calculate single line item
line_item = invoice.line_items.first()
InvoiceCalculationService.calculate_line_item(line_item)
line_item.save()

# Recalculate after adding line item
line_item = InvoiceLineItem.objects.create(...)
InvoiceCalculationService.recalculate_invoice(invoice.id)
```

### Verification Checklist
- [ ] calculation_service.py created in services/
- [ ] InvoiceCalculationService class defined
- [ ] calculate_line_item method implemented
- [ ] calculate_all_line_items method implemented
- [ ] calculate_invoice_totals method implemented
- [ ] recalculate_invoice method implemented
- [ ] @transaction.atomic used for data consistency
- [ ] Error handling and logging included
- [ ] Methods are class methods (stateless)

---

## Task 30: Implement VAT Calculation

### Overview
Implement standard VAT (Value Added Tax) calculation at the current Sri Lankan rate of 12%, with support for different tax rates per line item.

### Dependencies
- Task 29: Create Invoice Calculation Service

### Instructions

1. **Open calculation_service.py**
   - Navigate to apps/invoices/services/calculation_service.py
   - Add VAT-specific calculation methods

2. **Create apply_vat_to_line_item method**
   - Set standard VAT rate (12%)
   - Apply to taxable line items
   - Skip tax-exempt items
   - Calculate VAT amount

3. **Create apply_vat_to_invoice method**
   - Apply VAT to all taxable line items
   - Respect line item tax settings
   - Support multiple VAT rates if needed

4. **Add VAT rate constants**
   - Define STANDARD_VAT_RATE = 12.00
   - Allow override from settings
   - Support rate changes over time

### VAT Calculation Implementation
```python
class InvoiceCalculationService:
    # VAT Rate Constants
    STANDARD_VAT_RATE = Decimal('12.00')  # Sri Lanka standard VAT
    
    @classmethod
    def apply_vat_to_line_item(cls, line_item, vat_rate=None):
        """
        Apply VAT to a line item.
        
        Args:
            line_item: InvoiceLineItem instance
            vat_rate: Optional VAT rate (defaults to STANDARD_VAT_RATE)
            
        Returns:
            Updated line_item with VAT applied
        """
        if vat_rate is None:
            vat_rate = cls.STANDARD_VAT_RATE
        
        # Set line item tax details
        line_item.is_taxable = True
        line_item.tax_rate = vat_rate
        line_item.tax_code = 'STANDARD_RATE'
        line_item.tax_description = f'VAT {vat_rate}%'
        
        # Calculate line item (includes tax calculation)
        return cls.calculate_line_item(line_item)
    
    @classmethod
    def apply_vat_to_invoice(cls, invoice, vat_rate=None):
        """
        Apply standard VAT to all taxable line items on an invoice.
        
        Args:
            invoice: Invoice instance
            vat_rate: Optional VAT rate (defaults to STANDARD_VAT_RATE)
        """
        if vat_rate is None:
            vat_rate = cls.STANDARD_VAT_RATE
        
        line_items = invoice.line_items.all()
        
        for line_item in line_items:
            # Apply VAT if item is taxable
            if line_item.is_taxable:
                cls.apply_vat_to_line_item(line_item, vat_rate)
                line_item.save()
        
        # Recalculate invoice totals
        cls.recalculate_invoice(invoice.id)
```

### Sri Lanka VAT Rates

| Rate | Description | When Used |
|------|-------------|-----------|
| 12% | Standard Rate | Most goods and services |
| 0% | Zero-Rated | Exports, specified essentials |
| Exempt | No VAT | Education, healthcare, specific items |

### VAT Calculation Examples

**Standard VAT (12%):**
```python
line_item.quantity = 10
line_item.unit_price = 5000
line_item.is_taxable = True

InvoiceCalculationService.apply_vat_to_line_item(line_item)

# Result:
# line_subtotal = 50,000
# tax_rate = 12.00
# tax_amount = 50,000 × 0.12 = 6,000
# line_total = 56,000
```

**Zero-Rated (Exports):**
```python
line_item.is_taxable = True
line_item.tax_rate = Decimal('0.00')
line_item.tax_code = 'ZERO_RATED'

InvoiceCalculationService.calculate_line_item(line_item)

# Result:
# tax_amount = 0 (zero-rated, not exempt)
# Still recorded as taxable for compliance
```

**Tax-Exempt:**
```python
line_item.is_taxable = False
line_item.tax_code = 'EXEMPT'

InvoiceCalculationService.calculate_line_item(line_item)

# Result:
# tax_amount = 0 (exempt from VAT)
```

### Mixed VAT Rates Invoice
```python
# Line 1: Standard VAT 12%
line1 = InvoiceLineItem(...)
InvoiceCalculationService.apply_vat_to_line_item(line1, Decimal('12.00'))

# Line 2: Zero-rated (export)
line2 = InvoiceLineItem(...)
line2.is_taxable = True
line2.tax_rate = Decimal('0.00')
line2.tax_code = 'ZERO_RATED'
InvoiceCalculationService.calculate_line_item(line2)

# Line 3: Exempt (books)
line3 = InvoiceLineItem(...)
line3.is_taxable = False
line3.tax_code = 'EXEMPT'
InvoiceCalculationService.calculate_line_item(line3)

# Recalculate invoice
InvoiceCalculationService.recalculate_invoice(invoice.id)
```

### VAT Compliance
- VAT registration number must be on invoice
- Invoice must show VAT breakdown
- Separate display for different rates
- Maintain records for 5 years
- File VAT returns quarterly/monthly

### Verification Checklist
- [ ] STANDARD_VAT_RATE constant defined
- [ ] apply_vat_to_line_item method implemented
- [ ] apply_vat_to_invoice method implemented
- [ ] VAT rate is parameterized (not hard-coded)
- [ ] Supports multiple VAT rates per invoice
- [ ] Zero-rated items handled correctly
- [ ] Tax-exempt items handled correctly

---

## Task 31: Implement SVAT Calculation

### Overview
Implement Simplified VAT (SVAT) calculation for eligible small businesses in Sri Lanka, with different documentation and calculation requirements.

### Dependencies
- Task 30: Implement VAT Calculation

### Instructions

1. **Open calculation_service.py**
   - Add SVAT-specific calculation methods
   - Document SVAT eligibility requirements

2. **Create apply_svat_to_line_item method**
   - SVAT typically applies lower rate or zero rate
   - Simplified documentation requirements
   - Different invoice format requirements

3. **Create apply_svat_to_invoice method**
   - Apply SVAT to all line items
   - Set invoice type to SVAT
   - Ensure SVAT number is present

4. **Add SVAT eligibility check**
   - Check if business qualifies for SVAT
   - Verify SVAT registration
   - Validate against turnover limits

### SVAT Implementation
```python
class InvoiceCalculationService:
    # SVAT Configuration
    SVAT_RATE = Decimal('0.00')  # Often zero-rated for SVAT eligible
    SVAT_TURNOVER_LIMIT = Decimal('12000000.00')  # LKR 12M annual turnover
    
    @classmethod
    def check_svat_eligibility(cls, invoice):
        """
        Check if invoice can use SVAT scheme.
        
        Args:
            invoice: Invoice instance
            
        Returns:
            bool: True if eligible for SVAT
        """
        # Check if tenant/business has SVAT registration
        if not invoice.svat_number:
            return False
        
        # Additional checks can include:
        # - Annual turnover below threshold
        # - Business type eligibility
        # - Valid SVAT registration status
        
        return True
    
    @classmethod
    def apply_svat_to_line_item(cls, line_item, svat_rate=None):
        """
        Apply SVAT to a line item.
        
        Args:
            line_item: InvoiceLineItem instance
            svat_rate: Optional SVAT rate (defaults to SVAT_RATE)
            
        Returns:
            Updated line_item with SVAT applied
        """
        if svat_rate is None:
            svat_rate = cls.SVAT_RATE
        
        # Set line item tax details for SVAT
        line_item.is_taxable = True  # Still taxable, but at SVAT rate
        line_item.tax_rate = svat_rate
        line_item.tax_code = 'SVAT'
        line_item.tax_description = f'Simplified VAT {svat_rate}%'
        
        # Calculate line item
        return cls.calculate_line_item(line_item)
    
    @classmethod
    def apply_svat_to_invoice(cls, invoice, svat_rate=None):
        """
        Apply SVAT to all line items and set invoice as SVAT type.
        
        Args:
            invoice: Invoice instance
            svat_rate: Optional SVAT rate
            
        Raises:
            ValueError: If business not eligible for SVAT
        """
        # Check eligibility
        if not cls.check_svat_eligibility(invoice):
            raise ValueError(
                "Business not eligible for SVAT. "
                "Check SVAT registration and turnover limits."
            )
        
        if svat_rate is None:
            svat_rate = cls.SVAT_RATE
        
        # Set invoice type to SVAT
        invoice.type = InvoiceType.SVAT
        invoice.tax_scheme = 'SVAT'
        invoice.save(update_fields=['type', 'tax_scheme'])
        
        # Apply SVAT to all line items
        line_items = invoice.line_items.all()
        for line_item in line_items:
            cls.apply_svat_to_line_item(line_item, svat_rate)
            line_item.save()
        
        # Recalculate invoice totals
        cls.recalculate_invoice(invoice.id)
```

### SVAT vs Standard VAT

| Feature | Standard VAT | SVAT |
|---------|--------------|------|
| Registration Threshold | > LKR 12M turnover | < LKR 12M turnover |
| Rate | 12% | Often 0% or reduced |
| Documentation | Full VAT invoice | Simplified invoice |
| Filing | Monthly/Quarterly detailed | Quarterly simplified |
| Input Tax Credit | Can claim | Limited/No claiming |
| Invoice Number Format | INV-{YEAR}-{SEQ} | SVAT-{YEAR}-{SEQ} |

### SVAT Eligibility Criteria
- Annual turnover below LKR 12 million
- Not engaged in certain excluded activities
- Valid SVAT registration from IRD
- Compliance with SVAT scheme requirements

### SVAT Invoice Example
```python
# Create SVAT invoice
invoice = Invoice.objects.create(
    type=InvoiceType.SVAT,
    svat_number='SVAT-123456789',
    tax_scheme='SVAT',
    ...
)

# Add line items
line1 = InvoiceLineItem.objects.create(
    invoice=invoice,
    description='Product A',
    quantity=10,
    unit_price=5000,
    ...
)

# Apply SVAT
InvoiceCalculationService.apply_svat_to_invoice(invoice)

# Result:
# All line items: tax_rate = 0%, tax_code = 'SVAT'
# Invoice type: SVAT
# Invoice number: SVAT-2026-00001
```

### SVAT Compliance Notes
- SVAT invoice must show SVAT registration number
- Simplified record-keeping requirements
- Quarterly filing instead of monthly
- No input tax credit claims (generally)
- Different invoice format requirements

### Verification Checklist
- [ ] SVAT_RATE constant defined
- [ ] SVAT_TURNOVER_LIMIT defined
- [ ] check_svat_eligibility method implemented
- [ ] apply_svat_to_line_item method implemented
- [ ] apply_svat_to_invoice method implemented
- [ ] Invoice type set to SVAT
- [ ] Eligibility validation included
- [ ] Error handling for ineligible businesses

---

## Task 32: Implement Tax Breakdown Generator

### Overview
Implement a service method to generate detailed tax breakdown by rate, showing taxable amounts and tax collected for each rate category.

### Dependencies
- Task 31: Implement SVAT Calculation

### Instructions

1. **Open calculation_service.py**
   - Add tax breakdown generation method
   - Group line items by tax rate

2. **Create generate_tax_breakdown method**
   - Group line items by tax_rate
   - Calculate taxable amount per rate
   - Calculate tax amount per rate
   - Generate JSON structure for invoice.tax_breakdown

3. **Format tax breakdown for display**
   - Create formatted summary
   - Support invoice footer display
   - Generate tax reporting data

### Tax Breakdown Implementation
```python
class InvoiceCalculationService:
    
    @classmethod
    def generate_tax_breakdown(cls, invoice):
        """
        Generate detailed tax breakdown by rate.
        
        Args:
            invoice: Invoice instance
            
        Returns:
            dict: Tax breakdown structure
        """
        line_items = invoice.line_items.all()
        
        # Group by tax rate
        rate_groups = {}
        
        for item in line_items:
            rate = float(item.tax_rate)
            
            if rate not in rate_groups:
                rate_groups[rate] = {
                    'rate': rate,
                    'taxable_amount': Decimal('0.00'),
                    'tax_amount': Decimal('0.00'),
                    'description': item.tax_description or f'Tax {rate}%',
                    'tax_code': item.tax_code or 'STANDARD_RATE'
                }
            
            # Calculate taxable amount for this line
            line_subtotal = item.quantity * item.unit_price
            taxable_amount = line_subtotal - item.discount_amount
            
            # Add to group totals
            rate_groups[rate]['taxable_amount'] += taxable_amount
            rate_groups[rate]['tax_amount'] += item.tax_amount
        
        # Convert to list and sort by rate
        rates = sorted(rate_groups.values(), key=lambda x: x['rate'], reverse=True)
        
        # Calculate totals
        total_taxable = sum(r['taxable_amount'] for r in rates)
        total_tax = sum(r['tax_amount'] for r in rates)
        
        # Build breakdown structure
        breakdown = {
            'rates': [
                {
                    'rate': float(r['rate']),
                    'taxable_amount': float(r['taxable_amount']),
                    'tax_amount': float(r['tax_amount']),
                    'description': r['description'],
                    'tax_code': r['tax_code']
                }
                for r in rates
            ],
            'total_taxable': float(total_taxable),
            'total_tax': float(total_tax)
        }
        
        # Update invoice
        invoice.tax_breakdown = breakdown
        invoice.save(update_fields=['tax_breakdown'])
        
        return breakdown
    
    @classmethod
    def format_tax_breakdown_for_display(cls, tax_breakdown):
        """
        Format tax breakdown for invoice display.
        
        Args:
            tax_breakdown: Tax breakdown dict from invoice
            
        Returns:
            str: Formatted text for invoice
        """
        if not tax_breakdown or not tax_breakdown.get('rates'):
            return ""
        
        lines = []
        lines.append("Tax Summary:")
        lines.append("-" * 50)
        
        for rate_info in tax_breakdown['rates']:
            rate = rate_info['rate']
            taxable = rate_info['taxable_amount']
            tax = rate_info['tax_amount']
            desc = rate_info.get('description', f'Tax {rate}%')
            
            lines.append(
                f"{desc:30} "
                f"Taxable: LKR {taxable:12,.2f}  "
                f"Tax: LKR {tax:10,.2f}"
            )
        
        lines.append("-" * 50)
        lines.append(
            f"{'Total Tax':30} "
            f"{'':24} "
            f"LKR {tax_breakdown['total_tax']:10,.2f}"
        )
        
        return "\n".join(lines)
```

### Tax Breakdown Examples

**Single Rate (12% VAT):**
```json
{
  "rates": [
    {
      "rate": 12.0,
      "taxable_amount": 100000.00,
      "tax_amount": 12000.00,
      "description": "VAT 12%",
      "tax_code": "STANDARD_RATE"
    }
  ],
  "total_taxable": 100000.00,
  "total_tax": 12000.00
}
```

**Multiple Rates:**
```json
{
  "rates": [
    {
      "rate": 12.0,
      "taxable_amount": 75000.00,
      "tax_amount": 9000.00,
      "description": "VAT 12%",
      "tax_code": "STANDARD_RATE"
    },
    {
      "rate": 0.0,
      "taxable_amount": 25000.00,
      "tax_amount": 0.00,
      "description": "Tax Exempt",
      "tax_code": "EXEMPT"
    }
  ],
  "total_taxable": 100000.00,
  "total_tax": 9000.00
}
```

### Invoice Display
```
┌────────────────────────────────────────────────────┐
│ Tax Summary:                                       │
│ ──────────────────────────────────────────────────│
│ VAT 12%        Taxable: LKR 75,000.00  Tax: 9,000 │
│ Tax Exempt     Taxable: LKR 25,000.00  Tax:     0 │
│ ──────────────────────────────────────────────────│
│ Total Tax                              LKR  9,000 │
└────────────────────────────────────────────────────┘
```

### Usage in Calculation
```python
# After calculating all line items
InvoiceCalculationService.calculate_all_line_items(invoice)
InvoiceCalculationService.generate_tax_breakdown(invoice)

# Access breakdown
breakdown = invoice.tax_breakdown
print(f"Total Tax: LKR {breakdown['total_tax']:,.2f}")

# Format for display
display_text = InvoiceCalculationService.format_tax_breakdown_for_display(
    invoice.tax_breakdown
)
print(display_text)
```

### Verification Checklist
- [ ] generate_tax_breakdown method implemented
- [ ] Groups line items by tax_rate
- [ ] Calculates taxable amount per rate
- [ ] Calculates tax amount per rate
- [ ] Generates proper JSON structure
- [ ] Updates invoice.tax_breakdown field
- [ ] format_tax_breakdown_for_display implemented
- [ ] Sorts rates in logical order

---

## Task 33: Implement Header Discount Applicator

### Overview
Implement service methods to apply invoice-level (header) discounts that apply to the entire invoice subtotal, after line-level discounts.

### Dependencies
- Task 32: Implement Tax Breakdown Generator

### Instructions

1. **Open calculation_service.py**
   - Add header discount application methods
   - Handle percentage and fixed discounts

2. **Create apply_header_discount method**
   - Calculate discount based on type
   - Apply to subtotal after line discounts
   - Update invoice.discount_amount

3. **Create remove_header_discount method**
   - Clear header-level discount
   - Recalculate invoice totals

4. **Integrate with recalculate_invoice**
   - Header discount already handled in calculate_invoice_totals
   - Ensure correct calculation order

### Header Discount Implementation
```python
class InvoiceCalculationService:
    
    @classmethod
    def apply_header_discount(cls, invoice, discount_type, discount_value):
        """
        Apply invoice-level (header) discount.
        
        Args:
            invoice: Invoice instance
            discount_type: 'PERCENTAGE', 'FIXED', or 'NONE'
            discount_value: Discount value (percentage or amount)
            
        Returns:
            Updated invoice instance
        """
        # Set discount fields
        invoice.discount_type = discount_type
        invoice.discount_value = discount_value
        
        # Save and recalculate
        invoice.save(update_fields=['discount_type', 'discount_value'])
        
        # Recalculate will apply the discount
        return cls.recalculate_invoice(invoice.id)
    
    @classmethod
    def remove_header_discount(cls, invoice):
        """
        Remove invoice-level discount.
        
        Args:
            invoice: Invoice instance
            
        Returns:
            Updated invoice instance
        """
        return cls.apply_header_discount(invoice, 'NONE', Decimal('0.00'))
    
    @classmethod
    def calculate_header_discount_amount(cls, subtotal_after_line_discounts, 
                                        discount_type, discount_value):
        """
        Calculate header discount amount.
        
        Args:
            subtotal_after_line_discounts: Subtotal after line-level discounts
            discount_type: Type of discount
            discount_value: Discount value
            
        Returns:
            Decimal: Calculated discount amount
        """
        if discount_type == 'PERCENTAGE':
            return subtotal_after_line_discounts * (discount_value / 100)
        elif discount_type == 'FIXED':
            return min(discount_value, subtotal_after_line_discounts)
        else:
            return Decimal('0.00')
```

### Discount Calculation Order
```
1. Calculate line subtotals (qty × price)
        │
        ▼
2. Apply line-level discounts
        │
        ▼
3. Sum to get subtotal_after_line_discounts
        │
        ▼
4. Apply header-level discount
        │
        ▼
5. Calculate taxes on discounted amount
        │
        ▼
6. Calculate final total
```

### Header Discount Examples

**Percentage Header Discount:**
```python
# Invoice with line items totaling 100,000
# Line discounts: 5,000
# Subtotal after line discounts: 95,000

InvoiceCalculationService.apply_header_discount(
    invoice,
    discount_type='PERCENTAGE',
    discount_value=Decimal('10.00')  # 10%
)

# Result:
# Header discount_amount = 95,000 × 0.10 = 9,500
# Subtotal after all discounts = 95,000 - 9,500 = 85,500
# Tax (12%) = 85,500 × 0.12 = 10,260
# Total = 85,500 + 10,260 = 95,760
```

**Fixed Header Discount:**
```python
InvoiceCalculationService.apply_header_discount(
    invoice,
    discount_type='FIXED',
    discount_value=Decimal('10000.00')  # Fixed LKR 10,000
)

# Result:
# Header discount_amount = 10,000
# Subtotal after all discounts = 95,000 - 10,000 = 85,000
# Tax (12%) = 85,000 × 0.12 = 10,200
# Total = 85,000 + 10,200 = 95,200
```

### Combined Discounts Example
```
Line Items:
  Item 1: 10 × 10,000 = 100,000
    Line discount (5%): -5,000
    Subtotal: 95,000
    
  Item 2: 5 × 10,000 = 50,000
    No line discount
    Subtotal: 50,000

Invoice Subtotal (before header discount): 145,000
Line Discounts Total: 5,000
Subtotal after line discounts: 145,000

Header Discount (10%): 14,500
Subtotal after all discounts: 130,500

Tax (12%): 15,660
Invoice Total: 146,160
```

### Invoice Display
```
┌────────────────────────────────────────────────────┐
│ Subtotal                           LKR 145,000.00  │
│ Line Discounts                     LKR  -5,000.00  │
│ ──────────────────────────────────────────────────│
│ Subtotal after line discounts      LKR 140,000.00  │
│ Header Discount (10%)              LKR -14,000.00  │
│ ──────────────────────────────────────────────────│
│ Taxable Amount                     LKR 126,000.00  │
│ VAT (12%)                          LKR  15,120.00  │
│ ══════════════════════════════════════════════════│
│ TOTAL                              LKR 141,120.00  │
└────────────────────────────────────────────────────┘
```

### Verification Checklist
- [ ] apply_header_discount method implemented
- [ ] remove_header_discount method implemented
- [ ] calculate_header_discount_amount method implemented
- [ ] Percentage discount calculated correctly
- [ ] Fixed discount calculated correctly
- [ ] Header discount applied after line discounts
- [ ] Tax calculated on discounted amount
- [ ] Integration with recalculate_invoice works

---

## Task 34: Create Invoice Recalculation Signal

### Overview
Implement Django signals to automatically trigger invoice recalculation when line items are added, modified, or deleted.

### Dependencies
- Task 33: Implement Header Discount Applicator
- Complete InvoiceCalculationService

### Instructions

1. **Create signals.py in invoices app**
   - Navigate to apps/invoices/
   - Create file named `signals.py`
   - Import Django signals

2. **Create post_save signal for InvoiceLineItem**
   - Trigger recalculation when line item saved
   - Use InvoiceCalculationService.recalculate_invoice
   - Handle bulk operations efficiently

3. **Create post_delete signal for InvoiceLineItem**
   - Trigger recalculation when line item deleted
   - Ensure invoice totals updated

4. **Add signal registration in apps.py**
   - Register signals in InvoicesConfig.ready() method
   - Ensure signals only registered once

5. **Add flag to prevent infinite recursion**
   - Use context variable to prevent recursive recalculation
   - Handle bulk updates efficiently

### Signals Implementation
```python
# apps/invoices/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.invoices.models import InvoiceLineItem
from apps.invoices.services.calculation_service import InvoiceCalculationService
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=InvoiceLineItem)
def recalculate_invoice_on_line_save(sender, instance, created, **kwargs):
    """
    Automatically recalculate invoice when line item is saved.
    
    Args:
        sender: InvoiceLineItem model class
        instance: InvoiceLineItem instance
        created: True if new instance
        **kwargs: Additional arguments
    """
    # Skip if this is part of a recalculation (prevent recursion)
    if kwargs.get('update_fields') and 'line_total' in kwargs.get('update_fields'):
        return
    
    try:
        invoice_id = instance.invoice_id
        logger.info(
            f"Line item {'created' if created else 'updated'}, "
            f"recalculating invoice {invoice_id}"
        )
        InvoiceCalculationService.recalculate_invoice(invoice_id)
    except Exception as e:
        logger.error(f"Error recalculating invoice: {e}")

@receiver(post_delete, sender=InvoiceLineItem)
def recalculate_invoice_on_line_delete(sender, instance, **kwargs):
    """
    Automatically recalculate invoice when line item is deleted.
    
    Args:
        sender: InvoiceLineItem model class
        instance: InvoiceLineItem instance
        **kwargs: Additional arguments
    """
    try:
        invoice_id = instance.invoice_id
        logger.info(f"Line item deleted, recalculating invoice {invoice_id}")
        InvoiceCalculationService.recalculate_invoice(invoice_id)
    except Exception as e:
        logger.error(f"Error recalculating invoice after delete: {e}")
```

### App Configuration
```python
# apps/invoices/apps.py
from django.apps import AppConfig

class InvoicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.invoices'
    verbose_name = 'Invoices'
    
    def ready(self):
        """Import signals when app is ready"""
        import apps.invoices.signals  # noqa
```

### Signal Flow
```
Line Item Added/Updated/Deleted
        │
        ▼
Signal Triggered
        │
        ├──> post_save or post_delete
        │
        ▼
InvoiceCalculationService.recalculate_invoice()
        │
        ├──> Calculate all line items
        ├──> Calculate invoice totals
        ├──> Generate tax breakdown
        └──> Save invoice
```

### Usage Examples

**Automatic Recalculation on Create:**
```python
# Create line item
line = InvoiceLineItem.objects.create(
    invoice=invoice,
    description="Product A",
    quantity=10,
    unit_price=5000,
    tax_rate=12
)

# Signal automatically triggers recalculation
# No need to manually call recalculate_invoice()

# Invoice totals are updated automatically
invoice.refresh_from_db()
print(invoice.total)  # Updated total
```

**Automatic Recalculation on Update:**
```python
# Update line item quantity
line.quantity = 20
line.save()

# Signal triggers recalculation
# Invoice totals updated automatically
```

**Automatic Recalculation on Delete:**
```python
# Delete line item
line.delete()

# Signal triggers recalculation
# Invoice totals updated to reflect removed item
```

### Preventing Infinite Recursion
```python
# In recalculation, save line items with update_fields
line_item.save(update_fields=['line_total', 'tax_amount'])

# Signal checks update_fields and skips if recalculation field present
if 'line_total' in kwargs.get('update_fields', []):
    return  # Skip recalculation to prevent recursion
```

### Bulk Operations
For bulk operations, temporarily disable signals:
```python
from django.db.models.signals import post_save
from apps.invoices.signals import recalculate_invoice_on_line_save

# Disable signal
post_save.disconnect(recalculate_invoice_on_line_save, sender=InvoiceLineItem)

# Perform bulk operation
InvoiceLineItem.objects.bulk_create([...])

# Re-enable signal
post_save.connect(recalculate_invoice_on_line_save, sender=InvoiceLineItem)

# Manually recalculate once
InvoiceCalculationService.recalculate_invoice(invoice.id)
```

### Verification Checklist
- [ ] signals.py created in invoices app
- [ ] post_save signal for InvoiceLineItem implemented
- [ ] post_delete signal for InvoiceLineItem implemented
- [ ] Signals registered in apps.py ready() method
- [ ] Recursion prevention implemented
- [ ] Error handling and logging included
- [ ] Tested with create, update, delete operations
- [ ] Bulk operation handling documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create Invoice Calculation Service | Complete calculation service class |
| 30 | Implement VAT Calculation | 12% standard VAT calculation |
| 31 | Implement SVAT Calculation | Simplified VAT for small businesses |
| 32 | Implement Tax Breakdown Generator | Tax breakdown by rate |
| 33 | Implement Header Discount Applicator | Invoice-level discount handling |
| 34 | Create Invoice Recalculation Signal | Automatic recalculation on changes |

### Complete Calculation Service
```
InvoiceCalculationService:
├── calculate_line_item()
├── calculate_all_line_items()
├── calculate_invoice_totals()
├── recalculate_invoice()
├── apply_vat_to_line_item()
├── apply_vat_to_invoice()
├── apply_svat_to_line_item()
├── apply_svat_to_invoice()
├── check_svat_eligibility()
├── generate_tax_breakdown()
├── format_tax_breakdown_for_display()
├── apply_header_discount()
├── remove_header_discount()
└── calculate_header_discount_amount()
```

### Calculation Flow
```
Line Item Change
       │
       ▼
Signal Triggered
       │
       ▼
recalculate_invoice()
       │
       ├──> calculate_all_line_items()
       │         ├─ Line subtotal
       │         ├─ Line discount
       │         ├─ Tax calculation (VAT/SVAT)
       │         └─ Line total
       │
       ├──> calculate_invoice_totals()
       │         ├─ Sum line subtotals
       │         ├─ Apply header discount
       │         ├─ Sum line taxes
       │         └─ Calculate final total
       │
       └──> generate_tax_breakdown()
                 └─ Group by tax rate
```

### Group B Complete ✓
All 34 tasks in Groups A and B are now complete:
- ✓ Invoice model with all fields (Group A)
- ✓ InvoiceLineItem model with all fields (Tasks 19-28)
- ✓ Comprehensive calculation service (Task 29)
- ✓ VAT and SVAT calculation (Tasks 30-31)
- ✓ Tax breakdown generation (Task 32)
- ✓ Header discount handling (Task 33)
- ✓ Automatic recalculation signals (Task 34)

### Next Steps
Proceed to [../Group-C_Invoice-Generation-Services/](../Group-C_Invoice-Generation-Services/) to implement:
- InvoiceService for invoice lifecycle management
- Invoice generation from orders
- Status transition methods (issue, send, mark_paid, etc.)
- Overdue detection and aging
- Invoice history tracking
- Invoice settings and configuration

---

## Notes for AI Agents

1. **Calculation Service**: Central point for all invoice calculations
2. **VAT Rate**: Currently 12% in Sri Lanka, but parameterized for changes
3. **SVAT**: For small businesses with turnover < LKR 12M
4. **Tax Breakdown**: Stored as JSON in invoice.tax_breakdown
5. **Signals**: Auto-recalculate on line item changes
6. **Recursion**: Prevented by checking update_fields
7. **Testing**: Test calculations with various scenarios before proceeding
