# Tasks 47-50: Settings, Payment Terms & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** C - Invoice Generation Services  
> **Document:** 03 of 03  
> **Tasks Covered:** 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-46_Validation-Overdue-Aging-History.md](02_Tasks-41-46_Validation-Overdue-Aging-History.md)
- **→ Next Group:** [../Group-D_Credit-Notes-Debit-Notes/](../Group-D_Credit-Notes-Debit-Notes/)

---

## Document Overview

This document covers invoice settings configuration, payment terms management, and database migrations for the invoice generation services.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Create InvoiceSettings Model | Medium | 25 min |
| 48 | Implement Default Due Date | Medium | 20 min |
| 49 | Implement Payment Terms Text | Low | 20 min |
| 50 | Run Invoice Service Migrations | Low | 15 min |

---

## Task 47: Create InvoiceSettings Model

### Overview
Create the InvoiceSettings model to store tenant-specific invoice configuration including numbering, defaults, and behavior settings.

### Dependencies
- Phase 02, Task 15: Tenant Model

### Instructions

1. **Create InvoiceSettings model file**
   - Create `apps/invoices/models/invoice_settings.py`
   - Import necessary base classes

2. **Define InvoiceSettings model**
   - Inherit from models.Model (not tenant-aware itself)
   - Add OneToOne relationship to Tenant
   - This ensures one settings per tenant

3. **Add numbering configuration**
   - invoice_number_prefix: CharField (default: "INV")
   - invoice_number_format: CharField (default: "{PREFIX}-{YEAR}-{SEQ}")
   - credit_note_prefix: CharField (default: "CN")
   - debit_note_prefix: CharField (default: "DN")
   - sequence_start: IntegerField (default: 1)
   - reset_sequence_yearly: BooleanField (default: True)

4. **Add default values**
   - default_due_days: IntegerField (default: 30)
   - default_payment_terms: CharField (default: "Net 30")
   - default_vat_rate: DecimalField (default: 12.00)
   - default_tax_inclusive: BooleanField (default: False)

5. **Add display settings**
   - show_business_registration_number: BooleanField (default: True)
   - show_vat_registration_number: BooleanField (default: True)
   - show_logo: BooleanField (default: True)
   - show_bank_details: BooleanField (default: True)

6. **Add behavior settings**
   - auto_send_on_issue: BooleanField (default: False)
   - auto_issue_from_order: BooleanField (default: False)
   - require_approval: BooleanField (default: False)
   - allow_editing_issued: BooleanField (default: False)

7. **Add late fee settings**
   - apply_late_fees: BooleanField (default: False)
   - late_fee_type: CharField (choices: PERCENTAGE, FIXED)
   - late_fee_rate: DecimalField (for percentage, e.g., 2.00 = 2%)
   - late_fee_amount: DecimalField (for fixed amount)
   - late_fee_grace_days: IntegerField (default: 7)

8. **Add reminder settings**
   - send_payment_reminders: BooleanField (default: True)
   - reminder_days_before_due: ArrayField (default: [7, 3, 1])
   - reminder_days_after_due: ArrayField (default: [1, 7, 14, 30])

9. **Add terms and conditions**
   - default_terms_and_conditions: TextField (blank=True)
   - default_payment_instructions: TextField (blank=True)
   - default_footer_text: TextField (blank=True)

10. **Add timestamps**
    - created_at: DateTimeField (auto_now_add)
    - updated_at: DateTimeField (auto_now)

11. **Add model methods**
    - `get_next_invoice_number()`: Generate next number
    - `get_due_date(issue_date=None)`: Calculate due date
    - `get_payment_terms_text()`: Format payment terms

12. **Add validation**
    - Validate VAT rate range (0-100)
    - Validate due days > 0
    - Validate late fee settings consistency

### InvoiceSettings Model Structure

