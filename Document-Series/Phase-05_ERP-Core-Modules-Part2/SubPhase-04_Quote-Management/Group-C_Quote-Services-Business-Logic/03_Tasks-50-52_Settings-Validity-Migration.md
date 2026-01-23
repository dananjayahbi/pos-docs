# Tasks 50-52: Settings, Validity & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** C - Quote Services & Business Logic  
> **Document:** 03 of 03  
> **Tasks Covered:** 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-44-49_Conversion-Revision-History.md](02_Tasks-44-49_Conversion-Revision-History.md)
- **→ Next Group:** [../Group-D_Quote-PDF-Generation/](../Group-D_Quote-PDF-Generation/)

---

## Document Overview

This document covers the implementation of QuoteSettings for tenant-level configuration, default validity period application, and running all service-layer migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 50 | Create Quote Settings Model | Medium | 25 min |
| 51 | Implement Default Validity Period | Medium | 20 min |
| 52 | Run Service Layer Migrations | Low | 15 min |

---

## Task 50: Create Quote Settings Model

### Overview
Create the QuoteSettings model for tenant-level configuration of quote defaults, numbering, and behavior.

### Dependencies
- Quote model exists
- Tenant model exists (multi-tenancy)

### Instructions

1. **Create settings.py model file**
   - Navigate to `apps/quotes/models/`
   - Create new file `settings.py`

2. **Import required modules**
   - Import Django model classes
   - Import validators
   - Import Tenant model

3. **Define QuoteSettings model**
   - One-to-one relationship with Tenant
   - Store tenant-specific configurations
   - Provide sensible defaults

4. **Add tenant relationship**
   - OneToOneField to Tenant
   - on_delete=models.CASCADE
   - related_name='quote_settings'
   - Primary configuration link

5. **Add default_validity_days field**
   - PositiveIntegerField
   - default=30
   - Validators: MinValueValidator(1), MaxValueValidator(365)
   - Help text: "Default quote validity period in days"

6. **Add quote_number_prefix field**
   - CharField(max_length=10)
   - default='QT'
   - Help text: "Prefix for quote numbers (e.g., QT, QUOTE)"

7. **Add quote_number_format field**
   - CharField(max_length=50)
   - default='{prefix}-{year}-{number:05d}'
   - Template for quote number generation

8. **Add auto_expire_enabled field**
   - BooleanField
   - default=True
   - Enable/disable automatic expiry

9. **Add require_approval field**
   - BooleanField
   - default=False
   - Require manager approval before sending

10. **Add default_terms_and_conditions**
    - TextField
    - blank=True
    - Default terms applied to new quotes

11. **Add default_discount_type and default_discount_value**
    - Optional default discount for all quotes
    - Can be overridden per quote

12. **Add allow_guest_quotes field**
    - BooleanField
    - default=True
    - Allow quotes without customer account

13. **Add email_settings fields (optional)**
    - send_quote_email_enabled
    - send_expiry_reminders
    - reminder_days_before_expiry

14. **Add Meta class**
    - verbose_name, verbose_name_plural
    - Optional ordering

15. **Add __str__ method**
    - Return f"Quote Settings for {tenant.name}"

16. **Add get_or_create_for_tenant class method**
    - Helper to get or create settings
    - Return settings with defaults

17. **Update models __init__.py**
    - Import QuoteSettings
    - Add to __all__

### Implementation

