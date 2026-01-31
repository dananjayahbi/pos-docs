# Tasks 79-82: Status Update Handler, Alerts, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** E - Webhooks & Delivery  
> **Document:** 02 of 02  
> **Tasks Covered:** 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-78_Webhook-MessageLog.md](01_Tasks-69-78_Webhook-MessageLog.md)
- **→ Next Document:** [Group-F/01_Frontend-UI.md](../Group-F_Frontend-Testing/01_Frontend-UI.md)

---

## Document Overview

This document covers the implementation of status update processing, failure alerting, asynchronous webhook handling, and comprehensive webhook flow verification. These tasks transform the webhook infrastructure (from Document 01) into a production-ready system that reliably tracks message delivery, alerts operations teams about failures, handles high-volume webhook traffic, and ensures end-to-end correctness.

The status update handler bridges webhook events and database updates, the failure alert system ensures critical issues are addressed promptly, the webhook queue enables scalable asynchronous processing, and verification testing validates the entire webhook flow. Together, these components complete the delivery tracking system.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Status Update Handler | Medium | 40 min |
| 80 | Create Failure Alert | Medium | 30 min |
| 81 | Create Webhook Queue | Medium | 35 min |
| 82 | Verify Webhook Flow | Low | 30 min |

---

## Task 79: Create Status Update Handler

### Overview

Implement the status update handler that processes webhook events and updates MessageLog records in the database. This handler receives parsed status data from the message status handler (Task 72), finds the corresponding MessageLog entry by message_id, updates the status and timestamp fields, and saves changes. This is the critical link between webhook events and database state.

The update handler must be idempotent (safe to run multiple times), handle race conditions from concurrent webhooks, validate status transitions, and maintain data integrity. It ensures that every status update from Meta is accurately reflected in the database, providing reliable delivery tracking for the entire system.

### Dependencies

- Task 78: Create failed_reason Field (complete MessageLog model)
- Task 72: Create Message Status Handler (provides parsed data)
- Understanding of database transactions and locking
- Knowledge of idempotency patterns

### Instructions

1. **Create update handler function**
   - Define function `update_message_status()` in webhook module
   - Function accepts message_id and status update data dictionary
   - Returns updated MessageLog instance or None if not found
   - Keep function focused and testable

2. **Implement message lookup by message_id**
   - Query MessageLog by message_id field
   - Use get_or_create to handle missing entries
   - Handle case where message_id doesn't exist (log warning)
   - Consider creating log entry if WhatsAppMessage exists

3. **Validate status transition**
   - Check current status before updating
   - Ensure transition is valid (sent → delivered → read)
   - Prevent backward transitions (delivered → sent)
   - Allow any status to transition to failed

4. **Use database transactions**
   - Wrap update logic in database transaction
   - Use select_for_update() to lock row during update
   - Prevents race conditions from concurrent webhooks
   - Ensures atomic updates

5. **Update status field**
   - Set MessageLog.status to new status value
   - Status comes from webhook event (sent/delivered/read/failed)
   - Only update if transition is valid
   - Log status change with timestamp

6. **Update timestamp fields**
   - Set delivered_at when status changes to delivered
   - Set read_at when status changes to read
   - Convert webhook Unix timestamp to datetime
   - Ensure timezone-aware timestamps (UTC)

7. **Handle failure status**
   - Extract error information from webhook event
   - Store in failed_reason field as JSON
   - Include error code, title, and message
   - Trigger failure alert (Task 80)

8. **Implement idempotency**
   - Check if update already applied (status unchanged)
   - Return early if no changes needed
   - Safe to receive same webhook multiple times
   - Prevents unnecessary database writes

9. **Add comprehensive logging**
   - Log every status update with details
   - Include message_id, old status, new status, timestamp
   - Log skipped updates (already applied)
   - Log validation failures with reason

10. **Handle edge cases**
    - MessageLog doesn't exist for message_id (create or log error)
    - Multiple status updates arrive out of order (timestamps resolve)
    - Webhook arrives before MessageLog created (queue for retry)
    - Database write fails (raise exception for retry)

### Status Update Flow

