# Tasks 69-74: SMSLog Model

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** E - Delivery Reports  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-D_Notification-Service/02_Tasks-65-68_Integration-Testing.md](../Group-D_Notification-Service/02_Tasks-65-68_Integration-Testing.md)
- **→ Next Document:** [02_Tasks-75-78_Webhook-Analytics-Verify.md](02_Tasks-75-78_Webhook-Analytics-Verify.md)

---

## Document Overview

This document covers the creation of the SMSLog model for tracking all sent SMS messages with comprehensive delivery reporting capabilities. The model captures message identifiers from provider responses, recipient details, delivery status, provider used, and per-message costs. This enables complete SMS delivery tracking, cost management, and usage analytics for Sri Lankan SMS operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create SMSLog Model | Medium | 45 min |
| 70 | Create message_id Field | Low | 15 min |
| 71 | Create recipient Field | Low | 20 min |
| 72 | Create status Field | Low | 20 min |
| 73 | Create provider Field | Low | 15 min |
| 74 | Create cost Field | Low | 20 min |

---

## Task 69: Create SMSLog Model

### Overview
Create the SMSLog model as the foundation for tracking all outbound SMS messages. This model maintains a complete audit trail of SMS communications, including provider message IDs, delivery status, and cost tracking. The model includes optimized database indexes on message_id, recipient, and status fields to support efficient querying for delivery reports and analytics.

### Dependencies
- Task 68: Integration Testing (from Group D) must be complete
- Django models infrastructure is established
- Multi-tenancy setup is functional
- SMS providers are configured

### Instructions

1. **Navigate to sms app models directory**
   - Go to `backend/apps/sms/models/` directory
   - This is where SMS-related models are defined
   - Ensure the `__init__.py` imports the new model

2. **Create sms_log.py module**
   - Create new file named `sms_log.py`
   - This will contain the SMSLog model
   - Use consistent naming with other app models

3. **Import required dependencies**
   - Import Django models and fields
   - Import timezone utilities for timestamps
   - Import tenant models if using django-tenants
   - Import User model for foreign key relationships

4. **Define SMSLog model class**
   - Create class `SMSLog` inheriting from appropriate base model
   - If multi-tenant, inherit from tenant-aware base model
   - If shared across tenants, use public schema model
   - Include proper `Meta` class configuration

5. **Add core tracking fields**
   - message_id: Store provider's unique message identifier
   - recipient: Store recipient phone number in international format
   - status: Track current delivery status (choices)
   - provider: Identify which SMS provider was used
   - cost: Track cost per message in LKR

6. **Add contextual fields**
   - message_content: Store the actual SMS text (TextField)
   - sent_at: Timestamp when SMS was sent (DateTimeField)
   - delivered_at: Timestamp when delivery confirmed (nullable)
   - failed_at: Timestamp when delivery failed (nullable)
   - error_message: Store error details if failed (nullable)

7. **Add relationship fields**
   - tenant: ForeignKey to tenant model (if multi-tenant)
   - user: ForeignKey to User who triggered the SMS (nullable)
   - otp: ForeignKey to OTP model if SMS was for OTP (nullable)
   - notification: ForeignKey to notification if part of notification system

8. **Configure database indexes**
   - Index on `message_id` for provider callback lookups
   - Index on `recipient` for user-specific SMS history
   - Index on `status` for status-based queries
   - Composite index on `(tenant, created_at)` for analytics
   - Index on `sent_at` for time-based reports

9. **Add model metadata**
   - Set `verbose_name` to "SMS Log"
   - Set `verbose_name_plural` to "SMS Logs"
   - Configure `ordering` by `-created_at` (newest first)
   - Set `db_table` to appropriate table name

10. **Implement model methods**
    - `__str__`: Return meaningful string representation
    - `is_delivered`: Property to check if SMS was delivered
    - `is_failed`: Property to check if SMS failed
    - `mark_delivered`: Method to update status to delivered
    - `mark_failed`: Method to update status to failed with error

11. **Add utility methods**
    - `get_delivery_duration`: Calculate time from sent to delivered
    - `get_status_display_color`: Return color code for UI status badges
    - `can_retry`: Check if failed SMS can be retried

12. **Register model in __init__.py**
    - Import SMSLog in models `__init__.py`
    - Export in `__all__` list for proper module exposure

### Model Purpose

| Feature | Purpose |
|---------|---------|
| Audit Trail | Complete history of all SMS communications |
| Delivery Tracking | Monitor delivery status of each message |
| Cost Management | Track per-message costs for billing |
| Provider Analytics | Compare provider performance |
| Compliance | Maintain records for regulatory requirements |
| Debugging | Troubleshoot delivery issues with detailed logs |

### Database Indexing Strategy

```
┌──────────────────────────────────────────────┐
│              SMSLog Indexes                  │
├──────────────────────────────────────────────┤
│                                              │
│  idx_message_id:  Fast provider callbacks   │
│  idx_recipient:   User SMS history          │
│  idx_status:      Status filtering          │
│  idx_tenant_date: Analytics queries         │
│  idx_sent_at:     Time-based reports        │
│                                              │
└──────────────────────────────────────────────┘
```

