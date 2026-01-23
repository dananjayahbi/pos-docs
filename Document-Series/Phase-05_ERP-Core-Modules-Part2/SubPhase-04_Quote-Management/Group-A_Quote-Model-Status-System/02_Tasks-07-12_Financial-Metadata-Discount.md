# Tasks 07-12: Financial, Metadata & Discount

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** A - Quote Model & Status System  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_PDF-Email-Conversion-Migration.md](03_Tasks-13-18_PDF-Email-Conversion-Migration.md)

---

## Document Overview

This document covers adding financial calculation fields, metadata for notes and terms, user tracking references, currency support, discount configuration, and automatic quote number generation functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add Quote Financial Summary Fields | Medium | 20 min |
| 08 | Add Quote Metadata Fields | Medium | 20 min |
| 09 | Add Quote User Reference Fields | Medium | 20 min |
| 10 | Add Quote Currency Field | Low | 15 min |
| 11 | Add Quote Discount Fields | Medium | 20 min |
| 12 | Create Quote Number Generator | Medium | 25 min |

---

## Task 07: Add Quote Financial Summary Fields

### Overview
Add calculated financial summary fields to store the quote's subtotal, discount amount, tax amount, and final total.

### Dependencies
- Task 04: Create Quote Model Core Fields

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Import DecimalField for currency**
   - Already available from django.db.models

3. **Add subtotal field**
   - DecimalField with max_digits=12, decimal_places=2
   - Set `default=0.00`
   - Add help_text explaining calculation
   - Represents sum of all line items before discount/tax

4. **Add discount_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Set `default=0.00`
   - Add help_text explaining it's calculated from discount fields
   - Represents total discount applied at quote level

5. **Add tax_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Set `default=0.00`
   - Add help_text explaining tax calculation
   - Represents total tax (VAT) calculated on taxable amount

6. **Add total field**
   - DecimalField with max_digits=12, decimal_places=2
   - Set `default=0.00`
   - Add db_index=True for filtering by amount
   - Add help_text with calculation formula
   - Represents final payable amount

7. **Add field grouping comment**
   - Add comment: "# Financial summary fields"
   - Improves code organization and readability

8. **Document calculation logic in docstring**
   - Add section explaining financial calculations
   - Document formula: total = subtotal - discount_amount + tax_amount

### Financial Calculation Flow

```
┌─────────────────────────────────────────────┐
│         Quote Financial Calculation         │
└─────────────────────────────────────────────┘

Step 1: Calculate Subtotal
┌──────────────────────────────────────┐
│ Subtotal = Σ(line_item.total)       │
│                                      │
│ Sum of all line items:               │
│ Item 1: qty × price = 1000.00        │
│ Item 2: qty × price = 2000.00        │
│ Item 3: qty × price =  500.00        │
│ ────────────────────────────         │
│ Subtotal:           3500.00          │
└──────────────┬───────────────────────┘
               │
               ▼
Step 2: Apply Discount
┌──────────────────────────────────────┐
│ If discount_type = 'PERCENTAGE':     │
│   discount_amount = subtotal × %     │
│                                      │
│ If discount_type = 'FIXED':          │
│   discount_amount = fixed value      │
│                                      │
│ Example (10% discount):              │
│ 3500.00 × 0.10 = 350.00              │
└──────────────┬───────────────────────┘
               │
               ▼
Step 3: Calculate Taxable Amount
┌──────────────────────────────────────┐
│ taxable_amount = subtotal -          │
│                  discount_amount     │
│                                      │
│ Example:                             │
│ 3500.00 - 350.00 = 3150.00           │
└──────────────┬───────────────────────┘
               │
               ▼
Step 4: Calculate Tax
┌──────────────────────────────────────┐
│ tax_amount = taxable_amount × tax_rate│
│                                      │
│ Example (15% VAT):                   │
│ 3150.00 × 0.15 = 472.50              │
└──────────────┬───────────────────────┘
               │
               ▼
Step 5: Calculate Total
┌──────────────────────────────────────┐
│ total = subtotal -                   │
│         discount_amount +            │
│         tax_amount                   │
│                                      │
│ Example:                             │
│ 3500.00 - 350.00 + 472.50 = 3622.50  │
└──────────────────────────────────────┘
```

### Financial Fields Summary

| Field | Purpose | Example | Formula |
|-------|---------|---------|---------|
| **subtotal** | Line items sum | 3500.00 | Σ(qty × price) |
| **discount_amount** | Total discount | 350.00 | Calculated from discount fields |
| **tax_amount** | VAT/Tax | 472.50 | (subtotal - discount) × tax_rate |
| **total** | Final amount | 3622.50 | subtotal - discount + tax |

### DecimalField Configuration

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| max_digits | 12 | Supports up to 999,999,999.99 |
| decimal_places | 2 | Standard currency precision |
| default | 0.00 | Safe default, never null |

**Max Digits Breakdown:**
- 12 total digits
- 2 decimal places
- 10 digits for whole number (up to ~10 billion)

### Currency Precision

| Currency | Decimal Places | Example |
|----------|----------------|---------|
| LKR (₨) | 2 | 1,234.56 |
| USD ($) | 2 | 1,234.56 |
| JPY (¥) | 0 | 1,235 |
| BHD (BD) | 3 | 1,234.567 |

**Sri Lanka Standard:** 2 decimal places for LKR

### Rounding Strategy

| Scenario | Method | Example |
|----------|--------|---------|
| Discount calculation | Round half-up | 350.445 → 350.45 |
| Tax calculation | Round half-up | 472.495 → 472.50 |
| Final total | Round half-up | 3622.495 → 3622.50 |
| Line item subtotal | Round half-up | Per line item |

**Python Implementation:**
```python
from decimal import Decimal, ROUND_HALF_UP

amount = Decimal('350.445')
rounded = amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
# Result: Decimal('350.45')
```

### Calculation Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Subtotal ≥ 0 | Always positive or zero | "Subtotal cannot be negative" |
| Discount ≤ Subtotal | Cannot exceed subtotal | "Discount exceeds subtotal" |
| Tax ≥ 0 | Always positive or zero | "Tax cannot be negative" |
| Total ≥ 0 | Final amount positive | "Total cannot be negative" |

