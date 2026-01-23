# Tasks 13-18: Metadata, Currency, Number Generation & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** A - Invoice Model & Types  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Business-Compliance-Financial.md](02_Tasks-07-12_Business-Compliance-Financial.md)
- **→ Next Group:** [../Group-B_Invoice-LineItems-Tax-Calculation/](../Group-B_Invoice-LineItems-Tax-Calculation/)

---

## Document Overview

This document covers the final fields for the Invoice model including metadata, currency handling, invoice number generation, PDF storage, database indexing, and creating initial migrations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 13 | Add Invoice Metadata Fields | Medium |
| 14 | Add Invoice Currency Field | Low |
| 15 | Create Invoice Number Generator | Medium |
| 16 | Add Invoice PDF Storage Field | Low |
| 17 | Create Invoice Model Indexes | Medium |
| 18 | Run Initial Invoice Migrations | Low |

---

## Task 13: Add Invoice Metadata Fields

### Overview
Add additional metadata fields to the Invoice model including payment terms text, terms and conditions, attachments reference, and custom fields for extensibility.

### Dependencies
- Task 12: Add Invoice Reference Fields

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add metadata fields after reference fields

2. **Add terms_and_conditions field**
   - Use TextField
   - Purpose: Store terms and conditions text on invoice
   - Set blank=True, null=True
   - Add help_text: "Terms and conditions text for invoice"
   - Can be populated from tenant settings

3. **Add payment_instructions field**
   - Use TextField
   - Purpose: Payment instructions for customer
   - Set blank=True, null=True
   - Add help_text: "Payment instructions (bank details, etc.)"
   - Should include bank account information

4. **Add footer_text field**
   - Use TextField
   - Purpose: Custom footer text for invoice
   - Set blank=True, null=True
   - Add help_text: "Custom footer text"
   - Example: "Thank you for your business!"

5. **Add custom_fields field**
   - Use JSONField
   - Purpose: Store custom extensible data
   - Set default=dict
   - Set blank=True
   - Add help_text: "Custom fields for extensibility"

6. **Add attachments field**
   - Use JSONField to store file references
   - Purpose: Track attached documents
   - Set default=list
   - Set blank=True
   - Add help_text: "List of attachment file references"

7. **Add tags field**
   - Use JSONField or ArrayField if using PostgreSQL
   - Purpose: Tags for categorization
   - Set default=list
   - Set blank=True
   - Add help_text: "Tags for invoice categorization"

### Metadata Fields Structure
```python
# Metadata Fields
terms_and_conditions = models.TextField(
    blank=True,
    null=True,
    help_text="Terms and conditions text for invoice"
)
payment_instructions = models.TextField(
    blank=True,
    null=True,
    help_text="Payment instructions (bank details, etc.)"
)
footer_text = models.TextField(
    blank=True,
    null=True,
    help_text="Custom footer text"
)
custom_fields = models.JSONField(
    default=dict,
    blank=True,
    help_text="Custom fields for extensibility"
)
attachments = models.JSONField(
    default=list,
    blank=True,
    help_text="List of attachment file references"
)
tags = models.JSONField(
    default=list,
    blank=True,
    help_text="Tags for invoice categorization"
)
```

### Terms and Conditions Example
```
Terms and Conditions:
1. Payment is due within 30 days of invoice date
2. Late payments subject to 2% monthly interest
3. Goods remain property of seller until fully paid
4. Returns accepted within 14 days with receipt
5. All disputes subject to Colombo jurisdiction
```

### Payment Instructions Example
```
Payment Instructions:
Bank: Commercial Bank of Ceylon
Account Name: ABC Trading Ltd
Account Number: 1234567890
Branch: Colombo Fort
Swift Code: CCEYLKLX
Reference: Please quote invoice number
```

### Custom Fields Usage
```json
{
  "project_code": "PROJ-2026-001",
  "department": "Sales",
  "sales_rep": "John Doe",
  "delivery_note": "DN-2026-123",
  "vehicle_number": "CAA-1234"
}
```