### Model Relationships

```
         User                    Tenant
           │                        │
           │                        │
           ▼                        ▼
      ┌─────────────────────────────────┐
      │         SMSLog Model            │
      │                                 │
      │  - message_id (indexed)         │
      │  - recipient (indexed)          │
      │  - status (indexed)             │
      │  - provider                     │
      │  - cost                         │
      │  - message_content              │
      │  - timestamps                   │
      └─────────────────────────────────┘
           │                        │
           │                        │
           ▼                        ▼
         OTP                  Notification
```

### Expected Outcome
- SMSLog model created with all required fields
- Database indexes configured for optimal performance
- Model methods implemented for common operations
- Proper relationships with User, Tenant, OTP models
- Model registered and importable

### Verification Checklist
- [ ] SMSLog model class created in `sms_log.py`
- [ ] All fields defined with proper types and constraints
- [ ] Database indexes configured on message_id, recipient, status
- [ ] Model methods implemented (__str__, is_delivered, is_failed)
- [ ] Proper Meta configuration (verbose_name, ordering, db_table)
- [ ] Foreign key relationships established
- [ ] Model registered in `__init__.py`
- [ ] Ready for makemigrations command

---

## Task 70: Create message_id Field

### Overview
Create the message_id field to store the unique identifier returned by SMS providers after successful message submission. This field is critical for tracking delivery reports (DLR) and correlating provider callbacks with logged messages. The field supports provider-specific identifier formats from Dialog, Notify.lk, and TextIt.

### Dependencies
- Task 69: Create SMSLog Model

### Instructions

1. **Define message_id field structure**
   - Use `CharField` for string-based identifiers
   - Set `max_length=100` to accommodate various provider formats
   - Make field required (`null=False`, `blank=False`)
   - Add `db_index=True` for fast provider callback lookups

2. **Add field documentation**
   - Include `help_text` explaining the field purpose
   - Document that this ID comes from provider API response
   - Note that format varies by provider

3. **Configure field uniqueness**
   - Consider adding `unique=True` if message IDs are globally unique
   - If IDs might overlap across providers, use composite unique constraint
   - Add constraint: `unique_together = [('message_id', 'provider')]`

4. **Add field validation**
   - Create validator to ensure non-empty strings
   - Validate format if providers have consistent patterns
   - Add validator to strip whitespace

5. **Provider-specific considerations**
   - Dialog: Typically numeric string IDs
   - Notify.lk: Alphanumeric IDs with possible hyphens
   - TextIt: UUID format identifiers
   - Ensure field length accommodates all formats

6. **Add indexing for callbacks**
   - Primary index on message_id alone for exact match lookups
   - Consider composite index with provider for scoped lookups
   - Index supports webhook delivery report processing

### message_id Field Purpose

| Feature | Purpose |
|---------|---------|
| Delivery Tracking | Correlate provider callbacks with sent messages |
| Unique Identifier | Track individual message lifecycle |
| Provider Reference | Match provider reports with internal records |
| Debugging | Trace specific messages in provider dashboards |
| Webhook Processing | Fast lookup during DLR callback handling |

### Provider Message ID Formats

| Provider | Format Example | Length | Pattern |
|----------|---------------|--------|---------|
| Dialog | "1234567890" | 10-20 chars | Numeric |
| Notify.lk | "nlk-abc123-xyz" | 15-30 chars | Alphanumeric + hyphens |
| TextIt | "a1b2c3d4-e5f6-7890-abcd-ef1234567890" | 36 chars | UUID v4 |

### Callback Lookup Flow

```
Provider Webhook Receives DLR
         │
         ▼
Extract message_id from Payload
         │
         ▼
Query: SMSLog.objects.get(message_id=...)
         │
         ├──── Found ────▶ Update Status
         │
         └──── Not Found ─▶ Log Warning
```

### Expected Outcome
- message_id field added to SMSLog model
- Field properly indexed for fast lookups
- Field accommodates all provider ID formats
- Unique constraint prevents duplicate tracking
- Field documented with help text

### Verification Checklist
- [ ] CharField with max_length=100 defined
- [ ] Field marked as required (null=False, blank=False)
- [ ] db_index=True for performance
- [ ] help_text provides clear description
- [ ] Unique constraint configured appropriately
- [ ] Field supports all provider ID formats
- [ ] Validation ensures non-empty values

---

## Task 71: Create recipient Field

### Overview
Create the recipient field to store the phone number of the SMS recipient in international format (+94XXXXXXXXX). This field ensures consistent phone number storage, supports efficient querying for user-specific SMS history, and maintains data quality through format validation. The field is indexed to support rapid lookups for user SMS history and analytics.

### Dependencies
- Task 69: Create SMSLog Model

### Instructions