### Denormalization Justification

**Why store calculated values?**

| Benefit | Explanation |
|---------|-------------|
| **Performance** | Avoid recalculation on every query |
| **Historical Accuracy** | Quote amounts locked after sending |
| **Query Efficiency** | Filter/sort by total without joins |
| **PDF Generation** | Direct access without calculation |
| **Audit Trail** | Exact amounts at time of creation |

**Trade-off:** Must recalculate when line items change (in DRAFT only)

### Expected Field Additions
```python
# Financial summary fields (in Quote model)
subtotal = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    default=0.00,
    help_text="Sum of all line items before discount and tax"
)

discount_amount = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    default=0.00,
    help_text="Total discount amount (calculated from discount fields)"
)

tax_amount = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    default=0.00,
    help_text="Total tax/VAT amount"
)

total = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    default=0.00,
    db_index=True,
    help_text="Final total (subtotal - discount + tax)"
)
```

### Verification Checklist
- [ ] subtotal field added (DecimalField)
- [ ] discount_amount field added (DecimalField)
- [ ] tax_amount field added (DecimalField)
- [ ] total field added (DecimalField)
- [ ] All fields have max_digits=12, decimal_places=2
- [ ] All fields have default=0.00
- [ ] total field has db_index=True
- [ ] help_text added to all fields
- [ ] Fields grouped with comment

---

## Task 08: Add Quote Metadata Fields

### Overview
Add metadata fields for storing notes, terms and conditions, internal notes, and tags to provide additional context for quotes.

### Dependencies
- Task 04: Create Quote Model Core Fields

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Add notes field**
   - TextField for customer-visible notes
   - Set `blank=True, null=True`
   - Add help_text explaining visibility to customer
   - Supports Markdown formatting

3. **Add terms field**
   - TextField for terms and conditions
   - Set `blank=True, null=True`
   - Add help_text about inclusion in PDF
   - Can use template or custom per quote

4. **Add internal_notes field**
   - TextField for internal team notes
   - Set `blank=True, null=True`
   - Add help_text explaining it's staff-only
   - Never visible to customer

5. **Add tags field**
   - CharField with max_length=200
   - Set `blank=True, null=True`
   - Add help_text about comma-separated format
   - For categorization and filtering

6. **Add attachment_count field**
   - IntegerField for tracking number of attachments
   - Set `default=0`
   - Add help_text explaining denormalized count
   - Updated when attachments added/removed

7. **Add field grouping comment**
   - Add comment: "# Metadata fields"
   - Improve code organization

### Metadata Field Categories

| Category | Fields | Visibility | Purpose |
|----------|--------|------------|---------|
| **Customer-Facing** | notes, terms | Public | Shown in quote PDF |
| **Internal** | internal_notes | Private | Staff collaboration |
| **Organization** | tags | Private | Categorization |
| **Stats** | attachment_count | Private | Quick reference |

### Notes Field Usage

**Purpose:** Additional information for the customer

**Examples:**
- "Prices valid for 30 days from issue date"
- "Installation included in pricing"
- "Custom color options available upon request"
- "Delivery within Colombo city limits: 3-5 business days"

**Format:** Plain text or Markdown

**Markdown Support:**
```markdown
## Special Offers

- **Free delivery** for orders over LKR 50,000
- 10% discount for payment within 7 days

### Warranty
All items come with 1-year manufacturer warranty.
```

### Terms Field Usage

**Purpose:** Legal terms and conditions

**Common Sri Lanka Terms:**
- Payment terms (Net 30, advance payment)
- Delivery terms (FOB, CIF)
- Warranty conditions
- Return policy
- Jurisdiction (Sri Lankan law applies)
- Dispute resolution

**Template vs Custom:**
| Approach | When to Use |
|----------|-------------|
| **Template** | Standard terms for all quotes |
| **Custom** | Special terms for specific quote |
| **Hybrid** | Template + quote-specific additions |

**Example Terms:**
```
TERMS AND CONDITIONS

1. PAYMENT
   - 50% advance payment required
   - Balance due within 30 days of delivery

2. DELIVERY
   - Delivery within Colombo: 5-7 business days
   - Outstation delivery: 10-14 business days

3. WARRANTY
   - All products carry 1-year warranty
   - Warranty void if tampered

4. GOVERNING LAW
   - Governed by laws of Sri Lanka
   - Disputes subject to Colombo jurisdiction
```

### Internal Notes Field Usage

**Purpose:** Staff communication and reminders

**Never Shown To Customer:** Only visible in admin/staff interface

**Examples:**
- "Customer negotiated 15% discount - approved by manager"
- "Follow up on Friday if no response"
- "VIP customer - priority processing"
- "Customer mentioned competitor quote at LKR 45,000"
- "Check inventory before confirming"

**Collaboration:** Multiple staff members can add notes over time

### Tags Field Usage

**Purpose:** Categorization and filtering

**Format:** Comma-separated values

**Examples:**
```
wholesale, urgent, approved
government, tender, high-value
retail, walk-in, sinhala-preferred
export, USD, shipping-required
```

**Tag Categories:**

| Category | Example Tags |
|----------|--------------|
| **Customer Type** | wholesale, retail, government, export |
| **Priority** | urgent, high-priority, routine |
| **Status Flags** | approved, pending-review, requires-approval |
| **Special Handling** | sinhala-preferred, rush-delivery, fragile |
| **Value** | high-value, budget, standard |

**Filtering Examples:**
- Show all "urgent" quotes
- List "wholesale" quotes from last month
- Find "pending-review" quotes over LKR 100,000

### Attachment Count Field

**Purpose:** Denormalized count for quick reference

**Updated When:**
- Quote document attached (PDF, images, specs)
- Supporting document added
- Attachment deleted

**Why Denormalize?**
- Avoid counting query on every quote list
- Quick display in tables
- Performance optimization

**Update Logic:**
```python
# When attachment added
quote.attachment_count += 1
quote.save(update_fields=['attachment_count'])

# When attachment removed
quote.attachment_count -= 1
quote.save(update_fields=['attachment_count'])

# Sync check (maintenance task)
actual_count = quote.attachments.count()
if quote.attachment_count != actual_count:
    quote.attachment_count = actual_count
    quote.save(update_fields=['attachment_count'])
```

