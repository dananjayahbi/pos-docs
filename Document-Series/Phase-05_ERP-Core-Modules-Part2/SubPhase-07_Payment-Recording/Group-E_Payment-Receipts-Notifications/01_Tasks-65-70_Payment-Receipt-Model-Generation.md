# Tasks 65-70: Payment Receipt Model and Generation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** E - Payment Receipts & Notifications  
> **Document:** 01 of 03  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-D_Refunds-Adjustments](../Group-D_Refunds-Adjustments/)
- **→ Next Document:** [02_Tasks-71-73_Receipt-PDF-Generation.md](02_Tasks-71-73_Receipt-PDF-Generation.md)

---

## Document Overview

This document implements payment receipt models and generation logic, creating official receipts for payments that can be provided to customers. This includes the receipt data model, number generation, PDF storage configuration, receipt generation workflow, and basic receipt data structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create PaymentReceipt Model | Medium | 25 min |
| 66 | Generate Receipt Numbers | Low | 15 min |
| 67 | Add Receipt PDF Storage | Medium | 20 min |
| 68 | Link Receipts to Payments | Low | 15 min |
| 69 | Implement Receipt Generation | High | 35 min |
| 70 | Create Receipt Migrations | Low | 15 min |

---

## Task 65: Create PaymentReceipt Model

### Overview
Create the PaymentReceipt model to store payment receipt records with comprehensive tracking of receipt generation, PDF storage, and delivery status.

### Dependencies
- Payment model exists
- Invoice model exists
- Customer model exists

### Instructions

1. **Create payment_receipt.py model file**
   - Create file at `apps/payments/models/payment_receipt.py`
   - Import BaseModel, Payment, Invoice, Customer
   - Define PaymentReceipt model

2. **Define core receipt fields**
   - receipt_number: Unique identifier (e.g., REC-2026-00001)
   - payment: ForeignKey to Payment
   - invoice: ForeignKey to Invoice (optional)
   - customer: ForeignKey to Customer
   - receipt_date: Date of receipt

3. **Define receipt content fields**
   - receipt_amount: Amount on receipt
   - payment_method: Copy of payment method
   - reference_number: Copy of payment reference
   - notes: Optional notes for receipt

4. **Define PDF and delivery fields**
   - pdf_file: FileField for PDF storage
   - pdf_generated_at: When PDF was generated
   - is_sent: Email delivery status
   - sent_at: When receipt was sent
   - sent_to: Email address sent to

5. **Add helper methods**
   - has_pdf(): Check if PDF exists
   - get_pdf_url(): Get PDF download URL
   - mark_as_sent(): Mark receipt as sent

### Model Structure

