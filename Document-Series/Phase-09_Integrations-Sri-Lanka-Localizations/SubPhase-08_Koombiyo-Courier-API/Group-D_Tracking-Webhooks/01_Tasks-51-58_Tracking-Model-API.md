# Tasks 51-58: Tracking Model and API

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** D - Tracking & Webhooks  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../Group-C_Waybill-Generation/02_Tasks-44-50_Payload-PDF-Verify.md](../Group-C_Waybill-Generation/02_Tasks-44-50_Payload-PDF-Verify.md)
- **→ Next Document:** [02_Tasks-59-66_Webhook-Events.md](02_Tasks-59-66_Webhook-Events.md)

---

## Document Overview

This document covers the implementation of the shipment tracking system for Koombiyo courier integration. It establishes the TrackingEvent model to store status updates, creates the API integration to fetch tracking information from Koombiyo, and implements the logic to parse and persist tracking events. The tracking system enables real-time visibility of shipment status, location updates, and event history throughout the delivery lifecycle.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create TrackingEvent Model | Medium | 30 min |
| 52 | Create Event Waybill FK | Low | 15 min |
| 53 | Create Event Status | Low | 20 min |
| 54 | Create Event Timestamp | Low | 15 min |
| 55 | Create Event Location | Low | 20 min |
| 56 | Create track_shipment API | Medium | 45 min |
| 57 | Create Tracking Response | Medium | 35 min |
| 58 | Create Save Events | Medium | 40 min |

---

## Task 51: Create TrackingEvent Model

### Overview
Create the TrackingEvent model to store shipment tracking information received from Koombiyo. This model acts as the central data structure for capturing every status change, location update, and timestamp associated with a waybill's journey from pickup to delivery. Each tracking event represents a discrete status update in the shipment's lifecycle.

### Dependencies
- Task 50: Verify Waybill Generation (from Group C)
- Waybill model exists
- Base model mixins available

### Instructions

1. **Create model file structure**
   - Navigate to `backend/apps/shipping/models/` directory
   - Create new file named `tracking_event.py`
   - Import necessary Django model classes and fields
   - Import timezone utilities for timestamp handling

2. **Define TrackingEvent model class**
   - Create model class inheriting from Django's Model base class
   - Include tenant-aware model mixins if required
   - Add model-level metadata (db_table, ordering, indexes)
   - Set default ordering by timestamp (most recent first)

3. **Configure model metadata**
   - Set verbose name to "Tracking Event"
   - Set verbose name plural to "Tracking Events"
   - Define database table name following naming conventions
   - Add compound unique constraint on waybill + timestamp + status

4. **Add model string representation**
   - Implement `__str__` method for admin display
   - Return format: "Waybill {waybill_number} - {status} @ {timestamp}"
   - Ensure human-readable output for debugging

5. **Define model manager methods**
   - Create custom manager for tracking event queries
   - Add method to get latest event for waybill
   - Add method to get events by status
   - Add method to get events within date range

6. **Add validation methods**
   - Implement clean method for data validation
   - Validate status is one of allowed choices
   - Validate timestamp is not in future
   - Validate location format if provided

7. **Configure model indexes**
   - Add database index on waybill foreign key
   - Add index on timestamp for chronological queries
   - Add composite index on (waybill, timestamp)
   - Consider index on status field for filtering

8. **Update model imports**
   - Add TrackingEvent to `models/__init__.py`
   - Export model for use in other modules
   - Ensure model is registered with Django

### TrackingEvent Model Structure

```
TrackingEvent Model
├── Primary Key: id (AutoField)
├── Foreign Keys
│   └── waybill (Task 52)
├── Status Fields
│   └── status (Task 53)
├── Temporal Fields
│   └── timestamp (Task 54)
├── Location Fields
│   └── location (Task 55)
└── Audit Fields
    ├── created_at
    └── updated_at
```

### Model Relationships

| Relationship | Type | Model | On Delete |
|--------------|------|-------|-----------|
| waybill | ForeignKey | Waybill | CASCADE |

### Data Integrity Rules

| Rule | Implementation |
|------|----------------|
| Unique Events | Compound unique on (waybill, timestamp, status) |
| Required Fields | waybill, status, timestamp must be non-null |
| Status Validation | Status must be valid Koombiyo status code |
| Timestamp Range | Timestamp cannot be in the future |