### TextField vs CharField

| Field Type | Max Length | When to Use |
|------------|------------|-------------|
| **TextField** | Unlimited | Long content (notes, terms) |
| **CharField** | Limited | Short content (tags) |

**PostgreSQL Storage:** Both stored similarly, TextField UI differs

### Sri Lanka Context

**Language Support:**
- Notes and terms support Sinhala/Tamil Unicode
- Consider bilingual terms (Sinhala + English)
- Tags can use Singlish (කඩේ = "kade" = shop)

**Legal Terms:**
- Reference Sri Lankan legal framework
- Include tax registration numbers if applicable
- Mention Sri Lanka Rupees (LKR) in terms

### Expected Field Additions
```python
# Metadata fields (in Quote model)
notes = models.TextField(
    blank=True,
    null=True,
    help_text="Additional notes for customer (shown in PDF)"
)

terms = models.TextField(
    blank=True,
    null=True,
    help_text="Terms and conditions (shown in PDF)"
)

internal_notes = models.TextField(
    blank=True,
    null=True,
    help_text="Internal notes (staff only, not visible to customer)"
)

tags = models.CharField(
    max_length=200,
    blank=True,
    null=True,
    help_text="Comma-separated tags for categorization"
)

attachment_count = models.IntegerField(
    default=0,
    help_text="Number of attachments (denormalized count)"
)
```

### Verification Checklist
- [ ] notes field added (TextField, nullable)
- [ ] terms field added (TextField, nullable)
- [ ] internal_notes field added (TextField, nullable)
- [ ] tags field added (CharField, nullable)
- [ ] attachment_count field added (IntegerField, default=0)
- [ ] help_text added to all fields
- [ ] Fields grouped with comment
- [ ] Customer-facing vs internal fields distinguished

---

## Task 09: Add Quote User Reference Fields

### Overview
Add foreign key fields to track which users created, sent, and accepted the quote for audit trail and accountability.

