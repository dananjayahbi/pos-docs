# Tasks 29-34: Notification Service, Templates & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** B - Stock Alert System  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-23-28_Lifecycle-Manager-Deduplication.md](02_Tasks-23-28_Lifecycle-Manager-Deduplication.md)
- **→ Next Group:** [../Group-C_Scheduled-Monitoring-Tasks/](../Group-C_Scheduled-Monitoring-Tasks/)

---

## Document Overview

This document covers the multi-channel notification system for alerts, including email, dashboard, and optional SMS delivery, notification templates, and admin interface for alert management.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create AlertNotificationService | High |
| 30 | Implement email alert | Medium |
| 31 | Implement dashboard notification | Medium |
| 32 | Implement SMS alert (optional) | Medium |
| 33 | Create alert templates | Medium |
| 34 | Create StockAlert admin | Medium |

---

## Task 29: Create AlertNotificationService

### Overview
Create a comprehensive service class to orchestrate multi-channel alert notifications, managing delivery across email, dashboard, SMS, and webhooks.

### Dependencies
- Group B, Task 19: StockAlert model
- Group A, Task 06: Global alert settings
- Phase-03: Celery for async tasks

### Instructions

1. **Create notification.py service file**
   - Create file in `apps/inventory/alerts/services/`
   - Name: `notification.py`

2. **Import required modules**
   - Import StockAlert, GlobalStockSettings
   - Import email utilities
   - Import async task decorators
   - Import notification models (if using)

3. **Define AlertNotificationService class**
   - No instance state (stateless service)
   - All methods can be static or class methods

4. **Add send_alert_notification method**
   - Parameters: alert (StockAlert instance)
   - Entry point for all notifications
   - Delegates to channel-specific methods

5. **Add should_send_notification method**
   - Check global settings for enabled channels
   - Check alert type configuration
   - Check throttling rules
   - Return dict of enabled channels

6. **Add get_recipients method**
   - Get email/SMS recipients from settings
   - Filter by user preferences
   - Return dict with channel recipients

7. **Add check_throttle method**
   - Check if alert was notified recently
   - Enforce throttle period from settings
   - Return True if should send

8. **Add mark_notified method**
   - Record notification timestamp
   - Track which channels used
   - Prevent duplicate notifications

9. **Add send_to_all_channels method**
   - Send to email if enabled
   - Send to dashboard if enabled
   - Send to SMS if enabled
   - Send to webhook if configured
   - Return results dict

10. **Add async task wrapper**
    - Celery task: send_alert_notification_async
    - Accept alert_id parameter
    - Call service synchronously

### Service Architecture
```
AlertNotificationService
         │
         ├─→ send_email_notification()
         ├─→ send_dashboard_notification()
         ├─→ send_sms_notification()
         └─→ send_webhook_notification()
```

### Service Implementation Structure
```python
class AlertNotificationService:
    """
    Multi-channel notification service for stock alerts.
    Handles email, dashboard, SMS, and webhook notifications.
    """
    
    @classmethod
    def send_alert_notification(cls, alert):
        """
        Send alert notification through all enabled channels.
        """
        # Check if should send
        if not cls.should_send_notification(alert):
            return
        
        # Get settings
        settings = alert.product.tenant.global_stock_settings
        
        # Send to enabled channels
        results = {}
        if settings.email_alerts_enabled:
            results['email'] = cls.send_email_notification(alert, settings)
        if settings.dashboard_alerts_enabled:
            results['dashboard'] = cls.send_dashboard_notification(alert)
        if settings.sms_alerts_enabled and alert.priority >= 3:
            results['sms'] = cls.send_sms_notification(alert, settings)
        if settings.webhook_url:
            results['webhook'] = cls.send_webhook_notification(alert, settings)
        
        # Mark as notified
        cls.mark_notified(alert, results)
        
        return results
    
    @classmethod
    def should_send_notification(cls, alert):
        """Check if notification should be sent."""
        # Check alert type is enabled
        settings = alert.product.tenant.global_stock_settings
        
        if alert.alert_type == 'low_stock' and not settings.alert_on_low_stock:
            return False
        if alert.alert_type == 'critical_stock' and not settings.alert_on_critical_stock:
            return False
        if alert.alert_type == 'out_of_stock' and not settings.alert_on_out_of_stock:
            return False
        if alert.alert_type == 'back_in_stock' and not settings.alert_on_back_in_stock:
            return False
        
        # Check throttling
        if not cls.check_throttle(alert):
            return False
        
        return True
    
    @classmethod
    def check_throttle(cls, alert):
        """Check if alert is within throttle period."""
        from django.utils import timezone
        from datetime import timedelta
        
        settings = alert.product.tenant.global_stock_settings
        throttle_hours = settings.alert_throttle_hours
        
        # Check if same alert notified recently
        cutoff = timezone.now() - timedelta(hours=throttle_hours)
        
        # Implementation: Track notifications in separate model or alert field
        return True  # Placeholder
```

