# Tasks 13-18: PDF, Email, Conversion & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** A - Quote Model & Status System  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Financial-Metadata-Discount.md](02_Tasks-07-12_Financial-Metadata-Discount.md)
- **→ Next Group:** [../Group-B_Quote-Line-Items-Calculations/](../Group-B_Quote-Line-Items-Calculations/)

---

## Document Overview

This document covers adding PDF storage for generated quote documents, email tracking fields for delivery monitoring, order conversion reference linking, database performance indexes, model validation constraints, and initial database migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add Quote PDF Storage Field | Low | 15 min |
| 14 | Add Quote Email Tracking Fields | Medium | 20 min |
| 15 | Add Quote Conversion Reference | Low | 15 min |
| 16 | Create Quote Model Indexes | Medium | 20 min |
| 17 | Create Quote Model Constraints | Medium | 25 min |
| 18 | Run Initial Quote Migrations | Low | 15 min |

---

## Task 13: Add Quote PDF Storage Field

### Overview
Add a FileField to store generated PDF documents for quotes, enabling consistent quote presentation and offline access.

### Dependencies
- Task 04: Create Quote Model Core Fields
- File storage backend configured in Django settings

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Import FileField if not already imported**
   - Available in django.db.models

3. **Define PDF upload path function**
   - Create function before Quote model
   - Function signature: `quote_pdf_path(instance, filename)`
   - Return path: `quotes/pdfs/{year}/{quote_number}.pdf`
   - Use quote creation year for organization

4. **Add pdf_file field**
   - FileField with `upload_to=quote_pdf_path`
   - Set `null=True, blank=True`
   - Add max_length=500 for path
   - Add help_text about PDF generation

5. **Add pdf_generated_at field**
   - DateTimeField for tracking PDF generation time
   - Set `null=True, blank=True`
   - Add help_text about last generation

6. **Add field grouping comment**
   - Add comment: "# PDF storage fields"
   - Improve code organization

7. **Document PDF generation trigger**
   - Add docstring section about when PDF is generated
   - Explain regeneration scenarios

### PDF Storage Architecture

```
┌─────────────────────────────────────────────┐
│        Quote PDF Storage Structure          │
└─────────────────────────────────────────────┘

MEDIA_ROOT/
└── quotes/
    └── pdfs/
        ├── 2026/
        │   ├── QT-2026-00001.pdf
        │   ├── QT-2026-00142.pdf
        │   └── QT-2026-00999.pdf
        └── 2027/
            ├── QT-2027-00001.pdf
            └── ...

Path Function Logic:
┌──────────────────────────────────┐
│ quote_pdf_path(instance, filename)│
└───────────────┬──────────────────┘
                │
                ├─> year = instance.created_at.year
                ├─> quote_num = instance.quote_number
                └─> return f"quotes/pdfs/{year}/{quote_num}.pdf"
```

### FileField vs File Storage Options

| Option | Use Case | Benefits | Drawbacks |
|--------|----------|----------|-----------|
| **FileField** | Default file storage | Simple, integrated | Limited control |
| **S3 Storage** | Production scale | CDN, scalability | Additional cost |
| **Local Storage** | Development | No external deps | Not scalable |
| **Azure Blob** | Azure deployment | Integration | Vendor lock-in |

**Recommendation:** Start with FileField (supports multiple backends)

### PDF File Path Function

**Purpose:** Organize PDFs by year and quote number

```python
def quote_pdf_path(instance, filename):
    """
    Generate file path for quote PDF.
    
    Args:
        instance: Quote model instance
        filename: Original filename (ignored, we use quote_number)
    
    Returns:
        str: File path like 'quotes/pdfs/2026/QT-2026-00001.pdf'
    """
    year = instance.created_at.year
    # Use quote_number as filename for consistency
    return f'quotes/pdfs/{year}/{instance.quote_number}.pdf'
```

**Path Components:**

| Component | Value | Purpose |
|-----------|-------|---------|
| Base Dir | `quotes/pdfs/` | Namespace for quote PDFs |
| Year Subdir | `2026/` | Yearly organization |
| Filename | `QT-2026-00001.pdf` | Matches quote number |

### PDF Generation Workflow

```
┌────────────────────────────────────────────┐
│         Quote PDF Generation Flow          │
└────────────────────────────────────────────┘

Quote Status: DRAFT
    │
    │ User clicks "Send Quote"
    │
    ▼
┌─────────────────────────┐
│ 1. Validate Quote Data  │
│    - Customer filled    │
│    - Line items exist   │
│    - Totals calculated  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 2. Generate PDF         │
│    - Render template    │
│    - Company branding   │
│    - Quote details      │
│    - Line items table   │
│    - Terms & conditions │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 3. Save PDF to Storage  │
│    - Write to FileField │
│    - Set pdf_file path  │
│    - Update timestamp   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 4. Update Quote Status  │
│    - status = SENT      │
│    - sent_at = now()    │
│    - pdf_generated_at   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 5. Send Email           │
│    - Attach PDF         │
│    - Send to customer   │
└─────────────────────────┘
```

### PDF Generation Triggers

| Trigger | When | Why |
|---------|------|-----|
| **Send Quote** | Status: DRAFT → SENT | Create customer-facing document |
| **Manual Regenerate** | User request | Update after corrections |
| **Preview** | Before sending | User wants to review |
| **Customer View** | Customer opens link | Just-in-time generation |

### PDF File Management

**Versioning:** Each save overwrites previous PDF
- No version history stored
- Latest PDF always at same path
- Quote locked after sending (status ≠ DRAFT)

**Deletion:**
```python
# When quote deleted, PDF auto-deleted
quote.delete()  # Cascade deletes file if storage backend supports it

# Manual PDF deletion
if quote.pdf_file:
    quote.pdf_file.delete(save=True)
    quote.pdf_generated_at = None
    quote.save()
```

**Regeneration Scenarios:**

| Scenario | Action | Result |
|----------|--------|--------|
| Quote in DRAFT | Edit and regenerate | Updates PDF |
| Quote SENT | Cannot edit | Cannot regenerate |
| Admin override | Force regenerate | Updates PDF even if SENT |

### PDF File Size Considerations

**Typical Sizes:**
| Content | Size Range | Notes |
|---------|------------|-------|
| Simple quote (5 items) | 50-100 KB | Text only |
| Quote with logos | 100-200 KB | Company branding |
| Quote with images | 200-500 KB | Product images |
| Complex quote (50 items) | 200-400 KB | Multiple pages |

**Storage Planning:**
- 1,000 quotes/month × 150 KB average = ~150 MB/month
- 12 months = ~1.8 GB/year
- 5 years = ~9 GB

**Optimization:**
- Compress images before embedding
- Use vector logos (SVG → PDF)
- Optimize font embedding

### PDF Security

**Access Control:**
```python
# Django view to serve PDF
def download_quote_pdf(request, quote_id):
    quote = get_object_or_404(Quote, id=quote_id)
    
    # Permission check
    if not (request.user == quote.customer.user or 
            request.user.is_staff):
        return HttpResponseForbidden()
    
    # Serve file
    return FileResponse(quote.pdf_file, as_attachment=True)
```

**URL Structure:**
- Not directly accessible: `/media/quotes/pdfs/...` (protected)
- Through view: `/quotes/{id}/download/` (permission-checked)

### Storage Backend Configuration

**Django Settings Example:**
```python
# Local storage (development)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# AWS S3 (production)
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'lankacommerce-quotes'
AWS_S3_REGION_NAME = 'ap-south-1'
```

