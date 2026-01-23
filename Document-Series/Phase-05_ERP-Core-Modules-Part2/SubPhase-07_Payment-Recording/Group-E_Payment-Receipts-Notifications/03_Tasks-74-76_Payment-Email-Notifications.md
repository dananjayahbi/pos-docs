# Tasks 74-76: Payment Email Notifications

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** E - Payment Receipts & Notifications  
> **Document:** 03 of 03  
> **Tasks Covered:** 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-71-73_Receipt-PDF-Generation.md](02_Tasks-71-73_Receipt-PDF-Generation.md)
- **→ Next Group:** [../Group-F_Payment-API-Testing/00_GROUP_OVERVIEW.md](../Group-F_Payment-API-Testing/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document implements email notification system for payment-related events, including sending payment confirmations, receipt delivery, refund notifications, and payment reminders to customers. This includes email templates, async email sending with Celery, and email tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Create Payment Email Templates | Medium | 30 min |
| 75 | Implement Email Service | High | 35 min |
| 76 | Set Up Async Email Tasks | Medium | 25 min |

---

## Task 74: Create Payment Email Templates

### Overview
Create professional HTML email templates for payment-related notifications, including payment confirmations, receipt delivery, refund notifications, and payment reminders.

### Dependencies
- Django email configuration

### Instructions

1. **Create email templates directory**
   - templates/emails/payments/
   - Base template with header/footer
   - Individual templates for each email type

2. **Design base email template**
   - Company branding
   - Responsive design
   - Header and footer sections

3. **Create payment confirmation template**
   - Payment details
   - Customer information
   - Next steps

4. **Create receipt email template**
   - Receipt attached message
   - Payment summary
   - Download link

5. **Create refund notification template**
   - Refund details
   - Processing timeline
   - Contact information

6. **Create payment reminder template**
   - Outstanding amount
   - Due date
   - Payment options

### Implementation

#### Email Template Structure

```
templates/
  emails/
    payments/
      base_email.html              ← Base template
      payment_confirmation.html    ← Payment confirmed
      receipt_delivery.html        ← Receipt with PDF
      refund_notification.html     ← Refund processed
      payment_reminder.html        ← Payment due reminder
      payment_failed.html          ← Payment failed alert
```

#### Base Email Template

```html
<!-- templates/emails/payments/base_email.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Payment Notification{% endblock %}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .email-header {
            background-color: #2563eb;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px 20px;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-table td {
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .info-table td:first-child {
            font-weight: 600;
            width: 40%;
        }
        .highlight-box {
            background-color: #e7f5ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
        }
        .success-box {
            background-color: #d1f4e0;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-box {
            background-color: #fff3cd;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 10px 0;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .amount-highlight {
            font-size: 24px;
            font-weight: 700;
            color: #10b981;
            text-align: center;
            padding: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>{% block header_title %}{{ company_name }}{% endblock %}</h1>
            <p style="margin: 5px 0 0;">{% block header_subtitle %}Payment Notification{% endblock %}</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            {% block content %}{% endblock %}
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p><strong>{{ company_name }}</strong></p>
            <p>{{ company_address }}</p>
            <p>{{ company_contact }}</p>
            <p style="margin-top: 15px;">
                <a href="{{ company_website }}" style="color: #2563eb;">Visit our website</a> |
                <a href="mailto:{{ company_email }}" style="color: #2563eb;">Contact us</a>
            </p>
            <p style="margin-top: 15px; color: #9ca3af;">
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
```

#### Payment Confirmation Template

```html
<!-- templates/emails/payments/payment_confirmation.html -->
{% extends "emails/payments/base_email.html" %}

{% block title %}Payment Confirmation - {{ payment.payment_number }}{% endblock %}

{% block header_title %}Payment Confirmed{% endblock %}
{% block header_subtitle %}Thank you for your payment{% endblock %}

{% block content %}
<p>Dear {{ customer.name }},</p>

<p>We have successfully received your payment. Thank you for your business!</p>

<div class="success-box">
    <p style="margin: 0; font-weight: 600;">✓ Payment Confirmed</p>
    <div class="amount-highlight">{{ payment.amount|currency:payment.currency }}</div>
</div>

<div class="section">
    <div class="section-title">Payment Details</div>
    <table class="info-table">
        <tr>
            <td>Payment Number:</td>
            <td><strong>{{ payment.payment_number }}</strong></td>
        </tr>
        <tr>
            <td>Payment Date:</td>
            <td>{{ payment.payment_date|date:"d F Y" }}</td>
        </tr>
        <tr>
            <td>Payment Method:</td>
            <td>{{ payment.get_method_display }}</td>
        </tr>
        <tr>
            <td>Amount Paid:</td>
            <td><strong>{{ payment.amount|currency:payment.currency }}</strong></td>
        </tr>
        {% if payment.reference_number %}
        <tr>
            <td>Reference Number:</td>
            <td>{{ payment.reference_number }}</td>
        </tr>
        {% endif %}
    </table>
</div>

{% if invoice %}
<div class="section">
    <div class="section-title">Invoice Information</div>
    <table class="info-table">
        <tr>
            <td>Invoice Number:</td>
            <td>{{ invoice.invoice_number }}</td>
        </tr>
        <tr>
            <td>Invoice Date:</td>
            <td>{{ invoice.invoice_date|date:"d F Y" }}</td>
        </tr>
        <tr>
            <td>Outstanding Balance:</td>
            <td>{{ invoice.outstanding|currency:invoice.currency }}</td>
        </tr>
    </table>
</div>
{% endif %}

<div class="highlight-box">
    <p style="margin: 0;">
        <strong>Next Steps:</strong><br>
        A payment receipt will be sent to you shortly via email.
        You can also download your receipt from our customer portal.
    </p>
</div>

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ portal_url }}" class="button">View Your Account</a>
</div>

<p>If you have any questions about this payment, please don't hesitate to contact us.</p>

<p>Best regards,<br>
{{ company_name }} Accounts Team</p>
{% endblock %}
```

#### Receipt Delivery Template

```html
<!-- templates/emails/payments/receipt_delivery.html -->
{% extends "emails/payments/base_email.html" %}

{% block title %}Payment Receipt - {{ receipt.receipt_number }}{% endblock %}

{% block header_title %}Payment Receipt{% endblock %}
{% block header_subtitle %}Your payment receipt is ready{% endblock %}

{% block content %}
<p>Dear {{ customer.name }},</p>

<p>Thank you for your payment. Please find your payment receipt attached to this email.</p>

<div class="success-box">
    <p style="margin: 0; text-align: center;">
        <strong style="font-size: 16px;">Receipt Number: {{ receipt.receipt_number }}</strong>
    </p>
    <div class="amount-highlight">{{ receipt.receipt_amount|currency:receipt.currency }}</div>
</div>

<div class="section">
    <div class="section-title">Receipt Summary</div>
    <table class="info-table">
        <tr>
            <td>Receipt Number:</td>
            <td><strong>{{ receipt.receipt_number }}</strong></td>
        </tr>
        <tr>
            <td>Receipt Date:</td>
            <td>{{ receipt.receipt_date|date:"d F Y" }}</td>
        </tr>
        <tr>
            <td>Payment Method:</td>
            <td>{{ receipt.get_display_method }}</td>
        </tr>
        <tr>
            <td>Amount:</td>
            <td><strong>{{ receipt.receipt_amount|currency:receipt.currency }}</strong></td>
        </tr>
        {% if receipt.reference_number %}
        <tr>
            <td>Reference:</td>
            <td>{{ receipt.reference_number }}</td>
        </tr>
        {% endif %}
    </table>
</div>

<div class="highlight-box">
    <p style="margin: 0;">
        <strong>📎 Receipt Attached</strong><br>
        Your payment receipt is attached as a PDF file to this email.
        You can save it for your records.
    </p>
</div>

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ receipt.get_pdf_url }}" class="button">Download Receipt</a>
</div>

<p style="font-size: 12px; color: #6c757d;">
    If you cannot view the attachment, you can download the receipt using the button above
    or from your customer portal.
</p>

<p>Thank you for your business!</p>

<p>Best regards,<br>
{{ company_name }} Accounts Team</p>
{% endblock %}
```

#### Refund Notification Template

```html
<!-- templates/emails/payments/refund_notification.html -->
{% extends "emails/payments/base_email.html" %}

{% block title %}Refund Notification - {{ refund.refund_number }}{% endblock %}

{% block header_title %}Refund Processed{% endblock %}
{% block header_subtitle %}Your refund has been initiated{% endblock %}

{% block content %}
<p>Dear {{ customer.name }},</p>

<p>Your refund request has been processed successfully.</p>

<div class="highlight-box">
    <p style="margin: 0; text-align: center;">
        <strong style="font-size: 16px;">Refund Number: {{ refund.refund_number }}</strong>
    </p>
    <div class="amount-highlight">{{ refund.refund_amount|currency:refund.currency }}</div>
</div>

<div class="section">
    <div class="section-title">Refund Details</div>
    <table class="info-table">
        <tr>
            <td>Refund Number:</td>
            <td><strong>{{ refund.refund_number }}</strong></td>
        </tr>
        <tr>
            <td>Original Payment:</td>
            <td>{{ refund.original_payment.payment_number }}</td>
        </tr>
        <tr>
            <td>Refund Amount:</td>
            <td><strong>{{ refund.refund_amount|currency:refund.currency }}</strong></td>
        </tr>
        <tr>
            <td>Refund Method:</td>
            <td>{{ refund.get_refund_method_display }}</td>
        </tr>
        <tr>
            <td>Reason:</td>
            <td>{{ refund.get_reason_display }}</td>
        </tr>
        <tr>
            <td>Status:</td>
            <td><strong>{{ refund.get_status_display }}</strong></td>
        </tr>
    </table>
</div>

{% if refund.refund_method == 'ORIGINAL_METHOD' %}
<div class="warning-box">
    <p style="margin: 0;">
        <strong>⏱ Processing Time:</strong><br>
        {% if refund.original_payment.method == 'CARD' %}
        Your refund will be credited back to your original card within 5-7 business days.
        {% elif refund.original_payment.method == 'BANK_TRANSFER' %}
        Your refund will be transferred to your bank account within 2-3 business days.
        {% elif refund.original_payment.method == 'MOBILE' %}
        Your refund will be credited to your mobile wallet within 24 hours.
        {% else %}
        Your refund will be processed within 3-5 business days.
        {% endif %}
    </p>
</div>
{% elif refund.refund_method == 'STORE_CREDIT' %}
<div class="success-box">
    <p style="margin: 0;">
        <strong>✓ Store Credit Issued:</strong><br>
        A store credit of {{ refund.refund_amount|currency:refund.currency }} has been added
        to your account. You can use it for your next purchase.
    </p>
</div>
{% endif %}

{% if refund.reason_description %}
<div class="section">
    <div class="section-title">Additional Information</div>
    <p>{{ refund.reason_description }}</p>
</div>
{% endif %}

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ portal_url }}" class="button">View Refund Status</a>
</div>

<p>If you have any questions about this refund, please contact our customer service team.</p>

<p>Best regards,<br>
{{ company_name }} Customer Service Team</p>
{% endblock %}
```

#### Payment Reminder Template

```html
<!-- templates/emails/payments/payment_reminder.html -->
{% extends "emails/payments/base_email.html" %}

{% block title %}Payment Reminder - {{ invoice.invoice_number }}{% endblock %}

{% block header_title %}Payment Reminder{% endblock %}
{% block header_subtitle %}Outstanding payment due{% endblock %}

{% block content %}
<p>Dear {{ customer.name }},</p>

<p>This is a friendly reminder that you have an outstanding payment due.</p>

<div class="warning-box">
    <p style="margin: 0; text-align: center;">
        <strong style="font-size: 16px;">Amount Due</strong>
    </p>
    <div class="amount-highlight" style="color: #f59e0b;">
        {{ invoice.outstanding|currency:invoice.currency }}
    </div>
</div>

<div class="section">
    <div class="section-title">Invoice Details</div>
    <table class="info-table">
        <tr>
            <td>Invoice Number:</td>
            <td><strong>{{ invoice.invoice_number }}</strong></td>
        </tr>
        <tr>
            <td>Invoice Date:</td>
            <td>{{ invoice.invoice_date|date:"d F Y" }}</td>
        </tr>
        <tr>
            <td>Due Date:</td>
            <td><strong>{{ invoice.due_date|date:"d F Y" }}</strong></td>
        </tr>
        <tr>
            <td>Total Amount:</td>
            <td>{{ invoice.total_amount|currency:invoice.currency }}</td>
        </tr>
        <tr>
            <td>Amount Paid:</td>
            <td>{{ invoice.paid_amount|currency:invoice.currency }}</td>
        </tr>
        <tr>
            <td>Outstanding:</td>
            <td><strong style="color: #f59e0b;">{{ invoice.outstanding|currency:invoice.currency }}</strong></td>
        </tr>
    </table>
</div>

<div class="section">
    <div class="section-title">Payment Options</div>
    <p>You can make your payment using any of the following methods:</p>
    <ul>
        <li><strong>Online Payment:</strong> Pay via our customer portal using card or mobile wallet</li>
        <li><strong>Bank Transfer:</strong> Transfer to our bank account (details below)</li>
        <li><strong>Cash:</strong> Visit our office during business hours</li>
    </ul>
</div>

<div class="highlight-box">
    <p style="margin: 0;">
        <strong>Bank Transfer Details:</strong><br>
        Bank: Commercial Bank of Ceylon<br>
        Account Name: {{ company_name }}<br>
        Account Number: 1234567890<br>
        Branch: Colombo 03<br>
        <em>Please include invoice number {{ invoice.invoice_number }} as reference</em>
    </p>
</div>

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ payment_url }}" class="button">Pay Online Now</a>
</div>

<p>
    If you have already made this payment, please ignore this reminder.
    If you're experiencing difficulties with payment, please contact us to discuss options.
</p>

<p>Thank you for your prompt attention to this matter.</p>

<p>Best regards,<br>
{{ company_name }} Accounts Team</p>
{% endblock %}
```

#### Payment Failed Template

```html
<!-- templates/emails/payments/payment_failed.html -->
{% extends "emails/payments/base_email.html" %}

{% block title %}Payment Failed - {{ payment.payment_number }}{% endblock %}

{% block header_title %}Payment Failed{% endblock %}
{% block header_subtitle %}Action required{% endblock %}

{% block content %}
<p>Dear {{ customer.name }},</p>

<p>We were unable to process your recent payment. Please review the details below and try again.</p>

<div class="warning-box">
    <p style="margin: 0; text-align: center;">
        <strong style="font-size: 16px;">⚠ Payment Failed</strong>
    </p>
    <div style="font-size: 18px; font-weight: 600; text-align: center; margin-top: 10px;">
        {{ payment.amount|currency:payment.currency }}
    </div>
</div>

<div class="section">
    <div class="section-title">Failed Payment Details</div>
    <table class="info-table">
        <tr>
            <td>Payment Number:</td>
            <td>{{ payment.payment_number }}</td>
        </tr>
        <tr>
            <td>Payment Method:</td>
            <td>{{ payment.get_method_display }}</td>
        </tr>
        <tr>
            <td>Amount:</td>
            <td>{{ payment.amount|currency:payment.currency }}</td>
        </tr>
        <tr>
            <td>Failed Date:</td>
            <td>{{ payment.updated_at|date:"d F Y H:i" }}</td>
        </tr>
        {% if payment.failure_reason %}
        <tr>
            <td>Reason:</td>
            <td><strong>{{ payment.failure_reason }}</strong></td>
        </tr>
        {% endif %}
    </table>
</div>

<div class="section">
    <div class="section-title">Common Reasons for Payment Failure</div>
    <ul>
        <li>Insufficient funds in account</li>
        <li>Incorrect card details</li>
        <li>Card expired or blocked</li>
        <li>Bank declined the transaction</li>
        <li>Network or technical issues</li>
    </ul>
</div>

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ retry_url }}" class="button">Try Payment Again</a>
</div>

<p>
    If you continue to experience issues, please contact your bank or our customer service team
    for assistance.
</p>

<p>Best regards,<br>
{{ company_name }} Support Team</p>
{% endblock %}
```

### Expected Outcome
- Professional HTML email templates
- Responsive design
- Company branding
- Templates for all payment events

### Verification Checklist
- [ ] base_email.html created
- [ ] payment_confirmation.html template
- [ ] receipt_delivery.html template
- [ ] refund_notification.html template
- [ ] payment_reminder.html template
- [ ] payment_failed.html template
- [ ] Responsive design tested
- [ ] Company branding consistent

---

## Task 75: Implement Email Service

### Overview
Create PaymentEmailService to handle email sending for all payment-related notifications using Django's email system.

### Dependencies
- Task 74: Email templates created
- Django email configuration (SMTP)

### Instructions

1. **Create PaymentEmailService class**
   - send_payment_confirmation(): Payment confirmed
   - send_receipt_email(): Send receipt with PDF
   - send_refund_notification(): Refund processed
   - send_payment_reminder(): Payment due
   - send_payment_failed(): Payment failed

2. **Implement email rendering**
   - Render HTML templates
   - Pass context data
   - Handle plain text fallback

3. **Add email attachments**
   - Attach receipt PDF
   - Handle multiple attachments

4. **Track email delivery**
   - Update sent_at timestamp
   - Log email sending
   - Handle errors

### Implementation

```python
# Create apps/payments/services/email_service.py

import logging
from datetime import datetime
from typing import List, Optional, Dict, Any

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

from apps.payments.models import Payment, PaymentReceipt, Refund
from apps.invoices.models import Invoice

logger = logging.getLogger(__name__)


class PaymentEmailService:
    """Service for sending payment-related emails"""
    
    @staticmethod
    def send_payment_confirmation(payment: Payment) -> Dict[str, Any]:
        """
        Send payment confirmation email
        
        Args:
            payment: Payment instance
            
        Returns:
            dict: Sending result
        """
        try:
            customer = payment.customer
            invoice = payment.invoice
            
            # Email context
            context = {
                'customer': customer,
                'payment': payment,
                'invoice': invoice,
                'company_name': settings.COMPANY_NAME,
                'company_address': settings.COMPANY_ADDRESS,
                'company_contact': settings.COMPANY_CONTACT,
                'company_email': settings.COMPANY_EMAIL,
                'company_website': settings.COMPANY_WEBSITE,
                'portal_url': f'{settings.SITE_URL}/customer/portal/',
            }
            
            # Render email
            html_content = render_to_string(
                'emails/payments/payment_confirmation.html',
                context
            )
            text_content = strip_tags(html_content)
            
            # Create email
            subject = f'Payment Confirmation - {payment.payment_number}'
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [customer.email]
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=to_email
            )
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send(fail_silently=False)
            
            logger.info(
                f'Payment confirmation email sent: {payment.payment_number} '
                f'to {customer.email}'
            )
            
            return {
                'success': True,
                'message': 'Payment confirmation email sent',
                'recipient': customer.email
            }
            
        except Exception as e:
            logger.error(
                f'Failed to send payment confirmation: {str(e)}',
                exc_info=True
            )
            return {
                'success': False,
                'error': str(e),
                'code': 'EMAIL_SEND_ERROR'
            }
    
    
    @staticmethod
    def send_receipt_email(receipt: PaymentReceipt) -> Dict[str, Any]:
        """
        Send payment receipt email with PDF attachment
        
        Args:
            receipt: PaymentReceipt instance
            
        Returns:
            dict: Sending result
        """
        try:
            customer = receipt.customer
            payment = receipt.payment
            
            # Email context
            context = {
                'customer': customer,
                'receipt': receipt,
                'payment': payment,
                'company_name': settings.COMPANY_NAME,
                'company_address': settings.COMPANY_ADDRESS,
                'company_contact': settings.COMPANY_CONTACT,
                'company_email': settings.COMPANY_EMAIL,
                'company_website': settings.COMPANY_WEBSITE,
            }
            
            # Render email
            html_content = render_to_string(
                'emails/payments/receipt_delivery.html',
                context
            )
            text_content = strip_tags(html_content)
            
            # Create email
            subject = f'Payment Receipt - {receipt.receipt_number}'
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [customer.email]
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=to_email
            )
            email.attach_alternative(html_content, "text/html")
            
            # Attach PDF if exists
            if receipt.has_pdf():
                pdf_file = receipt.pdf_file
                pdf_filename = f'{receipt.receipt_number}.pdf'
                
                # Read PDF content
                pdf_file.open('rb')
                pdf_content = pdf_file.read()
                pdf_file.close()
                
                # Attach to email
                email.attach(
                    filename=pdf_filename,
                    content=pdf_content,
                    mimetype='application/pdf'
                )
            
            # Send email
            email.send(fail_silently=False)
            
            # Mark receipt as sent
            receipt.mark_as_sent(customer.email)
            
            logger.info(
                f'Receipt email sent: {receipt.receipt_number} '
                f'to {customer.email}'
            )
            
            return {
                'success': True,
                'message': 'Receipt email sent with PDF attachment',
                'recipient': customer.email
            }
            
        except Exception as e:
            logger.error(
                f'Failed to send receipt email: {str(e)}',
                exc_info=True
            )
            return {
                'success': False,
                'error': str(e),
                'code': 'EMAIL_SEND_ERROR'
            }
    
    
    @staticmethod
    def send_refund_notification(refund: Refund) -> Dict[str, Any]:
        """
        Send refund notification email
        
        Args:
            refund: Refund instance
            
        Returns:
            dict: Sending result
        """
        try:
            customer = refund.customer
            
            # Email context
            context = {
                'customer': customer,
                'refund': refund,
                'company_name': settings.COMPANY_NAME,
                'company_address': settings.COMPANY_ADDRESS,
                'company_contact': settings.COMPANY_CONTACT,
                'company_email': settings.COMPANY_EMAIL,
                'company_website': settings.COMPANY_WEBSITE,
                'portal_url': f'{settings.SITE_URL}/customer/portal/',
            }
            
            # Render email
            html_content = render_to_string(
                'emails/payments/refund_notification.html',
                context
            )
            text_content = strip_tags(html_content)
            
            # Create email
            subject = f'Refund Processed - {refund.refund_number}'
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [customer.email]
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=to_email
            )
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send(fail_silently=False)
            
            logger.info(
                f'Refund notification email sent: {refund.refund_number} '
                f'to {customer.email}'
            )
            
            return {
                'success': True,
                'message': 'Refund notification email sent',
                'recipient': customer.email
            }
            
        except Exception as e:
            logger.error(
                f'Failed to send refund notification: {str(e)}',
                exc_info=True
            )
            return {
                'success': False,
                'error': str(e),
                'code': 'EMAIL_SEND_ERROR'
            }
    
    
    @staticmethod
    def send_payment_reminder(invoice: Invoice, days_overdue: int = 0) -> Dict[str, Any]:
        """
        Send payment reminder email for outstanding invoice
        
        Args:
            invoice: Invoice instance
            days_overdue: Number of days overdue
            
        Returns:
            dict: Sending result
        """
        try:
            customer = invoice.customer
            
            # Email context
            context = {
                'customer': customer,
                'invoice': invoice,
                'days_overdue': days_overdue,
                'company_name': settings.COMPANY_NAME,
                'company_address': settings.COMPANY_ADDRESS,
                'company_contact': settings.COMPANY_CONTACT,
                'company_email': settings.COMPANY_EMAIL,
                'company_website': settings.COMPANY_WEBSITE,
                'payment_url': f'{settings.SITE_URL}/customer/invoices/{invoice.id}/pay/',
            }
            
            # Render email
            html_content = render_to_string(
                'emails/payments/payment_reminder.html',
                context
            )
            text_content = strip_tags(html_content)
            
            # Create email with urgency based on days overdue
            if days_overdue > 30:
                subject = f'URGENT: Payment Overdue - {invoice.invoice_number}'
            elif days_overdue > 0:
                subject = f'Payment Overdue - {invoice.invoice_number}'
            else:
                subject = f'Payment Reminder - {invoice.invoice_number}'
            
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [customer.email]
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=to_email
            )
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send(fail_silently=False)
            
            logger.info(
                f'Payment reminder email sent: {invoice.invoice_number} '
                f'to {customer.email}, {days_overdue} days overdue'
            )
            
            return {
                'success': True,
                'message': 'Payment reminder email sent',
                'recipient': customer.email
            }
            
        except Exception as e:
            logger.error(
                f'Failed to send payment reminder: {str(e)}',
                exc_info=True
            )
            return {
                'success': False,
                'error': str(e),
                'code': 'EMAIL_SEND_ERROR'
            }
    
    
    @staticmethod
    def send_payment_failed_notification(payment: Payment, failure_reason: str = None) -> Dict[str, Any]:
        """
        Send payment failed notification email
        
        Args:
            payment: Payment instance
            failure_reason: Reason for failure
            
        Returns:
            dict: Sending result
        """
        try:
            customer = payment.customer
            
            # Update payment with failure reason if provided
            if failure_reason:
                payment.notes = (payment.notes or '') + f'\nFailure Reason: {failure_reason}'
                payment.save(update_fields=['notes'])
            
            # Email context
            context = {
                'customer': customer,
                'payment': payment,
                'failure_reason': failure_reason,
                'company_name': settings.COMPANY_NAME,
                'company_address': settings.COMPANY_ADDRESS,
                'company_contact': settings.COMPANY_CONTACT,
                'company_email': settings.COMPANY_EMAIL,
                'company_website': settings.COMPANY_WEBSITE,
                'retry_url': f'{settings.SITE_URL}/payments/{payment.id}/retry/',
            }
            
            # Render email
            html_content = render_to_string(
                'emails/payments/payment_failed.html',
                context
            )
            text_content = strip_tags(html_content)
            
            # Create email
            subject = f'Payment Failed - Action Required - {payment.payment_number}'
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [customer.email]
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=to_email
            )
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send(fail_silently=False)
            
            logger.info(
                f'Payment failed notification sent: {payment.payment_number} '
                f'to {customer.email}'
            )
            
            return {
                'success': True,
                'message': 'Payment failed notification email sent',
                'recipient': customer.email
            }
            
        except Exception as e:
            logger.error(
                f'Failed to send payment failed notification: {str(e)}',
                exc_info=True
            )
            return {
                'success': False,
                'error': str(e),
                'code': 'EMAIL_SEND_ERROR'
            }
```

### Email Configuration in Settings

```python
# settings.py

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@yourcompany.com'
EMAIL_HOST_PASSWORD = 'your-email-password'
DEFAULT_FROM_EMAIL = 'ABC Corporation <noreply@yourcompany.com>'

# For development, use console backend
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

### Expected Outcome
- PaymentEmailService for email sending
- Email rendering with templates
- PDF attachment support
- Email tracking
- Error handling

### Verification Checklist
- [ ] PaymentEmailService class created
- [ ] send_payment_confirmation() method
- [ ] send_receipt_email() with PDF attachment
- [ ] send_refund_notification() method
- [ ] send_payment_reminder() method
- [ ] send_payment_failed_notification() method
- [ ] Email rendering working
- [ ] PDF attachments working
- [ ] Email tracking implemented
- [ ] Error handling and logging

---

## Task 76: Set Up Async Email Tasks

### Overview
Create Celery tasks for sending emails asynchronously to avoid blocking payment processing and improve user experience.

### Dependencies
- Task 75: PaymentEmailService implemented
- Celery configured (from earlier SubPhase)

### Instructions

1. **Create Celery tasks for emails**
   - send_payment_confirmation_task
   - send_receipt_email_task
   - send_refund_notification_task
   - send_payment_reminder_task

2. **Integrate with payment workflow**
   - Trigger email tasks after payment events
   - Non-blocking execution

3. **Add retry logic**
   - Retry on failure
   - Max retries and exponential backoff

4. **Add email queue management**
   - Scheduled reminders
   - Bulk reminder sending

### Implementation

```python
# Create apps/payments/tasks/email_tasks.py

from celery import shared_task
from django.core.exceptions import ObjectDoesNotExist
import logging

from apps.payments.services.email_service import PaymentEmailService
from apps.payments.models import Payment, PaymentReceipt, Refund
from apps.invoices.models import Invoice

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=300  # 5 minutes
)
def send_payment_confirmation_task(self, payment_id):
    """
    Celery task to send payment confirmation email
    
    Args:
        payment_id: Payment ID
        
    Returns:
        dict: Task result
    """
    try:
        payment = Payment.objects.select_related('customer', 'invoice').get(id=payment_id)
        
        # Send email
        result = PaymentEmailService.send_payment_confirmation(payment)
        
        if not result['success']:
            # Retry on failure
            raise Exception(result.get('error', 'Email send failed'))
        
        logger.info(f'Payment confirmation task completed: {payment.payment_number}')
        return result
        
    except ObjectDoesNotExist:
        logger.error(f'Payment not found: {payment_id}')
        return {'success': False, 'error': 'Payment not found'}
        
    except Exception as e:
        logger.error(f'Payment confirmation task failed: {str(e)}', exc_info=True)
        
        # Retry task
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.error(f'Max retries exceeded for payment {payment_id}')
            return {'success': False, 'error': 'Max retries exceeded'}


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=300
)
def send_receipt_email_task(self, receipt_id):
    """
    Celery task to send receipt email with PDF
    
    Args:
        receipt_id: PaymentReceipt ID
        
    Returns:
        dict: Task result
    """
    try:
        receipt = PaymentReceipt.objects.select_related(
            'customer',
            'payment',
            'invoice'
        ).get(id=receipt_id)
        
        # Ensure PDF is generated
        if not receipt.has_pdf():
            from apps.payments.services.receipt_pdf_service import ReceiptPDFService
            ReceiptPDFService.generate_receipt_pdf(receipt)
        
        # Send email
        result = PaymentEmailService.send_receipt_email(receipt)
        
        if not result['success']:
            raise Exception(result.get('error', 'Email send failed'))
        
        logger.info(f'Receipt email task completed: {receipt.receipt_number}')
        return result
        
    except ObjectDoesNotExist:
        logger.error(f'Receipt not found: {receipt_id}')
        return {'success': False, 'error': 'Receipt not found'}
        
    except Exception as e:
        logger.error(f'Receipt email task failed: {str(e)}', exc_info=True)
        
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.error(f'Max retries exceeded for receipt {receipt_id}')
            return {'success': False, 'error': 'Max retries exceeded'}


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=300
)
def send_refund_notification_task(self, refund_id):
    """
    Celery task to send refund notification email
    
    Args:
        refund_id: Refund ID
        
    Returns:
        dict: Task result
    """
    try:
        refund = Refund.objects.select_related(
            'customer',
            'original_payment'
        ).get(id=refund_id)
        
        # Send email
        result = PaymentEmailService.send_refund_notification(refund)
        
        if not result['success']:
            raise Exception(result.get('error', 'Email send failed'))
        
        logger.info(f'Refund notification task completed: {refund.refund_number}')
        return result
        
    except ObjectDoesNotExist:
        logger.error(f'Refund not found: {refund_id}')
        return {'success': False, 'error': 'Refund not found'}
        
    except Exception as e:
        logger.error(f'Refund notification task failed: {str(e)}', exc_info=True)
        
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.error(f'Max retries exceeded for refund {refund_id}')
            return {'success': False, 'error': 'Max retries exceeded'}


