# Tasks 67-73: Pickup Model and API

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** E - Pickup & COD  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-D_Tracking-Webhooks/02_Tasks-59-66_Webhook-Events.md](../Group-D_Tracking-Webhooks/02_Tasks-59-66_Webhook-Events.md)
- **→ Next Document:** [02_Tasks-74-80_COD-Reconcile-Verify.md](02_Tasks-74-80_COD-Reconcile-Verify.md)

---

## Document Overview

This document covers the implementation of pickup scheduling functionality for Koombiyo courier services. It establishes the Pickup model to store pickup requests, implements the pickup scheduling API integration, handles response parsing, and supports bulk pickup scheduling for multiple waybills.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create Pickup Model | Medium | 30 min |
| 68 | Create Pickup Date | Low | 15 min |
| 69 | Create Pickup Time Slot | Low | 20 min |
| 70 | Create Pickup Status | Low | 15 min |
| 71 | Create schedule_pickup API | Medium | 40 min |
| 72 | Create Pickup Response | Low | 20 min |
| 73 | Create Bulk Pickup | Medium | 35 min |

---

## Task 67: Create Pickup Model

### Overview
Create the Pickup model to store courier pickup scheduling information. This model tracks when pickups are requested, their time slots, status, and which waybills are associated with each pickup. The model supports multi-tenancy and integrates with the existing shipment tracking system.

### Dependencies
- Task 66: Verify tracking & webhooks flow

### Instructions

1. **Navigate to the pickup models location**
   - Go to `backend/apps/shipping/models/` directory
   - Create new file named `pickup.py`
   - This will contain the pickup-related models

2. **Import required dependencies**
   - Import Django model classes and field types
   - Import TenantModel or add tenant ForeignKey
   - Import timezone utilities from Django
   - Import related models (Shipment, User)

3. **Define the Pickup model class**
   - Create model class inheriting from appropriate base
   - Add class Meta with db_table and ordering
   - Set verbose names for admin interface
   - Configure default ordering by pickup_date descending

4. **Add tenant relationship field**
   - Create ForeignKey to Tenant model
   - Set on_delete to CASCADE
   - Add related_name as 'pickups'
   - Include db_index for query performance

5. **Add tracking and audit fields**
   - Create created_at field with auto_now_add
   - Create updated_at field with auto_now
   - Add created_by ForeignKey to User (nullable)
   - Add tenant-specific pickup reference number

6. **Add Koombiyo integration fields**
   - Create koombiyo_pickup_id field (CharField, nullable)
   - Store the pickup ID returned from Koombiyo API
   - Add confirmation_number field for tracking
   - Set max_length to 100 characters

7. **Configure waybill relationships**
   - Add ManyToManyField to Shipment model
   - Set related_name as 'pickups'
   - This allows multiple waybills per pickup
   - Enables tracking which packages are in each pickup

8. **Add notes and special instructions**
   - Create special_instructions TextField (nullable)
   - Allow merchants to add pickup notes
   - Add address_notes for specific location details
   - Set blank=True, null=True for optional fields

9. **Implement string representation**
   - Define __str__ method returning pickup info
   - Format: "Pickup PKXX on YYYY-MM-DD (Status)"
   - Include tenant info if multi-tenant display needed

10. **Add model methods**
    - Create can_cancel method checking status
    - Add is_editable method for business logic
    - Implement get_waybill_count method
    - Add get_estimated_packages_count helper

### Pickup Model Fields

| Field | Type | Purpose |
|-------|------|---------|
| tenant | ForeignKey | Multi-tenancy support |
| pickup_date | DateField | Scheduled pickup date |
| time_slot | CharField | Morning/Afternoon slot |
| status | CharField | Pickup status tracking |
| waybills | ManyToMany | Associated shipments |
| koombiyo_pickup_id | CharField | API confirmation ID |
| special_instructions | TextField | Merchant notes |
| created_at | DateTimeField | Record creation |

### Pickup Reference Format

```
Format: PK{tenant_id}-{sequential_number}
Examples:
├── PK001-00001 (First pickup for tenant 1)
├── PK001-00002 (Second pickup for tenant 1)
└── PK002-00001 (First pickup for tenant 2)
```

### Model Relationships

```
Pickup Model
    │
    ├─── tenant ────────────> Tenant
    │                          (ForeignKey)
    │
    ├─── waybills ──────────> Shipment
    │                          (ManyToMany)
    │
    └─── created_by ────────> User
                               (ForeignKey, nullable)
```

### Business Rules