```python
class InvoiceSettings(models.Model):
    tenant = models.OneToOneField(
        Tenant,
        on_delete=models.CASCADE,
        related_name='invoice_settings'
    )
    
    # Numbering Configuration
    invoice_number_prefix = models.CharField(max_length=10, default='INV')
    invoice_number_format = models.CharField(
        max_length=50,
        default='{PREFIX}-{YEAR}-{SEQ:05d}'
    )
    credit_note_prefix = models.CharField(max_length=10, default='CN')
    debit_note_prefix = models.CharField(max_length=10, default='DN')
    sequence_start = models.IntegerField(default=1)
    reset_sequence_yearly = models.BooleanField(default=True)
    
    # Default Values
    default_due_days = models.IntegerField(default=30)
    default_payment_terms = models.CharField(max_length=50, default='Net 30')
    default_vat_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=12.00
    )
    default_tax_inclusive = models.BooleanField(default=False)
    
    # Display Settings
    show_business_registration_number = models.BooleanField(default=True)
    show_vat_registration_number = models.BooleanField(default=True)
    show_logo = models.BooleanField(default=True)
    show_bank_details = models.BooleanField(default=True)
    
    # Behavior Settings
    auto_send_on_issue = models.BooleanField(default=False)
    auto_issue_from_order = models.BooleanField(default=False)
    require_approval = models.BooleanField(default=False)
    allow_editing_issued = models.BooleanField(default=False)
    
    # Late Fee Settings
    apply_late_fees = models.BooleanField(default=False)
    late_fee_type = models.CharField(
        max_length=20,
        choices=[('PERCENTAGE', 'Percentage'), ('FIXED', 'Fixed Amount')],
        default='PERCENTAGE'
    )
    late_fee_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text='Percentage rate (e.g., 2.00 for 2%)'
    )
    late_fee_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Fixed amount in LKR'
    )
    late_fee_grace_days = models.IntegerField(default=7)
    
    # Reminder Settings
    send_payment_reminders = models.BooleanField(default=True)
    reminder_days_before_due = models.JSONField(default=list)  # [7, 3, 1]
    reminder_days_after_due = models.JSONField(default=list)   # [1, 7, 14, 30]
    
    # Terms and Conditions
    default_terms_and_conditions = models.TextField(blank=True)
    default_payment_instructions = models.TextField(blank=True)
    default_footer_text = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'invoice_settings'
        verbose_name = 'Invoice Settings'
        verbose_name_plural = 'Invoice Settings'
```

### Settings Categories

| Category | Purpose |
|----------|---------|
| **Numbering** | Control invoice number generation |
| **Defaults** | Set default values for new invoices |
| **Display** | Control what appears on invoices |
| **Behavior** | Control system automation |
| **Late Fees** | Configure late payment penalties |
| **Reminders** | Configure payment reminders |
| **Terms** | Default text for invoices |

### Default Settings Values

```python
DEFAULT_INVOICE_SETTINGS = {
    'invoice_number_prefix': 'INV',
    'invoice_number_format': '{PREFIX}-{YEAR}-{SEQ:05d}',
    'default_due_days': 30,
    'default_payment_terms': 'Net 30',
    'default_vat_rate': 12.00,
    'reminder_days_before_due': [7, 3, 1],
    'reminder_days_after_due': [1, 7, 14, 30],
    'default_payment_instructions': 
        'Please make payment to the bank account details shown below.',
    'default_terms_and_conditions':
        '1. Payment is due within 30 days from invoice date.\n'
        '2. Late payments may incur additional charges.\n'
        '3. Please include invoice number with payment.'
}
```

### Expected Outcome
- InvoiceSettings model created
- All configuration fields defined
- Default values set
- Ready for migration

### Verification Checklist
- [ ] InvoiceSettings model created
- [ ] OneToOne relationship to Tenant
- [ ] All configuration fields added
- [ ] Default values set appropriately
- [ ] Validation rules added
- [ ] Model methods stubbed

---

## Task 48: Implement Default Due Date

### Overview
Implement the logic to automatically calculate invoice due dates based on InvoiceSettings configuration and payment terms.

### Dependencies
- Task 47: Create InvoiceSettings Model

### Instructions

1. **Add get_due_date method to InvoiceSettings**
   - Define method `get_due_date(issue_date=None)`
   - If issue_date not provided, use today
   - Return calculated due date

2. **Calculate from default_due_days**
   - Add default_due_days to issue_date
   - Return resulting date

3. **Handle business days option**
   - Add setting: use_business_days (BooleanField)
   - If True, skip weekends
   - Skip configured holidays

4. **Add to InvoiceService**
   - In create_invoice(), auto-calculate due_date if not provided
   - In create_from_order(), always calculate due_date
   - Use InvoiceSettings.get_due_date()

