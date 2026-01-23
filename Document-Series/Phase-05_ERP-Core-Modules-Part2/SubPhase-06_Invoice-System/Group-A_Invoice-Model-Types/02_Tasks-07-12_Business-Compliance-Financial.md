# Tasks 07-12: Business, Compliance & Financial Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** A - Invoice Model & Types  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_Metadata-Currency-Number-Migration.md](03_Tasks-13-18_Metadata-Currency-Number-Migration.md)

---

## Document Overview

This document covers adding business information, Sri Lanka compliance fields, date tracking, financial calculation fields, tax breakdown structure, and reference fields to the Invoice model.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 07 | Add Invoice Business Fields | Medium |
| 08 | Add Invoice Compliance Fields | Medium |
| 09 | Add Invoice Date Fields | Medium |
| 10 | Add Invoice Financial Fields | Medium |
| 11 | Add Invoice Tax Breakdown Fields | Medium |
| 12 | Add Invoice Reference Fields | Medium |

---

## Task 07: Add Invoice Business Fields

### Overview
Add fields to store the seller's business information on the invoice. These fields capture a snapshot of the business details at the time of invoice creation for historical accuracy.

### Dependencies
- Task 06: Add Invoice Customer Fields
- Business/Company model or settings must exist

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Locate the Invoice model class
   - Add new fields after customer fields

2. **Add business_name field**
   - Use CharField with max_length=255
   - Purpose: Legal business name appearing on invoice
   - Set blank=False to ensure always populated
   - Add help_text: "Business name at time of invoice"

3. **Add business_address field**
   - Use TextField
   - Purpose: Complete business address for invoice header
   - Set blank=True, null=True (may be configured later)
   - Add help_text: "Business address at time of invoice"

4. **Add business_phone field**
   - Use CharField with max_length=20
   - Purpose: Business contact phone number
   - Set blank=True, null=True
   - Add help_text: "Business phone at time of invoice"

5. **Add business_email field**
   - Use EmailField with max_length=255
   - Purpose: Business contact email
   - Set blank=True, null=True
   - Add help_text: "Business email at time of invoice"

6. **Add business_website field**
   - Use URLField with max_length=255
   - Purpose: Company website URL for footer
   - Set blank=True, null=True
   - Add help_text: "Business website URL"

### Business Fields Structure
```python
# Business/Seller Information (Snapshot)
business_name = models.CharField(
    max_length=255,
    help_text="Business name at time of invoice"
)
business_address = models.TextField(
    blank=True,
    null=True,
    help_text="Business address at time of invoice"
)
business_phone = models.CharField(
    max_length=20,
    blank=True,
    null=True,
    help_text="Business phone at time of invoice"
)
business_email = models.EmailField(
    max_length=255,
    blank=True,
    null=True,
    help_text="Business email at time of invoice"
)
business_website = models.URLField(
    max_length=255,
    blank=True,
    null=True,
    help_text="Business website URL"
)
```

### Data Source
Business information typically comes from:
- Tenant settings/configuration
- Company profile model
- Invoice settings model
- Should be populated automatically on invoice creation

### Invoice Header Usage
```
┌─────────────────────────────────┐
│ [Logo]  ABC Trading Ltd         │ ← business_name
│         123 Main Street         │ ← business_address
│         Colombo, Sri Lanka      │
│         Tel: +94 11 123 4567    │ ← business_phone
│         info@abctrading.lk      │ ← business_email
│         www.abctrading.lk       │ ← business_website
├─────────────────────────────────┤
│ INVOICE #INV-2026-00001         │
└─────────────────────────────────┘
```

### Verification Checklist
- [ ] business_name field is added
- [ ] business_address field is added
- [ ] business_phone field is added
- [ ] business_email field is added
- [ ] business_website field is added
- [ ] All fields have appropriate help_text
- [ ] Fields are marked as snapshots in help_text

---

## Task 08: Add Invoice Compliance Fields

### Overview
Add Sri Lanka-specific compliance fields required for VAT invoices, including Business Registration Number (BRN), VAT registration number, and SVAT registration number.

### Dependencies
- Task 07: Add Invoice Business Fields

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add new compliance fields after business fields