```
Status Update Process:
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. Webhook Event Arrives                       │
│     → POST /api/webhooks/whatsapp/              │
│                                                 │
│  2. Signature Validation (Task 71)              │
│     → Verify X-Hub-Signature-256                │
│                                                 │
│  3. Extract Status Data (Task 72)               │
│     → Parse payload                             │
│     → Extract message_id, status, timestamp     │
│                                                 │
│  4. Update Handler (THIS TASK)                  │
│     ┌─────────────────────────────────────┐   │
│     │ A. Find MessageLog by message_id    │   │
│     │    → Query database                 │   │
│     │    → Lock row for update            │   │
│     │                                     │   │
│     │ B. Validate Status Transition       │   │
│     │    → Check current → new is valid   │   │
│     │    → Allow forward transitions      │   │
│     │                                     │   │
│     │ C. Update Fields                    │   │
│     │    → Set status                     │   │
│     │    → Set timestamp (delivered_at/   │   │
│     │       read_at/failed_reason)        │   │
│     │                                     │   │
│     │ D. Save Changes                     │   │
│     │    → Commit transaction             │   │
│     │    → Log update                     │   │
│     │                                     │   │
│     │ E. Trigger Alerts (if failed)       │   │
│     │    → Call failure alert (Task 80)   │   │
│     └─────────────────────────────────────┘   │
│                                                 │
│  5. Return Success (HTTP 200)                   │
│     → Acknowledge webhook to Meta               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Database Transaction Pattern

```
Transaction with Row Locking:
┌─────────────────────────────────────────────┐
│                                             │
│  with transaction.atomic():                 │
│      # Lock the row to prevent concurrent   │
│      # updates from other webhook events    │
│                                             │
│      message_log = MessageLog.objects       │
│          .select_for_update()               │
│          .get(message_id=msg_id)            │
│                                             │
│      # Validate transition                  │
│      if not is_valid_transition():          │
│          return                             │
│                                             │
│      # Update fields                        │
│      message_log.status = new_status        │
│      message_log.delivered_at = timestamp   │
│                                             │
│      # Save within transaction              │
│      message_log.save()                     │
│                                             │
│  # Transaction commits automatically        │
│  # Row lock released                        │
│                                             │
└─────────────────────────────────────────────┘
```

### Status Transition Validation

| Current Status | New Status | Valid? | Action |
|----------------|------------|--------|--------|
| pending | sent | Yes | Update status |
| sent | delivered | Yes | Update status, set delivered_at |
| delivered | read | Yes | Update status, set read_at |
| sent | read | Yes | Skip delivered, set both timestamps |
| delivered | sent | No | Reject, log warning |
| read | delivered | No | Reject, log warning |
| any | failed | Yes | Update status, set failed_reason |
| failed | any other | No | Terminal state |

### Idempotency Implementation

```
Idempotent Update Logic:
┌─────────────────────────────────────────────┐
│                                             │
│  def update_message_status(msg_id, data):   │
│                                             │
│      log = MessageLog.objects.get(          │
│          message_id=msg_id                  │
│      )                                      │
│                                             │
│      new_status = data['status']            │
│                                             │
│      # Check if already applied             │
│      if log.status == new_status:           │
│          # Timestamp might also match       │
│          if status == 'delivered' and \     │
│             log.delivered_at == timestamp:  │
│              return log  # Already applied  │
│                                             │
│      # Apply update                         │
│      log.status = new_status                │
│      log.save()                             │
│                                             │
│      return log                             │
│                                             │
│  Benefits:                                  │
│    - Safe to process duplicate webhooks     │
│    - No error on re-delivery               │
│    - Prevents duplicate alerts              │
│                                             │
└─────────────────────────────────────────────┘
```

### Timestamp Update Logic

| Status Update | Timestamp Field | Value Source | Validation |
|---------------|----------------|--------------|------------|
| sent | (none) | - | Status only |
| delivered | delivered_at | Webhook timestamp | Not before created_at |
| read | read_at | Webhook timestamp | Not before delivered_at |
| failed | (none, but failed_reason) | Error details | Store error JSON |

### Race Condition Handling

```
Concurrent Webhook Scenario:
┌─────────────────────────────────────────────┐
│                                             │
│  Timeline:                                  │
│                                             │
│  T1: Webhook "delivered" arrives            │
│      → Handler starts processing            │
│      → Acquires row lock                    │
│      → Updates status to "delivered"        │
│      → Commits transaction                  │
│      → Releases lock                        │
│                                             │
│  T2: Webhook "read" arrives (concurrent)    │
│      → Handler starts processing            │
│      → Waits for row lock                   │
│      → (T1 commits)                         │
│      → Acquires row lock                    │
│      → Sees status = "delivered"            │
│      → Updates status to "read"             │
│      → Commits transaction                  │
│                                             │
│  Result: Correct final state                │
│  Status: read                               │
│  delivered_at: T1 timestamp                 │
│  read_at: T2 timestamp                      │
│                                             │
│  Without locking:                           │
│  - Both might read status="sent"            │
│  - Both write concurrently                  │
│  - Lost update problem                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Error Handling Strategy

| Error Type | Handling | Retry |
|------------|----------|-------|
| MessageLog not found | Log warning, skip update | No |
| Invalid transition | Log warning, skip update | No |
| Database error | Raise exception | Yes (via webhook queue) |
| Lock timeout | Raise exception | Yes |
| Validation error | Log error, skip update | No |

### Logging Requirements

| Log Level | Event | Information Included |
|-----------|-------|---------------------|
| INFO | Status updated | message_id, old_status, new_status, timestamp |
| DEBUG | Idempotent skip | message_id, status (already applied) |
| WARNING | Invalid transition | message_id, attempted transition, reason |
| WARNING | MessageLog not found | message_id, webhook data |
| ERROR | Database error | message_id, exception details |

### Handler Integration Points

```
Integration with Other Components:
┌─────────────────────────────────────────────┐
│                                             │
│  Webhook View (Task 69)                     │
│      ↓                                      │
│  Signature Validation (Task 71)             │
│      ↓                                      │
│  Message Status Handler (Task 72)           │
│      ↓                                      │
│  Status Update Handler (THIS TASK)          │
│      ↓                                      │
│  ┌──────────────────────────┐              │
│  │ Update MessageLog        │              │
│  │ in Database              │              │
│  └─────────┬────────────────┘              │
│            │                                │
│            ├─→ Failure Alert (Task 80)      │
│            │   (if status = failed)         │
│            │                                │
│            └─→ Return Success               │
│                                             │
└─────────────────────────────────────────────┘
```

### Performance Considerations

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Database query | Index on message_id | Fast lookup |
| Row locking | select_for_update() | Prevent conflicts |
| Transaction scope | Minimal, focused | Reduce lock time |
| Idempotency check | Before expensive ops | Reduce DB writes |
| Batch updates | (Future) Process multiple | Higher throughput |

### Expected Outcome

- Status update handler function that processes webhook events
- Database lookup by message_id with row locking
- Status transition validation preventing invalid updates
- Timestamp field updates for delivered_at and read_at
- Failure reason storage for failed messages
- Idempotent implementation safe for duplicate webhooks
- Comprehensive logging for all update operations
- Integration with failure alert system

### Verification Checklist

- [ ] update_message_status() function created
- [ ] MessageLog lookup by message_id implemented
- [ ] select_for_update() row locking applied
- [ ] Status transition validation logic
- [ ] Status field update implementation
- [ ] delivered_at and read_at timestamp updates
- [ ] failed_reason population for failures
- [ ] Idempotency check prevents duplicate updates
- [ ] Comprehensive logging added
- [ ] Database transaction wrapping
- [ ] Integration with failure alert (Task 80)
- [ ] Error handling for edge cases

---

## Task 80: Create Failure Alert

### Overview

Implement automated failure alerting to notify operations teams, admins, or relevant stakeholders when message delivery fails. The alert system identifies failure events, categorizes failures by severity and type, determines appropriate notification channels (email, Slack, SMS), and sends alerts with actionable information. This ensures critical delivery failures are addressed promptly, improving system reliability and user satisfaction.