### Expected Outcome
- TrackingEvent model created and registered
- Model includes all necessary fields and relationships
- Proper validation and constraints applied
- Model indexed for optimal query performance

### Verification Checklist
- [ ] `tracking_event.py` file created in models directory
- [ ] Model class defined with proper base classes
- [ ] Model metadata configured correctly
- [ ] String representation implemented
- [ ] Validation methods added
- [ ] Database indexes configured
- [ ] Model exported in `__init__.py`
- [ ] Model appears in Django admin

---

## Task 52: Create Event Waybill FK

### Overview
Establish the foreign key relationship between TrackingEvent and Waybill models. This relationship enables tracking events to be associated with specific shipments, allowing retrieval of complete tracking history for any waybill. The foreign key ensures referential integrity and enables efficient queries for shipment tracking.

### Dependencies
- Task 51: Create TrackingEvent Model
- Waybill model exists and is migrated

### Instructions

1. **Define foreign key field**
   - Add waybill field to TrackingEvent model
   - Use ForeignKey field type pointing to Waybill model
   - Set related_name to "tracking_events" for reverse lookups
   - Configure on_delete behavior to CASCADE

2. **Configure foreign key options**
   - Set db_index=True for query performance
   - Add help_text describing the relationship
   - Set verbose_name to "Waybill"
   - Ensure field is not nullable (null=False)

3. **Add related name usage**
   - Document reverse relationship usage
   - Enable querying: `waybill.tracking_events.all()`
   - Enable filtering: `waybill.tracking_events.filter(status='DELIVERED')`
   - Enable ordering: `waybill.tracking_events.order_by('-timestamp')`

4. **Configure CASCADE behavior**
   - Ensure tracking events are deleted when waybill is deleted
   - Document this behavior in model docstring
   - Consider implications for data retention

5. **Add select_related optimization**
   - Configure default queryset to include waybill
   - Reduce database queries when accessing waybill data
   - Implement in custom manager

6. **Test relationship integrity**
   - Verify foreign key constraint in database
   - Test CASCADE delete behavior
   - Test reverse relationship queries
   - Verify index creation

### Foreign Key Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| to | 'shipping.Waybill' | Target model |
| on_delete | models.CASCADE | Delete events with waybill |
| related_name | 'tracking_events' | Reverse query name |
| db_index | True | Query performance |
| null | False | Required field |
| blank | False | Form validation |

### Relationship Usage Examples

| Query Pattern | Purpose |
|---------------|---------|
| `waybill.tracking_events.all()` | Get all events for waybill |
| `waybill.tracking_events.latest('timestamp')` | Get most recent event |
| `waybill.tracking_events.filter(status='IN_TRANSIT')` | Events by status |
| `TrackingEvent.objects.select_related('waybill')` | Optimize queries |

### CASCADE Behavior

```
Delete Waybill
    │
    ▼
Cascade to TrackingEvent
    │
    ├── Delete Event 1
    ├── Delete Event 2
    ├── Delete Event 3
    └── Delete Event N
```

### Expected Outcome
- Foreign key relationship established
- Reverse lookups configured properly
- CASCADE delete behavior working
- Database constraint and index created

### Verification Checklist
- [ ] Waybill foreign key field added
- [ ] on_delete=CASCADE configured
- [ ] related_name='tracking_events' set
- [ ] Database index created
- [ ] Reverse relationship works
- [ ] CASCADE delete tested
- [ ] Select_related optimization added

---

## Task 53: Create Event Status

### Overview
Add the status field to TrackingEvent model to store the shipment status at each tracking checkpoint. The status field captures various states in the delivery lifecycle using Koombiyo's status codes, enabling status-based filtering, reporting, and business logic triggers. This field is critical for tracking shipment progression and triggering automated actions.

### Dependencies
- Task 51: Create TrackingEvent Model

### Instructions

1. **Define status choices enumeration**
   - Create TextChoices class for status values
   - Include all Koombiyo status codes
   - Add human-readable labels for each status
   - Consider future status additions

2. **Add status field to model**
   - Use CharField with max_length=50
   - Set choices parameter to status enumeration
   - Make field required (null=False, blank=False)
   - Add db_index=True for filtering performance

3. **Define status choices**
   - PENDING: "Package pending pickup"
   - PICKED_UP: "Package picked up from sender"
   - IN_TRANSIT: "Package in transit"
   - OUT_FOR_DELIVERY: "Out for delivery"
   - DELIVERED: "Package delivered"
   - FAILED: "Delivery failed"
   - RETURNED: "Package returned to sender"
   - CANCELLED: "Shipment cancelled"