@shared_task
def send_payment_reminder_task(invoice_id, days_overdue=0):
    """
    Celery task to send payment reminder email
    
    Args:
        invoice_id: Invoice ID
        days_overdue: Days overdue
        
    Returns:
        dict: Task result
    """
    try:
        invoice = Invoice.objects.select_related('customer').get(id=invoice_id)
        
        # Only send if invoice is unpaid
        if invoice.payment_status == 'PAID':
            logger.info(f'Invoice {invoice.invoice_number} already paid, skipping reminder')
            return {'success': True, 'message': 'Invoice already paid'}
        
        # Send email
        result = PaymentEmailService.send_payment_reminder(invoice, days_overdue)
        
        logger.info(f'Payment reminder task completed: {invoice.invoice_number}')
        return result
        
    except ObjectDoesNotExist:
        logger.error(f'Invoice not found: {invoice_id}')
        return {'success': False, 'error': 'Invoice not found'}
        
    except Exception as e:
        logger.error(f'Payment reminder task failed: {str(e)}', exc_info=True)
        return {'success': False, 'error': str(e)}


@shared_task
def send_bulk_payment_reminders():
    """
    Celery task to send payment reminders for all overdue invoices
    Scheduled to run daily
    
    Returns:
        dict: Task result with counts
    """
    from datetime import date
    from django.db.models import Q
    
    try:
        today = date.today()
        
        # Find overdue invoices
        overdue_invoices = Invoice.objects.select_related('customer').filter(
            Q(payment_status='UNPAID') | Q(payment_status='PARTIAL'),
            due_date__lt=today,
            customer__email__isnull=False
        )
        
        sent_count = 0
        failed_count = 0
        
        for invoice in overdue_invoices:
            days_overdue = (today - invoice.due_date).days
            
            # Send reminder
            result = PaymentEmailService.send_payment_reminder(invoice, days_overdue)
            
            if result['success']:
                sent_count += 1
            else:
                failed_count += 1
        
        logger.info(
            f'Bulk payment reminders completed: '
            f'{sent_count} sent, {failed_count} failed'
        )
        
        return {
            'success': True,
            'sent_count': sent_count,
            'failed_count': failed_count,
            'total_overdue': overdue_invoices.count()
        }
        
    except Exception as e:
        logger.error(f'Bulk payment reminders failed: {str(e)}', exc_info=True)
        return {'success': False, 'error': str(e)}