```python
# apps/quotes/models/settings.py

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class QuoteSettings(models.Model):
    """
    Tenant-level configuration for quote module.
    
    Stores default values, numbering format, and behavior
    settings for quotes within a tenant.
    """
    
    # Tenant relationship
    tenant = models.OneToOneField(
        'tenants.Tenant',
        on_delete=models.CASCADE,
        related_name='quote_settings',
        help_text="Tenant these settings belong to"
    )
    
    # Quote validity
    default_validity_days = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(1), MaxValueValidator(365)],
        help_text="Default quote validity period in days"
    )
    
    # Quote numbering
    quote_number_prefix = models.CharField(
        max_length=10,
        default='QT',
        help_text="Prefix for quote numbers (e.g., QT, QUOTE)"
    )
    
    quote_number_format = models.CharField(
        max_length=50,
        default='{prefix}-{year}-{number:05d}',
        help_text="Format template for quote numbers"
    )
    
    # Behavior settings
    auto_expire_enabled = models.BooleanField(
        default=True,
        help_text="Automatically expire quotes after validity period"
    )
    
    require_approval = models.BooleanField(
        default=False,
        help_text="Require manager approval before sending quotes"
    )
    
    allow_guest_quotes = models.BooleanField(
        default=True,
        help_text="Allow creating quotes without customer account"
    )
    
    # Default content
    default_terms_and_conditions = models.TextField(
        blank=True,
        help_text="Default terms & conditions for new quotes"
    )
    
    default_notes = models.TextField(
        blank=True,
        help_text="Default notes template for new quotes"
    )
    
    # Default discount (optional)
    default_discount_type = models.CharField(
        max_length=20,
        choices=[('PERCENTAGE', 'Percentage'), ('FIXED', 'Fixed Amount')],
        null=True,
        blank=True,
        help_text="Default discount type for new quotes"
    )
    
    default_discount_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Default discount value"
    )
    
    # Email settings
    send_quote_email_enabled = models.BooleanField(
        default=True,
        help_text="Enable email sending when quote sent"
    )
    
    send_expiry_reminders = models.BooleanField(
        default=True,
        help_text="Send reminders before quote expires"
    )
    
    reminder_days_before_expiry = models.PositiveIntegerField(
        default=3,
        help_text="Days before expiry to send reminder"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Quote Settings"
        verbose_name_plural = "Quote Settings"
    
    def __str__(self):
        return f"Quote Settings for {self.tenant.name}"
    
    @classmethod
    def get_or_create_for_tenant(cls, tenant):
        """
        Get or create quote settings for tenant.
        
        Args:
            tenant: Tenant instance
        
        Returns:
            QuoteSettings: Settings instance
        """
        settings, created = cls.objects.get_or_create(
            tenant=tenant,
            defaults={
                'default_validity_days': 30,
                'quote_number_prefix': 'QT',
                'auto_expire_enabled': True,
                'allow_guest_quotes': True,
            }
        )
        return settings
    
    def generate_quote_number(self, quote_count: int) -> str:
        """
        Generate quote number based on format template.
        
        Args:
            quote_count: Current quote count for numbering
        
        Returns:
            str: Generated quote number
        """
        from datetime import datetime
        
        return self.quote_number_format.format(
            prefix=self.quote_number_prefix,
            year=datetime.now().year,
            number=quote_count + 1
        )
```

### Configuration Options

| Setting | Type | Default | Purpose |
|---------|------|---------|---------|
| default_validity_days | Integer | 30 | Quote validity period |
| quote_number_prefix | String | 'QT' | Quote number prefix |
| quote_number_format | String | Template | Number format |
| auto_expire_enabled | Boolean | True | Auto-expire quotes |
| require_approval | Boolean | False | Approval workflow |
| allow_guest_quotes | Boolean | True | Guest quotes allowed |
| default_terms_and_conditions | Text | Empty | Default terms |
| send_quote_email_enabled | Boolean | True | Email on send |
| send_expiry_reminders | Boolean | True | Expiry reminders |

### Quote Number Format Examples

```python
# Format: {prefix}-{year}-{number:05d}
# Results: QT-2026-00001, QT-2026-00002, ...

# Format: {prefix}/{year}/{number:04d}
# Results: QT/2026/0001, QT/2026/0002, ...

# Format: {prefix}{year:02d}{number:03d}
# Results: QT26001, QT26002, ...
```

### Expected Outcome
```
apps/quotes/models/
├── __init__.py
├── quote.py
├── line_item.py
├── history.py
└── settings.py               # New model
```

### Verification Checklist
- [ ] settings.py file created
- [ ] QuoteSettings model defined
- [ ] OneToOneField to Tenant
- [ ] default_validity_days with validators
- [ ] quote_number_prefix field
- [ ] quote_number_format field
- [ ] auto_expire_enabled boolean
- [ ] require_approval boolean
- [ ] allow_guest_quotes boolean
- [ ] default_terms_and_conditions text
- [ ] default_discount fields
- [ ] Email settings fields
- [ ] Timestamps added
- [ ] __str__ method
- [ ] get_or_create_for_tenant() class method
- [ ] generate_quote_number() method
- [ ] Imported in models __init__.py

