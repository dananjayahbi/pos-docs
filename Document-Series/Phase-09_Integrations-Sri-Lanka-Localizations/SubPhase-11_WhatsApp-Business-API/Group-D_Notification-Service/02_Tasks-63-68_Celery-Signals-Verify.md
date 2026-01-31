# Tasks 63-68: Celery Tasks, Signals, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** D - Notification Service  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Service-Methods.md](01_Tasks-53-62_Service-Methods.md)
- **→ Next Document:** [../Group-E_Webhooks-Delivery/01_Tasks-69-78_Webhook-Handler-Events.md](../Group-E_Webhooks-Delivery/01_Tasks-69-78_Webhook-Handler-Events.md)

---

## Document Overview

This document covers the asynchronous notification infrastructure, including Celery task creation for background message sending, notification queue management, batch and scheduled messaging capabilities, Django signals for automatic notification triggering, and comprehensive verification of the entire notification service. These components enable scalable, reliable, and automated WhatsApp notifications.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create WhatsAppNotificationTask | Medium | 45 min |
| 64 | Create Notification Queue | Medium | 40 min |
| 65 | Create Batch Notifications | Medium | 45 min |
| 66 | Create Scheduled Messages | Medium | 40 min |
| 67 | Create Notification Signals | Medium | 50 min |
| 68 | Verify Notification Service | Low | 60 min |

---

## Task 63: Create WhatsAppNotificationTask

### Overview
Create the WhatsAppNotificationTask as a Celery task to handle asynchronous WhatsApp notification sending. This task wraps the WhatsAppService methods and enables background processing, retry logic, error handling, and monitoring. It ensures notifications don't block critical business operations like order creation or payment processing.

### Dependencies
- Task 62 (Create send_cod_reminder) must be complete
- Celery configured and running
- Redis or message broker configured
- WhatsAppService fully implemented

### Instructions

1. **Create task file structure**
   - Create file at `backend/apps/notifications/tasks/whatsapp_tasks.py`
   - Import Celery app instance
   - Import WhatsAppService
   - Set up task logging

2. **Define base task configuration**
   - Set task name: `notifications.whatsapp.send_notification`
   - Configure max_retries (default: 3)
   - Set retry_backoff (exponential: 60, 120, 240 seconds)
   - Enable task tracking and status updates
   - Set task time limits

3. **Create main notification task**
   - Accept notification_type parameter (order_confirmation, payment_success, etc.)
   - Accept entity_id parameter (order_id, payment_id)
   - Accept optional parameters dictionary
   - Return message ID or error status

4. **Implement entity loading**
   - Load Order model for order-related notifications
   - Load Payment model for payment notifications
   - Handle entity not found errors
   - Validate entity state is appropriate

5. **Instantiate service and send**
   - Create WhatsAppService instance
   - Route to appropriate send method based on notification_type
   - Pass entity object to method
   - Capture return value (message ID)

6. **Implement retry logic**
   - Catch temporary failures (rate limiting, network errors)
   - Retry with exponential backoff
   - Log retry attempts with context
   - Give up after max_retries
   - Alert on permanent failures

7. **Handle different error types**
   - Temporary errors: Retry (network, rate limit, gateway timeout)
   - Permanent errors: Don't retry (invalid phone, opted out, template missing)
   - Log all errors with full context
   - Update notification status in database

8. **Add task monitoring**
   - Emit task started event
   - Track execution time
   - Log success/failure with details
   - Update metrics (success rate, avg latency)
   - Alert on high failure rates

9. **Implement task result storage**
   - Store message ID on success
   - Store error details on failure
   - Link to notification log record
   - Enable webhook correlation
   - Track delivery status updates

10. **Create task wrapper methods**
    - Create convenience methods for each notification type
    - Example: `send_order_confirmation_async(order_id)`
    - Example: `send_payment_success_async(payment_id)`
    - Enqueue task with appropriate parameters
    - Return task ID for tracking

### Celery Task Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Application Layer                          │
│          (Order Creation, Payment Processing, etc.)            │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ Enqueue Task
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                     Celery Task Queue                          │
│                    (Redis/RabbitMQ)                            │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ Dequeue & Execute
                           ▼
┌────────────────────────────────────────────────────────────────┐
│              WhatsAppNotificationTask                          │
│                   (Celery Worker)                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Load Entity (Order/Payment)                               │
│             │                                                  │
│             ▼                                                  │
│  2. Instantiate WhatsAppService                               │
│             │                                                  │
│             ▼                                                  │
│  3. Call Appropriate Send Method                              │
│             │                                                  │
│       ┌─────┴─────┐                                           │
│       │           │                                           │
│    Success     Failure                                        │
│       │           │                                           │
│       ▼           ▼                                           │
│  Log Success  Retry Logic                                     │
│  Store ID     │                                               │
│               ▼                                               │
│         ┌──────────┐                                          │
│         │ Temporary│                                          │
│         │  Error?  │                                          │
│         └──────────┘                                          │
│               │                                               │
│         ┌─────┴─────┐                                         │
│         │           │                                         │
│       Yes          No                                         │
│         │           │                                         │
│         ▼           ▼                                         │
│    Retry with   Log Failure                                  │
│    Backoff      Alert                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  Notification    │
                 │  Log Database    │
                 └──────────────────┘