2. **Add business_registration_number (BRN) field**
   - Use CharField with max_length=50
   - Purpose: Company BRN from Department of Registrar of Companies
   - Set blank=True, null=True (not all businesses have BRN)
   - Add help_text: "Business Registration Number (BRN)"
   - Also known as company registration number

3. **Add vat_registration_number field**
   - Use CharField with max_length=50
   - Purpose: VAT registration number from IRD
   - Set blank=True, null=True (only for VAT-registered businesses)
   - Add help_text: "VAT Registration Number"
   - Required for STANDARD invoices

4. **Add svat_number field**
   - Use CharField with max_length=50
   - Purpose: Simplified VAT registration number
   - Set blank=True, null=True (only for SVAT-eligible businesses)
   - Add help_text: "Simplified VAT Registration Number"
   - Used when type=SVAT

5. **Add tax_scheme field**
   - Use CharField with max_length=50
   - Choices: VAT, SVAT, EXEMPT, NONE
   - Default: 'VAT'
   - Add help_text: "Tax scheme applicable for this invoice"

### Sri Lanka Compliance Requirements

| Field | Required For | Format | Purpose |
|-------|-------------|--------|---------|
| BRN | All companies | XXX-XXXXXXX | Company identification |
| VAT Number | VAT-registered | XXX-XXXXXXXX | VAT compliance |
| SVAT Number | SVAT-eligible | XXX-XXXXXXXX | Simplified VAT |

### Compliance Fields Structure
```python
# Sri Lanka Compliance Fields
business_registration_number = models.CharField(
    max_length=50,
    blank=True,
    null=True,
    help_text="Business Registration Number (BRN)"
)
vat_registration_number = models.CharField(
    max_length=50,
    blank=True,
    null=True,
    help_text="VAT Registration Number from IRD"
)
svat_number = models.CharField(
    max_length=50,
    blank=True,
    null=True,
    help_text="Simplified VAT Registration Number"
)
tax_scheme = models.CharField(
    max_length=50,
    default='VAT',
    help_text="Tax scheme: VAT, SVAT, EXEMPT, NONE"
)
```

### Invoice Type vs Compliance Fields

| Invoice Type | BRN | VAT Number | SVAT Number |
|-------------|-----|------------|-------------|
| STANDARD | Recommended | Required | - |
| SVAT | Recommended | - | Required |
| CREDIT_NOTE | Copy from original | Copy from original | Copy from original |
| DEBIT_NOTE | Copy from original | Copy from original | Copy from original |

### Legal Requirements (Sri Lanka)
- **VAT Invoice**: Must show VAT registration number
- **SVAT Invoice**: Must show SVAT registration number
- **BRN**: Required for all registered companies
- **Format**: Must follow IRD specifications
- **Retention**: Must be kept for 5 years

### Verification Checklist
- [ ] business_registration_number field is added
- [ ] vat_registration_number field is added
- [ ] svat_number field is added
- [ ] tax_scheme field is added
- [ ] Help text explains Sri Lanka compliance
- [ ] Fields are optional (blank=True, null=True)

---

## Task 09: Add Invoice Date Fields

### Overview
Add date and timestamp fields for tracking invoice lifecycle including issue date, due date, payment date, and cancellation date.

### Dependencies
- Task 08: Add Invoice Compliance Fields

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add date fields after compliance fields

2. **Add issue_date field**
   - Use DateField (not DateTime)
   - Purpose: Official invoice issue date
   - Set blank=True, null=True (assigned when status→ISSUED)
   - Add help_text: "Date invoice was issued"
   - Add db_index=True for reporting queries

3. **Add due_date field**
   - Use DateField
   - Purpose: Payment due date
   - Set blank=True, null=True (calculated from payment terms)
   - Add help_text: "Payment due date"
   - Add db_index=True for overdue queries

4. **Add paid_date field**
   - Use DateField
   - Purpose: Date when invoice was fully paid
   - Set blank=True, null=True (set when status→PAID)
   - Add help_text: "Date invoice was paid"

5. **Add cancelled_date field**
   - Use DateField
   - Purpose: Date invoice was cancelled or voided
   - Set blank=True, null=True
   - Add help_text: "Date invoice was cancelled/voided"

6. **Add sent_date field**
   - Use DateField
   - Purpose: Date invoice email was sent
   - Set blank=True, null=True
   - Add help_text: "Date invoice was sent to customer"

