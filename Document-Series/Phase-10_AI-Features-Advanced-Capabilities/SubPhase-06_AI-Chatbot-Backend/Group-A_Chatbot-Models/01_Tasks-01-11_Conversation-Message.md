# Tasks 01-11: Conversation and Message Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** A - Chatbot Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-12-16_Intent-Migration.md](02_Tasks-12-16_Intent-Migration.md)

---

## Document Overview

This document covers the creation of the Conversation and Message models for the AI chatbot system. These models form the foundation of the chatbot's conversation tracking system, enabling session management, message storage, and customer interaction history. The Conversation model manages chat sessions with unique session IDs, customer associations, and status tracking, while the Message model stores individual messages with role differentiation and timestamps.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Conversation Model | Medium | 30 min |
| 02 | Create session_id Field | Low | 10 min |
| 03 | Create customer FK | Low | 15 min |
| 04 | Create status Field | Low | 15 min |
| 05 | Create started_at Field | Low | 10 min |
| 06 | Create ended_at Field | Low | 10 min |
| 07 | Create Message Model | Medium | 30 min |
| 08 | Create conversation FK | Low | 15 min |
| 09 | Create role Field | Low | 15 min |
| 10 | Create content Field | Low | 10 min |
| 11 | Create timestamp Field | Low | 10 min |

---

## Task 01: Create Conversation Model

### Overview
Create the Conversation model as the primary container for chatbot sessions. This model represents a complete conversation session between the system and a user, tracking the lifecycle from initiation to completion. The model supports both authenticated customers and guest users, enabling flexible interaction patterns while maintaining session continuity.

### Dependencies
- SubPhase-05 (Smart Search & Sinhaglish) must be complete
- Customer model from Phase-04 must exist
- Django project structure is established
- Chatbot app must be created

### Instructions

1. **Navigate to the chatbot app directory**
   - Go to `backend/apps/chatbot/` directory
   - This is the root of the chatbot application

2. **Create models directory**
   - Create a new directory named `models` inside chatbot app
   - Create `__init__.py` file in the models directory
   - This allows modular model organization

3. **Create conversation model file**
   - Create new file named `conversation.py` in `models/` directory
   - This file will contain the Conversation model class

4. **Import required dependencies**
   - Import Django's models module
   - Import uuid for session ID generation
   - Import timezone utilities for timestamps
   - Import Customer model from appropriate app

5. **Define Conversation model class**
   - Create class inheriting from Django's Model
   - Use descriptive class name: `Conversation`
   - Add class Meta for database configuration

6. **Configure model metadata**
   - Set table name using `db_table`
   - Define ordering (typically by started_at descending)
   - Add verbose name and plural form
   - Configure indexes for query optimization

7. **Add __str__ method**
   - Return meaningful string representation
   - Include session_id and status
   - Format: "Conversation {session_id} - {status}"

8. **Plan model relationships**
   - Prepare for foreign key to Customer model
   - Plan reverse relationship naming (messages, etc.)
   - Consider on_delete behavior for relationships

### Model Purpose

| Aspect | Description |
|--------|-------------|
| Primary Goal | Track complete chat sessions |
| Supports | Guest and authenticated users |
| Tracks | Session lifecycle and status |
| Enables | Conversation history and analytics |

### Conversation Lifecycle

```
┌─────────────┐
│  STARTED    │ (created_at timestamp)
│  (active)   │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌───▼────────┐
│  RESOLVED   │ │ ESCALATED  │
│  (ended_at) │ │ (ended_at) │
└─────────────┘ └────────────┘
```

### Model Characteristics

| Feature | Implementation Approach |
|---------|------------------------|
| Session Tracking | UUID-based unique identifier |
| User Association | Nullable FK to Customer |
| Status Management | CharField with predefined choices |
| Timestamps | Auto-generated start/end times |
| Multi-tenancy | Inherits from tenant-aware base |

### Directory Structure After Creation
```
backend/apps/chatbot/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── conversation.py    # Created in this task
├── views/
├── serializers/
└── urls.py
```

### Database Table Planning

| Column | Type | Purpose |
|--------|------|---------|
| id | AutoField/BigAutoField | Primary key |
| session_id | UUID | Unique session identifier |
| customer_id | ForeignKey (nullable) | Customer association |
| status | CharField(20) | Conversation state |
| started_at | DateTimeField | Session start time |
| ended_at | DateTimeField (nullable) | Session end time |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Last modification |

### Expected Outcome
- Conversation model class created and properly structured
- Model file located in chatbot app models directory
- Basic model structure ready for field definitions
- Model metadata configured appropriately

### Verification Checklist
- [ ] `backend/apps/chatbot/models/` directory exists
- [ ] `conversation.py` file created in models directory
- [ ] `__init__.py` exists in models directory
- [ ] Conversation class defined with Model inheritance
- [ ] Model Meta class configured
- [ ] `__str__` method implemented
- [ ] Required imports added

---

## Task 02: Create session_id Field

### Overview
Add the session_id field to the Conversation model as a UUID-based unique identifier for each conversation session. This field enables session tracking across requests, supports guest user conversations without authentication, and provides a secure, non-sequential identifier for public-facing APIs.

### Dependencies
- Task 01: Create Conversation Model

### Instructions

1. **Import UUID module**
   - Ensure Python's uuid module is imported
   - Import uuid4 function for random UUID generation

2. **Define session_id field**
   - Add UUIDField to Conversation model
   - Set field name as `session_id`
   - Configure field properties

3. **Configure field properties**
   - Set `default=uuid.uuid4` for automatic generation
   - Set `editable=False` to prevent manual editing
   - Set `unique=True` to ensure uniqueness
   - Add database index for query performance

4. **Add field documentation**
   - Include docstring or comment explaining purpose
   - Document that this is the public-facing session identifier
   - Note that it's safe to expose in URLs and APIs

5. **Consider API exposure**
   - Plan to use session_id in API endpoints
   - Session ID will be included in responses
   - Format: `/api/chatbot/sessions/{session_id}/`

6. **Understand UUID benefits**
   - Non-sequential (prevents enumeration attacks)
   - Globally unique without coordination
   - 128-bit identifier (very low collision probability)

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | UUIDField | Globally unique identifier |
| Default | uuid.uuid4 | Auto-generate on creation |
| Unique | True | One session per UUID |
| Editable | False | System-managed field |
| DB Index | True | Fast session lookups |