```python
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal
from core.models import BaseModel


class PaymentReceipt(BaseModel):
    """
    Payment receipt model
    
    Stores official receipts for payments that can be provided
    to customers. Includes PDF generation and email delivery tracking.
    """
    # Reference
    receipt_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text='Unique receipt number (e.g., REC-2026-00001)'
    )
    
    # Links
    payment = models.OneToOneField(
        'Payment',
        on_delete=models.PROTECT,
        related_name='receipt',
        help_text='Payment this receipt is for'
    )
    invoice = models.ForeignKey(
        'invoices.Invoice',
        on_delete=models.PROTECT,
        related_name='payment_receipts',
        blank=True,
        null=True,
        help_text='Invoice related to this receipt'
    )
    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.PROTECT,
        related_name='payment_receipts',
        help_text='Customer receiving receipt'
    )
    
    # Receipt Details
    receipt_date = models.DateField(
        help_text='Date of receipt'
    )
    receipt_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text='Amount on receipt'
    )
    payment_method = models.CharField(
        max_length=20,
        help_text='Payment method (copy from payment)'
    )
    reference_number = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text='Payment reference number'
    )
    
    # Currency
    currency = models.CharField(
        max_length=3,
        default='LKR',
        help_text='Currency code'
    )
    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        default=Decimal('1.000000'),
        help_text='Exchange rate (if not LKR)'
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        null=True,
        help_text='Notes to include on receipt'
    )
    
    # PDF Storage
    pdf_file = models.FileField(
        upload_to='receipts/pdfs/%Y/%m/',
        blank=True,
        null=True,
        help_text='Generated PDF file'
    )
    pdf_generated_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When PDF was generated'
    )
    
    # Email Delivery
    is_sent = models.BooleanField(
        default=False,
        help_text='Whether receipt has been sent to customer'
    )
    sent_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When receipt was sent'
    )
    sent_to = models.EmailField(
        blank=True,
        null=True,
        help_text='Email address receipt was sent to'
    )
    sent_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_receipts',
        help_text='User who sent receipt'
    )
    
    # Generation Tracking
    generated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='generated_receipts',
        help_text='User who generated receipt'
    )
    
    class Meta:
        db_table = 'payment_receipts'
        ordering = ['-receipt_date', '-created_at']
        verbose_name = 'Payment Receipt'
        verbose_name_plural = 'Payment Receipts'
        indexes = [
            models.Index(fields=['receipt_number']),
            models.Index(fields=['customer', '-receipt_date']),
            models.Index(fields=['payment']),
            models.Index(fields=['invoice']),
            models.Index(fields=['-receipt_date']),
            models.Index(fields=['is_sent', '-sent_at']),
        ]
    
    def __str__(self):
        return f'{self.receipt_number} - {self.customer.name} - Rs. {self.receipt_amount}'
    
    def has_pdf(self):
        """
        Check if receipt has PDF generated
        
        Returns:
            bool: True if PDF exists
        """
        return bool(self.pdf_file and self.pdf_generated_at)
    
    def get_pdf_url(self):
        """
        Get PDF download URL
        
        Returns:
            str or None: PDF URL if exists
        """
        if self.pdf_file:
            return self.pdf_file.url
        return None
    
    def mark_as_sent(self, sent_to, sent_by=None):
        """
        Mark receipt as sent to customer
        
        Args:
            sent_to: Email address sent to
            sent_by: User who sent receipt
        """
        self.is_sent = True
        self.sent_at = timezone.now()
        self.sent_to = sent_to
        self.sent_by = sent_by
        self.save(update_fields=['is_sent', 'sent_at', 'sent_to', 'sent_by'])
    
    def get_display_method(self):
        """
        Get human-readable payment method
        
        Returns:
            str: Display name for payment method
        """
        method_names = {
            'CASH': 'Cash',
            'CARD': 'Card',
            'BANK_TRANSFER': 'Bank Transfer',
            'MOBILE': 'Mobile Payment',
            'CHECK': 'Check',
            'STORE_CREDIT': 'Store Credit'
        }
        return method_names.get(self.payment_method, self.payment_method)
```

### Receipt Model Relationship Diagram

```
PaymentReceipt
      │
      ├──► Payment (OneToOne)
      │     └─ payment_number, amount, method
      │
      ├──► Invoice (ForeignKey, optional)
      │     └─ invoice_number, total_amount
      │
      └──► Customer (ForeignKey)
            └─ name, email, address

Receipt Properties:
├─ receipt_number: REC-2026-00001
├─ receipt_date: 2026-01-15
├─ receipt_amount: Rs. 50,000
├─ payment_method: CARD
├─ pdf_file: receipts/pdfs/2026/01/REC-2026-00001.pdf
├─ is_sent: True
└─ sent_to: customer@example.com
```

### Expected Outcome
- PaymentReceipt model for tracking receipts
- One-to-one relationship with Payment
- PDF storage configuration
- Email delivery tracking
- Helper methods for PDF and send status

### Verification Checklist
- [ ] payment_receipt.py created in models/
- [ ] PaymentReceipt model defined
- [ ] receipt_number unique field
- [ ] OneToOneField with Payment
- [ ] ForeignKeys to Invoice and Customer
- [ ] PDF FileField with upload_to path
- [ ] Email delivery fields (is_sent, sent_at, sent_to)
- [ ] has_pdf() method
- [ ] get_pdf_url() method
- [ ] mark_as_sent() method
- [ ] get_display_method() helper