| Rule | Implementation |
|------|----------------|
| Future Dates Only | Pickup date must be today or later |
| Time Slot Required | Must select morning or afternoon |
| Minimum Waybills | At least one waybill per pickup |
| Cancel Deadline | Can only cancel before day of pickup |

### Expected Outcome
- Pickup model created with all required fields
- Multi-tenancy support implemented
- Relationships to Shipment and Tenant configured
- Model methods for business logic added
- String representation shows useful info

### Verification Checklist
- [ ] Pickup model class created in `pickup.py`
- [ ] Tenant ForeignKey added with proper cascade
- [ ] ManyToMany relationship to Shipment configured
- [ ] Koombiyo integration fields included
- [ ] Audit fields (created_at, updated_at) present
- [ ] __str__ method returns meaningful representation
- [ ] Model Meta configured with table name and ordering

---

## Task 68: Create Pickup Date

### Overview
Implement the pickup_date field with proper validation to ensure pickups can only be scheduled for current or future dates. This field is critical for scheduling logistics and must integrate with Sri Lankan business calendar considerations (holidays, weekends).

### Dependencies
- Task 67: Create Pickup Model

### Instructions

1. **Add the pickup_date field**
   - Navigate to Pickup model in `pickup.py`
   - Add DateField named `pickup_date`
   - Set null=False, blank=False (required field)
   - Add db_index=True for query performance

2. **Configure field properties**
   - Set verbose_name to "Pickup Date"
   - Add help_text explaining date requirements
   - Include example format: "YYYY-MM-DD"
   - Set editable=True for admin interface

3. **Add date validation**
   - Create clean method or validator function
   - Check that pickup_date is not in the past
   - Allow today's date if before cutoff time
   - Raise ValidationError with clear message

4. **Implement cutoff time logic**
   - Define PICKUP_CUTOFF_HOUR constant (e.g., 14:00)
   - If today's date selected, check current time
   - If past cutoff, require tomorrow's date minimum
   - Display user-friendly error message in Sinhala time format

5. **Add business day validation**
   - Check if selected date is a weekend (Saturday/Sunday)
   - Check against Sri Lankan public holidays
   - Create helper method is_business_day
   - Suggest next business day if invalid

6. **Configure Sri Lankan holiday calendar**
   - Create or import holiday calendar utility
   - Include major Sri Lankan holidays
   - Support both fixed and variable holidays
   - Update annually for accuracy

7. **Add date formatting utilities**
   - Create method get_formatted_date
   - Support multiple formats (ISO, display, Sinhala)
   - Add timezone awareness for Asia/Colombo
   - Return localized date strings

8. **Implement date range queries**
   - Add manager method for upcoming_pickups
   - Create filter for pickups_by_date_range
   - Support date-based reporting
   - Optimize with proper indexing

### Pickup Date Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Past Dates | Reject | "Pickup date cannot be in the past" |
| Today After Cutoff | Reject | "Today's pickup cutoff (2:00 PM) has passed. Please schedule for tomorrow" |
| Weekends | Reject | "Pickups not available on weekends. Next available: Monday" |
| Public Holidays | Reject | "Selected date is a public holiday. Next business day: [date]" |

### Sri Lankan Public Holidays (Common)

```
Fixed Holidays
├── January 1: New Year's Day
├── February 4: Independence Day
├── May 1: Labour Day
├── December 25: Christmas Day
└── December 26: Boxing Day

Variable Holidays (Buddhist/Hindu/Muslim)
├── Vesak Poya (May full moon)
├── Poson Poya (June full moon)
├── Esala Poya (July full moon)
├── Deepavali (October/November)
└── Eid al-Fitr, Eid al-Adha
```

### Cutoff Time Logic

```
Current Time Check
    │
    ├─── Before 2:00 PM ──> Allow today's date
    │                        └── If business day
    │
    └─── After 2:00 PM ───> Require tomorrow+
                             └── Next business day
```

### Date Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| null | False | Always required |
| blank | False | No empty submissions |
| db_index | True | Query performance |
| validators | [future_date_validator] | Prevent past dates |

### Expected Outcome
- Pickup date field added with proper validation
- Past dates rejected with clear error messages
- Cutoff time logic implemented
- Weekend and holiday validation working
- Sri Lankan business calendar integrated

### Verification Checklist
- [ ] pickup_date DateField added to Pickup model
- [ ] Field marked as required (null=False, blank=False)
- [ ] Past date validation implemented
- [ ] Cutoff time logic (2:00 PM) working
- [ ] Weekend validation rejects Saturdays/Sundays
- [ ] Public holiday calendar integrated
- [ ] Error messages are clear and actionable
- [ ] Database index created for performance