7. **Add payment_terms field**
   - Use IntegerField
   - Purpose: Number of days for payment (e.g., 30 for Net 30)
   - Set default=30
   - Add help_text: "Payment terms in days (e.g., 30 for Net 30)"

### Date Fields Structure
```python
# Date Fields
issue_date = models.DateField(
    blank=True,
    null=True,
    db_index=True,
    help_text="Date invoice was issued"
)
due_date = models.DateField(
    blank=True,
    null=True,
    db_index=True,
    help_text="Payment due date"
)
paid_date = models.DateField(
    blank=True,
    null=True,
    help_text="Date invoice was fully paid"
)
cancelled_date = models.DateField(
    blank=True,
    null=True,
    help_text="Date invoice was cancelled/voided"
)
sent_date = models.DateField(
    blank=True,
    null=True,
    help_text="Date invoice was sent to customer"
)
payment_terms = models.IntegerField(
    default=30,
    help_text="Payment terms in days (e.g., 30 for Net 30)"
)
```

### Date Lifecycle

| Status | issue_date | due_date | sent_date | paid_date | cancelled_date |
|--------|-----------|----------|-----------|-----------|----------------|
| DRAFT | null | null | null | null | null |
| ISSUED | ✓ set | ✓ calculated | null | null | null |
| SENT | ✓ | ✓ | ✓ set | null | null |
| PAID | ✓ | ✓ | ✓ | ✓ set | null |
| CANCELLED | null | null | null | null | ✓ set |
| VOID | ✓ | ✓ | ✓ | null | ✓ set |

### Due Date Calculation
```python
# When invoice is issued:
invoice.issue_date = today()
invoice.due_date = invoice.issue_date + timedelta(days=invoice.payment_terms)
```

### Common Payment Terms
| Term | Days | Description |
|------|------|-------------|
| Immediate | 0 | Due on receipt |
| Net 7 | 7 | Payment due in 7 days |
| Net 15 | 15 | Payment due in 15 days |
| Net 30 | 30 | Payment due in 30 days (most common) |
| Net 45 | 45 | Payment due in 45 days |
| Net 60 | 60 | Payment due in 60 days |

### Overdue Detection
```python
def is_overdue(self):
    if self.due_date and self.status in ['ISSUED', 'SENT', 'PARTIAL']:
        return date.today() > self.due_date
    return False
```

### Verification Checklist
- [ ] issue_date field is added with index
- [ ] due_date field is added with index
- [ ] paid_date field is added
- [ ] cancelled_date field is added
- [ ] sent_date field is added
- [ ] payment_terms field is added with default=30
- [ ] All date fields are DateField (not DateTime)
- [ ] Help text explains each date's purpose

---

## Task 10: Add Invoice Financial Fields

### Overview
Add financial calculation fields for storing invoice totals, including subtotal, discount, tax, total amount, amount paid, and balance due.

### Dependencies
- Task 09: Add Invoice Date Fields

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add financial fields after date fields
   - Import Decimal from decimal module for precision

2. **Add subtotal field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Sum of all line item totals before discount
   - Set default=Decimal('0.00')
   - Add help_text: "Subtotal of all line items"

3. **Add discount_type field**
   - Use CharField with max_length=20
   - Choices: PERCENTAGE, FIXED, NONE
   - Default: 'NONE'
   - Add help_text: "Type of header-level discount"

4. **Add discount_value field**
   - Use DecimalField with max_digits=10, decimal_places=2
   - Purpose: Discount amount or percentage value
   - Set default=Decimal('0.00')
   - Add help_text: "Discount value (percentage or fixed amount)"

5. **Add discount_amount field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Calculated discount in currency
   - Set default=Decimal('0.00')
   - Add help_text: "Calculated discount amount in LKR"

6. **Add tax_amount field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Total tax (sum of all line item taxes)
   - Set default=Decimal('0.00')
   - Add help_text: "Total tax amount"

7. **Add total field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Final invoice total (subtotal - discount + tax)
   - Set default=Decimal('0.00')
   - Add help_text: "Final invoice total"

8. **Add amount_paid field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Total amount paid so far
   - Set default=Decimal('0.00')
   - Add help_text: "Total amount paid"