### UUID Format

| Component | Description |
|-----------|-------------|
| Format | `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` |
| Version | UUID4 (random) |
| Length | 36 characters (with hyphens) |
| Storage | 128 bits (16 bytes) |

### Usage Scenarios

```
Guest User Session
├── Create conversation → Auto-generate session_id
├── Return session_id to frontend
├── Frontend stores in localStorage/sessionStorage
└── Include in subsequent requests

Authenticated User Session
├── Create conversation → Auto-generate session_id
├── Associate with customer FK
├── Track across multiple devices
└── Session history available after login
```

### API Integration

| Endpoint Pattern | Example |
|-----------------|---------|
| Create Session | POST `/api/chatbot/sessions/` |
| Get Session | GET `/api/chatbot/sessions/{session_id}/` |
| Send Message | POST `/api/chatbot/sessions/{session_id}/messages/` |
| Get History | GET `/api/chatbot/sessions/{session_id}/messages/` |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Predictability | UUID4 is cryptographically random |
| Enumeration | Cannot guess other session IDs |
| Length | 36 characters prevents brute force |
| URL Safety | UUID format is URL-safe |

### Session ID Lifecycle

```
Request Arrives
     │
     ▼
┌─────────────────┐
│  New Session?   │
├─────────────────┤
│ Yes │     │ No  │
│     │     │     │
│     ▼     ▼     │
│  Generate  Use  │
│  UUID4   Existing│
│     │      │    │
│     └──────┘    │
│        │        │
│        ▼        │
│   session_id   │
└─────────────────┘
```

### Expected Outcome
- session_id field added to Conversation model
- UUID automatically generated on conversation creation
- Field is unique and indexed for performance
- Ready for use in API endpoints and frontend tracking

### Verification Checklist
- [ ] session_id field added to Conversation model
- [ ] Field type is UUIDField
- [ ] Default is set to uuid.uuid4
- [ ] unique=True constraint applied
- [ ] editable=False to prevent manual changes
- [ ] Database index configured
- [ ] UUID module imported

---

## Task 03: Create customer FK

### Overview
Add the customer foreign key field to the Conversation model, establishing the relationship between conversations and registered users. This field is nullable to support both guest and authenticated user conversations, enabling seamless transition from guest to authenticated status and comprehensive conversation history tracking.

### Dependencies
- Task 01: Create Conversation Model
- Customer model from Phase-04 must exist

### Instructions

1. **Import Customer model**
   - Import Customer model from appropriate app
   - Use Django's apps registry if needed
   - Handle circular import issues if any

2. **Define customer field**
   - Add ForeignKey field to Conversation model
   - Set field name as `customer`
   - Configure relationship properties

3. **Configure null and blank**
   - Set `null=True` for database nullable
   - Set `blank=True` for form validation
   - Allow conversations without customer (guests)

4. **Set on_delete behavior**
   - Set `on_delete=models.SET_NULL`
   - Preserve conversations even if customer deleted
   - Prevents cascading deletion of conversation history

5. **Configure related_name**
   - Set `related_name='chatbot_conversations'`
   - Enables reverse lookup from Customer model
   - Avoid conflicts with other conversation models

6. **Add database index**
   - Set `db_index=True` for query optimization
   - Enable fast customer conversation queries
   - Improves dashboard performance

7. **Add help text**
   - Include descriptive help_text parameter
   - Document nullable nature for guest support
   - Example: "Customer associated with conversation, null for guest users"

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | ForeignKey(Customer) | Link to customer record |
| Null | True | Support guest conversations |
| Blank | True | Optional in forms |
| On Delete | SET_NULL | Preserve conversation history |
| Related Name | chatbot_conversations | Reverse relationship access |
| DB Index | True | Fast customer queries |

### Customer Association Patterns

| Scenario | Customer Value | Behavior |
|----------|---------------|----------|
| Guest User | NULL | Conversation created without customer |
| Logged In User | Customer ID | Automatic association on creation |
| Guest → Login | NULL → Customer ID | Update on authentication |
| Customer Deleted | NULL (SET_NULL) | Conversation preserved anonymously |

### Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│    Customer     │         │   Conversation   │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄──────┐ │ id (PK)          │
│ email           │        │ │ session_id       │
│ name            │        └─│ customer_id (FK) │
│ ...             │          │ status           │
└─────────────────┘          │ ...              │
                             └──────────────────┘
        │                           ▲
        │ chatbot_conversations     │
        └───────────────────────────┘
```

### Query Examples (Conceptual)

| Query Purpose | Approach |
|---------------|----------|
| Get all customer conversations | `customer.chatbot_conversations.all()` |
| Count customer conversations | `customer.chatbot_conversations.count()` |
| Get active conversations | `customer.chatbot_conversations.filter(status='active')` |
| Find guest conversations | `Conversation.objects.filter(customer__isnull=True)` |

### Guest to Authenticated Flow

```
1. Guest Starts Chat
   └── Conversation created with customer=NULL

2. Guest Continues Chatting
   └── Session tracked via session_id

3. Guest Logs In
   ├── Frontend sends customer_id with session_id
   └── Backend updates conversation.customer = logged_in_customer

4. Conversation Now Associated
   └── Available in customer's chat history