---

## Task 69: Create Pickup Time Slot

### Overview
Implement the time_slot field to allow merchants to specify morning or afternoon pickup preferences. This field uses predefined choices to ensure consistency and helps Koombiyo plan their collection routes efficiently based on Sri Lankan business hours.

### Dependencies
- Task 67: Create Pickup Model

### Instructions

1. **Define time slot choices**
   - Create TimeSlot choices class or constant
   - Define MORNING option (9:00 AM - 12:00 PM)
   - Define AFTERNOON option (1:00 PM - 5:00 PM)
   - Use descriptive labels for user interface

2. **Add time_slot field**
   - Navigate to Pickup model in `pickup.py`
   - Add CharField named `time_slot`
   - Set max_length to 20 characters
   - Configure choices parameter with TimeSlot options

3. **Configure field properties**
   - Set null=False, blank=False (required)
   - Add verbose_name as "Time Slot"
   - Include help_text with slot descriptions
   - Set default to None to force selection

4. **Implement time slot validation**
   - Create validator for time slot consistency
   - Check if slot is valid for selected date
   - For same-day pickups, validate against current time
   - Raise ValidationError if morning slot but already afternoon

5. **Add time slot display methods**
   - Create get_time_slot_display_hours method
   - Return formatted time range string
   - Support 12-hour and 24-hour formats
   - Include timezone information (IST)

6. **Implement business logic methods**
   - Add is_morning_slot property
   - Add is_afternoon_slot property
   - Create get_slot_end_time method
   - Add has_slot_expired checking current time

7. **Configure API serialization**
   - Ensure time_slot serializes to API format
   - Map to Koombiyo's expected slot values
   - Handle timezone conversions if needed
   - Support both reading and writing

8. **Add query optimization**
   - Create manager method for morning_pickups
   - Add filter for afternoon_pickups
   - Support time-slot-based reporting
   - Index field if frequently queried

### Time Slot Definitions

| Slot | Time Range | Display Name | Best For |
|------|-----------|--------------|----------|
| MORNING | 09:00 - 12:00 | Morning (9 AM - 12 PM) | Early dispatch |
| AFTERNOON | 13:00 - 17:00 | Afternoon (1 PM - 5 PM) | Later packing time |

### Time Slot Validation Logic

```
Same-Day Pickup Check
    │
    ├─── If Morning Slot Selected
    │         │
    │         └─── Current Time < 11:00 AM ──> Allow
    │              Current Time >= 11:00 AM ──> Reject
    │
    └─── If Afternoon Slot Selected
              │
              └─── Current Time < 15:00 PM ──> Allow
                   Current Time >= 15:00 PM ──> Reject
```

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| field_type | CharField | Limited choices |
| max_length | 20 | Sufficient for slot names |
| choices | TimeSlot.choices | Enforce valid values |
| default | None | Force explicit selection |

### Time Slot Choice Implementation

```
TimeSlot Choices
├── MORNING = "morning"
│   ├── Label: "Morning (9:00 AM - 12:00 PM)"
│   └── Hours: 09:00-12:00
│
└── AFTERNOON = "afternoon"
    ├── Label: "Afternoon (1:00 PM - 5:00 PM)"
    └── Hours: 13:00-17:00
```

### Sri Lankan Business Context

| Consideration | Implementation |
|---------------|----------------|
| Business Hours | Most businesses open 9 AM - 6 PM |
| Lunch Break | Typically 12:00 PM - 1:00 PM |
| Traffic Patterns | Morning for faster collection |
| Prayer Times | Friday afternoon considerations |

### Expected Outcome
- Time slot field with morning/afternoon choices
- Validation prevents invalid same-day slots
- Display methods show readable time ranges
- Query filters support slot-based searches
- Integration with Koombiyo API format

### Verification Checklist
- [ ] time_slot CharField added with choices
- [ ] MORNING and AFTERNOON options defined
- [ ] Field marked as required
- [ ] Same-day validation checks current time
- [ ] get_time_slot_display_hours method works
- [ ] is_morning_slot and is_afternoon_slot properties added
- [ ] Time slots serialize correctly for API
- [ ] Help text shows clear time ranges

---

## Task 70: Create Pickup Status

### Overview
Implement the status field to track the lifecycle of pickup requests from initial creation through completion or cancellation. This field uses a state machine pattern to ensure valid status transitions and provides visibility into the pickup workflow.