9. **Add balance_due field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Remaining balance (total - amount_paid)
   - Set default=Decimal('0.00')
   - Add help_text: "Remaining balance due"

### Financial Fields Structure
```python
from decimal import Decimal

# Financial Fields
subtotal = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Subtotal of all line items"
)
discount_type = models.CharField(
    max_length=20,
    default='NONE',
    help_text="Discount type: PERCENTAGE, FIXED, NONE"
)
discount_value = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Discount value (percentage or fixed amount)"
)
discount_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Calculated discount amount in LKR"
)
tax_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Total tax amount"
)
total = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Final invoice total"
)
amount_paid = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Total amount paid"
)
balance_due = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Remaining balance due"
)
```

### Calculation Flow
```
Line Items → Subtotal
              │
              ▼
Header Discount Applied → Subtotal after discount
              │
              ▼
Tax Calculated → Tax Amount
              │
              ▼
Subtotal - Discount + Tax → Total
              │
              ▼
Total - Amount Paid → Balance Due
```

### Calculation Formulas
```python
# Subtotal
subtotal = sum(line_item.line_total for line_item in line_items)

# Discount Amount
if discount_type == 'PERCENTAGE':
    discount_amount = subtotal * (discount_value / 100)
elif discount_type == 'FIXED':
    discount_amount = discount_value
else:
    discount_amount = 0

# Taxable Amount
taxable_amount = subtotal - discount_amount

# Tax (calculated per line item, then summed)
tax_amount = sum(line_item.tax_amount for line_item in line_items)

# Total
total = taxable_amount + tax_amount

# Balance
balance_due = total - amount_paid
```

### Currency Precision
- **max_digits=15**: Supports up to 999,999,999,999.99 LKR
- **decimal_places=2**: Standard currency precision (cents/cents)
- Use Decimal type to avoid floating-point errors
- Always use Decimal('0.00') for defaults, not 0.0

### Example Invoice Calculation
```
Line Items:
  Item 1: Qty 10 × LKR 500 = LKR 5,000
  Item 2: Qty 5 × LKR 200 = LKR 1,000
Subtotal: LKR 6,000

Header Discount (10%):
  Discount Amount: LKR 600
Subtotal after discount: LKR 5,400

VAT (12% on LKR 5,400):
  Tax Amount: LKR 648
Total: LKR 6,048

Payment Received: LKR 3,000
Balance Due: LKR 3,048
```

### Verification Checklist
- [ ] subtotal field is added
- [ ] discount_type field is added
- [ ] discount_value field is added
- [ ] discount_amount field is added
- [ ] tax_amount field is added
- [ ] total field is added
- [ ] amount_paid field is added
- [ ] balance_due field is added
- [ ] All use DecimalField with proper precision
- [ ] All use Decimal('0.00') as default

---

## Task 11: Add Invoice Tax Breakdown Fields

### Overview
Add a JSONField to store detailed tax breakdown by tax rate, allowing invoices to show multiple tax rates and comply with tax reporting requirements.

### Dependencies
- Task 10: Add Invoice Financial Fields
- PostgreSQL database (supports JSONField)

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add tax breakdown field after financial fields

2. **Import JSONField**
   - Import JSONField from django.db.models
   - For Django 3.1+: `from django.db.models import JSONField`
   - For older versions: `from django.contrib.postgres.fields import JSONField`

3. **Add tax_breakdown field**
   - Use JSONField
   - Purpose: Store tax details by rate
   - Set default=dict (empty dictionary)
   - Set blank=True
   - Add help_text explaining structure

4. **Document tax_breakdown structure**
   - Add comment explaining JSON schema
   - Include example structure
   - Note that it's auto-populated by calculation service

### Tax Breakdown Structure
```python
# Tax Breakdown
tax_breakdown = models.JSONField(
    default=dict,
    blank=True,
    help_text="Tax breakdown by rate with taxable and tax amounts"
)
```

### Tax Breakdown JSON Schema
```json
{
  "rates": [
    {
      "rate": 12.00,
      "taxable_amount": 50000.00,
      "tax_amount": 6000.00,
      "description": "Standard VAT"
    },
    {
      "rate": 0.00,
      "taxable_amount": 10000.00,
      "tax_amount": 0.00,
      "description": "Tax Exempt"
    }
  ],
  "total_taxable": 60000.00,
  "total_tax": 6000.00
}
```