### Expected Field Additions
```python
def quote_pdf_path(instance, filename):
    """
    Generate file path for quote PDF.
    
    Returns path: quotes/pdfs/{year}/{quote_number}.pdf
    Example: quotes/pdfs/2026/QT-2026-00001.pdf
    """
    year = instance.created_at.year
    return f'quotes/pdfs/{year}/{instance.quote_number}.pdf'


# In Quote model:

# PDF storage fields
pdf_file = models.FileField(
    upload_to=quote_pdf_path,
    max_length=500,
    null=True,
    blank=True,
    help_text="Generated PDF file for this quote"
)

pdf_generated_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when PDF was last generated"
)
```

### Verification Checklist
- [ ] quote_pdf_path function defined before Quote model
- [ ] pdf_file field added (FileField)
- [ ] upload_to=quote_pdf_path set
- [ ] max_length=500 set
- [ ] pdf_file is nullable
- [ ] pdf_generated_at field added (DateTimeField)
- [ ] pdf_generated_at is nullable
- [ ] help_text added to both fields
- [ ] Fields grouped with comment

---

## Task 14: Add Quote Email Tracking Fields

### Overview
Add fields to track email delivery, including send timestamp, recipient email, and open tracking for quote emails.

### Dependencies
- Task 04: Create Quote Model Core Fields

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Add email_sent_to field**
   - EmailField for recipient address
   - Set `null=True, blank=True`
   - Add help_text about primary recipient
   - May differ from customer email (CC/BCC)

3. **Add email_sent_at field**
   - DateTimeField for send timestamp
   - Set `null=True, blank=True`
   - Add help_text about when email was sent
   - Different from sent_at (quote status change)

4. **Add email_sent_count field**
   - IntegerField for tracking resends
   - Set `default=0`
   - Add help_text about tracking multiple sends
   - Increments on each send

5. **Add email_opened_at field**
   - DateTimeField for first open timestamp
   - Set `null=True, blank=True`
   - Add help_text about open tracking
   - Requires tracking pixel implementation

6. **Add email_opened_count field**
   - IntegerField for open count
   - Set `default=0`
   - Add help_text about multiple opens
   - Useful for engagement tracking

7. **Add email_last_error field**
   - TextField for last send error message
   - Set `null=True, blank=True`
   - Add help_text about failure tracking
   - Helps debug delivery issues

8. **Add field grouping comment**
   - Add comment: "# Email tracking fields"
   - Improve code organization

### Email Tracking Lifecycle

```
┌────────────────────────────────────────────────┐
│         Quote Email Tracking Flow              │
└────────────────────────────────────────────────┘

Quote Ready to Send
    │
    │ User clicks "Send Quote via Email"
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Compose Email                    │
│    - To: email_sent_to              │
│    - Subject: Quote QT-2026-00001   │
│    - Body: Template with details    │
│    - Attachment: PDF                │
│    - Tracking pixel: Embedded       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Send Email (SMTP/API)            │
│    - Attempt delivery               │
│    - Handle response                │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
     SUCCESS       FAILURE
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────────────┐
│ 3. Success   │  │ 3. Error             │
│ - email_sent │  │ - email_last_error   │
│   _at = now()│  │   = error message    │
│ - email_sent │  │ - Don't update       │
│   _count++   │  │   email_sent_at      │
└──────┬───────┘  └──────────────────────┘
       │
       │ Customer opens email
       │
       ▼
┌─────────────────────────────────────┐
│ 4. Email Opened (Tracking Pixel)    │
│    - email_opened_at = now()        │
│      (first open only)              │
│    - email_opened_count++           │
│      (every open)                   │
└─────────────────────────────────────┘
```

### Email Tracking Fields Purpose

| Field | Purpose | Updated When | Business Value |
|-------|---------|--------------|----------------|
| **email_sent_to** | Track recipient | Email sent | Know who received it |
| **email_sent_at** | Last send time | Email sent | Delivery timestamp |
| **email_sent_count** | Resend tracking | Each send | Monitor follow-ups |
| **email_opened_at** | First open time | First open | Engagement metric |
| **email_opened_count** | Open frequency | Each open | Interest level |
| **email_last_error** | Error diagnosis | Send failure | Debug issues |

### Email vs Status Timestamps

**Important Distinction:**

| Field | Tracks | Example Scenario |
|-------|--------|------------------|
| **sent_at** | Quote status change DRAFT→SENT | Quote marked as sent in system |
| **email_sent_at** | Actual email delivery | Email successfully delivered via SMTP |

**Can Differ:**
- Quote marked SENT but email fails → sent_at set, email_sent_at NULL
- Quote SENT, email resent later → sent_at unchanged, email_sent_at updated
- Quote sent by other means (hand-delivered) → sent_at set, email_sent_at NULL

### Email Send Count Usage

**Scenarios:**

| email_sent_count | Scenario | Action |
|------------------|----------|--------|
| 0 | Never sent | First send attempt |
| 1 | Sent once | Normal case |
| 2-3 | Resent 2-3 times | Follow-up or error recovery |
| 4+ | Many resends | Investigate delivery issue |

**Automatic Resend Rules:**
```python
if quote.email_sent_count > 3:
    raise Exception("Maximum resend limit reached")

if quote.email_sent_count > 0:
    hours_since_last = (now() - quote.email_sent_at).hours
    if hours_since_last < 24:
        raise Exception("Wait 24 hours before resending")
```

### Email Open Tracking

**Implementation:** Tracking pixel in email body

```html
<!-- Tracking pixel in email template -->
<img src="https://api.example.com/quotes/track/{quote_id}/open/" 
     width="1" height="1" style="display:none;" />
```

**Tracking Endpoint:**
```python
def track_email_open(request, quote_id):
    quote = Quote.objects.get(id=quote_id)
    
    # First open
    if not quote.email_opened_at:
        quote.email_opened_at = timezone.now()
    
    # Increment count on every open
    quote.email_opened_count += 1
    quote.save(update_fields=['email_opened_at', 'email_opened_count'])
    
    # Return 1×1 transparent pixel
    return HttpResponse(TRANSPARENT_PIXEL, content_type='image/png')
```

**Limitations:**
- Email clients block images → No tracking
- Privacy-focused clients → No tracking
- Opens without image load → Not counted
- Forwarded emails → May trigger multiple opens

### Email Open Metrics

**Engagement Analysis:**

| Opens | Interpretation | Action |
|-------|----------------|--------|
| 0 | Not opened / tracking blocked | Follow up via phone |
| 1 | Opened once | Normal, wait for response |
| 2-3 | Reopened for review | High interest, good sign |
| 5+ | Very high interest | Priority follow-up |

**Time to First Open:**
```python
if quote.email_opened_at and quote.email_sent_at:
    time_to_open = quote.email_opened_at - quote.email_sent_at
    # Fast open (<1 hour) = high interest
    # No open (>3 days) = likely not interested
```

### Email Error Handling

**Common Email Errors:**

| Error Type | email_last_error | Resolution |
|------------|------------------|------------|
| Invalid address | "Invalid email address" | Update customer email |
| Mailbox full | "Mailbox full" | Try alternative email |
| SMTP timeout | "Connection timeout" | Retry later |
| Spam rejection | "Rejected as spam" | Check email content |
| Domain not found | "Domain does not exist" | Verify email address |

**Error Tracking Logic:**
```python
try:
    send_email(to=quote.email_sent_to, ...)
    quote.email_sent_at = timezone.now()
    quote.email_sent_count += 1
    quote.email_last_error = None  # Clear previous error
except SMTPException as e:
    quote.email_last_error = str(e)
    # Don't update email_sent_at (failed)
finally:
    quote.save()
```

