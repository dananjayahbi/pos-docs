# Tasks 79-82: Email Service and Notifications

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** E - PO PDF, Email & Notifications  
> **Document:** 03 of 03  
> **Tasks Covered:** 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-73-78_PDF-Generator.md](02_Tasks-73-78_PDF-Generator.md)

---

## Document Overview

This document implements the POEmailService for sending purchase orders to vendors via email, creating email templates, and managing notifications through Celery tasks.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create POEmailService Class | High | 30 min |
| 80 | Create Email Templates | Medium | 25 min |
| 81 | Implement Email Sending with Attachment | High | 30 min |
| 82 | Create Email & Reminder Celery Tasks | Medium | 25 min |

---

## Task 79: Create POEmailService Class

### Instructions
1. Create `email_service.py` in services
2. Define POEmailService class
3. Add constructor accepting po_id
4. Add send_to_vendor method
5. Add send_acknowledgment_reminder method
6. Add send_delivery_reminder method
7. Import Django email utilities
8. Configure email settings
9. Handle email errors gracefully

### Email Service Structure
```
POEmailService:
├── __init__(po_id)
├── send_to_vendor(subject, cc_emails=[])
├── send_acknowledgment_reminder()
├── send_delivery_reminder()
├── _get_email_context()
├── _render_template(template_name, context)
└── _attach_pdf(email, po)
```

---

## Task 80: Create Email Templates

### Instructions
1. Create `templates/purchases/emails/` directory
2. Create `po_send.html` template (vendor)
3. Create `po_send.txt` template (plain text fallback)
4. Create `acknowledgment_reminder.html` template
5. Create `delivery_reminder.html` template
6. Use tenant branding in templates
7. Include PO summary table
8. Add professional formatting