### Dependencies
- Task 67: Create Pickup Model

### Instructions

1. **Define pickup status choices**
   - Create PickupStatus choices class or constant
   - Define PENDING status (initial state)
   - Define SCHEDULED status (confirmed with Koombiyo)
   - Define COMPLETED status (packages collected)
   - Define CANCELLED status (pickup cancelled)

2. **Add status field**
   - Navigate to Pickup model in `pickup.py`
   - Add CharField named `status`
   - Set max_length to 20 characters
   - Configure choices with PickupStatus options

3. **Configure field properties**
   - Set default to PENDING status
   - Mark as required (null=False, blank=False)
   - Add verbose_name as "Pickup Status"
   - Include help_text describing status meaning

4. **Implement status transition validation**
   - Create clean method for status changes
   - Define valid transition rules
   - Prevent invalid transitions (e.g., COMPLETED to PENDING)
   - Raise ValidationError for invalid transitions

5. **Add status query properties**
   - Create is_pending property
   - Add is_scheduled property
   - Create is_completed property
   - Add is_cancelled property
   - Add is_active property (not cancelled/completed)

6. **Implement status change methods**
   - Create mark_as_scheduled method
   - Add mark_as_completed method
   - Create cancel_pickup method
   - Include timestamp recording for each transition

7. **Add status history tracking**
   - Consider creating PickupStatusHistory model
   - Record status changes with timestamps
   - Track user who made the change
   - Store reason for cancellations

8. **Configure status-based filtering**
   - Add manager method for active_pickups
   - Create filter for pending_pickups
   - Add query for scheduled_pickups
   - Support status-based reporting

### Pickup Status Definitions

| Status | Description | Initial | Terminal | Color Code |
|--------|-------------|---------|----------|------------|
| PENDING | Pickup request created, awaiting scheduling | Yes | No | Yellow |
| SCHEDULED | Confirmed with Koombiyo, courier assigned | No | No | Blue |
| COMPLETED | Packages successfully collected | No | Yes | Green |
| CANCELLED | Pickup cancelled by merchant or system | No | Yes | Red |

### Status Transition Rules

```
PENDING
    │
    ├────> SCHEDULED ──────> COMPLETED
    │                            ▲
    │                            │
    └────> CANCELLED <───────────┘
           (Can cancel             (Can complete
            before pickup)         before completion)
```

### Valid Transitions Matrix

| From \ To | PENDING | SCHEDULED | COMPLETED | CANCELLED |
|-----------|---------|-----------|-----------|-----------|
| PENDING | ✓ | ✓ | ✗ | ✓ |
| SCHEDULED | ✗ | ✓ | ✓ | ✓ |
| COMPLETED | ✗ | ✗ | ✓ | ✗ |
| CANCELLED | ✗ | ✗ | ✗ | ✓ |

### Status Change Business Logic

| Transition | Conditions | Actions |
|------------|-----------|---------|
| PENDING → SCHEDULED | Koombiyo confirms | Save confirmation ID |
| SCHEDULED → COMPLETED | Courier collects | Update all waybills |
| Any → CANCELLED | Before collection | Notify relevant parties |
| SCHEDULED → COMPLETED | After pickup time | Auto-complete if confirmed |

### Status Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| field_type | CharField | State values |
| max_length | 20 | Accommodate status names |
| choices | PickupStatus.choices | Valid values only |
| default | "PENDING" | Initial state |

### Expected Outcome
- Status field with four pickup states
- Status transition validation enforced
- Helper properties for status checking
- Status change methods with business logic
- Query filters for status-based searches

### Verification Checklist
- [ ] status CharField added with choices
- [ ] Four statuses defined (PENDING, SCHEDULED, COMPLETED, CANCELLED)
- [ ] Default status set to PENDING
- [ ] Status transition validation implemented
- [ ] Helper properties (is_pending, is_scheduled, etc.) created
- [ ] Status change methods added
- [ ] Invalid transitions raise ValidationError
- [ ] Manager filters for each status type

---

## Task 71: Create schedule_pickup API

### Overview
Implement the integration with Koombiyo's pickup scheduling API endpoint. This service method sends pickup requests to Koombiyo, handles authentication, formats the request payload according to their specifications, and processes the response to update local pickup records.

### Dependencies
- Task 67: Create Pickup Model
- Task 68: Create Pickup Date
- Task 69: Create Pickup Time Slot
- Task 70: Create Pickup Status

### Instructions