### Attachments Structure
```json
[
  {
    "file_name": "delivery_note.pdf",
    "file_path": "invoices/2026/01/attachments/dn_123.pdf",
    "file_size": 245678,
    "uploaded_at": "2026-01-15T10:30:00Z"
  },
  {
    "file_name": "product_specs.pdf",
    "file_path": "invoices/2026/01/attachments/specs_456.pdf",
    "file_size": 512345,
    "uploaded_at": "2026-01-15T10:35:00Z"
  }
]
```

### Tags Usage
```json
["urgent", "recurring", "wholesale", "export"]
```

### Verification Checklist
- [ ] terms_and_conditions TextField is added
- [ ] payment_instructions TextField is added
- [ ] footer_text TextField is added
- [ ] custom_fields JSONField is added
- [ ] attachments JSONField is added
- [ ] tags JSONField is added
- [ ] All have appropriate defaults
- [ ] Help text explains purpose

---

## Task 14: Add Invoice Currency Field

### Overview
Add currency field to support multi-currency invoices with LKR as default, and exchange rate tracking for foreign currency invoices.

### Dependencies
- Task 13: Add Invoice Metadata Fields

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add currency fields after metadata fields

2. **Add currency field**
   - Use CharField with max_length=3
   - Purpose: ISO 4217 currency code (LKR, USD, EUR, etc.)
   - Set default='LKR'
   - Add help_text: "Currency code (ISO 4217)"
   - Add db_index=True for filtering

3. **Add exchange_rate field**
   - Use DecimalField with max_digits=12, decimal_places=6
   - Purpose: Exchange rate to base currency (LKR)
   - Set default=Decimal('1.000000')
   - Add help_text: "Exchange rate to LKR (1.0 for LKR invoices)"

4. **Add currency_symbol field**
   - Use CharField with max_length=10
   - Purpose: Display symbol (₨, $, €, etc.)
   - Set default='LKR'
   - Add help_text: "Currency symbol for display"

5. **Add base_currency_total field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Invoice total converted to LKR
   - Set default=Decimal('0.00')
   - Add help_text: "Total in base currency (LKR)"

### Currency Fields Structure
```python
from decimal import Decimal

# Currency Fields
currency = models.CharField(
    max_length=3,
    default='LKR',
    db_index=True,
    help_text="Currency code (ISO 4217)"
)
exchange_rate = models.DecimalField(
    max_digits=12,
    decimal_places=6,
    default=Decimal('1.000000'),
    help_text="Exchange rate to LKR (1.0 for LKR invoices)"
)
currency_symbol = models.CharField(
    max_length=10,
    default='LKR',
    help_text="Currency symbol for display"
)
base_currency_total = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Total in base currency (LKR)"
)
```

### Common Currencies for Sri Lanka

| Currency | Code | Symbol | Typical Use |
|----------|------|--------|-------------|
| Sri Lankan Rupee | LKR | ₨ / Rs | Domestic transactions |
| US Dollar | USD | $ | International sales |
| Euro | EUR | € | European customers |
| British Pound | GBP | £ | UK customers |
| Indian Rupee | INR | ₹ | Regional trade |

### Exchange Rate Example
```python
# USD Invoice at 1 USD = 330 LKR
invoice.currency = 'USD'
invoice.exchange_rate = Decimal('330.000000')
invoice.currency_symbol = '$'
invoice.total = Decimal('100.00')  # $100
invoice.base_currency_total = invoice.total * invoice.exchange_rate
# base_currency_total = 33,000 LKR
```

### Multi-Currency Invoice Display
```
┌─────────────────────────────────┐
│ INVOICE #INV-2026-00001         │
│                                 │
│ Total: $100.00                  │ ← invoice.total in currency
│                                 │
│ Exchange Rate: 1 USD = 330 LKR  │ ← invoice.exchange_rate
│ LKR Equivalent: Rs. 33,000.00   │ ← invoice.base_currency_total
└─────────────────────────────────┘
```