1. **Define recipient field structure**
   - Use `CharField` for phone number storage
   - Set `max_length=15` to support international format
   - Make field required (`null=False`, `blank=False`)
   - Add `db_index=True` for user history queries

2. **Add field documentation**
   - Include `help_text` explaining expected format
   - Document format: "+94XXXXXXXXX" for Sri Lankan numbers
   - Note that field stores only mobile numbers, not landlines

3. **Add format validation**
   - Create custom validator for Sri Lankan phone format
   - Validate pattern: `+94` followed by 9 digits
   - Ensure first digit after +94 is 7 (mobile prefix)
   - Strip spaces and special characters before validation

4. **Configure validation rules**
   - Regex pattern: `^\+947[0-9]{8}$`
   - Validate area codes: 70, 71, 72, 75, 76, 77, 78
   - Reject invalid prefixes (e.g., +9480, +9490)
   - Provide clear error messages for validation failures

5. **Add field normalization**
   - Create method to normalize phone numbers before saving
   - Convert "0771234567" to "+94771234567"
   - Remove spaces, hyphens, parentheses
   - Store only normalized format in database

6. **Configure database indexing**
   - Primary index on recipient for user history
   - Consider composite index with tenant for multi-tenant queries
   - Index supports "Show all SMS sent to this number"

7. **Privacy considerations**
   - Document that field contains PII (Personally Identifiable Information)
   - Note GDPR/privacy compliance requirements
   - Consider encryption for sensitive deployments

### recipient Field Purpose

| Feature | Purpose |
|---------|---------|
| Message Tracking | Identify SMS recipient |
| User History | Query all messages sent to a phone number |
| Delivery Reports | Display recipient in admin dashboard |
| Analytics | Count messages per recipient |
| Compliance | Maintain records of who received communications |
| Support | Customer support can search by phone number |

### Phone Number Format Validation

```
Input Formats → Normalization → Stored Format
─────────────────────────────────────────────

"0771234567"      →  +94771234567
"771234567"       →  +94771234567
"+94771234567"    →  +94771234567
"077 123 4567"    →  +94771234567
"+94 77 1234567"  →  +94771234567

Validation Pattern: ^\+947[0-9]{8}$
```

### Sri Lankan Mobile Prefixes

| Operator | Prefixes | Example |
|----------|----------|---------|
| Dialog | 77, 76 | +94771234567 |
| Mobitel | 71, 70 | +94711234567 |
| Hutch/Etisalat | 78, 72 | +94781234567 |
| Airtel | 75 | +94751234567 |

### Indexing Strategy

```
┌─────────────────────────────────────┐
│     Recipient Field Indexing        │
├─────────────────────────────────────┤
│                                     │
│  Single Index: recipient            │
│  Purpose: User SMS history          │
│                                     │
│  Composite: (tenant, recipient)     │
│  Purpose: Multi-tenant queries      │
│                                     │
│  Composite: (recipient, created_at) │
│  Purpose: Time-sorted history       │
│                                     │
└─────────────────────────────────────┘
```

### Expected Outcome
- recipient field added with proper format validation
- Field accepts and normalizes various input formats
- All phone numbers stored in consistent +94XXXXXXXXX format
- Field indexed for efficient user history queries
- Validation provides clear error messages

### Verification Checklist
- [ ] CharField with max_length=15 defined
- [ ] Field marked as required
- [ ] db_index=True for performance
- [ ] Validation regex: ^\+947[0-9]{8}$
- [ ] Normalization function handles various input formats
- [ ] Only valid Sri Lankan mobile prefixes accepted
- [ ] help_text documents expected format
- [ ] PII handling documented

---

## Task 72: Create status Field

### Overview
Create the status field to track the current delivery state of each SMS message. The field uses Django choices to enforce valid status values: PENDING (queued for sending), SENT (accepted by provider), DELIVERED (confirmed by recipient), and FAILED (delivery unsuccessful). This field is critical for monitoring delivery success rates, troubleshooting issues, and generating delivery reports.

### Dependencies
- Task 69: Create SMSLog Model

### Instructions

1. **Define status choices**
   - Create Django TextChoices class named `SMSStatus`
   - Define four status options with clear naming
   - Include descriptive labels for each status

2. **Configure status values**
   - `PENDING = "pending", "Pending"`
   - `SENT = "sent", "Sent"`
   - `DELIVERED = "delivered", "Delivered"`
   - `FAILED = "failed", "Failed"`

3. **Define status field**
   - Use `CharField` with `choices=SMSStatus.choices`
   - Set `max_length=20` to accommodate status strings
   - Set `default=SMSStatus.PENDING` for new records
   - Add `db_index=True` for status-based queries

4. **Add field documentation**
   - Include `help_text` explaining status lifecycle
   - Document expected status transitions
   - Note that status updates come from provider callbacks

5. **Configure database indexing**
   - Index on status for filtering by delivery state
   - Composite index on (status, created_at) for reports
   - Supports queries like "all failed messages today"