4. **Add status validation**
   - Validate status is one of allowed choices
   - Prevent invalid status values
   - Implement in model's clean method

5. **Add status helper properties**
   - Create @property for is_delivered
   - Create @property for is_in_progress
   - Create @property for is_terminal_status
   - Add status_display method for UI

6. **Configure field metadata**
   - Set verbose_name to "Status"
   - Add help_text describing valid values
   - Document status transition rules

7. **Add status transition validation**
   - Define allowed status transitions
   - Prevent invalid state changes
   - Document status state machine

### Status Enumeration

| Status Code | Label | Description | Terminal |
|-------------|-------|-------------|----------|
| PENDING | Pending Pickup | Awaiting collection | No |
| PICKED_UP | Picked Up | Collected from sender | No |
| IN_TRANSIT | In Transit | Moving between locations | No |
| OUT_FOR_DELIVERY | Out for Delivery | Final mile delivery | No |
| DELIVERED | Delivered | Successfully delivered | Yes |
| FAILED | Delivery Failed | Delivery attempt failed | Yes |
| RETURNED | Returned | Returned to sender | Yes |
| CANCELLED | Cancelled | Shipment cancelled | Yes |

### Status State Machine

```
    PENDING
       │
       ▼
   PICKED_UP
       │
       ▼
   IN_TRANSIT ◄──┐
       │         │
       ▼         │
OUT_FOR_DELIVERY │
       │         │
       ├─────────┘ (retry)
       │
       ├────► DELIVERED (success)
       │
       ├────► FAILED ────► RETURNED
       │
       └────► CANCELLED
```

### Status Helper Properties

| Property | Returns | Purpose |
|----------|---------|---------|
| is_delivered | bool | Check if delivered |
| is_failed | bool | Check if failed |
| is_in_progress | bool | Check if in transit |
| is_terminal | bool | Check if final state |
| can_retry | bool | Check if retry possible |

### Field Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Status code |
| max_length | 50 | Accommodate codes |
| choices | StatusChoices | Valid values |
| db_index | True | Query performance |
| null | False | Required field |
| blank | False | Required in forms |

### Expected Outcome
- Status field added with proper choices
- Status enumeration defined
- Helper properties created
- Status validation implemented

### Verification Checklist
- [ ] Status field added to model
- [ ] StatusChoices enumeration created
- [ ] All Koombiyo statuses included
- [ ] Database index on status field
- [ ] Helper properties implemented
- [ ] Status validation working
- [ ] Human-readable labels defined

---

## Task 54: Create Event Timestamp

### Overview
Add the timestamp field to TrackingEvent model to record the exact date and time when each tracking event occurred. The timestamp field is crucial for chronological ordering, event timeline visualization, and determining the most recent status of a shipment. It captures when Koombiyo registered the event in their system.

### Dependencies
- Task 51: Create TrackingEvent Model

### Instructions

1. **Add timestamp field to model**
   - Use DateTimeField for date and time storage
   - Set db_index=True for chronological queries
   - Make field required (null=False, blank=False)
   - Configure timezone awareness

2. **Configure timezone handling**
   - Ensure timezone-aware datetimes
   - Store all timestamps in UTC
   - Use Django's timezone utilities
   - Convert to Asia/Colombo for display

3. **Set field metadata**
   - Set verbose_name to "Event Timestamp"
   - Add help_text: "Date and time when event occurred"
   - Document that timestamps are in UTC

4. **Add timestamp validation**
   - Validate timestamp is not in future
   - Validate timestamp is after waybill creation date
   - Implement in model's clean method

5. **Configure default ordering**
   - Update model Meta ordering to ['-timestamp']
   - Most recent events appear first
   - Consistent across all querysets

6. **Add timestamp helper methods**
   - Create method to get formatted timestamp
   - Create method to get relative time ("2 hours ago")
   - Create method for Sri Lanka timezone display

7. **Add timestamp indexes**
   - Add single field index on timestamp
   - Add composite index on (waybill, timestamp)
   - Optimize for date range queries

8. **Implement timestamp queries**
   - Add queryset method for events after date
   - Add queryset method for events before date
   - Add queryset method for events in date range