```

### Task Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **name** | `notifications.whatsapp.send_notification` | Task identifier |
| **max_retries** | 3 | Maximum retry attempts |
| **default_retry_delay** | 60 seconds | Initial retry delay |
| **retry_backoff** | True | Exponential backoff |
| **retry_backoff_max** | 600 seconds | Maximum backoff |
| **time_limit** | 120 seconds | Hard time limit |
| **soft_time_limit** | 90 seconds | Soft time limit |
| **acks_late** | True | Acknowledge after completion |

### Notification Type Routing

| notification_type | Entity Model | Service Method | Priority |
|-------------------|--------------|----------------|----------|
| order_confirmation | Order | send_order_confirmation | high |
| payment_success | Payment | send_payment_success | high |
| payment_failed | Payment | send_payment_failed | medium |
| order_shipped | Order | send_shipped | medium |
| out_for_delivery | Order | send_out_for_delivery | very_high |
| order_delivered | Order | send_delivered | medium |
| cod_reminder | Order | send_cod_reminder | medium |

### Error Classification

| Error Type | Classification | Retry? | Example |
|------------|----------------|--------|---------|
| Network timeout | Temporary | **Yes** | Connection timeout |
| Rate limiting | Temporary | **Yes** | 429 Too Many Requests |
| Gateway timeout | Temporary | **Yes** | 504 Gateway Timeout |
| Invalid phone | Permanent | **No** | Phone number invalid |
| Customer opted out | Permanent | **No** | No consent |
| Template not found | Permanent | **No** | Template missing |
| Template rejected | Permanent | **No** | Template not approved |

### Task Wrapper Examples

**Synchronous Call (Blocks):**
```
In Order Creation:
- Create order
- Process payment
- Send notification (blocks 2-3 seconds)
- Return response

Total time: 5+ seconds
```

**Asynchronous Call (Non-blocking):**
```
In Order Creation:
- Create order
- Process payment
- Enqueue notification task (< 10ms)
- Return response

Total time: 2 seconds
Notification sent in background
```

### Expected Outcome
- Celery task created and functional
- Async notification sending working
- Retry logic handling temporary failures
- Errors classified and handled appropriately
- Task monitoring and logging in place
- Wrapper methods available for easy use

### Verification Checklist
- [ ] Task file created at correct location
- [ ] Celery task decorator configured
- [ ] Entity loading working for all types
- [ ] Routing to correct service methods
- [ ] Retry logic implemented with backoff
- [ ] Error classification working
- [ ] Temporary errors retried
- [ ] Permanent errors logged and not retried
- [ ] Task monitoring emitting metrics
- [ ] Wrapper methods created for convenience
- [ ] Task IDs returned for tracking

---

## Task 64: Create Notification Queue

### Overview
Create a notification queue management system to handle notification priorities, rate limiting, and queue monitoring. This system ensures high-priority messages (payment, delivery) are sent first, prevents rate limit violations, and provides visibility into queue health. It coordinates with Celery to manage message flow efficiently.

### Dependencies
- Task 63 (Create WhatsAppNotificationTask) must be complete
- Celery routing configured
- Redis available for queue management
- Rate limit policies defined

### Instructions

1. **Define queue structure**
   - Create priority-based queues (high, medium, low)
   - Configure Celery routing for each priority
   - Set up queue monitoring
   - Define queue size limits

2. **Configure Celery routing**
   - Route order_confirmation to high priority queue
   - Route payment_success to high priority queue
   - Route out_for_delivery to very high priority queue
   - Route shipped, delivered to medium priority queue
   - Route cod_reminder to medium priority queue
   - Route bulk messages to low priority queue

3. **Implement rate limiting**
   - Limit messages per customer per hour
   - Limit total messages per tenant per hour
   - Implement global rate limits per WhatsApp Business Account
   - Use Redis for distributed rate limiting
   - Return rate limit status to caller

4. **Create queue manager class**
   - Create NotificationQueueManager
   - Implement enqueue method with priority
   - Implement rate limit checking before enqueue
   - Implement queue status queries
   - Implement queue flushing for emergencies

5. **Add priority queueing logic**
   - Check priority parameter
   - Select appropriate queue
   - Apply rate limiting checks
   - Enqueue task to correct queue
   - Return queue position if needed

6. **Implement queue monitoring**
   - Track queue lengths for each priority
   - Monitor processing rates
   - Alert on queue backlogs
   - Track average wait times
   - Expose metrics for dashboards

7. **Handle queue overflow**
   - Define max queue sizes
   - Implement overflow handling (reject or delay)
   - Log overflow events
   - Alert administrators
   - Provide backpressure signals

8. **Create dead letter queue**
   - Route repeatedly failed tasks to DLQ
   - Store failed task details for analysis
   - Implement manual retry from DLQ
   - Monitor DLQ size
   - Alert on DLQ growth

9. **Implement queue prioritization**
   - Process very_high queue first
   - Then high priority queue
   - Then medium priority queue
   - Finally low priority queue
   - Ensure lower priorities not starved

10. **Add queue statistics and reporting**
    - Track enqueued vs processed messages
    - Calculate success vs failure rates
    - Monitor average latency per queue
    - Generate queue health reports
    - Enable operational dashboards

### Queue Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                   NotificationQueueManager                     │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ Enqueue with Priority
                           ▼
          ┌────────────────────────────────┐
          │    Rate Limit Check            │
          │    (Customer + Tenant)         │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Within Limit         Exceeded
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ Route to     │   │ Reject or    │
          │ Queue        │   │ Delay        │
          └──────────────┘   └──────────────┘
                 │
                 ▼
     ┌───────────────────────────┐
     │   Celery Queue System     │
     ├───────────────────────────┤
     │                           │
     │  ┌─────────────────────┐  │
     │  │  Very High Priority │  │ ← out_for_delivery
     │  │  (Process first)    │  │
     │  └─────────────────────┘  │
     │           │               │
     │  ┌─────────────────────┐  │
     │  │   High Priority     │  │ ← order_confirmation
     │  │                     │  │   payment_success
     │  └─────────────────────┘  │
     │           │               │
     │  ┌─────────────────────┐  │
     │  │  Medium Priority    │  │ ← shipped, delivered
     │  │                     │  │   cod_reminder
     │  └─────────────────────┘  │
     │           │               │
     │  ┌─────────────────────┐  │
     │  │   Low Priority      │  │ ← batch, scheduled
     │  │                     │  │
     │  └─────────────────────┘  │
     │                           │
     └───────────────────────────┘
                 │
                 ▼
     ┌───────────────────────────┐
     │    Celery Workers         │
     │    Process Tasks          │
     └───────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
    Success            Failure
       │                   │
       ▼                   ▼
    Ack Task      ┌──────────────┐
    Complete      │ Retry Queue  │
                  │ or DLQ       │
                  └──────────────┘
```