### Currency Formatting
```python
def format_currency(self):
    """Format amount with currency symbol"""
    if self.currency == 'LKR':
        return f"LKR {self.total:,.2f}"
    else:
        return f"{self.currency_symbol}{self.total:,.2f}"

# Examples:
# LKR: "LKR 50,000.00"
# USD: "$100.00"
# EUR: "€85.50"
```

### Base Currency Conversion
```python
def calculate_base_currency_total(self):
    """Convert invoice total to LKR"""
    if self.currency == 'LKR':
        self.base_currency_total = self.total
    else:
        self.base_currency_total = self.total * self.exchange_rate
```

### Verification Checklist
- [ ] currency CharField is added with default='LKR'
- [ ] exchange_rate DecimalField is added
- [ ] currency_symbol CharField is added
- [ ] base_currency_total DecimalField is added
- [ ] Exchange rate precision is 6 decimal places
- [ ] Default exchange rate is 1.0 for LKR
- [ ] db_index=True on currency field

---

## Task 15: Create Invoice Number Generator

### Overview
Create a service to auto-generate unique invoice numbers with format based on invoice type and yearly sequence reset.

### Dependencies
- Task 05: Create Invoice Model Core Fields
- Django transaction support

### Instructions

1. **Create number_generator.py in services**
   - Navigate to apps/invoices/services/
   - Create file named `number_generator.py`
   - This will contain invoice numbering logic

2. **Import required modules**
   - Import Django models and transaction
   - Import Invoice model
   - Import InvoiceType from constants
   - Import datetime for year extraction

3. **Create InvoiceNumberGenerator class**
   - Create class for encapsulating number generation
   - Use class methods or singleton pattern
   - Handle transaction-safe sequence generation

4. **Implement get_next_number method**
   - Accept parameters: invoice_type, year (optional)
   - Query for highest sequence number for type and year
   - Increment sequence
   - Format according to type prefix
   - Return formatted invoice number

5. **Define number format by type**
   - STANDARD: `INV-{YEAR}-{SEQ:05d}`
   - SVAT: `SVAT-{YEAR}-{SEQ:05d}`
   - CREDIT_NOTE: `CN-{YEAR}-{SEQ:05d}`
   - DEBIT_NOTE: `DN-{YEAR}-{SEQ:05d}`

6. **Implement sequence extraction method**
   - Parse existing invoice numbers
   - Extract sequence number from formatted string
   - Handle edge cases (empty, invalid format)

7. **Add transaction safety**
   - Use select_for_update for concurrent safety
   - Use database-level locking if needed
   - Handle race conditions

8. **Add prefix mapping**
   - Create dictionary mapping type to prefix
   - Centralize format definitions
   - Make easily extensible

### Number Generator Implementation
```python
from django.db import transaction
from django.utils import timezone
from apps.invoices.models import Invoice
from apps.invoices.constants import InvoiceType

class InvoiceNumberGenerator:
    """
    Generates unique invoice numbers with yearly sequence reset.
    Format: {PREFIX}-{YEAR}-{SEQUENCE}
    """
    
    PREFIX_MAP = {
        InvoiceType.STANDARD: 'INV',
        InvoiceType.SVAT: 'SVAT',
        InvoiceType.CREDIT_NOTE: 'CN',
        InvoiceType.DEBIT_NOTE: 'DN',
    }
    
    @classmethod
    @transaction.atomic
    def generate(cls, invoice_type, year=None):
        """
        Generate next invoice number for given type and year.
        
        Args:
            invoice_type: InvoiceType enum value
            year: Year (defaults to current year)
            
        Returns:
            Formatted invoice number string
        """
        if year is None:
            year = timezone.now().year
        
        # Get prefix for invoice type
        prefix = cls.PREFIX_MAP.get(invoice_type, 'INV')
        
        # Get last invoice number for this type and year
        pattern = f"{prefix}-{year}-%"
        last_invoice = Invoice.objects.filter(
            invoice_number__startswith=f"{prefix}-{year}-"
        ).order_by('-invoice_number').select_for_update().first()
        
        # Extract sequence or start at 1
        if last_invoice and last_invoice.invoice_number:
            parts = last_invoice.invoice_number.split('-')
            if len(parts) == 3:
                sequence = int(parts[2]) + 1
            else:
                sequence = 1
        else:
            sequence = 1
        
        # Format invoice number
        invoice_number = f"{prefix}-{year}-{sequence:05d}"
        
        return invoice_number
    
    @classmethod
    def validate_format(cls, invoice_number):
        """Validate invoice number format"""
        if not invoice_number:
            return False
        
        parts = invoice_number.split('-')
        if len(parts) != 3:
            return False
        
        prefix, year, sequence = parts
        
        # Check prefix is valid
        if prefix not in cls.PREFIX_MAP.values():
            return False
        
        # Check year is numeric and reasonable
        try:
            year_int = int(year)
            if year_int < 2000 or year_int > 2100:
                return False
        except ValueError:
            return False
        
        # Check sequence is numeric
        try:
            int(sequence)
        except ValueError:
            return False
        
        return True
```