### Email Template: po_send.html
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background-color: #1976D2; color: white; padding: 20px; }
        .content { padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Purchase Order: {{ po.po_number }}</h1>
    </div>
    <div class="content">
        <p>Dear {{ po.vendor.name }},</p>
        
        <p>Please find attached our purchase order {{ po.po_number }} for your review and processing.</p>
        
        <h3>Order Summary:</h3>
        <table>
            <tr>
                <th>PO Number</th>
                <td>{{ po.po_number }}</td>
            </tr>
            <tr>
                <th>Order Date</th>
                <td>{{ po.order_date }}</td>
            </tr>
            <tr>
                <th>Expected Delivery</th>
                <td>{{ po.expected_delivery_date }}</td>
            </tr>
            <tr>
                <th>Total Amount</th>
                <td>{{ po.total_amount|currency }}</td>
            </tr>
        </table>
        
        <h3>Items Ordered:</h3>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {% for line in po.line_items.all %}
                <tr>
                    <td>{{ line.product.name }}</td>
                    <td>{{ line.quantity_ordered }}</td>
                    <td>{{ line.unit_price|currency }}</td>
                    <td>{{ line.line_total|currency }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
        
        <p><strong>Please confirm receipt of this order within 24 hours.</strong></p>
        
        <p>If you have any questions, please contact:</p>
        <p>
            {{ po.created_by.get_full_name }}<br>
            {{ po.created_by.email }}<br>
            {{ tenant.phone }}
        </p>
        
        <p>Best regards,<br>{{ tenant.name }}</p>
    </div>
</body>
</html>
```

### Email Template: acknowledgment_reminder.html
```html
<div class="content">
    <p>Dear {{ po.vendor.name }},</p>
    
    <p>This is a friendly reminder that we have not yet received acknowledgment for:</p>
    
    <h3>{{ po.po_number }}</h3>
    <p>Sent on: {{ po.sent_at }}</p>
    <p>Total Amount: {{ po.total_amount|currency }}</p>
    
    <p><strong>Please confirm receipt at your earliest convenience.</strong></p>
</div>
```

### Email Template: delivery_reminder.html
```html
<div class="content">
    <p>Dear {{ po.vendor.name }},</p>
    
    <p>Reminder: The expected delivery date for PO {{ po.po_number }} is approaching.</p>
    
    <p>Expected Delivery: <strong>{{ po.expected_delivery_date }}</strong></p>
    <p>Days Remaining: {{ days_remaining }}</p>
    
    <p>Please ensure timely delivery. Contact us if there are any delays.</p>
</div>
```

---

## Task 81: Implement Email Sending with Attachment

### Instructions
1. Add send_to_vendor method implementation
2. Load PurchaseOrder and vendor
3. Validate vendor has email
4. Generate PDF using POPDFGenerator
5. Create EmailMessage with HTML content
6. Attach PDF file
7. Add CC recipients (po.created_by, approver)
8. Send email
9. Update po.sent_at timestamp
10. Update po.status to SENT
11. Log email activity in POHistory

### Email Sending Flow
```
POService.send_to_vendor(po_id)
    ↓
POEmailService.send_to_vendor()
    ↓
├── Validate vendor email
├── Generate PDF → POPDFGenerator
├── Render HTML template
├── Create EmailMessage
├── Attach PDF
├── Send email
└── Update PO (status=SENT, sent_at=now)
    ↓
Log in POHistory (action=SENT)
```

### Email Configuration
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD')
DEFAULT_FROM_EMAIL = 'noreply@yourcompany.com'
```

---

## Task 82: Create Email & Reminder Celery Tasks

### Instructions
1. Create `email_tasks.py` in tasks directory
2. Define send_po_email task (async)
3. Define send_acknowledgment_reminders task (scheduled)
4. Define send_delivery_reminders task (scheduled)
5. Configure Celery beat schedule
6. Add retry logic for failed emails
7. Log task execution

### Celery Task: send_po_email
```python
@shared_task(bind=True, max_retries=3)
def send_po_email(self, po_id, cc_emails=None):
    """Send PO email asynchronously"""
    try:
        email_service = POEmailService(po_id)
        email_service.send_to_vendor(
            subject=f'Purchase Order {po.po_number}',
            cc_emails=cc_emails or []
        )
        return {'status': 'success', 'po_id': po_id}
    except Exception as exc:
        # Retry after 5 minutes
        self.retry(exc=exc, countdown=300)
```

### Celery Task: send_acknowledgment_reminders
```python
@shared_task
def send_acknowledgment_reminders():
    """Send reminders for unacknowledged POs (runs daily)"""
    from datetime import timedelta
    from django.utils import timezone
    
    # Find POs sent > 24 hours ago, not acknowledged
    cutoff = timezone.now() - timedelta(hours=24)
    pos = PurchaseOrder.objects.filter(
        status='SENT',
        sent_at__lt=cutoff,
        acknowledged_at__isnull=True
    )
    
    for po in pos:
        email_service = POEmailService(po.id)
        email_service.send_acknowledgment_reminder()
    
    return {'count': pos.count()}
```

### Celery Task: send_delivery_reminders
```python
@shared_task
def send_delivery_reminders():
    """Send reminders for upcoming deliveries (runs daily)"""
    from datetime import timedelta
    from django.utils import timezone
    
    # Find POs with delivery in 3 days, not yet received
    target_date = timezone.now().date() + timedelta(days=3)
    pos = PurchaseOrder.objects.filter(
        status__in=['SENT', 'ACKNOWLEDGED'],
        expected_delivery_date=target_date
    )
    
    for po in pos:
        email_service = POEmailService(po.id)
        email_service.send_delivery_reminder()
    
    return {'count': pos.count()}
```

### Celery Beat Schedule
```python
# celery.py
from celery.schedules import crontab

app.conf.beat_schedule = {
    'send-acknowledgment-reminders': {
        'task': 'purchases.tasks.send_acknowledgment_reminders',
        'schedule': crontab(hour=9, minute=0),  # Daily at 9 AM
    },
    'send-delivery-reminders': {
        'task': 'purchases.tasks.send_delivery_reminders',
        'schedule': crontab(hour=8, minute=0),  # Daily at 8 AM
    },
}
```

---

## Summary

Group E Complete - All 14 tasks:
- ✅ POTemplate model
- ✅ PDF generator with all sections
- ✅ Email service class
- ✅ HTML email templates (3 types)
- ✅ PDF attachment
- ✅ Async email sending
- ✅ Acknowledgment reminders
- ✅ Delivery reminders
- ✅ Celery beat scheduling

### Email Workflow
```
Create PO → Send to Vendor
               ↓
    ┌──────────┴──────────┐
    ↓                     ↓
Generate PDF         Send Email
                         ↓
               Update Status (SENT)
                         ↓
          ┌──────────────┴──────────────┐
          ↓                              ↓
   No Ack in 24h?                 Delivery in 3 days?
          ↓                              ↓
   Send Reminder                   Send Reminder
```

### Next Steps
- **Group F**: Implement API endpoints, testing, and documentation