### Queue Priority Matrix

| Notification Type | Priority | Queue Name | Max Wait Time | Typical Processing |
|-------------------|----------|------------|---------------|-------------------|
| out_for_delivery | **Very High** | `whatsapp_notifications_urgent` | 30 seconds | Immediate |
| order_confirmation | High | `whatsapp_notifications_high` | 2 minutes | < 1 minute |
| payment_success | High | `whatsapp_notifications_high` | 2 minutes | < 1 minute |
| payment_failed | Medium | `whatsapp_notifications_medium` | 5 minutes | 2-3 minutes |
| order_shipped | Medium | `whatsapp_notifications_medium` | 5 minutes | 2-3 minutes |
| order_delivered | Medium | `whatsapp_notifications_medium` | 10 minutes | 5 minutes |
| cod_reminder | Medium | `whatsapp_notifications_medium` | 10 minutes | 5 minutes |
| bulk_messages | Low | `whatsapp_notifications_low` | 1 hour | Background |

### Rate Limiting Configuration

| Limit Type | Limit | Time Window | Scope | Action on Exceed |
|------------|-------|-------------|-------|------------------|
| **Per Customer** | 10 messages | 1 hour | Customer ID | Delay message |
| **Per Tenant** | 1000 messages | 1 hour | Tenant ID | Queue for next window |
| **Per Phone** | 5 messages | 5 minutes | Phone number | Reject duplicate |
| **Global** | 10000 messages | 1 hour | WhatsApp Account | Alert & throttle |

### Rate Limit Storage (Redis)

| Key Pattern | Value | TTL | Purpose |
|-------------|-------|-----|---------|
| `rate:customer:{id}` | Counter | 3600 sec | Customer message count |
| `rate:tenant:{id}` | Counter | 3600 sec | Tenant message count |
| `rate:phone:{number}` | Counter | 300 sec | Phone number message count |
| `rate:global` | Counter | 3600 sec | Total message count |

### Queue Monitoring Metrics

| Metric | Description | Alert Threshold | Action |
|--------|-------------|-----------------|--------|
| **Queue Length** | Number of pending tasks | > 1000 messages | Scale workers |
| **Processing Rate** | Messages/minute | < 10 msg/min | Check worker health |
| **Wait Time** | Avg time in queue | > 10 minutes | Scale workers |
| **Failure Rate** | % of failed tasks | > 5% | Investigate errors |
| **DLQ Size** | Dead letter queue size | > 100 messages | Manual intervention |

### Expected Outcome
- Priority-based queue system operational
- Rate limiting preventing violations
- Queue monitoring providing visibility
- High-priority messages processed first
- Queue overflow handled gracefully
- Dead letter queue catching failures

### Verification Checklist
- [ ] Priority queues configured in Celery
- [ ] Routing working for each notification type
- [ ] Rate limiting checks in place
- [ ] Redis-based rate limit counters working
- [ ] Queue manager class implemented
- [ ] Priority logic functioning correctly
- [ ] Queue monitoring metrics being collected
- [ ] Queue length alerts configured
- [ ] Dead letter queue capturing failures
- [ ] Queue statistics available for reporting

---

## Task 65: Create Batch Notifications

### Overview
Create batch notification capabilities to send WhatsApp messages to multiple customers efficiently. This feature is essential for scenarios like promotional campaigns, order status updates for multiple orders, or announcements. It includes batching logic, progress tracking, and failure handling for large-scale message sending.

### Dependencies
- Task 64 (Create Notification Queue) must be complete
- Low priority queue configured
- Batch size limits defined
- WhatsApp Business API rate limits understood

### Instructions

1. **Define batch notification structure**
   - Create BatchNotification model to track batches
   - Store batch metadata (name, type, target count)
   - Track batch status (pending, processing, completed, failed)
   - Store batch results (success count, failure count)

2. **Create batch enqueue method**
   - Accept list of recipient IDs or criteria
   - Accept notification_type and parameters
   - Validate batch size within limits
   - Create batch tracking record
   - Return batch ID for monitoring

3. **Implement batch processing logic**
   - Split large batches into chunks
   - Enqueue chunks to low priority queue
   - Process chunks sequentially or with delays
   - Track progress per chunk
   - Update batch status in real-time

4. **Add batch rate limiting**
   - Respect per-recipient rate limits
   - Implement delays between chunks
   - Avoid triggering global rate limits
   - Calculate estimated completion time
   - Provide progress updates

5. **Handle recipient filtering**
   - Filter out customers who opted out
   - Validate phone numbers before enqueue
   - Check customer eligibility
   - Remove duplicates from batch
   - Log filtered recipients with reasons

6. **Implement progress tracking**
   - Track messages sent vs total
   - Calculate success rate during processing
   - Update batch record with progress
   - Emit progress events for UI updates
   - Store detailed results per recipient

7. **Handle batch failures**
   - Track individual message failures
   - Continue processing despite failures
   - Store failure reasons per recipient
   - Generate failure report at completion
   - Enable retry of failed messages only

8. **Create batch templates**
   - Support parameterized templates for batches
   - Replace placeholders per recipient
   - Validate template parameters
   - Handle missing parameters gracefully
   - Log template rendering errors

9. **Implement batch prioritization**
   - Allow urgent batch promotion
   - Pause non-urgent batches
   - Resume paused batches
   - Cancel in-progress batches
   - Handle batch conflicts

10. **Generate batch reports**
    - Create summary report on completion
    - Include success/failure counts
    - List failed recipients with reasons
    - Calculate delivery rates
    - Provide actionable insights

### Batch Notification Flow