### Invoice Number Examples

| Type | Year | Sequence | Invoice Number |
|------|------|----------|----------------|
| STANDARD | 2026 | 1 | INV-2026-00001 |
| STANDARD | 2026 | 25 | INV-2026-00025 |
| STANDARD | 2026 | 9999 | INV-2026-09999 |
| SVAT | 2026 | 1 | SVAT-2026-00001 |
| CREDIT_NOTE | 2026 | 1 | CN-2026-00001 |
| DEBIT_NOTE | 2026 | 1 | DN-2026-00001 |

### Yearly Sequence Reset
```
Year 2025:
INV-2025-00001
INV-2025-00002
...
INV-2025-09999

Year 2026:
INV-2026-00001  ← Sequence resets
INV-2026-00002
...
```

### Usage in Invoice Service
```python
from apps.invoices.services.number_generator import InvoiceNumberGenerator

# When issuing invoice
invoice.invoice_number = InvoiceNumberGenerator.generate(
    invoice_type=invoice.type,
    year=timezone.now().year
)
invoice.status = InvoiceStatus.ISSUED
invoice.save()
```

### Concurrency Safety
- Use `select_for_update()` to lock rows during sequence read
- Wrap in `@transaction.atomic` to ensure consistency
- Handle potential race conditions with retry logic if needed
- Database-level uniqueness constraint on invoice_number

### Verification Checklist
- [ ] number_generator.py created in services/
- [ ] InvoiceNumberGenerator class defined
- [ ] PREFIX_MAP dictionary defines all prefixes
- [ ] generate() method implemented
- [ ] Transaction safety with @transaction.atomic
- [ ] select_for_update() used for locking
- [ ] Yearly sequence reset logic implemented
- [ ] Format validation method included

---

## Task 16: Add Invoice PDF Storage Field

### Overview
Add a FileField to the Invoice model for storing generated PDF files with proper file path organization.

### Dependencies
- Task 14: Add Invoice Currency Field
- File storage configuration from Phase 03

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Add PDF storage field after currency fields

2. **Add pdf_file field**
   - Use FileField for PDF storage
   - Set upload_to with callable function for dynamic path
   - Set blank=True, null=True (generated on demand)
   - Add help_text: "Generated PDF invoice file"

3. **Create upload_to callable function**
   - Define function above model or as separate utility
   - Generate path: `invoices/{year}/{month}/{invoice_number}.pdf`
   - Use invoice data to build path
   - Sanitize filenames

4. **Add pdf_generated_at field**
   - Use DateTimeField
   - Purpose: Track when PDF was last generated
   - Set blank=True, null=True
   - Add help_text: "Timestamp of PDF generation"

5. **Add pdf_version field**
   - Use IntegerField
   - Purpose: Track PDF regeneration count
   - Set default=0
   - Add help_text: "PDF generation version number"

