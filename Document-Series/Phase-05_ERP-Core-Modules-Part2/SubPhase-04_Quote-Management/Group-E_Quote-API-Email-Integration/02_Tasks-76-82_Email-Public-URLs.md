# Tasks 76-82: Email Service, Public View & URLs

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** E - Quote API & Email Integration  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-75_Serializers-ViewSet-Actions.md](01_Tasks-69-75_Serializers-ViewSet-Actions.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers email service creation, HTML email templates, Celery async tasks, public customer views, accept/reject actions, and URL registration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create QuoteEmailService | Medium | 25 min |
| 77 | Create Quote Email Template | Medium | 25 min |
| 78 | Implement Email Sending Endpoint | Medium | 25 min |
| 79 | Create Celery Task for Email | Medium | 25 min |
| 80 | Implement Quote Public View | Medium | 30 min |
| 81 | Add Quote Accept/Reject Actions | Medium | 25 min |
| 82 | Register Quote API URLs | Low | 20 min |

---

## Task 76: Create QuoteEmailService

### Overview
Create service class for sending quote emails with PDF attachments.

### Dependencies
- Quote model exists
- PDF generation implemented
- Email configured in settings

### Instructions

1. **Create email_service.py**
   - Create file: `apps/quotes/services/email_service.py`
   - Import Django email utilities
   - Import Quote model

2. **Define QuoteEmailService class**
   - send_quote_email() main method
   - Attach PDF
   - Handle errors gracefully

3. **Add email rendering**
   - Get email template
   - Render with context
   - Plain text fallback

4. **Add PDF attachment**
   - Generate PDF if needed
   - Attach to email
   - Handle missing PDF

5. **Add error handling**
   - Log email errors
   - Return success/failure boolean
   - Don't raise exceptions

6. **Add tracking**
   - Update quote.sent_at timestamp
   - Increment sent_count
   - Log email history

### Implementation

```python
# apps/quotes/services/email_service.py

import logging
from typing import Optional
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.conf import settings

from apps.quotes.models import Quote
from apps.quotes.services.pdf_generator import QuotePDFGenerator


logger = logging.getLogger(__name__)


class QuoteEmailService:
    """
    Service for sending quote emails with PDF attachments.
    """
    
    def __init__(self):
        self.from_email = settings.DEFAULT_FROM_EMAIL
    
    def send_quote_email(
        self,
        quote: Quote,
        recipient_email: str,
        custom_message: Optional[str] = None,
        cc_emails: Optional[list] = None
    ) -> bool:
        """
        Send quote email with PDF attachment.
        
        Args:
            quote: Quote instance
            recipient_email: Recipient email address
            custom_message: Optional custom message
            cc_emails: Optional list of CC email addresses
        
        Returns:
            bool: True if sent successfully, False otherwise
        """
        try:
            # Ensure PDF exists
            if not quote.pdf_file or quote.needs_regeneration:
                generator = QuotePDFGenerator(quote)
                generator.generate_and_save()
            
            # Prepare email context
            context = {
                'quote': quote,
                'custom_message': custom_message,
                'public_url': quote.get_public_url(),
                'company_name': quote.tenant.name,
                'customer_name': quote.customer.name if quote.customer else quote.customer_name,
            }
            
            # Render HTML email
            html_content = render_to_string(
                'quotes/emails/quote_email.html',
                context
            )
            
            # Render plain text fallback
            text_content = render_to_string(
                'quotes/emails/quote_email.txt',
                context
            )
            
            # Create email
            subject = f"Quotation {quote.quote_number} - {quote.title or quote.tenant.name}"
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=self.from_email,
                to=[recipient_email],
                cc=cc_emails or []
            )
            
            # Attach HTML alternative
            email.attach_alternative(html_content, "text/html")
            
            # Attach PDF
            if quote.pdf_file:
                with open(quote.pdf_file.path, 'rb') as pdf_file:
                    pdf_content = pdf_file.read()
                    filename = f"quote_{quote.quote_number}.pdf".replace('/', '-')
                    email.attach(filename, pdf_content, 'application/pdf')
            
            # Send email
            email.send()
            
            # Update quote
            quote.sent_at = timezone.now()
            if not hasattr(quote, 'sent_count'):
                quote.sent_count = 0
            quote.sent_count = (quote.sent_count or 0) + 1
            quote.save(update_fields=['sent_at'])
            
            # Log history
            if hasattr(quote, 'log_history'):
                quote.log_history(
                    event_type='SENT',
                    notes=f"Quote emailed to {recipient_email}"
                )
            
            logger.info(f"Quote {quote.quote_number} emailed to {recipient_email}")
            return True
            
        except Exception as e:
            logger.error(
                f"Failed to send quote {quote.quote_number} email: {e}",
                exc_info=True
            )
            return False
    
    def send_expiry_reminder(
        self,
        quote: Quote,
        days_until_expiry: int
    ) -> bool:
        """
        Send expiry reminder email.
        
        Args:
            quote: Quote instance
            days_until_expiry: Days remaining until expiry
        
        Returns:
            bool: Success status
        """
        try:
            recipient = quote.customer_email or quote.customer.email
            if not recipient:
                logger.warning(f"No email for quote {quote.quote_number}")
                return False
            
            context = {
                'quote': quote,
                'days_until_expiry': days_until_expiry,
                'public_url': quote.get_public_url(),
            }
            
            html_content = render_to_string(
                'quotes/emails/expiry_reminder.html',
                context
            )
            
            text_content = render_to_string(
                'quotes/emails/expiry_reminder.txt',
                context
            )
            
            subject = f"Reminder: Quotation {quote.quote_number} expires in {days_until_expiry} days"
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=self.from_email,
                to=[recipient]
            )
            
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            logger.info(f"Expiry reminder sent for quote {quote.quote_number}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send expiry reminder: {e}")
            return False
```

### Email Service Structure

```
QuoteEmailService
├── send_quote_email()
│   ├── Generate/verify PDF
│   ├── Render HTML email
│   ├── Attach PDF
│   ├── Send email
│   └── Update quote
│
└── send_expiry_reminder()
    ├── Render reminder template
    ├── Send email
    └── Log event
```

### Usage Examples

```python
from apps.quotes.services.email_service import QuoteEmailService

# Send quote email
quote = Quote.objects.get(quote_number='QT-2026-00001')
service = QuoteEmailService()

success = service.send_quote_email(
    quote=quote,
    recipient_email='customer@example.lk',
    custom_message='Please review the attached quotation.',
    cc_emails=['sales@mycompany.lk']
)

if success:
    print("Email sent successfully")
else:
    print("Email failed")

# Send expiry reminder
success = service.send_expiry_reminder(
    quote=quote,
    days_until_expiry=3
)
```

### Expected Outcome
Reliable email service with PDF attachments and error handling.

### Verification Checklist
- [ ] email_service.py created
- [ ] QuoteEmailService class defined
- [ ] send_quote_email() method
- [ ] PDF generation/verification
- [ ] HTML email rendering
- [ ] Plain text fallback
- [ ] PDF attachment
- [ ] CC support
- [ ] Error handling (try/except)
- [ ] Logging
- [ ] Quote tracking (sent_at, sent_count)
- [ ] History logging
- [ ] send_expiry_reminder() method
- [ ] Returns boolean success status

---

## Task 77: Create Quote Email Template

### Overview
Create professional HTML email template for quote delivery.

### Dependencies
- Task 76: Email service exists

### Instructions

1. **Create email templates directory**
   - Create `apps/quotes/templates/quotes/emails/`
   - Create HTML and TXT templates

2. **Create quote_email.html**
   - Professional design
   - Company branding
   - Quote summary
   - CTA button to view online
   - PDF attachment note

3. **Create quote_email.txt**
   - Plain text version
   - Same information
   - Simple formatting

4. **Add styling (inline CSS)**
   - Email-safe CSS
   - Responsive design
   - Brand colors

5. **Add dynamic content**
   - Quote details
   - Customer name
   - Custom message
   - Public URL link

### Implementation

```html
<!-- apps/quotes/templates/quotes/emails/quote_email.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation {{ quote.quote_number }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Main container -->
                <table role="presentation" style="width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2563eb; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                                Quotation from {{ company_name }}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">
                                Dear {{ customer_name }},
                            </p>
                            
                            <!-- Custom message -->
                            {% if custom_message %}
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555;">
                                {{ custom_message }}
                            </p>
                            {% else %}
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555;">
                                Thank you for your interest. Please find attached our quotation for your review.
                            </p>
                            {% endif %}
                            
                            <!-- Quote details box -->
                            <div style="background-color: #f8f9fa; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666;">
                                            <strong>Quote Number:</strong>
                                        </td>
                                        <td style="padding: 8px 0; font-size: 14px; color: #333; text-align: right;">
                                            {{ quote.quote_number }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666;">
                                            <strong>Date:</strong>
                                        </td>
                                        <td style="padding: 8px 0; font-size: 14px; color: #333; text-align: right;">
                                            {{ quote.issue_date|date:"d F Y" }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666;">
                                            <strong>Valid Until:</strong>
                                        </td>
                                        <td style="padding: 8px 0; font-size: 14px; color: #333; text-align: right;">
                                            {{ quote.valid_until|date:"d F Y" }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 16px; color: #666;">
                                            <strong>Total Amount:</strong>
                                        </td>
                                        <td style="padding: 8px 0; font-size: 18px; color: #2563eb; text-align: right; font-weight: bold;">
                                            LKR {{ quote.grand_total|floatformat:2 }}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ public_url }}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                            View Quote Online
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Attachment note -->
                            <p style="margin: 30px 0 0 0; font-size: 14px; color: #666; text-align: center;">
                                📎 A PDF copy of this quotation is attached to this email.
                            </p>
                            
                            <!-- Instructions -->
                            <p style="margin: 20px 0 0 0; font-size: 14px; color: #555;">
                                You can review the quote online and accept or request modifications by clicking the button above.
                            </p>
                            
                            <!-- Closing -->
                            <p style="margin: 30px 0 0 0; font-size: 16px; color: #333;">
                                Best regards,<br>
                                <strong>{{ company_name }}</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #6b7280;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">
                                © {{ company_name }}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

```text
# apps/quotes/templates/quotes/emails/quote_email.txt

QUOTATION FROM {{ company_name|upper }}
=====================================

Dear {{ customer_name }},

{% if custom_message %}
{{ custom_message }}
{% else %}
Thank you for your interest. Please find attached our quotation for your review.
{% endif %}

QUOTE DETAILS:
--------------
Quote Number:   {{ quote.quote_number }}
Date:           {{ quote.issue_date|date:"d F Y" }}
Valid Until:    {{ quote.valid_until|date:"d F Y" }}
Total Amount:   LKR {{ quote.grand_total|floatformat:2 }}

VIEW ONLINE:
{{ public_url }}

A PDF copy of this quotation is attached to this email.

You can review the quote online and accept or request modifications using the link above.

Best regards,
{{ company_name }}

---
This is an automated message. Please do not reply to this email.
© {{ company_name }}. All rights reserved.
```

### Email Preview

```
┌─────────────────────────────────────────────┐
│   Quotation from ABC Trading (Pvt) Ltd     │  ← Header
├─────────────────────────────────────────────┤
│                                             │
│  Dear ABC Company,                          │
│                                             │
│  Thank you for your interest. Please       │
│  find attached our quotation...            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Quote Number:   QT-2026-00001         │ │
│  │ Date:           15 January 2026       │ │
│  │ Valid Until:    15 February 2026      │ │
│  │ Total Amount:   LKR 120,175.00        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│         ┌─────────────────────┐            │
│         │  View Quote Online  │            │  ← CTA Button
│         └─────────────────────┘            │
│                                             │
│  📎 A PDF copy is attached                 │
│                                             │
│  Best regards,                              │
│  ABC Trading (Pvt) Ltd                     │
│                                             │
├─────────────────────────────────────────────┤
│  This is an automated message...           │  ← Footer
└─────────────────────────────────────────────┘
```

### Expected Outcome
Professional, branded email template with quote details and CTA.

### Verification Checklist
- [ ] emails directory created
- [ ] quote_email.html created
- [ ] quote_email.txt created
- [ ] HTML template styled
- [ ] Inline CSS for email clients
- [ ] Company branding section
- [ ] Customer greeting
- [ ] Custom message support
- [ ] Quote details table
- [ ] Total amount highlighted
- [ ] CTA button to public view
- [ ] PDF attachment note
- [ ] Plain text fallback
- [ ] Footer with disclaimer
- [ ] Template variables work

---

## Task 78: Implement Email Sending Endpoint

### Overview
Add ViewSet action for sending quote emails manually.

### Dependencies
- Task 76: Email service exists
- Task 75: ViewSet exists

### Instructions

1. **Add send_email action to ViewSet**
   - @action(detail=True, methods=['post'])
   - Accept recipient email
   - Optional custom message
   - Call email service

2. **Add validation**
   - Validate email format
   - Check quote status allows sending
   - Permission checks

3. **Return response**
   - Success message
   - Email details
   - Error handling

### Implementation

```python
# Add to QuoteViewSet (apps/quotes/api/views.py)

from apps.quotes.services.email_service import QuoteEmailService

@action(detail=True, methods=['post'])
def send_email(self, request, pk=None):
    """
    Send quote via email.
    
    POST /api/quotes/{id}/send_email/
    Body:
    {
      "email": "customer@example.lk",
      "cc_emails": ["sales@mycompany.lk"],
      "message": "Please review the attached quotation."
    }
    """
    quote = self.get_object()
    
    # Check permission
    if not request.user.has_perm('quotes.send_quote'):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get recipient email
    recipient_email = request.data.get('email')
    
    if not recipient_email:
        # Try to use customer email
        recipient_email = quote.customer_email or (
            quote.customer.email if quote.customer else None
        )
        
        if not recipient_email:
            return Response(
                {'error': 'No email address provided or found'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Validate email format
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    
    try:
        validate_email(recipient_email)
    except ValidationError:
        return Response(
            {'error': 'Invalid email address'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get optional parameters
    custom_message = request.data.get('message')
    cc_emails = request.data.get('cc_emails', [])
    
    # Send email
    email_service = QuoteEmailService()
    success = email_service.send_quote_email(
        quote=quote,
        recipient_email=recipient_email,
        custom_message=custom_message,
        cc_emails=cc_emails
    )
    
    if success:
        return Response({
            'message': 'Quote emailed successfully',
            'recipient': recipient_email,
            'quote_number': quote.quote_number
        })
    else:
        return Response(
            {'error': 'Failed to send email. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

### Endpoint Usage

```javascript
// Send email
const response = await fetch(`/api/quotes/${quoteId}/send_email/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'customer@example.lk',
    cc_emails: ['sales@mycompany.lk'],
    message: 'Please review our quotation for your project.'
  })
});

const result = await response.json();
if (result.message) {
  alert('Email sent successfully!');
}
```

### Expected Outcome
API endpoint for manual email sending with validation.

### Verification Checklist
- [ ] send_email action added to ViewSet
- [ ] Accepts recipient email
- [ ] Falls back to customer email
- [ ] Email validation
- [ ] Permission checks
- [ ] Custom message support
- [ ] CC emails support
- [ ] Calls QuoteEmailService
- [ ] Success response
- [ ] Error handling
- [ ] 500 error on email failure

---

## Task 79: Create Celery Task for Email

### Overview
Create Celery task for asynchronous email sending with retry logic.

### Dependencies
- Task 76: Email service exists
- Celery configured

### Instructions

1. **Create tasks.py**
   - Create file: `apps/quotes/tasks.py`
   - Import Celery shared_task
   - Import email service

2. **Define send_quote_email_task**
   - @shared_task decorator
   - Accept quote_id and recipient
   - Call email service
   - Return success status

3. **Add retry logic**
   - autoretry_for exceptions
   - retry_kwargs (max_retries, countdown)
   - Exponential backoff

4. **Add error handling**
   - Log failures
   - Don't raise on final failure
   - Track retry attempts

5. **Update ViewSet to use task**
   - Option to send async
   - Return task ID

### Implementation

```python
# apps/quotes/tasks.py

from celery import shared_task
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3, 'countdown': 60},  # Retry up to 3 times, wait 60s
    retry_backoff=True,  # Exponential backoff
)
def send_quote_email_task(self, quote_id: int, recipient_email: str, custom_message: str = None):
    """
    Celery task to send quote email asynchronously.
    
    Args:
        quote_id: Quote ID
        recipient_email: Recipient email address
        custom_message: Optional custom message
    
    Returns:
        dict: Result with success status
    """
    from apps.quotes.models import Quote
    from apps.quotes.services.email_service import QuoteEmailService
    
    try:
        # Get quote
        quote = Quote.objects.get(id=quote_id)
        
        # Send email
        email_service = QuoteEmailService()
        success = email_service.send_quote_email(
            quote=quote,
            recipient_email=recipient_email,
            custom_message=custom_message
        )
        
        if success:
            logger.info(
                f"Quote {quote.quote_number} emailed successfully to {recipient_email}"
            )
            return {
                'success': True,
                'quote_number': quote.quote_number,
                'recipient': recipient_email
            }
        else:
            # Retry on failure
            raise Exception("Email sending failed")
            
    except ObjectDoesNotExist:
        logger.error(f"Quote with ID {quote_id} not found")
        return {'success': False, 'error': 'Quote not found'}
    
    except Exception as e:
        logger.error(f"Error sending quote email: {e}")
        
        # Don't retry on last attempt
        if self.request.retries >= self.max_retries:
            return {'success': False, 'error': str(e)}
        
        # Retry
        raise


@shared_task
def send_expiry_reminders_task():
    """
    Periodic task to send expiry reminders.
    
    Runs daily to check quotes expiring soon and send reminders.
    """
    from apps.quotes.models import Quote
    from apps.quotes.services.email_service import QuoteEmailService
    from django.utils import timezone
    from datetime import timedelta
    
    # Get quotes expiring in 3 days
    reminder_days = 3
    target_date = timezone.now().date() + timedelta(days=reminder_days)
    
    quotes = Quote.objects.filter(
        status='SENT',
        valid_until=target_date
    )
    
    email_service = QuoteEmailService()
    sent_count = 0
    
    for quote in quotes:
        # Check if reminder already sent today
        if hasattr(quote, 'last_reminder_sent_at'):
            if quote.last_reminder_sent_at and quote.last_reminder_sent_at.date() == timezone.now().date():
                continue
        
        # Send reminder
        success = email_service.send_expiry_reminder(
            quote=quote,
            days_until_expiry=reminder_days
        )
        
        if success:
            quote.last_reminder_sent_at = timezone.now()
            quote.save(update_fields=['last_reminder_sent_at'])
            sent_count += 1
    
    logger.info(f"Sent {sent_count} expiry reminders")
    return {'sent_count': sent_count}


# Update ViewSet to use async task
@action(detail=True, methods=['post'])
def send_email_async(self, request, pk=None):
    """
    Send quote via email asynchronously.
    
    POST /api/quotes/{id}/send_email_async/
    Body: {"email": "customer@example.lk", "message": "..."}
    
    Returns task ID for tracking.
    """
    quote = self.get_object()
    
    recipient_email = request.data.get('email') or quote.customer_email
    if not recipient_email:
        return Response(
            {'error': 'No email address provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    custom_message = request.data.get('message')
    
    # Queue task
    from apps.quotes.tasks import send_quote_email_task
    
    task = send_quote_email_task.delay(
        quote_id=quote.id,
        recipient_email=recipient_email,
        custom_message=custom_message
    )
    
    return Response({
        'message': 'Email queued for sending',
        'task_id': task.id,
        'quote_number': quote.quote_number,
        'recipient': recipient_email
    })
```

### Celery Beat Schedule

```python
# settings.py

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'send-expiry-reminders': {
        'task': 'apps.quotes.tasks.send_expiry_reminders_task',
        'schedule': crontab(hour=9, minute=0),  # Daily at 9 AM
    },
}
```

### Usage Examples

```python
# Manual async email
from apps.quotes.tasks import send_quote_email_task

task = send_quote_email_task.delay(
    quote_id=quote.id,
    recipient_email='customer@example.lk',
    custom_message='Please review'
)

# Check task status
from celery.result import AsyncResult

result = AsyncResult(task.id)
print(result.state)  # PENDING, SUCCESS, FAILURE
print(result.result)  # Task return value
```

### Expected Outcome
Async email sending with retry logic and scheduled expiry reminders.

### Verification Checklist
- [ ] tasks.py created
- [ ] send_quote_email_task defined
- [ ] @shared_task decorator
- [ ] Retry logic configured
- [ ] max_retries: 3
- [ ] Exponential backoff
- [ ] Error handling
- [ ] Logging
- [ ] send_expiry_reminders_task created
- [ ] Periodic task scheduled
- [ ] send_email_async action in ViewSet
- [ ] Returns task ID
- [ ] Task status trackable

---

## Task 80: Implement Quote Public View

### Overview
Create public view for customers to view quotes online without authentication using secure token.

### Dependencies
- Task 65: public_token field exists
- Quote serializer exists

### Instructions

1. **Create PublicQuoteView**
   - APIView with AllowAny permission
   - Accept token parameter
   - Return quote details

2. **Add public serializer**
   - Limited fields for security
   - No internal notes
   - Customer-facing only

3. **Add accept/reject buttons**
   - Show if status allows
   - Return action URLs

4. **Track views**
   - Increment view count
   - Track last viewed timestamp

### Implementation

```python
# apps/quotes/api/views.py (add to file)

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import Http404

class PublicQuoteView(APIView):
    """
    Public quote view accessible via token.
    
    GET /api/quotes/public/{token}/
    """
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        """Get quote details by public token."""
        try:
            quote = Quote.objects.select_related(
                'customer',
                'tenant'
            ).prefetch_related(
                'line_items__product'
            ).get(public_token=token)
        except Quote.DoesNotExist:
            raise Http404("Quote not found")
        
        # Track view
        if not hasattr(quote, 'view_count'):
            quote.view_count = 0
        quote.view_count = (quote.view_count or 0) + 1
        quote.last_viewed_at = timezone.now()
        quote.save(update_fields=['view_count', 'last_viewed_at'])
        
        # Serialize
        from apps.quotes.serializers import PublicQuoteSerializer
        serializer = PublicQuoteSerializer(quote, context={'request': request})
        
        return Response(serializer.data)


# Add PublicQuoteSerializer
class PublicQuoteSerializer(serializers.ModelSerializer):
    """Serializer for public quote view."""
    
    line_items = QuoteLineItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    company_name = serializers.CharField(source='tenant.name', read_only=True)
    
    # Available actions
    can_accept = serializers.SerializerMethodField()
    can_reject = serializers.SerializerMethodField()
    
    class Meta:
        model = Quote
        fields = [
            'quote_number',
            'company_name',
            'title',
            'description',
            'status',
            'status_display',
            'issue_date',
            'valid_until',
            'is_expired',
            'discount_type',
            'discount_value',
            'subtotal',
            'discount_amount',
            'tax_amount',
            'grand_total',
            'terms_and_conditions',
            'notes',  # Customer-facing notes only
            'line_items',
            'can_accept',
            'can_reject',
        ]
        # Exclude internal fields
    
    def get_can_accept(self, obj):
        """Check if quote can be accepted."""
        return obj.status == 'SENT' and not obj.is_expired
    
    def get_can_reject(self, obj):
        """Check if quote can be rejected."""
        return obj.status == 'SENT' and not obj.is_expired
```

### Public View Response

```json
{
  "quote_number": "QT-2026-00001",
  "company_name": "ABC Trading (Pvt) Ltd",
  "title": "Office Furniture Quotation",
  "status": "SENT",
  "status_display": "Sent to Customer",
  "issue_date": "2026-01-15",
  "valid_until": "2026-02-15",
  "is_expired": false,
  "subtotal": "110000.00",
  "discount_amount": "5500.00",
  "tax_amount": "15675.00",
  "grand_total": "120175.00",
  "terms_and_conditions": "...",
  "line_items": [...],
  "can_accept": true,
  "can_reject": true
}
```

### Expected Outcome
Secure public view for customers to review quotes online.

### Verification Checklist
- [ ] PublicQuoteView created
- [ ] AllowAny permission
- [ ] Token-based lookup
- [ ] 404 on invalid token
- [ ] View tracking (count, timestamp)
- [ ] PublicQuoteSerializer created
- [ ] Limited fields (no internal data)
- [ ] can_accept SerializerMethodField
- [ ] can_reject SerializerMethodField
- [ ] Customer-facing data only

---

## Task 81: Add Quote Accept/Reject Actions

### Overview
Add public API actions for customers to accept or reject quotes.

### Dependencies
- Task 80: Public view exists

### Instructions

1. **Create PublicQuoteAcceptView**
   - POST endpoint
   - Accept token and optional notes
   - Call QuoteService.accept_quote()

2. **Create PublicQuoteRejectView**
   - POST endpoint
   - Require rejection reason
   - Call QuoteService.reject_quote()

3. **Add validation**
   - Check quote status
   - Check not expired
   - Require reason for rejection

4. **Return success response**
   - Updated quote status
   - Confirmation message

### Implementation

```python
# apps/quotes/api/views.py (add to file)

class PublicQuoteAcceptView(APIView):
    """
    Public endpoint to accept quote.
    
    POST /api/quotes/public/{token}/accept/
    Body: {"notes": "Approved by manager"}
    """
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        try:
            quote = Quote.objects.get(public_token=token)
        except Quote.DoesNotExist:
            raise Http404("Quote not found")
        
        # Validate status
        if quote.status != 'SENT':
            return Response(
                {'error': 'Quote cannot be accepted in current status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check expiry
        if quote.is_expired:
            return Response(
                {'error': 'Quote has expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Accept quote
        notes = request.data.get('notes', 'Accepted via online view')
        
        from apps.quotes.services.quote_service import QuoteService
        service = QuoteService()
        
        try:
            service.accept_quote(quote, notes=notes, user=None)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': 'Quote accepted successfully',
            'quote_number': quote.quote_number,
            'status': quote.status,
            'status_display': quote.get_status_display()
        })


class PublicQuoteRejectView(APIView):
    """
    Public endpoint to reject quote.
    
    POST /api/quotes/public/{token}/reject/
    Body: {"reason": "Price too high"}
    """
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        try:
            quote = Quote.objects.get(public_token=token)
        except Quote.DoesNotExist:
            raise Http404("Quote not found")
        
        # Validate status
        if quote.status != 'SENT':
            return Response(
                {'error': 'Quote cannot be rejected in current status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Require reason
        reason = request.data.get('reason')
        if not reason:
            return Response(
                {'error': 'Rejection reason is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reject quote
        from apps.quotes.services.quote_service import QuoteService
        service = QuoteService()
        
        try:
            service.reject_quote(quote, reason=reason, user=None)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': 'Quote rejected',
            'quote_number': quote.quote_number,
            'status': quote.status,
            'status_display': quote.get_status_display(),
            'reason': reason
        })
```

### Public Action Endpoints

| Endpoint | Method | Description | Body |
|----------|--------|-------------|------|
| `/api/quotes/public/{token}/` | GET | View quote | - |
| `/api/quotes/public/{token}/accept/` | POST | Accept quote | {notes: string} |
| `/api/quotes/public/{token}/reject/` | POST | Reject quote | {reason: string} |

### Usage Examples

```javascript
// Customer accepts quote
await fetch(`/api/quotes/public/${token}/accept/`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    notes: 'Approved by purchasing manager'
  })
});

// Customer rejects quote
await fetch(`/api/quotes/public/${token}/reject/`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    reason: 'Budget constraints'
  })
});
```

### Expected Outcome
Customers can accept/reject quotes directly from email link without login.

### Verification Checklist
- [ ] PublicQuoteAcceptView created
- [ ] POST method
- [ ] Token-based authentication
- [ ] Status validation
- [ ] Expiry check
- [ ] Optional notes parameter
- [ ] Calls QuoteService.accept_quote()
- [ ] PublicQuoteRejectView created
- [ ] Required reason parameter
- [ ] Calls QuoteService.reject_quote()
- [ ] Success responses
- [ ] Error handling
- [ ] No authentication required

---

## Task 82: Register Quote API URLs

### Overview
Register all quote API URLs in Django URL configuration.

### Dependencies
- All ViewSet actions implemented
- Public views created

### Instructions

1. **Create urls.py**
   - Create file: `apps/quotes/urls.py`
   - Import router and views

2. **Register ViewSet**
   - Use DRF DefaultRouter
   - Register QuoteViewSet

3. **Add public URLs**
   - Public view endpoint
   - Public accept endpoint
   - Public reject endpoint
   - Public download endpoint

4. **Include in main urls**
   - Add to project urls.py

### Implementation

```python
# apps/quotes/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.quotes.api.views import (
    QuoteViewSet,
    PublicQuoteView,
    PublicQuoteAcceptView,
    PublicQuoteRejectView,
    PublicQuoteDownloadView,
)