1. **Create pickup service class**
   - Navigate to `backend/apps/shipping/services/` directory
   - Create file named `pickup_service.py`
   - Define PickupService class
   - Initialize with tenant context

2. **Add API configuration**
   - Import Koombiyo base configuration from settings
   - Define pickup scheduling endpoint URL
   - Set up authentication headers
   - Configure timeout and retry settings

3. **Implement schedule_pickup method**
   - Create method accepting pickup instance
   - Validate pickup data before API call
   - Build request payload from pickup fields
   - Include authentication credentials

4. **Format pickup request payload**
   - Map pickup_date to Koombiyo's date format
   - Convert time_slot to API slot value
   - Include merchant address details
   - Add list of waybill numbers
   - Include special instructions if provided

5. **Handle merchant address details**
   - Retrieve tenant's pickup address
   - Format address according to Koombiyo requirements
   - Include contact person details
   - Add phone number in +94 format
   - Include address coordinates if available

6. **Add waybill information**
   - Collect all waybill numbers from pickup.waybills
   - Format as array of strings
   - Include package count for each waybill
   - Add estimated total weight if available

7. **Implement API request execution**
   - Use requests library or HTTP client
   - Set proper headers (Content-Type, Authorization)
   - Send POST request to schedule endpoint
   - Handle connection errors and timeouts
   - Log request details for debugging

8. **Add error handling**
   - Catch network errors (ConnectionError, Timeout)
   - Handle HTTP errors (400, 401, 500)
   - Parse Koombiyo error responses
   - Create meaningful error messages
   - Log errors with context for debugging

9. **Process successful response**
   - Parse JSON response from Koombiyo
   - Extract pickup confirmation ID
   - Update pickup instance with response data
   - Change status to SCHEDULED
   - Save pickup record

10. **Implement retry logic**
    - Add retry decorator with exponential backoff
    - Configure maximum retry attempts (3)
    - Only retry on transient errors (5xx, timeouts)
    - Don't retry on client errors (4xx)
    - Log each retry attempt

11. **Add transaction management**
    - Wrap database updates in transaction
    - Ensure atomicity of status changes
    - Rollback on API failures
    - Update related waybill statuses

12. **Create notification hooks**
    - Trigger notification on successful scheduling
    - Alert merchant about pickup confirmation
    - Send details (date, time slot, confirmation ID)
    - Include cancellation instructions

### Koombiyo Pickup API Specification

| Parameter | Required | Format | Example |
|-----------|----------|--------|---------|
| pickup_date | Yes | YYYY-MM-DD | "2026-02-01" |
| time_slot | Yes | morning/afternoon | "morning" |
| address | Yes | String | "123 Galle Road, Colombo 03" |
| contact_name | Yes | String | "John Silva" |
| contact_phone | Yes | +94XXXXXXXXX | "+94771234567" |
| waybills | Yes | Array | ["KMB001", "KMB002"] |
| special_instructions | No | String | "Ring bell twice" |

### Request Payload Structure

```json
{
  "merchant_id": "MERCHANT123",
  "pickup_date": "2026-02-01",
  "time_slot": "morning",
  "pickup_address": {
    "line1": "123 Galle Road",
    "line2": "Colombo 03",
    "city": "Colombo",
    "postal_code": "00300",
    "country": "LK"
  },
  "contact_person": {
    "name": "John Silva",
    "phone": "+94771234567",
    "email": "john@example.lk"
  },
  "waybills": ["KMB001", "KMB002", "KMB003"],
  "estimated_packages": 3,
  "special_instructions": "Ring bell twice"
}
```

### Response Structure

```json
Success (200):
{
  "status": "success",
  "pickup_id": "PKP20260201M001",
  "scheduled_date": "2026-02-01",
  "time_slot": "morning",
  "confirmation_code": "CONF123456",
  "message": "Pickup scheduled successfully"
}

Error (400):
{
  "status": "error",
  "error_code": "INVALID_DATE",
  "message": "Pickup date must be a future business day",
  "details": {}
}
```

### Error Handling Strategy

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Invalid Date | 400 | Show validation message |
| Invalid Time Slot | 400 | Show available slots |
| Unauthorized | 401 | Refresh authentication |
| No Coverage | 400 | Alert about service area |
| Server Error | 500 | Retry with backoff |
| Network Error | - | Retry with backoff |

### Pickup Scheduling Flow