### Notification Channel Decision Matrix

| Alert Type | Priority | Email | Dashboard | SMS | Webhook |
|------------|----------|-------|-----------|-----|---------|
| LOW_STOCK | 2 | ✓ | ✓ | ✗ | ✓ |
| CRITICAL_STOCK | 3 | ✓ | ✓ | ✓ | ✓ |
| OUT_OF_STOCK | 4 | ✓ | ✓ | ✓ | ✓ |
| BACK_IN_STOCK | 1 | ✓ | ✓ | ✗ | ✓ |

### Async Task Wrapper
```python
from celery import shared_task

@shared_task
def send_alert_notification_async(alert_id):
    """Async task to send alert notifications."""
    try:
        alert = StockAlert.objects.get(id=alert_id)
        AlertNotificationService.send_alert_notification(alert)
    except StockAlert.DoesNotExist:
        logger.error(f"Alert {alert_id} not found for notification")
```

### Notification Tracking
- Add NotificationLog model (optional)
- Track: alert, channel, sent_at, success, error_message
- Used for audit and troubleshooting

### Expected Outcome
```
apps/inventory/alerts/services/
├── __init__.py
├── config_resolver.py
└── notification.py           # AlertNotificationService
```

### Verification Checklist
- [ ] AlertNotificationService class created
- [ ] send_alert_notification orchestrates channels
- [ ] should_send_notification checks settings
- [ ] check_throttle prevents spam
- [ ] mark_notified tracks delivery
- [ ] Async task wrapper created
- [ ] Channel-specific methods stubbed
- [ ] Settings integration works

---

## Task 30: Implement Email Alert

### Overview
Implement email notification delivery for stock alerts with HTML templates and Sri Lankan localization.

### Dependencies
- Task 29: Create AlertNotificationService
- Phase-03: Email backend configuration

### Instructions

1. **Add send_email_notification method**
   - Parameters: alert, settings
   - Build email context
   - Render template
   - Send via Django email backend

2. **Add get_email_recipients method**
   - Parse email_recipients from settings
   - Split comma-separated list
   - Validate email addresses
   - Return list of valid emails

3. **Add build_email_context method**
   - Product information
   - Alert details (type, priority, stock level)
   - Warehouse information
   - Threshold information
   - Action buttons (acknowledge, view)

4. **Add get_email_subject method**
   - Generate subject based on alert type
   - Include product name
   - Include priority indicator

5. **Add send_email_html method**
   - Render HTML template
   - Render plaintext fallback
   - Attach any necessary data
   - Send using Django send_mail

6. **Add email retry logic**
   - Retry on transient failures
   - Max retry attempts: 3
   - Exponential backoff
   - Log failures

7. **Add email queue management**
   - Use Celery for async sending
   - Batch multiple alerts if needed
   - Rate limiting for email provider

8. **Add Sri Lankan localization**
   - Support Sinhala subject lines (optional)
   - LKR currency formatting
   - Asia/Colombo timestamps
   - Local contact information