---

## Task 66: Generate Receipt Numbers

### Overview
Implement unique receipt number generation with sequential numbering per year, similar to payment and invoice numbers.

### Dependencies
- Task 65: PaymentReceipt model created

### Instructions

1. **Create generate_receipt_number() function**
   - Format: REC-{YEAR}-{SEQUENCE}
   - Sequential per tenant per year
   - Thread-safe generation

2. **Implement sequence logic**
   - Get max receipt number for current year
   - Increment sequence
   - Handle year rollover

3. **Add to receipt generation workflow**
   - Call during receipt creation
   - Store in receipt_number field

### Implementation

```python
# Add to apps/payments/services/receipt_service.py (or utilities)

import logging
from django.db import transaction
from django.db.models import Max
from django.utils import timezone

logger = logging.getLogger(__name__)


def generate_receipt_number(tenant):
    """
    Generate unique receipt number
    
    Args:
        tenant: Tenant instance
        
    Returns:
        str: Unique receipt number (e.g., REC-2026-00001)
    """
    from apps.payments.models.payment_receipt import PaymentReceipt
    
    year = timezone.now().year
    prefix = f'REC-{year}-'
    
    # Get last receipt number for this year
    last_receipt = PaymentReceipt.objects.filter(
        tenant=tenant,
        receipt_number__startswith=prefix
    ).aggregate(
        max_seq=Max('receipt_number')
    )['max_seq']
    
    if last_receipt:
        # Extract sequence number from last receipt
        last_seq = int(last_receipt.split('-')[-1])
        new_seq = last_seq + 1
    else:
        # First receipt of the year
        new_seq = 1
    
    receipt_number = f'{prefix}{new_seq:05d}'
    
    logger.debug(f'Generated receipt number: {receipt_number}')
    
    return receipt_number
```

### Receipt Number Examples

```
Year 2026:
REC-2026-00001  ← First receipt
REC-2026-00002
REC-2026-00003
...
REC-2026-00100
...
REC-2026-09999

Year 2027:
REC-2027-00001  ← Sequence resets
REC-2027-00002
...
```

### Expected Outcome
- Unique receipt number generation
- Sequential numbering per year
- Thread-safe implementation
- Consistent format (REC-YYYY-NNNNN)

### Verification Checklist
- [ ] generate_receipt_number() function created
- [ ] Sequential logic implemented
- [ ] Year prefix (REC-YYYY-)
- [ ] 5-digit sequence with zero padding
- [ ] Tenant filtering
- [ ] Year rollover handling

---

## Task 67: Add Receipt PDF Storage

### Overview
Configure file storage for receipt PDFs, including storage paths, file naming, and cleanup strategies.

### Dependencies
- Task 65: PaymentReceipt model with pdf_file field
- Django file storage configured

### Instructions

1. **Configure media storage settings**
   - Ensure MEDIA_ROOT and MEDIA_URL configured
   - Receipt PDFs stored in receipts/pdfs/YYYY/MM/

2. **Define PDF file naming convention**
   - Format: {receipt_number}.pdf
   - Example: REC-2026-00001.pdf

3. **Add PDF cleanup logic (optional)**
   - Delete old PDFs after certain period
   - Or archive to cheaper storage

4. **Configure PDF file permissions**
   - Secure PDF access
   - Only authorized users can download

### Implementation

```python
# settings.py configuration

# Media files configuration
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
FILE_UPLOAD_PERMISSIONS = 0o644

# Receipt PDF settings
RECEIPT_PDF_RETENTION_DAYS = 365 * 3  # Keep for 3 years


# Add to PaymentReceipt model (update upload_to)

def receipt_pdf_path(instance, filename):
    """
    Generate upload path for receipt PDF
    
    Args:
        instance: PaymentReceipt instance
        filename: Original filename
        
    Returns:
        str: Upload path
    """
    # Use receipt number as filename
    pdf_filename = f'{instance.receipt_number}.pdf'
    
    # Organize by year and month
    year = instance.receipt_date.year
    month = instance.receipt_date.month
    
    return f'receipts/pdfs/{year}/{month:02d}/{pdf_filename}'


class PaymentReceipt(BaseModel):
    # ... other fields ...
    
    pdf_file = models.FileField(
        upload_to=receipt_pdf_path,
        blank=True,
        null=True,
        help_text='Generated PDF file'
    )
```