```
1. Validate Pickup Data
    │
    ├─── Valid ───> 2. Build API Payload
    │                    │
    │                    ▼
    │               3. Send to Koombiyo
    │                    │
    │                    ├─── Success ──> 4. Parse Response
    │                    │                    │
    │                    │                    ▼
    │                    │               5. Update Status
    │                    │                    │
    │                    │                    ▼
    │                    │               6. Save Record
    │                    │                    │
    │                    │                    ▼
    │                    │               7. Notify Merchant
    │                    │
    │                    └─── Error ───> Handle & Retry
    │
    └─── Invalid ──> Return Error
```

### Expected Outcome
- PickupService class created with schedule_pickup method
- API integration with Koombiyo pickup endpoint
- Request payload formatted correctly
- Error handling for all failure scenarios
- Retry logic for transient failures
- Pickup status updated on success
- Merchant notifications triggered

### Verification Checklist
- [ ] PickupService class created in `pickup_service.py`
- [ ] schedule_pickup method implemented
- [ ] API endpoint URL configured correctly
- [ ] Request payload includes all required fields
- [ ] Authentication headers set properly
- [ ] Error handling covers all scenarios
- [ ] Retry logic with exponential backoff
- [ ] Successful response updates pickup status to SCHEDULED
- [ ] koombiyo_pickup_id saved from response
- [ ] Merchant notification sent on success

---

## Task 72: Create Pickup Response

### Overview
Implement a response parser to handle and validate the data returned from Koombiyo's pickup scheduling API. This parser extracts the pickup confirmation ID, validates the response structure, handles error responses, and updates the local pickup record with the confirmed details.

### Dependencies
- Task 71: Create schedule_pickup API

### Instructions

1. **Create response parser class**
   - Add PickupResponseParser class to `pickup_service.py`
   - Initialize with raw API response
   - Support parsing both success and error responses
   - Handle JSON parsing errors gracefully

2. **Validate response structure**
   - Check for required fields in response
   - Verify response status field exists
   - Ensure pickup_id is present on success
   - Validate data types of response fields

3. **Parse successful response**
   - Extract pickup_id from response
   - Retrieve confirmation_code
   - Parse scheduled_date and time_slot
   - Extract any additional metadata
   - Store courier assignment if provided

4. **Extract pickup confirmation ID**
   - Locate pickup_id in response JSON
   - Validate format (alphanumeric, 20 chars)
   - Store as koombiyo_pickup_id
   - Log the confirmation for audit trail

5. **Parse scheduled details**
   - Extract confirmed pickup_date
   - Verify matches requested date
   - Parse confirmed time_slot
   - Store estimated arrival window if provided

6. **Handle error responses**
   - Check for error status in response
   - Extract error_code field
   - Parse error message
   - Map to user-friendly messages
   - Include details for troubleshooting

7. **Implement response validation**
   - Create validate_success_response method
   - Check all required fields present
   - Verify field formats and types
   - Raise exception if invalid structure
   - Log validation failures

8. **Add response mapping methods**
   - Create to_dict method for parsed data
   - Map API fields to model fields
   - Convert date/time formats if needed
   - Handle timezone conversions
   - Return structured data for model update

9. **Implement error mapping**
   - Create error code mapping dictionary
   - Map Koombiyo codes to display messages
   - Include resolution suggestions
   - Support Sinhala error messages
   - Handle unknown error codes gracefully

10. **Add logging and debugging**
    - Log raw API response for debugging
    - Record parsed values
    - Track validation errors
    - Log mapping issues
    - Include request correlation ID

### Response Parser Structure

```
PickupResponseParser
    │
    ├── __init__(raw_response)
    │       └── Store raw response
    │
    ├── is_success()
    │       └── Check status field
    │
    ├── get_pickup_id()
    │       └── Extract & validate ID
    │
    ├── get_confirmation_code()
    │       └── Extract confirmation
    │
    ├── get_error_info()
    │       └── Parse error details
    │
    ├── to_dict()
    │       └── Return structured data
    │
    └── validate()
            └── Check response integrity
```

### Response Field Mapping

| Koombiyo Field | Model Field | Type | Required |
|----------------|-------------|------|----------|
| pickup_id | koombiyo_pickup_id | String | Yes |
| confirmation_code | confirmation_number | String | Yes |
| scheduled_date | pickup_date | Date | Yes |
| time_slot | time_slot | String | Yes |
| status | status | String | Yes |

### Success Response Processing

```
Parse Success Response
    │
    ├── 1. Validate Structure
    │       └── Check required fields
    │
    ├── 2. Extract Pickup ID
    │       └── Store koombiyo_pickup_id
    │
    ├── 3. Get Confirmation Code
    │       └── Store confirmation_number
    │
    ├── 4. Verify Scheduled Details
    │       └── Match request data
    │
    └── 5. Return Parsed Data
            └── Dictionary for model update
```