6. **Add status transition validation**
   - Create method to validate status transitions
   - Prevent invalid transitions (e.g., DELIVERED → PENDING)
   - Log status change history for debugging

7. **Add status-related model methods**
   - `is_pending`: Property to check if status is PENDING
   - `is_sent`: Property to check if status is SENT
   - `is_delivered`: Property to check if status is DELIVERED
   - `is_failed`: Property to check if status is FAILED
   - `is_final_status`: Property to check if status is terminal (DELIVERED/FAILED)

8. **Add status update methods**
   - `mark_as_sent`: Transition to SENT with timestamp
   - `mark_as_delivered`: Transition to DELIVERED with timestamp
   - `mark_as_failed`: Transition to FAILED with error message

### status Field Purpose

| Feature | Purpose |
|---------|---------|
| Delivery Tracking | Monitor message delivery state |
| Success Rate | Calculate delivery success metrics |
| Retry Logic | Identify failed messages for retry |
| Reporting | Generate delivery status reports |
| Alerting | Trigger alerts for high failure rates |
| Debugging | Troubleshoot delivery issues |

### Status Lifecycle

```
         ┌─────────┐
         │ PENDING │  Initial state when SMS queued
         └────┬────┘
              │
              │ Provider accepts message
              ▼
         ┌─────────┐
         │  SENT   │  Message sent to provider
         └────┬────┘
              │
              ├─────────────────┬──────────────────┐
              │                 │                  │
              │ DLR confirms    │ DLR reports      │ Timeout/Error
              ▼                 ▼                  ▼
        ┌───────────┐     ┌─────────┐       ┌─────────┐
        │ DELIVERED │     │ FAILED  │       │ FAILED  │
        └───────────┘     └─────────┘       └─────────┘
         (Final)           (Final)           (Final)
```

### Status Transition Rules

| From | To | Valid? | Reason |
|------|-----|--------|--------|
| PENDING | SENT | ✅ Yes | Normal flow: provider accepted |
| PENDING | FAILED | ✅ Yes | Provider rejected immediately |
| SENT | DELIVERED | ✅ Yes | Normal flow: delivery confirmed |
| SENT | FAILED | ✅ Yes | Delivery failed per DLR |
| DELIVERED | * | ❌ No | Final status |
| FAILED | * | ❌ No | Final status |
| SENT | PENDING | ❌ No | Cannot reverse |

### Status-Based Queries

```sql
-- All pending messages (need to be sent)
WHERE status = 'pending'

-- All successfully delivered today
WHERE status = 'delivered' AND sent_at >= TODAY

-- Failed messages for retry
WHERE status = 'failed' AND can_retry = true

-- Delivery rate calculation
SELECT 
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) * 100.0 / COUNT(*) as rate
FROM sms_log
WHERE sent_at >= LAST_30_DAYS
```

### Expected Outcome
- status field defined with four clear choices
- Default status is PENDING for new records
- Field indexed for efficient status filtering
- Status transition methods prevent invalid changes
- Helper properties for checking status states

### Verification Checklist
- [ ] SMSStatus TextChoices class defined
- [ ] Four status values: PENDING, SENT, DELIVERED, FAILED
- [ ] CharField with choices=SMSStatus.choices
- [ ] default=SMSStatus.PENDING configured
- [ ] db_index=True for performance
- [ ] Status transition validation implemented
- [ ] Helper methods (is_pending, is_delivered, etc.)
- [ ] Status update methods (mark_as_sent, etc.)

---

## Task 73: Create provider Field

### Overview
Create the provider field to identify which SMS gateway provider was used to send each message. The field supports three Sri Lankan SMS providers: Dialog, Notify.lk, and TextIt. This enables provider-specific analytics, cost comparison, failover tracking, and performance monitoring across different gateways.

### Dependencies
- Task 69: Create SMSLog Model

### Instructions

1. **Define provider choices**
   - Create Django TextChoices class named `SMSProvider`
   - Define three provider options with consistent naming
   - Use lowercase keys for database storage

2. **Configure provider values**
   - `DIALOG = "dialog", "Dialog"`
   - `NOTIFYLK = "notifylk", "Notify.lk"`
   - `TEXTIT = "textit", "TextIt"`

3. **Define provider field**
   - Use `CharField` with `choices=SMSProvider.choices`
   - Set `max_length=20` to accommodate provider names
   - Make field required (`null=False`, `blank=False`)
   - No default value (must be specified when creating)

4. **Add field documentation**
   - Include `help_text` explaining provider selection
   - Document that provider is set when sending message
   - Note that provider cannot be changed after creation

5. **Configure database indexing**
   - Add `db_index=True` for provider-specific queries
   - Composite index on (provider, created_at) for analytics
   - Supports queries like "Dialog delivery rate this month"

6. **Add provider-related model methods**
   - `get_provider_display`: Built-in Django method (auto-generated)
   - `is_dialog`: Property to check if provider is Dialog
   - `is_notifylk`: Property to check if provider is Notify.lk
   - `is_textit`: Property to check if provider is TextIt