### Email Resend Scenarios

**When to Resend:**

| Scenario | Reason | Update Fields |
|----------|--------|---------------|
| **Initial Send Failed** | email_last_error set | Clear error, set email_sent_at |
| **Customer Didn't Receive** | Customer request | Increment email_sent_count |
| **Quote Updated** | Changes after send | Regenerate PDF, resend |
| **Forwarding to Others** | Send to additional recipients | Change email_sent_to |

**Resend Permission:**
- Allow resend if quote status = DRAFT or SENT
- Do not resend if ACCEPTED, REJECTED, EXPIRED, or CONVERTED
- Staff override can resend any status

### Email Tracking Reports

**Useful Queries:**

```python
# Quotes sent but not opened
not_opened = Quote.objects.filter(
    email_sent_at__isnull=False,
    email_opened_at__isnull=True,
    status=QuoteStatus.SENT
)

# High-engagement quotes (opened 3+ times)
high_engagement = Quote.objects.filter(
    email_opened_count__gte=3
)

# Failed deliveries
failed = Quote.objects.filter(
    email_last_error__isnull=False
)

# Quotes sent this week
this_week = Quote.objects.filter(
    email_sent_at__gte=start_of_week
)
```

### Sri Lanka Context

**Email Delivery Challenges:**
- Some customers prefer SMS/WhatsApp over email
- Email less common in retail, more in B2B
- Phone/mobile number often more reliable
- Consider multi-channel delivery (email + SMS)

**Localization:**
- Email subjects in English or Sinhala based on customer preference
- Quote content can be bilingual
- Contact support email: support@lankacommerce.lk

### Expected Field Additions
```python
# Email tracking fields (in Quote model)
email_sent_to = models.EmailField(
    null=True,
    blank=True,
    help_text="Email address where quote was sent"
)

email_sent_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when quote email was last sent"
)

email_sent_count = models.IntegerField(
    default=0,
    help_text="Number of times quote email has been sent"
)

email_opened_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when quote email was first opened"
)

email_opened_count = models.IntegerField(
    default=0,
    help_text="Number of times quote email has been opened"
)

email_last_error = models.TextField(
    null=True,
    blank=True,
    help_text="Last error message if email send failed"
)
```

### Verification Checklist
- [ ] email_sent_to field added (EmailField)
- [ ] email_sent_at field added (DateTimeField)
- [ ] email_sent_count field added (IntegerField, default=0)
- [ ] email_opened_at field added (DateTimeField)
- [ ] email_opened_count field added (IntegerField, default=0)
- [ ] email_last_error field added (TextField)
- [ ] All email fields nullable where appropriate
- [ ] help_text added to all fields
- [ ] Fields grouped with comment

---

## Task 15: Add Quote Conversion Reference

### Overview
Add a foreign key to link the quote to the sales order it was converted into, maintaining the conversion trail.

### Dependencies
- Task 04: Create Quote Model Core Fields
- Order model must exist (or will exist in future)

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Add converted_to_order field**
   - ForeignKey to Order model
   - Set `on_delete=models.SET_NULL`
   - Set `related_name='converted_from_quote'`
   - Set `null=True, blank=True`
   - Add db_index=True for reverse lookups

3. **Add field help_text**
   - Document purpose: links to converted order
   - Explain SET_NULL behavior
   - Note: populated when status → CONVERTED

4. **Add field grouping comment**
   - Add comment: "# Conversion tracking"
   - Improve code organization

5. **Handle Order model import**
   - Use string reference: `'orders.Order'`
   - Avoids circular import issues
   - Django resolves at runtime

6. **Document conversion workflow**
   - Add model docstring section
   - Explain quote → order conversion process
   - Note bidirectional relationship

### Quote-to-Order Conversion Flow

```
┌────────────────────────────────────────────────┐
│        Quote to Sales Order Conversion         │
└────────────────────────────────────────────────┘

Quote Status: ACCEPTED
    │
    │ User/Customer clicks "Convert to Order"
    │
    ▼
┌─────────────────────────────────────┐
│ 1. Validation                       │
│    - status == ACCEPTED             │
│    - converted_to_order == NULL     │
│    - customer exists                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Create Sales Order               │
│    - Copy customer                  │
│    - Copy line items                │
│    - Copy totals                    │
│    - Copy terms                     │
│    - Set quote_id reference         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. Link Quote to Order              │
│    - quote.converted_to_order       │
│      = created_order                │
│    - quote.status = CONVERTED       │
│    - quote.converted_at = now()     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. Order Processing Begins          │
│    - Order fulfillment               │
│    - Inventory allocation            │
│    - Invoice generation              │
└─────────────────────────────────────┘

Bidirectional Relationship:
Quote.converted_to_order → Order
Order.converted_from_quote → Quote (reverse)
```

### Conversion Relationship Models

**Quote Model:**
```python
class Quote(models.Model):
    # ...
    converted_to_order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        related_name='converted_from_quote',
        null=True,
        blank=True
    )
```

**Order Model (future):**
```python
class Order(models.Model):
    # ...
    # Reverse relationship automatically available:
    # order.converted_from_quote → Quote instance or None
```

### Bidirectional Navigation

**From Quote to Order:**
```python
quote = Quote.objects.get(quote_number='QT-2026-00001')

if quote.converted_to_order:
    order = quote.converted_to_order
    print(f"Converted to Order: {order.order_number}")
else:
    print("Not yet converted")
```

**From Order to Quote:**
```python
order = Order.objects.get(order_number='SO-2026-00001')

try:
    quote = order.converted_from_quote
    print(f"Converted from Quote: {quote.quote_number}")
except Quote.DoesNotExist:
    print("Not converted from quote (direct order)")
```

### on_delete=SET_NULL Reasoning

**Why SET_NULL?**

| Scenario | Behavior | Impact |
|----------|----------|--------|
| **Order deleted** | Quote.converted_to_order → NULL | Quote remains, link removed |
| **CASCADE** | Quote deleted with order | ❌ Lose quote history |
| **PROTECT** | Cannot delete order | ❌ Too restrictive |

**Business Logic:**
- Quotes are permanent records (audit trail)
- Order may be cancelled/deleted
- Quote should remain for reference
- Broken link is acceptable (order gone)

### Conversion Status Validation

**Rules:**

| Rule | Validation | Error Message |
|------|------------|---------------|
| **Must be ACCEPTED** | status == ACCEPTED | "Only accepted quotes can be converted" |
| **Not already converted** | converted_to_order is NULL | "Quote already converted to order" |
| **Customer required** | customer is not NULL | "Customer required for order conversion" |
| **Line items exist** | line_items.count() > 0 | "Quote must have line items" |

**Enforcement Location:**
- Service layer: `QuoteConversionService.convert_to_order()`
- Not in model save() method

### Conversion Data Mapping

**Quote → Order Field Mapping:**

| Quote Field | Order Field | Notes |
|-------------|-------------|-------|
| customer | customer | Direct FK copy |
| currency | currency | Currency must match |
| subtotal | subtotal | Copy calculated value |
| discount_amount | discount_amount | Copy discount |
| tax_amount | tax_amount | Copy tax |
| total | total | Copy total |
| notes | notes | Copy customer notes |
| terms | terms | Copy T&C |
| Line items | Line items | Create OrderLineItem for each QuoteLineItem |

**Fields NOT Copied:**
- quote_number (order gets new order_number)
- Quote-specific status
- Quote timestamps (sent_at, accepted_at)
- PDF file (order generates own)