### Email Notification Implementation
```python
@classmethod
def send_email_notification(cls, alert, settings):
    """Send email notification for alert."""
    recipients = cls.get_email_recipients(settings)
    if not recipients:
        return {'success': False, 'reason': 'No recipients'}
    
    subject = cls.get_email_subject(alert)
    context = cls.build_email_context(alert)
    
    try:
        send_mail(
            subject=subject,
            message=cls.render_plaintext(context),
            html_message=cls.render_html_email(alert, context),
            from_email=settings.EMAIL_FROM_ADDRESS,
            recipient_list=recipients,
            fail_silently=False
        )
        return {'success': True, 'recipients': len(recipients)}
    except Exception as e:
        logger.error(f"Email notification failed: {e}")
        return {'success': False, 'error': str(e)}

@classmethod
def get_email_subject(cls, alert):
    """Generate email subject line."""
    subjects = {
        'low_stock': f"⚠️ Low Stock Alert: {alert.product.name}",
        'critical_stock': f"🔴 CRITICAL: {alert.product.name}",
        'out_of_stock': f"❌ OUT OF STOCK: {alert.product.name}",
        'back_in_stock': f"✅ Back in Stock: {alert.product.name}"
    }
    return subjects.get(alert.alert_type, f"Stock Alert: {alert.product.name}")

@classmethod
def build_email_context(cls, alert):
    """Build email template context."""
    return {
        'alert': alert,
        'product': alert.product,
        'warehouse': alert.warehouse,
        'stock_level': alert.current_stock,
        'threshold': alert.threshold_value,
        'priority': alert.get_priority_display(),
        'alert_type': alert.get_alert_type_display(),
        'created_at': alert.created_at,
        'view_url': cls.get_alert_view_url(alert),
        'acknowledge_url': cls.get_acknowledge_url(alert),
    }
```

### Email Subject Templates

| Alert Type | Subject Line |
|------------|--------------|
| LOW_STOCK | ⚠️ Low Stock Alert: Coffee Beans |
| CRITICAL_STOCK | 🔴 CRITICAL: Laptop - 15" |
| OUT_OF_STOCK | ❌ OUT OF STOCK: Premium Tea |
| BACK_IN_STOCK | ✅ Back in Stock: Wireless Mouse |

### Email Content Structure
```
Subject: ⚠️ Low Stock Alert: Coffee Beans - Premium Blend

Dear Manager,

This is an automated notification regarding low stock levels:

Product: Coffee Beans - Premium Blend
Current Stock: 8 units
Threshold: 20 units
Warehouse: Colombo Main Warehouse
Priority: Medium

This product has dropped below the configured low stock threshold.
Please review and consider reordering.

[View Alert] [Acknowledge] [Reorder Now]

---
Sent by LankaCommerce Cloud
Date: 2024-01-15 10:30 AM (Asia/Colombo)
```

### Email Template Variables
- `{{ alert.product.name }}`
- `{{ alert.current_stock }}`
- `{{ alert.threshold_value }}`
- `{{ alert.warehouse.name }}`
- `{{ alert.get_priority_display }}`
- `{{ view_url }}`
- `{{ acknowledge_url }}`

### Sri Lankan Email Customization
- Use .lk domain from address
- Include phone number in +94 format
- Timestamps in Asia/Colombo timezone
- Currency amounts in LKR with ₨ symbol
- Optional Sinhala translations

### Expected Outcome
- Email notifications sent successfully
- HTML and plaintext versions
- Proper Sri Lankan formatting
- Action links for quick response

### Verification Checklist
- [ ] send_email_notification implemented
- [ ] Email recipients parsed correctly
- [ ] Email context complete
- [ ] Subject lines appropriate
- [ ] HTML template rendering works
- [ ] Plaintext fallback included
- [ ] Retry logic for failures
- [ ] Sri Lankan localization applied

---

## Task 31: Implement Dashboard Notification

### Overview
Implement in-app dashboard notification system for real-time alert visibility within the admin interface.

### Dependencies
- Task 29: Create AlertNotificationService
- Phase-03: Notification system (if exists) or custom implementation

### Instructions

1. **Add send_dashboard_notification method**
   - Parameters: alert
   - Create notification record
   - Target relevant users
   - Set notification level

2. **Add get_dashboard_recipients method**
   - Get users with alert permissions
   - Filter by warehouse assignment
   - Filter by role (managers, inventory staff)

3. **Add create_notification_record method**
   - Create Notification model instance
   - Link to alert
   - Set read status to unread
   - Set expiration if applicable

4. **Add notification priority mapping**
   - Map alert priority to notification level
   - Critical → Error
   - High → Warning
   - Medium → Info

