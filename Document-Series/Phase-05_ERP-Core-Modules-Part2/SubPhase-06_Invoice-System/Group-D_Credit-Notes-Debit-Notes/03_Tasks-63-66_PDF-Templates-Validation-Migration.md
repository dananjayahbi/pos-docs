# Tasks 63-66: PDF Templates, Validation & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** D - Credit Notes & Debit Notes  
> **Document:** 03 of 03  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-57-62_Debit-Note-Balance.md](02_Tasks-57-62_Debit-Note-Balance.md)
- **→ Next Group:** [../Group-E_Invoice-PDF-Email/](../Group-E_Invoice-PDF-Email/)

---

## Document Overview

This document covers PDF template creation for credit and debit notes, validation rules, and database migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|----------||-----------|
| 63 | Create Credit Note PDF Template | Medium | 30 min |
| 64 | Create Debit Note PDF Template | Medium | 30 min |
| 65 | Implement Credit Limit Check | Medium | 25 min |
| 66 | Run Credit/Debit Note Migrations | Low | 15 min |

---

## Task 63: Create Credit Note PDF Template

### Overview
Create HTML/CSS template for generating professional credit note PDFs with proper formatting and Sri Lankan localization.

### Dependencies
- Task 53: Implement Credit Note Creation
- Task 72: Create InvoicePDFGenerator Service (Group E)

### Instructions

1. **Create template file**
   - Create `apps/invoices/templates/pdf/credit_note.html`
   - Base on invoice template structure
   - Customize for credit notes

2. **Design header section**
   - Title: "CREDIT NOTE" (prominent)
   - Credit note number
   - Credit note date
   - Reference to original invoice
   - Visual distinction (green accent color)

3. **Add original invoice reference**
   - Section showing original invoice details
   - Invoice number, date, original amount
   - Clear reference to what's being credited

4. **Design credit reason section**
   - Display credit reason prominently
   - Show reason notes/explanation
   - Customer-friendly language

5. **Design line items table**
   - Same structure as invoice
   - Show negative amounts clearly
   - Use red/negative formatting
   - Include: Description, Qty, Rate, Amount

6. **Design totals section**
   - Subtotal (negative)
   - Tax breakdown (negative)
   - Total credit amount (prominently displayed)
   - Use green color for credit amounts

7. **Add footer notes**
   - "This credit note reduces your outstanding balance"
   - Instructions on how credit is applied
   - Contact information for queries