### PDF Storage Structure

```
media/
└── receipts/
    └── pdfs/
        ├── 2026/
        │   ├── 01/
        │   │   ├── REC-2026-00001.pdf
        │   │   ├── REC-2026-00002.pdf
        │   │   └── REC-2026-00003.pdf
        │   ├── 02/
        │   │   ├── REC-2026-00045.pdf
        │   │   └── REC-2026-00046.pdf
        │   └── 03/
        │       └── REC-2026-00089.pdf
        └── 2027/
            └── 01/
                └── REC-2027-00001.pdf
```

### Expected Outcome
- Organized PDF storage by year/month
- Consistent file naming
- Media storage configuration
- Optional PDF cleanup strategy

### Verification Checklist
- [ ] MEDIA_ROOT and MEDIA_URL configured
- [ ] receipt_pdf_path() function for upload_to
- [ ] PDF files saved to receipts/pdfs/YYYY/MM/
- [ ] Filename format: {receipt_number}.pdf
- [ ] File permissions configured

---

## Task 68: Link Receipts to Payments

### Overview
Ensure proper one-to-one linkage between receipts and payments, with validation to prevent duplicate receipts.

### Dependencies
- Task 65: PaymentReceipt model with payment relationship

### Instructions

1. **Validate one receipt per payment**
   - Check payment doesn't already have receipt
   - Raise error if attempting duplicate

2. **Add has_receipt() method to Payment**
   - Check if payment has associated receipt
   - Return receipt if exists

3. **Add get_or_create_receipt() helper**
   - Get existing receipt or create new one
   - Prevent duplicates

### Implementation

```python
# Add to Payment model (apps/payments/models/payment.py)

def has_receipt(self):
    """
    Check if payment has receipt
    
    Returns:
        bool: True if receipt exists
    """
    return hasattr(self, 'receipt') and self.receipt is not None


def get_receipt(self):
    """
    Get payment receipt
    
    Returns:
        PaymentReceipt or None: Receipt if exists
    """
    try:
        return self.receipt
    except PaymentReceipt.DoesNotExist:
        return None


# Add to ReceiptService (create new file if needed)

@staticmethod
def validate_receipt_creation(payment):
    """
    Validate that receipt can be created for payment
    
    Args:
        payment: Payment instance
        
    Returns:
        dict: Validation result
    """
    errors = []
    
    # Check payment status
    if payment.status != PaymentStatus.COMPLETED:
        errors.append(
            f'Cannot create receipt for payment {payment.payment_number} '
            f'(status: {payment.status}). Payment must be COMPLETED.'
        )
    
    # Check for existing receipt
    if payment.has_receipt():
        errors.append(
            f'Receipt already exists for payment {payment.payment_number} '
            f'(receipt: {payment.receipt.receipt_number})'
        )
    
    if errors:
        return {
            'valid': False,
            'errors': errors
        }
    
    return {
        'valid': True,
        'message': 'Receipt can be created'
    }
```

### Payment-Receipt Relationship

```
Payment: PAY-2026-00123
├─ Status: COMPLETED
├─ Amount: Rs. 50,000
├─ Method: CARD
├─ Customer: ABC Corp
└─ has_receipt() → True
         │
         └──► Receipt: REC-2026-00067
              ├─ receipt_number: REC-2026-00067
              ├─ receipt_amount: Rs. 50,000
              ├─ pdf_file: receipts/pdfs/2026/01/REC-2026-00067.pdf
              └─ is_sent: True

Validation:
✓ Payment COMPLETED
✓ No existing receipt
✓ Receipt can be created
```

### Expected Outcome
- One-to-one relationship enforced
- has_receipt() method on Payment
- Validation prevents duplicate receipts
- get_receipt() helper method