### Dependencies
- Task 04: Create Quote Model Core Fields
- User model must exist (Django's auth.User or custom user model)

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Import settings for User model**
   - Add import: `from django.conf import settings`
   - Use `settings.AUTH_USER_MODEL` for FK references

3. **Add created_by field**
   - ForeignKey to User model
   - Set `on_delete=models.SET_NULL`
   - Set `related_name='quotes_created'`
   - Set `null=True, blank=True`
   - Add db_index=True for filtering by creator

4. **Add sent_by field**
   - ForeignKey to User model
   - Set `on_delete=models.SET_NULL`
   - Set `related_name='quotes_sent'`
   - Set `null=True, blank=True`
   - Tracks who sent the quote to customer

5. **Add accepted_by field**
   - ForeignKey to User model
   - Set `on_delete=models.SET_NULL`
   - Set `related_name='quotes_accepted_by'`
   - Set `null=True, blank=True`
   - Tracks which staff member marked as accepted

6. **Add help_text to all user fields**
   - Document when each field is populated
   - Explain SET_NULL behavior

7. **Add field grouping comment**
   - Add comment: "# User references"
   - Improve code organization

### User Reference Lifecycle

```
┌─────────────────────────────────────────────────┐
│            Quote User Reference Flow            │
└─────────────────────────────────────────────────┘

Quote Creation
    │
    ├─> created_by = current_user
    │   (populated on quote save)
    │
    ▼
┌─────────┐
│  DRAFT  │  created_by: John (Sales Rep)
└────┬────┘  sent_by: NULL
     │        accepted_by: NULL
     │
     │ Send to customer
     │
     ▼
┌─────────┐
│  SENT   │  created_by: John (Sales Rep)
└────┬────┘  sent_by: John (Sales Rep)
     │        accepted_by: NULL
     │
     │ Customer accepts
     │
     ▼
┌──────────┐
│ ACCEPTED │  created_by: John (Sales Rep)
└──────────┘  sent_by: John (Sales Rep)
             accepted_by: Sarah (Sales Manager)
             (marked accepted after customer confirmation)
```

### User Field Purposes

| Field | When Populated | Purpose | Business Value |
|-------|----------------|---------|----------------|
| **created_by** | Quote creation | Track originator | Sales attribution, commission |
| **sent_by** | Quote sent to customer | Track sender | Accountability, follow-up responsibility |
| **accepted_by** | Quote acceptance recorded | Track processor | Commission split, performance tracking |

### on_delete Behavior

**Why SET_NULL instead of CASCADE or PROTECT?**

| on_delete | Behavior | Quote Management Impact |
|-----------|----------|-------------------------|
| **CASCADE** | Delete quote if user deleted | ❌ Lose quote history |
| **PROTECT** | Cannot delete user with quotes | ❌ Cannot remove employees |
| **SET_NULL** | Set field to NULL if user deleted | ✅ Keep quote, lose user reference |

**SET_NULL Advantages:**
- Preserve quote records even after employee departure
- Maintain financial history and audit trail
- Allow user account deletion without data loss
- Display "User Deleted" or ID in UI when NULL

### Multiple Related Names

**Why different related_name values?**

```python
# Same user can have multiple relationships to quotes
user = User.objects.get(pk=1)

user.quotes_created.all()      # Quotes this user created
user.quotes_sent.all()          # Quotes this user sent
user.quotes_accepted_by.all()   # Quotes this user marked accepted
```

**Without unique related_name:**
```
# Would conflict - Django error
quote.user_set.all()  # Ambiguous!
```

### User Reference Queries

**Find quotes by creator:**
```python
john = User.objects.get(username='john')
john_quotes = john.quotes_created.all()
```

**Find quotes sent by user:**
```python
sent_quotes = user.quotes_sent.filter(
    status=QuoteStatus.SENT,
    sent_at__gte=datetime(2026, 1, 1)
)
```

**Find quotes with no creator (orphaned):**
```python
orphaned = Quote.objects.filter(created_by__isnull=True)
```

### Sales Attribution

**Commission Calculation:**
- **Primary:** created_by gets base commission
- **Send Bonus:** sent_by gets small bonus for sending
- **Close Bonus:** accepted_by gets conversion bonus

**Team Performance:**
```python
# Sales rep performance
rep = User.objects.get(username='john')
created_count = rep.quotes_created.count()
sent_count = rep.quotes_sent.count()
converted_count = rep.quotes_created.filter(
    status=QuoteStatus.CONVERTED
).count()

conversion_rate = (converted_count / created_count) * 100
```

### Audit Trail

**Who did what when:**

| Action | User Field | Timestamp Field |
|--------|------------|-----------------|
| Created quote | created_by | created_at |
| Sent to customer | sent_by | sent_at |
| Marked accepted | accepted_by | accepted_at |

**Audit Query:**
```python
quote = Quote.objects.get(quote_number='QT-2026-00001')

print(f"Created by: {quote.created_by} at {quote.created_at}")
print(f"Sent by: {quote.sent_by} at {quote.sent_at}")
print(f"Accepted by: {quote.accepted_by} at {quote.accepted_at}")
```

### User Deletion Handling

**When user account deleted:**

```python
# Before deletion
quote.created_by  # <User: john>

# After user deletion
quote.created_by  # None

# UI display logic
creator_name = quote.created_by.get_full_name() if quote.created_by else "Unknown User"
```

**Soft Delete Alternative:**
- Keep user accounts as "inactive" instead of deleting
- Preserves relationships
- User cannot log in but references remain

### Expected Field Additions
```python
# User references (in Quote model)
created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    related_name='quotes_created',
    null=True,
    blank=True,
    db_index=True,
    help_text="User who created this quote"
)

sent_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    related_name='quotes_sent',
    null=True,
    blank=True,
    help_text="User who sent this quote to customer"
)

accepted_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    related_name='quotes_accepted_by',
    null=True,
    blank=True,
    help_text="User who marked this quote as accepted"
)
```

### Verification Checklist
- [ ] created_by field added (FK to User)
- [ ] sent_by field added (FK to User)
- [ ] accepted_by field added (FK to User)
- [ ] All use settings.AUTH_USER_MODEL
- [ ] All have on_delete=models.SET_NULL
- [ ] All have null=True, blank=True
- [ ] Unique related_name for each field
- [ ] created_by has db_index=True
- [ ] help_text added to all fields
- [ ] Fields grouped with comment

---

## Task 10: Add Quote Currency Field

### Overview
Add a currency field to support multi-currency quotes, with LKR as default and USD as common alternative for exports.

### Dependencies
- Task 04: Create Quote Model Core Fields

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/quotes/constants.py`

2. **Create CurrencyChoice class**
   - Inherit from `models.TextChoices`
   - Add module docstring

3. **Define LKR currency option**
   - Value: `'LKR'`
   - Label: `'Sri Lankan Rupee (₨)'`
   - Default currency

4. **Define USD currency option**
   - Value: `'USD'`
   - Label: `'US Dollar ($)'`
   - For export/international quotes

5. **Add currency symbols dictionary**
   - Create `CURRENCY_SYMBOLS` dictionary
   - Map currency codes to symbols
   - LKR → '₨', USD → '$'

6. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

7. **Import CurrencyChoice**
   - Add to imports from constants

8. **Add currency field**
   - CharField with choices=CurrencyChoice.choices
   - Set `default=CurrencyChoice.LKR`
   - Set max_length=3 (ISO 4217 standard)
   - Add db_index=True for currency filtering
   - Add help_text

9. **Update model docstring**
   - Mention multi-currency support
   - Document currency conversion handling

### ISO 4217 Currency Codes

**Standard:** 3-letter codes for currencies

| Code | Currency | Symbol | Countries |
|------|----------|--------|-----------|
| LKR | Sri Lankan Rupee | ₨ | Sri Lanka |
| USD | United States Dollar | $ | USA, international |
| EUR | Euro | € | EU countries |
| GBP | British Pound | £ | United Kingdom |
| INR | Indian Rupee | ₹ | India |

**Quote System:** Start with LKR and USD, expandable

### Currency Field Design Decisions

| Decision | Reasoning |
|----------|-----------|
| **CharField vs IntegerField** | CharField for readability and ISO compliance |
| **Max Length = 3** | ISO 4217 standard length |
| **Choices vs Free Text** | Choices for data consistency |
| **LKR Default** | Primary market is Sri Lanka |
| **Include USD** | Export business, international customers |

### Currency in Quote Lifecycle

```
┌────────────────────────────────────────┐
│      Currency Selection Impact         │
└────────────────────────────────────────┘

Quote Creation
    │
    ├─> currency = LKR (default)
    │   OR
    ├─> currency = USD (selected)
    │
    ▼
┌─────────────────────────────────────┐
│   All Line Items Use Same Currency  │
│   - prices in selected currency     │
│   - discount in selected currency   │
│   - total in selected currency      │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  PDF Generation                     │
│  - Show currency symbol (₨ or $)   │
│  - Format numbers per currency      │
│  - Terms mention currency           │
└─────────────────────────────────────┘
```

### Currency Conversion Handling

**Quote-Level Currency:** All amounts in one currency per quote

| Scenario | Handling |
|----------|----------|
| **Single Currency** | All line items in quote currency |
| **Product in Different Currency** | Convert at quote creation time |
| **Exchange Rate** | Lock rate when quote created |
| **Display** | Always show in quote currency |

**No Mixed Currencies:** Cannot have LKR and USD line items in same quote

**Exchange Rate Storage:**
- If quote in USD, store exchange rate used
- Allows historical conversion back to LKR for reporting
- Rate locked at quote creation, never changes

### LKR (Sri Lankan Rupee) Details

| Attribute | Value |
|-----------|-------|
| **ISO Code** | LKR |
| **Symbol** | ₨ (Rupee sign) |
| **Subunit** | Cents (1/100) |
| **Unicode** | U+20A8 (₨) |
| **Format** | ₨1,234.56 or Rs. 1,234.56 |

**Common Formatting:**
```
₨ 1,234.56
Rs. 1,234.56
LKR 1,234.56
```

**Sri Lanka Usage:**
- Prices often displayed without cents in retail
- B2B invoices use 2 decimal places
- Large amounts: "Lakhs" (100,000) and "Millions"

### USD (US Dollar) Details

| Attribute | Value |
|-----------|-------|
| **ISO Code** | USD |
| **Symbol** | $ |
| **Subunit** | Cents (1/100) |
| **Format** | $1,234.56 or USD 1,234.56 |

**When to Use USD:**
- Export orders
- International customers
- Import quotes (buying from abroad)
- Online orders from overseas

### Currency Symbol Display

**CURRENCY_SYMBOLS Dictionary:**
```python
CURRENCY_SYMBOLS = {
    'LKR': '₨',
    'USD': '$',
}
```

**Usage in Templates:**
```django
{{ quote.currency_symbol }}{{ quote.total|floatformat:2 }}
Output: ₨3,622.50 or $150.00
```

**Method on Model:**
```python
@property
def currency_symbol(self):
    from apps.quotes.constants import CURRENCY_SYMBOLS
    return CURRENCY_SYMBOLS.get(self.currency, self.currency)
```

### Reporting by Currency

**Query Quotes by Currency:**
```python
# LKR quotes
lkr_quotes = Quote.objects.filter(currency='LKR')
lkr_total = lkr_quotes.aggregate(Sum('total'))

# USD quotes
usd_quotes = Quote.objects.filter(currency='USD')
usd_total = usd_quotes.aggregate(Sum('total'))
```

**Mixed Currency Reports:**
- Convert all to LKR for consolidated reporting
- Use current exchange rate or rate at quote date
- Show breakdown by currency

### Future Expansion

**Easy to Add More Currencies:**
```python
class CurrencyChoice(models.TextChoices):
    LKR = 'LKR', 'Sri Lankan Rupee (₨)'
    USD = 'USD', 'US Dollar ($)'
    EUR = 'EUR', 'Euro (€)'        # Add later
    GBP = 'GBP', 'British Pound (£)'  # Add later
    INR = 'INR', 'Indian Rupee (₹)'   # Add later
```

**Migration Path:**
- Add new choice to CurrencyChoice
- No model migration needed (CharField accepts new values)
- Update CURRENCY_SYMBOLS dictionary

### Expected Code Additions

**constants.py:**
```python
class CurrencyChoice(models.TextChoices):
    """
    Supported currencies for quotes.
    
    Default: LKR (Sri Lankan Rupee)
    """
    LKR = 'LKR', 'Sri Lankan Rupee (₨)'
    USD = 'USD', 'US Dollar ($)'


# Currency symbol mapping
CURRENCY_SYMBOLS = {
    'LKR': '₨',
    'USD': '$',
}
```

**quote.py model:**
```python
# Currency field (in Quote model)
currency = models.CharField(
    max_length=3,
    choices=CurrencyChoice.choices,
    default=CurrencyChoice.LKR,
    db_index=True,
    help_text="Currency for all amounts in this quote"
)
```

### Verification Checklist
- [ ] CurrencyChoice class defined in constants.py
- [ ] LKR and USD options added
- [ ] CURRENCY_SYMBOLS dictionary created
- [ ] currency field added to Quote model
- [ ] max_length=3 (ISO 4217 standard)
- [ ] default=CurrencyChoice.LKR
- [ ] db_index=True added
- [ ] help_text added
- [ ] Import added to quote.py

---

## Task 11: Add Quote Discount Fields

### Overview
Add fields to support header-level discounts on quotes, with options for percentage or fixed amount discounts.

### Dependencies
- Task 04: Create Quote Model Core Fields
- Task 07: Add Quote Financial Summary Fields

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/quotes/constants.py`

2. **Create DiscountType class**
   - Inherit from `models.TextChoices`
   - Add module docstring

3. **Define PERCENTAGE discount type**
   - Value: `'PERCENTAGE'`
   - Label: `'Percentage'`
   - Discount as percentage of subtotal

4. **Define FIXED discount type**
   - Value: `'FIXED'`
   - Label: `'Fixed Amount'`
   - Discount as fixed currency amount

5. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

6. **Import DiscountType**
   - Add to imports from constants

7. **Add discount_type field**
   - CharField with choices=DiscountType.choices
   - Set `null=True, blank=True`
   - Set max_length=20
   - Add help_text

8. **Add discount_value field**
   - DecimalField with max_digits=10, decimal_places=2
   - Set `default=0.00`
   - Add help_text explaining usage
   - Stores percentage (10.00 = 10%) or fixed amount

9. **Add field grouping comment**
   - Add comment: "# Discount fields"
   - Improve code organization

10. **Document discount calculation logic**
    - Add docstring section
    - Explain percentage vs fixed calculation

### Discount Type Comparison

| Type | discount_value Format | discount_amount Calculation | Example |
|------|----------------------|----------------------------|---------|
| **PERCENTAGE** | Percentage (10.00 = 10%) | subtotal × (value/100) | subtotal: 1000, value: 10 → discount_amount: 100 |
| **FIXED** | Currency amount | value directly | value: 100 → discount_amount: 100 |

### Discount Calculation Flow

```
┌────────────────────────────────────────────────┐
│        Quote Discount Calculation              │
└────────────────────────────────────────────────┘

Input: subtotal = 3500.00

┌─────────────────────────┐
│ Discount Type?          │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────────┐  ┌──────────┐
│PERCENTAGE│  │  FIXED   │
└────┬─────┘  └────┬─────┘
     │             │
     │ value=10    │ value=350
     │             │
     ▼             ▼
┌──────────┐  ┌──────────┐
│ 3500 ×   │  │ discount │
│ (10/100) │  │ = 350    │
│ = 350    │  │          │
└────┬─────┘  └────┬─────┘
     │             │
     └──────┬──────┘
            │
            ▼
    discount_amount = 350.00
```

### Discount Field Relationship

**Three Related Fields:**

| Field | Purpose | Calculated or Input |
|-------|---------|---------------------|
| **discount_type** | How discount is specified | User input (choice) |
| **discount_value** | Discount input value | User input (number) |
| **discount_amount** | Final discount in currency | Calculated (from above) |

**Flow:**
1. User selects discount_type (PERCENTAGE or FIXED)
2. User enters discount_value (10 or 350)
3. System calculates discount_amount (Task 07 field)

### Percentage Discount Details

**Storage:** Percentage as decimal (10.00 = 10%)

| Input | Stored As | Calculation |
|-------|-----------|-------------|
| 10% | 10.00 | subtotal × 0.10 |
| 15.5% | 15.50 | subtotal × 0.155 |
| 100% | 100.00 | subtotal × 1.00 |

**Validation Rules:**
- Minimum: 0%
- Maximum: 100%
- Precision: 2 decimal places (15.50%)

**Common Percentage Discounts:**
| Percentage | Use Case |
|------------|----------|
| 5% | Small courtesy discount |
| 10% | Standard trade discount |
| 15% | Bulk order discount |
| 20% | VIP customer discount |
| 25%+ | Clearance, special deals |

### Fixed Amount Discount Details

**Storage:** Currency amount directly

| Input | Stored As | Applies As |
|-------|-----------|------------|
| ₨100 | 100.00 | Flat 100 off |
| $50 | 50.00 | Flat 50 off |
| ₨1000 | 1000.00 | Flat 1000 off |

**Validation Rules:**
- Minimum: 0
- Maximum: subtotal (cannot exceed subtotal)
- Currency: Must match quote currency

**Common Fixed Discounts:**
| Amount (LKR) | Use Case |
|--------------|----------|
| 100-500 | Small item discounts |
| 1,000-5,000 | Promotional discounts |
| 10,000+ | Large order discounts |

### Discount Validation Logic

**Rule 1: Type and Value Together**
```python
# Both or neither
if discount_type and not discount_value:
    raise ValidationError("discount_value required when discount_type set")

if discount_value and not discount_type:
    raise ValidationError("discount_type required when discount_value set")
```

**Rule 2: Percentage Range**
```python
if discount_type == 'PERCENTAGE':
    if not (0 <= discount_value <= 100):
        raise ValidationError("Percentage must be between 0 and 100")
```

**Rule 3: Fixed Cannot Exceed Subtotal**
```python
if discount_type == 'FIXED':
    if discount_value > subtotal:
        raise ValidationError("Discount cannot exceed subtotal")
```

### Discount Business Logic

**When to Use Percentage:**
- Consistent discount across varying order sizes
- Promotional campaigns (10% off everything)
- Loyalty discounts (VIP customers get 15%)
- Volume-based discounts (bulk orders)

**When to Use Fixed:**
- Specific promotional amount (₨500 off)
- Rounding adjustments
- Negotiated flat discounts
- Gift card/coupon amounts

### Discount Calculation Service

**Pseudo-code for calculation:**
```python
def calculate_discount_amount(quote):
    """Calculate discount_amount from discount_type and discount_value."""
    
    if not quote.discount_type:
        return Decimal('0.00')
    
    if quote.discount_type == 'PERCENTAGE':
        # Percentage: subtotal × (value / 100)
        discount = quote.subtotal * (quote.discount_value / 100)
    
    elif quote.discount_type == 'FIXED':
        # Fixed: use value directly
        discount = quote.discount_value
    
    # Round to 2 decimal places
    return discount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
```

### Multiple Discount Levels

**Quote supports header-level discount only**

| Level | Supported | Location |
|-------|-----------|----------|
| **Line Item** | Yes | Individual line item discount |
| **Quote Header** | Yes | This task (overall discount) |
| **Customer Level** | Future | Default discount for customer |

**Calculation Order:**
1. Line item prices (with line-level discounts)
2. Calculate subtotal (sum of line items)
3. Apply quote-level discount (this task)
4. Calculate tax on discounted amount
5. Calculate total

### Discount Display

**UI Display:**
```
Subtotal:              ₨3,500.00
Discount (10%):        - ₨350.00
                       ──────────
Taxable Amount:        ₨3,150.00
Tax (15%):             + ₨472.50
                       ──────────
Total:                 ₨3,622.50
```

**PDF Display:**
- Show discount type and value
- Show calculated discount amount
- Make negative or with minus sign
- Include explanation if provided

### Expected Code Additions

**constants.py:**
```python
class DiscountType(models.TextChoices):
    """
    Discount type for header-level quote discounts.
    """
    PERCENTAGE = 'PERCENTAGE', 'Percentage'
    FIXED = 'FIXED', 'Fixed Amount'
```

**quote.py model:**
```python
# Discount fields (in Quote model)
discount_type = models.CharField(
    max_length=20,
    choices=DiscountType.choices,
    null=True,
    blank=True,
    help_text="Type of discount (percentage or fixed amount)"
)

discount_value = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0.00,
    help_text="Discount value (percentage or fixed amount depending on type)"
)
```

### Verification Checklist
- [ ] DiscountType class defined in constants.py
- [ ] PERCENTAGE and FIXED options added
- [ ] discount_type field added to Quote model
- [ ] discount_value field added to Quote model
- [ ] discount_type is nullable
- [ ] discount_value has default=0.00
- [ ] help_text added to both fields
- [ ] Fields grouped with comment
- [ ] Import added to quote.py

---

## Task 12: Create Quote Number Generator

### Overview
Create a service to automatically generate unique quote numbers in the format QT-{YEAR}-{SEQUENCE} with yearly sequence reset.

### Dependencies
- Task 04: Create Quote Model Core Fields

### Instructions

1. **Create number_generator.py in services directory**
   - Navigate to `apps/quotes/services/`
   - Create `number_generator.py` file

2. **Add module docstring**
   - Explain quote number generation logic
   - Document format and sequence behavior

3. **Import required dependencies**
   - Import Django database utilities
   - Import timezone utilities
   - Import Quote model

4. **Create generate_quote_number function**
   - Main function for quote number generation
   - No parameters (uses current year)
   - Returns formatted quote number string

5. **Implement year extraction logic**
   - Get current year from timezone.now()
   - Format as 4-digit string (2026)

6. **Implement sequence query**
   - Query Quote model for quotes from current year
   - Filter by quote_number starting with QT-{YEAR}
   - Order by quote_number descending
   - Get latest sequence number

7. **Implement sequence increment logic**
   - If no quotes this year, start from 1
   - If quotes exist, extract last sequence and increment
   - Handle parsing of sequence from quote_number

8. **Implement quote number formatting**
   - Format: QT-{YEAR}-{SEQUENCE:05d}
   - SEQUENCE zero-padded to 5 digits
   - Return formatted string

9. **Add error handling**
   - Handle database errors
   - Handle parsing errors
   - Fallback to timestamp-based number if needed

10. **Add transaction safety**
    - Consider race conditions
    - Document atomic transaction recommendation
    - Add retry logic if needed

11. **Update services/__init__.py**
    - Import generate_quote_number function
    - Add to `__all__` list

12. **Add usage documentation**
    - Docstring with usage examples
    - Document thread-safety considerations

### Quote Number Format Specification

```
Format: QT-{YEAR}-{SEQUENCE}

Components:
┌──┬────┬───────┐
│QT│YEAR│SEQUENCE│
└──┴────┴───────┘
 │   │      │
 │   │      └─> 5-digit zero-padded sequential number (00001-99999)
 │   └──────────> 4-digit year (2026, 2027, etc.)
 └──────────────> Fixed prefix "QT" (Quote)

Examples:
- QT-2026-00001 (first quote of 2026)
- QT-2026-00142 (142nd quote of 2026)
- QT-2026-99999 (max sequence)
- QT-2027-00001 (first quote of 2027, sequence reset)
```

### Yearly Sequence Reset

**Behavior:**

| Year | First Quote | Last Quote | Next Year First Quote |
|------|-------------|------------|----------------------|
| 2026 | QT-2026-00001 | QT-2026-XXXXX | QT-2027-00001 |
| 2027 | QT-2027-00001 | QT-2027-XXXXX | QT-2028-00001 |

**Benefits:**
- Easy to identify quote year
- Predictable sequence length
- Simplified yearly reporting
- Matches accounting periods

**Maximum per Year:** 99,999 quotes (sufficient for most businesses)

### Sequence Generation Algorithm

```
┌─────────────────────────────────────────┐
│   Quote Number Generation Algorithm     │
└─────────────────────────────────────────┘

1. Get Current Year
   ┌──────────────────┐
   │ year = 2026      │
   └────────┬─────────┘
            │
            ▼
2. Query Last Quote for Year
   ┌────────────────────────────────────┐
   │ Query:                             │
   │ SELECT quote_number                │
   │ FROM quotes                        │
   │ WHERE quote_number LIKE 'QT-2026-%'│
   │ ORDER BY quote_number DESC         │
   │ LIMIT 1                            │
   └──────────────┬─────────────────────┘
                  │
                  ▼
3. Extract Sequence Number
   ┌──────────────────────────────┐
   │ If found: QT-2026-00142      │
   │   Extract: 00142             │
   │   Convert: 142               │
   │   Increment: 143             │
   │                              │
   │ If not found:                │
   │   Start with: 1              │
   └──────────────┬───────────────┘
                  │
                  ▼
4. Format New Number
   ┌──────────────────────────────┐
   │ Format: QT-{year}-{seq:05d}  │
   │ Result: QT-2026-00143        │
   └──────────────────────────────┘
```

### Race Condition Handling

**Problem:** Two simultaneous quote creations

```
Time    Thread 1                Thread 2
────────────────────────────────────────────────
T1      Get last: QT-2026-00142
T2                              Get last: QT-2026-00142
T3      Generate: QT-2026-00143
T4                              Generate: QT-2026-00143 ⚠️
T5      Save quote              
T6                              Save quote (DUPLICATE!) ❌
```

**Solution 1: Database Unique Constraint**
- Quote.quote_number has unique=True
- Second save will fail with IntegrityError
- Retry with new number generation

**Solution 2: Atomic Transaction with Lock**
```python
from django.db import transaction

@transaction.atomic
def generate_quote_number():
    # Get and lock latest quote
    Quote.objects.select_for_update().filter(
        quote_number__startswith=f'QT-{year}'
    ).latest('quote_number')
    
    # Generate number while lock held
    # ...
```

**Solution 3: Database Sequence (PostgreSQL)**
- Use PostgreSQL sequence object
- Guaranteed unique increment
- Most robust solution

### Recommended Implementation Strategy

**Approach:** Unique constraint + retry

```python
def generate_quote_number():
    """Generate unique quote number with retry on collision."""
    year = timezone.now().year
    
    # Query last quote
    last_quote = Quote.objects.filter(
        quote_number__startswith=f'QT-{year}-'
    ).order_by('-quote_number').first()
    
    if last_quote:
        # Extract sequence from QT-2026-00142
        last_sequence = int(last_quote.quote_number.split('-')[2])
        next_sequence = last_sequence + 1
    else:
        next_sequence = 1
    
    # Format with zero-padding
    quote_number = f'QT-{year}-{next_sequence:05d}'
    
    return quote_number


# Usage in quote creation
from django.db import IntegrityError

max_retries = 5
for attempt in range(max_retries):
    try:
        quote.quote_number = generate_quote_number()
        quote.save()
        break  # Success
    except IntegrityError:
        if attempt == max_retries - 1:
            raise  # Failed after retries
        continue  # Retry
```

### Sequence Overflow Handling

**What if 99,999 quotes reached?**

| Approach | Implementation |
|----------|----------------|
| **Extend Digits** | Use 6 digits (QT-2026-100000) |
| **Alphanumeric** | Add letters (QT-2026-A0001) |
| **Sub-sequence** | Add branch/location code |
| **Monthly Reset** | QT-2026-01-0001 (month-based) |

**For Most Businesses:** 99,999 per year is sufficient

### Year Transition Handling

**What happens at midnight on Dec 31?**

```
2026-12-31 23:59:59  →  QT-2026-00142
2027-01-01 00:00:00  →  QT-2027-00001  ✓ (reset)
```

**Automatic:** Based on current year at generation time

**No Manual Intervention Needed**

### Testing Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| First quote ever | QT-2026-00001 |
| Second quote same year | QT-2026-00002 |
| First quote new year | QT-2027-00001 |
| After QT-2026-00999 | QT-2026-01000 |
| Concurrent creation | Both get unique numbers |
| Quote deleted | Sequence not reused |

### Alternative Numbering Schemes

**Not Recommended for Quotes:**

| Scheme | Example | Issue |
|--------|---------|-------|
| UUID | QT-a8f3... | Not human-readable |
| Timestamp | QT-20260122... | Too long |
| Random | QT-J4K9L2 | Hard to sequence |
| Sequential Only | QT-000001 | No year context |

**Recommended:** QT-{YEAR}-{SEQUENCE} (current implementation)

### Expected Code Structure

**services/number_generator.py:**
```python
"""
Quote Number Generator Service

Generates unique quote numbers in format: QT-YYYY-NNNNN
- YYYY: 4-digit year
- NNNNN: 5-digit zero-padded sequence (resets yearly)

Examples:
    QT-2026-00001
    QT-2026-00142
    QT-2027-00001 (resets in new year)
"""

from django.utils import timezone
from apps.quotes.models import Quote


def generate_quote_number():
    """
    Generate the next unique quote number for the current year.
    
    Returns:
        str: Formatted quote number (e.g., 'QT-2026-00143')
    
    Thread Safety:
        Uses database unique constraint to prevent duplicates.
        Caller should retry on IntegrityError.
    
    Example:
        >>> quote_number = generate_quote_number()
        >>> print(quote_number)
        'QT-2026-00001'
    """
    # Get current year
    current_year = timezone.now().year
    
    # Query last quote for this year
    last_quote = Quote.objects.filter(
        quote_number__startswith=f'QT-{current_year}-'
    ).order_by('-quote_number').first()
    
    if last_quote:
        # Extract and increment sequence
        try:
            sequence_str = last_quote.quote_number.split('-')[2]
            last_sequence = int(sequence_str)
            next_sequence = last_sequence + 1
        except (IndexError, ValueError):
            # Fallback if parsing fails
            next_sequence = 1
    else:
        # First quote of the year
        next_sequence = 1
    
    # Format with zero-padding (5 digits)
    quote_number = f'QT-{current_year}-{next_sequence:05d}'
    
    return quote_number
```

**services/__init__.py:**
```python
from .number_generator import generate_quote_number

__all__ = ['generate_quote_number']
```

### Verification Checklist
- [ ] `number_generator.py` created in services/
- [ ] generate_quote_number function implemented
- [ ] Year extraction from current date
- [ ] Query for last quote of current year
- [ ] Sequence extraction and increment logic
- [ ] Zero-padding to 5 digits
- [ ] Format: QT-{YEAR}-{SEQUENCE:05d}
- [ ] Comprehensive docstring added
- [ ] Function imported in services/__init__.py
- [ ] Error handling for parsing failures

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 07 | Add Quote Financial Summary Fields | subtotal, discount_amount, tax_amount, total |
| 08 | Add Quote Metadata Fields | notes, terms, internal_notes, tags, attachment_count |
| 09 | Add Quote User Reference Fields | created_by, sent_by, accepted_by FKs |
| 10 | Add Quote Currency Field | currency field with LKR/USD choices |
| 11 | Add Quote Discount Fields | discount_type, discount_value fields |
| 12 | Create Quote Number Generator | generate_quote_number service function |

### Quote Model Additions (This Document)
```python
class Quote(models.Model):
    # ... (previous fields from Document 01)
    
    # Financial summary fields
    subtotal          # DecimalField (calculated)
    discount_amount   # DecimalField (calculated)
    tax_amount        # DecimalField (calculated)
    total             # DecimalField (indexed, calculated)
    
    # Metadata fields
    notes             # TextField (customer-visible)
    terms             # TextField (T&C)
    internal_notes    # TextField (staff-only)
    tags              # CharField (comma-separated)
    attachment_count  # IntegerField (denormalized)
    
    # User references
    created_by        # FK to User (SET_NULL)
    sent_by           # FK to User (SET_NULL)
    accepted_by       # FK to User (SET_NULL)
    
    # Currency
    currency          # CharField (LKR/USD)
    
    # Discount fields
    discount_type     # CharField (PERCENTAGE/FIXED)
    discount_value    # DecimalField (percentage or amount)
```

### New Constants Added
```python
# In constants.py

class CurrencyChoice(models.TextChoices):
    LKR = 'LKR', 'Sri Lankan Rupee (₨)'
    USD = 'USD', 'US Dollar ($)'

class DiscountType(models.TextChoices):
    PERCENTAGE = 'PERCENTAGE', 'Percentage'
    FIXED = 'FIXED', 'Fixed Amount'

CURRENCY_SYMBOLS = {
    'LKR': '₨',
    'USD': '$',
}
```

### New Service Created
```
apps/quotes/services/
└── number_generator.py
    └── generate_quote_number()
        Returns: "QT-2026-00001"
```

### Quote Model Capabilities (After This Document)
✅ Complete financial tracking (subtotal, discount, tax, total)  
✅ Rich metadata (notes, terms, tags, attachments)  
✅ User audit trail (creator, sender, acceptor)  
✅ Multi-currency support (LKR, USD)  
✅ Flexible discount system (percentage or fixed)  
✅ Automatic quote numbering (yearly sequences)  

### Financial Calculation Formula
```
total = subtotal - discount_amount + tax_amount

where:
  subtotal = Σ(line_item.total)
  discount_amount = if discount_type=='PERCENTAGE': 
                      subtotal × (discount_value/100)
                    else: 
                      discount_value
  tax_amount = (subtotal - discount_amount) × tax_rate
```

### Still To Come
- PDF storage field - Task 13
- Email tracking fields - Task 14
- Order conversion reference - Task 15
- Database indexes - Task 16
- Model constraints and validation - Task 17
- Initial migrations - Task 18

### Next Steps
Proceed to [03_Tasks-13-18_PDF-Email-Conversion-Migration.md](03_Tasks-13-18_PDF-Email-Conversion-Migration.md) to add PDF storage, email tracking, order conversion reference, database indexes, model constraints, and run initial migrations.

---

## Notes for AI Agents

1. **Decimal Precision:** Always use DecimalField for currency, never FloatField
2. **Currency Consistency:** All amounts in one quote use same currency
3. **Discount Calculation:** Happens at service layer, not in model save()
4. **User References:** SET_NULL allows user deletion without losing quotes
5. **Quote Number:** Generated once at creation, never changes
6. **Race Conditions:** Handle with unique constraint + retry pattern
7. **Metadata Visibility:** Clear distinction between customer-facing and internal
8. **Tags Format:** Comma-separated for simplicity, consider JSONField later
9. **Financial Validation:** Implement in model clean() method
10. **Service Layer:** Business logic in services/, not in model methods