Proactive failure alerting is essential for maintaining high delivery rates and service quality. Different failure types require different responses: rate limits need throttling adjustments, invalid phone numbers need user notification, and policy violations need template reviews. The alert system routes each failure type to appropriate handlers.

### Dependencies

- Task 79: Create Status Update Handler (triggers alerts)
- Task 78: Create failed_reason Field (provides error details)
- Email/notification infrastructure from Core Backend
- Understanding of error categorization (Task 78)

### Instructions

1. **Create failure alert function**
   - Define function `send_failure_alert()` in notifications module
   - Function accepts MessageLog instance with failed status
   - Extracts failure details from failed_reason field
   - Determines appropriate alert recipients and channels

2. **Categorize failure severity**
   - Parse failed_reason to extract error code
   - Map error code to severity level (critical/high/medium/low)
   - Critical: System-wide issues (API down, credentials invalid)
   - High: Repeated failures for same error
   - Medium: Individual permanent failures
   - Low: Temporary failures (will retry)

3. **Determine alert recipients**
   - Critical/High: Alert operations team immediately
   - Medium: Alert tenant admin
   - Low: Log only, no active alert
   - Different recipients for different error categories
   - Consider on-call rotation for critical alerts

4. **Format alert message**
   - Include message_id for tracking
   - Include recipient phone number (masked for privacy)
   - Include error code, title, and user-friendly message
   - Include timestamp of failure
   - Include suggested action (retry, fix phone number, etc.)
   - Link to admin interface for details

5. **Choose notification channels**
   - Email: For all severity levels, detailed information
   - Slack/Teams: For high/critical, quick notification
   - SMS: For critical only, ultra-urgent
   - PagerDuty/OpsGenie: For critical with on-call escalation
   - In-app notification: For tenant admins

6. **Implement email alerts**
   - Use Django email framework
   - Create HTML email template for failures
   - Include failure details, context, suggested actions
   - Add link to message log in admin interface
   - CC operations team for critical failures

7. **Implement Slack/webhook alerts**
   - Configure Slack webhook URL in settings
   - Format message for Slack (markdown, color coding)
   - Use red for critical, yellow for high, gray for medium
   - Include action buttons (view in admin, acknowledge)
   - Rate limit Slack alerts to prevent spam

8. **Add alert throttling**
   - Prevent alert fatigue from repeated similar failures
   - Group similar failures (same error code) within time window
   - Send summary alert instead of individual alerts
   - Example: "10 rate limit failures in past 5 minutes"
   - Reset throttle after issue resolved

9. **Create alert suppression rules**
   - Allow suppression of known issues during maintenance
   - Suppress alerts for specific error codes if already known
   - Provide UI/admin action to suppress/unsuppress alerts
   - Track suppressed alerts for later review
   - Auto-unsuppress after time period

10. **Log all alert attempts**
    - Create FailureAlert model to track alerts sent
    - Record: message_log, error_code, severity, recipients, timestamp
    - Track alert delivery status (sent/failed)
    - Enable audit trail and analytics on alert patterns
    - Support alert delivery failure notifications

### Alert Severity Levels