### Multiple Quotes to One Order?

**Not Supported:** One quote → One order

**If Needed:**
- Merge multiple quotes into one new quote
- Convert merged quote to order
- Alternative: Convert to separate orders

### Order Creation from Quote

**Service Method Signature:**
```python
class QuoteConversionService:
    @staticmethod
    def convert_to_order(quote: Quote) -> Order:
        """
        Convert accepted quote to sales order.
        
        Args:
            quote: Quote instance to convert (must be ACCEPTED)
        
        Returns:
            Order: Newly created order instance
        
        Raises:
            ValidationError: If quote cannot be converted
        """
        # Validation
        if quote.status != QuoteStatus.ACCEPTED:
            raise ValidationError("Only accepted quotes can be converted")
        
        if quote.converted_to_order:
            raise ValidationError("Quote already converted")
        
        # Create order
        with transaction.atomic():
            order = Order.objects.create(
                customer=quote.customer,
                currency=quote.currency,
                subtotal=quote.subtotal,
                discount_amount=quote.discount_amount,
                tax_amount=quote.tax_amount,
                total=quote.total,
                notes=quote.notes,
                terms=quote.terms,
            )
            
            # Copy line items
            for quote_line in quote.line_items.all():
                OrderLineItem.objects.create(
                    order=order,
                    product=quote_line.product,
                    quantity=quote_line.quantity,
                    unit_price=quote_line.unit_price,
                    # ...
                )
            
            # Update quote
            quote.converted_to_order = order
            quote.status = QuoteStatus.CONVERTED
            quote.converted_at = timezone.now()
            quote.save()
            
            return order
```

### Reporting with Conversion Data

**Conversion Rate:**
```python
# Overall conversion rate
total_quotes = Quote.objects.filter(status__in=[
    QuoteStatus.SENT, 
    QuoteStatus.ACCEPTED,
    QuoteStatus.REJECTED,
    QuoteStatus.EXPIRED,
    QuoteStatus.CONVERTED
]).count()

converted = Quote.objects.filter(
    status=QuoteStatus.CONVERTED
).count()

conversion_rate = (converted / total_quotes) * 100
```

**Quotes by Conversion Status:**
```python
# Converted quotes
converted_quotes = Quote.objects.filter(
    converted_to_order__isnull=False
)

# Accepted but not converted yet
pending_conversion = Quote.objects.filter(
    status=QuoteStatus.ACCEPTED,
    converted_to_order__isnull=True
)
```

**Quote Value to Order Value:**
```python
# Total quote value
quote_value = Quote.objects.aggregate(Sum('total'))['total__sum']

# Total converted order value
converted_value = Order.objects.filter(
    converted_from_quote__isnull=False
).aggregate(Sum('total'))['total__sum']
```

### UI Display

**Quote Detail Page:**
```
Status: CONVERTED
Converted to: Order #SO-2026-00001 [View Order]
Converted on: 2026-01-23 14:30:00
Converted by: John Doe (Sales Rep)
```

**Order Detail Page:**
```
Source: Converted from Quote
Quote Number: QT-2026-00001 [View Quote]
Quote Date: 2026-01-20
Original Quote Value: ₨3,622.50
```

### Expected Field Addition
```python
# Conversion tracking (in Quote model)
converted_to_order = models.ForeignKey(
    'orders.Order',
    on_delete=models.SET_NULL,
    related_name='converted_from_quote',
    null=True,
    blank=True,
    db_index=True,
    help_text="Sales order created from this quote (if converted)"
)
```

### Verification Checklist
- [ ] converted_to_order field added (FK to Order)
- [ ] Uses string reference 'orders.Order'
- [ ] on_delete=models.SET_NULL set
- [ ] related_name='converted_from_quote'
- [ ] null=True, blank=True set
- [ ] db_index=True added
- [ ] help_text added
- [ ] Field grouped with comment

---

## Task 16: Create Quote Model Indexes

### Overview
Add database indexes to optimize common query patterns for quote listing, filtering, and reporting.

### Dependencies
- All previous tasks (complete model definition)

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Locate Meta class**
   - Find existing Meta class in Quote model

3. **Add indexes list to Meta**
   - Create `indexes = []` list
   - Add Index objects for common queries

4. **Add composite index for customer and status**
   - Index on (customer, status)
   - Optimize "show all customer quotes by status"
   - Use `models.Index(fields=['customer', 'status'])`

5. **Add composite index for status and created_at**
   - Index on (status, created_at)
   - Optimize "show quotes by status, newest first"
   - Use `models.Index(fields=['status', '-created_at'])`

6. **Add composite index for status and valid_until**
   - Index on (status, valid_until)
   - Optimize expiry checking queries
   - Use `models.Index(fields=['status', 'valid_until'])`

7. **Add index for sent_at**
   - Single column index
   - Already has db_index=True, but document in Meta
   - Optimize "quotes sent in date range"

8. **Add index for total**
   - Already has db_index=True
   - Optimize "quotes over X amount"

9. **Name indexes descriptively**
   - Use `name` parameter
   - Format: `quotes_{fields}_{idx/uniq}`
   - Example: `quotes_customer_status_idx`

10. **Document index purposes**
    - Add comments above each index
    - Explain query patterns optimized

### Database Index Fundamentals

**What is an Index?**
- Data structure that improves query speed
- Trade-off: Faster reads, slower writes
- PostgreSQL uses B-tree indexes by default

**When to Index:**

| Index When | Example |
|------------|---------|
| **Frequent WHERE clause** | `WHERE status = 'SENT'` |
| **Frequent JOIN** | `JOIN customers ON ...` |
| **Frequent ORDER BY** | `ORDER BY created_at DESC` |
| **Foreign Keys** | customer_id, created_by_id |

**When NOT to Index:**

| Skip Index When | Reason |
|-----------------|--------|
| Small tables (<1000 rows) | Sequential scan is fast enough |
| Frequently updated columns | Index maintenance overhead |
| High cardinality loss | Boolean fields (2 values) |
| Low selectivity | Gender field (M/F/O) |

### Quote Model Query Patterns

**Common Queries to Optimize:**

| Query Pattern | Frequency | Fields Used |
|---------------|-----------|-------------|
| List customer quotes | Very High | customer, created_at |
| Filter by status | Very High | status, created_at |
| Expire old quotes | Daily | status, valid_until |
| Search by quote number | High | quote_number (unique) |
| High-value quotes | Medium | total |
| Conversion reporting | Medium | status, converted_to_order |
| User performance | Medium | created_by, status |

### Composite Index Strategy

**What is Composite Index?**
- Index on multiple columns together
- Order matters: most selective first
- Optimizes queries using multiple columns

**Composite vs Multiple Single Indexes:**

| Approach | Query: WHERE customer=X AND status=Y | Performance |
|----------|--------------------------------------|-------------|
| **Composite (customer, status)** | Uses one index efficiently | ✅ Fast |
| **Single customer + Single status** | May use both, less efficient | ⚠️ Slower |
| **No index** | Full table scan | ❌ Very slow |

### Recommended Indexes

**Index 1: Customer + Status**
```python
models.Index(
    fields=['customer', 'status'],
    name='quotes_customer_status_idx'
)
```

**Query Optimized:**
```sql
SELECT * FROM quotes 
WHERE customer_id = 123 
  AND status = 'SENT'
ORDER BY created_at DESC;
```

**Use Cases:**
- Customer portal: "Show my quotes"
- Customer service: "Customer's pending quotes"
- Sales dashboard: "Customer's accepted quotes"