### Verification Checklist
- [ ] OneToOneField on PaymentReceipt.payment
- [ ] has_receipt() method on Payment
- [ ] get_receipt() method on Payment
- [ ] validate_receipt_creation() method
- [ ] Check payment status (COMPLETED)
- [ ] Check for existing receipt

---

## Task 69: Implement Receipt Generation

### Overview
Implement the complete receipt generation workflow, creating receipt records and triggering PDF generation.

### Dependencies
- Tasks 65-68: Receipt model, numbering, storage, linkage
- Payment exists and is completed

### Instructions

1. **Create ReceiptService class**
   - Centralize receipt operations
   - Similar to PaymentService and RefundService

2. **Create generate_receipt() method**
   - Validate payment eligible for receipt
   - Generate receipt number
   - Create PaymentReceipt record
   - Trigger PDF generation (Task 71)
   - Return receipt

3. **Populate receipt fields from payment**
   - Copy payment details
   - Copy customer details
   - Copy invoice reference

4. **Handle receipt regeneration**
   - Allow regenerating PDF if needed
   - Update existing receipt

5. **Add auto-generation option**
   - Optionally auto-generate receipt on payment completion
   - Configure per tenant

### Implementation

```python
# Create apps/payments/services/receipt_service.py

import logging
from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date

from apps.payments.models.payment import Payment, PaymentStatus
from apps.payments.models.payment_receipt import PaymentReceipt

logger = logging.getLogger(__name__)


class ReceiptService:
    """Service for payment receipt operations"""
    
    @staticmethod
    @transaction.atomic
    def generate_receipt(
        payment,
        generated_by=None,
        notes=None,
        generate_pdf=True
    ):
        """
        Generate payment receipt
        
        Args:
            payment: Payment instance
            generated_by: User generating receipt
            notes: Optional notes for receipt
            generate_pdf: Whether to generate PDF immediately
            
        Returns:
            dict: Response with receipt
        """
        try:
            # Validate receipt can be created
            validation = ReceiptService.validate_receipt_creation(payment)
            if not validation['valid']:
                return {
                    'success': False,
                    'errors': validation['errors'],
                    'code': 'VALIDATION_ERROR'
                }
            
            # Generate receipt number
            receipt_number = generate_receipt_number(payment.tenant)
            
            # Determine receipt date (payment date or today)
            receipt_date = payment.payment_date or date.today()
            
            # Create receipt
            receipt = PaymentReceipt.objects.create(
                tenant=payment.tenant,
                receipt_number=receipt_number,
                payment=payment,
                invoice=payment.invoice,
                customer=payment.customer,
                receipt_date=receipt_date,
                receipt_amount=payment.amount,
                payment_method=payment.method,
                reference_number=payment.reference_number,
                currency=payment.currency,
                exchange_rate=payment.exchange_rate,
                notes=notes,
                generated_by=generated_by
            )
            
            logger.info(
                f'Receipt generated: {receipt_number}, '
                f'Payment: {payment.payment_number}, '
                f'Amount: Rs. {payment.amount}'
            )
            
            # Generate PDF (Task 71)
            pdf_result = None
            if generate_pdf:
                from apps.payments.services.receipt_pdf_service import ReceiptPDFService
                pdf_result = ReceiptPDFService.generate_receipt_pdf(receipt)
                
                if not pdf_result['success']:
                    logger.warning(
                        f'PDF generation failed for receipt {receipt_number}: '
                        f'{pdf_result.get("error")}'
                    )
            
            return {
                'success': True,
                'receipt': receipt,
                'receipt_number': receipt_number,
                'receipt_amount': float(payment.amount),
                'pdf_generated': pdf_result['success'] if pdf_result else False,
                'pdf_url': receipt.get_pdf_url() if receipt.has_pdf() else None,
                'message': f'Receipt {receipt_number} generated'
            }
            
        except ValidationError as e:
            logger.error(f'Receipt generation validation failed: {str(e)}')
            return {
                'success': False,
                'error': str(e),
                'code': 'VALIDATION_ERROR'
            }
        except Exception as e:
            logger.error(f'Receipt generation failed: {str(e)}', exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'code': 'GENERATION_ERROR'
            }
    
    
    @staticmethod
    @transaction.atomic
    def regenerate_receipt_pdf(receipt, generated_by=None):
        """
        Regenerate PDF for existing receipt
        
        Args:
            receipt: PaymentReceipt instance
            generated_by: User regenerating PDF
            
        Returns:
            dict: Result
        """
        try:
            from apps.payments.services.receipt_pdf_service import ReceiptPDFService
            
            # Delete old PDF if exists
            if receipt.pdf_file:
                receipt.pdf_file.delete(save=False)
                receipt.pdf_generated_at = None
                receipt.save(update_fields=['pdf_generated_at'])
            
            # Generate new PDF
            pdf_result = ReceiptPDFService.generate_receipt_pdf(receipt)
            
            if not pdf_result['success']:
                return {
                    'success': False,
                    'error': pdf_result.get('error'),
                    'code': 'PDF_GENERATION_ERROR'
                }
            
            logger.info(
                f'Receipt PDF regenerated: {receipt.receipt_number}, '
                f'By: {generated_by.username if generated_by else "System"}'
            )
            
            return {
                'success': True,
                'receipt_number': receipt.receipt_number,
                'pdf_url': receipt.get_pdf_url(),
                'message': 'Receipt PDF regenerated'
            }
            
        except Exception as e:
            logger.error(f'Receipt PDF regeneration failed: {str(e)}', exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'code': 'REGENERATION_ERROR'
            }
    
    
    @staticmethod
    def validate_receipt_creation(payment):
        """
        Validate that receipt can be created for payment
        
        Args:
            payment: Payment instance
            
        Returns:
            dict: Validation result
        """
        errors = []
        
        # Check payment status
        if payment.status != PaymentStatus.COMPLETED:
            errors.append(
                f'Cannot create receipt for payment {payment.payment_number} '
                f'(status: {payment.status}). Payment must be COMPLETED.'
            )
        
        # Check for existing receipt
        if payment.has_receipt():
            errors.append(
                f'Receipt already exists for payment {payment.payment_number} '
                f'(receipt: {payment.receipt.receipt_number})'
            )
        
        if errors:
            return {
                'valid': False,
                'errors': errors
            }
        
        return {
            'valid': True,
            'message': 'Receipt can be created'
        }
    
    
    @staticmethod
    @transaction.atomic
    def auto_generate_receipt_on_payment(payment):
        """
        Automatically generate receipt when payment is completed
        
        This can be called from payment completion workflow if
        auto-generation is enabled.
        
        Args:
            payment: Payment instance
            
        Returns:
            dict: Generation result
        """
        try:
            # Check if auto-generation enabled (from settings)
            # For now, always generate
            AUTO_GENERATE_RECEIPTS = True
            
            if not AUTO_GENERATE_RECEIPTS:
                return {
                    'success': False,
                    'message': 'Auto-generation disabled'
                }
            
            # Generate receipt
            result = ReceiptService.generate_receipt(
                payment=payment,
                generate_pdf=True
            )
            
            return result
            
        except Exception as e:
            logger.error(f'Auto receipt generation failed: {str(e)}', exc_info=True)
            return {
                'success': False,
                'error': str(e)
            }
```