### PDF Storage Structure
```python
def invoice_pdf_upload_path(instance, filename):
    """
    Generate upload path for invoice PDF.
    Path: invoices/{year}/{month}/{invoice_number}.pdf
    """
    # Use issue_date or created_at for path
    date = instance.issue_date or instance.created_at
    year = date.year
    month = date.strftime('%m')
    
    # Sanitize invoice number for filename
    safe_number = instance.invoice_number or f"draft_{instance.id}"
    safe_number = safe_number.replace('/', '-')
    
    return f'invoices/{year}/{month}/{safe_number}.pdf'

# PDF Storage Fields
pdf_file = models.FileField(
    upload_to=invoice_pdf_upload_path,
    blank=True,
    null=True,
    help_text="Generated PDF invoice file"
)
pdf_generated_at = models.DateTimeField(
    blank=True,
    null=True,
    help_text="Timestamp of PDF generation"
)
pdf_version = models.IntegerField(
    default=0,
    help_text="PDF generation version number"
)
```

### File Storage Organization
```
media/
└── invoices/
    └── 2026/
        ├── 01/
        │   ├── INV-2026-00001.pdf
        │   ├── INV-2026-00002.pdf
        │   └── SVAT-2026-00001.pdf
        ├── 02/
        │   ├── INV-2026-00015.pdf
        │   ├── CN-2026-00001.pdf
        │   └── DN-2026-00001.pdf
        └── 03/
            └── INV-2026-00025.pdf
```

### PDF Lifecycle
```
Invoice Created (DRAFT)
       │
       ├─ pdf_file: null
       ├─ pdf_generated_at: null
       └─ pdf_version: 0
       │
       ▼
Invoice Issued → PDF Generated
       │
       ├─ pdf_file: "invoices/2026/01/INV-2026-00001.pdf"
       ├─ pdf_generated_at: "2026-01-15 10:30:00"
       └─ pdf_version: 1
       │
       ▼
PDF Regenerated (if needed)
       │
       ├─ pdf_file: "invoices/2026/01/INV-2026-00001.pdf" (overwritten)
       ├─ pdf_generated_at: "2026-01-20 14:45:00" (updated)
       └─ pdf_version: 2 (incremented)
```

### PDF Generation Tracking
```python
def generate_pdf(self):
    """Generate PDF and update tracking fields"""
    from apps.invoices.services.pdf_generator import InvoicePDFGenerator
    
    # Generate PDF
    pdf_content = InvoicePDFGenerator.generate(self)
    
    # Save to file
    filename = f"{self.invoice_number}.pdf"
    self.pdf_file.save(filename, ContentFile(pdf_content), save=False)
    
    # Update tracking
    self.pdf_generated_at = timezone.now()
    self.pdf_version += 1
    self.save(update_fields=['pdf_file', 'pdf_generated_at', 'pdf_version'])
```

### Storage Configuration
Ensure in settings.py:
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# For production, use cloud storage
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

### Verification Checklist
- [ ] pdf_file FileField is added
- [ ] upload_to callable function is defined
- [ ] pdf_generated_at DateTimeField is added
- [ ] pdf_version IntegerField is added
- [ ] Path structure organizes by year/month
- [ ] Filename uses sanitized invoice_number
- [ ] Fields are optional (blank=True, null=True)

---

## Task 17: Create Invoice Model Indexes

### Overview
Add database indexes to the Invoice model for optimizing common queries including filtering, sorting, and foreign key lookups.

### Dependencies
- All previous tasks (01-16)
- Complete Invoice model structure

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Locate the Meta class

2. **Add indexes list in Meta class**
   - Create indexes list for composite indexes
   - Define indexes for common query patterns
   - Consider filter, sort, and join patterns

3. **Add invoice_number index**
   - Already unique, automatically indexed
   - Verify unique=True is set

4. **Add composite index for status + issue_date**
   - Purpose: Query invoices by status with date sorting
   - Common query: "Get all ISSUED invoices from last month"
   - Index: `['status', '-issue_date']`

5. **Add composite index for customer + status**
   - Purpose: Query customer's invoices by status
   - Common query: "Get customer's OVERDUE invoices"
   - Index: `['customer', 'status']`