7. **Add provider configuration helpers**
   - Create class method to get provider config
   - Return provider-specific settings (API endpoint, credentials)
   - Support dynamic provider selection based on availability

### provider Field Purpose

| Feature | Purpose |
|---------|---------|
| Provider Analytics | Compare performance across providers |
| Cost Tracking | Aggregate costs per provider |
| Failover Tracking | Monitor which provider handled each message |
| Performance Metrics | Calculate provider-specific delivery rates |
| Cost Optimization | Identify most cost-effective provider |
| SLA Monitoring | Track provider uptime and reliability |

### Provider Comparison

| Provider | Avg Cost (LKR) | Typical Delivery Time | Network Coverage |
|----------|----------------|----------------------|------------------|
| Dialog | 0.25 | 3-5 seconds | Excellent (Dialog network) |
| Notify.lk | 0.30 | 5-8 seconds | Good (all networks) |
| TextIt | 0.25 | 4-6 seconds | Good (all networks) |

### Provider Selection Logic

```
SMS Send Request
      │
      ▼
Check Primary Provider (Dialog)
      │
      ├──── Available ────▶ Use Dialog
      │
      └──── Unavailable
             │
             ▼
      Check Secondary (Notify.lk)
             │
             ├──── Available ────▶ Use Notify.lk
             │
             └──── Unavailable
                    │
                    ▼
             Check Tertiary (TextIt)
                    │
                    ├──── Available ────▶ Use TextIt
                    │
                    └──── Unavailable ────▶ FAIL (Log Error)
```

### Provider-Specific Analytics

```
Monthly Report by Provider
───────────────────────────────────────────

Dialog:
  - Messages Sent: 10,000
  - Delivered: 9,800 (98%)
  - Failed: 200 (2%)
  - Total Cost: 2,500 LKR

Notify.lk:
  - Messages Sent: 5,000
  - Delivered: 4,900 (98%)
  - Failed: 100 (2%)
  - Total Cost: 1,500 LKR

TextIt:
  - Messages Sent: 2,000
  - Delivered: 1,960 (98%)
  - Failed: 40 (2%)
  - Total Cost: 500 LKR

Overall:
  - Total Messages: 17,000
  - Total Delivered: 16,660 (98%)
  - Total Cost: 4,500 LKR
```

### Provider Failover Tracking

```sql
-- Count messages by provider (shows failover usage)
SELECT provider, COUNT(*) as count
FROM sms_log
WHERE sent_at >= LAST_30_DAYS
GROUP BY provider

-- Provider distribution
Dialog:     10,000 (59%)
Notify.lk:   5,000 (29%)
TextIt:      2,000 (12%)
```

### Expected Outcome
- provider field defined with three provider choices
- Field required and cannot be null
- Field indexed for provider-specific analytics
- Helper methods for provider identification
- Support for provider comparison reports

### Verification Checklist
- [ ] SMSProvider TextChoices class defined
- [ ] Three providers: DIALOG, NOTIFYLK, TEXTIT
- [ ] CharField with choices=SMSProvider.choices
- [ ] max_length=20 configured
- [ ] Field marked as required (null=False)
- [ ] db_index=True for analytics
- [ ] Helper properties (is_dialog, is_notifylk, is_textit)
- [ ] Provider labels display correctly

---

## Task 74: Create cost Field

### Overview
Create the cost field to track the per-message cost in Sri Lankan Rupees (LKR). This field enables accurate cost tracking, billing calculations, budget monitoring, and cost optimization analysis. The field uses DecimalField for precise financial calculations and supports costs ranging from 0.00 to 9999.99 LKR per message.

### Dependencies
- Task 69: Create SMSLog Model

### Instructions

1. **Define cost field structure**
   - Use `DecimalField` for financial precision
   - Set `max_digits=6` (total digits including decimals)
   - Set `decimal_places=2` (two decimal places for cents)
   - Make field required (`null=False`, `blank=False`)

2. **Add field documentation**
   - Include `help_text` explaining cost unit (LKR)
   - Document typical cost ranges per provider
   - Note that cost is set when message is sent

3. **Configure field defaults**
   - Consider setting default to 0.00
   - Or require explicit cost from provider config
   - Document that cost comes from provider settings

4. **Add cost validation**
   - Create validator to ensure non-negative values
   - MinValueValidator(Decimal('0.00'))
   - Prevent negative costs from invalid data

5. **Add cost calculation helpers**
   - Create method to get cost from provider config
   - Auto-populate cost based on provider when saving
   - Support cost override for special pricing

6. **Configure database considerations**
   - No index needed (not typically queried individually)
   - Used in aggregate queries for sum calculations
   - Field participates in monthly cost summaries

7. **Add cost-related model methods**
   - `get_cost_display`: Format cost for display (e.g., "0.25 LKR")
   - Class method to calculate total cost for date range
   - Method to calculate average cost per provider

### cost Field Purpose