---

**Index 2: Status + Created Date**
```python
models.Index(
    fields=['status', '-created_at'],
    name='quotes_status_created_idx'
)
```

**Query Optimized:**
```sql
SELECT * FROM quotes 
WHERE status = 'SENT'
ORDER BY created_at DESC
LIMIT 50;
```

**Use Cases:**
- Quote list page: "Sent quotes, newest first"
- Management dashboard: "Recent accepted quotes"
- Reporting: "Quotes by status, chronological"

---

**Index 3: Status + Expiry Date**
```python
models.Index(
    fields=['status', 'valid_until'],
    name='quotes_status_expiry_idx'
)
```

**Query Optimized:**
```sql
SELECT * FROM quotes 
WHERE status = 'SENT' 
  AND valid_until < '2026-01-23';
```

**Use Cases:**
- Cron job: "Expire old sent quotes"
- Alert system: "Quotes expiring soon"
- Reporting: "Expired quotes this month"

---

**Index 4: Created By + Status**
```python
models.Index(
    fields=['created_by', 'status'],
    name='quotes_creator_status_idx'
)
```

**Query Optimized:**
```sql
SELECT * FROM quotes 
WHERE created_by_id = 456 
  AND status = 'CONVERTED';
```

**Use Cases:**
- Sales rep dashboard: "My converted quotes"
- Performance review: "Rep's conversion rate"
- Commission calculation: "Rep's closed quotes"

### Index Size Considerations

**Typical Index Sizes:**

| Index Type | Columns | Rows | Size | Impact |
|------------|---------|------|------|--------|
| Single column | quote_number | 10,000 | ~500 KB | Negligible |
| Single column | status | 10,000 | ~300 KB | Negligible |
| Composite (2 cols) | customer, status | 10,000 | ~600 KB | Negligible |
| Composite (3 cols) | customer, status, date | 10,000 | ~800 KB | Negligible |

**Rule of Thumb:** Index size ≈ 10-30% of table size

**At Scale:**
- 100,000 quotes ≈ 50 MB table
- 5 indexes ≈ 10-15 MB total
- Total database impact: < 30%

### Index Ordering (ASC vs DESC)

**ASC (Ascending):** Default, low to high
**DESC (Descending):** High to low

```python
# For ORDER BY created_at DESC queries
models.Index(fields=['-created_at'])  # Note the minus sign

# For ORDER BY created_at ASC queries
models.Index(fields=['created_at'])   # No minus sign
```

**Match Query Direction:** Index order should match ORDER BY direction

### Covering Indexes (Advanced)

**Concept:** Index contains all queried columns

```python
# Query:
SELECT id, quote_number, status, total 
FROM quotes 
WHERE status = 'SENT';

# Covering index:
models.Index(
    fields=['status'],
    # PostgreSQL doesn't support INCLUDE in Django yet
    # Would be: include=['quote_number', 'total']
)
```

**Benefit:** Query served entirely from index (no table lookup)
**Note:** Django/PostgreSQL limited support, use judiciously

### Partial Indexes (PostgreSQL)

**Concept:** Index subset of rows only

```python
from django.db.models import Q

# Index only active quotes (not expired/rejected)
models.Index(
    fields=['created_at'],
    name='quotes_active_idx',
    condition=Q(status__in=['DRAFT', 'SENT', 'ACCEPTED'])
)
```

**Benefit:** Smaller index, faster queries on subset
**Use Case:** Most queries ignore terminal states

### Index Maintenance

**Automatic:** PostgreSQL maintains indexes automatically

**Considerations:**
- INSERT/UPDATE/DELETE slower with many indexes
- VACUUM/ANALYZE keeps indexes optimal
- REINDEX occasionally to rebuild

**Monitoring:**
```sql
-- Check index usage (PostgreSQL)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,  -- Number of index scans
    idx_tup_read  -- Tuples read
FROM pg_stat_user_indexes
WHERE tablename = 'quotes';
```

### Expected Meta Class Update
```python
class Meta:
    db_table = 'quotes'
    verbose_name = 'Quote'
    verbose_name_plural = 'Quotes'
    ordering = ['-created_at']
    
    indexes = [
        # Customer + Status: Optimize customer quote lists by status
        models.Index(
            fields=['customer', 'status'],
            name='quotes_customer_status_idx'
        ),
        
        # Status + Created: Optimize quote lists filtered by status
        models.Index(
            fields=['status', '-created_at'],
            name='quotes_status_created_idx'
        ),
        
        # Status + Expiry: Optimize expiry checking queries
        models.Index(
            fields=['status', 'valid_until'],
            name='quotes_status_expiry_idx'
        ),
        
        # Creator + Status: Optimize sales rep performance queries
        models.Index(
            fields=['created_by', 'status'],
            name='quotes_creator_status_idx'
        ),
    ]
```

### Verification Checklist
- [ ] indexes list added to Meta class
- [ ] Customer + Status composite index added
- [ ] Status + Created composite index added
- [ ] Status + Expiry composite index added
- [ ] Creator + Status composite index added
- [ ] All indexes have descriptive names
- [ ] Index names follow naming convention
- [ ] Comments document index purposes
- [ ] Correct field order in composites

---

## Task 17: Create Quote Model Constraints

### Overview
Add database-level constraints and model validation to enforce business rules and data integrity.

### Dependencies
- All previous tasks (complete model definition)

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Add constraints list to Meta class**
   - Create `constraints = []` list
   - Add CheckConstraint objects

3. **Add constraint: valid_until > issue_date**
   - Ensure expiry date is after issue date
   - Use CheckConstraint with Q object
   - Name: `quotes_valid_until_after_issue_date`

4. **Add constraint: total >= 0**
   - Ensure total amount is not negative
   - Use CheckConstraint
   - Name: `quotes_total_not_negative`

5. **Add constraint: subtotal >= 0**
   - Ensure subtotal is not negative
   - Use CheckConstraint
   - Name: `quotes_subtotal_not_negative`

6. **Add constraint: discount_amount <= subtotal**
   - Ensure discount doesn't exceed subtotal
   - Use CheckConstraint
   - Name: `quotes_discount_not_exceed_subtotal`

7. **Add constraint: discount_value >= 0**
   - Ensure discount value is positive
   - Use CheckConstraint
   - Name: `quotes_discount_value_positive`

8. **Add constraint: percentage discount <= 100**
   - When discount_type = PERCENTAGE, value <= 100
   - Use CheckConstraint with conditional Q
   - Name: `quotes_percentage_max_100`

9. **Add clean() method to model**
   - Override model's clean() method
   - Add validation logic
   - Call super().clean()

10. **Implement customer/guest validation in clean()**
    - Ensure either customer OR guest_name (not both, not neither)
    - Raise ValidationError if invalid

11. **Implement discount validation in clean()**
    - If discount_type set, discount_value required
    - If discount_value set, discount_type required
    - Raise ValidationError if invalid

12. **Add docstring to clean() method**
    - Document validation rules
    - List all checks performed

### Database Constraints vs Model Validation

| Level | When | Scope | Bypassed By |
|-------|------|-------|-------------|
| **Database Constraint** | On INSERT/UPDATE | All database access | None (always enforced) |
| **Model clean()** | On full_clean() call | Django ORM save() | bulk_create(), raw SQL |
| **Form Validation** | On form submit | Web forms only | API, direct model save |
| **Serializer Validation** | On DRF validate | API endpoints | Direct model save |

**Best Practice:** Database constraints as last line of defense

### CheckConstraint Syntax