```
┌────────────────────────────────────────────────────────────────┐
│                 create_batch_notification()                    │
│         (recipients, notification_type, params)                │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Batch               │
          │   - Size within limits         │
          │   - Valid notification type    │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Create Batch Record          │
          │   Status: pending              │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Filter Recipients            │
          │   - Remove opted out           │
          │   - Validate phones            │
          │   - Remove duplicates          │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Split into Chunks            │
          │   (e.g., 100 per chunk)        │
          └────────────────────────────────┘
                           │
                           ▼
        ┌────────────────────────────────────┐
        │    Process Chunks Sequentially     │
        └────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    For Each Chunk        Add Delay
          │                     │
          ▼                     │
┌──────────────────────┐        │
│  Enqueue Messages    │        │
│  to Low Priority     │◄───────┘
│  Queue               │
└──────────────────────┘
          │
          ▼
┌──────────────────────┐
│  Track Progress      │
│  Update Batch Status │
└──────────────────────┘
          │
    ┌─────┴─────┐
    │           │
All Done    In Progress
    │           │
    ▼           ▼
┌─────────┐  Monitor
│ Generate│  Continue
│ Report  │
└─────────┘
```

### Batch Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **max_batch_size** | 10,000 | Maximum recipients per batch |
| **chunk_size** | 100 | Recipients per chunk |
| **chunk_delay** | 60 seconds | Delay between chunks |
| **batch_timeout** | 24 hours | Maximum batch duration |
| **retry_failures** | True | Retry failed messages |
| **max_retries** | 1 | Maximum retry attempts |

### Batch Types & Use Cases

| Batch Type | Use Case | Priority | Typical Size | Example |
|------------|----------|----------|--------------|---------|
| **Promotional** | Marketing campaigns | Low | 1,000 - 10,000 | New product launch |
| **Order Updates** | Bulk order status | Medium | 100 - 1,000 | Multiple orders shipped |
| **Announcements** | Service alerts | Medium | 500 - 5,000 | Store holiday hours |
| **Reminders** | Payment/COD reminders | Medium | 50 - 500 | COD orders tomorrow |

### Batch Progress Tracking

| Stage | Status | Progress % | Description |
|-------|--------|------------|-------------|
| **Created** | pending | 0% | Batch created, not started |
| **Filtering** | preparing | 5% | Filtering recipients |
| **Chunking** | preparing | 10% | Splitting into chunks |
| **Processing** | processing | 10-90% | Sending messages |
| **Completed** | completed | 100% | All messages processed |
| **Failed** | failed | varies | Batch failed critically |

### Batch Result Structure

```
Batch Report:
- Batch ID: BATCH-2026-001234
- Type: Promotional Campaign
- Created: 31 Jan 2026, 10:00 AM
- Started: 31 Jan 2026, 10:15 AM
- Completed: 31 Jan 2026, 12:45 PM
- Duration: 2 hours 30 minutes

Recipients:
- Total: 5,000
- Filtered Out: 250 (opted out or invalid)
- Attempted: 4,750

Results:
- Successful: 4,500 (94.7%)
- Failed: 250 (5.3%)

Failure Breakdown:
- Invalid phone: 120
- Rate limited: 80
- Network errors: 50

Estimated Delivery: 4,400 (97.8% of successful sends)
```

### Expected Outcome
- Batch notification system functional
- Large-scale message sending working
- Progress tracking providing visibility
- Failures handled without stopping batch
- Reports generated with insights
- Rate limits respected during batching

### Verification Checklist
- [ ] BatchNotification model created
- [ ] Batch enqueue method implemented
- [ ] Recipient filtering working
- [ ] Batch split into chunks
- [ ] Chunks processed with delays
- [ ] Progress tracking updating in real-time
- [ ] Individual failures not stopping batch
- [ ] Success/failure counts accurate
- [ ] Batch reports generated
- [ ] Rate limits respected during batching

---

## Task 66: Create Scheduled Messages

### Overview
Create scheduled message capabilities to send WhatsApp notifications at specific future times. This feature enables pre-scheduling of reminders, announcements, and time-sensitive notifications. It includes scheduling logic, schedule management, cancellation, and execution at the specified time.

### Dependencies
- Task 64 (Create Notification Queue) must be complete
- Celery beat for scheduled tasks configured
- Scheduled task storage implemented
- Timezone handling configured

### Instructions

1. **Create scheduled message model**
   - Create ScheduledWhatsAppMessage model
   - Store scheduled_time (when to send)
   - Store notification_type and parameters
   - Store recipient information
   - Track status (scheduled, sent, cancelled, failed)

2. **Implement schedule creation**
   - Accept notification_type, parameters, recipient
   - Accept scheduled_time (future timestamp)
   - Validate scheduled_time is in future
   - Create scheduled message record
   - Return schedule ID for management

3. **Configure Celery beat scheduler**
   - Create periodic task to check scheduled messages
   - Run every minute or configurable interval
   - Query messages with scheduled_time <= now
   - Enqueue messages for immediate sending
   - Update status to sent or failed

4. **Implement timezone handling**
   - Store scheduled_time in UTC
   - Accept user timezone for input
   - Convert to UTC for storage
   - Display in user timezone
   - Handle DST transitions

5. **Add schedule management**
   - Implement get_schedule method (retrieve details)
   - Implement update_schedule method (change time or params)
   - Implement cancel_schedule method (cancel before sending)
   - Implement list_schedules method (view all scheduled)
   - Prevent modification of sent messages

6. **Create schedule validation**
   - Validate scheduled_time is at least 5 minutes in future
   - Validate recipient eligibility at schedule time
   - Re-check opt-in status before sending
   - Validate template still exists and approved
   - Handle validation failures gracefully

7. **Implement recurring schedules**
   - Support daily, weekly, monthly recurrence
   - Create next occurrence after sending
   - Handle recurrence end conditions
   - Pause and resume recurring schedules
   - Delete recurring schedules

8. **Add schedule monitoring**
   - Track scheduled message counts
   - Monitor execution accuracy (sent on time)
   - Alert on delayed executions
   - Track cancellation rates
   - Generate schedule effectiveness reports