5. **Parse payment terms**
   - Add method `parse_payment_terms(terms_text)`
   - Extract number from "Net 30", "Net 15", etc.
   - Override default_due_days if specified

6. **Support multiple term formats**
   - "Net 30" → 30 days
   - "Net 7" → 7 days
   - "Immediate" → 0 days
   - "End of Month" → Last day of month
   - "15th of Next Month" → 15th of next month

7. **Add validation**
   - Validate due_date >= issue_date
   - Raise error if due date in past

8. **Add override parameter**
   - Allow manual override of due_date
   - If provided in invoice data, use that
   - Otherwise, calculate

### Due Date Calculation Logic

```python
from datetime import timedelta, date

def get_due_date(self, issue_date=None):
    """
    Calculate invoice due date based on settings
    
    Args:
        issue_date: Invoice issue date (default: today)
        
    Returns:
        date: Calculated due date
    """
    if issue_date is None:
        issue_date = date.today()
    
    # Add default due days
    due_date = issue_date + timedelta(days=self.default_due_days)
    
    # If business days only, skip weekends
    if self.use_business_days:
        due_date = self._skip_weekends_and_holidays(due_date)
    
    return due_date


def _skip_weekends_and_holidays(self, target_date):
    """
    Adjust date to skip weekends and holidays
    """
    # Skip Saturday (5) and Sunday (6)
    while target_date.weekday() >= 5:
        target_date += timedelta(days=1)
    
    # Check against holiday calendar (implement separately)
    # holidays = self.tenant.holiday_calendar.get_holidays()
    # while target_date in holidays:
    #     target_date += timedelta(days=1)
    
    return target_date
```

### Payment Terms Parsing

```python
def parse_payment_terms(terms_text):
    """
    Parse payment terms text to extract due days
    
    Examples:
        "Net 30" → 30
        "Net 15" → 15
        "Immediate" → 0
        "Due on Receipt" → 0
        "Net 7 Days" → 7
    
    Returns:
        int: Number of days
    """
    import re
    
    terms_text = terms_text.strip().upper()
    
    # Immediate payment
    if terms_text in ['IMMEDIATE', 'DUE ON RECEIPT', 'CASH']:
        return 0
    
    # Net N pattern
    match = re.search(r'NET\s+(\d+)', terms_text)
    if match:
        return int(match.group(1))
    
    # N Days pattern
    match = re.search(r'(\d+)\s+DAYS?', terms_text)
    if match:
        return int(match.group(1))
    
    # Default
    return 30
```

### Due Date Calculation Flow

```
┌─────────────────────┐
│ Create Invoice      │
│ Issue Date: Jan 23  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Check if due_date   │
│ provided            │
└──────────┬──────────┘
           │
           ├─ Yes ──→ Use provided date
           │
           ▼ No
┌─────────────────────┐
│ Get InvoiceSettings │
│ default_due_days=30 │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Calculate Due Date  │
│ Jan 23 + 30 days    │
│ = Feb 22            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Skip weekends?      │
│ (if enabled)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Set invoice.due_date│
│ = Feb 22, 2026      │
└─────────────────────┘
```

### Payment Terms Options

| Term | Days | Due Date Calculation |
|------|------|---------------------|
| Immediate | 0 | Same as issue date |
| Due on Receipt | 0 | Same as issue date |
| Net 7 | 7 | Issue date + 7 days |
| Net 15 | 15 | Issue date + 15 days |
| Net 30 | 30 | Issue date + 30 days |
| Net 45 | 45 | Issue date + 45 days |
| Net 60 | 60 | Issue date + 60 days |
| Net 90 | 90 | Issue date + 90 days |

### Expected Outcome
- Automatic due date calculation
- Support for multiple term formats
- Business days option
- Manual override capability

### Verification Checklist
- [ ] `get_due_date()` method implemented
- [ ] Default due days calculation works
- [ ] Payment terms parsing works
- [ ] Business days skipping (optional)
- [ ] Integration with InvoiceService
- [ ] Manual override supported
- [ ] Validation in place

---

## Task 49: Implement Payment Terms Text

### Overview
Implement methods to generate human-readable payment terms text based on settings and display on invoices.

### Dependencies
- Task 47: Create InvoiceSettings Model

