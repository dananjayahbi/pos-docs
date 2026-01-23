# Tasks 65-68: QR Code, Storage, Regeneration & Download

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** D - Quote PDF Generation  
> **Document:** 03 of 03  
> **Tasks Covered:** 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-59-64_PDF-Generator-Sections.md](02_Tasks-59-64_PDF-Generator-Sections.md)
- **→ Next Group:** [../Group-E_Quote-API-Email-Integration/](../Group-E_Quote-API-Email-Integration/)

---

## Document Overview

This document covers QR code generation for online quote viewing, PDF file storage, automatic regeneration logic, and download API endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Add PDF QR Code | Medium | 25 min |
| 66 | Implement PDF Storage | Medium | 25 min |
| 67 | Create PDF Regeneration Logic | Medium | 25 min |
| 68 | Implement PDF Download Endpoint | Medium | 25 min |

---

## Task 65: Add PDF QR Code

### Overview
Add QR code to PDF footer linking to public online quote view for customer convenience.

### Dependencies
- Task 64: Footer section implemented
- qrcode library installed

### Instructions

1. **Install qrcode library**
   - Add to requirements: `qrcode[pil]`
   - Imports: qrcode, PIL

2. **Add pdf_file field to Quote model**
   - FileField for storing generated PDF
   - upload_to='quotes/pdfs/'
   - null=True, blank=True

3. **Generate public quote URL**
   - Create method get_public_url()
   - Use UUID token for security
   - Format: `/quotes/public/{token}/`

4. **Implement QR code generation**
   - Add _generate_qr_code() method
   - Accept URL string
   - Return Image object
   - Size: 40x40mm

5. **Add QR code to PDF footer**
   - Generate QR for quote public URL
   - Position in footer
   - Add label: "View Online"

6. **Style QR code section**
   - Border (optional)
   - Centered or right-aligned
   - Descriptive text

### Implementation

```python
# Add to Quote model
import uuid

class Quote(models.Model):
    # ... existing fields ...
    
    pdf_file = models.FileField(
        upload_to='quotes/pdfs/',
        null=True,
        blank=True,
        help_text="Generated PDF file"
    )
    
    public_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text="Public access token"
    )
    
    def get_public_url(self):
        """
        Get public URL for customer quote view.
        
        Returns:
            str: Full public URL
        """
        from django.contrib.sites.models import Site
        from django.urls import reverse
        
        site = Site.objects.get_current()
        path = reverse('quotes:public-view', kwargs={'token': self.public_token})
        
        return f"https://{site.domain}{path}"


# Add to QuotePDFGenerator class
import qrcode
from io import BytesIO as IOBuffer

class QuotePDFGenerator:
    # ... existing methods ...
    
    def _generate_qr_code(self, url: str) -> Image:
        """
        Generate QR code image for URL.
        
        Args:
            url: URL to encode in QR code
        
        Returns:
            Image: ReportLab Image object
        """
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=2,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to buffer
        buffer = IOBuffer()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Create ReportLab Image
        from reportlab.platypus import Image
        qr_image = Image(buffer, width=40*mm, height=40*mm)
        
        return qr_image
    
    def _add_qr_code_to_footer(self):
        """Add QR code for online quote view."""
        self.story.append(Spacer(1, 10*mm))
        
        # Generate QR code
        public_url = self.quote.get_public_url()
        qr_image = self._generate_qr_code(public_url)
        
        # QR code section
        qr_data = [
            [qr_image],
            [Paragraph("<b>Scan to view online</b>", self.body_style)],
            [Paragraph(
                f"<font size='{self.template.font_size - 2}'>{public_url}</font>",
                self.body_style
            )],
        ]
        
        qr_table = Table(qr_data, colWidths=[60*mm])
        qr_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        # Wrapper to right-align
        wrapper = Table([[qr_table]], colWidths=[170*mm])
        wrapper.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ]))
        
        self.story.append(wrapper)
    
    def _generate_footer(self):
        """Generate footer section with terms and signature."""
        # ... existing footer code ...
        
        # Add QR code at end
        self._add_qr_code_to_footer()
        
        # ... rest of footer code ...
```

### QR Code Layout

```
Footer Section:
...
Terms & Conditions
Payment Details
Validity Message
Signature


                              ┌──────────┐
                              │  ██  ██  │
                              │  ██  ██  │  QR Code
                              │  ██  ██  │
                              └──────────┘
                          Scan to view online
                   https://domain.com/quotes/public/abc123
```