```

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Tenant Isolation | Customer FK respects tenant schema |
| Guest Sessions | Exist in public or tenant schema |
| Cross-Tenant | Not possible (FK constraint) |
| History Access | Only within customer's tenant |

### Expected Outcome
- customer field added to Conversation model
- Nullable to support guest users
- SET_NULL on_delete preserves conversation history
- Related name configured for reverse queries
- Database indexed for performance

### Verification Checklist
- [ ] customer field added to Conversation model
- [ ] Field type is ForeignKey to Customer
- [ ] null=True and blank=True configured
- [ ] on_delete=models.SET_NULL set
- [ ] related_name='chatbot_conversations' configured
- [ ] db_index=True for performance
- [ ] help_text added for documentation
- [ ] Customer model imported correctly

---

## Task 04: Create status Field

### Overview
Add the status field to the Conversation model to track the current state of each conversation session. This field uses predefined choices to manage conversation lifecycle states including active conversations, resolved issues, and escalations to human support. The status field enables filtering, reporting, and automated workflow triggers based on conversation state.

### Dependencies
- Task 01: Create Conversation Model

### Instructions

1. **Define status choices**
   - Create status choices as class-level constant
   - Use Django's TextChoices or tuple format
   - Define three states: ACTIVE, RESOLVED, ESCALATED

2. **Create choices constant**
   - Define choices at model class level
   - Use descriptive labels for admin interface
   - Consider using Django 3.0+ TextChoices for type safety

3. **Add status field**
   - Add CharField to Conversation model
   - Set field name as `status`
   - Configure with choices parameter

4. **Configure field properties**
   - Set `max_length=20` for choice values
   - Set `default='active'` for new conversations
   - Add database index for status-based queries
   - Mark as required (no null/blank)

5. **Add field documentation**
   - Include help_text explaining status meanings
   - Document status transitions in docstring
   - Note when status changes occur

6. **Plan status transitions**
   - Document allowed state transitions
   - Consider adding validation for transitions
   - Plan for automated status updates

7. **Consider indexing strategy**
   - Status will be frequently filtered
   - Add db_index=True for performance
   - Consider composite indexes with customer

### Status Choices Definition

| Status Value | Display Label | Description |
|-------------|---------------|-------------|
| active | Active | Conversation is ongoing |
| resolved | Resolved | Issue successfully resolved |
| escalated | Escalated | Transferred to human support |

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | CharField | Text-based status |
| Max Length | 20 | Accommodate choice values |
| Choices | STATUS_CHOICES | Restrict to valid values |
| Default | 'active' | New conversations are active |
| DB Index | True | Fast status filtering |
| Null | False | Status always required |

### Status Lifecycle Flow

```
┌─────────────────────┐
│   ACTIVE (start)    │
│   Default state     │
└──────────┬──────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
┌──────────────────┐   ┌─────────────────┐
│    RESOLVED      │   │   ESCALATED     │
│  Issue solved    │   │  Human needed   │
└──────────────────┘   └─────────────────┘
```

### Status Transition Rules

| From | To | Trigger | Action |
|------|----|---------|----|
| ACTIVE | RESOLVED | Bot solves issue | Set ended_at timestamp |
| ACTIVE | ESCALATED | Bot cannot help | Notify support team |
| ESCALATED | RESOLVED | Human resolves | Set ended_at timestamp |
| RESOLVED | ACTIVE | Customer reopens | Clear ended_at |
| ESCALATED | ACTIVE | Return to bot | Clear ended_at |

### Status-Based Features

| Feature | Implementation |
|---------|----------------|
| Active Count | Dashboard shows count of active conversations |
| Resolution Rate | Calculate resolved / total ratio |
| Escalation Rate | Calculate escalated / total ratio |
| Auto-Close | Mark as resolved after inactivity timeout |
| Notifications | Alert support team on escalation |

### Query Patterns (Conceptual)

| Query Purpose | Filter Approach |
|---------------|----------------|
| All active conversations | `status='active'` |
| Customer's resolved chats | `customer=X, status='resolved'` |
| Escalated conversations | `status='escalated'` |
| Conversations needing attention | `status='active', last_message > 5min ago` |

### Status Change Events

```
Status Change Detected
     │
     ├─── ACTIVE → RESOLVED
     │    ├── Set ended_at
     │    ├── Calculate duration
     │    └── Update analytics
     │
     ├─── ACTIVE → ESCALATED
     │    ├── Set ended_at
     │    ├── Create support ticket
     │    └── Send notification
     │
     └─── ESCALATED → RESOLVED
          ├── Close support ticket
          ├── Update resolution time
          └── Send feedback request
```

### Analytics and Reporting

| Metric | Calculation |
|--------|-------------|
| Average Resolution Time | Avg(ended_at - started_at) for resolved |
| Escalation Rate | Count(escalated) / Count(total) |
| Active Sessions | Count(status='active') |
| Peak Hours | Group by hour, count active sessions |

### Expected Outcome
- status field added to Conversation model
- Three predefined status choices configured
- Default status set to 'active' for new conversations
- Field indexed for efficient querying
- Status transitions documented

### Verification Checklist
- [ ] STATUS_CHOICES constant defined
- [ ] Three status values: active, resolved, escalated
- [ ] status field added to Conversation model
- [ ] max_length=20 configured
- [ ] choices=STATUS_CHOICES parameter set
- [ ] default='active' configured
- [ ] db_index=True for performance
- [ ] help_text added for documentation

---

## Task 05: Create started_at Field

### Overview
Add the started_at field to the Conversation model to automatically record the timestamp when each conversation begins. This field uses Django's auto_now_add feature to capture the exact moment of conversation creation, enabling time-based analytics, session duration calculations, and conversation history tracking.

### Dependencies
- Task 01: Create Conversation Model

### Instructions

1. **Import timezone utilities**
   - Ensure Django's timezone module is imported
   - Use timezone-aware datetime handling
   - Support multi-timezone deployments

2. **Add started_at field**
   - Add DateTimeField to Conversation model
   - Set field name as `started_at`
   - Configure auto-population behavior

3. **Configure auto_now_add**
   - Set `auto_now_add=True`
   - Field automatically set on creation
   - Cannot be manually edited after creation

4. **Set database index**
   - Set `db_index=True`
   - Enable efficient time-based queries
   - Support date range filtering

5. **Add field documentation**
   - Include help_text describing purpose
   - Document that field is auto-populated
   - Example: "Timestamp when conversation started"

6. **Consider timezone handling**
   - Use timezone-aware datetimes
   - Store in UTC in database
   - Convert to user timezone for display

7. **Plan time-based queries**
   - Filter conversations by date range
   - Calculate session durations
   - Generate time-series analytics

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | DateTimeField | Timestamp storage |
| Auto Now Add | True | Automatic on creation |
| Editable | False (implicit) | System-managed field |
| DB Index | True | Time-based query performance |
| Timezone | Aware | UTC storage, local display |

### Timestamp Behavior

```
Conversation Created
     │
     ▼