### Tax Breakdown Use Cases
1. **Multi-Rate Invoices**: Different line items with different tax rates
2. **Tax Reporting**: Detailed breakdown for tax filing
3. **Invoice Footer**: Display tax summary to customer
4. **Audit Trail**: Complete tax calculation details
5. **Compliance**: Required for complex tax scenarios

### Example Invoice with Multiple Tax Rates
```
Line Items:
  Item A (Taxable @12%): LKR 50,000
  Item B (Tax Exempt): LKR 10,000
  Item C (Taxable @12%): LKR 15,000

Tax Breakdown:
  Rate 12%: 
    Taxable: LKR 65,000
    Tax: LKR 7,800
  Rate 0%:
    Taxable: LKR 10,000
    Tax: LKR 0

Total Tax: LKR 7,800
```

### Invoice Footer Display
```
┌────────────────────────────────┐
│ Tax Summary:                   │
│ Taxable @ 12%    LKR 65,000.00 │
│ VAT (12%)        LKR  7,800.00 │
│ Tax Exempt       LKR 10,000.00 │
│ ──────────────────────────────│
│ Subtotal         LKR 75,000.00 │
│ Total Tax        LKR  7,800.00 │
│ TOTAL            LKR 82,800.00 │
└────────────────────────────────┘
```

### Population by Calculation Service
The calculation service will:
1. Group line items by tax rate
2. Calculate taxable amount per rate
3. Calculate tax amount per rate
4. Build tax_breakdown JSON structure
5. Save to invoice.tax_breakdown field

### Verification Checklist
- [ ] tax_breakdown JSONField is added
- [ ] default=dict is set
- [ ] Help text explains JSON structure
- [ ] Comments document expected schema
- [ ] Field supports multiple tax rates

---

## Task 12: Add Invoice Reference Fields

### Overview
Add fields to link invoices to related records including orders, related invoices (for credit/debit notes), and external reference numbers.

### Dependencies
- Task 11: Add Invoice Tax Breakdown Fields
- Order model must exist (from Phase 04 or 05)

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add reference fields after tax breakdown

2. **Import Order model**
   - Add import for Order model
   - Use appropriate import path
   - Example: `from apps.orders.models import Order`

3. **Add order foreign key field**
   - Use ForeignKey to Order model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True (invoices can be manual)
   - Set related_name='invoices'
   - Add db_index=True
   - Add help_text: "Order this invoice was generated from"

4. **Add related_invoice foreign key field**
   - Use ForeignKey to self (Invoice model)
   - Purpose: Link credit/debit notes to original invoice
   - Set on_delete=models.PROTECT
   - Set null=True, blank=True
   - Set related_name='adjustment_invoices'
   - Add db_index=True
   - Add help_text: "Original invoice for credit/debit notes"

5. **Add external_reference field**
   - Use CharField with max_length=100
   - Purpose: External system reference or PO number
   - Set blank=True, null=True
   - Add help_text: "External reference or PO number"

6. **Add notes field**
   - Use TextField
   - Purpose: Internal notes visible on invoice
   - Set blank=True, null=True
   - Add help_text: "Notes visible to customer"

7. **Add internal_notes field**
   - Use TextField
   - Purpose: Internal notes NOT visible on invoice
   - Set blank=True, null=True
   - Add help_text: "Internal notes (not shown on invoice)"

### Reference Fields Structure
```python
# Reference Fields
order = models.ForeignKey(
    'orders.Order',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='invoices',
    db_index=True,
    help_text="Order this invoice was generated from"
)
related_invoice = models.ForeignKey(
    'self',
    on_delete=models.PROTECT,
    null=True,
    blank=True,
    related_name='adjustment_invoices',
    db_index=True,
    help_text="Original invoice for credit/debit notes"
)
external_reference = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    help_text="External reference or PO number"
)
notes = models.TextField(
    blank=True,
    null=True,
    help_text="Notes visible to customer"
)
internal_notes = models.TextField(
    blank=True,
    null=True,
    help_text="Internal notes (not shown on invoice)"
)
```

### Relationship Diagrams

**Order to Invoice:**
```
Order (COMPLETED) ──generates──> Invoice (STANDARD)
      │                              │
      └──────────────────────────────┘
         Referenced via order FK
```