```

### Integration with Payment Workflow

```python
# Update apps/payments/services/payment_service.py

from apps.payments.tasks.email_tasks import (
    send_payment_confirmation_task,
    send_receipt_email_task
)


class PaymentService:
    
    @staticmethod
    def record_cash_payment(data):
        """Record cash payment"""
        # ... (payment creation code) ...
        
        payment.save()
        
        # Send confirmation email asynchronously
        send_payment_confirmation_task.delay(payment.id)
        
        # Auto-generate receipt
        from apps.payments.services.receipt_service import ReceiptService
        receipt_result = ReceiptService.generate_receipt(
            payment=payment,
            generate_pdf=True
        )
        
        if receipt_result['success']:
            receipt = receipt_result['receipt']
            # Send receipt email asynchronously
            send_receipt_email_task.delay(receipt.id)
        
        return {'success': True, 'payment': payment}


# Update apps/payments/services/refund_service.py

from apps.payments.tasks.email_tasks import send_refund_notification_task


class RefundService:
    
    @staticmethod
    def complete_refund(refund):
        """Complete refund processing"""
        # ... (refund completion code) ...
        
        refund.mark_completed()
        
        # Send refund notification asynchronously
        send_refund_notification_task.delay(refund.id)
        
        return {'success': True, 'refund': refund}