┌──────────────────────┐
│  started_at set to   │
│  current timestamp   │
│  (UTC)               │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│  Field locked from   │
│  further changes     │
└──────────────────────┘
```

### Time-Based Analytics Use Cases

| Use Case | Implementation |
|----------|----------------|
| Session Duration | ended_at - started_at |
| Daily Volume | Count conversations by date |
| Peak Hours | Group by hour of started_at |
| Response Time | First message timestamp - started_at |
| Time Filters | started_at >= date_from AND started_at <= date_to |

### Query Patterns (Conceptual)

| Query Purpose | Filter Approach |
|---------------|----------------|
| Today's conversations | `started_at__date=today` |
| Last 7 days | `started_at__gte=7_days_ago` |
| Specific date range | `started_at__range=(start, end)` |
| This month | `started_at__month=current_month` |
| Business hours only | `started_at__hour__range=(9, 17)` |

### Timezone Considerations

| Aspect | Implementation |
|--------|----------------|
| Storage | UTC in database |
| Input | Convert local to UTC |
| Output | Convert UTC to user timezone |
| Display | Format per user locale |
| API | ISO 8601 format with timezone |

### Duration Calculation Patterns

```
Active Conversation
├── Duration = now() - started_at
└── Display: "Active for 5 minutes"

Ended Conversation
├── Duration = ended_at - started_at
└── Display: "Lasted 15 minutes"

No End Time
├── Duration = now() - started_at
└── Status: Still calculating
```

### Reporting Metrics

| Metric | Calculation |
|--------|-------------|
| Average Session Length | AVG(ended_at - started_at) |
| Total Sessions Today | COUNT(started_at__date=today) |
| Busiest Hour | MAX(COUNT GROUP BY HOUR(started_at)) |
| Session Distribution | COUNT GROUP BY DATE(started_at) |

### API Response Format

| Field | Format | Example |
|-------|--------|---------|
| started_at | ISO 8601 | "2026-01-31T14:30:00Z" |
| With timezone | ISO 8601 with offset | "2026-01-31T20:00:00+05:30" |
| Display format | Localized | "Jan 31, 2026 8:00 PM" |

### Expected Outcome
- started_at field added to Conversation model
- Timestamp automatically set on conversation creation
- Field is timezone-aware (UTC storage)
- Database indexed for time-based queries
- Ready for duration and analytics calculations

### Verification Checklist
- [ ] started_at field added to Conversation model
- [ ] Field type is DateTimeField
- [ ] auto_now_add=True configured
- [ ] db_index=True for performance
- [ ] help_text added for documentation
- [ ] Timezone utilities imported
- [ ] Field cannot be manually edited

---

## Task 06: Create ended_at Field

### Overview
Add the ended_at field to the Conversation model to record the timestamp when a conversation concludes. Unlike started_at, this field is nullable to accommodate ongoing conversations and is manually set when a conversation is resolved or escalated. This field enables accurate session duration calculations and conversation lifecycle tracking.

### Dependencies
- Task 01: Create Conversation Model
- Task 05: Create started_at Field

### Instructions

1. **Add ended_at field**
   - Add DateTimeField to Conversation model
   - Set field name as `ended_at`
   - Configure nullable behavior

2. **Configure null and blank**
   - Set `null=True` for database nullable
   - Set `blank=True` for form validation
   - Allow ongoing conversations without end time

3. **Do not use auto_now**
   - Leave auto_now as False (default)
   - Field should be manually set
   - Updated when status changes to resolved/escalated

4. **Add database index**
   - Set `db_index=True`
   - Support ended conversation queries
   - Enable time-range filtering

5. **Add field documentation**
   - Include help_text describing purpose
   - Document that field is nullable
   - Example: "Timestamp when conversation ended, null for ongoing conversations"

6. **Plan status correlation**
   - ended_at should be set when status changes to resolved/escalated
   - ended_at should be null when status is active
   - Consider adding model validation

7. **Consider duration calculations**
   - Duration = ended_at - started_at
   - Handle cases where ended_at is null
   - Display "ongoing" for active conversations

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | DateTimeField | Timestamp storage |
| Null | True | Ongoing conversations have no end |
| Blank | True | Optional in forms |
| Auto Now | False | Manually set on status change |
| DB Index | True | Time-based queries |
| Timezone | Aware | UTC storage |

### Field State by Status

| Status | ended_at Value | Meaning |
|--------|---------------|---------|
| ACTIVE | NULL | Conversation ongoing |
| RESOLVED | Timestamp | Conversation completed |
| ESCALATED | Timestamp | Transferred to support |

### Lifecycle Management

```
Conversation Created
     │ started_at set
     │ ended_at = NULL
     │ status = 'active'
     ▼
┌──────────────────┐
│  ACTIVE SESSION  │
│  ended_at: NULL  │
└────────┬─────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌────────────────┐   ┌─────────────────┐
│   RESOLVED     │   │   ESCALATED     │
│ Set ended_at   │   │  Set ended_at   │
└────────────────┘   └─────────────────┘
```

### Duration Calculation Logic

```
Calculate Duration:

IF ended_at IS NULL THEN
    IF status = 'active' THEN
        duration = now() - started_at
        display = "Active for X minutes"
    ELSE
        display = "Duration not recorded"
    END IF
ELSE
    duration = ended_at - started_at
    display = "Lasted X minutes"