### Usage Examples

```python
# Generate PDF with QR code
quote = Quote.objects.get(quote_number='QT-2026-00001')
generator = QuotePDFGenerator(quote)
pdf_buffer = generator.generate()

# Public URL is embedded in QR
public_url = quote.get_public_url()
# https://erp.example.lk/quotes/public/a1b2c3d4-e5f6-7890-...

# Customer scans QR → views quote online
# Can accept/reject directly from phone
```

### Expected Outcome
PDF footer includes scannable QR code linking to secure public quote view.

### Verification Checklist
- [ ] qrcode library installed
- [ ] pdf_file FileField added to Quote
- [ ] public_token UUIDField added
- [ ] get_public_url() method implemented
- [ ] _generate_qr_code() method added
- [ ] QR code size 40x40mm
- [ ] _add_qr_code_to_footer() method
- [ ] QR code centered/right-aligned
- [ ] "Scan to view online" label
- [ ] URL displayed below QR
- [ ] Integrated into _generate_footer()
- [ ] QR code scannable

---

## Task 66: Implement PDF Storage

### Overview
Implement automatic PDF file storage when generating quotes, with proper file naming and cleanup.

### Dependencies
- Task 65: QR code implemented
- FileField configured

### Instructions

1. **Add generate_and_save method**
   - Generate PDF
   - Save to pdf_file field
   - Return file path
   - Update quote instance

2. **Implement file naming**
   - Format: `quote_{quote_number}_{timestamp}.pdf`
   - Example: `quote_QT-2026-00001_20260115123045.pdf`
   - Sanitize quote_number for filename

3. **Handle file cleanup**
   - Delete old PDF when generating new one
   - Prevent orphaned files
   - Use FileField.delete()

4. **Add file size tracking (optional)**
   - Add pdf_file_size field
   - Store file size in bytes
   - Display human-readable size

5. **Add generated_at timestamp**
   - Track when PDF was generated
   - Update on regeneration

### Implementation

```python
# Add to Quote model
from django.core.files.base import ContentFile
from datetime import datetime

class Quote(models.Model):
    # ... existing fields ...
    
    pdf_file = models.FileField(
        upload_to='quotes/pdfs/',
        null=True,
        blank=True,
        help_text="Generated PDF file"
    )
    
    pdf_generated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When PDF was last generated"
    )
    
    pdf_file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="PDF file size in bytes"
    )
    
    def get_pdf_filename(self):
        """
        Generate PDF filename.
        
        Returns:
            str: Filename for PDF
        """
        # Sanitize quote number
        safe_number = self.quote_number.replace('/', '-').replace('\\', '-')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        return f"quote_{safe_number}_{timestamp}.pdf"
    
    def get_pdf_size_display(self):
        """Get human-readable file size."""
        if not self.pdf_file_size:
            return "N/A"
        
        size = self.pdf_file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        
        return f"{size:.2f} TB"


# Add to QuotePDFGenerator class
class QuotePDFGenerator:
    # ... existing methods ...
    
    def generate_and_save(self) -> str:
        """
        Generate PDF and save to quote.pdf_file.
        
        Returns:
            str: Saved file path
        """
        from django.utils import timezone
        
        # Generate PDF
        pdf_buffer = self.generate()
        
        # Delete old PDF if exists
        if self.quote.pdf_file:
            self.quote.pdf_file.delete(save=False)
        
        # Save new PDF
        filename = self.quote.get_pdf_filename()
        
        self.quote.pdf_file.save(
            filename,
            ContentFile(pdf_buffer.getvalue()),
            save=False
        )
        
        # Update metadata
        self.quote.pdf_generated_at = timezone.now()
        self.quote.pdf_file_size = len(pdf_buffer.getvalue())
        self.quote.save(update_fields=['pdf_file', 'pdf_generated_at', 'pdf_file_size'])
        
        return self.quote.pdf_file.path
```

### File Storage Structure

```
media/
└── quotes/
    └── pdfs/
        ├── quote_QT-2026-00001_20260115120000.pdf
        ├── quote_QT-2026-00002_20260115121500.pdf
        ├── quote_QT-2026-00003_20260115130000.pdf
        └── ...
```

### Usage Examples