6. **Add composite index for type + status**
   - Purpose: Query invoices by type and status
   - Common query: "Get all PAID STANDARD invoices"
   - Index: `['type', 'status']`

7. **Add due_date index for overdue queries**
   - Purpose: Find overdue invoices efficiently
   - Common query: "Get invoices due before today"
   - Index: `['due_date']`

8. **Add created_at index**
   - Purpose: Chronological sorting and filtering
   - Already in ordering, but explicit index helps
   - Index: `['-created_at']`

9. **Add order index**
   - Purpose: Find invoices by order
   - Already marked db_index=True in field
   - Verify it's set

10. **Add composite index for customer + issue_date**
    - Purpose: Customer invoice history with date range
    - Common query: "Get customer invoices from Q1 2026"
    - Index: `['customer', '-issue_date']`

### Indexes in Meta Class
```python
class Invoice(TenantAwareModel):
    # ... all fields ...
    
    class Meta:
        db_table = 'invoices'
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
        ordering = ['-created_at']
        
        indexes = [
            # Composite index for status-based queries with date sort
            models.Index(
                fields=['status', '-issue_date'],
                name='invoice_status_date_idx'
            ),
            
            # Composite index for customer invoices by status
            models.Index(
                fields=['customer', 'status'],
                name='invoice_customer_status_idx'
            ),
            
            # Composite index for type and status filtering
            models.Index(
                fields=['type', 'status'],
                name='invoice_type_status_idx'
            ),
            
            # Index for customer invoice history
            models.Index(
                fields=['customer', '-issue_date'],
                name='invoice_customer_date_idx'
            ),
            
            # Index for due date queries (overdue detection)
            models.Index(
                fields=['due_date'],
                name='invoice_due_date_idx'
            ),
            
            # Index for currency-based filtering
            models.Index(
                fields=['currency'],
                name='invoice_currency_idx'
            ),
        ]
        
        constraints = [
            # Ensure invoice_number is unique when not null
            models.UniqueConstraint(
                fields=['invoice_number'],
                name='unique_invoice_number'
            ),
        ]
```

### Index Benefits

| Index | Query Pattern | Performance Gain |
|-------|---------------|------------------|
| status + issue_date | List issued invoices by date | 10x-100x faster |
| customer + status | Customer's unpaid invoices | 50x faster |
| type + status | Filter by type and status | 20x faster |
| customer + issue_date | Customer invoice history | 30x faster |
| due_date | Find overdue invoices | 100x faster |

### Common Queries Optimized

**Query 1: Find overdue invoices**
```python
Invoice.objects.filter(
    status__in=['ISSUED', 'SENT', 'PARTIAL'],
    due_date__lt=date.today()
)
# Uses: due_date index + status
```

**Query 2: Customer invoice history**
```python
Invoice.objects.filter(
    customer=customer_id,
    issue_date__range=[start_date, end_date]
).order_by('-issue_date')
# Uses: customer + issue_date composite index
```

**Query 3: Unpaid standard invoices**
```python
Invoice.objects.filter(
    type=InvoiceType.STANDARD,
    status__in=['ISSUED', 'SENT', 'PARTIAL']
).order_by('-issue_date')
# Uses: type + status index
```

### Index Maintenance
- Indexes improve read performance
- Indexes slow down writes slightly
- Balance between read and write patterns
- Monitor slow queries in production
- Add indexes based on actual usage patterns

### Verification Checklist
- [ ] indexes list added to Meta class
- [ ] status + issue_date composite index defined
- [ ] customer + status composite index defined
- [ ] type + status composite index defined
- [ ] customer + issue_date composite index defined
- [ ] due_date index defined
- [ ] currency index defined
- [ ] UniqueConstraint on invoice_number added
- [ ] All indexes have descriptive names

---

## Task 18: Run Initial Invoice Migrations

### Overview
Generate and apply Django migrations for the complete Invoice model with all fields, indexes, and constraints.

### Dependencies
- All previous tasks (01-17)
- Complete Invoice model definition

### Instructions