8. **Add styling**
   - Green accent color (#28a745)
   - Clear negative number formatting
   - Professional layout
   - Print-friendly

9. **Support Sinhala/Tamil**
   - RTL support if needed
   - Unicode fonts
   - Translated labels

10. **Test rendering**
    - Generate sample credit note
    - Verify all fields display
    - Check PDF output quality

### Credit Note Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Credit note specific styles */
        .credit-note-header {
            background-color: #d4edda;
            border-left: 5px solid #28a745;
        }
        .credit-amount {
            color: #28a745;
            font-weight: bold;
        }
        .negative-amount {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="credit-note-header">
        <h1>CREDIT NOTE</h1>
        <p>Credit Note #: {{ credit_note.invoice_number }}</p>
        <p>Date: {{ credit_note.issue_date }}</p>
    </div>
    
    <div class="original-invoice-ref">
        <h3>Original Invoice Reference</h3>
        <p>Invoice #: {{ original_invoice.invoice_number }}</p>
        <p>Invoice Date: {{ original_invoice.issue_date }}</p>
        <p>Original Amount: LKR {{ original_invoice.total_amount }}</p>
    </div>
    
    <div class="credit-reason">
        <h3>Reason for Credit</h3>
        <p><strong>{{ credit_note.get_credit_note_reason_display }}</strong></p>
        <p>{{ credit_note.reason_notes }}</p>
    </div>
    
    <!-- Billing sections -->
    <!-- Line items table -->
    <!-- Totals -->
    <!-- Footer -->
</body>
</html>
```

### Visual Design Elements

| Element | Style |
|---------|-------|
| Header background | Light green (#d4edda) |
| Border accent | Green (#28a745) |
| Title | "CREDIT NOTE" in bold |
| Amounts | Red for negative, green for credit |
| Icon | Minus sign or return icon |

### Expected Outcome
- Professional credit note PDF template
- Clear visual distinction from invoices
- All required information displayed
- Print-ready format

### Verification Checklist
- [ ] Template file created
- [ ] Header section designed
- [ ] Original invoice reference included
- [ ] Credit reason displayed
- [ ] Line items table formatted
- [ ] Totals section styled
- [ ] Green accent colors applied
- [ ] Footer notes added
- [ ] Test PDF generated successfully

---

## Task 64: Create Debit Note PDF Template

### Overview
Create HTML/CSS template for generating professional debit note PDFs with proper formatting and clear indication of additional charges.

### Dependencies
- Task 57: Implement Debit Note Creation
- Task 63: Create Credit Note PDF Template

### Instructions

1. **Create template file**
   - Create `apps/invoices/templates/pdf/debit_note.html`
   - Similar structure to credit note
   - Customize for debit notes

2. **Design header section**
   - Title: "DEBIT NOTE" (prominent)
   - Debit note number
   - Debit note date
   - Reference to original invoice
   - Visual distinction (orange accent color)

3. **Add original invoice reference**
   - Section showing original invoice details
   - Invoice number, date, original amount
   - Current balance before debit

4. **Design debit reason section**
   - Display debit reason prominently
   - Show reason notes/explanation
   - Clear justification for additional charge

5. **Design line items table**
   - Show additional charges
   - Positive amounts
   - Clear description of each charge
   - Include: Description, Qty, Rate, Amount

6. **Design totals section**
   - Subtotal (positive)
   - Tax breakdown (positive)
   - Total debit amount (prominently displayed)
   - Use orange/warning color

7. **Add footer notes**
   - "This debit note increases your outstanding balance"
   - New total amount due
   - Payment instructions
   - Due date for additional amount

8. **Add styling**
   - Orange accent color (#fd7e14)
   - Warning indicators
   - Professional layout
   - Print-friendly

9. **Test rendering**
   - Generate sample debit note
   - Verify all fields display
   - Check PDF output quality

### Debit Note Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Debit note specific styles */
        .debit-note-header {
            background-color: #fff3cd;
            border-left: 5px solid #fd7e14;
        }
        .debit-amount {
            color: #fd7e14;
            font-weight: bold;
        }
        .additional-charge {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="debit-note-header">
        <h1>DEBIT NOTE</h1>
        <p>Debit Note #: {{ debit_note.invoice_number }}</p>
        <p>Date: {{ debit_note.issue_date }}</p>
    </div>
    
    <div class="original-invoice-ref">
        <h3>Original Invoice Reference</h3>
        <p>Invoice #: {{ original_invoice.invoice_number }}</p>
        <p>Invoice Date: {{ original_invoice.issue_date }}</p>
        <p>Original Amount: LKR {{ original_invoice.total_amount }}</p>
        <p>Balance Before This Note: LKR {{ original_invoice.balance_due }}</p>
    </div>
    
    <div class="debit-reason">
        <h3>Reason for Additional Charge</h3>
        <p><strong>{{ debit_note.get_debit_note_reason_display }}</strong></p>
        <p>{{ debit_note.reason_notes }}</p>
    </div>
    
    <!-- Line items for additional charges -->
    <!-- Totals -->
    
    <div class="new-balance">
        <h3>New Total Amount Due</h3>
        <p class="debit-amount">LKR {{ original_invoice.balance_due + debit_note.total_amount }}</p>
    </div>
    
    <!-- Footer -->
</body>
</html>
```

### Visual Design Elements

| Element | Style |
|---------|-------|
| Header background | Light orange/yellow (#fff3cd) |
| Border accent | Orange (#fd7e14) |
| Title | "DEBIT NOTE" in bold |
| Amounts | Orange for additions |
| Icon | Plus sign or add icon |

### Credit vs Debit Note Comparison

| Aspect | Credit Note | Debit Note |
|--------|-------------|------------|
| Color theme | Green | Orange |
| Direction | Reduces balance | Increases balance |
| Symbol | Minus (-) | Plus (+) |
| Customer perception | Positive | Negative |
| Footer message | "Reduces balance" | "Increases balance" |

### Expected Outcome
- Professional debit note PDF template
- Clear visual distinction from invoices and credit notes
- Additional charges clearly explained
- Print-ready format

### Verification Checklist
- [ ] Template file created
- [ ] Header section designed
- [ ] Original invoice reference included
- [ ] Debit reason displayed
- [ ] Line items table formatted
- [ ] New balance prominently shown
- [ ] Orange accent colors applied
- [ ] Footer notes added
- [ ] Test PDF generated successfully

---

## Task 65: Implement Credit Limit Check

### Overview
Implement validation to ensure credit notes don't exceed the remaining balance of the original invoice.

### Dependencies
- Task 53: Implement Credit Note Creation

### Instructions

1. **Create validation method**
   - Add `validate_credit_amount()` to CreditNoteService
   - Accept original_invoice and credit_amount
   - Return validation result

2. **Calculate maximum credit**
   - Get original invoice total
   - Subtract existing credits
   - Subtract payments made
   - Result is maximum allowable credit

3. **Check credit amount**
   - Ensure credit_amount <= max_credit
   - Raise ValidationError if exceeded
   - Provide clear error message

4. **Consider pending credits**
   - Include unapplied credit notes
   - Prevent over-crediting
   - Account for pending approvals

5. **Add override option**
   - For admin/manager users
   - Allow credit beyond limit with approval
   - Log override action

6. **Handle edge cases**
   - Invoice fully paid: max_credit = 0
   - Invoice with debits: adjust calculation
   - Multiple simultaneous credits

7. **Add to creation workflow**
   - Call validation in create_credit_note()
   - Before creating credit note record
   - Prevent invalid credits

8. **Provide helpful messages**
   - "Maximum credit available: LKR X"
   - "Requested credit exceeds remaining balance"
   - Suggest correct amount

9. **Log validation failures**
   - Track attempted over-credits
   - Monitor for fraud attempts
   - Alert on repeated violations

### Validation Logic

```python
def validate_credit_amount(original_invoice, credit_amount, include_pending=True):
    """
    Validate that credit amount doesn't exceed remaining balance
    
    Args:
        original_invoice: Invoice instance
        credit_amount: Proposed credit amount (positive)
        include_pending: Include pending credits in calculation
        
    Returns:
        tuple: (is_valid, max_credit, error_message)
    """
    # Calculate maximum allowable credit
    max_credit = original_invoice.total_amount
    
    # Subtract payments
    max_credit -= original_invoice.amount_paid
    
    # Subtract existing applied credits
    existing_credits = original_invoice.get_credit_notes().filter(
        is_applied=True
    ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0')
    max_credit -= abs(existing_credits)
    
    # Optionally subtract pending credits
    if include_pending:
        pending_credits = original_invoice.get_credit_notes().filter(
            is_applied=False
        ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0')
        max_credit -= abs(pending_credits)
    
    # Validate
    if credit_amount > max_credit:
        error_msg = (
            f"Credit amount LKR {credit_amount:,.2f} exceeds "
            f"maximum allowable credit of LKR {max_credit:,.2f}. "
            f"Original invoice: {original_invoice.invoice_number}"
        )
        return False, max_credit, error_msg
    
    return True, max_credit, None


def create_credit_note(original_invoice_id, reason, amount, **kwargs):
    """
    Create credit note with validation
    """
    original = Invoice.objects.get(id=original_invoice_id)
    
    # Validate credit amount
    is_valid, max_credit, error = validate_credit_amount(original, amount)
    
    if not is_valid:
        # Check for override permission
        if not kwargs.get('override') or not has_override_permission(kwargs.get('user')):
            raise ValidationError(error)
        else:
            # Log override
            log_credit_override(original, amount, max_credit, kwargs.get('user'))
    
    # Proceed with creation
    # ... (rest of creation logic)
```

### Maximum Credit Calculation

```
max_credit = original_total 
           - amount_paid 
           - applied_credits 
           - pending_credits (optional)
           + applied_debits
```

### Validation Examples

#### Example 1: Valid Credit
```
Original Total: LKR 50,000
Payments: LKR 20,000
Existing Credits: LKR 0
Requested Credit: LKR 15,000
Max Available: LKR 30,000
Result: ✓ Valid
```

#### Example 2: Invalid Credit
```
Original Total: LKR 50,000
Payments: LKR 40,000
Existing Credits: LKR 5,000
Requested Credit: LKR 10,000
Max Available: LKR 5,000
Result: ✗ Invalid (exceeds by LKR 5,000)
```

#### Example 3: With Pending Credits
```
Original Total: LKR 50,000
Payments: LKR 0
Applied Credits: LKR 10,000
Pending Credits: LKR 15,000
Requested Credit: LKR 30,000
Max Available: LKR 25,000 (if including pending)
Result: ✗ Invalid
```

### Expected Outcome
- Credit amount validation implemented
- Over-crediting prevented
- Clear error messages
- Override capability for authorized users

### Verification Checklist
- [ ] `validate_credit_amount()` method implemented
- [ ] Maximum credit calculated correctly
- [ ] Validation enforced in creation
- [ ] Error messages clear and helpful
- [ ] Override option implemented
- [ ] Pending credits considered
- [ ] Edge cases handled
- [ ] Validation failures logged

---

## Task 66: Run Credit/Debit Note Migrations

### Overview
Create and apply database migrations for credit/debit note functionality including model fields, indexes, and constraints.

### Dependencies
- All previous Group D tasks

### Instructions

1. **Review model changes**
   - Invoice model updates (related_invoice FK)
   - Reason fields (credit_note_reason, debit_note_reason)
   - Applied tracking fields (is_applied, applied_at, applied_by)
   - Balance fields (total_credits_applied, total_debits_applied)

2. **Generate migrations**
   - Run `python manage.py makemigrations invoices`
   - Review generated migration file
   - Verify all fields captured

3. **Add model constraints**
   - Check constraint: credit notes have negative totals
   - Check constraint: debit notes have positive totals
   - Unique constraint on invoice_number per tenant

4. **Add indexes**
   - Index on related_invoice FK
   - Index on type + related_invoice (for queries)
   - Index on is_applied flag

5. **Add data validation**
   - Check existing invoices
   - Ensure no data conflicts
   - Backup database before migration

6. **Run migrations**
   - Run `python manage.py migrate invoices`
   - Verify successful application
   - Check tables updated

7. **Verify database changes**
   - Check new fields exist
   - Check indexes created
   - Check constraints active

8. **Create initial data**
   - Update InvoiceSettings with credit/debit prefixes
   - Initialize sequence counters
   - Test credit/debit note creation

9. **Run tests**
   - Test credit note creation
   - Test debit note creation
   - Test balance recalculation
   - Test PDF generation

10. **Document migration**
    - Add migration notes
    - Document any manual steps
    - Update schema diagrams

### Migration File Structure

```python
# migrations/0004_credit_debit_notes.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('invoices', '0003_history_settings'),
    ]
    
    operations = [
        # Add related_invoice FK
        migrations.AddField(
            model_name='invoice',
            name='related_invoice',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name='adjustments',
                to='invoices.invoice'
            ),
        ),
        
        # Add reason fields
        migrations.AddField(
            model_name='invoice',
            name='credit_note_reason',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='invoice',
            name='debit_note_reason',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='invoice',
            name='reason_notes',
            field=models.TextField(blank=True),
        ),
        
        # Add application tracking
        migrations.AddField(
            model_name='invoice',
            name='is_applied',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='invoice',
            name='applied_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='invoice',
            name='applied_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='applied_notes',
                to=settings.AUTH_USER_MODEL
            ),
        ),
        
        # Add balance tracking
        migrations.AddField(
            model_name='invoice',
            name='total_credits_applied',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='invoice',
            name='total_debits_applied',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='invoice',
            index=models.Index(fields=['related_invoice'], name='invoice_related_idx'),
        ),
        migrations.AddIndex(
            model_name='invoice',
            index=models.Index(fields=['type', 'related_invoice'], name='invoice_type_related_idx'),
        ),
    ]
```

### Post-Migration Updates

```python
# migrations/0005_update_invoice_settings.py

from django.db import migrations

def update_settings(apps, schema_editor):
    """Add credit/debit note prefixes to existing settings"""
    InvoiceSettings = apps.get_model('invoices', 'InvoiceSettings')
    
    for settings in InvoiceSettings.objects.all():
        if not settings.credit_note_prefix:
            settings.credit_note_prefix = 'CN'
        if not settings.debit_note_prefix:
            settings.debit_note_prefix = 'DN'
        settings.save()

class Migration(migrations.Migration):
    dependencies = [
        ('invoices', '0004_credit_debit_notes'),
    ]
    
    operations = [
        migrations.RunPython(update_settings),
    ]
```

### Verification Queries

```sql
-- Check new fields
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'invoices_invoice' 
AND column_name IN ('related_invoice_id', 'credit_note_reason', 'is_applied');

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'invoices_invoice' 
AND indexname LIKE '%related%';

-- Test credit note linkage
SELECT i1.invoice_number as original, 
       i2.invoice_number as credit_note,
       i2.total_amount as credit_amount
FROM invoices_invoice i1
JOIN invoices_invoice i2 ON i2.related_invoice_id = i1.id
WHERE i2.type = 'CREDIT_NOTE';
```

### Expected Outcome
```
apps/invoices/migrations/
├── 0001_initial.py
├── 0002_invoice_line_items.py
├── 0003_history_settings.py
├── 0004_credit_debit_notes.py
└── 0005_update_invoice_settings.py

Database Updates:
├── New fields added to invoice table
├── Indexes created
├── InvoiceSettings updated
└── Tests passing
```

### Verification Checklist
- [ ] Migrations generated successfully
- [ ] All fields included
- [ ] Indexes defined
- [ ] Migrations applied successfully
- [ ] Database schema updated
- [ ] InvoiceSettings updated
- [ ] Test credit note creates
- [ ] Test debit note creates
- [ ] Balance recalculation works
- [ ] PDF templates render

---

## Summary

This document completed Group D with PDF templates, validation, and migrations.

**Key Deliverables:**
- Credit note PDF template with green theme
- Debit note PDF template with orange theme
- Credit limit validation
- Database migrations applied
- All fields, indexes, and constraints in place

**Group D Complete!**

**Next Steps:**
- Proceed to [Group E: Invoice PDF & Email](../Group-E_Invoice-PDF-Email/)