```python
# Generate and save PDF
from apps.quotes.services.pdf_generator import QuotePDFGenerator

quote = Quote.objects.get(quote_number='QT-2026-00001')
generator = QuotePDFGenerator(quote)

# Save to database
file_path = generator.generate_and_save()
print(f"PDF saved to: {file_path}")

# Access saved PDF
if quote.pdf_file:
    print(f"PDF URL: {quote.pdf_file.url}")
    print(f"Generated: {quote.pdf_generated_at}")
    print(f"Size: {quote.get_pdf_size_display()}")
    
    # Serve PDF
    with open(quote.pdf_file.path, 'rb') as f:
        pdf_content = f.read()
```

### Storage Settings

```python
# settings.py

# File upload settings
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Storage backend (S3 for production)
if not DEBUG:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_STORAGE_BUCKET_NAME = 'your-bucket'
    AWS_S3_REGION_NAME = 'ap-south-1'  # Mumbai (closest to Sri Lanka)
```

### Expected Outcome
PDFs automatically saved to file storage with proper naming and metadata tracking.

### Verification Checklist
- [ ] pdf_file FileField added
- [ ] pdf_generated_at DateTimeField added
- [ ] pdf_file_size IntegerField added
- [ ] get_pdf_filename() method
- [ ] Filename format: quote_{number}_{timestamp}.pdf
- [ ] Quote number sanitized in filename
- [ ] get_pdf_size_display() method
- [ ] generate_and_save() method implemented
- [ ] Old PDF deleted before saving new
- [ ] PDF saved to FileField
- [ ] Metadata updated (generated_at, file_size)
- [ ] File accessible via quote.pdf_file.url
- [ ] Storage in media/quotes/pdfs/

---

## Task 67: Create PDF Regeneration Logic

### Overview
Implement automatic PDF regeneration when quote data changes, with smart detection to avoid unnecessary regeneration.

### Dependencies
- Task 66: PDF storage implemented

### Instructions

1. **Add needs_regeneration property**
   - Check if PDF exists
   - Check if quote updated after PDF generated
   - Check if line items changed

2. **Implement regenerate_pdf method**
   - Check needs_regeneration
   - Generate new PDF
   - Save to file
   - Log regeneration

3. **Add auto-regeneration signal**
   - post_save signal on Quote
   - Check if significant fields changed
   - Trigger regeneration
   - Async with Celery (optional)

4. **Define significant fields**
   - Fields that affect PDF:
     - customer_name, title
     - discount_type, discount_value
     - terms_and_conditions
     - status changes
   - Line item changes

5. **Add regeneration tracking**
   - pdf_regeneration_count field
   - Track how many times regenerated

6. **Implement bulk regeneration**
   - Admin action to regenerate all
   - Management command
   - Filter by date range

### Implementation

```python
# Add to Quote model
class Quote(models.Model):
    # ... existing fields ...
    
    pdf_regeneration_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of times PDF regenerated"
    )
    
    @property
    def needs_regeneration(self) -> bool:
        """
        Check if PDF needs regeneration.
        
        Returns:
            bool: True if regeneration needed
        """
        # No PDF exists
        if not self.pdf_file:
            return True
        
        # Quote updated after PDF generated
        if self.pdf_generated_at and self.updated_at > self.pdf_generated_at:
            return True
        
        # Line items updated after PDF
        if self.pdf_generated_at:
            recent_items = self.line_items.filter(
                updated_at__gt=self.pdf_generated_at
            ).exists()
            if recent_items:
                return True
        
        return False
    
    def regenerate_pdf(self, force: bool = False):
        """
        Regenerate PDF if needed.
        
        Args:
            force: Force regeneration even if not needed
        
        Returns:
            bool: True if regenerated
        """
        if not force and not self.needs_regeneration:
            return False
        
        from apps.quotes.services.pdf_generator import QuotePDFGenerator
        
        # Generate and save
        generator = QuotePDFGenerator(self)
        generator.generate_and_save()
        
        # Update counter
        self.pdf_regeneration_count += 1
        self.save(update_fields=['pdf_regeneration_count'])
        
        # Log
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"PDF regenerated for quote {self.quote_number}")
        
        return True


# Signal for auto-regeneration
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver

@receiver(post_save, sender=Quote)
def auto_regenerate_pdf(sender, instance, created, **kwargs):
    """
    Auto-regenerate PDF when quote changes.
    
    Only regenerates if significant fields changed.
    """
    if created:
        # Generate initial PDF
        instance.regenerate_pdf(force=True)
        return
    
    # Check if PDF-affecting fields changed
    if hasattr(instance, '_state') and hasattr(instance._state, 'fields_cache'):
        # Get changed fields
        changed_fields = set()
        for field in ['customer_name', 'title', 'discount_type', 
                      'discount_value', 'status', 'terms_and_conditions']:
            if field in instance._state.fields_cache:
                old_value = instance._state.fields_cache[field]
                new_value = getattr(instance, field)
                if old_value != new_value:
                    changed_fields.add(field)
        
        if changed_fields:
            # Regenerate asynchronously
            from apps.quotes.tasks import regenerate_quote_pdf_task
            regenerate_quote_pdf_task.delay(instance.id)


# Celery task for async regeneration
from celery import shared_task

@shared_task
def regenerate_quote_pdf_task(quote_id: int):
    """
    Celery task to regenerate quote PDF.
    
    Args:
        quote_id: Quote ID
    """
    try:
        quote = Quote.objects.get(id=quote_id)
        quote.regenerate_pdf(force=True)
    except Quote.DoesNotExist:
        pass


# Signal for line item changes
@receiver(post_save, sender='quotes.QuoteLineItem')
def regenerate_on_line_item_change(sender, instance, **kwargs):
    """Regenerate PDF when line items change."""
    from apps.quotes.tasks import regenerate_quote_pdf_task
    regenerate_quote_pdf_task.delay(instance.quote.id)
```