app_name = 'quotes'

# Router for ViewSet
router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')

# URL patterns
urlpatterns = [
    # ViewSet routes
    path('', include(router.urls)),
    
    # Public routes (no authentication)
    path(
        'quotes/public/<uuid:token>/',
        PublicQuoteView.as_view(),
        name='public-view'
    ),
    path(
        'quotes/public/<uuid:token>/accept/',
        PublicQuoteAcceptView.as_view(),
        name='public-accept'
    ),
    path(
        'quotes/public/<uuid:token>/reject/',
        PublicQuoteRejectView.as_view(),
        name='public-reject'
    ),
    path(
        'quotes/public/<uuid:token>/download/',
        PublicQuoteDownloadView.as_view(),
        name='public-download'
    ),
]


# Include in main urls.py
# config/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.quotes.urls')),
    # ... other app URLs
]
```

### Complete API Routes

```
# Authenticated routes
GET     /api/quotes/                            # List quotes
POST    /api/quotes/                            # Create quote
GET     /api/quotes/{id}/                       # Get quote
PUT     /api/quotes/{id}/                       # Update quote
PATCH   /api/quotes/{id}/                       # Partial update
DELETE  /api/quotes/{id}/                       # Delete quote
POST    /api/quotes/{id}/send_quote/            # Send quote
POST    /api/quotes/{id}/accept_quote/          # Accept quote
POST    /api/quotes/{id}/reject_quote/          # Reject quote
POST    /api/quotes/{id}/convert_to_order/      # Convert to order
POST    /api/quotes/{id}/duplicate_quote/       # Duplicate quote
GET     /api/quotes/{id}/download_pdf/          # Download PDF
POST    /api/quotes/{id}/send_email/            # Send email
POST    /api/quotes/{id}/send_email_async/      # Send email async