```

### Scheduled Tasks Configuration

```python
# celery.py or settings.py

from celery.schedules import crontab

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    'send-daily-payment-reminders': {
        'task': 'apps.payments.tasks.email_tasks.send_bulk_payment_reminders',
        'schedule': crontab(hour=9, minute=0),  # 9:00 AM daily
    },
}
```

### Celery Task Flow

```
Payment Created
     ↓
PaymentService.record_cash_payment()
     ↓
payment.save()
     ↓
send_payment_confirmation_task.delay(payment.id)  ← Async
     ↓
ReceiptService.generate_receipt()
     ↓
send_receipt_email_task.delay(receipt.id)  ← Async
     ↓
Payment workflow complete (non-blocking)


Background (Celery Worker):
     ↓
send_payment_confirmation_task executes
     ↓
PaymentEmailService.send_payment_confirmation()
     ↓
Email sent to customer


Background (Celery Worker):
     ↓
send_receipt_email_task executes
     ↓
PaymentEmailService.send_receipt_email()
     ↓
Receipt PDF attached and email sent
```

### Expected Outcome
- Celery tasks for async email sending
- Non-blocking payment workflow
- Retry logic for failed emails
- Scheduled bulk reminder sending

### Verification Checklist
- [ ] send_payment_confirmation_task created
- [ ] send_receipt_email_task created
- [ ] send_refund_notification_task created
- [ ] send_payment_reminder_task created
- [ ] send_bulk_payment_reminders task
- [ ] Tasks integrated with payment workflow
- [ ] Retry logic implemented
- [ ] Celery Beat schedule configured
- [ ] Email sending non-blocking

---

## Summary

This document completed email notification system for payment events:

1. ✅ **Email Templates** (Task 74): Professional HTML templates for all payment notifications
2. ✅ **Email Service** (Task 75): PaymentEmailService with email sending and tracking
3. ✅ **Async Email Tasks** (Task 76): Celery tasks for non-blocking email delivery

**Key Features Implemented:**
- Payment confirmation emails
- Receipt delivery with PDF attachments
- Refund notification emails
- Payment reminder emails (manual and scheduled)
- Payment failed notifications
- Responsive HTML email templates
- Async email sending with Celery
- Email retry logic
- Bulk reminder scheduling

**Group E Complete!** Payment receipts and notifications fully implemented with PDF generation and email delivery.

**Next Group:** [Group-F_Payment-API-Testing](../Group-F_Payment-API-Testing/00_GROUP_OVERVIEW.md) - Implement Payment API, comprehensive tests, and API documentation.