9. **Handle execution failures**
   - Retry failed scheduled sends
   - Log failure reasons with context
   - Alert on repeated failures
   - Provide manual retry option
   - Don't reschedule permanently failed messages

10. **Implement bulk scheduling**
    - Schedule multiple messages at once
    - Support CSV import for schedules
    - Validate all schedules before creation
    - Provide bulk cancellation
    - Generate bulk scheduling reports

### Scheduled Message Flow

```
┌────────────────────────────────────────────────────────────────┐
│            schedule_notification(type, params,                 │
│                    recipient, scheduled_time)                  │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate scheduled_time      │
          │   - Future timestamp           │
          │   - At least 5 min ahead       │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Convert to UTC               │
          │   Store in Database            │
          │   Status: scheduled            │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Return Schedule ID           │
          └────────────────────────────────┘

─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ Time Passes ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

          ┌────────────────────────────────┐
          │   Celery Beat Periodic Task    │
          │   (Runs every minute)          │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Query Scheduled Messages     │
          │   WHERE scheduled_time <= NOW  │
          │   AND status = 'scheduled'     │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
          Found Messages       No Messages
                 │                   │
                 ▼                   ▼
     ┌────────────────────┐    Sleep
     │  For Each Message  │    Continue
     └────────────────────┘
                 │
                 ▼
     ┌────────────────────────────┐
     │  Re-validate Recipient     │
     │  - Check opt-in            │
     │  - Verify phone            │
     └────────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
    Valid            Invalid
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────┐
│ Enqueue Task │   │ Mark Failed  │
│ for Sending  │   │ Log Reason   │
└──────────────┘   └──────────────┘
       │
       ▼
┌──────────────┐
│ Update Status│
│ to 'sent'    │
└──────────────┘
```

### Scheduled Message Model

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **id** | UUID | Unique schedule ID | `SCHED-2026-ABC123` |
| **notification_type** | String | Type of notification | `cod_reminder` |
| **recipient_id** | Foreign Key | Customer ID | `12345` |
| **parameters** | JSON | Notification parameters | `{"order_id": 67890}` |
| **scheduled_time** | DateTime (UTC) | When to send | `2026-02-01 08:00:00 UTC` |
| **status** | Enum | Current status | `scheduled`, `sent`, `cancelled` |
| **created_at** | DateTime | When scheduled | `2026-01-31 15:30:00 UTC` |
| **sent_at** | DateTime | When actually sent | `2026-02-01 08:00:15 UTC` |
| **is_recurring** | Boolean | Recurring schedule | `False` |
| **recurrence_rule** | String | Recurrence pattern | `daily`, `weekly` |

### Scheduling Use Cases

| Use Case | Schedule Type | Timing | Example |
|----------|---------------|--------|---------|
| **COD Reminder** | One-time | Morning of delivery | Schedule at 8 AM delivery day |
| **Payment Reminder** | One-time | 1 day before due | Schedule 24 hours before |
| **Promotional** | One-time | Campaign launch | Schedule for specific date/time |
| **Daily Summary** | Recurring | Every day 6 PM | Daily order summary |
| **Weekly Update** | Recurring | Every Monday 9 AM | Weekly inventory update |

### Schedule Validation Rules

| Validation | Rule | Reason |
|------------|------|--------|
| **Minimum Lead Time** | At least 5 minutes | Ensure processing time |
| **Maximum Lead Time** | Up to 90 days | Prevent outdated schedules |
| **Opt-in Check** | Revalidate before send | Respect customer preferences |
| **Template Validation** | Check exists and approved | Prevent send failures |
| **Recipient Active** | Verify customer active | Avoid sending to deleted customers |

### Celery Beat Configuration

| Task | Schedule | Purpose |
|------|----------|---------|
| **check_scheduled_messages** | Every 1 minute | Find and enqueue due messages |
| **cleanup_old_schedules** | Daily at 2 AM | Archive sent/cancelled > 90 days |
| **validate_future_schedules** | Every 6 hours | Ensure future schedules still valid |

### Expected Outcome
- Scheduled message system operational
- Messages sent at specified times
- Schedule management working (create, update, cancel)
- Recurring schedules functioning
- Execution monitoring providing accuracy data
- Failed schedules handled and logged

### Verification Checklist
- [ ] ScheduledWhatsAppMessage model created
- [ ] Schedule creation method implemented
- [ ] Timezone conversion working correctly
- [ ] Celery beat task configured and running
- [ ] Scheduled messages queried and enqueued
- [ ] Opt-in revalidation before sending
- [ ] Schedule cancellation working
- [ ] Recurring schedules creating next occurrence
- [ ] Execution timing accurate (within 1-2 min)
- [ ] Failed executions logged and retried
- [ ] Bulk scheduling supported

---

## Task 67: Create Notification Signals

### Overview
Create Django signals to automatically trigger WhatsApp notifications when specific events occur in the system. This decouples notification logic from business logic, enabling automatic notifications for order status changes, payment events, and other triggers without explicit calls in the business code.

### Dependencies
- Task 53 (Create WhatsAppService) must be complete
- Django signals framework understood
- Order and Payment models with signals
- Signal handlers configured

### Instructions

1. **Create signals module**
   - Create file at `backend/apps/notifications/signals/whatsapp_signals.py`
   - Import Django signal decorators
   - Import Order and Payment models
   - Import WhatsAppNotificationTask

2. **Define order creation signal handler**
   - Listen to Order post_save signal
   - Check if new order (created=True)
   - Check if order status is confirmed or paid
   - Enqueue send_order_confirmation_async
   - Log signal trigger

3. **Define payment success signal handler**
   - Listen to Payment post_save signal
   - Check if payment status changed to success
   - Verify payment wasn't already notified
   - Enqueue send_payment_success_async
   - Mark payment as notified

4. **Define payment failed signal handler**
   - Listen to Payment post_save signal
   - Check if payment status changed to failed
   - Verify failure notification not already sent
   - Enqueue send_payment_failed_async
   - Log failure notification