### Error Code Mapping

| Error Code | Koombiyo Message | User-Friendly Message (English) | සිංහල පණිවිඩය |
|------------|------------------|--------------------------------|---------------|
| INVALID_DATE | Invalid pickup date | Please select a valid business day | වලංගු ව්‍යාපාර දිනයක් තෝරන්න |
| INVALID_SLOT | Invalid time slot | Please select Morning or Afternoon | උදෑසන හෝ පස්වරු තෝරන්න |
| NO_COVERAGE | Area not covered | Koombiyo doesn't service this area | මෙම ප්‍රදේශයට සේවාවක් නැත |
| MAX_LIMIT | Daily limit reached | Maximum pickups scheduled for this date | මෙම දිනය සඳහා උපරිම අගය ළඟා වී ඇත |

### Error Response Processing

```
Parse Error Response
    │
    ├── 1. Check Error Status
    │       └── status == "error"
    │
    ├── 2. Extract Error Code
    │       └── Get error_code field
    │
    ├── 3. Map to User Message
    │       └── Lookup friendly message
    │
    ├── 4. Extract Details
    │       └── Parse error details object
    │
    └── 5. Raise Appropriate Exception
            └── Include all error info
```

### Validation Rules

| Check | Requirement | Action on Failure |
|-------|-------------|-------------------|
| Status Field | Must be present | Raise ParseError |
| Pickup ID | Required on success | Raise ParseError |
| Date Format | ISO 8601 format | Convert or raise error |
| Time Slot | Valid slot value | Validate against choices |

### Expected Outcome
- PickupResponseParser class handles all responses
- Success responses extract pickup_id correctly
- Confirmation code stored appropriately
- Error responses mapped to user-friendly messages
- Response validation catches malformed data
- Logging provides debugging information

### Verification Checklist
- [ ] PickupResponseParser class created
- [ ] is_success method checks response status
- [ ] get_pickup_id extracts confirmation ID
- [ ] get_confirmation_code retrieves confirmation
- [ ] Error responses parsed with error_code
- [ ] Error mapping provides user-friendly messages
- [ ] Response validation catches missing fields
- [ ] to_dict returns properly formatted data
- [ ] All response fields logged for debugging

---

## Task 73: Create Bulk Pickup

### Overview
Implement bulk pickup scheduling functionality to allow merchants to schedule a single pickup for multiple waybills. This feature optimizes the pickup process by grouping multiple shipments together, reducing coordination overhead and improving efficiency for both merchants and couriers.

### Dependencies
- Task 71: Create schedule_pickup API
- Task 72: Create Pickup Response

### Instructions

1. **Create bulk pickup method**
   - Add schedule_bulk_pickup method to PickupService
   - Accept list of waybill IDs/numbers
   - Accept pickup date and time slot
   - Validate all waybills belong to same tenant

2. **Validate waybills for bulk pickup**
   - Check all waybills exist in system
   - Verify all belong to same tenant
   - Ensure waybills are in valid status for pickup
   - Reject waybills already assigned to pickups
   - Check waybills are not yet shipped

3. **Implement waybill grouping logic**
   - Group waybills by destination area if needed
   - Consider package size/weight constraints
   - Check Koombiyo's maximum waybills per pickup
   - Split into multiple pickups if exceeding limit
   - Maintain transaction consistency

4. **Create bulk pickup record**
   - Create single Pickup instance
   - Set pickup date and time slot
   - Associate all waybills via ManyToMany
   - Calculate total estimated packages
   - Add bulk pickup identifier

5. **Build bulk API request**
   - Collect all waybill numbers
   - Format as array in API payload
   - Include total package count
   - Add combined weight if available
   - Include any bulk-specific notes

6. **Handle bulk API response**
   - Parse response using PickupResponseParser
   - Update pickup record with confirmation
   - Update status of all associated waybills
   - Mark all waybills as "Pickup Scheduled"
   - Store pickup reference on each waybill

7. **Implement transaction management**
   - Wrap bulk operation in database transaction
   - Ensure all-or-nothing semantics
   - Rollback on any failure
   - Maintain data consistency
   - Log transaction boundaries

8. **Add partial failure handling**
   - If API rejects some waybills, handle gracefully
   - Create pickup for accepted waybills
   - Return list of rejected waybills with reasons
   - Allow merchant to address issues
   - Support retry for failed waybills