5. **Add notification icon and color**
   - Set icon based on alert type
   - Set color based on priority
   - Return style configuration

6. **Add notification actions**
   - Quick acknowledge button
   - View details link
   - Snooze option

7. **Add badge counter update**
   - Update unread count for users
   - Use cache for performance
   - Real-time updates via websockets (optional)

8. **Add notification expiration**
   - Auto-expire after resolved
   - Auto-expire after X days
   - Cleanup old notifications

### Dashboard Notification Implementation
```python
@classmethod
def send_dashboard_notification(cls, alert):
    """Create dashboard notification for alert."""
    recipients = cls.get_dashboard_recipients(alert)
    
    notification_data = {
        'title': cls.get_notification_title(alert),
        'message': cls.get_notification_message(alert),
        'level': cls.get_notification_level(alert),
        'icon': cls.get_notification_icon(alert),
        'color': cls.get_notification_color(alert),
        'link': cls.get_alert_view_url(alert),
        'actions': cls.get_notification_actions(alert),
    }
    
    notifications_created = 0
    for user in recipients:
        Notification.objects.create(
            user=user,
            notification_type='stock_alert',
            title=notification_data['title'],
            message=notification_data['message'],
            level=notification_data['level'],
            link=notification_data['link'],
            metadata=json.dumps({
                'alert_id': alert.id,
                'product_id': alert.product.id,
                'alert_type': alert.alert_type,
            })
        )
        notifications_created += 1
    
    return {'success': True, 'count': notifications_created}

@classmethod
def get_dashboard_recipients(cls, alert):
    """Get users who should receive dashboard notification."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Get users with permission
    users = User.objects.filter(
        is_active=True,
        user_permissions__codename='view_alert_dashboard'
    )
    
    # Filter by warehouse if specified
    if alert.warehouse:
        users = users.filter(
            warehouse_assignments__warehouse=alert.warehouse
        )
    
    return users.distinct()
```

### Notification Levels

| Alert Priority | Notification Level | Color | Icon |
|----------------|-------------------|-------|------|
| 4 (Critical) | ERROR | Red | alert-octagon |
| 3 (High) | WARNING | Orange | alert-triangle |
| 2 (Medium) | INFO | Yellow | alert-circle |
| 1 (Info) | SUCCESS | Green | check-circle |

### Notification Display Format
```
┌─────────────────────────────────────────┐
│ 🔴 OUT OF STOCK                         │
│ Coffee Beans - Premium Blend            │
│ Colombo Main Warehouse                  │
│ 2 hours ago                             │
│ [Acknowledge] [View Details]            │
└─────────────────────────────────────────┘
```

### Notification Actions
```python
def get_notification_actions(alert):
    """Get available actions for notification."""
    actions = []
    
    if alert.status == ALERT_STATUS_ACTIVE:
        actions.append({
            'label': 'Acknowledge',
            'action': 'acknowledge',
            'url': f'/api/alerts/{alert.id}/acknowledge/',
            'method': 'POST'
        })
    
    actions.append({
        'label': 'View Details',
        'action': 'view',
        'url': f'/admin/inventory/stockalert/{alert.id}/',
        'method': 'GET'
    })
    
    return actions
```

### Real-Time Updates (Optional)
- WebSocket connection for live notifications
- Push notification to browser
- Update badge count without refresh
- Notification toast on new alert

### Expected Outcome
- Dashboard notifications created
- Visible to relevant users
- Quick action buttons
- Real-time updates (optional)

### Verification Checklist
- [ ] send_dashboard_notification implemented
- [ ] Recipients filtered correctly
- [ ] Notification records created
- [ ] Priority mapped to levels
- [ ] Icons and colors assigned
- [ ] Action buttons functional
- [ ] Badge counter updates
- [ ] Expiration handled

---

## Task 32: Implement SMS Alert (Optional)

### Overview
Implement optional SMS notification delivery for critical alerts using Sri Lankan SMS gateway providers.

### Dependencies
- Task 29: Create AlertNotificationService
- SMS gateway integration (Dialog, Mobitel, or third-party)

### Instructions

1. **Add send_sms_notification method**
   - Parameters: alert, settings
   - Only for critical/out-of-stock alerts
   - Get SMS recipients
   - Format SMS message
   - Send via gateway