5. **Define order shipped signal handler**
   - Listen to Order post_save signal
   - Check if status changed to shipped
   - Verify tracking number exists
   - Enqueue send_shipped_async
   - Update notification status

6. **Define out for delivery signal handler**
   - Listen to Order post_save signal
   - Check if status changed to out_for_delivery
   - Verify estimated arrival time exists
   - Enqueue send_out_for_delivery_async with high priority
   - Log out for delivery notification

7. **Define order delivered signal handler**
   - Listen to Order post_save signal
   - Check if status changed to delivered
   - Verify delivered_at timestamp exists
   - Enqueue send_delivered_async
   - Mark order as notification complete

8. **Implement conditional logic**
   - Check customer opt-in before enqueuing
   - Skip notification if customer opted out
   - Verify required data exists before triggering
   - Handle errors without breaking signal flow
   - Log skipped notifications with reasons

9. **Add signal configuration**
   - Register signals in AppConfig.ready() method
   - Ensure signals only registered once
   - Handle signal registration errors
   - Document signal dependencies
   - Test signal isolation

10. **Implement signal monitoring**
    - Track signal trigger counts
    - Monitor notification enqueue success rate
    - Alert on signal failures
    - Log signal execution time
    - Detect signal loops or duplicates

### Signal Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Business Operations                        │
│          (Order Creation, Payment Processing, etc.)            │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ Emit Django Signal
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                      Django Signals                            │
│                   (post_save, pre_save)                        │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ Trigger Handler
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                 WhatsApp Signal Handlers                       │
│              (whatsapp_signals.py)                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Order Created → order_created_handler                     │
│         │                                                      │
│         ▼                                                      │
│     Check conditions (is new, is confirmed)                   │
│         │                                                      │
│         ▼                                                      │
│     Enqueue send_order_confirmation_async                     │
│                                                                │
│  2. Payment Success → payment_success_handler                 │
│         │                                                      │
│         ▼                                                      │
│     Check status changed & not notified                       │
│         │                                                      │
│         ▼                                                      │
│     Enqueue send_payment_success_async                        │
│                                                                │
│  3. Order Shipped → order_shipped_handler                     │
│         │                                                      │
│         ▼                                                      │
│     Check status changed & has tracking                       │
│         │                                                      │
│         ▼                                                      │
│     Enqueue send_shipped_async                                │
│                                                                │
│  (Similar for other events...)                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ Enqueue Tasks
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                    Celery Task Queue                           │
│             (Background notification sending)                  │
└────────────────────────────────────────────────────────────────┘
```

### Signal Handler Mapping

| Event | Signal | Handler Function | Notification Method | Priority |
|-------|--------|------------------|---------------------|----------|
| Order Created | Order.post_save | order_created_handler | send_order_confirmation | High |
| Payment Success | Payment.post_save | payment_success_handler | send_payment_success | High |
| Payment Failed | Payment.post_save | payment_failed_handler | send_payment_failed | Medium |
| Order Shipped | Order.post_save | order_shipped_handler | send_shipped | Medium |
| Out for Delivery | Order.post_save | out_for_delivery_handler | send_out_for_delivery | Very High |
| Order Delivered | Order.post_save | order_delivered_handler | send_delivered | Medium |

### Conditional Logic Example

**Order Created Handler:**
```
Handler Flow:
1. Check if created=True (new instance)
2. Check if order.status in ['confirmed', 'paid']
3. Check if order.customer exists
4. Check if order.customer.phone_number exists
5. Check if notification_sent=False
6. Enqueue send_order_confirmation_async(order.id)
7. Mark order.confirmation_notification_sent=True
8. Save order (update_fields to avoid recursion)
```

**Payment Status Change Handler:**
```
Handler Flow:
1. Check if instance exists in database (not new)
2. Get previous status from database
3. Check if status changed from != 'success' to 'success'
4. Check if payment.notification_sent=False
5. Enqueue send_payment_success_async(payment.id)
6. Mark payment.notification_sent=True
7. Save payment
```

### Signal Registration

**In notifications/apps.py:**
```
Location: backend/apps/notifications/apps.py