### Receipt Generation Flow

```
Payment Completed (PAY-2026-00123)
         │
         ▼
generate_receipt()
         │
         ├─── Validate payment status (COMPLETED)
         │
         ├─── Check no existing receipt
         │
         ├─── Generate receipt number (REC-2026-00067)
         │
         ├─── Create PaymentReceipt record
         │    ├─ receipt_number: REC-2026-00067
         │    ├─ payment: PAY-2026-00123
         │    ├─ invoice: INV-2026-00456
         │    ├─ customer: ABC Corp
         │    ├─ receipt_amount: Rs. 50,000
         │    └─ payment_method: CARD
         │
         ├─── Generate PDF (Task 71)
         │    ├─ Create PDF document
         │    ├─ Save to receipts/pdfs/2026/01/REC-2026-00067.pdf
         │    └─ Update receipt.pdf_file
         │
         └─── Return receipt
         
Result:
✓ Receipt record created
✓ PDF generated
✓ Ready for email delivery
```

### Receipt Generation Examples

**Example 1: Manual Receipt Generation**
```python
result = ReceiptService.generate_receipt(
    payment=payment,
    generated_by=user,
    notes="Receipt generated upon customer request",
    generate_pdf=True
)

# Result:
{
    'success': True,
    'receipt_number': 'REC-2026-00067',
    'pdf_generated': True,
    'pdf_url': '/media/receipts/pdfs/2026/01/REC-2026-00067.pdf'
}
```