| Feature | Purpose |
|---------|---------|
| Financial Tracking | Accurate per-message cost recording |
| Budget Monitoring | Track spending against budget |
| Cost Analysis | Compare costs across providers |
| Billing | Generate invoices for SMS usage |
| Cost Optimization | Identify most cost-effective provider |
| ROI Calculation | Calculate return on SMS marketing spend |

### Provider Cost Reference

| Provider | Cost per SMS (LKR) | Cost per 1000 (LKR) | Notes |
|----------|-------------------|---------------------|-------|
| Dialog | 0.25 | 250 | Best for Dialog subscribers |
| Notify.lk | 0.30 | 300 | Slightly higher cost |
| TextIt | 0.25 | 250 | Competitive pricing |

### Cost Calculation Flow

```
Send SMS Request
      │
      ▼
Select Provider (e.g., Dialog)
      │
      ▼
Get Provider Cost from Config
      │
      ▼
Create SMSLog with cost = 0.25
      │
      ▼
Send via Provider API
      │
      ▼
Log message_id and final cost
```

### Field Precision

```
DecimalField Configuration:
  max_digits = 6
  decimal_places = 2

Supported Range:
  Min: 0.00 LKR
  Max: 9999.99 LKR
  
Typical Values:
  Dialog:    0.25 LKR
  Notify.lk: 0.30 LKR
  TextIt:    0.25 LKR
  
Precision: 0.01 LKR (1 cent)
```

### Cost Analytics Queries

```sql
-- Total cost this month
SELECT SUM(cost) as total_cost
FROM sms_log
WHERE sent_at >= FIRST_DAY_OF_MONTH

-- Cost by provider
SELECT provider, SUM(cost) as total_cost, AVG(cost) as avg_cost
FROM sms_log
WHERE sent_at >= LAST_30_DAYS
GROUP BY provider

-- Daily cost trend
SELECT DATE(sent_at) as date, SUM(cost) as daily_cost
FROM sms_log
WHERE sent_at >= LAST_30_DAYS
GROUP BY DATE(sent_at)
ORDER BY date

-- Cost per delivered message
SELECT SUM(cost) / COUNT(CASE WHEN status='delivered' THEN 1 END) as cost_per_delivered
FROM sms_log
WHERE sent_at >= LAST_30_DAYS
```

### Monthly Cost Report Example

```
SMS Cost Report - January 2026
─────────────────────────────────────────

By Provider:
  Dialog:     2,500.00 LKR (10,000 messages × 0.25)
  Notify.lk:  1,500.00 LKR (5,000 messages × 0.30)
  TextIt:       500.00 LKR (2,000 messages × 0.25)
  ─────────────────────────────────────────
  Total:      4,500.00 LKR (17,000 messages)

By Status:
  Delivered:  4,150.00 LKR (16,600 messages)
  Failed:       350.00 LKR (400 messages)
  
Average Cost per Message: 0.26 LKR
Average Cost per Delivered: 0.25 LKR
```

### Cost Budget Monitoring

```
Monthly Budget: 5,000 LKR
Current Spend:  4,500 LKR (90% of budget)
Remaining:        500 LKR
Days Remaining:      5 days

Projected End-of-Month: 5,100 LKR (102% - Over Budget!)

Alert: Consider switching to lower-cost provider
```

### Expected Outcome
- cost field defined with appropriate precision
- Field stores costs in LKR with 2 decimal places
- Non-negative validation prevents invalid costs
- Support for cost analytics and reporting
- Auto-population from provider configuration

### Verification Checklist
- [ ] DecimalField with max_digits=6, decimal_places=2
- [ ] Field marked as required (null=False)
- [ ] MinValueValidator(0.00) prevents negative costs
- [ ] help_text documents unit as LKR
- [ ] Cost auto-populated from provider config
- [ ] get_cost_display method formats nicely
- [ ] Support for aggregate cost queries
- [ ] Cost range supports typical SMS pricing

---