END IF
```

### Query Patterns (Conceptual)

| Query Purpose | Filter Approach |
|---------------|----------------|
| Ongoing conversations | `ended_at__isnull=True` |
| Completed conversations | `ended_at__isnull=False` |
| Ended today | `ended_at__date=today` |
| Duration > 30 min | `(ended_at - started_at) > 30min` |
| Resolved last week | `ended_at__gte=week_ago, status='resolved'` |

### Status Transition Actions

| Event | Action | ended_at Behavior |
|-------|--------|-------------------|
| Create conversation | Set status='active' | Leave NULL |
| Bot resolves issue | Set status='resolved' | Set to now() |
| Escalate to human | Set status='escalated' | Set to now() |
| Reopen conversation | Set status='active' | Clear to NULL |
| Auto-close timeout | Set status='resolved' | Set to now() |

### Validation Logic

| Rule | Check | Error Message |
|------|-------|---------------|
| End after start | ended_at > started_at | "End time must be after start time" |
| Active has no end | status='active' implies ended_at=NULL | "Active conversations cannot have end time" |
| Resolved has end | status='resolved' implies ended_at NOT NULL | "Resolved conversations must have end time" |

### Analytics Metrics

| Metric | Calculation |
|--------|-------------|
| Average Resolution Time | AVG(ended_at - started_at) WHERE status='resolved' |
| Open Conversations | COUNT WHERE ended_at IS NULL |
| Closed Today | COUNT WHERE ended_at__date=today |
| Session Completion Rate | COUNT(ended_at NOT NULL) / COUNT(total) |

### API Response Handling

| Scenario | ended_at Value | Display Format |
|----------|---------------|----------------|
| Active conversation | null | "In progress" |
| Resolved conversation | "2026-01-31T14:45:00Z" | ISO 8601 timestamp |
| Duration calculation | Calculate difference | "15 minutes" |

### Expected Outcome
- ended_at field added to Conversation model
- Field is nullable to support ongoing conversations
- Manually set when conversation concludes
- Database indexed for query performance
- Ready for duration calculations and analytics

### Verification Checklist
- [ ] ended_at field added to Conversation model
- [ ] Field type is DateTimeField
- [ ] null=True and blank=True configured
- [ ] auto_now and auto_now_add are False
- [ ] db_index=True for performance
- [ ] help_text added for documentation
- [ ] Field logic documented for status correlation

---

## Task 07: Create Message Model

### Overview
Create the Message model to store individual messages within conversations. This model represents each message exchanged between the user, assistant (chatbot), and system, maintaining the complete conversation history. The Message model uses a foreign key relationship to Conversation and includes role differentiation, content storage, and timestamp tracking for accurate message sequencing.

### Dependencies
- Task 01: Create Conversation Model
- Conversation model must be complete with all fields

### Instructions

1. **Create message model file**
   - Create new file named `message.py` in `models/` directory
   - This file will contain the Message model class

2. **Import required dependencies**
   - Import Django's models module
   - Import timezone utilities for timestamps
   - Import Conversation model from conversation.py

3. **Define Message model class**
   - Create class inheriting from Django's Model
   - Use descriptive class name: `Message`
   - Add class Meta for database configuration

4. **Configure model metadata**
   - Set table name using `db_table`
   - Define ordering by timestamp ascending (chronological)
   - Add verbose name and plural form
   - Configure indexes for query optimization

5. **Plan field structure**
   - Foreign key to Conversation
   - Role field (user, assistant, system)
   - Content field (message text)
   - Timestamp field (message time)

6. **Add __str__ method**
   - Return meaningful string representation
   - Include role and preview of content
   - Format: "{role}: {content[:50]}..."

7. **Consider message ordering**
   - Default ordering by timestamp
   - Enable chronological message retrieval
   - Support conversation flow reconstruction

8. **Plan relationships**
   - Message belongs to one Conversation
   - Conversation has many Messages
   - Define reverse relationship name

### Model Purpose

| Aspect | Description |
|--------|-------------|
| Primary Goal | Store individual conversation messages |
| Tracks | Message content, sender role, timestamp |
| Enables | Conversation history, context retrieval |
| Supports | Multi-turn dialogues, context windows |

### Message Flow in Conversation

```
Conversation
     │
     ├── Message 1 (user: "Hello")
     ├── Message 2 (assistant: "Hi! How can I help?")
     ├── Message 3 (user: "Track my order")
     ├── Message 4 (system: "Intent: ORDER_STATUS")
     ├── Message 5 (assistant: "Please provide order ID")
     └── Message 6 (user: "ORDER123")
```

### Model Characteristics

| Feature | Implementation Approach |
|---------|------------------------|
| Message Storage | TextField for content |
| Role Tracking | CharField with choices |
| Sequencing | Timestamp-based ordering |
| Conversation Link | Foreign key to Conversation |
| Multi-tenancy | Inherits tenant from Conversation |

### Directory Structure After Creation
```
backend/apps/chatbot/models/
├── __init__.py
├── conversation.py
└── message.py          # Created in this task
```

### Database Table Planning

| Column | Type | Purpose |
|--------|------|---------|
| id | AutoField/BigAutoField | Primary key |
| conversation_id | ForeignKey | Link to conversation |
| role | CharField(20) | Message sender type |
| content | TextField | Message text (max 4000 chars) |
| timestamp | DateTimeField | When message was created |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Last modification |

### Role Types Overview

| Role | Sender | Purpose | Example |
|------|--------|---------|---------|
| user | Customer | User input | "What's my order status?" |
| assistant | Chatbot | Bot response | "Your order is on the way!" |
| system | Backend | Internal context | "Intent: ORDER_STATUS" |

### Message Ordering Strategy

```
Default Ordering: timestamp ASC

Query: conversation.messages.all()
Returns:
├── Message 1 (earliest)
├── Message 2
├── Message 3
└── Message N (most recent)

Enables:
├── Chronological display
├── Context window creation
└── Conversation replay
```

### Relationship Structure

```
┌──────────────────────┐
│    Conversation      │
│                      │
│ - session_id         │
│ - customer          │
│ - status            │
└──────────┬───────────┘
           │
           │ 1:N (messages)
           │
           ▼
┌──────────────────────┐
│      Message         │
│                      │
│ - conversation_id ───┘
│ - role
│ - content
│ - timestamp
└──────────────────────┘
```

### Expected Outcome
- Message model class created and properly structured
- Model file located in chatbot app models directory
- Basic model structure ready for field definitions
- Model metadata configured for chronological ordering

### Verification Checklist
- [ ] `message.py` file created in models directory
- [ ] Message class defined with Model inheritance
- [ ] Model Meta class configured
- [ ] `__str__` method implemented
- [ ] Required imports added
- [ ] Ordering set to timestamp ascending
- [ ] Ready for field definitions

---

## Task 08: Create conversation FK

### Overview
Add the conversation foreign key field to the Message model, establishing the many-to-one relationship between messages and conversations. This field links each message to its parent conversation, enabling message retrieval by conversation, cascading deletion when conversations are removed, and proper message organization within the chatbot system.

### Dependencies
- Task 07: Create Message Model
- Task 01: Create Conversation Model must be complete

### Instructions

1. **Import Conversation model**
   - Import Conversation from conversation.py
   - Ensure models are in same package
   - Handle any import order issues

2. **Define conversation field**
   - Add ForeignKey field to Message model
   - Set field name as `conversation`
   - Configure relationship properties

3. **Set on_delete behavior**
   - Set `on_delete=models.CASCADE`
   - Delete all messages when conversation deleted
   - Maintain referential integrity

4. **Configure related_name**
   - Set `related_name='messages'`
   - Enable reverse lookup from Conversation
   - Access via `conversation.messages.all()`

5. **Add database index**
   - Set `db_index=True`
   - Optimize conversation message queries
   - Critical for message retrieval performance

6. **Ensure not nullable**
   - Do not set null=True
   - Every message must belong to conversation
   - Enforce at database level

7. **Add help text**
   - Include descriptive help_text parameter
   - Document relationship purpose
   - Example: "Conversation this message belongs to"

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | ForeignKey(Conversation) | Link to parent conversation |
| On Delete | CASCADE | Remove messages with conversation |
| Related Name | messages | Reverse relationship access |
| Null | False | Message must have conversation |
| DB Index | True | Fast conversation queries |

### Relationship Details

```
Conversation (1) ──────► Message (Many)
     │                       │
     │ conversation          │
     └──────────────────────►│
                             │
                       FK to Conversation