**Basic Structure:**
```python
from django.db.models import Q, CheckConstraint

constraints = [
    CheckConstraint(
        check=Q(field__condition=value),
        name='table_field_description'
    )
]
```

**Operators:**
| Operator | Django | SQL |
|----------|--------|-----|
| Greater than | `field__gt=value` | `field > value` |
| Greater or equal | `field__gte=value` | `field >= value` |
| Less than | `field__lt=value` | `field < value` |
| Less or equal | `field__lte=value` | `field <= value` |
| Not equal | `~Q(field=value)` | `field != value` |

### Constraint 1: Expiry After Issue Date

**Business Rule:** Quote expiry date must be after issue date

```python
CheckConstraint(
    check=Q(valid_until__gt=models.F('issue_date')) | Q(valid_until__isnull=True),
    name='quotes_valid_until_after_issue_date'
)
```

**SQL Generated:**
```sql
ALTER TABLE quotes 
ADD CONSTRAINT quotes_valid_until_after_issue_date 
CHECK (valid_until > issue_date OR valid_until IS NULL);
```

**Prevents:**
```python
# This will fail at database level
quote = Quote(
    issue_date=date(2026, 1, 20),
    valid_until=date(2026, 1, 19)  # Before issue date!
)
quote.save()  # IntegrityError
```

### Constraint 2: Total Not Negative

**Business Rule:** Quote total cannot be negative

```python
CheckConstraint(
    check=Q(total__gte=0),
    name='quotes_total_not_negative'
)
```

**Prevents:**
```python
quote = Quote(total=Decimal('-100.00'))  # Negative!
quote.save()  # IntegrityError
```

### Constraint 3: Subtotal Not Negative

**Business Rule:** Quote subtotal cannot be negative

```python
CheckConstraint(
    check=Q(subtotal__gte=0),
    name='quotes_subtotal_not_negative'
)
```

### Constraint 4: Discount Not Exceed Subtotal

**Business Rule:** Discount amount cannot exceed subtotal

```python
CheckConstraint(
    check=Q(discount_amount__lte=models.F('subtotal')),
    name='quotes_discount_not_exceed_subtotal'
)
```

**Prevents:**
```python
quote = Quote(
    subtotal=Decimal('1000.00'),
    discount_amount=Decimal('1500.00')  # More than subtotal!
)
quote.save()  # IntegrityError
```

### Constraint 5: Discount Value Positive

**Business Rule:** Discount value must be positive or zero

```python
CheckConstraint(
    check=Q(discount_value__gte=0),
    name='quotes_discount_value_positive'
)
```

### Constraint 6: Percentage Max 100

**Business Rule:** When discount_type is PERCENTAGE, value cannot exceed 100

```python
CheckConstraint(
    check=Q(discount_type='FIXED') | Q(discount_value__lte=100),
    name='quotes_percentage_max_100'
)
```

**Logic:**
- If discount_type = FIXED, constraint passes (any value OK)
- If discount_type = PERCENTAGE, value must be <= 100

**Prevents:**
```python
quote = Quote(
    discount_type='PERCENTAGE',
    discount_value=Decimal('150.00')  # 150%!
)
quote.save()  # IntegrityError
```

### Model clean() Method

**Purpose:** Additional validation beyond database constraints

```python
def clean(self):
    """
    Validate quote data.
    
    Checks:
    - Customer or guest_name required (not both)
    - Discount type/value consistency
    - Status-based edit restrictions
    """
    super().clean()
    
    errors = {}
    
    # Validation logic here
    
    if errors:
        raise ValidationError(errors)
```

**When Called:**
- Explicitly: `quote.full_clean()`
- Admin forms: Automatically
- DRF serializers: Can call it
- Model save(): NOT automatic (must call manually)

### Customer/Guest Validation

**Business Rule:** Either customer OR guest_name, not both, not neither

```python
# In clean() method

# Check: Neither customer nor guest provided
if not self.customer and not self.guest_name:
    errors['customer'] = 'Either customer or guest name is required'
    errors['guest_name'] = 'Either customer or guest name is required'

# Check: Both customer and guest provided
if self.customer and self.guest_name:
    errors['customer'] = 'Cannot specify both customer and guest name'
    errors['guest_name'] = 'Cannot specify both customer and guest name'

# Check: Guest email required if guest_name provided
if self.guest_name and not self.guest_email:
    errors['guest_email'] = 'Guest email required for guest quotes'
```

### Discount Validation

**Business Rule:** discount_type and discount_value must be consistent

```python
# In clean() method

# Check: discount_type without discount_value
if self.discount_type and not self.discount_value:
    errors['discount_value'] = 'Discount value required when type is set'

# Check: discount_value without discount_type
if self.discount_value and not self.discount_type:
    errors['discount_type'] = 'Discount type required when value is set'

# Check: percentage range
if self.discount_type == 'PERCENTAGE':
    if not (0 <= self.discount_value <= 100):
        errors['discount_value'] = 'Percentage must be between 0 and 100'

# Check: fixed discount not exceed subtotal
if self.discount_type == 'FIXED' and self.subtotal:
    if self.discount_value > self.subtotal:
        errors['discount_value'] = 'Discount cannot exceed subtotal'
```

### Status-Based Edit Restrictions

**Business Rule:** Cannot edit quote if status is not DRAFT

```python
# In clean() method

# Only validate on updates (not new quotes)
if self.pk:  # Exists in database
    # Get original from database
    try:
        original = Quote.objects.get(pk=self.pk)
        
        # Check if trying to edit non-draft quote
        if original.status != QuoteStatus.DRAFT and self.status != original.status:
            errors['status'] = f'Cannot modify quote in {original.status} status'
        
    except Quote.DoesNotExist:
        pass  # New quote, allow
```

### ValidationError Format

**Single Field Error:**
```python
raise ValidationError({
    'field_name': 'Error message'
})
```

**Multiple Field Errors:**
```python
raise ValidationError({
    'field1': 'Error message 1',
    'field2': 'Error message 2'
})
```

**Non-Field Error:**
```python
raise ValidationError({
    '__all__': 'General validation error message'
})
```

### Constraint Naming Convention

**Format:** `{table}_{field(s)}_{description}`

| Example | Breakdown |
|---------|-----------|
| `quotes_total_not_negative` | table: quotes, field: total, check: not negative |
| `quotes_valid_until_after_issue_date` | table: quotes, fields: valid_until/issue_date, check: after |
| `quotes_percentage_max_100` | table: quotes, field: discount_value, check: max 100 |

**Best Practice:** Descriptive names for debugging

### Constraint Error Handling

**Catching Constraint Violations:**
```python
from django.db import IntegrityError

try:
    quote.save()
except IntegrityError as e:
    if 'quotes_total_not_negative' in str(e):
        print("Total cannot be negative")
    elif 'quotes_discount_not_exceed_subtotal' in str(e):
        print("Discount exceeds subtotal")
    else:
        raise  # Unknown error
```

**User-Friendly Messages:**
- Parse constraint name from error
- Map to user-friendly message
- Display in form/API response

### Expected Code Additions