---

## Task 51: Implement Default Validity Period

### Overview
Implement automatic application of default validity period from QuoteSettings when creating new quotes.

### Dependencies
- Task 50: QuoteSettings model exists
- Task 38: Quote creation implemented

### Instructions

1. **Update Quote model with get_default_validity method**
   - Class method to get default validity days
   - Query QuoteSettings for tenant
   - Return default_validity_days or fallback to 30

2. **Add calculate_valid_until method**
   - Accept issue_date and validity_days
   - Calculate: issue_date + timedelta(days=validity_days)
   - Return future date

3. **Update QuoteService.create_quote**
   - Get validity_days from quote_data
   - If not provided, get from QuoteSettings
   - Calculate valid_until automatically
   - Set on quote

4. **Add apply_default_settings method to QuoteService**
   - Accept quote instance
   - Load QuoteSettings for tenant
   - Apply default terms if not provided
   - Apply default notes if not provided
   - Apply default discount if configured

5. **Update quote pre_save signal**
   - Auto-calculate valid_until if not set
   - Use default validity days

6. **Add override option**
   - Allow explicit validity_days in quote_data
   - Allow explicit valid_until date
   - Defaults only if not specified

7. **Add validation**
   - Ensure valid_until > issue_date
   - Warn if validity period > 365 days
   - Adjust if needed

### Implementation

```python
# In Quote model
@classmethod
def get_default_validity_days(cls, tenant):
    """
    Get default validity days for tenant.
    
    Args:
        tenant: Tenant instance
    
    Returns:
        int: Default validity days
    """
    from apps.quotes.models import QuoteSettings
    
    try:
        settings = QuoteSettings.objects.get(tenant=tenant)
        return settings.default_validity_days
    except QuoteSettings.DoesNotExist:
        return 30  # Fallback default

@classmethod
def calculate_valid_until(cls, issue_date, validity_days):
    """
    Calculate valid_until date.
    
    Args:
        issue_date: Quote issue date
        validity_days: Number of days valid
    
    Returns:
        date: Valid until date
    """
    from datetime import timedelta
    return issue_date + timedelta(days=validity_days)


# In QuoteService
def apply_default_settings(self, quote: Quote):
    """
    Apply default settings from QuoteSettings to quote.
    
    Args:
        quote: Quote instance to apply settings to
    """
    from apps.quotes.models import QuoteSettings
    
    # Get settings
    settings = QuoteSettings.get_or_create_for_tenant(quote.tenant)
    
    # Apply default terms if not set
    if not quote.terms_and_conditions:
        quote.terms_and_conditions = settings.default_terms_and_conditions
    
    # Apply default notes if not set
    if not quote.notes:
        quote.notes = settings.default_notes
    
    # Apply default discount if configured and not set
    if not quote.discount_type and settings.default_discount_type:
        quote.discount_type = settings.default_discount_type
        quote.discount_value = settings.default_discount_value or Decimal('0')
    
    # Calculate valid_until if not set
    if not quote.valid_until and quote.issue_date:
        validity_days = settings.default_validity_days
        quote.valid_until = Quote.calculate_valid_until(
            quote.issue_date,
            validity_days
        )

@transaction.atomic
def create_quote(
    self,
    quote_data: Dict,
    line_items: List[Dict],
    user: User
) -> Quote:
    """
    Create new quote with default settings applied.
    """
    # ... existing quote creation ...
    
    # Get validity days
    validity_days = quote_data.get('validity_days')
    
    if not validity_days:
        # Use default from settings
        settings = QuoteSettings.get_or_create_for_tenant(
            user.tenant  # or customer.tenant
        )
        validity_days = settings.default_validity_days
    
    # Calculate dates
    issue_date = timezone.now().date()
    valid_until = Quote.calculate_valid_until(issue_date, validity_days)
    
    # Create quote
    quote = Quote.objects.create(
        # ... other fields ...
        issue_date=issue_date,
        valid_until=valid_until,
        created_by=user
    )
    
    # Apply other default settings
    self.apply_default_settings(quote)
    quote.save()
    
    # ... continue with line items ...
    
    return quote
```