1. **Verify Invoice model is complete**
   - Open apps/invoices/models/invoice.py
   - Verify all fields from Tasks 05-17 are present
   - Check Meta class with indexes and constraints
   - Ensure no syntax errors

2. **Update models __init__.py**
   - Open apps/invoices/models/__init__.py
   - Import Invoice model for Django discovery
   - Example: `from .invoice import Invoice`

3. **Generate migrations**
   - Open terminal in Django project root
   - Activate virtual environment if needed
   - Run: `python manage.py makemigrations invoices`
   - Review generated migration file

4. **Review migration file**
   - Navigate to apps/invoices/migrations/
   - Open the generated migration (likely 0001_initial.py)
   - Verify all fields are included
   - Check indexes are created
   - Verify constraints are added

5. **Check for migration issues**
   - Look for any warnings in makemigrations output
   - Verify no circular dependencies
   - Check default values are appropriate
   - Ensure decimal defaults use Decimal, not float

6. **Apply migrations**
   - Run: `python manage.py migrate invoices`
   - Migrations will apply to public schema (SHARED_APPS)
   - Or to all tenant schemas if in TENANT_APPS

7. **Verify database schema**
   - Connect to database
   - Check invoices table exists
   - Verify all columns present
   - Check indexes created
   - Verify constraints applied

8. **Test model in Django shell**
   - Run: `python manage.py shell`
   - Import Invoice model
   - Create test instance
   - Verify field access and defaults
   - Test model methods

### Migration Commands
```bash
# Generate migrations
python manage.py makemigrations invoices

# Expected output:
# Migrations for 'invoices':
#   apps/invoices/migrations/0001_initial.py
#     - Create model Invoice

# Apply migrations
python manage.py migrate invoices

# Expected output:
# Running migrations:
#   Applying invoices.0001_initial... OK

# Check migration status
python manage.py showmigrations invoices

# Expected output:
# invoices
#  [X] 0001_initial
```

### Migration File Structure
```python
# apps/invoices/migrations/0001_initial.py
from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
        ('customers', '0001_initial'),
        ('orders', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('invoice_number', models.CharField(max_length=50, unique=True, null=True, blank=True)),
                ('type', models.CharField(max_length=20, default='STANDARD')),
                ('status', models.CharField(max_length=20, default='DRAFT')),
                # ... all other fields ...
            ],
            options={
                'db_table': 'invoices',
                'verbose_name': 'Invoice',
                'verbose_name_plural': 'Invoices',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='invoice',
            index=models.Index(fields=['status', '-issue_date'], name='invoice_status_date_idx'),
        ),
        # ... other indexes ...
    ]
```

### Test in Django Shell
```python
# Start shell
python manage.py shell

# Import model
from apps.invoices.models import Invoice
from apps.invoices.constants import InvoiceType, InvoiceStatus

# Create test instance
invoice = Invoice()
invoice.type = InvoiceType.STANDARD
invoice.status = InvoiceStatus.DRAFT
print(invoice.status)  # Should print: DRAFT

# Check defaults
print(invoice.currency)  # Should print: LKR
print(invoice.subtotal)  # Should print: 0.00
print(invoice.exchange_rate)  # Should print: 1.000000

# Test string representation
print(str(invoice))  # Should print something meaningful
```

### Multi-Tenant Considerations
- If invoices in TENANT_APPS, migrations apply to all tenant schemas
- Test migration on a test tenant first
- Ensure tenant middleware properly routes queries
- Verify each tenant has invoices table in their schema

### Rollback Plan
```bash
# If migration fails, rollback
python manage.py migrate invoices zero

# This undoes all invoice migrations
# Use cautiously in production
```