```
Failure Severity Classification:
┌─────────────────────────────────────────────┐
│                                             │
│  CRITICAL (Immediate Action)                │
│  ├─ API credentials invalid                 │
│  ├─ WhatsApp API completely down            │
│  ├─ Database connection failures            │
│  └─ > 50% of messages failing               │
│      Actions:                               │
│      • Page on-call engineer                │
│      • Send SMS + Slack + Email             │
│      • Escalate if not resolved in 15 min   │
│                                             │
│  HIGH (Urgent)                              │
│  ├─ Rate limits exceeded repeatedly         │
│  ├─ Template approval failures              │
│  ├─ Webhook signature validation failing    │
│  └─ > 20% failure rate for one error        │
│      Actions:                               │
│      • Send Slack + Email                   │
│      • Notify operations team               │
│      • Review within 1 hour                 │
│                                             │
│  MEDIUM (Monitor)                           │
│  ├─ Individual invalid phone numbers        │
│  ├─ Re-engagement window expired            │
│  ├─ Message undeliverable                   │
│  └─ Policy violations (rare)                │
│      Actions:                               │
│      • Email tenant admin                   │
│      • Log for review                       │
│      • Notify user                          │
│                                             │
│  LOW (Informational)                        │
│  ├─ Temporary network issues                │
│  ├─ Retryable failures                      │
│  └─ Expected transient errors               │
│      Actions:                               │
│      • Log only                             │
│      • Automatic retry                      │
│      • No active alert                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Alert Routing Matrix

| Error Category | Severity | Email | Slack | SMS | PagerDuty |
|----------------|----------|-------|-------|-----|-----------|
| API Down | Critical | Yes | Yes | Yes | Yes |
| Invalid Credentials | Critical | Yes | Yes | Yes | Yes |
| High Failure Rate | Critical | Yes | Yes | No | Yes |
| Rate Limit (repeated) | High | Yes | Yes | No | No |
| Template Issues | High | Yes | Yes | No | No |
| Invalid Phone | Medium | Yes (tenant) | No | No | No |
| Re-engagement Expired | Medium | Yes (tenant) | No | No | No |
| Temporary Network | Low | No | No | No | No |

### Email Alert Template Structure

```
Failure Alert Email:
┌─────────────────────────────────────────────┐
│ Subject: [CRITICAL] WhatsApp Message        │
│          Delivery Failure - Rate Limit      │
│                                             │
│ To: ops-team@lankacommerce.cloud            │
│ CC: admin@tenant.lcc                        │
│                                             │
│ Body:                                       │
│ ─────────────────────────────────────────── │
│                                             │
│ WhatsApp Message Delivery Failure           │
│                                             │
│ Severity: HIGH                              │
│ Error Code: 131056                          │
│ Error: Rate limit exceeded                  │
│                                             │
│ Details:                                    │
│ • Message ID: wamid.HBgMOTE...             │
│ • Recipient: +94 77 *** **67               │
│ • Failed At: 2026-01-31 14:45:32 UTC       │
│ • Tenant: Tenant XYZ (tenant_xyz)          │
│                                             │
│ Error Message:                              │
│ "You have exceeded the rate limit for      │
│  sending messages. Please wait before      │
│  sending more messages."                    │
│                                             │
│ Suggested Action:                           │
│ 1. Review current sending rate              │
│ 2. Implement rate limiting in application   │
│ 3. Request rate limit increase from Meta    │
│ 4. Retry failed messages after cooldown     │
│                                             │
│ View in Admin: [Link to MessageLog]         │
│                                             │
│ ─────────────────────────────────────────── │
│ LankaCommerce Cloud Monitoring System       │
└─────────────────────────────────────────────┘
```

### Slack Alert Format

```
Slack Webhook Payload:
┌─────────────────────────────────────────────┐
│ {                                           │
│   "attachments": [                          │
│     {                                       │
│       "color": "danger",  // Red for HIGH   │
│       "title": "WhatsApp Delivery Failure", │
│       "fields": [                           │
│         {                                   │
│           "title": "Severity",              │
│           "value": "HIGH",                  │
│           "short": true                     │
│         },                                  │
│         {                                   │
│           "title": "Error Code",            │
│           "value": "131056",                │
│           "short": true                     │
│         },                                  │
│         {                                   │
│           "title": "Error",                 │
│           "value": "Rate limit exceeded"    │
│         },                                  │
│         {                                   │
│           "title": "Tenant",                │
│           "value": "Tenant XYZ"             │
│         }                                   │
│       ],                                    │
│       "actions": [                          │
│         {                                   │
│           "type": "button",                 │
│           "text": "View Details",           │
│           "url": "https://admin.lcc/..."    │
│         }                                   │
│       ]                                     │
│     }                                       │
│   ]                                         │
│ }                                           │
└─────────────────────────────────────────────┘
```

### Alert Throttling Logic

```
Throttling Implementation:
┌─────────────────────────────────────────────┐
│                                             │
│  Scenario: Rate limit errors flooding       │
│                                             │
│  Without Throttling:                        │
│    14:00:01 - Alert sent                    │
│    14:00:05 - Alert sent                    │
│    14:00:08 - Alert sent                    │
│    14:00:12 - Alert sent                    │
│    ... (100 alerts in 5 minutes)            │
│                                             │
│  With Throttling:                           │
│    14:00:01 - First alert sent              │
│    14:00:05 - Counted (not sent)            │
│    14:00:08 - Counted (not sent)            │
│    14:00:12 - Counted (not sent)            │
│    ...                                      │
│    14:05:00 - Summary alert:                │
│               "15 rate limit failures in    │
│                past 5 minutes"              │
│                                             │
│  Throttle Rules:                            │
│  • Group by error code                      │
│  • Time window: 5 minutes                   │
│  • Max individual alerts: 1 per window      │
│  • Send summary at window end               │
│  • Reset counter after summary              │
│                                             │
└─────────────────────────────────────────────┘
```

### Alert Suppression Use Cases

| Use Case | Suppression Rule | Duration |
|----------|------------------|----------|
| Planned maintenance | Suppress all alerts | Maintenance window |
| Known Meta API issue | Suppress API errors | Until Meta resolves |
| Testing in progress | Suppress test tenant alerts | Test duration |
| Off-hours non-critical | Suppress medium/low | Nighttime hours |

### FailureAlert Model

```
FailureAlert Tracking Model:
┌─────────────────────────────────────────────┐
│                                             │
│  Fields:                                    │
│  • id (PK)                                  │
│  • message_log (FK to MessageLog)           │
│  • error_code (Integer)                     │
│  • severity (Critical/High/Medium/Low)      │
│  • recipients (JSON array)                  │
│  • channels (JSON: email, slack, sms)       │
│  • alert_sent_at (DateTime)                 │
│  • delivery_status (Sent/Failed)            │
│  • acknowledged (Boolean)                   │
│  • acknowledged_by (FK to User)             │
│  • acknowledged_at (DateTime)               │
│  • created_at (DateTime)                    │
│                                             │
│  Purpose:                                   │
│  • Audit trail of all alerts                │
│  • Prevent duplicate alerts                 │
│  • Track alert effectiveness                │
│  • Support acknowledgment workflow          │
│                                             │
└─────────────────────────────────────────────┘
```

### Alert Integration Points

```
Failure Alert Flow:
┌─────────────────────────────────────────────┐
│                                             │
│  Status Update Handler (Task 79)            │
│      │                                      │
│      │ status = 'failed'                    │
│      ▼                                      │
│  send_failure_alert(message_log)            │
│      │                                      │
│      ├─→ Categorize Severity                │
│      │   (Parse error code)                 │
│      │                                      │
│      ├─→ Check Throttle Rules               │
│      │   (Similar alerts recently?)         │
│      │                                      │
│      ├─→ Check Suppression Rules            │
│      │   (Alert suppressed?)                │
│      │                                      │
│      └─→ Send Alerts                        │
│          ├─→ Email (always)                 │
│          ├─→ Slack (high/critical)          │
│          ├─→ SMS (critical only)            │
│          └─→ PagerDuty (critical + oncall)  │
│                                             │
│  Create FailureAlert Record                 │
│  (Audit trail)                              │
│                                             │
└─────────────────────────────────────────────┘
```

### Performance and Rate Limiting

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Alert deduplication | Hash of error + tenant + hour | Prevent duplicates |
| Slack rate limit | Max 1 message per 10 seconds | API limits |
| Email batching | Group similar within 1 minute | Reduce email volume |
| Retry logic | 3 attempts with backoff | Ensure delivery |
| Async sending | Celery task for alerts | Don't block webhook |

### Expected Outcome

- Automated failure alert system triggered on message failures
- Severity-based alert routing to appropriate channels
- Email alerts with detailed failure information
- Slack/webhook integration for real-time notifications
- Alert throttling prevents notification fatigue
- Suppression rules for maintenance and known issues
- FailureAlert model tracks all alerts for audit
- Integration with status update handler

### Verification Checklist

- [ ] send_failure_alert() function created
- [ ] Error code to severity mapping implemented
- [ ] Recipient determination logic
- [ ] Email alert template created
- [ ] Email sending integration
- [ ] Slack webhook integration (optional)
- [ ] Alert throttling logic implemented
- [ ] Suppression rules framework
- [ ] FailureAlert model created
- [ ] Database migration applied
- [ ] Integration with Task 79 handler
- [ ] Async alert sending via Celery

---

## Task 81: Create Webhook Queue

### Overview

Implement asynchronous webhook processing using Celery task queue to handle high-volume webhook traffic reliably. The webhook endpoint (Task 69) should acknowledge requests quickly (< 5 seconds) and queue event processing for background execution. This prevents timeout issues, handles traffic spikes, provides retry capabilities for transient failures, and ensures all webhook events are processed even during high load.

Webhook queuing is essential for production reliability. Meta expects webhook acknowledgment within 20 seconds and will retry if not received. By immediately acknowledging and processing asynchronously, the system remains responsive under load. The queue also provides automatic retry for failed processing, dead-letter queues for permanently failed events, and visibility into processing backlogs.

### Dependencies

- Task 79: Create Status Update Handler (queued task processes this)
- SubPhase-03 (Core Backend) Celery setup must be complete
- Redis or RabbitMQ message broker configured
- Understanding of Celery task patterns

### Instructions

1. **Create Celery task for webhook processing**
   - Define Celery task `process_whatsapp_webhook.delay()`
   - Task accepts webhook payload as parameter
   - Task runs asynchronously in Celery worker process
   - Isolate task logic from webhook view

2. **Modify webhook endpoint to queue events**
   - In webhook POST handler (Task 69), extract payload
   - Validate signature (Task 71) before queuing
   - Queue validated payload to Celery task
   - Return HTTP 200 immediately after queuing
   - Do NOT process synchronously in webhook view

3. **Implement task processing logic**
   - Task extracts status updates from payload (Task 72)
   - For each status update, call status update handler (Task 79)
   - Handle multiple status updates in single webhook
   - Update processing as fast as possible

4. **Configure task retry behavior**
   - Use Celery autoretry_for for transient exceptions
   - Retry on database connection errors
   - Retry on temporary network issues
   - Do not retry on validation errors (permanent failures)
   - Exponential backoff: 1s, 5s, 25s, 125s

5. **Set task timeout**
   - Configure soft timeout at 30 seconds
   - Configure hard timeout at 60 seconds
   - Most webhooks process in < 1 second
   - Timeout prevents stuck tasks blocking workers
   - Timed-out tasks moved to retry or dead-letter queue

6. **Implement task result tracking**
   - Use Celery result backend (Redis)
   - Store task success/failure status
   - Track processing duration
   - Enable monitoring of task completion
   - Results expire after 24 hours

7. **Create dead-letter queue**
   - Configure DLQ for tasks that fail all retries
   - Max retries: 5 attempts
   - Failed tasks moved to DLQ for manual review
   - Create admin interface to view DLQ
   - Enable manual replay of DLQ tasks

8. **Add webhook processing monitoring**
   - Track queue length in Celery monitoring
   - Alert if queue length exceeds threshold (e.g., 1000)
   - Monitor processing rate (tasks/second)
   - Track average processing time
   - Alert on increasing processing time (degradation)

9. **Implement idempotent task processing**
   - Task can be retried safely without side effects
   - Status update handler (Task 79) is idempotent
   - Duplicate task execution doesn't cause errors
   - Safe to process same webhook multiple times
   - Critical for reliability

10. **Add comprehensive task logging**
    - Log task start with payload summary
    - Log each status update processed
    - Log task completion with duration
    - Log retry attempts with reason
    - Log final failure with full details

### Webhook Queue Architecture

```
Asynchronous Webhook Processing:
┌───────────────────────────────────────────────────┐
│                                                   │
│  Meta WhatsApp API                                │
│  │                                                │
│  │ POST webhook event                            │
│  ▼                                                │
│  ┌─────────────────────────────────────────┐    │
│  │  Webhook Endpoint (Task 69)             │    │
│  │                                         │    │
│  │  1. Validate signature (Task 71)        │    │
│  │  2. Queue to Celery                     │    │
│  │  3. Return 200 OK (< 5 seconds)         │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
│               │ Enqueue task                      │
│               ▼                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  Redis / RabbitMQ (Message Broker)      │    │
│  │                                         │    │
│  │  Queued Tasks:                          │    │
│  │  • process_webhook_1 (pending)          │    │
│  │  • process_webhook_2 (pending)          │    │
│  │  • process_webhook_3 (pending)          │    │
│  │  • ...                                  │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
│               │ Celery workers consume tasks      │
│               ▼                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  Celery Worker Pool (Multiple Workers)  │    │
│  │                                         │    │
│  │  Worker 1: Processing task A            │    │
│  │  Worker 2: Processing task B            │    │
│  │  Worker 3: Processing task C            │    │
│  │  Worker 4: Idle                         │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
│               │ Task execution                    │
│               ▼                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  process_whatsapp_webhook Task          │    │
│  │                                         │    │
│  │  1. Parse payload (Task 72)             │    │
│  │  2. Update status (Task 79)             │    │
│  │  3. Send alerts if needed (Task 80)     │    │
│  │  4. Mark task complete                  │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Celery Task Definition