### Default Settings Application Flow

```
Create Quote
     │
     ▼
Check validity_days provided?
     │
  ┌──┴──┐
 No    Yes
  │      │
  │      └─→ Use provided
  │
  ▼
Get QuoteSettings for tenant
  │
  ▼
Use default_validity_days
  │
  ▼
Calculate valid_until
  │
  ▼
Apply default terms
  │
  ▼
Apply default notes
  │
  ▼
Apply default discount (if configured)
```

### Usage Examples

```python
# Quote uses tenant defaults
settings = QuoteSettings.get_or_create_for_tenant(tenant)
settings.default_validity_days = 45
settings.default_terms_and_conditions = "Payment due within 30 days..."
settings.save()

service = QuoteService()
quote = service.create_quote(
    quote_data={
        'customer_id': customer.id,
        'title': 'New Quote',
        # validity_days not specified - will use default 45
    },
    line_items=[...],
    user=user
)

# Quote automatically has:
assert quote.valid_until == quote.issue_date + timedelta(days=45)
assert quote.terms_and_conditions == settings.default_terms_and_conditions

# Override defaults
quote2 = service.create_quote(
    quote_data={
        'customer_id': customer.id,
        'title': 'Urgent Quote',
        'validity_days': 7,  # Override default
        'terms': 'Custom terms...'
    },
    line_items=[...],
    user=user
)

assert quote2.valid_until == quote2.issue_date + timedelta(days=7)
```

### Sri Lanka Context

```python
# Typical validity periods in Sri Lanka
settings.default_validity_days = 30  # Most common

# Short validity for volatile markets
settings.default_validity_days = 7

# Long validity for projects
settings.default_validity_days = 60

# Default terms in English and Sinhala
settings.default_terms_and_conditions = """
Payment Terms:
- 50% advance payment required
- Balance on delivery
- VAT (15%) included in total

ගෙවීම් කොන්දේසි:
- 50% අත්තිකාරම් ගෙවීම අවශ්‍යය
- ඉතිරිය බෙදා හැරීමේදී
- වැට් (15%) එකතු කර ඇත
"""
```

### Expected Outcome
```python
# Automatic defaults application
quote = service.create_quote(
    quote_data={'customer_id': customer.id, 'title': 'Quote'},
    line_items=[...],
    user=user
)

# Defaults applied:
quote.valid_until  # issue_date + 30 days (from settings)
quote.terms_and_conditions  # From settings
quote.notes  # From settings (if configured)
quote.discount_type  # From settings (if configured)
```

### Verification Checklist
- [ ] get_default_validity_days() class method
- [ ] calculate_valid_until() method
- [ ] apply_default_settings() in service
- [ ] Applies default validity days
- [ ] Applies default terms
- [ ] Applies default notes
- [ ] Applies default discount if configured
- [ ] Integrated into create_quote()
- [ ] Override option for explicit values
- [ ] Validation for valid_until > issue_date
- [ ] Fallback to 30 days if settings not found

---

## Task 52: Run Service Layer Migrations

### Overview
Generate and apply all database migrations for the service layer models (QuoteHistory, QuoteSettings).

### Dependencies
- Task 48: QuoteHistory model complete
- Task 50: QuoteSettings model complete

### Instructions

1. **Review model completeness**
   - Verify QuoteHistory model complete
   - Verify QuoteSettings model complete
   - Check all imports

2. **Review existing migrations**
   - Check `apps/quotes/migrations/` directory
   - Identify last migration number
   - Note any pending changes

3. **Generate migrations**
   - Run: `python manage.py makemigrations quotes`
   - Review generated migration file
   - Should include CreateModel for QuoteHistory and QuoteSettings

4. **Verify migration contents**
   - Check QuoteHistory model creation
   - Check QuoteSettings model creation
   - Verify ForeignKey relationships
   - Verify indexes

5. **Check migration dependencies**
   - Depends on previous quote migrations
   - Depends on tenants app migration
   - Depends on users app migration

6. **Add data migration (optional)**
   - Create initial QuoteSettings for existing tenants
   - Use RunPython operation
   - Populate with defaults

7. **Run migrations**
   - Execute: `python manage.py migrate quotes`
   - Verify successful application
   - Check for errors