### Verification Checklist
- [ ] Invoice model is complete with all fields
- [ ] models/__init__.py imports Invoice
- [ ] makemigrations runs without errors
- [ ] Migration file 0001_initial.py is created
- [ ] All fields present in migration
- [ ] All indexes present in migration
- [ ] migrate command runs successfully
- [ ] Database table 'invoices' exists
- [ ] All columns exist in database
- [ ] Indexes are created in database
- [ ] Test instance can be created in shell
- [ ] Default values work correctly

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 13 | Add Invoice Metadata Fields | Terms, payment instructions, custom fields |
| 14 | Add Invoice Currency Field | Currency, exchange rate, multi-currency support |
| 15 | Create Invoice Number Generator | Auto-numbering service with yearly reset |
| 16 | Add Invoice PDF Storage Field | PDF file storage with versioning |
| 17 | Create Invoice Model Indexes | Database indexes for performance |
| 18 | Run Initial Invoice Migrations | Applied database schema |

### Complete Invoice Model (Group A Finished)
```python
Invoice Model - Complete Structure:
├── Core Fields (Tasks 05)
│   ├── id, invoice_number, type, status
│   └── created_at, updated_at
├── Customer Fields (Task 06)
│   ├── customer (FK), customer_name, customer_email
│   └── customer_phone, customer_address, customer_tax_id
├── Business Fields (Task 07)
│   ├── business_name, business_address
│   └── business_phone, business_email, business_website
├── Compliance Fields (Task 08)
│   ├── business_registration_number (BRN)
│   ├── vat_registration_number
│   └── svat_number, tax_scheme
├── Date Fields (Task 09)
│   ├── issue_date, due_date, paid_date
│   └── cancelled_date, sent_date, payment_terms
├── Financial Fields (Task 10)
│   ├── subtotal, discount_type, discount_value, discount_amount
│   ├── tax_amount, total
│   └── amount_paid, balance_due
├── Tax Breakdown (Task 11)
│   └── tax_breakdown (JSON)
├── Reference Fields (Task 12)
│   ├── order (FK), related_invoice (FK to self)
│   └── external_reference, notes, internal_notes
├── Metadata Fields (Task 13)
│   ├── terms_and_conditions, payment_instructions, footer_text
│   └── custom_fields, attachments, tags (JSON)
├── Currency Fields (Task 14)
│   ├── currency, exchange_rate, currency_symbol
│   └── base_currency_total
├── PDF Fields (Task 16)
│   ├── pdf_file, pdf_generated_at
│   └── pdf_version
└── Meta (Task 17)
    ├── Indexes (7 composite indexes)
    └── Constraints (unique invoice_number)
```

### Supporting Services
```
apps/invoices/services/
└── number_generator.py       # Task 15
    └── InvoiceNumberGenerator class
        └── generate(type, year) method
```

### Migrations Applied
```
apps/invoices/migrations/
└── 0001_initial.py            # Task 18
    ├── CreateModel(Invoice)
    ├── AddIndex(× 7)
    └── UniqueConstraint(invoice_number)
```

### Group A Complete ✓
All 18 tasks in Group A are complete. The Invoice model is fully defined with:
- ✓ Core identification and status fields
- ✓ Customer and business information (with snapshots)
- ✓ Sri Lanka compliance fields (BRN, VAT, SVAT)
- ✓ Complete date tracking
- ✓ Financial calculation fields
- ✓ Tax breakdown structure
- ✓ Reference links to orders and related invoices
- ✓ Metadata and extensibility fields
- ✓ Multi-currency support
- ✓ Auto-numbering service
- ✓ PDF storage and versioning
- ✓ Performance indexes
- ✓ Database migrations applied

### Next Steps
Proceed to [../Group-B_Invoice-LineItems-Tax-Calculation/](../Group-B_Invoice-LineItems-Tax-Calculation/) to implement:
- InvoiceLineItem model with product references
- Quantity, pricing, and discount fields
- Tax calculation per line item
- Invoice calculation service
- VAT and SVAT calculation logic
- Automatic recalculation signals

---

## Notes for AI Agents

1. **Migrations**: Must be generated and applied before proceeding to Group B
2. **Number Generator**: Thread-safe with select_for_update locking
3. **Currency**: LKR is default; multi-currency optional but supported
4. **PDF Storage**: Generated on-demand, not on every save
5. **Indexes**: Critical for performance with large invoice volumes
6. **Testing**: Test model creation in shell before proceeding