### Management Command

```python
# apps/quotes/management/commands/regenerate_quote_pdfs.py

from django.core.management.base import BaseCommand
from apps.quotes.models import Quote
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Regenerate PDFs for quotes'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Regenerate all quotes',
        )
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Regenerate quotes from last N days',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force regeneration even if not needed',
        )
    
    def handle(self, *args, **options):
        # Get quotes
        quotes = Quote.objects.all()
        
        if not options['all']:
            cutoff = timezone.now() - timedelta(days=options['days'])
            quotes = quotes.filter(updated_at__gte=cutoff)
        
        total = quotes.count()
        regenerated = 0
        
        self.stdout.write(f"Processing {total} quotes...")
        
        for quote in quotes:
            if quote.regenerate_pdf(force=options['force']):
                regenerated += 1
                self.stdout.write(f"✓ {quote.quote_number}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\nRegenerated {regenerated}/{total} PDFs"
            )
        )
```

### Regeneration Flow

```
Quote Updated
     │
     ▼
Check needs_regeneration
     │
  ┌──┴──┐
 No    Yes
  │      │
  └─→ Skip
         │
         ▼
    Queue Celery Task
         │
         ▼
    Generate PDF
         │
         ▼
    Save to FileField
         │
         ▼
    Increment Counter
         │
         ▼
    Log Event
```

### Usage Examples

```python
# Check if regeneration needed
quote = Quote.objects.get(quote_number='QT-2026-00001')
if quote.needs_regeneration:
    quote.regenerate_pdf()

# Force regeneration
quote.regenerate_pdf(force=True)

# Automatic on save
quote.title = "Updated Quote Title"
quote.save()  # PDF auto-regenerates

# Bulk regeneration
python manage.py regenerate_quote_pdfs --days 7

# Regenerate all
python manage.py regenerate_quote_pdfs --all --force
```

### Expected Outcome
PDFs automatically stay in sync with quote data through smart regeneration logic.

### Verification Checklist
- [ ] needs_regeneration property added
- [ ] Checks PDF existence
- [ ] Checks update timestamps
- [ ] Checks line item changes
- [ ] regenerate_pdf() method implemented
- [ ] force parameter supported
- [ ] pdf_regeneration_count field added
- [ ] Counter incremented on regeneration
- [ ] post_save signal for auto-regeneration
- [ ] Significant fields defined
- [ ] Celery task for async regeneration
- [ ] Signal for line item changes
- [ ] Management command created
- [ ] Logging implemented

---

## Task 68: Implement PDF Download Endpoint

### Overview
Create API endpoint for downloading quote PDFs with authentication and permission checks.

### Dependencies
- Task 67: Regeneration logic implemented
- DRF installed

### Instructions