8. **Verify database schema**
   - Check tables created:
     - quotes_quotehistory
     - quotes_quotesettings
   - Verify columns
   - Verify indexes
   - Check foreign keys

9. **Test model operations**
   - Create QuoteHistory entry
   - Create QuoteSettings for tenant
   - Verify relations work

10. **Commit migrations**
    - Add migration files to git
    - Commit with descriptive message

### Migration File Structure

```python
# apps/quotes/migrations/0003_history_settings.py

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    
    dependencies = [
        ('quotes', '0002_quotelineitem'),
        ('tenants', '0001_initial'),
        ('users', '0001_initial'),
    ]
    
    operations = [
        # QuoteHistory model
        migrations.CreateModel(
            name='QuoteHistory',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('event_type', models.CharField(
                    max_length=50,
                    choices=[
                        ('CREATED', 'Quote Created'),
                        ('UPDATED', 'Quote Updated'),
                        ('SENT', 'Sent to Customer'),
                        ('ACCEPTED', 'Customer Accepted'),
                        ('REJECTED', 'Customer Rejected'),
                        ('EXPIRED', 'Quote Expired'),
                        ('CONVERTED', 'Converted to Order'),
                        ('REVISION_CREATED', 'Revision Created'),
                        ('STATUS_CHANGED', 'Status Changed'),
                    ],
                    db_index=True
                )),
                ('timestamp', models.DateTimeField(
                    auto_now_add=True,
                    db_index=True
                )),
                ('old_values', models.JSONField(null=True, blank=True)),
                ('new_values', models.JSONField(null=True, blank=True)),
                ('notes', models.TextField(blank=True)),
                ('quote', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='history',
                    to='quotes.quote'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.SET_NULL,
                    null=True,
                    blank=True,
                    to='users.user'
                )),
            ],
            options={
                'ordering': ['-timestamp'],
                'verbose_name': 'Quote History',
                'verbose_name_plural': 'Quote History',
            },
        ),
        
        # QuoteSettings model
        migrations.CreateModel(
            name='QuoteSettings',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('default_validity_days', models.PositiveIntegerField(default=30)),
                ('quote_number_prefix', models.CharField(
                    max_length=10,
                    default='QT'
                )),
                ('quote_number_format', models.CharField(
                    max_length=50,
                    default='{prefix}-{year}-{number:05d}'
                )),
                ('auto_expire_enabled', models.BooleanField(default=True)),
                ('require_approval', models.BooleanField(default=False)),
                ('allow_guest_quotes', models.BooleanField(default=True)),
                ('default_terms_and_conditions', models.TextField(blank=True)),
                ('default_notes', models.TextField(blank=True)),
                ('default_discount_type', models.CharField(
                    max_length=20,
                    choices=[
                        ('PERCENTAGE', 'Percentage'),
                        ('FIXED', 'Fixed Amount')
                    ],
                    null=True,
                    blank=True
                )),
                ('default_discount_value', models.DecimalField(
                    max_digits=12,
                    decimal_places=2,
                    null=True,
                    blank=True
                )),
                ('send_quote_email_enabled', models.BooleanField(default=True)),
                ('send_expiry_reminders', models.BooleanField(default=True)),
                ('reminder_days_before_expiry', models.PositiveIntegerField(default=3)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tenant', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='quote_settings',
                    to='tenants.tenant'
                )),
            ],
            options={
                'verbose_name': 'Quote Settings',
                'verbose_name_plural': 'Quote Settings',
            },
        ),
        
        # Indexes
        migrations.AddIndex(
            model_name='quotehistory',
            index=models.Index(
                fields=['quote', '-timestamp'],
                name='quotes_quoh_quote_t_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='quotehistory',
            index=models.Index(
                fields=['event_type', '-timestamp'],
                name='quotes_quoh_event_t_idx'
            ),
        ),
    ]
```

### Data Migration (Optional)

