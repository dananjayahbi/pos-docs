# Document 02: SMS Notification Service, Celery Tasks & Queue Management

**Phase 09: Integrations & Sri Lanka Localizations**  
**SubPhase 12: SMS Gateway Integration**  
**Group D: Notification Service**  
**Document 02 of 02**  
**Tasks 63-68**

---

## Navigation

- **Previous:** [Document 01: Templates & Utilities](./01_Tasks-57-62_Templates-Utilities.md)
- **Parent:** [Group D Overview](./00_GROUP_OVERVIEW.md)
- **Next:** [Group E: Admin Interface](../Group-E_Admin-Interface/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the implementation of the high-level SMS notification service, asynchronous task processing with Celery, and queue management for reliable SMS delivery. The service layer orchestrates SMS sending using the provider factory and templates, while Celery ensures non-blocking operation and retry capabilities.

### Tasks Covered

| Task | Title | Type | Dependencies |
|------|-------|------|--------------|
| 63 | Create SMSNotificationService | Service Layer | Tasks 49-62 |
| 64 | Create send_order_sms Method | Business Logic | Task 63 |
| 65 | Create send_shipping_sms Method | Business Logic | Task 63 |
| 66 | Create SMSSendTask (Celery) | Async Task | Tasks 63-65 |
| 67 | Create SMS Queue Configuration | Infrastructure | Task 66 |
| 68 | Verify SMS Service Integration | Testing | Tasks 63-67 |

### Document Scope

- **Service Layer:** High-level SMS notification service with business logic
- **Template Integration:** Use template manager for message formatting
- **Celery Tasks:** Asynchronous SMS sending with retry logic
- **Queue Management:** Dedicated SMS queue with worker configuration
- **Error Handling:** Comprehensive error management and logging
- **Testing:** End-to-end verification of SMS service

---

## Architecture Diagrams

### Service Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMS Notification Service Layer                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
         ┌───────────────────────────────────────────┐
         │      SMSNotificationService               │
         │  ┌─────────────────────────────────────┐  │
         │  │ - send_order_sms()                  │  │
         │  │ - send_shipping_sms()               │  │
         │  │ - send_payment_sms()                │  │
         │  │ - send_notification()               │  │
         │  └─────────────────────────────────────┘  │
         └───────────────────────────────────────────┘
                    │                    │
                    ▼                    ▼
         ┌──────────────────┐  ┌──────────────────┐
         │ Template Manager │  │ Provider Factory │
         │  - get_template  │  │  - get_provider  │
         │  - render        │  │  - send_sms      │
         └──────────────────┘  └──────────────────┘
                    │                    │
                    ▼                    ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  SMS Templates   │  │   SMS Providers  │
         │  (Database)      │  │  (Dialog/Twilio) │
         └──────────────────┘  └──────────────────┘
```

### Celery Task Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  order_view.create_order() → send_order_notification()          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    [Async Task Queuing]
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Celery Task                               │
│                                                                   │
│  SMSSendTask.apply_async(                                        │
│      args=[tenant_id, recipient, message_type, context],        │
│      queue='sms_messages',                                       │
│      retry=True,                                                 │
│      max_retries=3                                               │
│  )                                                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Message Broker (Redis)                       │
│                   Queue: sms_messages                            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Celery Worker Pool                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Worker 1 │  │ Worker 2 │  │ Worker 3 │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    [Execute SMSSendTask]
                                 │
                                 ▼
         ┌──────────────────────────────────────┐
         │  SMSNotificationService.send_sms()  │
         └──────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
            [Success]                    [Failure]
                    │                         │
                    ▼                         ▼
         [Log & Save Record]        [Retry or Mark Failed]
```

### Queue Management Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Celery Configuration                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
         ┌───────────┐    ┌───────────┐   ┌───────────┐
         │   celery  │    │ sms_      │   │  email_   │
         │  (default)│    │ messages  │   │  messages │
         └───────────┘    └───────────┘   └───────────┘
              │                  │                │
         [General]         [SMS Tasks]     [Email Tasks]
         [4 workers]       [3 workers]     [2 workers]

SMS Queue Configuration:
┌─────────────────────────────────────────────────────────────────┐
│ Queue Name: sms_messages                                         │
│ Priority: high                                                   │
│ Routing Key: sms.#                                              │
│ Workers: 3 dedicated workers                                     │
│ Max Retries: 3                                                   │
│ Retry Backoff: Exponential (5s, 25s, 125s)                     │
│ Task Time Limit: 300s (5 minutes)                              │
│ Soft Time Limit: 240s (4 minutes)                              │
│ Rate Limit: 10 tasks/minute per worker                         │
└─────────────────────────────────────────────────────────────────┘
```

### Error Handling & Retry Flow

```
                    [Task Execution Start]
                            │
                            ▼
                    [Validate Input]
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
            [Valid]                [Invalid]
                │                       │
                │                       ▼
                │              [Log Error & Fail]
                │              [No Retry]
                ▼
        [Get SMS Provider]
                │
    ┌───────────┴───────────┐
    ▼                       ▼
[Available]            [Unavailable]
    │                       │
    │                       ▼
    │              [Retry with Backoff]
    │              [Attempt: 1/3, 2/3, 3/3]
    ▼
[Send SMS]
    │
┌───┴────┐
▼        ▼
[Success] [Failure]
│         │
│         ▼
│     [Determine Error Type]
│         │
│    ┌────┴─────┐
│    ▼          ▼
│  [Transient] [Permanent]
│    │          │
│    │          ▼
│    │    [Log & Mark Failed]
│    │    [Send Alert]
│    ▼
│  [Retry with Exponential Backoff]
│  [Wait: 5s → 25s → 125s]
│         │
└─────────┼──────────────┐
          │              │
          ▼              ▼
    [Retry Success] [Max Retries Exceeded]
          │              │
          ▼              ▼
    [Log Success]  [Dead Letter Queue]
                   [Admin Notification]
```

---

## Task 63: Create SMSNotificationService

### Overview

Create the high-level `SMSNotificationService` class that provides a clean business-logic interface for sending SMS notifications. This service orchestrates the provider factory, template manager, and logging to provide a unified API for all SMS operations.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| SMSProviderFactory | Group C | Provider selection and SMS sending |
| SMSTemplateManager | Group D Doc 01 | Template retrieval and rendering |
| SMSMessage model | Group A | Message logging and tracking |
| TenantContext | Core | Multi-tenant context handling |
| Logger | Core | Error and audit logging |

### Implementation Instructions

#### 1. Service Class Location

**Purpose:** Establish service module structure

| Step | Action | Details |
|------|--------|---------|
| 1 | Create service file | `backend/integrations/sms/services.py` |
| 2 | Import dependencies | Factory, template manager, models |
| 3 | Set up logging | Module-level logger for service |

#### 2. Service Class Structure

**Purpose:** Define service class with initialization

| Component | Implementation | Notes |
|-----------|----------------|-------|
| Class name | `SMSNotificationService` | Main service class |
| Initialization | No constructor needed | Stateless service |
| Class methods | All methods as class methods | No instance state |
| Error handling | Try-except with logging | Comprehensive error capture |

#### 3. Core send_sms Method

**Purpose:** Main method for sending SMS with template

| Step | Action | Details |
|------|--------|---------|
| 1 | Define method signature | `send_sms(tenant_id, recipient, message_type, context, priority)` |
| 2 | Get SMS provider | Use `SMSProviderFactory.get_provider(tenant_id)` |
| 3 | Get template | Use `SMSTemplateManager.get_template(tenant_id, message_type)` |
| 4 | Render template | Use `template_manager.render_template(template, context)` |
| 5 | Send via provider | Call `provider.send_sms(recipient, message, metadata)` |
| 6 | Create log record | Save `SMSMessage` instance with result |
| 7 | Return result | Return success status and message ID |

#### 4. Service Features

**Purpose:** Implement additional service capabilities

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Provider fallback | Try secondary provider on failure | High availability |
| Rate limiting | Check rate limits before sending | Prevent quota exhaustion |
| Validation | Validate phone number format | Early error detection |
| Context enrichment | Add default context values | Consistent message data |
| Batch support | Send multiple messages efficiently | Bulk operations |

#### 5. Error Handling Strategy

**Purpose:** Robust error management

| Error Type | Handling | Action |
|------------|----------|--------|
| Provider unavailable | Log and raise ServiceUnavailable | Trigger retry |
| Template not found | Log and raise TemplateError | No retry |
| Invalid recipient | Log and raise ValidationError | No retry |
| Network timeout | Log and raise timeout error | Trigger retry |
| Rate limit exceeded | Log and raise RateLimitError | Defer task |

#### 6. Logging and Monitoring

**Purpose:** Comprehensive logging for debugging and monitoring

| Log Event | Level | Information |
|-----------|-------|-------------|
| SMS initiated | INFO | Tenant, recipient, message type |
| Template rendered | DEBUG | Template ID, context keys |
| Provider selected | INFO | Provider name, tenant |
| SMS sent | INFO | Message ID, recipient, status |
| Error occurred | ERROR | Error type, message, stack trace |
| Retry triggered | WARNING | Retry attempt, reason |

### Expected Outcome

- **Service Class:** `SMSNotificationService` with clean API
- **send_sms Method:** Core method for sending templated SMS
- **Error Handling:** Comprehensive error management with proper exceptions
- **Logging:** Detailed logging for all operations
- **Provider Integration:** Seamless use of SMSProviderFactory
- **Template Integration:** Seamless use of SMSTemplateManager

### Verification Steps

| Step | Check | Expected Result |
|------|-------|-----------------|
| 1 | Import service | No import errors |
| 2 | Call send_sms with valid data | Returns success with message ID |
| 3 | Call send_sms with invalid phone | Raises ValidationError |
| 4 | Call send_sms when provider down | Raises ServiceUnavailable |
| 5 | Check SMSMessage record | Record created with correct data |
| 6 | Review logs | All events logged correctly |

---

## Task 64: Create send_order_sms Method

### Overview

Implement the `send_order_sms` method as a specialized wrapper around `send_sms` that handles order confirmation notifications. This method prepares the context data specific to orders and calls the core SMS service.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| SMSNotificationService | Task 63 | Core SMS sending service |
| Order model | ERP Module | Order data retrieval |
| Customer model | ERP Module | Customer phone number |
| Template system | Group D Doc 01 | Order template rendering |

### Implementation Instructions

#### 1. Method Definition

**Purpose:** Define order-specific SMS method

| Step | Action | Details |
|------|--------|---------|
| 1 | Add class method | `@classmethod send_order_sms(cls, order_id, tenant_id)` |
| 2 | Load order | Fetch order instance from database |
| 3 | Validate order | Check order exists and is valid |
| 4 | Get customer phone | Extract phone from customer profile |

#### 2. Context Preparation

**Purpose:** Build context dictionary for order template

| Context Field | Source | Purpose |
|---------------|--------|---------|
| order_number | Order.order_number | Order reference |
| customer_name | Order.customer.name | Personalization |
| order_date | Order.created_at | Order timestamp |
| total_amount | Order.total_amount | Order value |
| currency | Order.currency | Currency symbol |
| items_count | Order.items.count() | Number of items |
| store_name | Tenant.name | Store branding |
| store_phone | Tenant.phone | Contact information |
| tracking_url | Generated | Order tracking link |

#### 3. Message Type Selection

**Purpose:** Determine correct template based on order state

| Order State | Message Type | Template |
|-------------|--------------|----------|
| Created | order_confirmation | ORDER_CONFIRMATION |
| Payment received | order_payment_received | ORDER_PAID |
| Processing | order_processing | ORDER_PROCESSING |
| Ready for pickup | order_ready | ORDER_READY |
| Cancelled | order_cancelled | ORDER_CANCELLED |

#### 4. Recipient Handling

**Purpose:** Determine and validate recipient phone number

| Step | Action | Details |
|------|--------|---------|
| 1 | Check customer phone | Use customer.phone_number |
| 2 | Check order phone | Fallback to order.delivery_phone |
| 3 | Validate format | Ensure phone is valid |
| 4 | Format number | Normalize to E.164 format |
| 5 | Check opt-out | Verify customer hasn't opted out |

#### 5. Priority and Scheduling

**Purpose:** Set appropriate priority for order messages

| Scenario | Priority | Notes |
|----------|----------|-------|
| New order | HIGH | Immediate confirmation |
| Payment received | HIGH | Important update |
| Order processing | NORMAL | Status update |
| Ready for pickup | HIGH | Time-sensitive |
| Cancelled | NORMAL | Informational |

#### 6. Error Handling

**Purpose:** Handle order-specific errors

| Error Scenario | Handling | Action |
|----------------|----------|--------|
| Order not found | Log and raise | Return error to caller |
| Customer no phone | Log warning | Skip SMS, send email |
| Invalid phone format | Log and clean | Attempt to normalize |
| Opt-out detected | Log info | Skip SMS silently |
| SMS send failure | Log error | Log failure in order notes |

### Expected Outcome

- **Method Implementation:** `send_order_sms` method functional
- **Context Building:** All order data properly formatted
- **Template Selection:** Correct template chosen based on state
- **Recipient Validation:** Phone numbers validated and formatted
- **Error Handling:** Graceful handling of edge cases
- **Integration:** Works seamlessly with order workflow

### Verification Steps

| Step | Check | Expected Result |
|------|-------|-----------------|
| 1 | Create new order | Order confirmation SMS sent |
| 2 | Mark order paid | Payment received SMS sent |
| 3 | Check SMS record | Record contains order ID |
| 4 | Test invalid phone | Error logged, no crash |
| 5 | Test opted-out customer | No SMS sent, logged |
| 6 | Verify context | All template variables populated |

---

## Task 65: Create send_shipping_sms Method

### Overview

Implement the `send_shipping_sms` method to handle shipping and delivery notifications. This method manages shipment status updates, tracking information, and delivery notifications.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| SMSNotificationService | Task 63 | Core SMS sending service |
| Shipment model | ERP Module | Shipment data retrieval |
| Order model | ERP Module | Related order information |
| Template system | Group D Doc 01 | Shipping template rendering |

### Implementation Instructions

#### 1. Method Definition

**Purpose:** Define shipping-specific SMS method

| Step | Action | Details |
|------|--------|---------|
| 1 | Add class method | `@classmethod send_shipping_sms(cls, shipment_id, tenant_id, event_type)` |
| 2 | Load shipment | Fetch shipment instance from database |
| 3 | Load related order | Get order for customer details |
| 4 | Validate data | Check shipment and order exist |

#### 2. Context Preparation

**Purpose:** Build context dictionary for shipping template

| Context Field | Source | Purpose |
|---------------|--------|---------|
| order_number | Shipment.order.order_number | Order reference |
| customer_name | Shipment.order.customer.name | Personalization |
| tracking_number | Shipment.tracking_number | Shipment tracking |
| carrier_name | Shipment.carrier | Shipping carrier |
| shipping_method | Shipment.method | Delivery method |
| estimated_delivery | Shipment.estimated_delivery_date | Expected date |
| current_status | Shipment.status | Shipment state |
| tracking_url | Shipment.tracking_url | Online tracking |
| delivery_address | Shipment.delivery_address | Destination |
| store_name | Tenant.name | Store branding |

#### 3. Shipping Event Types

**Purpose:** Define different shipping notification types

| Event Type | Message Type | Template | Priority |
|------------|--------------|----------|----------|
| shipped | shipment_shipped | SHIPMENT_SHIPPED | HIGH |
| in_transit | shipment_in_transit | SHIPMENT_TRANSIT | NORMAL |
| out_for_delivery | shipment_out_for_delivery | SHIPMENT_OUT_DELIVERY | HIGH |
| delivered | shipment_delivered | SHIPMENT_DELIVERED | HIGH |
| delivery_failed | shipment_failed | SHIPMENT_FAILED | HIGH |
| returned | shipment_returned | SHIPMENT_RETURNED | NORMAL |

#### 4. Tracking URL Generation

**Purpose:** Create tracking links for carriers

| Carrier | URL Pattern | Example |
|---------|-------------|---------|
| DHL Sri Lanka | `https://www.dhl.com/lk-en/home/tracking.html?tracking-id={tracking_number}` | Tracking link |
| Pronto Couriers | `https://www.prontocouriers.com/track?id={tracking_number}` | Tracking link |
| Courier Service | Custom URL from carrier_tracking_url_template | Configurable |
| Generic | Use shipment.tracking_url field | Fallback |

#### 5. Recipient and Timing

**Purpose:** Determine recipient and send timing

| Aspect | Implementation | Notes |
|--------|----------------|-------|
| Recipient | Use shipment.delivery_phone or order.customer.phone | Multiple fallbacks |
| Send time | Immediate for shipped/delivered | Real-time updates |
| Rate limiting | Prevent duplicate notifications | Track last sent time |
| Timezone | Convert to customer timezone | Localized delivery times |

#### 6. Multi-Package Handling

**Purpose:** Handle orders with multiple shipments

| Scenario | Handling | Message |
|----------|----------|---------|
| Single shipment | Standard message | "Your order has shipped" |
| Multiple shipments | Package-aware message | "Package 1 of 3 has shipped" |
| Partial delivery | Delivered count | "2 of 3 packages delivered" |
| All delivered | Final confirmation | "All packages delivered" |

### Expected Outcome

- **Method Implementation:** `send_shipping_sms` method functional
- **Event Handling:** All shipping events properly handled
- **Context Building:** Shipment data correctly formatted
- **Tracking URLs:** Carrier-specific tracking links generated
- **Multi-Package Support:** Multiple shipments handled correctly
- **Timing:** Appropriate timing for each event type

### Verification Steps

| Step | Check | Expected Result |
|------|-------|-----------------|
| 1 | Create shipment | Shipped notification sent |
| 2 | Update to in_transit | Transit notification sent |
| 3 | Mark delivered | Delivery notification sent |
| 4 | Check tracking URL | Correct carrier URL generated |
| 5 | Test multi-package order | Package count in message |
| 6 | Verify SMS record | Record contains shipment ID |

---

## Task 66: Create SMSSendTask (Celery Task)

### Overview

Implement the Celery task `SMSSendTask` that wraps the SMS notification service for asynchronous processing. This task enables non-blocking SMS sending with retry logic, error handling, and proper task lifecycle management.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| SMSNotificationService | Tasks 63-65 | SMS sending service |
| Celery | Framework | Task queue system |
| TenantContext | Core | Multi-tenant task execution |
| Redis | Infrastructure | Message broker and result backend |

### Implementation Instructions

#### 1. Task File Location

**Purpose:** Create Celery tasks module

| Step | Action | Details |
|------|--------|---------|
| 1 | Create tasks file | `backend/integrations/sms/tasks.py` |
| 2 | Import Celery app | From main Celery configuration |
| 3 | Import service | Import SMSNotificationService |
| 4 | Set up logging | Task-specific logger |

#### 2. Task Definition

**Purpose:** Define the Celery task with configuration

| Component | Configuration | Purpose |
|-----------|---------------|---------|
| Task name | `sms.send_notification` | Task identifier |
| Base class | `Task` | Custom task class |
| Bind | `bind=True` | Access to task instance |
| Max retries | `3` | Maximum retry attempts |
| Default retry delay | `5 * 60` (5 minutes) | Initial retry delay |
| Retry backoff | `True` | Exponential backoff |
| Retry jitter | `True` | Add randomness to retry |

#### 3. Task Signature

**Purpose:** Define task parameters

| Parameter | Type | Required | Purpose |
|-----------|------|----------|---------|
| tenant_id | UUID/String | Yes | Tenant context |
| recipient | String | Yes | Phone number |
| message_type | String | Yes | Template identifier |
| context | Dict | Yes | Template context data |
| priority | String | No | Message priority (default: NORMAL) |
| scheduled_at | DateTime | No | Scheduled send time |
| metadata | Dict | No | Additional task metadata |

#### 4. Task Execution Logic

**Purpose:** Implement task execution with error handling

| Step | Action | Details |
|------|--------|---------|
| 1 | Set tenant context | Activate tenant for database queries |
| 2 | Validate parameters | Check all required parameters present |
| 3 | Check scheduling | If scheduled_at in future, requeue |
| 4 | Log task start | Log task ID, tenant, recipient |
| 5 | Call SMS service | `SMSNotificationService.send_sms(...)` |
| 6 | Handle result | Log success, update task state |
| 7 | Return result | Return message ID and status |

#### 5. Error Handling and Retries

**Purpose:** Implement comprehensive retry logic

| Error Type | Retry Strategy | Max Retries | Backoff |
|------------|----------------|-------------|---------|
| Network timeout | Exponential backoff | 3 | 5min → 25min → 125min |
| Provider unavailable | Exponential backoff | 3 | 5min → 25min → 125min |
| Rate limit exceeded | Fixed delay | 5 | 10 minutes |
| Invalid phone number | No retry | 0 | N/A |
| Template not found | No retry | 0 | N/A |
| Provider auth failed | No retry | 0 | N/A |

#### 6. Task State Management

**Purpose:** Track task state throughout lifecycle

| State | When | Metadata Stored |
|-------|------|-----------------|
| PENDING | Task queued | Task ID, queued_at |
| STARTED | Task begins | Worker ID, started_at |
| RETRY | Task retrying | Retry count, next_retry_at |
| SUCCESS | Task completed | Message ID, sent_at, cost |
| FAILURE | Task failed permanently | Error type, error message |

#### 7. Callbacks and Hooks

**Purpose:** Implement task lifecycle hooks

| Hook | Purpose | Implementation |
|------|---------|----------------|
| before_start | Pre-execution setup | Set tenant context, log start |
| on_success | Success handling | Update metrics, log success |
| on_failure | Failure handling | Log error, send alert |
| on_retry | Retry handling | Log retry attempt, update state |
| after_return | Cleanup | Clear tenant context, release resources |

#### 8. Task Monitoring

**Purpose:** Enable monitoring and debugging

| Metric | Collection | Purpose |
|--------|------------|---------|
| Task count | Increment counter | Track volume |
| Task duration | Record execution time | Performance monitoring |
| Success rate | Calculate ratio | Health monitoring |
| Retry count | Count retries per task | Error rate tracking |
| Error types | Categorize errors | Issue identification |

### Expected Outcome

- **Task Definition:** `SMSSendTask` properly configured
- **Retry Logic:** Intelligent retry with backoff
- **Error Handling:** Different strategies for different errors
- **State Tracking:** Complete task lifecycle tracking
- **Logging:** Comprehensive logging at each stage
- **Monitoring:** Metrics collection for observability

### Verification Steps

| Step | Check | Expected Result |
|------|-------|-----------------|
| 1 | Import task | No import errors |
| 2 | Queue task manually | Task queued successfully |
| 3 | Check Redis | Task appears in queue |
| 4 | Simulate network error | Task retries with backoff |
| 5 | Test invalid phone | Task fails without retry |
| 6 | Monitor Celery logs | All states logged correctly |
| 7 | Check task result | Result stored in Redis |

---

## Task 67: Create SMS Queue Configuration

### Overview

Configure a dedicated SMS queue with proper worker allocation, routing, and performance settings. This ensures SMS tasks are processed reliably and efficiently without blocking other system tasks.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Celery configuration | Core | Base task queue setup |
| Redis | Infrastructure | Message broker |
| SMSSendTask | Task 66 | Tasks to be queued |
| Worker processes | Infrastructure | Task execution |

### Implementation Instructions

#### 1. Queue Definition

**Purpose:** Define SMS-specific queue in Celery config

| Configuration | Value | Purpose |
|---------------|-------|---------|
| Queue name | `sms_messages` | Dedicated SMS queue |
| Exchange | `sms` | Message exchange |
| Exchange type | `topic` | Topic-based routing |
| Routing key | `sms.#` | Route all SMS tasks |
| Durable | `True` | Survive broker restart |
| Auto delete | `False` | Persistent queue |

#### 2. Task Routing Configuration

**Purpose:** Route SMS tasks to SMS queue

| Configuration File | Location | Purpose |
|-------------------|----------|---------|
| Celery config | `backend/config/celery.py` | Main Celery setup |
| Task routes | `CELERY_TASK_ROUTES` | Routing rules |
| Queue definitions | `CELERY_TASK_QUEUES` | Queue configs |

**Routing Rules:**

| Task Pattern | Queue | Priority |
|--------------|-------|----------|
| `sms.send_notification` | `sms_messages` | 6 (high) |
| `sms.send_bulk` | `sms_messages` | 4 (normal) |
| `sms.send_scheduled` | `sms_messages` | 3 (low) |
| `sms.retry_failed` | `sms_messages` | 5 (medium) |

#### 3. Worker Configuration

**Purpose:** Configure dedicated SMS workers

| Setting | Value | Purpose |
|---------|-------|---------|
| Worker count | 3 | Concurrent SMS sending |
| Concurrency | 4 per worker | Parallel tasks per worker |
| Queue | `sms_messages` | Queue to consume from |
| Prefetch multiplier | 1 | Tasks prefetched per worker |
| Max tasks per child | 1000 | Worker restart frequency |
| Time limit | 300s (5 min) | Hard task timeout |
| Soft time limit | 240s (4 min) | Soft task timeout |

**Worker Start Command:**
```
celery -A backend worker \
  --queues=sms_messages \
  --concurrency=4 \
  --prefetch-multiplier=1 \
  --max-tasks-per-child=1000 \
  --time-limit=300 \
  --soft-time-limit=240 \
  --loglevel=info \
  --logfile=logs/celery-sms-worker.log
```

#### 4. Rate Limiting

**Purpose:** Prevent API rate limit exhaustion

| Configuration | Value | Purpose |
|---------------|-------|---------|
| Task rate limit | `10/m` | 10 tasks per minute per worker |
| Global rate limit | `30/m` | 30 SMS per minute total |
| Burst allowance | 5 | Allow short bursts |
| Rate limit type | `soft` | Delay rather than reject |

#### 5. Priority Levels

**Purpose:** Define priority queue behavior

| Priority | Value | Use Case |
|----------|-------|----------|
| Critical | 9 | OTP, password reset |
| High | 6 | Order confirmation, delivery |
| Normal | 5 | Shipping updates, notifications |
| Low | 3 | Marketing, newsletters |

#### 6. Queue Monitoring Configuration

**Purpose:** Enable queue monitoring and alerting

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Queue depth | > 1000 messages | Scale workers |
| Task age | > 15 minutes | Investigate delay |
| Worker health | < 2 workers active | Restart workers |
| Success rate | < 90% | Check provider |
| Avg processing time | > 30 seconds | Performance issue |

#### 7. Dead Letter Queue

**Purpose:** Handle permanently failed tasks

| Configuration | Value | Purpose |
|---------------|-------|---------|
| DLQ name | `sms_messages_failed` | Failed task queue |
| Max retries | 3 | Before moving to DLQ |
| TTL | 7 days | Retention period |
| Manual review | Required | Admin intervention |

#### 8. Environment-Specific Settings

**Purpose:** Different configs for different environments

| Setting | Development | Production |
|---------|-------------|------------|
| Workers | 1 | 3 |
| Concurrency | 2 | 4 |
| Rate limit | None | 30/m |
| Result expiry | 1 hour | 24 hours |
| Logging level | DEBUG | INFO |

### Expected Outcome

- **Queue Created:** `sms_messages` queue operational
- **Routing Configured:** SMS tasks routed correctly
- **Workers Running:** 3 dedicated workers processing tasks
- **Rate Limiting:** Rate limits prevent quota exhaustion
- **Monitoring:** Queue metrics collected and monitored
- **Priority Handling:** High-priority tasks processed first

### Verification Steps

| Step | Check | Expected Result |
|------|-------|-----------------|
| 1 | Start workers | 3 workers start successfully |
| 2 | Queue task | Task appears in sms_messages queue |
| 3 | Monitor Redis | Queue depth shows pending tasks |
| 4 | Send high-priority SMS | Processed before normal priority |
| 5 | Trigger rate limit | Tasks delayed appropriately |
| 6 | Check DLQ | Failed tasks move to DLQ |
| 7 | Verify logging | Worker logs show SMS processing |

---

## Task 68: Verify SMS Service Integration

### Overview

Perform comprehensive end-to-end testing of the complete SMS notification system, including service layer, Celery tasks, queue processing, and provider integration. This task validates that all components work together correctly.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| All previous tasks | Tasks 63-67 | Complete SMS system |
| Test data | Testing | Sample orders, shipments |
| Provider credentials | Config | Live provider access |
| Monitoring tools | Infrastructure | Performance tracking |

### Verification Instructions

#### 1. Service Layer Testing

**Purpose:** Verify SMSNotificationService functionality

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Send basic SMS | Call send_sms with valid data | SMS sent successfully |
| Invalid phone | Call with invalid phone number | ValidationError raised |
| Template rendering | Call with context data | Template rendered correctly |
| Provider fallback | Simulate primary provider down | Falls back to secondary |
| Error handling | Trigger various errors | Errors handled gracefully |
| Logging | Check logs for all operations | All events logged |

#### 2. Order Notification Testing

**Purpose:** Verify send_order_sms functionality

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Order confirmation | Create new order | Confirmation SMS sent |
| Payment notification | Mark order paid | Payment SMS sent |
| Order cancellation | Cancel order | Cancellation SMS sent |
| Context data | Check message content | All order data present |
| Customer opt-out | Test opted-out customer | No SMS sent |
| Missing phone | Order without phone | Handled gracefully |

#### 3. Shipping Notification Testing

**Purpose:** Verify send_shipping_sms functionality

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Shipment created | Create shipment | Shipped SMS sent |
| Out for delivery | Update shipment status | Delivery SMS sent |
| Delivered | Mark shipment delivered | Delivered SMS sent |
| Tracking URL | Check message content | Correct tracking URL |
| Multi-package | Order with 3 packages | Package count in message |
| Failed delivery | Mark delivery failed | Failure SMS sent |

#### 4. Celery Task Testing

**Purpose:** Verify asynchronous task processing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Task queuing | Queue SMS task | Task appears in Redis |
| Task execution | Wait for processing | Task executes successfully |
| Retry logic | Simulate provider timeout | Task retries with backoff |
| Max retries | Trigger 3+ failures | Task moves to DLQ |
| Task result | Check task result backend | Result stored correctly |
| State tracking | Monitor task states | All states tracked |

#### 5. Queue Management Testing

**Purpose:** Verify queue configuration and processing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Queue routing | Queue various tasks | Routed to correct queue |
| Worker processing | Submit 20 tasks | All processed by SMS workers |
| Priority handling | Mix high and low priority | High priority first |
| Rate limiting | Submit 100 tasks | Rate limit applied |
| Queue depth | Monitor queue size | Depth tracked correctly |
| Worker scaling | Stop/start workers | Tasks redistribute |

#### 6. Error Handling Testing

**Purpose:** Verify error scenarios are handled correctly

| Scenario | Trigger | Expected Behavior |
|----------|---------|-------------------|
| Network timeout | Disconnect network briefly | Task retries |
| Invalid credentials | Use wrong API key | Task fails, no retry |
| Provider rate limit | Send many SMS quickly | Tasks delayed |
| Malformed phone | Use invalid format | Validation error, no retry |
| Template missing | Reference non-existent template | Error logged, no retry |
| Tenant not found | Use invalid tenant ID | Error logged, task fails |

#### 7. Performance Testing

**Purpose:** Verify system performance under load

| Test | Load | Success Criteria |
|------|------|------------------|
| Single SMS | 1 SMS | < 2 seconds end-to-end |
| Batch SMS | 100 SMS | All sent within 5 minutes |
| Concurrent load | 10 SMS/second for 1 min | No failures, < 5% error rate |
| Queue processing | 1000 queued tasks | All processed within 2 hours |
| Memory usage | Run for 1 hour | Stable memory, no leaks |
| Recovery | Kill worker during task | Task reassigned and completed |

#### 8. Integration Testing

**Purpose:** Verify integration with other systems

| Integration | Test | Expected Result |
|-------------|------|-----------------|
| Order system | Create order via API | SMS sent automatically |
| Shipment system | Create shipment | Shipping SMS sent |
| Admin interface | Send test SMS | SMS received |
| Monitoring | Check Celery Flower | Tasks visible |
| Logging | Check log aggregator | All events captured |
| Metrics | Check Prometheus/Grafana | Metrics collected |

#### 9. End-to-End Scenarios

**Purpose:** Test complete real-world workflows

| Scenario | Steps | Validation |
|----------|-------|------------|
| New customer order | 1. Customer places order<br>2. Payment processed<br>3. Order confirmation | Receives order SMS with details |
| Order fulfillment | 1. Order picked<br>2. Shipment created<br>3. Handed to courier<br>4. Out for delivery<br>5. Delivered | Receives 3 SMS updates |
| Order cancellation | 1. Customer cancels<br>2. Refund processed | Receives cancellation SMS |
| Bulk promotion | 1. Admin sends promo to 1000 customers | All receive SMS within 1 hour |

#### 10. Monitoring and Alerting

**Purpose:** Verify monitoring systems are working

| Check | Tool | Expected |
|-------|------|----------|
| Task metrics | Celery Flower | Shows task stats |
| Queue depth | Redis CLI | Shows queue size |
| Success rate | Application logs | > 95% success |
| Error rates | Log aggregator | Errors tracked by type |
| Worker health | Process monitor | All workers running |
| SMS costs | Provider dashboard | Costs tracked |

### Expected Outcome

- **All Tests Pass:** 100% of test cases successful
- **Performance Met:** System meets performance criteria
- **Error Handling:** Errors handled without crashes
- **Integration Works:** Seamless integration with other systems
- **Monitoring Active:** All monitoring tools reporting correctly
- **Documentation:** Test results documented

### Verification Checklist

| Area | Status | Notes |
|------|--------|-------|
| [ ] Service layer tests passed | | All unit tests green |
| [ ] Order SMS tests passed | | All scenarios tested |
| [ ] Shipping SMS tests passed | | All scenarios tested |
| [ ] Celery task tests passed | | Async processing works |
| [ ] Queue management verified | | Queue configured correctly |
| [ ] Error handling verified | | All error types handled |
| [ ] Performance tests passed | | Meets performance criteria |
| [ ] Integration tests passed | | Works with other systems |
| [ ] End-to-end tests passed | | Complete workflows work |
| [ ] Monitoring active | | All metrics collected |

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Tasks not processing | Workers not started | Start SMS workers |
| Slow processing | Too few workers | Scale to 3+ workers |
| High error rate | Provider issues | Check provider status |
| Tasks stuck in queue | Rate limiting | Increase rate limit or wait |
| Memory leaks | Long-running workers | Restart workers periodically |
| Missing SMS | Incorrect routing | Verify task routing config |

---

## Implementation Checklist

### Phase 1: Service Layer (Tasks 63-65)

- [ ] Create `SMSNotificationService` class
- [ ] Implement `send_sms` core method
- [ ] Add error handling and logging
- [ ] Implement `send_order_sms` method
- [ ] Build order context and templates
- [ ] Implement `send_shipping_sms` method
- [ ] Build shipping context and templates
- [ ] Test service layer methods
- [ ] Document service API

### Phase 2: Celery Tasks (Task 66)

- [ ] Create `tasks.py` module
- [ ] Define `SMSSendTask` with configuration
- [ ] Implement task execution logic
- [ ] Add retry logic with backoff
- [ ] Implement error handling
- [ ] Add task lifecycle hooks
- [ ] Implement state tracking
- [ ] Add monitoring metrics
- [ ] Test task execution

### Phase 3: Queue Configuration (Task 67)

- [ ] Define SMS queue in Celery config
- [ ] Configure task routing
- [ ] Set up worker configuration
- [ ] Implement rate limiting
- [ ] Configure priority levels
- [ ] Set up dead letter queue
- [ ] Configure monitoring
- [ ] Test queue processing
- [ ] Document worker commands

### Phase 4: Verification (Task 68)

- [ ] Run service layer tests
- [ ] Run order notification tests
- [ ] Run shipping notification tests
- [ ] Run Celery task tests
- [ ] Run queue management tests
- [ ] Run error handling tests
- [ ] Run performance tests
- [ ] Run integration tests
- [ ] Run end-to-end tests
- [ ] Verify monitoring active
- [ ] Document test results

---

## Integration Points

### With Previous Groups

| Group | Integration Point | Data Flow |
|-------|------------------|-----------|
| Group A (Models) | SMSMessage model | Save SMS records |
| Group B (Providers) | SMSProviderFactory | Send via providers |
| Group C (Templates) | SMSTemplateManager | Render templates |

### With Other Systems

| System | Integration | Purpose |
|--------|-------------|---------|
| Order Management | Order events | Trigger order SMS |
| Shipping | Shipment events | Trigger shipping SMS |
| Celery | Task queue | Async processing |
| Redis | Message broker | Queue storage |
| Monitoring | Metrics collection | Observability |

---

## Configuration Reference

### Celery Configuration Example

```python
# Task routes
CELERY_TASK_ROUTES = {
    'sms.send_notification': {
        'queue': 'sms_messages',
        'priority': 6,
    },
}

# Queue definitions
CELERY_TASK_QUEUES = [
    Queue('sms_messages',
          Exchange('sms', type='topic'),
          routing_key='sms.#',
          queue_arguments={'x-max-priority': 10}),
]

# Task settings
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TASK_TIME_LIMIT = 300
CELERY_TASK_SOFT_TIME_LIMIT = 240
```

### Worker Configuration Example

```bash
# Development
celery -A backend worker -Q sms_messages -c 2 -l debug

# Production
celery -A backend worker -Q sms_messages -c 4 -l info \
  --max-tasks-per-child=1000 \
  --time-limit=300 \
  --soft-time-limit=240
```

---

## Performance Benchmarks

| Metric | Target | Acceptable | Notes |
|--------|--------|------------|-------|
| Task queue time | < 1s | < 5s | Time in queue before processing |
| Task execution time | < 5s | < 15s | Time to send SMS |
| Queue throughput | 30 SMS/min | 20 SMS/min | With 3 workers |
| Success rate | > 98% | > 95% | Excluding invalid numbers |
| Retry rate | < 10% | < 20% | Transient errors |
| Memory per worker | < 200MB | < 500MB | Stable over time |

---

## Troubleshooting Guide

### Workers Not Processing Tasks

**Symptoms:** Tasks queued but not processed

**Checks:**
1. Verify workers are running: `celery -A backend status`
2. Check worker is consuming from correct queue
3. Verify Redis connection
4. Check worker logs for errors

**Solutions:**
- Start workers: `celery -A backend worker -Q sms_messages`
- Restart Redis if connection issues
- Check Celery configuration

### High Error Rate

**Symptoms:** Many failed SMS tasks

**Checks:**
1. Check provider status and credentials
2. Review error logs for error types
3. Check rate limiting status
4. Verify phone number formats

**Solutions:**
- Update provider credentials if expired
- Implement phone number validation
- Adjust rate limits
- Check provider dashboard for issues

### Slow Processing

**Symptoms:** Tasks taking too long to process

**Checks:**
1. Check worker count and concurrency
2. Monitor queue depth
3. Check provider API response times
4. Review worker resource usage

**Solutions:**
- Scale workers to 3+
- Increase concurrency to 4 per worker
- Check network connectivity
- Optimize provider API calls

---

## Security Considerations

| Aspect | Implementation | Notes |
|--------|----------------|-------|
| Credentials | Store in environment variables | Never in code |
| Phone numbers | Encrypt in database | PII protection |
| Task data | Sanitize before logging | No sensitive data in logs |
| Rate limiting | Enforce strict limits | Prevent abuse |
| Access control | Tenant isolation | Multi-tenancy security |
| Audit logging | Log all SMS sends | Compliance |

---

## Next Steps

After completing this document:

1. **Move to Group E:** Implement admin interface for SMS management
2. **Integration Testing:** Test with real order and shipping flows
3. **Performance Tuning:** Optimize queue settings based on load
4. **Monitoring Setup:** Configure dashboards and alerts
5. **Documentation:** Update API documentation with SMS endpoints
6. **Training:** Train operations team on SMS monitoring

---

## Document Control

| Property | Value |
|----------|-------|
| Document Version | 1.0 |
| Last Updated | 2026-01-31 |
| Status | Final |
| Tasks Covered | 63-68 |
| Related Documents | Group D Doc 01, Group C Doc 02 |

---

## Glossary

| Term | Definition |
|------|------------|
| Celery | Distributed task queue for Python |
| Queue | FIFO data structure for task storage |
| Worker | Process that executes tasks from queue |
| Broker | Message queue system (Redis) |
| Task | Unit of work to be executed asynchronously |
| Retry | Re-execution of failed task |
| Backoff | Increasing delay between retries |
| DLQ | Dead Letter Queue for permanently failed tasks |
| Rate Limit | Maximum tasks per time period |
| Priority | Task execution order preference |

---

**End of Document 02**