**Invoice to Credit/Debit Note:**
```
Invoice (STANDARD)     Invoice (CREDIT_NOTE)
INV-2026-00001  <────────  CN-2026-00001
    │                       (related_invoice FK)
    │
    └──────> Invoice (DEBIT_NOTE)
                DN-2026-00001
                (related_invoice FK)
```

### Reference Field Usage

| Field | Used For | Example Value |
|-------|----------|---------------|
| order | Link to originating order | Order UUID |
| related_invoice | Link credit/debit to original | Invoice UUID |
| external_reference | Customer PO number | "PO-2026-0123" |
| notes | Customer-visible notes | "Thank you for your business" |
| internal_notes | Staff notes | "Rush delivery requested" |

### On Delete Behavior

| Field | on_delete | Reason |
|-------|-----------|--------|
| order | SET_NULL | Invoice valid even if order deleted |
| related_invoice | PROTECT | Cannot delete invoice with adjustments |
| customer | PROTECT | Cannot delete customer with invoices |

### Credit Note Example
```python
# Original invoice
original = Invoice.objects.get(invoice_number='INV-2026-00001')

# Create credit note
credit_note = Invoice.objects.create(
    type=InvoiceType.CREDIT_NOTE,
    related_invoice=original,  # Link to original
    customer=original.customer,
    # ... copy other fields
)

# Access from original
original.adjustment_invoices.all()  # Returns credit/debit notes
```

### Verification Checklist
- [ ] order ForeignKey field is added
- [ ] related_invoice ForeignKey to self is added
- [ ] external_reference field is added
- [ ] notes field is added
- [ ] internal_notes field is added
- [ ] related_name='invoices' on order FK
- [ ] related_name='adjustment_invoices' on related_invoice FK
- [ ] Appropriate on_delete behaviors are set
- [ ] db_index=True on FK fields

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 07 | Add Invoice Business Fields | Business name, address, contact fields |
| 08 | Add Invoice Compliance Fields | BRN, VAT, SVAT registration fields |
| 09 | Add Invoice Date Fields | Issue, due, paid, cancelled dates |
| 10 | Add Invoice Financial Fields | Subtotal, discount, tax, total, balance |
| 11 | Add Invoice Tax Breakdown Fields | JSONField for tax details |
| 12 | Add Invoice Reference Fields | Order, related_invoice, external refs |

### Expanded Invoice Model Structure
```python
Invoice Model:
├── Core Fields (from Document 01)
├── Customer Fields (from Document 01)
├── Business Fields (Task 07)
│   ├── business_name
│   ├── business_address
│   ├── business_phone
│   ├── business_email
│   └── business_website
├── Compliance Fields (Task 08)
│   ├── business_registration_number (BRN)
│   ├── vat_registration_number
│   ├── svat_number
│   └── tax_scheme
├── Date Fields (Task 09)
│   ├── issue_date
│   ├── due_date
│   ├── paid_date
│   ├── cancelled_date
│   ├── sent_date
│   └── payment_terms
├── Financial Fields (Task 10)
│   ├── subtotal, discount_type, discount_value, discount_amount
│   ├── tax_amount, total
│   └── amount_paid, balance_due
├── Tax Breakdown (Task 11)
│   └── tax_breakdown (JSON)
└── Reference Fields (Task 12)
    ├── order (FK)
    ├── related_invoice (FK to self)
    ├── external_reference
    ├── notes
    └── internal_notes
```

### Next Steps
Proceed to [03_Tasks-13-18_Metadata-Currency-Number-Migration.md](03_Tasks-13-18_Metadata-Currency-Number-Migration.md) to add:
- Metadata fields (terms, attachments)
- Currency field with exchange rate
- Invoice number generator service
- PDF storage field
- Database indexes for performance
- Initial migrations

---

## Notes for AI Agents

1. **Financial Precision**: Always use DecimalField with Decimal type, never float
2. **Snapshot Pattern**: Business and customer fields are snapshots at invoice time
3. **Sri Lanka Compliance**: BRN and VAT fields are critical for compliance
4. **Tax Breakdown**: Will be populated by calculation service, not manually
5. **Credit/Debit Notes**: Must reference related_invoice for proper linking
6. **No Migrations Yet**: Wait until all fields are added (Task 18)