NotificationsConfig class:
- Override ready() method
- Import whatsapp_signals module
- Signals auto-register on import
- Log signal registration success
- Handle import errors gracefully
```

### Signal Safety Measures

| Measure | Purpose | Implementation |
|---------|---------|----------------|
| **Notification Flag** | Prevent duplicate notifications | Add `{type}_notification_sent` field to models |
| **Status Tracking** | Detect status changes | Query previous status from database |
| **Error Handling** | Prevent signal failures breaking business logic | Wrap handler in try-except |
| **Async Enqueue** | Don't block business operations | Enqueue to Celery, don't send directly |
| **Idempotency** | Handle duplicate signals | Check notification status before enqueue |

### Expected Outcome
- Django signals triggering notifications automatically
- Order lifecycle notifications sent without explicit calls
- Payment notifications triggered on status change
- Signal handlers preventing duplicate notifications
- Errors in signals not breaking business operations
- Signal execution monitored and logged

### Verification Checklist
- [ ] Signal handlers file created
- [ ] Order created signal triggering confirmation
- [ ] Payment success signal triggering notification
- [ ] Payment failed signal triggering notification
- [ ] Order shipped signal triggering notification
- [ ] Out for delivery signal triggering notification
- [ ] Order delivered signal triggering notification
- [ ] Conditional logic preventing duplicates
- [ ] Notification flags updating correctly
- [ ] Signals registered in AppConfig.ready()
- [ ] Error handling preventing business logic breaks
- [ ] Signal monitoring tracking triggers

---

## Task 68: Verify Notification Service

### Overview
Perform comprehensive verification of the entire WhatsApp notification service, including all service methods, Celery tasks, queue management, batch and scheduled notifications, and Django signals. This verification ensures the system works end-to-end, handles errors gracefully, respects rate limits, and provides reliable notification delivery.

### Dependencies
- Task 67 (Create Notification Signals) must be complete
- All previous tasks in Group D completed
- Test environment with WhatsApp Business API sandbox
- Test data (orders, payments, customers)

### Instructions

1. **Verify WhatsAppService methods**
   - Test check_opt_in with opted-in and opted-out customers
   - Test get_language for all supported languages (en, si, ta)
   - Test each send method (order_confirmation through cod_reminder)
   - Verify parameters formatted correctly
   - Confirm message IDs returned on success

2. **Verify Celery task execution**
   - Enqueue WhatsAppNotificationTask manually
   - Verify task executes and completes
   - Test retry logic with simulated failures
   - Verify error classification (temporary vs permanent)
   - Confirm task results stored correctly

3. **Verify queue management**
   - Test priority routing (messages go to correct queue)
   - Verify rate limiting prevents excess messages
   - Test queue monitoring metrics accuracy
   - Verify dead letter queue captures failed tasks
   - Test queue overflow handling

4. **Verify batch notifications**
   - Create batch with 100 test recipients
   - Verify recipient filtering (opt-out, invalid phones)
   - Monitor batch progress tracking
   - Verify individual failures don't stop batch
   - Review batch completion report

5. **Verify scheduled messages**
   - Schedule message for 5 minutes in future
   - Verify message sent at scheduled time
   - Test schedule cancellation before send time
   - Verify recurring schedules create next occurrence
   - Test timezone conversion accuracy

6. **Verify Django signals**
   - Create test order and verify confirmation sent
   - Mark payment as successful and verify notification
   - Change order status to shipped and verify notification
   - Update order to delivered and verify notification
   - Verify duplicate notifications prevented

7. **Test error handling**
   - Simulate network failures and verify retries
   - Test invalid phone number handling
   - Verify opted-out customer skipped
   - Test missing template handling
   - Verify rate limit errors handled gracefully

8. **Test multi-language support**
   - Set customer language to English and verify template
   - Set customer language to Sinhala and verify template
   - Set customer language to Tamil and verify template
   - Verify fallback to English for unsupported languages
   - Test Unicode character handling

9. **Verify monitoring and logging**
   - Check logs for all notification attempts
   - Verify success/failure counts accurate
   - Test alert triggers on high failure rates
   - Verify queue metrics updating in real-time
   - Check notification history in database

10. **Perform end-to-end integration test**
    - Create complete order flow (place order → payment → ship → deliver)
    - Verify notifications sent at each stage
    - Check timing and sequencing
    - Verify webhook updates correlate with messages
    - Generate test summary report

### Verification Test Matrix

| Component | Test Case | Expected Outcome | Status |
|-----------|-----------|------------------|--------|
| **WhatsAppService** | check_opt_in with active opt-in | Returns True | ☐ |
| **WhatsAppService** | check_opt_in with opted-out customer | Returns False | ☐ |
| **WhatsAppService** | get_language with preference set | Returns correct code | ☐ |
| **WhatsAppService** | send_order_confirmation | Message sent, ID returned | ☐ |
| **WhatsAppService** | send_payment_success | Message sent, ID returned | ☐ |
| **WhatsAppService** | send_shipped with tracking | Message sent, tracking URL | ☐ |
| **WhatsAppService** | send_out_for_delivery | High priority, sent immediately | ☐ |
| **WhatsAppService** | send_delivered | Message sent with review link | ☐ |
| **WhatsAppService** | send_cod_reminder | COD amount formatted correctly | ☐ |
| **Celery Task** | Task execution | Completes successfully | ☐ |
| **Celery Task** | Retry on network error | Retries with backoff | ☐ |
| **Celery Task** | No retry on invalid phone | Fails without retry | ☐ |
| **Queue** | High priority message | Processed before low priority | ☐ |
| **Queue** | Rate limit check | Excess messages delayed | ☐ |
| **Queue** | Dead letter queue | Failed tasks routed to DLQ | ☐ |
| **Batch** | 100 recipient batch | All eligible recipients processed | ☐ |
| **Batch** | Opt-out filtering | Opted-out customers skipped | ☐ |
| **Batch** | Progress tracking | Accurate counts during processing | ☐ |
| **Batch** | Completion report | Report generated with stats | ☐ |
| **Scheduled** | Schedule for future | Message sent at scheduled time | ☐ |
| **Scheduled** | Cancel schedule | Message not sent after cancel | ☐ |
| **Scheduled** | Recurring schedule | Next occurrence created | ☐ |
| **Signals** | Order created | Confirmation notification sent | ☐ |
| **Signals** | Payment success | Success notification sent | ☐ |
| **Signals** | Order shipped | Shipped notification sent | ☐ |
| **Signals** | Duplicate prevention | Second signal doesn't send again | ☐ |
| **Multi-lang** | English template | Correct English message sent | ☐ |
| **Multi-lang** | Sinhala template | Correct Sinhala message sent | ☐ |
| **Multi-lang** | Tamil template | Correct Tamil message sent | ☐ |
| **Error Handling** | Network timeout | Retry triggered | ☐ |
| **Error Handling** | Invalid phone | Error logged, no retry | ☐ |
| **Error Handling** | Opted-out customer | Skipped with log entry | ☐ |

### End-to-End Test Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    E2E Test Flow                               │
└────────────────────────────────────────────────────────────────┘

Step 1: Create Test Customer
   - Create customer with phone +94771234567
   - Create WhatsAppOptIn record (active)
   - Set language preference to Sinhala
   ✓ Customer ready

Step 2: Create Order
   - Create order with 3 items
   - Total: LKR 15,750
   - Payment method: COD
   ✓ Order created
   ⏱ Wait 10 seconds
   ✓ Verify order_confirmation sent (Sinhala)

Step 3: Process Payment
   - Mark payment as successful
   - Payment amount: LKR 15,750
   ✓ Payment updated
   ⏱ Wait 10 seconds
   ✓ Verify payment_success sent (Sinhala)

Step 4: Ship Order
   - Update order status to shipped
   - Add tracking number: PRONTO123456
   - Set courier: Pronto Lanka
   ✓ Order shipped
   ⏱ Wait 10 seconds
   ✓ Verify order_shipped sent with tracking

Step 5: Out for Delivery
   - Update order status to out_for_delivery
   - Set estimated arrival: 2:00 PM - 4:00 PM
   ✓ Order out for delivery
   ⏱ Wait 10 seconds
   ✓ Verify out_for_delivery sent (COD reminder included)

Step 6: Deliver Order
   - Update order status to delivered
   - Set delivered_at: current timestamp
   ✓ Order delivered
   ⏱ Wait 10 seconds
   ✓ Verify order_delivered sent with review link

Summary:
✓ All 5 notifications sent successfully
✓ All notifications in correct language (Sinhala)
✓ All notifications sent via signals automatically
✓ Timing appropriate (within 10 seconds of status change)
✓ No duplicate notifications
```