1. **Create download view**
   - Custom action on QuoteViewSet
   - @action(detail=True, methods=['get'])
   - Return FileResponse

2. **Add permission checks**
   - User must have access to tenant
   - User must have quote read permission
   - Or public token for customer access

3. **Implement auto-generation**
   - If PDF doesn't exist, generate it
   - If needs regeneration, regenerate
   - Then serve file

4. **Add proper headers**
   - Content-Type: application/pdf
   - Content-Disposition: attachment or inline
   - Cache headers

5. **Add download tracking (optional)**
   - Track download count
   - Track last downloaded timestamp
   - Track who downloaded

6. **Add email attachment endpoint**
   - Separate endpoint for emailing PDF
   - Integrate with email service

### Implementation

```python
# apps/quotes/api/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse, Http404
from django.utils import timezone

from apps.quotes.models import Quote
from apps.quotes.serializers import QuoteSerializer
from apps.quotes.services.pdf_generator import QuotePDFGenerator


class QuoteViewSet(viewsets.ModelViewSet):
    """ViewSet for Quote CRUD operations."""
    
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """
        Download quote PDF.
        
        GET /api/quotes/{id}/download_pdf/
        Query params:
        - inline: true/false (default: false for download)
        - regenerate: true/false (force regeneration)
        """
        quote = self.get_object()
        
        # Check permissions
        if not request.user.has_perm('quotes.view_quote'):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Force regeneration if requested
        if request.query_params.get('regenerate') == 'true':
            quote.regenerate_pdf(force=True)
        
        # Generate if needed
        elif not quote.pdf_file or quote.needs_regeneration:
            generator = QuotePDFGenerator(quote)
            generator.generate_and_save()
        
        # Check file exists
        if not quote.pdf_file:
            return Response(
                {'error': 'PDF generation failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Open file
        try:
            pdf_file = open(quote.pdf_file.path, 'rb')
        except FileNotFoundError:
            # File missing, regenerate
            generator = QuotePDFGenerator(quote)
            generator.generate_and_save()
            pdf_file = open(quote.pdf_file.path, 'rb')
        
        # Determine disposition
        inline = request.query_params.get('inline') == 'true'
        disposition = 'inline' if inline else 'attachment'
        
        filename = f"quote_{quote.quote_number}.pdf".replace('/', '-')
        
        # Create response
        response = FileResponse(
            pdf_file,
            content_type='application/pdf',
        )
        response['Content-Disposition'] = f'{disposition}; filename="{filename}"'
        response['Cache-Control'] = 'private, max-age=3600'  # 1 hour cache
        
        # Track download (optional)
        quote.pdf_download_count = (quote.pdf_download_count or 0) + 1
        quote.pdf_last_downloaded_at = timezone.now()
        quote.save(update_fields=['pdf_download_count', 'pdf_last_downloaded_at'])
        
        return response
    
    @action(detail=True, methods=['post'])
    def email_pdf(self, request, pk=None):
        """
        Email quote PDF to customer.
        
        POST /api/quotes/{id}/email_pdf/
        Body:
        {
          "email": "customer@example.com",  # Optional, uses quote.customer_email if not provided
          "message": "Custom message"        # Optional
        }
        """
        quote = self.get_object()
        
        # Check permissions
        if not request.user.has_perm('quotes.send_quote'):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get email
        email = request.data.get('email') or quote.customer_email
        if not email:
            return Response(
                {'error': 'No email address provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Ensure PDF exists
        if not quote.pdf_file or quote.needs_regeneration:
            generator = QuotePDFGenerator(quote)
            generator.generate_and_save()
        
        # Send email (implemented in next group)
        from apps.quotes.services.email_service import QuoteEmailService
        
        email_service = QuoteEmailService()
        success = email_service.send_quote_email(
            quote=quote,
            recipient_email=email,
            custom_message=request.data.get('message')
        )
        
        if success:
            return Response({
                'message': 'Quote PDF emailed successfully',
                'email': email
            })
        else:
            return Response(
                {'error': 'Failed to send email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Public view for customer access
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class PublicQuoteDownloadView(APIView):
    """
    Public PDF download using token.
    
    GET /api/quotes/public/{token}/download/
    """
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        try:
            quote = Quote.objects.get(public_token=token)
        except Quote.DoesNotExist:
            raise Http404("Quote not found")
        
        # Ensure PDF exists
        if not quote.pdf_file or quote.needs_regeneration:
            generator = QuotePDFGenerator(quote)
            generator.generate_and_save()
        
        # Open and serve file
        pdf_file = open(quote.pdf_file.path, 'rb')
        filename = f"quote_{quote.quote_number}.pdf".replace('/', '-')
        
        response = FileResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        
        return response
```