### Instructions

1. **Add get_payment_terms_text method**
   - Add to InvoiceSettings model
   - Return formatted payment terms string
   - Use default_payment_terms if set

2. **Generate from due days**
   - If default_payment_terms is empty
   - Generate from default_due_days
   - Format: "Payment due within {days} days"

3. **Support standard terms**
   - Convert days to standard terms
   - 0 days → "Due on Receipt"
   - 7 days → "Net 7"
   - 15 days → "Net 15"
   - 30 days → "Net 30"
   - etc.

4. **Add late fee text**
   - If apply_late_fees is True
   - Append late fee information
   - Example: "Late fee of 2% per month applies after due date"

5. **Add early payment discount text**
   - Add field: early_payment_discount_percentage
   - Add field: early_payment_discount_days
   - Example: "2% discount if paid within 10 days"

6. **Format complete terms**
   - Combine all components
   - Format as multi-line text or single line
   - Include on invoice PDF

7. **Add to Invoice model**
   - Add payment_terms_text field (TextField)
   - Auto-populate on invoice creation
   - Allow manual override

8. **Add to PDF template**
   - Display payment terms on invoice PDF
   - Position in footer or terms section

### Payment Terms Text Generation

```python
def get_payment_terms_text(self):
    """
    Generate formatted payment terms text
    
    Returns:
        str: Human-readable payment terms
    """
    # Use custom terms if set
    if self.default_payment_terms:
        terms_text = self.default_payment_terms
    else:
        # Generate from due days
        if self.default_due_days == 0:
            terms_text = "Payment due on receipt"
        else:
            terms_text = f"Net {self.default_due_days}"
    
    # Add late fee information
    if self.apply_late_fees:
        if self.late_fee_type == 'PERCENTAGE':
            terms_text += f"\nLate fee: {self.late_fee_rate}% per month after {self.late_fee_grace_days} days"
        else:
            terms_text += f"\nLate fee: LKR {self.late_fee_amount} per day after {self.late_fee_grace_days} days"
    
    # Add early payment discount
    if hasattr(self, 'early_payment_discount_percentage') and self.early_payment_discount_percentage > 0:
        terms_text += f"\n{self.early_payment_discount_percentage}% discount if paid within {self.early_payment_discount_days} days"
    
    return terms_text
```

### Payment Terms Examples

| Configuration | Generated Text |
|--------------|----------------|
| due_days=30 | "Net 30 days from invoice date" |
| due_days=0 | "Payment due on receipt" |
| due_days=15, late_fee=2% | "Net 15\nLate fee: 2% per month after 7 days" |
| custom="Net 30 days" | "Net 30 days" |

### Complete Payment Terms Display

```
PAYMENT TERMS
─────────────
Net 30 days from invoice date

Payment Methods:
- Bank transfer (preferred)
- Cash
- Card (Visa, Mastercard)

Late Payment:
A late fee of 2% per month will be applied 
to overdue balances after 7 days grace period.

Early Payment Discount:
2% discount applies if paid within 10 days.

Please include invoice number with all payments.
```

### Invoice Display Integration

```python
# When creating invoice
invoice.payment_terms_text = settings.get_payment_terms_text()
invoice.payment_instructions = settings.default_payment_instructions
invoice.save()
```

### Expected Outcome
- Payment terms text generation
- Automatic formatting
- Display on invoices
- Configurable per tenant

### Verification Checklist
- [ ] `get_payment_terms_text()` method implemented
- [ ] Standard terms supported
- [ ] Late fee text included
- [ ] Early discount text included
- [ ] Integration with Invoice model
- [ ] Display on PDF template
- [ ] Manual override supported

---

## Task 50: Run Invoice Service Migrations

### Overview
Create and run database migrations for InvoiceHistory, InvoiceSettings, and related service components.

### Dependencies
- Task 45: Create InvoiceHistory Model
- Task 47: Create InvoiceSettings Model

### Instructions

1. **Generate migrations**
   - Run `python manage.py makemigrations invoices`
   - Review generated migration file
   - Ensure all fields captured

2. **Review migration contents**
   - Check InvoiceHistory model migration
   - Check InvoiceSettings model migration
   - Verify relationships (FKs, indexes)