2. **Add get_sms_recipients method**
   - Parse sms_recipients from settings
   - Split comma-separated list
   - Validate phone numbers (+94 format)
   - Return list of valid numbers

3. **Add format_sms_message method**
   - Keep under 160 characters
   - Essential information only
   - Product name, alert type, stock level
   - No special characters

4. **Add validate_phone_number method**
   - Check +94 format
   - Validate Sri Lankan mobile format
   - Return cleaned number

5. **Add SMS gateway integration**
   - Support Dialog SMS gateway
   - Support Mobitel gateway
   - Support Twilio (international)
   - Configurable provider selection

6. **Add SMS sending logic**
   - Build gateway API request
   - Handle authentication
   - Send POST request
   - Parse response

7. **Add SMS rate limiting**
   - Limit SMS per hour/day
   - Prevent cost overruns
   - Queue if limit exceeded

8. **Add SMS delivery tracking**
   - Track sent SMS count
   - Track delivery status
   - Log failures
   - Cost tracking

9. **Add SMS retry logic**
   - Retry on gateway failures
   - Max 2 retry attempts
   - Log persistent failures

### SMS Notification Implementation
```python
@classmethod
def send_sms_notification(cls, alert, settings):
    """Send SMS for critical alerts."""
    # Only send for critical alerts
    if alert.priority < 3:
        return {'success': False, 'reason': 'Priority too low for SMS'}
    
    recipients = cls.get_sms_recipients(settings)
    if not recipients:
        return {'success': False, 'reason': 'No SMS recipients'}
    
    message = cls.format_sms_message(alert)
    
    try:
        results = []
        for phone in recipients:
            result = cls.send_via_gateway(phone, message)
            results.append(result)
        
        return {
            'success': True,
            'sent': len([r for r in results if r['success']]),
            'failed': len([r for r in results if not r['success']])
        }
    except Exception as e:
        logger.error(f"SMS notification failed: {e}")
        return {'success': False, 'error': str(e)}

@classmethod
def format_sms_message(cls, alert):
    """Format SMS message (max 160 chars)."""
    templates = {
        'critical_stock': "CRITICAL: {product} at {stock} units. Reorder urgently.",
        'out_of_stock': "OUT OF STOCK: {product}. Please restock immediately.",
    }
    
    template = templates.get(alert.alert_type, "Stock Alert: {product}")
    message = template.format(
        product=alert.product.name[:30],  # Truncate if needed
        stock=alert.current_stock
    )
    
    return message[:160]  # Ensure limit

@classmethod
def validate_phone_number(cls, phone):
    """Validate and clean Sri Lankan phone number."""
    import re
    
    # Remove spaces, dashes
    phone = re.sub(r'[\s\-]', '', phone)
    
    # Add +94 if missing
    if phone.startswith('0'):
        phone = '+94' + phone[1:]
    elif not phone.startswith('+94'):
        phone = '+94' + phone
    
    # Validate format: +94 XX XXX XXXX
    pattern = r'^\+94\d{9}$'
    if re.match(pattern, phone):
        return phone
    
    return None

@classmethod
def send_via_gateway(cls, phone, message):
    """Send SMS via configured gateway."""
    gateway_provider = settings.SMS_GATEWAY_PROVIDER
    
    if gateway_provider == 'dialog':
        return cls.send_via_dialog(phone, message)
    elif gateway_provider == 'mobitel':
        return cls.send_via_mobitel(phone, message)
    elif gateway_provider == 'twilio':
        return cls.send_via_twilio(phone, message)
    else:
        raise ValueError(f"Unsupported gateway: {gateway_provider}")
```

### Sri Lankan SMS Gateway Options

| Provider | Coverage | API | Cost |
|----------|----------|-----|------|
| **Dialog SMS Gateway** | Dialog network | REST API | ~LKR 0.25/SMS |
| **Mobitel SMS Gateway** | Mobitel network | HTTP API | ~LKR 0.30/SMS |
| **Twilio** | All networks | REST API | ~LKR 8/SMS |

### SMS Message Examples
```
CRITICAL: Coffee Beans at 3 units. Reorder urgently.
(51 characters)

OUT OF STOCK: Laptop 15" Dell. Please restock immediately.
(57 characters)
```