### Timestamp Field Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| field_type | DateTimeField | Date and time |
| auto_now_add | False | Manual setting |
| auto_now | False | No auto-update |
| db_index | True | Query performance |
| null | False | Required field |
| blank | False | Required in forms |

### Timezone Strategy

```
Koombiyo API Response
    │ (ISO 8601 format)
    ▼
Parse with Timezone
    │ (Parse as UTC or convert)
    ▼
Store in Database (UTC)
    │
    ▼
Display to User
    │ (Convert to Asia/Colombo)
    ▼
Frontend Display (Local format)
```

### Timestamp Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Not Future | timestamp <= now() | "Timestamp cannot be in future" |
| After Creation | timestamp >= waybill.created_at | "Event before waybill creation" |
| Valid Format | ISO 8601 compliant | "Invalid timestamp format" |

### Timestamp Helper Methods

| Method | Returns | Example Output |
|--------|---------|----------------|
| get_formatted_timestamp() | str | "2025-01-31 14:30:00" |
| get_relative_time() | str | "2 hours ago" |
| get_colombo_time() | datetime | Asia/Colombo timezone |
| get_date_only() | date | "2025-01-31" |

### Composite Index for Performance

| Index Fields | Query Pattern |
|--------------|---------------|
| (waybill, timestamp) | Events for waybill ordered by time |
| (timestamp) | All events in date range |
| (status, timestamp) | Events by status, ordered by time |

### Expected Outcome
- Timestamp field added with timezone support
- UTC storage with Asia/Colombo display
- Timestamp validation implemented
- Chronological ordering configured

### Verification Checklist
- [ ] Timestamp field added to model
- [ ] Timezone-aware datetime configured
- [ ] Database index on timestamp
- [ ] Validation prevents future timestamps
- [ ] Model ordering by timestamp (desc)
- [ ] Helper methods for formatting
- [ ] Composite index created
- [ ] Timezone conversion working

---

## Task 55: Create Event Location

### Overview
Add the location field to TrackingEvent model to capture the geographical location or facility name where each tracking event occurred. This field provides visibility into the shipment's physical journey through Koombiyo's network, including hub names, branch locations, and delivery addresses. Location data enhances tracking transparency for customers and enables route analysis.

### Dependencies
- Task 51: Create TrackingEvent Model

### Instructions

1. **Add location field to model**
   - Use CharField for location name/description
   - Set max_length=255 to accommodate full addresses
   - Make field optional (null=True, blank=True)
   - Add db_index=True for location-based queries

2. **Configure field options**
   - Set verbose_name to "Location"
   - Add help_text: "Hub, branch, or address where event occurred"
   - Set default to empty string or null
   - Allow blank for events without location

3. **Define location format standards**
   - Store location as provided by Koombiyo
   - Common formats: "Colombo Hub", "Kandy Branch", "Customer Address"
   - Normalize location names for consistency
   - Trim whitespace and standardize casing

4. **Add location validation**
   - Validate location length within max_length
   - Clean and normalize location strings
   - Remove special characters if needed
   - Implement in model's clean method

5. **Add location helper methods**
   - Create method to get location type (Hub, Branch, Customer)
   - Create method to extract city from location
   - Create method to check if location is final destination

6. **Configure location search**
   - Add location to search fields in admin
   - Enable filtering by location prefix
   - Support partial location matching

7. **Add location analytics support**
   - Create queryset method to group events by location
   - Create method to get most common locations
   - Support for location-based reporting

### Location Field Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Location text |
| max_length | 255 | Full addresses |
| null | True | Optional field |
| blank | True | Allow empty |
| db_index | True | Search performance |
| default | '' | Empty string |

### Location Format Examples

| Location Type | Example Value | Description |
|---------------|---------------|-------------|
| Main Hub | "Colombo Central Hub" | Primary sorting facility |
| Regional Hub | "Kandy Regional Hub" | Regional distribution center |
| Branch | "Galle Branch Office" | Local branch location |
| Delivery Point | "Colombo 07 - Customer Address" | Final delivery location |
| Warehouse | "Horana Warehouse" | Storage facility |

### Location Data Flow

```
Koombiyo API Response
    │ (location string)
    ▼
Normalize Location
    │ (trim, titlecase)
    ▼
Validate Format
    │ (length, characters)
    ▼
Store in TrackingEvent
    │
    ▼
Display in Tracking UI
    │ (formatted display)
    ▼
Location Analytics
```

### Location Helper Methods