```
Webhook Processing Task:
┌─────────────────────────────────────────────┐
│                                             │
│  @shared_task(                              │
│      bind=True,                             │
│      autoretry_for=(                        │
│          DatabaseError,                     │
│          ConnectionError                    │
│      ),                                     │
│      retry_kwargs={                         │
│          'max_retries': 5,                  │
│          'countdown': 5  # Initial delay    │
│      },                                     │
│      retry_backoff=True,  # Exponential     │
│      retry_jitter=True,   # Random jitter   │
│      time_limit=60,       # Hard timeout    │
│      soft_time_limit=30   # Soft timeout    │
│  )                                          │
│  def process_whatsapp_webhook(self,         │
│                               payload):     │
│      """                                    │
│      Process WhatsApp webhook event         │
│      asynchronously.                        │
│      """                                    │
│                                             │
│      # Extract status updates               │
│      status_updates = handle_message_       │
│          status_event(payload)              │
│                                             │
│      # Process each update                  │
│      for update in status_updates:          │
│          update_message_status(             │
│              message_id=update['id'],       │
│              data=update                    │
│          )                                  │
│                                             │
│      return {                               │
│          'processed': len(status_updates)   │
│      }                                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Queue Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Task name | `notifications.process_whatsapp_webhook` | Unique identifier |
| Queue name | `webhooks` | Dedicated queue |
| Priority | 6 (normal) | Standard priority |
| Max retries | 5 | Retry transient failures |
| Retry delay | Exponential backoff | 1s, 5s, 25s, 125s, 625s |
| Time limit | 60 seconds | Prevent runaway tasks |
| Rate limit | None | Process as fast as possible |
| Result expiry | 24 hours | Clean up old results |

### Retry Strategy

```
Task Retry Logic:
┌─────────────────────────────────────────────┐
│                                             │
│  Attempt 1: Execute immediately             │
│      ↓                                      │
│  [Failure: DatabaseError]                   │
│      ↓                                      │
│  Wait 1 second (countdown=1s)               │
│      ↓                                      │
│  Attempt 2: Retry                           │
│      ↓                                      │
│  [Failure: DatabaseError]                   │
│      ↓                                      │
│  Wait 5 seconds (backoff: 1s * 5)           │
│      ↓                                      │
│  Attempt 3: Retry                           │
│      ↓                                      │
│  [Failure: DatabaseError]                   │
│      ↓                                      │
│  Wait 25 seconds (backoff: 5s * 5)          │
│      ↓                                      │
│  Attempt 4: Retry                           │
│      ↓                                      │
│  [Failure: DatabaseError]                   │
│      ↓                                      │
│  Wait 125 seconds (backoff: 25s * 5)        │
│      ↓                                      │
│  Attempt 5: Retry                           │
│      ↓                                      │
│  [Success] → Task complete                  │
│                                             │
│  If all 5 attempts fail:                    │
│      → Move to Dead Letter Queue (DLQ)      │
│      → Log error                            │
│      → Alert operations team                │
│                                             │
└─────────────────────────────────────────────┘
```

### Synchronous vs Asynchronous Flow

| Aspect | Synchronous (Bad) | Asynchronous (Good) |
|--------|-------------------|---------------------|
| Response time | 500-1000ms | < 50ms |
| Timeout risk | High (if DB slow) | None (immediate ACK) |
| Scalability | Limited by workers | High (queue buffers) |
| Retry capability | None | Built-in |
| Traffic spikes | May fail | Queue absorbs |
| Monitoring | Difficult | Full visibility |

### Dead Letter Queue Handling

```
DLQ Management:
┌─────────────────────────────────────────────┐
│                                             │
│  Task fails 5 times                         │
│      ↓                                      │
│  Move to Dead Letter Queue                  │
│      ↓                                      │
│  Store in FailedWebhookEvent model:         │
│    • payload (original webhook)             │
│    • error_message (exception)              │
│    • retry_count (5)                        │
│    • failed_at (timestamp)                  │
│    • processed (false)                      │
│      ↓                                      │
│  Alert operations team                      │
│      ↓                                      │
│  Manual Review:                             │
│    1. View in admin interface               │
│    2. Investigate root cause                │
│    3. Fix underlying issue (if needed)      │
│    4. Manually replay task                  │
│      ↓                                      │
│  Replay action:                             │
│    • Re-queue task with original payload    │
│    • Mark DLQ entry as processed            │
│    • Monitor new task execution             │
│                                             │
└─────────────────────────────────────────────┘
```

### Monitoring Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Queue length | Number of pending tasks | > 1000 |
| Processing rate | Tasks/second | < 10 (if queue growing) |
| Average duration | Mean task execution time | > 5 seconds |
| Failure rate | % of tasks failing | > 5% |
| Retry rate | % of tasks being retried | > 20% |
| DLQ size | Tasks in dead letter queue | > 10 |
| Worker utilization | % of workers busy | > 90% sustained |

### Queue Scaling Strategy

| Queue Length | Workers | Scaling Action |
|--------------|---------|----------------|
| 0-100 | 2 | Normal operations |
| 100-500 | 4 | Scale up workers |
| 500-1000 | 8 | Alert ops team |
| 1000-5000 | 16 | Emergency scaling |
| > 5000 | 32 | Investigate root cause |

### Expected Outcome

- Celery task for asynchronous webhook processing
- Webhook endpoint queues events immediately
- Fast acknowledgment (< 5 seconds) to Meta
- Automatic retry for transient failures
- Dead-letter queue for permanently failed events
- Comprehensive monitoring of queue health
- Idempotent task processing
- Admin interface for DLQ management

### Verification Checklist

- [ ] Celery task `process_whatsapp_webhook` created
- [ ] Task accepts webhook payload parameter
- [ ] Webhook endpoint modified to queue tasks
- [ ] Immediate HTTP 200 response after queuing
- [ ] Retry behavior configured (max 5, backoff)
- [ ] Timeout limits set (30s soft, 60s hard)
- [ ] Dead-letter queue configured
- [ ] FailedWebhookEvent model created
- [ ] Admin interface for DLQ viewing
- [ ] Monitoring metrics configured
- [ ] Task logging implemented
- [ ] Integration tested with Celery workers

---

## Task 82: Verify Webhook Flow

### Overview

Perform comprehensive end-to-end testing of the complete webhook flow to ensure all components work together correctly. This verification covers webhook delivery from Meta, signature validation, event parsing, status updates, alerting, and queue processing. Testing includes both success paths and failure scenarios, ensuring the system behaves correctly under various conditions and edge cases.

Verification is critical before production deployment. The webhook system is the backbone of delivery tracking, and failures would result in incorrect status information, missed alerts, and degraded user experience. Comprehensive testing across all components and scenarios ensures reliability and builds confidence in the system.

### Dependencies

- Task 81: Create Webhook Queue (complete system)
- All previous tasks (69-81) must be complete
- Test environment with webhook capabilities
- Access to Meta test webhooks or simulation tools

### Instructions

1. **Set up test environment**
   - Configure test Meta app for webhooks
   - Deploy application to publicly accessible URL (ngrok for dev)
   - Configure webhook URL in Meta dashboard
   - Set verify token for webhook verification (Task 70)
   - Ensure Celery workers running for queue processing

2. **Test webhook verification (GET request)**
   - Trigger webhook setup in Meta dashboard
   - Meta sends GET request with hub.mode, hub.verify_token, hub.challenge
   - Verify endpoint returns challenge correctly
   - Confirm webhook status shows "verified" in Meta dashboard
   - Test with incorrect verify token (should fail)

3. **Test signature validation**
   - Send test webhook with valid signature
   - Verify request is accepted (HTTP 200)
   - Send webhook with invalid signature (tampered payload)
   - Verify request is rejected (HTTP 401)
   - Verify failed validation is logged

4. **Test "sent" status webhook**
   - Send test message via WhatsApp API (Group-D)
   - Wait for "sent" webhook from Meta (usually < 5 seconds)
   - Verify webhook received and processed
   - Check MessageLog status updated to "sent"
   - Verify no failure alerts triggered

5. **Test "delivered" status webhook**
   - Use test phone number with immediate delivery
   - Wait for "delivered" webhook
   - Verify MessageLog status updated to "delivered"
   - Verify delivered_at timestamp set correctly
   - Calculate delivery duration (should be seconds)

6. **Test "read" status webhook**
   - Send message to test device
   - Open message on test device
   - Wait for "read" webhook
   - Verify MessageLog status updated to "read"
   - Verify read_at timestamp set correctly

7. **Test "failed" status webhook**
   - Send message to invalid phone number
   - Wait for "failed" webhook
   - Verify MessageLog status updated to "failed"
   - Verify failed_reason populated with error details
   - Verify failure alert triggered (Task 80)
   - Check alert received via email/Slack

8. **Test queue processing**
   - Send multiple messages rapidly (10-20 messages)
   - Verify all webhooks queued successfully
   - Monitor Celery workers processing tasks
   - Verify all MessageLog records updated correctly
   - Check queue drains to zero after processing

9. **Test idempotency**
   - Simulate duplicate webhook delivery (send same webhook twice)
   - Verify second webhook doesn't cause errors
   - Verify MessageLog not updated twice
   - Verify only one alert sent for failures
   - Confirm idempotent processing works correctly

10. **Test error scenarios**
    - Database unavailable during webhook (should retry)
    - Invalid webhook payload structure (should log and skip)
    - Unknown message_id (should log warning)
    - Invalid status transition (should log and skip)
    - Webhook timeout (should complete via queue)
    - Document all edge cases and system behavior

### Webhook Verification Test Plan

```
Comprehensive Test Matrix:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Test 1: Webhook Verification (GET)                │
│  ├─ Valid verify token → Returns challenge         │
│  └─ Invalid verify token → Returns 403             │
│                                                     │
│  Test 2: Signature Validation                      │
│  ├─ Valid signature → Accepts webhook              │
│  ├─ Invalid signature → Rejects 401                │
│  └─ Missing signature → Rejects 401                │
│                                                     │
│  Test 3: Status Update Flow                        │
│  ├─ Send message → "sent" webhook → DB updated     │
│  ├─ Delivery → "delivered" webhook → DB updated    │
│  └─ User reads → "read" webhook → DB updated       │
│                                                     │
│  Test 4: Failure Handling                          │
│  ├─ Invalid phone → "failed" webhook               │
│  ├─ DB updated with failed_reason                  │
│  └─ Alert triggered                                │
│                                                     │
│  Test 5: Queue Processing                          │
│  ├─ Rapid webhooks → All queued                    │
│  ├─ Workers process tasks                          │
│  └─ All updates applied correctly                  │
│                                                     │
│  Test 6: Idempotency                               │
│  ├─ Duplicate webhook → No double update           │
│  └─ No duplicate alerts                            │
│                                                     │
│  Test 7: Error Recovery                            │
│  ├─ Database down → Task retries                   │
│  ├─ Invalid payload → Logged and skipped           │
│  └─ Unknown message_id → Logged warning            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Test Webhook Payloads