### SMS Rate Limiting
```python
class SMSRateLimiter:
    """Rate limit SMS sending."""
    
    @staticmethod
    def check_limit(tenant):
        """Check if tenant can send SMS."""
        from django.core.cache import cache
        
        key = f"sms_count:{tenant.id}:{date.today()}"
        count = cache.get(key, 0)
        
        daily_limit = 100  # Configurable
        
        if count >= daily_limit:
            return False
        
        cache.set(key, count + 1, 86400)  # 24 hours
        return True
```

### SMS Cost Tracking
- Track SMS sent per tenant
- Calculate monthly costs
- Alert on high usage
- Display in admin dashboard

### Expected Outcome
- SMS notifications for critical alerts
- Sri Lankan gateway integration
- Phone number validation
- Rate limiting and cost control

### Verification Checklist
- [ ] send_sms_notification implemented
- [ ] SMS recipients validated
- [ ] Message formatting under 160 chars
- [ ] Phone number validation works
- [ ] Gateway integration configured
- [ ] Rate limiting enforced
- [ ] Delivery tracking implemented
- [ ] Cost tracking enabled

---

## Task 33: Create Alert Templates

### Overview
Create HTML email templates and notification templates for all alert types with professional design and Sri Lankan localization.

### Dependencies
- Task 30: Implement email alert

### Instructions

1. **Create templates directory structure**
   - Create `apps/inventory/alerts/templates/alerts/emails/`
   - Organize by alert type

2. **Create base email template**
   - Name: `base_alert_email.html`
   - Header with logo
   - Footer with company info
   - Responsive design
   - Consistent styling

3. **Create low_stock_alert.html template**
   - Extends base template
   - Yellow/warning color scheme
   - Display product info, stock level, threshold
   - Action buttons (View, Acknowledge, Reorder)

4. **Create critical_stock_alert.html template**
   - Extends base template
   - Orange/danger color scheme
   - Urgent messaging
   - Prominent action buttons

5. **Create out_of_stock_alert.html template**
   - Extends base template
   - Red/critical color scheme
   - Immediate action required message
   - Reorder button prominent

6. **Create back_in_stock_alert.html template**
   - Extends base template
   - Green/success color scheme
   - Positive messaging
   - View stock button

7. **Create plaintext versions**
   - One for each alert type
   - Same content, text-only format
   - Proper formatting for readability

8. **Add template context helpers**
   - Template tags for formatting
   - Filters for dates, currency
   - Reusable components

9. **Add Sinhala language support (optional)**
   - Bilingual templates
   - Sinhala product names
   - Localized messages

10. **Add template preview/testing**
    - Admin action to preview templates
    - Test email sending
    - Verify rendering

### Email Template Structure
```html
<!-- base_alert_email.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Alert - {{ alert.product.name }}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; }
        .content { padding: 20px; background: #f8f9fa; }
        .alert-box { border-left: 4px solid {{ alert_color }}; padding: 15px; }
        .button { background: {{ alert_color }}; color: white; padding: 10px 20px; }
        .footer { text-align: center; padding: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{% block title %}Stock Alert{% endblock %}</h1>
        </div>
        <div class="content">
            {% block content %}{% endblock %}
        </div>
        <div class="footer">
            <p>LankaCommerce Cloud - {{ tenant.name }}</p>
            <p>This is an automated notification. Do not reply.</p>
        </div>
    </div>
</body>
</html>
```

### Low Stock Alert Template
```html
<!-- low_stock_alert.html -->
{% extends "alerts/emails/base_alert_email.html" %}

{% block title %}⚠️ Low Stock Alert{% endblock %}

{% block content %}
<div class="alert-box" style="border-color: #FFC107;">
    <h2>Low Stock Warning</h2>
    <p>The following product is running low on stock:</p>
    
    <table>
        <tr>
            <td><strong>Product:</strong></td>
            <td>{{ alert.product.name }}</td>
        </tr>
        <tr>
            <td><strong>Current Stock:</strong></td>
            <td>{{ alert.current_stock }} units</td>
        </tr>
        <tr>
            <td><strong>Low Stock Threshold:</strong></td>
            <td>{{ alert.threshold_value }} units</td>
        </tr>
        <tr>
            <td><strong>Warehouse:</strong></td>
            <td>{{ alert.warehouse.name|default:"All Warehouses" }}</td>
        </tr>
    </table>
    
    <p><strong>Action Required:</strong> Please review and consider reordering this product.</p>
    
    <div style="margin-top: 20px;">
        <a href="{{ view_url }}" class="button" style="background: #FFC107;">
            View Alert Details
        </a>
        <a href="{{ acknowledge_url }}" class="button" style="background: #2196F3;">
            Acknowledge
        </a>
        <a href="{{ reorder_url }}" class="button" style="background: #4CAF50;">
            Create Reorder
        </a>
    </div>
</div>
{% endblock %}
```