## SMSLog Model Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         SMSLog Model                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CORE FIELDS                                                        │
│  ─────────────                                                      │
│  message_id     CharField(100)    [INDEXED] [UNIQUE+provider]     │
│  recipient      CharField(15)     [INDEXED] [+94XXXXXXXXX]         │
│  status         CharField(20)     [INDEXED] [PENDING|SENT|...]     │
│  provider       CharField(20)     [INDEXED] [dialog|notifylk|...]  │
│  cost           DecimalField(6,2) [LKR]                            │
│                                                                     │
│  CONTENT & METADATA                                                 │
│  ─────────────────────                                              │
│  message_content  TextField                                         │
│  error_message    TextField       [nullable]                        │
│                                                                     │
│  TIMESTAMPS                                                         │
│  ──────────                                                         │
│  sent_at         DateTimeField                                      │
│  delivered_at    DateTimeField    [nullable]                        │
│  failed_at       DateTimeField    [nullable]                        │
│  created_at      DateTimeField    [auto_now_add]                    │
│  updated_at      DateTimeField    [auto_now]                        │
│                                                                     │
│  RELATIONSHIPS                                                      │
│  ─────────────                                                      │
│  tenant          ForeignKey(Tenant)                                 │
│  user            ForeignKey(User)     [nullable]                    │
│  otp             ForeignKey(OTP)      [nullable]                    │
│  notification    ForeignKey(Notification) [nullable]                │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## Status Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMS Status Lifecycle                          │
└─────────────────────────────────────────────────────────────────┘

    New SMS Request
           │
           │ SMS queued in system
           ▼
    ┌─────────────┐
    │   PENDING   │  Initial state
    │  (created)  │  Waiting to be sent
    └──────┬──────┘
           │
           │ Sent to provider API
           │ Provider returns message_id
           ▼
    ┌─────────────┐
    │    SENT     │  Provider accepted
    │ (sent_at)   │  Message in transit
    └──────┬──────┘
           │
           │ Wait for DLR (Delivery Report)
           │
           ├─────────────────────────────────┬─────────────────┐
           │                                 │                 │
           │ DLR: Success                   │ DLR: Failed     │ Timeout
           ▼                                 ▼                 ▼
    ┌──────────────┐                 ┌──────────────┐  ┌─────────────┐
    │  DELIVERED   │                 │    FAILED    │  │   FAILED    │
    │(delivered_at)│                 │ (failed_at)  │  │(failed_at)  │
    │              │                 │ + error_msg  │  │+ error_msg  │
    └──────────────┘                 └──────────────┘  └─────────────┘
     (Final State)                    (Final State)     (Final State)
           │                                 │                 │
           │                                 │                 │
           ▼                                 ▼                 ▼
     Analytics                         Retry Logic       Log Error
     Cost Report                      (if applicable)    Alert Admin
```

---

## Cost Tracking Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    Cost Tracking Flow                           │
└────────────────────────────────────────────────────────────────┘

1. SMS Send Request
         │
         ▼
2. Select Provider (Failover Logic)
         │
         ├──── Dialog Available ──▶ cost = 0.25 LKR
         │
         ├──── Notify.lk ────────▶ cost = 0.30 LKR
         │
         └──── TextIt ───────────▶ cost = 0.25 LKR
         │
         ▼
3. Create SMSLog Record
   - provider = selected provider
   - cost = provider default cost
   - status = PENDING
         │
         ▼
4. Send via Provider API
   - Get message_id from response
   - Update message_id in SMSLog
   - Update status = SENT
   - Record sent_at timestamp
         │
         ▼
5. Cost Recorded for Analytics
   - Add to daily cost total
   - Add to provider cost total
   - Compare against budget
   - Update usage metrics

┌────────────────────────────────────────┐
│        Cost Analytics                  │
├────────────────────────────────────────┤
│  Daily:    SUM(cost) by date           │
│  Monthly:  SUM(cost) by month          │
│  Provider: SUM(cost) by provider       │
│  Tenant:   SUM(cost) by tenant         │
│  Budget:   Compare to monthly limit    │
└────────────────────────────────────────┘
```

---

## Database Schema

```sql
CREATE TABLE sms_log (
    id                  BIGSERIAL PRIMARY KEY,
    
    -- Core tracking fields
    message_id          VARCHAR(100) NOT NULL,
    recipient           VARCHAR(15) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    provider            VARCHAR(20) NOT NULL,
    cost                NUMERIC(6,2) NOT NULL,
    
    -- Content
    message_content     TEXT NOT NULL,
    error_message       TEXT NULL,
    
    -- Timestamps
    sent_at             TIMESTAMP NULL,
    delivered_at        TIMESTAMP NULL,
    failed_at           TIMESTAMP NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Relationships
    tenant_id           BIGINT NOT NULL REFERENCES tenant(id),
    user_id             BIGINT NULL REFERENCES auth_user(id),
    otp_id              BIGINT NULL REFERENCES otp(id),
    notification_id     BIGINT NULL REFERENCES notification(id),
    
    -- Constraints
    CONSTRAINT unique_message_provider UNIQUE (message_id, provider),
    CONSTRAINT valid_recipient CHECK (recipient ~ '^\+947[0-9]{8}$'),
    CONSTRAINT valid_cost CHECK (cost >= 0),
    
    -- Indexes
    INDEX idx_message_id (message_id),
    INDEX idx_recipient (recipient),
    INDEX idx_status (status),
    INDEX idx_provider (provider),
    INDEX idx_tenant_created (tenant_id, created_at),
    INDEX idx_sent_at (sent_at)
);
```

---

## Model Usage Examples

### Creating SMSLog Entry

```python
# After sending SMS via provider
sms_log = SMSLog.objects.create(
    message_id='1234567890',          # From provider response
    recipient='+94771234567',         # Normalized format
    status=SMSLog.SMSStatus.SENT,     # Initial status
    provider=SMSLog.SMSProvider.DIALOG,
    cost=Decimal('0.25'),             # From provider config
    message_content='Your OTP is 123456',
    sent_at=timezone.now(),
    tenant=current_tenant,
    user=request.user,
    otp=otp_instance
)
```