**Meta class constraints:**
```python
class Meta:
    db_table = 'quotes'
    verbose_name = 'Quote'
    verbose_name_plural = 'Quotes'
    ordering = ['-created_at']
    
    indexes = [...]  # From Task 16
    
    constraints = [
        # Expiry date must be after issue date
        CheckConstraint(
            check=Q(valid_until__gt=models.F('issue_date')) | Q(valid_until__isnull=True),
            name='quotes_valid_until_after_issue_date'
        ),
        
        # Financial amounts cannot be negative
        CheckConstraint(
            check=Q(total__gte=0),
            name='quotes_total_not_negative'
        ),
        
        CheckConstraint(
            check=Q(subtotal__gte=0),
            name='quotes_subtotal_not_negative'
        ),
        
        # Discount cannot exceed subtotal
        CheckConstraint(
            check=Q(discount_amount__lte=models.F('subtotal')),
            name='quotes_discount_not_exceed_subtotal'
        ),
        
        # Discount value must be positive
        CheckConstraint(
            check=Q(discount_value__gte=0),
            name='quotes_discount_value_positive'
        ),
        
        # Percentage discount max 100%
        CheckConstraint(
            check=Q(discount_type='FIXED') | Q(discount_value__lte=100),
            name='quotes_percentage_max_100'
        ),
    ]
```

**clean() method:**
```python
def clean(self):
    """
    Validate quote business rules.
    
    Validates:
    - Customer XOR guest_name (exactly one required)
    - Guest email required for guest quotes
    - Discount type and value consistency
    - Percentage discount range (0-100)
    - Fixed discount not exceeding subtotal
    """
    super().clean()
    
    errors = {}
    
    # Customer/Guest validation
    if not self.customer and not self.guest_name:
        errors['customer'] = 'Either customer or guest name is required'
    
    if self.customer and self.guest_name:
        errors['guest_name'] = 'Cannot specify both customer and guest name'
    
    if self.guest_name and not self.guest_email:
        errors['guest_email'] = 'Guest email required for guest quotes'
    
    # Discount validation
    if self.discount_type and not self.discount_value:
        errors['discount_value'] = 'Discount value required when type is set'
    
    if self.discount_value and not self.discount_type:
        errors['discount_type'] = 'Discount type required when value is set'
    
    if self.discount_type == 'PERCENTAGE' and self.discount_value:
        if not (0 <= self.discount_value <= 100):
            errors['discount_value'] = 'Percentage must be between 0 and 100'
    
    if self.discount_type == 'FIXED' and self.subtotal and self.discount_value:
        if self.discount_value > self.subtotal:
            errors['discount_value'] = 'Discount cannot exceed subtotal'
    
    if errors:
        raise ValidationError(errors)
```

### Verification Checklist
- [ ] constraints list added to Meta class
- [ ] valid_until > issue_date constraint added
- [ ] total >= 0 constraint added
- [ ] subtotal >= 0 constraint added
- [ ] discount_amount <= subtotal constraint added
- [ ] discount_value >= 0 constraint added
- [ ] percentage <= 100 constraint added
- [ ] All constraints have descriptive names
- [ ] clean() method implemented
- [ ] Customer/guest validation in clean()
- [ ] Discount validation in clean()
- [ ] Clean method has comprehensive docstring

---

## Task 18: Run Initial Quote Migrations

### Overview
Generate and apply database migrations to create the quotes table with all fields, indexes, and constraints.

### Dependencies
- All previous tasks (complete Quote model)

### Instructions

1. **Verify all model changes are saved**
   - Ensure quote.py is saved
   - Ensure constants.py is saved
   - Ensure services/number_generator.py is saved

2. **Activate virtual environment**
   - If using venv/virtualenv
   - Ensure Django is available

3. **Generate migrations**
   - Run: `python manage.py makemigrations quotes`
   - Review generated migration file
   - Check for expected operations

4. **Review migration file**
   - Open `apps/quotes/migrations/0001_initial.py`
   - Verify all fields present
   - Verify indexes present
   - Verify constraints present

5. **Test migration (dry run)**
   - Run: `python manage.py migrate quotes --plan`
   - Review planned operations
   - Ensure no errors

6. **Apply migration to public schema (if applicable)**
   - If using django-tenants with public schema
   - Run: `python manage.py migrate_schemas --schema=public`

7. **Apply migration to all tenant schemas**
   - Run: `python manage.py migrate_schemas --shared`
   - Or: `python manage.py migrate` (tenant-aware)

8. **Verify migration success**
   - Check for errors in output
   - Verify quotes table created

9. **Test database access**
   - Open Django shell: `python manage.py shell_plus`
   - Import Quote model
   - Test basic CRUD operations

10. **Commit migration files**
    - Add migration file to git
    - Commit with descriptive message
    - Push to repository

### Migration File Structure

**Expected 0001_initial.py:**
```python
from django.db import migrations, models
import django.db.models.deletion
import uuid
import apps.quotes.models.quote


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customers', '0001_initial'),
        ('orders', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Quote',
            fields=[
                ('id', models.UUIDField(...)),
                ('quote_number', models.CharField(...)),
                ('status', models.CharField(...)),
                # ... all fields
            ],
            options={
                'db_table': 'quotes',
                'verbose_name': 'Quote',
                'verbose_name_plural': 'Quotes',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(...),  # All indexes
        migrations.AddConstraint(...),  # All constraints
    ]
```

### Migration Commands Reference

| Command | Purpose |
|---------|---------|
| `makemigrations quotes` | Generate migration for quotes app |
| `migrate quotes` | Apply quotes migrations |
| `migrate --plan` | Show migration plan (dry run) |
| `migrate --fake quotes 0001` | Mark migration as applied without running |
| `migrate quotes zero` | Rollback all quotes migrations |
| `showmigrations quotes` | Show migration status |

### Multi-Tenancy Migration

**If using django-tenants:**

```bash
# Migrate public schema (shared apps)
python manage.py migrate_schemas --schema=public

# Migrate all tenant schemas (tenant apps)
python manage.py migrate_schemas --shared

# Migrate specific tenant
python manage.py migrate_schemas --schema=tenant_name
```

**Quote app location:**
- **TENANT_APPS:** Each tenant has own quotes table
- **SHARED_APPS:** Single quotes table (not recommended)

### Migration Verification

**Check Table Created:**
```sql
-- PostgreSQL
\dt quotes

-- Show table structure
\d quotes

-- Count rows (should be 0)
SELECT COUNT(*) FROM quotes;
```

**Check Indexes:**
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'quotes';
```

**Check Constraints:**
```sql
SELECT conname, contype, consrc
FROM pg_constraint
WHERE conrelid = 'quotes'::regclass;
```

### Testing Basic CRUD

**Django Shell Test:**
```python
# Open shell
python manage.py shell_plus

# Import models
from apps.quotes.models import Quote
from apps.quotes.constants import QuoteStatus
from apps.customers.models import Customer

# Create test quote
customer = Customer.objects.first()
quote = Quote.objects.create(
    quote_number='QT-2026-00001',
    customer=customer,
    status=QuoteStatus.DRAFT,
    title='Test Quote'
)

# Verify creation
print(quote)
print(quote.id)

# Read
quote = Quote.objects.get(quote_number='QT-2026-00001')

# Update
quote.status = QuoteStatus.SENT
quote.save()

# Delete
quote.delete()

# Verify
assert Quote.objects.filter(quote_number='QT-2026-00001').count() == 0
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Dependency missing** | Referenced model not migrated | Migrate dependency first |
| **Field type mismatch** | Changed field type | Create explicit migration |
| **Constraint violation** | Existing data violates constraint | Clean data or adjust constraint |
| **Index name conflict** | Duplicate index name | Rename index |
| **Foreign key error** | Related table doesn't exist | Check migration dependencies |

### Migration Dependencies

**Quote model depends on:**
- `customers.Customer` (FK)
- `orders.Order` (FK, may be future)
- `settings.AUTH_USER_MODEL` (FK)