| Method | Returns | Purpose |
|--------|---------|---------|
| get_location_type() | str | Hub, Branch, or Customer |
| extract_city() | str | City name from location |
| is_final_destination() | bool | Check if delivery location |
| normalize_location() | str | Standardized format |

### Location-Based Queries

| Query Pattern | Purpose |
|---------------|---------|
| `filter(location__icontains='Colombo')` | Events in Colombo |
| `filter(location__istartswith='Hub')` | All hub events |
| `values('location').distinct()` | Unique locations |
| `annotate(count=Count('location'))` | Events per location |

### Location Validation Rules

| Validation | Rule | Action |
|------------|------|--------|
| Max Length | <= 255 chars | Truncate or raise error |
| Special Chars | Alphanumeric + spaces | Remove invalid chars |
| Empty Value | Allowed | Store as null or empty |
| Normalization | Title case | Standardize format |

### Expected Outcome
- Location field added to model
- Location normalization implemented
- Helper methods for location analysis
- Location-based filtering enabled

### Verification Checklist
- [ ] Location field added to model
- [ ] Field is optional (null=True, blank=True)
- [ ] Database index on location
- [ ] Location normalization logic
- [ ] Helper methods implemented
- [ ] Admin search includes location
- [ ] Location validation working
- [ ] Location-based queries functional

---

## Task 56: Create track_shipment API

### Overview
Implement the track_shipment API method to fetch tracking information from Koombiyo's tracking endpoint. This method communicates with Koombiyo's API to retrieve the complete tracking history for a specific waybill number, returning an array of tracking events with status updates, timestamps, and location information. The API enables real-time tracking data synchronization.

### Dependencies
- Task 51-55: TrackingEvent model complete
- KoombiyoProvider base class exists
- API credentials configured

### Instructions

1. **Add method to KoombiyoProvider class**
   - Navigate to `backend/apps/shipping/providers/koombiyo/provider.py`
   - Add new method named `track_shipment`
   - Accept waybill_number parameter
   - Return tracking events data or raise exception

2. **Define method signature**
   - Method: `track_shipment(waybill_number: str) -> dict`
   - Parameter validation for waybill_number
   - Return type: dictionary with tracking events array
   - Raise appropriate exceptions for errors

3. **Build API request**
   - Endpoint: GET `/api/v1/waybill/track/{waybill_number}`
   - Include authentication headers
   - Set content-type to application/json
   - Add request timeout (30 seconds)

4. **Configure request headers**
   - Add Authorization header with API token
   - Add Content-Type: application/json
   - Add custom User-Agent if required
   - Include API version header if needed

5. **Implement API call**
   - Use requests library or http client
   - Handle connection timeouts
   - Handle SSL/TLS verification
   - Retry on transient failures (with backoff)

6. **Handle API response**
   - Check response status code (200 = success)
   - Parse JSON response body
   - Extract tracking events array
   - Handle empty tracking data

7. **Implement error handling**
   - Handle 404: Waybill not found
   - Handle 401/403: Authentication errors
   - Handle 500: Server errors
   - Handle network timeout errors
   - Raise custom exceptions with details

8. **Add response validation**
   - Validate response structure
   - Check for required fields in events
   - Validate event data types
   - Log validation errors

9. **Implement retry logic**
   - Retry on network errors (max 3 attempts)
   - Exponential backoff between retries
   - Don't retry on 4xx errors (client errors)
   - Log each retry attempt

10. **Add logging**
    - Log API request details
    - Log response status and timing
    - Log any errors or exceptions
    - Use appropriate log levels

### API Endpoint Details

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/api/v1/waybill/track/{waybill_number}` |
| Base URL | From settings |
| Auth | Bearer token |
| Timeout | 30 seconds |

### Request Structure

```
GET /api/v1/waybill/track/WB123456789
Host: api.koombiyo.lk
Authorization: Bearer {api_token}
Content-Type: application/json
```

### Response Structure

```
Success (200):
{
  "success": true,
  "waybill_number": "WB123456789",
  "tracking_events": [
    {
      "status": "DELIVERED",
      "timestamp": "2025-01-31T10:30:00Z",
      "location": "Colombo 07",
      "description": "Package delivered to customer"
    },
    ...
  ]
}