```

### CASCADE Deletion Behavior

```
Delete Conversation
     │
     ▼
┌──────────────────────────┐
│  CASCADE DELETE          │
│  triggered               │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  All related Messages    │
│  automatically deleted   │
└──────────────────────────┘
```

### Reverse Relationship Usage

| Access Pattern | Usage |
|----------------|-------|
| Get all messages | `conversation.messages.all()` |
| Count messages | `conversation.messages.count()` |
| Filter messages | `conversation.messages.filter(role='user')` |
| Get latest message | `conversation.messages.last()` |
| Order messages | `conversation.messages.order_by('timestamp')` |

### Query Patterns (Conceptual)

| Query Purpose | Approach |
|---------------|----------|
| Get conversation messages | `Message.objects.filter(conversation=conv)` |
| Get by session ID | `Message.objects.filter(conversation__session_id=uuid)` |
| Count user messages | `Message.objects.filter(conversation=conv, role='user').count()` |
| Latest message in conversation | `conversation.messages.last()` |

### Index Performance Impact

| Scenario | Without Index | With Index |
|----------|---------------|------------|
| Get messages for conversation | Full table scan | Index seek |
| Query time (1M messages) | ~500ms | ~5ms |
| Disk I/O | High | Low |
| Scalability | Poor | Excellent |

### Conversation-Message Lifecycle

```
1. Create Conversation
   └── conversation_id = 123

2. Add First Message
   ├── message.conversation_id = 123
   └── FK constraint validated

3. Add More Messages
   ├── All link to conversation_id = 123
   └── Retrieved in order via related_name

4. Delete Conversation
   ├── CASCADE triggered
   └── All messages with conversation_id = 123 deleted
```

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Tenant Isolation | Message inherits tenant from Conversation |
| Cross-Tenant Access | Prevented by FK constraint |
| Schema Routing | Automatic via Conversation relationship |
| Query Filtering | Tenant filter on Conversation cascades |

### Expected Outcome
- conversation field added to Message model
- CASCADE delete configured for data integrity
- Related name 'messages' enables reverse queries
- Database indexed for optimal query performance
- Every message must belong to a conversation

### Verification Checklist
- [ ] conversation field added to Message model
- [ ] Field type is ForeignKey to Conversation
- [ ] on_delete=models.CASCADE configured
- [ ] related_name='messages' set
- [ ] db_index=True for performance
- [ ] null=False (default, message must have conversation)
- [ ] help_text added for documentation
- [ ] Conversation model imported correctly

---

## Task 09: Create role Field

### Overview
Add the role field to the Message model to identify the sender type of each message. This field uses predefined choices to distinguish between user messages, assistant (bot) responses, and system messages. Role differentiation enables proper message display formatting, context window construction, and conversation flow understanding for the AI model.

### Dependencies
- Task 07: Create Message Model

### Instructions

1. **Define role choices**
   - Create role choices as class-level constant
   - Use Django's TextChoices or tuple format
   - Define three roles: USER, ASSISTANT, SYSTEM

2. **Create choices constant**
   - Define ROLE_CHOICES at model class level
   - Use descriptive labels for admin interface
   - Consider using Django 3.0+ TextChoices for type safety

3. **Add role field**
   - Add CharField to Message model
   - Set field name as `role`
   - Configure with choices parameter

4. **Configure field properties**
   - Set `max_length=20` for choice values
   - Do not set default (role must be explicit)
   - Add database index for role-based filtering
   - Mark as required (no null/blank)

5. **Add field documentation**
   - Include help_text explaining role types
   - Document expected values and use cases
   - Example: "Type of message sender: user, assistant, or system"

6. **Plan role usage patterns**
   - User: Customer input messages
   - Assistant: Chatbot responses
   - System: Internal context/metadata

7. **Consider display formatting**
   - Different UI rendering per role
   - User messages right-aligned
   - Assistant messages left-aligned
   - System messages subtle/italic

### Role Choices Definition

| Role Value | Display Label | Sender | Purpose |
|-----------|---------------|--------|---------|
| user | User | Customer | User questions/input |
| assistant | Assistant | Chatbot | Bot responses |
| system | System | Backend | Context/metadata |

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | CharField | Text-based role |
| Max Length | 20 | Accommodate choice values |
| Choices | ROLE_CHOICES | Restrict to valid values |
| Default | None | Must be explicitly set |
| DB Index | True | Fast role filtering |
| Null | False | Role always required |

### Conversation Example with Roles

```
┌─────────────────────────────────────────┐
│ user: "What's the status of order 123?" │
│                                         │
│ system: "Intent detected: ORDER_STATUS" │
│                                         │
│ assistant: "Let me check that for you."│
│                                         │
│ system: "Order found: #123"            │
│                                         │
│ assistant: "Your order is on the way!" │
│                                         │
│ user: "Thank you!"                      │
│                                         │
│ assistant: "You're welcome!"            │
└─────────────────────────────────────────┘
```

### Role Usage Patterns

| Role | When Created | Created By | Visible to User |
|------|--------------|------------|-----------------|
| user | User sends message | Frontend/API | Yes |
| assistant | Bot generates response | AI service | Yes |
| system | Internal processing | Backend logic | No (usually) |

### Message Display Formatting

```
User Message (right-aligned)
                    ┌──────────────────┐
                    │ "Hello!"         │
                    │                  │
                    │ [user avatar]    │
                    └──────────────────┘