### Template Color Schemes

| Alert Type | Primary Color | Background | Button |
|------------|---------------|------------|--------|
| LOW_STOCK | #FFC107 (Yellow) | #FFF9E6 | #FFA000 |
| CRITICAL_STOCK | #FF9800 (Orange) | #FFF3E0 | #F57C00 |
| OUT_OF_STOCK | #F44336 (Red) | #FFEBEE | #D32F2F |
| BACK_IN_STOCK | #4CAF50 (Green) | #E8F5E9 | #388E3C |

### Plaintext Template Example
```
STOCK ALERT: Low Stock Warning
================================

The following product is running low on stock:

Product: {{ alert.product.name }}
Current Stock: {{ alert.current_stock }} units
Low Stock Threshold: {{ alert.threshold_value }} units
Warehouse: {{ alert.warehouse.name|default:"All Warehouses" }}

Action Required: Please review and consider reordering this product.

View Alert: {{ view_url }}
Acknowledge: {{ acknowledge_url }}
Create Reorder: {{ reorder_url }}

---
LankaCommerce Cloud - {{ tenant.name }}
This is an automated notification.
```

### Template Directory Structure
```
apps/inventory/alerts/templates/alerts/
├── emails/
│   ├── base_alert_email.html
│   ├── low_stock_alert.html
│   ├── critical_stock_alert.html
│   ├── out_of_stock_alert.html
│   ├── back_in_stock_alert.html
│   └── plaintext/
│       ├── low_stock_alert.txt
│       ├── critical_stock_alert.txt
│       ├── out_of_stock_alert.txt
│       └── back_in_stock_alert.txt
└── notifications/
    └── dashboard_notification.html
```

### Expected Outcome
- Professional email templates
- Consistent branding
- Responsive design
- Plaintext fallbacks
- Easy to customize

### Verification Checklist
- [ ] Template directory structure created
- [ ] Base template with layout
- [ ] All 4 alert type templates
- [ ] Plaintext versions created
- [ ] Color schemes applied
- [ ] Action buttons functional
- [ ] Responsive design
- [ ] Preview/testing available

---

## Task 34: Create StockAlert Admin

### Overview
Create comprehensive Django admin interface for StockAlert model with filters, actions, and management capabilities.

### Dependencies
- Group B, Tasks 19-28: Complete StockAlert model
- Task 33: Alert templates

### Instructions

1. **Create StockAlertAdmin class**
   - Register with admin.site
   - Configure list display, filters, actions

2. **Configure list display**
   - alert_type with icon
   - product name (linked)
   - warehouse name
   - current_stock with color coding
   - threshold_value
   - status with badge
   - priority
   - created_at (relative time)
   - acknowledged_by
   - Action column (buttons)

3. **Add list filters**
   - status
   - alert_type
   - priority
   - warehouse
   - product__category
   - created_at (date hierarchy)
   - acknowledged (yes/no)
   - resolved (yes/no)

4. **Add search fields**
   - product__name
   - product__sku
   - warehouse__name
   - message

5. **Configure fieldsets**
   - Alert Information: type, status, priority
   - Product Details: product, variant, warehouse
   - Stock Information: current_stock, threshold, velocity
   - Lifecycle: created, acknowledged, resolved
   - Snooze: snoozed_until, snooze_reason

6. **Add readonly fields**
   - created_at, updated_at
   - current_stock, threshold_value
   - acknowledged_at, acknowledged_by
   - resolved_at, resolved_by
   - deduplication_key