Error (404):
{
  "success": false,
  "error": "Waybill not found",
  "error_code": "WAYBILL_NOT_FOUND"
}
```

### Error Handling Strategy

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Not Found | 404 | Raise WaybillNotFoundError |
| Unauthorized | 401 | Raise AuthenticationError |
| Server Error | 500 | Retry, then raise APIError |
| Timeout | - | Retry, then raise TimeoutError |
| Invalid Response | 200 | Log and raise ValidationError |

### Retry Configuration

```
Retry Logic:
├── Max Attempts: 3
├── Backoff: Exponential (2^attempt seconds)
├── Retry On: Network errors, 5xx errors
├── No Retry: 4xx errors
└── Log: Each attempt
```

### Method Implementation Flow

```
track_shipment(waybill_number)
    │
    ├─► Validate waybill_number
    │
    ├─► Build API request
    │
    ├─► Execute HTTP call (with retry)
    │
    ├─► Check response status
    │
    ├─► Parse JSON response
    │
    ├─► Validate response structure
    │
    └─► Return tracking events data
```

### Expected Outcome
- track_shipment method implemented in provider
- API communication working correctly
- Error handling robust and informative
- Retry logic prevents transient failures

### Verification Checklist
- [ ] track_shipment method added to provider
- [ ] Method signature correct with type hints
- [ ] API endpoint URL constructed correctly
- [ ] Authentication headers included
- [ ] Response parsing implemented
- [ ] Error handling covers all cases
- [ ] Retry logic working
- [ ] Logging statements added
- [ ] Timeout configured
- [ ] Method tested with valid waybill

---

## Task 57: Create Tracking Response

### Overview
Implement the tracking response parser to transform Koombiyo's API response into a structured format suitable for database storage. The parser extracts tracking events from the API response, normalizes field names, validates data types, and converts timestamps to the appropriate format. This ensures clean, consistent data flows into the TrackingEvent model.

### Dependencies
- Task 56: Create track_shipment API

### Instructions

1. **Create parser module**
   - Create file: `backend/apps/shipping/providers/koombiyo/parsers.py`
   - Import necessary utilities (datetime, timezone)
   - Import exception classes
   - Import TrackingEvent model

2. **Define parse_tracking_response function**
   - Function signature: `parse_tracking_response(response_data: dict) -> list`
   - Accept raw API response dictionary
   - Return list of parsed tracking event dictionaries
   - Raise exceptions for invalid data

3. **Validate response structure**
   - Check response_data contains 'tracking_events' key
   - Verify tracking_events is a list
   - Handle empty tracking events array
   - Raise ValidationError if structure invalid

4. **Iterate through tracking events**
   - Loop through each event in tracking_events array
   - Extract required fields from each event
   - Skip events with missing required fields
   - Log skipped events

5. **Parse event status**
   - Extract status field from event
   - Map Koombiyo status codes to internal codes
   - Normalize status strings (uppercase)
   - Validate status is in allowed choices

6. **Parse event timestamp**
   - Extract timestamp field from event
   - Parse ISO 8601 datetime string
   - Convert to timezone-aware datetime
   - Set timezone to UTC for storage
   - Handle multiple datetime formats

7. **Parse event location**
   - Extract location field from event (optional)
   - Default to empty string if not provided
   - Normalize location string (trim, title case)
   - Truncate to max_length if needed

8. **Parse additional fields**
   - Extract description or notes if available
   - Extract courier name if provided
   - Extract any custom fields
   - Store in JSON field if model supports it

9. **Build parsed event dictionary**
   - Create dictionary with normalized field names
   - Map API fields to model fields
   - Include all required fields
   - Return dictionary ready for model creation

10. **Handle parsing errors**
    - Catch datetime parsing errors
    - Catch missing field errors
    - Log parsing errors with event data
    - Skip invalid events or raise exception based on config

11. **Add status mapping**
    - Create mapping dictionary for status codes
    - Map Koombiyo codes to TrackingEvent status choices
    - Handle unknown status codes gracefully
    - Log unmapped status codes

### Parser Function Flow

```
parse_tracking_response(response_data)
    │
    ├─► Validate response structure
    │
    ├─► Extract tracking_events array
    │
    ├─► For each event:
    │   │
    │   ├─► Parse status
    │   ├─► Parse timestamp
    │   ├─► Parse location
    │   ├─► Build event dict
    │   └─► Add to results list
    │
    └─► Return list of parsed events