Assistant Message (left-aligned)
┌──────────────────┐
│ "Hi! How can I   │
│ help you?"       │
│                  │
│ [bot avatar]     │
└──────────────────┘

System Message (centered, subtle)
       ┌─────────────────────┐
       │ Intent: GREETING    │
       └─────────────────────┘
```

### AI Context Window Construction

| Role | Included in Context | Purpose |
|------|-------------------|---------|
| user | Yes | Provide user intent |
| assistant | Yes | Show conversation history |
| system | Optional | Add metadata when needed |

### Query Patterns (Conceptual)

| Query Purpose | Filter Approach |
|---------------|----------------|
| Get user messages | `role='user'` |
| Get bot responses | `role='assistant'` |
| Get system messages | `role='system'` |
| User message count | `filter(role='user').count()` |
| Conversation without system | `exclude(role='system')` |

### System Message Use Cases

| Use Case | Content Example |
|----------|----------------|
| Intent Classification | "Intent detected: ORDER_STATUS" |
| Entity Extraction | "Order ID: ORDER123 extracted" |
| Confidence Score | "Confidence: 0.95" |
| Fallback Trigger | "Low confidence, escalating" |
| Session Events | "User authenticated" |

### API Response Structure

```json
{
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Hello",
      "timestamp": "2026-01-31T14:30:00Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Hi! How can I help?",
      "timestamp": "2026-01-31T14:30:02Z"
    }
  ]
}
```

### Expected Outcome
- role field added to Message model
- Three predefined role choices configured
- No default value (must be explicitly set)
- Field indexed for efficient filtering
- Role-based message handling enabled

### Verification Checklist
- [ ] ROLE_CHOICES constant defined
- [ ] Three role values: user, assistant, system
- [ ] role field added to Message model
- [ ] max_length=20 configured
- [ ] choices=ROLE_CHOICES parameter set
- [ ] No default value (explicit role required)
- [ ] db_index=True for performance
- [ ] help_text added for documentation

---

## Task 10: Create content Field

### Overview
Add the content field to the Message model to store the actual text content of each message. This field uses TextField to accommodate messages of varying lengths while enforcing a maximum character limit for both performance and practical chatbot interaction constraints.

### Dependencies
- Task 07: Create Message Model

### Instructions

1. **Add content field**
   - Add TextField to Message model
   - Set field name as `content`
   - TextField supports variable-length text

2. **Configure field properties**
   - Do not set max_length at database level (TextField)
   - Plan to add application-level validation
   - Mark as required (no null/blank)

3. **Add field documentation**
   - Include help_text describing purpose
   - Document character limit (4000 chars)
   - Example: "Message content, max 4000 characters"

4. **Plan validation strategy**
   - Add validator for max length
   - Consider min length (e.g., 1 char)
   - Implement in model clean() method or serializer

5. **Consider content sanitization**
   - Plan for HTML escaping in views
   - Strip dangerous characters
   - Preserve formatting (line breaks, etc.)

6. **Plan for content search**
   - Consider full-text search indexing
   - Support message content filtering
   - Enable conversation search features

7. **Handle empty content**
   - Prevent empty messages
   - Validate minimum length
   - Ensure meaningful content

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | TextField | Variable-length text storage |
| Max Length | 4000 chars (app-level) | Reasonable message limit |
| Null | False | Content always required |
| Blank | False | Cannot be empty |
| DB Index | False | Full-text search instead |

### Content Length Limits

| Limit Type | Value | Rationale |
|-----------|-------|-----------|
| Minimum | 1 character | Prevent empty messages |
| Maximum | 4000 characters | Reasonable chatbot message |
| Typical User | 50-200 characters | Most user messages |
| Typical Bot | 100-500 characters | Most bot responses |

### Content Validation Rules

```
Validation Logic:

1. Check not empty
   └── len(content.strip()) > 0

2. Check min length
   └── len(content) >= 1

3. Check max length
   └── len(content) <= 4000

4. Sanitize content
   ├── Strip leading/trailing whitespace
   ├── Remove null bytes
   └── Escape HTML if needed

5. Validate UTF-8
   └── Ensure valid Unicode encoding
```

### Message Content Examples

| Role | Typical Content | Length |
|------|----------------|--------|
| user | "What's the status of my order #123?" | 40 chars |
| assistant | "Your order #123 is currently being prepared..." | 150 chars |
| system | "Intent: ORDER_STATUS, Confidence: 0.95" | 40 chars |
| user (long) | Multi-paragraph product inquiry | 800 chars |
| assistant (long) | Detailed product information with specs | 1500 chars |

### Content Sanitization Strategy

| Input | Sanitization | Output |
|-------|--------------|--------|
| HTML tags | Escape or strip | `<script>` → `&lt;script&gt;` |
| SQL injection | Parameterized queries | Safe by default |
| Line breaks | Preserve | `\n` maintained |
| Leading/trailing spaces | Strip | Cleaned content |
| Null bytes | Remove | Safe storage |

### Storage Considerations

| Aspect | Implementation |
|--------|----------------|
| Database Field | TextField (no length limit) |
| Actual Limit | 4000 chars (validated) |
| Average Size | ~200 bytes per message |
| Storage Impact | Minimal (text compresses well) |
| Index Strategy | No DB index, use search service |

### Content Search Capabilities

| Search Type | Implementation |
|-------------|----------------|
| Exact Match | `content__iexact='query'` |
| Contains | `content__icontains='keyword'` |
| Full-Text | PostgreSQL full-text search |
| Elasticsearch | Optional advanced search |

### Content Display Considerations

```
Frontend Display:
├── Escape HTML for security
├── Preserve line breaks
├── Convert URLs to links
├── Format markdown (if supported)
└── Truncate in previews
```

### Expected Outcome
- content field added to Message model
- TextField supports variable-length content
- Maximum length enforced at application level (4000 chars)
- Field is required (no empty messages)
- Ready for content sanitization and validation

### Verification Checklist
- [ ] content field added to Message model
- [ ] Field type is TextField
- [ ] null=False and blank=False (required)
- [ ] help_text added mentioning 4000 char limit
- [ ] No database-level max_length (TextField)
- [ ] Plan for application-level validation documented

---

## Task 11: Create timestamp Field

### Overview
Add the timestamp field to the Message model to record when each message was created. This field uses Django's auto_now_add feature to automatically capture the exact moment a message is sent, enabling chronological message ordering, conversation flow reconstruction, and time-based analytics for chatbot interactions.

### Dependencies
- Task 07: Create Message Model

### Instructions

1. **Import timezone utilities**
   - Ensure Django's timezone module is imported
   - Use timezone-aware datetime handling
   - Support multi-timezone deployments

2. **Add timestamp field**
   - Add DateTimeField to Message model
   - Set field name as `timestamp`
   - Configure auto-population behavior

3. **Configure auto_now_add**
   - Set `auto_now_add=True`
   - Field automatically set on creation
   - Cannot be manually edited after creation

4. **Set database index**
   - Set `db_index=True`
   - Critical for message ordering queries
   - Enable efficient time-based filtering

5. **Add field documentation**
   - Include help_text describing purpose
   - Document auto-population behavior
   - Example: "When this message was sent"

6. **Consider timezone handling**
   - Store in UTC in database
   - Convert to user timezone for display
   - Consistent with started_at/ended_at fields

7. **Verify ordering configuration**
   - Model Meta ordering should use timestamp
   - Ensure chronological message retrieval
   - Support conversation flow display

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | DateTimeField | Timestamp storage |
| Auto Now Add | True | Automatic on creation |
| Editable | False (implicit) | System-managed field |
| DB Index | True | Critical for ordering |
| Timezone | Aware | UTC storage |

### Timestamp Behavior

```
Message Created
     │
     ▼