### Updating Status from DLR Webhook

```python
# Provider webhook callback
def handle_delivery_report(message_id, status, error_msg=None):
    try:
        sms_log = SMSLog.objects.get(message_id=message_id)
        
        if status == 'delivered':
            sms_log.mark_as_delivered()
        else:
            sms_log.mark_as_failed(error_msg)
            
    except SMSLog.DoesNotExist:
        logger.warning(f"DLR for unknown message_id: {message_id}")
```

### Cost Analytics

```python
# Monthly cost by provider
from django.db.models import Sum, Count, Avg

monthly_costs = SMSLog.objects.filter(
    sent_at__gte=start_of_month,
    sent_at__lt=end_of_month
).values('provider').annotate(
    total_cost=Sum('cost'),
    message_count=Count('id'),
    avg_cost=Avg('cost'),
    delivered_count=Count('id', filter=Q(status='delivered'))
)
```

### User SMS History

```python
# Get all SMS sent to a phone number
user_sms = SMSLog.objects.filter(
    recipient='+94771234567',
    tenant=current_tenant
).order_by('-created_at')[:10]
```

---

## Integration Points

### With OTP System (Group C)

```python
# Link SMS to OTP for tracking
otp = OTP.objects.create(
    user=user,
    otp_code='123456',
    purpose='login'
)

sms_log = send_sms(
    recipient=user.phone,
    message=f'Your OTP is {otp.otp_code}',
    otp=otp  # Link SMS to OTP
)

# Later: Check if OTP SMS was delivered
if otp.sms_log.is_delivered:
    # User should have received OTP
    pass
```

### With Notification Service (Group D)

```python
# Track SMS notifications
notification = Notification.objects.create(
    user=user,
    notification_type='order_shipped',
    channel='sms'
)

sms_log = notification_service.send_sms(
    recipient=user.phone,
    message=notification.message,
    notification=notification  # Link to notification
)
```

---

## Performance Considerations

### Index Usage

| Query Pattern | Index Used | Performance |
|---------------|------------|-------------|
| Lookup by message_id | idx_message_id | O(log n) |
| User SMS history | idx_recipient | O(log n) |
| Filter by status | idx_status | O(log n) |
| Provider analytics | idx_provider | O(log n) |
| Tenant daily report | idx_tenant_created | O(log n) |
| Time-based queries | idx_sent_at | O(log n) |

### Query Optimization

```python
# Efficient: Use select_related for foreign keys
sms_logs = SMSLog.objects.select_related(
    'tenant', 'user', 'otp'
).filter(status='delivered')

# Efficient: Use indexes for filtering
recent_failures = SMSLog.objects.filter(
    status='failed',  # Uses idx_status
    sent_at__gte=yesterday  # Uses idx_sent_at
)

# Efficient: Aggregate queries
daily_costs = SMSLog.objects.filter(
    sent_at__date=today
).aggregate(total=Sum('cost'))
```

---

## Testing Strategy

### Unit Tests

```python
# Test model creation
def test_smslog_creation():
    sms_log = SMSLog.objects.create(
        message_id='test123',
        recipient='+94771234567',
        status='sent',
        provider='dialog',
        cost=Decimal('0.25'),
        message_content='Test message'
    )
    assert sms_log.is_sent
    assert sms_log.cost == Decimal('0.25')

# Test status transitions
def test_status_transitions():
    sms_log = SMSLog.objects.create(...)
    sms_log.mark_as_delivered()
    assert sms_log.status == 'delivered'
    assert sms_log.delivered_at is not None
```

### Integration Tests

```python
# Test DLR webhook processing
def test_delivery_report_processing():
    sms_log = create_test_sms_log()
    
    # Simulate DLR webhook
    response = client.post('/api/sms/dlr/', {
        'message_id': sms_log.message_id,
        'status': 'delivered'
    })
    
    sms_log.refresh_from_db()
    assert sms_log.is_delivered
```

---

## Summary

This document covered the creation of the SMSLog model with six essential fields:

1. **message_id**: Unique provider identifier for DLR correlation
2. **recipient**: Phone number in +94XXXXXXXXX format
3. **status**: Lifecycle tracking (PENDING → SENT → DELIVERED/FAILED)
4. **provider**: Gateway used (Dialog, Notify.lk, TextIt)
5. **cost**: Per-message cost in LKR for financial tracking

The model includes comprehensive indexing for performance, status lifecycle management, provider comparison analytics, and cost tracking capabilities. This foundation enables complete SMS delivery monitoring and usage analytics for the Sri Lankan market.

### Next Steps

Proceed to [02_Tasks-75-78_Webhook-Analytics-Verify.md](02_Tasks-75-78_Webhook-Analytics-Verify.md) to implement delivery report webhooks, status update handlers, usage analytics, and verification testing.

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-01-31  
**Ready for Implementation:** Yes