**Example 2: Auto-Generation on Payment**
```python
# In payment completion workflow:
def complete_payment(payment):
    # ... complete payment logic ...
    
    # Auto-generate receipt
    ReceiptService.auto_generate_receipt_on_payment(payment)
```

### Expected Outcome
- Complete receipt generation workflow
- ReceiptService class for operations
- generate_receipt() method
- Auto-generation support
- PDF generation trigger
- Validation and error handling

### Verification Checklist
- [ ] ReceiptService class created
- [ ] generate_receipt() method implemented
- [ ] Receipt number generation
- [ ] PaymentReceipt record creation
- [ ] Fields populated from payment
- [ ] PDF generation triggered
- [ ] regenerate_receipt_pdf() method
- [ ] validate_receipt_creation() method
- [ ] auto_generate_receipt_on_payment() helper
- [ ] Transaction atomic
- [ ] Logging

---

## Task 70: Create Receipt Migrations

### Overview
Generate and apply Django migrations for PaymentReceipt model and related changes.

### Dependencies
- Tasks 65-69: PaymentReceipt model complete

### Instructions

1. **Update __init__.py**
   - Import PaymentReceipt in models/__init__.py

2. **Generate migrations**
   - Run `python manage.py makemigrations payments`

3. **Apply migrations**
   - Run `python manage.py migrate payments`

4. **Verify tables**
   - Check payment_receipts table created

### Migration Commands

```bash
# Update apps/payments/models/__init__.py
# Add:
from .payment_receipt import PaymentReceipt

# Generate migrations
python manage.py makemigrations payments

# Expected: 0005_payment_receipt.py (or similar)
# - Create model PaymentReceipt
# - Add indexes
# - Add constraints

# Apply migrations
python manage.py migrate payments

# Verify table
python manage.py dbshell
\dt payment_receipts

# Expected:
# - payment_receipts table created
# - All fields present
# - Indexes created
```

### Expected Outcome
- PaymentReceipt table created
- All indexes and constraints applied
- Migration tested

### Verification Checklist
- [ ] PaymentReceipt imported in __init__.py
- [ ] makemigrations run successfully
- [ ] Migration file generated
- [ ] migrate applied successfully
- [ ] payment_receipts table exists
- [ ] Indexes created
- [ ] Foreign keys configured

---

## Summary

This document completed the first part of Group E (Payment Receipts & Notifications):

1. ✅ **PaymentReceipt Model** (Task 65): Comprehensive receipt model with PDF and email tracking
2. ✅ **Receipt Numbers** (Task 66): Sequential receipt number generation (REC-YYYY-NNNNN)
3. ✅ **PDF Storage** (Task 67): Organized PDF storage with proper paths
4. ✅ **Receipt-Payment Linkage** (Task 68): One-to-one relationship with validation
5. ✅ **Receipt Generation** (Task 69): Complete receipt generation workflow with ReceiptService
6. ✅ **Migrations** (Task 70): Database schema for receipts

**Next Document:** [02_Tasks-71-73_Receipt-PDF-Generation.md](02_Tasks-71-73_Receipt-PDF-Generation.md) - Implement PDF generation with proper formatting, company branding, and receipt sections (header, details, footer).