### Performance Benchmarks

| Metric | Target | Measured | Pass/Fail |
|--------|--------|----------|-----------|
| Notification latency | < 5 seconds | ___ seconds | ☐ |
| Success rate | > 95% | ___% | ☐ |
| Queue processing rate | > 100 msg/min | ___ msg/min | ☐ |
| Batch processing | 100 recipients < 10 min | ___ minutes | ☐ |
| Scheduled accuracy | Within 2 minutes | ___ minutes | ☐ |
| Signal trigger time | < 1 second | ___ seconds | ☐ |

### Verification Report Template

```
WhatsApp Notification Service Verification Report
Date: ___________
Tester: ___________

Component Status:
☐ WhatsAppService - All methods functional
☐ Celery Tasks - Execution and retry working
☐ Queue Management - Priority and rate limiting functional
☐ Batch Notifications - Large batches processed successfully
☐ Scheduled Messages - Sent at correct times
☐ Django Signals - Automatic triggering working
☐ Multi-language - All languages (en, si, ta) working
☐ Error Handling - Graceful failures, appropriate retries

Issues Found:
1. __________________________________________
2. __________________________________________
3. __________________________________________

Performance:
- Average latency: ___ seconds
- Success rate: ___%
- Failed messages: ___
- Rate limit violations: ___

Overall Status: ☐ PASS ☐ FAIL ☐ PARTIAL

Notes:
_____________________________________________
_____________________________________________
```

### Expected Outcome
- All notification service components verified and functional
- End-to-end order lifecycle notifications working
- Error handling preventing service disruptions
- Rate limiting protecting against violations
- Multi-language support delivering correct templates
- Monitoring and logging providing visibility
- Service ready for production use

### Verification Checklist
- [ ] All WhatsAppService methods tested and working
- [ ] Celery tasks executing successfully
- [ ] Retry logic working for temporary failures
- [ ] Queue prioritization functioning correctly
- [ ] Rate limiting preventing excess messages
- [ ] Batch notifications processing large groups
- [ ] Scheduled messages sent at correct times
- [ ] Django signals triggering automatically
- [ ] Multi-language templates delivering correctly
- [ ] Error handling preventing failures
- [ ] Monitoring metrics accurate and updating
- [ ] End-to-end test completed successfully
- [ ] Performance benchmarks met
- [ ] Verification report completed
- [ ] Service approved for production

---

## Summary

This document covered the asynchronous notification infrastructure, completing the WhatsApp notification service. The implementation includes Celery tasks for background processing, priority-based queue management, batch and scheduled messaging capabilities, automatic signal-based triggering, and comprehensive verification.

### Key Achievements

1. **Async Processing** - Celery tasks enabling non-blocking notification sending
2. **Queue Management** - Priority-based queues with rate limiting
3. **Batch Capabilities** - Efficient large-scale message sending
4. **Scheduled Messages** - Time-based notification delivery
5. **Automatic Triggering** - Django signals decoupling notification logic
6. **Comprehensive Verification** - End-to-end testing ensuring reliability

### Infrastructure Summary

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **WhatsAppNotificationTask** | Async message sending | Retry logic, error classification, monitoring |
| **Notification Queue** | Priority management | High/medium/low queues, rate limiting |
| **Batch Notifications** | Large-scale sending | Chunking, progress tracking, failure handling |
| **Scheduled Messages** | Time-based delivery | Future scheduling, recurring messages |
| **Django Signals** | Automatic triggering | Status change detection, duplicate prevention |

### Notification Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                   Business Operations                        │
│         (Orders, Payments, Status Changes)                   │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Django Signals
                          ▼
┌──────────────────────────────────────────────────────────────┐
│               WhatsApp Signal Handlers                       │
│           (Automatic Notification Triggers)                  │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Enqueue Tasks
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                  Notification Queue                          │
│          (Priority-based, Rate-limited)                      │
│                                                              │
│  Very High → High → Medium → Low                            │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Process Tasks
                          ▼
┌──────────────────────────────────────────────────────────────┐
│           WhatsAppNotificationTask                           │
│              (Celery Workers)                                │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Send Messages
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              WhatsAppService                                 │
│           (Business Logic Layer)                             │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ API Calls
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              WhatsAppClient                                  │
│           (API Communication)                                │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│          WhatsApp Business API                               │
│          (Message Delivery)                                  │
└──────────────────────────────────────────────────────────────┘
```

### Integration Points

| Layer | Integrates With | Purpose |
|-------|-----------------|---------|
| Signals | Order, Payment models | Automatic triggering on status changes |
| Queue | Celery, Redis | Task management and rate limiting |
| Task | WhatsAppService | Async execution of notification methods |
| Service | WhatsAppClient | High-level business logic to API calls |
| Client | WhatsApp API | Direct communication with Meta platform |

### Next Steps

Proceed to Group E (Webhooks & Delivery) to implement:
- Webhook handler for delivery status updates
- Webhook event processing
- Delivery status tracking
- Read receipts and user interactions
- Webhook verification and security
- Complete notification feedback loop

The notification service is now functionally complete and ready for webhook integration to close the delivery tracking loop.