7. **Add bulk actions**
   - Acknowledge selected alerts
   - Resolve selected alerts
   - Snooze for 24 hours
   - Send test notification
   - Export to CSV

8. **Add custom admin actions**
   - View inheritance chain (link to config)
   - View product stock history
   - Create reorder suggestion
   - Mark as false positive

9. **Add inline actions**
   - Quick acknowledge button
   - Quick resolve button
   - Quick snooze dropdown

10. **Add admin methods for display**
    - colored_status: Show status with badge
    - alert_type_icon: Show icon
    - stock_indicator: Color-coded stock level
    - time_since_created: Relative time

11. **Add change form customization**
    - Show alert history timeline
    - Display effective config
    - Show notification log
    - Related alerts section

12. **Add dashboard widget**
    - Show active alert count
    - Show critical alerts
    - Show unacknowledged alerts
    - Quick links

### Admin List Display Implementation
```python
@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    """Admin interface for stock alerts."""
    
    list_display = [
        'alert_type_icon',
        'product_link',
        'warehouse_name',
        'stock_indicator',
        'threshold_value',
        'colored_status',
        'priority_display',
        'time_since_created',
        'acknowledger_display',
        'action_buttons',
    ]
    
    list_filter = [
        'status',
        'alert_type',
        'priority',
        'warehouse',
        ('created_at', admin.DateFieldListFilter),
        'product__category',
    ]
    
    search_fields = [
        'product__name',
        'product__sku',
        'warehouse__name',
        'message',
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'acknowledged_at',
        'resolved_at',
        'deduplication_key',
        'stock_change_since_alert',
        'has_stock_improved',
    ]
    
    fieldsets = (
        ('Alert Information', {
            'fields': ('alert_type', 'status', 'priority', 'message')
        }),
        ('Product & Location', {
            'fields': ('product', 'variant', 'warehouse')
        }),
        ('Stock Details', {
            'fields': (
                'current_stock',
                'threshold_value',
                'available_quantity',
                'stock_change_since_alert',
            )
        }),
        ('Lifecycle', {
            'fields': (
                'created_at',
                'acknowledged_at',
                'acknowledged_by',
                'resolved_at',
                'resolved_by',
            )
        }),
        ('Snooze', {
            'fields': ('snoozed_until', 'snoozed_by', 'snooze_reason'),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'acknowledge_alerts',
        'resolve_alerts',
        'snooze_24_hours',
        'send_test_notification',
    ]
    
    def alert_type_icon(self, obj):
        """Display icon for alert type."""
        icons = {
            'low_stock': '🟡',
            'critical_stock': '🟠',
            'out_of_stock': '🔴',
            'back_in_stock': '🟢',
        }
        return icons.get(obj.alert_type, '⚪')
    alert_type_icon.short_description = 'Type'
    
    def colored_status(self, obj):
        """Display status with color badge."""
        colors = {
            'active': 'red',
            'acknowledged': 'blue',
            'resolved': 'green',
            'snoozed': 'gray',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    colored_status.short_description = 'Status'
    
    @admin.action(description='Acknowledge selected alerts')
    def acknowledge_alerts(self, request, queryset):
        """Bulk acknowledge alerts."""
        count = 0
        for alert in queryset:
            alert.acknowledge(request.user)
            count += 1
        self.message_user(request, f'Acknowledged {count} alerts.')
```

### Admin Display Features

**Color-Coded Stock Levels:**
- Green: Above threshold
- Yellow: At threshold
- Orange: Below threshold
- Red: Critical/OOS

**Status Badges:**
- ACTIVE: Red badge
- ACKNOWLEDGED: Blue badge
- RESOLVED: Green badge
- SNOOZED: Gray badge

**Action Buttons:**
- Quick Acknowledge (✓)
- Quick Resolve (✓✓)
- Snooze (💤)
- View Details (👁)

### Expected Outcome
```
apps/inventory/alerts/
└── admin.py                  # StockAlertAdmin registered
```

### Verification Checklist
- [ ] StockAlertAdmin registered
- [ ] List display with icons/colors
- [ ] All filters working
- [ ] Search functional
- [ ] Fieldsets organized
- [ ] Bulk actions implemented
- [ ] Custom display methods
- [ ] Action buttons functional
- [ ] Query optimization
- [ ] Dashboard widget added