```python
# apps/quotes/migrations/0004_create_default_settings.py

from django.db import migrations


def create_default_settings(apps, schema_editor):
    """Create QuoteSettings for all existing tenants."""
    Tenant = apps.get_model('tenants', 'Tenant')
    QuoteSettings = apps.get_model('quotes', 'QuoteSettings')
    
    for tenant in Tenant.objects.all():
        QuoteSettings.objects.get_or_create(
            tenant=tenant,
            defaults={
                'default_validity_days': 30,
                'quote_number_prefix': 'QT',
                'auto_expire_enabled': True,
                'allow_guest_quotes': True,
            }
        )


class Migration(migrations.Migration):
    
    dependencies = [
        ('quotes', '0003_history_settings'),
    ]
    
    operations = [
        migrations.RunPython(
            create_default_settings,
            reverse_code=migrations.RunPython.noop
        ),
    ]
```

### Migration Commands

```bash
# Generate migrations
python manage.py makemigrations quotes

# View migration SQL (optional)
python manage.py sqlmigrate quotes 0003

# Check for issues
python manage.py check

# Apply migrations
python manage.py migrate quotes

# Verify
python manage.py showmigrations quotes
```

### Database Verification

```sql
-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'quotes_%';

-- Result should include:
-- quotes_quote
-- quotes_quotelineitem
-- quotes_quotehistory
-- quotes_quotesettings

-- Check QuoteHistory structure
\d quotes_quotehistory

-- Check QuoteSettings structure
\d quotes_quotesettings
```

### Test Operations

```python
# In Django shell
from apps.quotes.models import Quote, QuoteHistory, QuoteSettings
from apps.tenants.models import Tenant

# Test QuoteSettings
tenant = Tenant.objects.first()
settings = QuoteSettings.get_or_create_for_tenant(tenant)
print(settings.default_validity_days)  # 30

# Test QuoteHistory
quote = Quote.objects.first()
QuoteHistory.objects.create(
    quote=quote,
    event_type=QuoteHistory.CREATED,
    notes="Test history entry"
)

history = quote.history.all()
print(history.count())  # Should show entries
```

### Expected Outcome

After successful migration:
- `quotes_quotehistory` table exists
- `quotes_quotesettings` table exists
- All fields present with correct types
- Foreign keys functional
- Indexes created
- Models queryable
- Default settings can be created

### Verification Checklist
- [ ] All model files reviewed for completeness
- [ ] makemigrations executed
- [ ] Migration file generated (0003_history_settings.py)
- [ ] Migration includes QuoteHistory model
- [ ] Migration includes QuoteSettings model
- [ ] Dependencies correct
- [ ] Indexes included
- [ ] Optional data migration created
- [ ] migrate executed successfully
- [ ] No migration errors
- [ ] Database tables verified
- [ ] Columns present
- [ ] Foreign keys functional
- [ ] Test operations successful
- [ ] Migration files committed to git

---

## Summary

After completing Tasks 50-52, the Quote module will have:

### Quote Settings
- QuoteSettings model for tenant configuration
- One-to-one with Tenant
- Configurable defaults:
  - Validity period (30 days default)
  - Quote number format
  - Terms and conditions
  - Email settings
  - Discount defaults
- get_or_create_for_tenant() helper

### Default Validity
- Automatic validity period application
- calculate_valid_until() method
- apply_default_settings() service method
- Override capability
- Fallback to 30 days

### Database Schema
- QuoteHistory table migrated
- QuoteSettings table migrated
- All relationships functional
- Indexes for performance
- Optional default data created

### Configuration Examples

```python
# Per-tenant configuration
tenant = Tenant.objects.get(name="ABC Company")
settings = QuoteSettings.get_or_create_for_tenant(tenant)

settings.default_validity_days = 45
settings.quote_number_prefix = "QUOTE"
settings.default_terms_and_conditions = """
  Payment Terms:
  - 50% advance
  - Balance on delivery
  - VAT 15% included
"""
settings.auto_expire_enabled = True
settings.send_expiry_reminders = True
settings.save()

# New quotes automatically use these settings
```

### Complete Service Layer

Group C is now complete with:
- QuoteService with all business operations
- Status transition management
- Quote to order conversion
- Inventory validation
- Quote revision system
- Quote locking mechanism
- Complete history tracking
- Tenant-level configuration
- Default settings application

### Next Steps
Proceed to [Group-D_Quote-PDF-Generation/](../Group-D_Quote-PDF-Generation/) to implement professional PDF generation for quotes.