```

### Status Code Mapping

| Koombiyo Status | Internal Status | Notes |
|-----------------|-----------------|-------|
| pending | PENDING | Awaiting pickup |
| picked_up | PICKED_UP | Collected |
| in_transit | IN_TRANSIT | In network |
| out_for_delivery | OUT_FOR_DELIVERY | Final mile |
| delivered | DELIVERED | Successfully delivered |
| delivery_failed | FAILED | Delivery attempt failed |
| returned | RETURNED | RTO |
| cancelled | CANCELLED | Shipment cancelled |

### Field Mapping

| API Field | Model Field | Transformation |
|-----------|-------------|----------------|
| status | status | Map code, uppercase |
| timestamp | timestamp | Parse ISO 8601, to UTC |
| location | location | Normalize, truncate |
| description | (metadata) | Store in JSON field |

### Timestamp Parsing Strategy

```
API Timestamp Format:
├── "2025-01-31T10:30:00Z" (ISO 8601 UTC)
├── "2025-01-31T10:30:00+05:30" (with timezone)
└── "2025-01-31 10:30:00" (without timezone)

Parsing:
├─► Try ISO 8601 format first
├─► Try alternate formats if needed
├─► Assume UTC if no timezone
└─► Convert to UTC for storage
```

### Parsed Event Dictionary Structure

```
{
  'status': 'DELIVERED',
  'timestamp': datetime(2025, 1, 31, 10, 30, 0, tzinfo=UTC),
  'location': 'Colombo 07',
  'metadata': {
    'description': 'Package delivered to customer',
    'courier_name': 'John Doe'
  }
}
```

### Error Handling in Parser

| Error Type | Action | Result |
|------------|--------|--------|
| Missing tracking_events | Raise ValidationError | Parsing fails |
| Invalid timestamp | Log and skip event | Event excluded |
| Unknown status | Map to PENDING | Event included with default |
| Missing required field | Skip event | Event excluded, logged |

### Validation Rules

| Field | Validation | Action on Failure |
|-------|------------|-------------------|
| status | In status choices | Skip or default to PENDING |
| timestamp | Valid datetime | Skip event |
| location | String, max 255 | Truncate |
| waybill_number | Matches request | Log warning |

### Expected Outcome
- Parser function extracts and normalizes tracking data
- Status codes mapped correctly
- Timestamps parsed and converted to UTC
- Clean, validated data ready for model creation

### Verification Checklist
- [ ] Parser function created
- [ ] Response structure validation implemented
- [ ] Status code mapping working
- [ ] Timestamp parsing handles multiple formats
- [ ] Location normalization working
- [ ] Field mapping correct
- [ ] Error handling for invalid data
- [ ] Logging for skipped events
- [ ] Parser tested with sample responses
- [ ] Returns list of dictionaries

---

## Task 58: Create Save Events Logic

### Overview
Implement the logic to save parsed tracking events to the database, ensuring data integrity and avoiding duplicates. This function takes the list of parsed tracking events and creates or updates TrackingEvent records, handling duplicate detection, timestamp ordering, and waybill association. The save logic acts as the final step in the tracking data ingestion pipeline.

### Dependencies
- Task 51-55: TrackingEvent model complete
- Task 57: Tracking response parser ready

### Instructions

1. **Create service module**
   - Create file: `backend/apps/shipping/services/tracking_service.py`
   - Import TrackingEvent model
   - Import parser function
   - Import transaction utilities

2. **Define save_tracking_events function**
   - Function signature: `save_tracking_events(waybill, events_data: list) -> int`
   - Accept waybill instance and parsed events list
   - Return count of events saved
   - Use database transaction for atomicity

3. **Begin database transaction**
   - Wrap save logic in atomic transaction
   - Rollback on any error
   - Ensure data consistency
   - Use Django's transaction.atomic()

4. **Iterate through parsed events**
   - Loop through each event dictionary in events_data
   - Process events in timestamp order
   - Handle each event individually
   - Continue on individual event errors

5. **Check for duplicate events**
   - Query for existing event with same waybill + timestamp + status
   - Use get_or_create for atomic duplicate prevention
   - Skip if event already exists
   - Log duplicate detection

6. **Create TrackingEvent instance**
   - Build TrackingEvent from parsed dictionary
   - Associate with waybill foreign key
   - Set all required fields
   - Set optional fields with defaults

7. **Set event fields**
   - Set waybill foreign key to provided waybill
   - Set status from parsed data
   - Set timestamp from parsed data
   - Set location from parsed data (if available)

8. **Validate and save event**
   - Call model's full_clean() for validation
   - Handle validation errors gracefully
   - Save instance to database
   - Catch and log any save errors

9. **Track saved event count**
   - Increment counter for each successfully saved event
   - Skip count for duplicates
   - Return final count at end

10. **Update waybill status**
    - Get latest tracking event by timestamp
    - Update waybill status to match latest event
    - Update waybill last_tracked_at timestamp
    - Save waybill changes

11. **Handle batch processing**
    - Process all events even if some fail
    - Collect errors but don't stop processing
    - Return count of successful saves
    - Log summary of batch processing

12. **Add logging**
    - Log start of save process
    - Log each event saved or skipped
    - Log duplicate detections
    - Log final count of events saved

### Save Events Flow

```
save_tracking_events(waybill, events_data)
    │
    ├─► Start transaction
    │
    ├─► For each parsed event:
    │   │
    │   ├─► Check for duplicate
    │   │   ├─► If exists: Skip
    │   │   └─► If new: Continue
    │   │
    │   ├─► Create TrackingEvent instance
    │   │
    │   ├─► Validate event data
    │   │
    │   ├─► Save to database
    │   │
    │   └─► Increment counter
    │
    ├─► Update waybill status (latest event)
    │
    ├─► Commit transaction
    │
    └─► Return events saved count