┌──────────────────────┐
│  timestamp set to    │
│  current time (UTC)  │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│  Field locked from   │
│  further changes     │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│  Used for ordering   │
│  in queries          │
└──────────────────────┘
```

### Message Ordering Strategy

```
Default Model Ordering: timestamp ASC

Query: conversation.messages.all()

Results in chronological order:
├── Message 1 (13:00:00)
├── Message 2 (13:00:15)
├── Message 3 (13:01:30)
└── Message 4 (13:02:45)

Benefits:
├── Natural conversation flow
├── Context window in correct order
└── Replay functionality
```

### Query Performance Impact

| Query Type | Without Index | With Index |
|-----------|---------------|------------|
| Order by timestamp | O(n log n) sort | O(n) index scan |
| Latest message | Full scan | Index seek |
| Time range filter | Full scan | Index range scan |
| Conversation messages | Sort required | Pre-sorted |

### Time-Based Query Patterns (Conceptual)

| Query Purpose | Approach |
|---------------|----------|
| Get messages in order | `order_by('timestamp')` |
| Latest message | `order_by('-timestamp').first()` |
| Messages after time | `filter(timestamp__gt=time)` |
| Messages in range | `filter(timestamp__range=(start, end))` |
| Messages today | `filter(timestamp__date=today)` |

### Response Time Calculation

```
Calculate Response Time:

user_message = Message (role='user', timestamp=T1)
bot_message = Message (role='assistant', timestamp=T2)

response_time = T2 - T1

Example:
├── User: "Hello" at 13:00:00
├── Bot: "Hi!" at 13:00:02
└── Response time: 2 seconds
```

### Conversation Flow Reconstruction

```
Retrieve messages ordered by timestamp:

┌─────────────────────────────────────┐
│ 13:00:00 │ user      │ "Hello"     │
│ 13:00:02 │ assistant │ "Hi!"       │
│ 13:00:15 │ user      │ "My order?" │
│ 13:00:17 │ system    │ Intent...   │
│ 13:00:18 │ assistant │ "Order..."  │
└─────────────────────────────────────┘
```

### API Response Format

| Field | Format | Example |
|-------|--------|---------|
| timestamp | ISO 8601 | "2026-01-31T13:00:00Z" |
| With timezone | ISO 8601 offset | "2026-01-31T18:30:00+05:30" |
| Display | Localized | "1:00 PM" |
| Relative | Human-friendly | "2 minutes ago" |

### Analytics Use Cases

| Metric | Calculation |
|--------|-------------|
| Average Response Time | AVG(assistant_timestamp - user_timestamp) |
| Messages Per Hour | COUNT GROUP BY HOUR(timestamp) |
| Peak Usage Times | MAX(COUNT GROUP BY HOUR(timestamp)) |
| Session Message Rate | COUNT / (ended_at - started_at) |

### Timezone Handling

| Context | Timezone | Format |
|---------|----------|--------|
| Database Storage | UTC | 2026-01-31 13:00:00+00 |
| API Response | UTC ISO 8601 | 2026-01-31T13:00:00Z |
| User Display | User's timezone | 6:30 PM IST |
| Admin Interface | Server timezone | Configurable |

### Expected Outcome
- timestamp field added to Message model
- Automatically set to current time on creation
- Database indexed for optimal ordering performance
- Timezone-aware (UTC storage)
- Critical for chronological message retrieval

### Verification Checklist
- [ ] timestamp field added to Message model
- [ ] Field type is DateTimeField
- [ ] auto_now_add=True configured
- [ ] db_index=True for performance
- [ ] help_text added for documentation
- [ ] Model Meta ordering includes timestamp
- [ ] Field cannot be manually edited
- [ ] Timezone utilities imported

---

## Summary

This document established the foundation of the chatbot system by creating the Conversation and Message models. The Conversation model tracks chat sessions with UUID-based session IDs, customer associations, status management, and lifecycle timestamps. The Message model stores individual messages with role differentiation, content storage, and precise timestamps for chronological ordering.

### Completed Tasks
1. ✓ Created Conversation model as session container
2. ✓ Added session_id UUID field for unique session tracking
3. ✓ Added customer FK supporting both guests and authenticated users
4. ✓ Added status field with active/resolved/escalated states
5. ✓ Added started_at timestamp for session creation time
6. ✓ Added ended_at nullable timestamp for session conclusion
7. ✓ Created Message model for individual messages
8. ✓ Added conversation FK with CASCADE delete
9. ✓ Added role field for user/assistant/system differentiation
10. ✓ Added content TextField for message text
11. ✓ Added timestamp field for message ordering

### Next Steps
Proceed to [02_Tasks-12-16_Intent-Migration.md](02_Tasks-12-16_Intent-Migration.md) to create the Intent model for intent classification training data, add required fields, generate migrations, and verify all models are properly configured.