# Public routes (no auth)
GET     /api/quotes/public/{token}/             # View quote
POST    /api/quotes/public/{token}/accept/      # Accept quote
POST    /api/quotes/public/{token}/reject/      # Reject quote
GET     /api/quotes/public/{token}/download/    # Download PDF
```

### Expected Outcome
All quote API endpoints registered and accessible.

### Verification Checklist
- [ ] urls.py created in quotes app
- [ ] DefaultRouter imported
- [ ] QuoteViewSet registered
- [ ] Public view URL registered
- [ ] Public accept URL registered
- [ ] Public reject URL registered
- [ ] Public download URL registered
- [ ] app_name set to 'quotes'
- [ ] URLs included in main urls.py
- [ ] All routes accessible
- [ ] Named URL patterns work

---

## Summary

After completing Tasks 76-82, the Quote module will have:

### Email Service
- QuoteEmailService for sending emails
- PDF attachment support
- HTML and plain text templates
- Professional branded emails
- Expiry reminder emails
- Error handling and logging

### Email Templates
- Professional HTML template
- Plain text fallback
- Company branding
- Quote summary
- CTA button to public view
- Responsive design

### Async Email
- Celery task for async sending
- Retry logic (3 attempts)
- Exponential backoff
- Scheduled expiry reminders
- Task status tracking

### Public Customer View
- Token-based access (no login)
- View quote details online
- Accept/reject actions
- QR code access from PDF
- View tracking
- Security (limited fields)

### Complete API
```
Authenticated:
- Full CRUD operations
- Status actions (send/accept/reject/convert)
- Filtering & search
- PDF download
- Email sending

Public:
- View quote (token-based)
- Accept quote
- Reject quote
- Download PDF
```

### Customer Journey
```
Customer receives email
       │
       ▼
Click "View Online" OR Scan QR code
       │
       ▼
Public quote view (no login)
       │
    ┌──┴──┐
    │     │
  Accept Reject
    │     │
    ▼     ▼
  ACCEPTED REJECTED
    │
    ▼
Convert to Order
```

### Next Steps
Proceed to [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/) to implement comprehensive testing and documentation for the complete quote module.