```

### Duplicate Detection Strategy

| Check | Fields | Action |
|-------|--------|--------|
| Exact Match | waybill + timestamp + status | Skip event |
| Near Duplicate | waybill + timestamp (1 sec) | Check status |
| Status Change | Same timestamp, diff status | Save both |

### TrackingEvent Creation

```
for event_data in events_data:
    TrackingEvent.objects.get_or_create(
        waybill=waybill,
        timestamp=event_data['timestamp'],
        status=event_data['status'],
        defaults={
            'location': event_data.get('location', ''),
        }
    )
```

### Waybill Status Update Logic

```
Update Waybill After Saving Events:
│
├─► Get latest TrackingEvent
│   (ordered by timestamp desc)
│
├─► Update waybill.status = latest_event.status
│
├─► Update waybill.last_tracked_at = now()
│
└─► waybill.save()
```

### Transaction Handling

| Scenario | Action | Result |
|----------|--------|--------|
| All events saved | Commit transaction | All persisted |
| Validation error | Log error, continue | Others saved |
| Database error | Rollback transaction | Nothing saved |
| Duplicate found | Skip, continue | Others processed |

### Event Processing Order

```
Sort Events by Timestamp (Ascending):
│
PENDING (Day 1, 09:00)
    │
    ▼
PICKED_UP (Day 1, 14:00)
    │
    ▼
IN_TRANSIT (Day 2, 08:00)
    │
    ▼
OUT_FOR_DELIVERY (Day 3, 07:00)
    │
    ▼
DELIVERED (Day 3, 16:30)
```

### Error Handling

| Error Type | Action | Impact |
|------------|--------|--------|
| Validation Error | Log and skip event | Event excluded |
| Duplicate | Skip silently | No action needed |
| Database Error | Rollback all | Transaction fails |
| Missing Waybill | Raise exception | Function fails |

### Return Value

| Value | Meaning |
|-------|---------|
| N > 0 | N new events saved |
| 0 | All events were duplicates |
| Exception | Save failed, transaction rolled back |

### Expected Outcome
- Function saves new tracking events to database
- Duplicates detected and skipped
- Waybill status updated to latest event
- Transaction ensures data consistency

### Verification Checklist
- [ ] save_tracking_events function created
- [ ] Database transaction wraps save logic
- [ ] Duplicate detection working
- [ ] Events saved with waybill FK
- [ ] Event validation before save
- [ ] Error handling for individual events
- [ ] Waybill status updated after save
- [ ] Function returns count of saved events
- [ ] Logging statements added
- [ ] Function tested with sample data

---

## Summary

This document established the shipment tracking infrastructure for the Koombiyo integration. The TrackingEvent model captures every status update with waybill association, status codes, timestamps, and location information. The track_shipment API method communicates with Koombiyo's endpoint to fetch real-time tracking data. The response parser transforms API responses into clean, validated data structures. Finally, the save events logic persists tracking information to the database with duplicate prevention and waybill status synchronization. This tracking foundation enables comprehensive shipment visibility throughout the delivery lifecycle.