3. **Add migration dependencies**
   - Ensure depends on previous invoice migrations
   - Ensure depends on tenant migrations
   - Ensure depends on user migrations

4. **Add data migration for settings**
   - Create data migration
   - Auto-create InvoiceSettings for existing tenants
   - Use default values

5. **Run migrations**
   - Run `python manage.py migrate invoices`
   - Verify successful application
   - Check tables created

6. **Verify database tables**
   - Check `invoice_history` table exists
   - Check `invoice_settings` table exists
   - Verify columns and indexes

7. **Create settings for test tenant**
   - In public schema or first tenant
   - Create InvoiceSettings record
   - Set appropriate defaults for Sri Lanka

8. **Test settings retrieval**
   - Query InvoiceSettings for tenant
   - Verify defaults applied
   - Test get_due_date() method

9. **Document migration**
   - Add migration notes
   - Document any manual steps
   - Update schema diagrams

### Migration File Structure

```python
# migrations/0003_history_settings.py

from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):
    dependencies = [
        ('invoices', '0002_invoice_line_items'),
        ('tenants', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    operations = [
        # Create InvoiceHistory
        migrations.CreateModel(
            name='InvoiceHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tenants.tenant')),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='invoices.invoice')),
                ('event_type', models.CharField(max_length=50)),
                # ... more fields
            ],
            options={
                'db_table': 'invoice_history',
                'ordering': ['-created_at'],
            },
        ),
        
        # Create InvoiceSettings
        migrations.CreateModel(
            name='InvoiceSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True)),
                ('tenant', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_settings', to='tenants.tenant')),
                ('invoice_number_prefix', models.CharField(default='INV', max_length=10)),
                # ... more fields
            ],
            options={
                'db_table': 'invoice_settings',
            },
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='invoicehistory',
            index=models.Index(fields=['invoice'], name='invoice_hist_invoice_idx'),
        ),
        # ... more indexes
    ]
```

### Data Migration for Settings

```python
# migrations/0004_create_default_settings.py

from django.db import migrations

def create_default_settings(apps, schema_editor):
    """
    Create InvoiceSettings for all existing tenants
    """
    Tenant = apps.get_model('tenants', 'Tenant')
    InvoiceSettings = apps.get_model('invoices', 'InvoiceSettings')
    
    for tenant in Tenant.objects.all():
        InvoiceSettings.objects.get_or_create(
            tenant=tenant,
            defaults={
                'invoice_number_prefix': 'INV',
                'default_due_days': 30,
                'default_vat_rate': 12.00,  # Sri Lanka VAT
                'default_payment_terms': 'Net 30',
                # ... more defaults
            }
        )

def reverse_settings(apps, schema_editor):
    """
    Reverse migration - delete all settings
    """
    InvoiceSettings = apps.get_model('invoices', 'InvoiceSettings')
    InvoiceSettings.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('invoices', '0003_history_settings'),
    ]
    
    operations = [
        migrations.RunPython(create_default_settings, reverse_settings),
    ]
```

### Post-Migration Verification

```sql
-- Check InvoiceHistory table
SELECT COUNT(*) FROM invoice_history;

-- Check InvoiceSettings table
SELECT * FROM invoice_settings;

-- Verify indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'invoice_history';
```

### Expected Outcome
```
apps/invoices/migrations/
├── 0001_initial.py
├── 0002_invoice_line_items.py
├── 0003_history_settings.py
└── 0004_create_default_settings.py

Database Tables:
├── invoices_invoice
├── invoices_invoice_line_item
├── invoice_history               # New
└── invoice_settings               # New
```

### Verification Checklist
- [ ] Migrations generated successfully
- [ ] All models included
- [ ] Dependencies correct
- [ ] Migrations applied successfully
- [ ] Tables created in database
- [ ] Indexes created
- [ ] Data migration run
- [ ] Settings created for tenants
- [ ] Test retrieval works

---

## Summary

This document completed the Invoice Generation Services group with settings management, payment terms, and migrations.

**Key Deliverables:**
- InvoiceSettings model with comprehensive configuration
- Automatic due date calculation
- Payment terms text generation
- Database migrations applied
- Default settings for all tenants

**Group C Complete!**

**Next Steps:**
- Proceed to [Group D: Credit Notes & Debit Notes](../Group-D_Credit-Notes-Debit-Notes/)