```
Sample Test Webhooks:
┌─────────────────────────────────────────────┐
│                                             │
│  "sent" Status Webhook:                     │
│  {                                          │
│    "object": "whatsapp_business_account",   │
│    "entry": [{                              │
│      "id": "BUSINESS_ID",                   │
│      "changes": [{                          │
│        "field": "messages",                 │
│        "value": {                           │
│          "statuses": [{                     │
│            "id": "wamid.TEST123",          │
│            "status": "sent",                │
│            "timestamp": "1640000000",       │
│            "recipient_id": "+94771234567"  │
│          }]                                 │
│        }                                    │
│      }]                                     │
│    }]                                       │
│  }                                          │
│                                             │
│  "failed" Status Webhook:                   │
│  {                                          │
│    "object": "whatsapp_business_account",   │
│    "entry": [{                              │
│      "id": "BUSINESS_ID",                   │
│      "changes": [{                          │
│        "field": "messages",                 │
│        "value": {                           │
│          "statuses": [{                     │
│            "id": "wamid.TEST456",          │
│            "status": "failed",              │
│            "timestamp": "1640000100",       │
│            "recipient_id": "+94999999999",  │
│            "errors": [{                     │
│              "code": 133016,                │
│              "title": "Invalid phone",      │
│              "message": "Phone number..."   │
│            }]                               │
│          }]                                 │
│        }                                    │
│      }]                                     │
│    }]                                       │
│  }                                          │
│                                             │
└─────────────────────────────────────────────┘
```