### URL Configuration

```python
# apps/quotes/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.quotes.api.views import QuoteViewSet, PublicQuoteDownloadView

app_name = 'quotes'

router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('', include(router.urls)),
    
    # Public download
    path(
        'quotes/public/<uuid:token>/download/',
        PublicQuoteDownloadView.as_view(),
        name='public-download'
    ),
]
```

### Download Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/quotes/{id}/download_pdf/` | GET | Required | Download PDF (authenticated) |
| `/api/quotes/{id}/download_pdf/?inline=true` | GET | Required | View PDF inline |
| `/api/quotes/{id}/download_pdf/?regenerate=true` | GET | Required | Force regeneration |
| `/api/quotes/{id}/email_pdf/` | POST | Required | Email PDF to customer |
| `/api/quotes/public/{token}/download/` | GET | Public | Public download via token |

### Usage Examples

```javascript
// Download PDF (frontend)
async function downloadQuotePDF(quoteId) {
  const response = await fetch(`/api/quotes/${quoteId}/download_pdf/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quote_${quoteId}.pdf`;
  a.click();
}

// View PDF inline
function viewQuotePDF(quoteId) {
  window.open(`/api/quotes/${quoteId}/download_pdf/?inline=true`, '_blank');
}

// Email PDF
async function emailQuotePDF(quoteId, email) {
  const response = await fetch(`/api/quotes/${quoteId}/email_pdf/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      message: 'Please review the attached quotation.'
    })
  });
  
  return response.json();
}

// Public download (customer)
function downloadPublicQuote(token) {
  window.open(`/api/quotes/public/${token}/download/`, '_blank');
}
```

### Expected Outcome
Complete API endpoints for PDF download, viewing, and emailing with proper authentication and permissions.

### Verification Checklist
- [ ] download_pdf action implemented
- [ ] Permission checks added
- [ ] Auto-generation on missing PDF
- [ ] Regeneration on needs_regeneration
- [ ] FileResponse with proper headers
- [ ] Content-Type: application/pdf
- [ ] Content-Disposition (attachment/inline)
- [ ] inline query parameter
- [ ] regenerate query parameter
- [ ] Download tracking (count, timestamp)
- [ ] email_pdf action implemented
- [ ] PublicQuoteDownloadView for public access
- [ ] Token-based authentication
- [ ] URL patterns registered
- [ ] Error handling (404, 403, 500)
- [ ] Cache headers set

---

## Summary

After completing Tasks 65-68, the Quote module will have:

### QR Code Integration
- QR codes in PDF footer
- Links to public online quote view
- Customer can scan → view → accept/reject
- 40x40mm size, centered positioning

### PDF Storage
- FileField for generated PDFs
- Automatic file naming: quote_{number}_{timestamp}.pdf
- Storage in media/quotes/pdfs/
- File size tracking and display
- Generation timestamp tracking
- Old PDF cleanup on regeneration

### Smart Regeneration
- needs_regeneration property
- Checks update timestamps
- Automatic on quote/line item changes
- Async regeneration with Celery
- Manual force regeneration
- Regeneration counter
- Management command for bulk regeneration

### Download Endpoints
- Authenticated download endpoint
- Inline viewing option
- Force regeneration parameter
- Email PDF endpoint
- Public token-based download
- Download tracking
- Proper HTTP headers
- Error handling

### Complete PDF Workflow
```
Quote Created/Updated
        │
        ▼
Check needs_regeneration
        │
        ▼
Generate PDF (QuotePDFGenerator)
    │   │   │   │   │
    ▼   ▼   ▼   ▼   ▼
Header Customer Items Totals Footer+QR
        │
        ▼
Save to FileField
        │
        ▼
Available for:
├─→ Authenticated download
├─→ Public download (via token/QR)
├─→ Email attachment
└─→ Print/archive
```

### Next Steps
Proceed to [../Group-E_Quote-API-Email-Integration/](../Group-E_Quote-API-Email-Integration/) to implement serializers, ViewSets, filtering, email service, and public customer views.