9. **Implement pickup splitting**
   - Check if waybill count exceeds limit (e.g., 50)
   - Split into multiple pickup requests automatically
   - Schedule all pickups for same date/slot
   - Link split pickups in system
   - Notify merchant of multiple pickups

10. **Add bulk pickup UI support methods**
    - Create get_bulk_pickup_summary method
    - Return waybill count, total packages
    - Calculate estimated pickup time
    - List all waybill numbers
    - Support export to CSV/PDF

11. **Implement scheduling optimization**
    - Suggest optimal time slot based on volume
    - Consider merchant's typical packing time
    - Factor in order cutoff times
    - Recommend consolidation opportunities
    - Alert about daily pickup limits

12. **Add bulk notification system**
    - Send confirmation email with all waybills
    - Generate printable pickup manifest
    - Include QR codes for quick scanning
    - Send SMS reminder on pickup day
    - Support WhatsApp notification

### Bulk Pickup Workflow

```
Bulk Pickup Request
    │
    ├── 1. Validate Waybills
    │       ├── Check existence
    │       ├── Verify tenant ownership
    │       └── Validate status
    │
    ├── 2. Group if Needed
    │       └── Split if > max limit
    │
    ├── 3. Create Pickup Record(s)
    │       └── Associate waybills
    │
    ├── 4. Call Koombiyo API
    │       └── Send bulk request
    │
    ├── 5. Process Response
    │       ├── Update pickup status
    │       └── Update waybill statuses
    │
    └── 6. Notify Merchant
            └── Send confirmation
```

### Bulk Pickup Constraints

| Constraint | Limit | Action if Exceeded |
|------------|-------|-------------------|
| Max Waybills per Pickup | 50 | Auto-split into multiple pickups |
| Max Weight per Pickup | 100 kg | Warn merchant, require split |
| Same Tenant | Required | Reject with error |
| Valid Status | Pending shipment | Filter out invalid waybills |

### Waybill Validation Rules

| Rule | Check | Action on Failure |
|------|-------|-------------------|
| Existence | Waybill exists in DB | Return error with missing IDs |
| Tenant Match | All same tenant_id | Reject entire request |
| Status | Not yet shipped | Exclude from pickup |
| Already Scheduled | No existing pickup | Show existing pickup info |

### Pickup Splitting Example

```
Input: 75 waybills
Max Limit: 50 waybills per pickup

Result:
├── Pickup 1: Waybills 1-50
│   ├── Date: 2026-02-01
│   ├── Slot: Morning
│   └── Ref: PK001-00001
│
└── Pickup 2: Waybills 51-75
    ├── Date: 2026-02-01
    ├── Slot: Morning
    └── Ref: PK001-00002
```

### Bulk API Payload

```json
{
  "merchant_id": "MERCHANT123",
  "pickup_date": "2026-02-01",
  "time_slot": "morning",
  "pickup_address": { ... },
  "contact_person": { ... },
  "waybills": [
    "KMB001", "KMB002", "KMB003", "KMB004",
    "KMB005", "KMB006", "KMB007", "KMB008"
  ],
  "estimated_packages": 8,
  "total_weight_kg": 15.5,
  "special_instructions": "Multiple boxes, handle with care"
}
```

### Bulk Pickup Notification Content

```
Email Subject: Pickup Scheduled - 8 Packages

Dear Merchant,

Your bulk pickup has been confirmed:

Pickup Date: February 1, 2026
Time Slot: Morning (9:00 AM - 12:00 PM)
Confirmation: CONF123456
Total Packages: 8

Waybills:
- KMB001, KMB002, KMB003, KMB004
- KMB005, KMB006, KMB007, KMB008

Please ensure all packages are ready for collection.

[Download Pickup Manifest]
```

### Expected Outcome
- Bulk pickup scheduling method implemented
- Multiple waybills associated with single pickup
- Automatic splitting for large batches
- Transaction management ensures consistency
- Merchant receives comprehensive confirmation
- All waybills updated with pickup status

### Verification Checklist
- [ ] schedule_bulk_pickup method created
- [ ] Waybill validation checks tenant ownership
- [ ] Waybills checked for valid pickup status
- [ ] Maximum waybills limit enforced (50)
- [ ] Auto-split functionality for large batches
- [ ] Single Pickup record created with all waybills
- [ ] ManyToMany relationship configured correctly
- [ ] All waybills updated with pickup reference
- [ ] Transaction wraps entire bulk operation
- [ ] Merchant notification includes all waybills
- [ ] Pickup manifest generation supported

---