### Verification Checklist

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Webhook Endpoint | GET verification | Returns challenge | ☐ |
| Webhook Endpoint | POST with valid signature | HTTP 200 | ☐ |
| Signature Validation | Invalid signature | HTTP 401 | ☐ |
| Status Handler | "sent" webhook | Status updated to sent | ☐ |
| Status Handler | "delivered" webhook | Status updated, timestamp set | ☐ |
| Status Handler | "read" webhook | Status updated, timestamp set | ☐ |
| Status Handler | "failed" webhook | Status updated, error stored | ☐ |
| Failure Alert | Failed message | Alert sent | ☐ |
| Queue Processing | Multiple webhooks | All processed | ☐ |
| Idempotency | Duplicate webhook | No double update | ☐ |
| Error Recovery | Database error | Task retried | ☐ |

### Performance Benchmarks

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Webhook response time | < 100ms | ___ ms | ☐ |
| Queue processing rate | > 100/sec | ___ /sec | ☐ |
| End-to-end latency (webhook → DB) | < 2 sec | ___ sec | ☐ |
| Database query time | < 50ms | ___ ms | ☐ |
| Alert delivery time | < 10 sec | ___ sec | ☐ |

### Test Scenarios Documentation

```
Document Test Results:
┌─────────────────────────────────────────────┐
│                                             │
│  Scenario 1: Happy Path                     │
│  Steps:                                     │
│    1. Send message via API                  │
│    2. Webhook "sent" received               │
│    3. Webhook "delivered" received          │
│    4. Webhook "read" received               │
│  Results:                                   │
│    ✓ All webhooks processed                 │
│    ✓ Status updated correctly               │
│    ✓ Timestamps accurate                    │
│    ✓ Total time: 15 seconds                 │
│                                             │
│  Scenario 2: Failure Path                   │
│  Steps:                                     │
│    1. Send to invalid number                │
│    2. Webhook "failed" received             │
│  Results:                                   │
│    ✓ Status updated to failed               │
│    ✓ Error details stored                   │
│    ✓ Alert sent to ops team                 │
│    ✓ Email received in 5 seconds            │
│                                             │
│  Scenario 3: High Volume                    │
│  Steps:                                     │
│    1. Send 50 messages rapidly              │
│    2. All webhooks arrive                   │
│  Results:                                   │
│    ✓ All 50 queued successfully             │
│    ✓ Processed in 8 seconds                 │
│    ✓ No errors or timeouts                  │
│    ✓ All DB records correct                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Common Issues and Resolutions

| Issue | Symptom | Resolution |
|-------|---------|------------|
| Webhook not received | No status updates | Check URL accessible, verify Meta config |
| Signature validation fails | All webhooks rejected | Verify app secret matches |
| Status not updating | Webhooks received but DB unchanged | Check Celery workers running |
| Duplicate updates | Same status set multiple times | Review idempotency logic |
| Alerts not sent | Failures not notified | Check email/Slack config |
| Queue backing up | Tasks accumulating | Scale Celery workers |

### Integration Test Suite

```
Automated Test Suite:
┌─────────────────────────────────────────────┐
│                                             │
│  tests/webhooks/test_webhook_flow.py        │
│                                             │
│  class WhatsAppWebhookFlowTests:            │
│                                             │
│    def test_webhook_verification():         │
│        # Test GET verification              │
│                                             │
│    def test_valid_signature():              │
│        # Test signature validation          │
│                                             │
│    def test_sent_status_update():           │
│        # Test "sent" webhook processing     │
│                                             │
│    def test_delivered_status_update():      │
│        # Test "delivered" processing        │
│                                             │
│    def test_read_status_update():           │
│        # Test "read" processing             │
│                                             │
│    def test_failed_status_update():         │
│        # Test "failed" processing           │
│                                             │
│    def test_failure_alert_triggered():      │
│        # Test alert on failure              │
│                                             │
│    def test_queue_processing():             │
│        # Test async queue                   │
│                                             │
│    def test_idempotency():                  │
│        # Test duplicate webhooks            │
│                                             │
│    def test_invalid_payload():              │
│        # Test error handling                │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome

- Complete webhook flow verified from Meta to database
- Webhook verification (GET) working correctly
- Signature validation accepting valid, rejecting invalid
- All status types (sent/delivered/read/failed) processed correctly
- MessageLog records updated with accurate data
- Failure alerts triggered and delivered
- Queue processing handles multiple concurrent webhooks
- Idempotency prevents duplicate updates
- Error scenarios handled gracefully
- Comprehensive test documentation created

### Final Verification Checklist

- [ ] Test environment configured with accessible webhook URL
- [ ] Meta webhook verification completed
- [ ] GET verification endpoint tested
- [ ] POST webhook endpoint tested with valid signature
- [ ] Invalid signature rejection tested
- [ ] "sent" status webhook processed correctly
- [ ] "delivered" status webhook processed correctly
- [ ] "read" status webhook processed correctly
- [ ] "failed" status webhook processed correctly
- [ ] Failure alert triggered and received
- [ ] Multiple webhooks processed via queue
- [ ] Idempotency verified with duplicate webhooks
- [ ] Database error retry behavior tested
- [ ] Invalid payload handling tested
- [ ] Performance benchmarks met
- [ ] All test scenarios documented
- [ ] Automated test suite created and passing

---

## Summary

This document covered Tasks 79-82, completing the webhook and delivery tracking system for WhatsApp Business API integration. The implementation includes:

**Status Update Processing (Task 79):**
- Handler function that processes webhook events
- Database lookups and updates with row locking
- Status transition validation
- Idempotent implementation for reliability

**Failure Alerting (Task 80):**
- Automated alert system for delivery failures
- Severity-based routing to appropriate channels
- Email and Slack/webhook integrations
- Alert throttling and suppression rules

**Webhook Queue (Task 81):**
- Celery-based asynchronous webhook processing
- Immediate webhook acknowledgment (< 5 seconds)
- Automatic retry with exponential backoff
- Dead-letter queue for permanently failed tasks

**Flow Verification (Task 82):**
- Comprehensive end-to-end testing
- Verification of all status types
- Performance benchmarking
- Error scenario validation

The complete Group-E implementation provides production-ready webhook infrastructure with reliable delivery tracking, proactive failure management, scalable asynchronous processing, and thorough testing. This system enables the application to accurately track WhatsApp message delivery, respond to failures promptly, and maintain high service quality under varying load conditions.

The webhook system integrates with the notification service (Group-D) and sets the foundation for frontend delivery tracking interfaces (Group-F).