**Ensure migrations exist:**
```bash
# Check customer migrations
python manage.py showmigrations customers

# Check orders migrations (if exists)
python manage.py showmigrations orders
```

**If missing:**
```bash
# Create customer migrations first
python manage.py makemigrations customers
python manage.py migrate customers

# Then create quotes migrations
python manage.py makemigrations quotes
python manage.py migrate quotes
```

### Rollback Strategy

**If migration fails:**

```bash
# Rollback to previous state
python manage.py migrate quotes 0000

# Or rollback completely
python manage.py migrate quotes zero

# Fix issues in model

# Regenerate migration
python manage.py makemigrations quotes

# Reapply
python manage.py migrate quotes
```

### Production Migration Checklist

**Before Production Deployment:**

| Step | Check |
|------|-------|
| ✓ Migration tested locally | Run and verify |
| ✓ Migration tested on staging | Verify with staging data |
| ✓ Data backup created | Backup production database |
| ✓ Downtime window scheduled | If needed for large tables |
| ✓ Rollback plan documented | Know how to revert |
| ✓ Team notified | Communication |

**During Production Deployment:**
1. Put application in maintenance mode
2. Create database backup
3. Run migrations
4. Verify table created
5. Test basic operations
6. Resume application
7. Monitor for errors

### Expected Output

**Successful makemigrations:**
```
Migrations for 'quotes':
  apps/quotes/migrations/0001_initial.py
    - Create model Quote
    - Create index quotes_customer_status_idx on field(s) customer, status of model quote
    - Create index quotes_status_created_idx on field(s) status, -created_at of model quote
    - Create index quotes_status_expiry_idx on field(s) status, valid_until of model quote
    - Create index quotes_creator_status_idx on field(s) created_by, status of model quote
    - Create constraint quotes_valid_until_after_issue_date on model quote
    - Create constraint quotes_total_not_negative on model quote
    - Create constraint quotes_subtotal_not_negative on model quote
    - Create constraint quotes_discount_not_exceed_subtotal on model quote
    - Create constraint quotes_discount_value_positive on model quote
    - Create constraint quotes_percentage_max_100 on model quote
```

**Successful migrate:**
```
Operations to perform:
  Apply all migrations: quotes
Running migrations:
  Applying quotes.0001_initial... OK
```

### Verification Checklist
- [ ] makemigrations command run successfully
- [ ] 0001_initial.py migration file created
- [ ] Migration file reviewed for correctness
- [ ] All fields present in migration
- [ ] All indexes present in migration
- [ ] All constraints present in migration
- [ ] migrate command run successfully
- [ ] No errors during migration
- [ ] quotes table exists in database
- [ ] Basic CRUD operations tested
- [ ] Migration file committed to git

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 13 | Add Quote PDF Storage Field | pdf_file FileField, pdf_generated_at timestamp |
| 14 | Add Quote Email Tracking Fields | 6 email tracking fields for delivery monitoring |
| 15 | Add Quote Conversion Reference | converted_to_order FK to Order model |
| 16 | Create Quote Model Indexes | 4 composite indexes for query optimization |
| 17 | Create Quote Model Constraints | 6 database constraints + clean() validation |
| 18 | Run Initial Quote Migrations | Database table created with all features |

### Complete Quote Model (Final)
```python
class Quote(models.Model):
    # Core identification (Tasks 04)
    id                    # UUIDField (PK)
    quote_number          # CharField (unique, indexed)
    status                # CharField (choices, indexed)
    title                 # CharField (optional)
    
    # Customer relationship (Task 05)
    customer              # FK to Customer
    guest_name            # CharField
    guest_email           # EmailField
    guest_phone           # CharField
    guest_company         # CharField
    
    # Date tracking (Task 06)
    issue_date            # DateField (indexed)
    valid_until           # DateField (indexed)
    sent_at               # DateTimeField
    accepted_at           # DateTimeField
    rejected_at           # DateTimeField
    expired_at            # DateTimeField
    converted_at          # DateTimeField
    created_at            # DateTimeField (auto)
    updated_at            # DateTimeField (auto)
    
    # Financial summary (Task 07)
    subtotal              # DecimalField
    discount_amount       # DecimalField
    tax_amount            # DecimalField
    total                 # DecimalField (indexed)
    
    # Metadata (Task 08)
    notes                 # TextField
    terms                 # TextField
    internal_notes        # TextField
    tags                  # CharField
    attachment_count      # IntegerField
    
    # User references (Task 09)
    created_by            # FK to User
    sent_by               # FK to User
    accepted_by           # FK to User
    
    # Currency (Task 10)
    currency              # CharField (LKR/USD)
    
    # Discount (Task 11)
    discount_type         # CharField (PERCENTAGE/FIXED)
    discount_value        # DecimalField
    
    # PDF storage (Task 13)
    pdf_file              # FileField
    pdf_generated_at      # DateTimeField
    
    # Email tracking (Task 14)
    email_sent_to         # EmailField
    email_sent_at         # DateTimeField
    email_sent_count      # IntegerField
    email_opened_at       # DateTimeField
    email_opened_count    # IntegerField
    email_last_error      # TextField
    
    # Conversion tracking (Task 15)
    converted_to_order    # FK to Order
    
    # Indexes (Task 16)
    # - customer + status
    # - status + created_at
    # - status + valid_until
    # - created_by + status
    
    # Constraints (Task 17)
    # - valid_until > issue_date
    # - total >= 0
    # - subtotal >= 0
    # - discount_amount <= subtotal
    # - discount_value >= 0
    # - percentage <= 100
```

### Group A Complete Deliverables
```
apps/quotes/
├── __init__.py
├── apps.py
├── constants.py
│   ├── QuoteStatus (6 states)
│   ├── CurrencyChoice (LKR, USD)
│   ├── DiscountType (PERCENTAGE, FIXED)
│   └── CURRENCY_SYMBOLS dict
├── models/
│   ├── __init__.py
│   └── quote.py (complete Quote model)
├── services/
│   ├── __init__.py
│   └── number_generator.py (generate_quote_number)
├── migrations/
│   └── 0001_initial.py (applied)
└── tests/
    └── ... (placeholders)
```

### Quote Model Capabilities (Complete)
✅ Unique identification (UUID + quote_number)  
✅ 6-state lifecycle management  
✅ Customer and guest support  
✅ Complete date tracking  
✅ Financial calculations  
✅ Rich metadata  
✅ User audit trail  
✅ Multi-currency (LKR/USD)  
✅ Flexible discounts  
✅ Auto quote numbering  
✅ PDF storage  
✅ Email tracking  
✅ Order conversion link  
✅ Database indexes  
✅ Data integrity constraints  
✅ Database migrations applied  

### Next Steps
Proceed to **Group B: Quote Line Items & Calculations** to create:
- QuoteLineItem model
- Line-level pricing and discounts
- Quantity and unit price handling
- Line item totals calculation
- Quote summary recalculation logic

---

## Notes for AI Agents

1. **Migration Order:** Always makemigrations before migrate
2. **Dependency Check:** Ensure customer/user migrations exist first
3. **Multi-Tenancy:** Use migrate_schemas for tenant apps
4. **Constraint Naming:** Follow table_field_description convention
5. **Index Strategy:** Composite indexes for multi-column queries
6. **Clean() Method:** Not called automatically on save()
7. **FileField Path:** Organized by year for scalability
8. **Email Tracking:** Requires external tracking pixel implementation
9. **Order Conversion:** Bidirectional relationship with Order model
10. **Production Migrations:** Always backup before running migrations
