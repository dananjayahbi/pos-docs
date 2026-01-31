# Tasks 59-66: Webhook and Event Handlers

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** D - Tracking & Webhooks  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-58_Tracking-Model-API.md](01_Tasks-51-58_Tracking-Model-API.md)
- **→ Next Group:** [../Group-E_Pickup-COD/00_GROUP_OVERVIEW.md](../Group-E_Pickup-COD/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the implementation of Koombiyo webhook handling for real-time shipment status updates. It establishes a secure webhook endpoint with HMAC signature verification, implements event parsing logic, and creates dedicated handlers for each shipment status transition. Webhooks enable push-based notifications from Koombiyo, eliminating the need for polling and ensuring immediate status updates when packages are picked up, in transit, delivered, or encounter delivery failures.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Webhook View | High | 60 min |
| 60 | Create Webhook URL | Low | 15 min |
| 61 | Create Signature Verify | Medium | 45 min |
| 62 | Create Webhook Parser | Medium | 40 min |
| 63 | Create Picked Up Event | Medium | 35 min |
| 64 | Create In Transit Event | Low | 25 min |
| 65 | Create Delivered Event | Medium | 45 min |
| 66 | Create Failed Event | Medium | 40 min |

---

## Task 59: Create Webhook View

### Overview
Create the Django REST Framework API view to receive and process webhook notifications from Koombiyo. The webhook view handles incoming POST requests containing shipment status updates, authenticates requests using HMAC signature verification, parses event data, and routes events to appropriate handlers. This view serves as the entry point for all push notifications from Koombiyo's system.

### Dependencies
- Task 50: Waybill Generation (from Group C)
- TrackingEvent model available
- DRF installed and configured

### Instructions

1. **Create webhook module**
   - Navigate to `backend/apps/shipping/providers/koombiyo/` directory
   - Create new file named `webhooks.py`
   - Import DRF views and response classes
   - Import signature verification utilities

2. **Define KoombiyoWebhookView class**
   - Create class inheriting from APIView or GenericAPIView
   - Configure to accept POST requests only
   - Disable authentication (webhooks use signature verification)
   - Disable CSRF protection for webhook endpoint

3. **Configure view permissions**
   - Set permission_classes to AllowAny (signature verification handles auth)
   - Document why standard auth is disabled
   - Explain signature verification provides security

4. **Implement post method**
   - Define post(self, request) method
   - Accept DRF request object
   - Return DRF Response object
   - Handle all processing in this method

5. **Extract webhook payload**
   - Access request.body for raw payload (needed for signature)
   - Parse JSON from request.data
   - Validate payload is valid JSON
   - Handle JSON parsing errors

6. **Extract signature header**
   - Get X-Koombiyo-Signature header from request
   - Validate signature header exists
   - Return 401 if signature missing
   - Log authentication attempts

7. **Verify webhook signature**
   - Call signature verification function (Task 61)
   - Pass raw body and signature header
   - Return 401 if signature invalid
   - Log failed verification attempts

8. **Validate payload structure**
   - Check required fields exist (event_type, waybill_number, data)
   - Validate field types
   - Return 400 for invalid structure
   - Log malformed payloads

9. **Parse webhook event**
   - Call webhook parser function (Task 62)
   - Extract event type and event data
   - Validate parsed data
   - Handle parsing errors gracefully

10. **Route to event handler**
    - Determine handler based on event_type
    - Call appropriate handler function (Tasks 63-66)
    - Pass waybill and event data to handler
    - Handle handler exceptions

11. **Return webhook response**
    - Return 200 OK for successful processing
    - Return appropriate error codes for failures
    - Include minimal response body
    - Log webhook processing result

12. **Implement error handling**
    - Catch and handle all exceptions
    - Log errors with full context
    - Return appropriate HTTP status codes
    - Don't expose internal errors to caller

13. **Add request logging**
    - Log incoming webhook requests
    - Log request headers (except sensitive data)
    - Log payload summary (not full payload)
    - Log processing outcome

14. **Add idempotency handling**
    - Check if event already processed (optional)
    - Use unique event ID if provided
    - Prevent duplicate processing
    - Return success for duplicate events

### Webhook View Flow

```
KoombiyoWebhookView.post(request)
    │
    ├─► Extract raw body and JSON
    │
    ├─► Extract signature header
    │   ├─► If missing: Return 401
    │   └─► Continue
    │
    ├─► Verify HMAC signature (Task 61)
    │   ├─► If invalid: Return 401
    │   └─► Continue
    │
    ├─► Validate payload structure
    │   ├─► If invalid: Return 400
    │   └─► Continue
    │
    ├─► Parse webhook event (Task 62)
    │
    ├─► Route to handler based on event_type
    │   ├─► picked_up → Task 63
    │   ├─► in_transit → Task 64
    │   ├─► delivered → Task 65
    │   └─► failed → Task 66
    │
    ├─► Execute handler
    │
    └─► Return 200 OK
```

### Webhook Endpoint Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Class | KoombiyoWebhookView | APIView subclass |
| Method | POST only | Reject other methods |
| Authentication | None | Uses signature |
| Permission | AllowAny | Signature provides auth |
| CSRF | Exempt | External webhooks |

### Request Processing Order

```
1. Extract Raw Body (for signature verification)
2. Parse JSON Payload
3. Extract Signature Header
4. Verify HMAC Signature
5. Validate Payload Structure
6. Parse Event Data
7. Route to Handler
8. Execute Handler
9. Return Response
```

### HTTP Status Codes

| Status | Scenario | Response Body |
|--------|----------|---------------|
| 200 | Success | `{"status": "processed"}` |
| 400 | Invalid payload | `{"error": "Invalid payload"}` |
| 401 | Invalid signature | `{"error": "Unauthorized"}` |
| 404 | Waybill not found | `{"error": "Waybill not found"}` |
| 500 | Server error | `{"error": "Internal error"}` |

### Expected Payload Structure

```
{
  "event_type": "picked_up",
  "event_id": "evt_123456",
  "waybill_number": "WB123456789",
  "timestamp": "2025-01-31T10:30:00Z",
  "data": {
    "status": "picked_up",
    "location": "Colombo Hub",
    "timestamp": "2025-01-31T10:30:00Z",
    "courier_name": "John Doe"
  }
}
```

### Security Layers

```
Webhook Security:
│
├─► Layer 1: Signature Verification
│   └─► HMAC-SHA256 with secret key
│
├─► Layer 2: Payload Validation
│   └─► Required fields and types
│
├─► Layer 3: Waybill Verification
│   └─► Waybill exists in database
│
└─► Layer 4: Idempotency Check
    └─► Prevent duplicate processing
```

### Error Handling Strategy

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Missing Signature | 401 | Return error, log attempt |
| Invalid Signature | 401 | Return error, log attempt |
| Invalid JSON | 400 | Return error, log payload |
| Missing Fields | 400 | Return error, specify fields |
| Waybill Not Found | 404 | Return error, log waybill |
| Handler Exception | 500 | Return error, log exception |

### Logging Requirements

| Event | Log Level | Details |
|-------|-----------|---------|
| Webhook Received | INFO | Event type, waybill |
| Signature Verified | DEBUG | Success |
| Signature Failed | WARNING | Attempt details |
| Handler Success | INFO | Event processed |
| Handler Error | ERROR | Full exception |

### Expected Outcome
- Webhook view created and ready to receive requests
- Signature verification integrated
- Event routing to handlers working
- Comprehensive error handling and logging

### Verification Checklist
- [ ] KoombiyoWebhookView class created
- [ ] POST method implemented
- [ ] Permission classes configured (AllowAny)
- [ ] CSRF exempt decorator applied
- [ ] Signature verification integrated
- [ ] Payload validation implemented
- [ ] Event routing logic working
- [ ] Error handling comprehensive
- [ ] Logging statements added
- [ ] Returns appropriate HTTP status codes

---

## Task 60: Create Webhook URL

### Overview
Configure the Django URL routing to expose the webhook endpoint at a public URL that Koombiyo can call. The URL must be accessible from external networks, follow REST conventions, and be registered with Koombiyo's webhook configuration. This task establishes the public entry point for webhook notifications.

### Dependencies
- Task 59: Webhook view created

### Instructions

1. **Navigate to URL configuration**
   - Open `backend/apps/shipping/urls.py` or create if doesn't exist
   - Import KoombiyoWebhookView
   - Import Django URL utilities

2. **Define webhook URL pattern**
   - Create URL pattern for webhook endpoint
   - Use path: `webhooks/koombiyo/`
   - Map to KoombiyoWebhookView.as_view()
   - Name the URL pattern: 'koombiyo-webhook'

3. **Configure URL prefix**
   - Ensure shipping app URLs included in main urls.py
   - Prefix: `/api/webhooks/` or `/api/shipping/webhooks/`
   - Final URL: `/api/webhooks/koombiyo/`
   - Document full URL path

4. **Set URL name for reversing**
   - Name parameter enables URL reversing
   - Use in webhook registration
   - Use in tests
   - Document URL name

5. **Configure CSRF exemption**
   - Apply csrf_exempt decorator if not on view
   - Webhooks from external sources need CSRF exemption
   - Document why CSRF is exempt

6. **Add URL to API documentation**
   - Document endpoint in API docs
   - Include example webhook payload
   - Document signature verification requirements
   - Add to Swagger/OpenAPI if used

7. **Configure production URL**
   - Ensure URL accessible from internet
   - Configure reverse proxy (Nginx) routing
   - Verify HTTPS enabled for webhook URL
   - Test external accessibility

8. **Register URL with Koombiyo**
   - Provide full webhook URL to Koombiyo
   - Format: `https://yourdomain.com/api/webhooks/koombiyo/`
   - Ensure URL is reachable from Koombiyo's servers
   - Configure webhook secret with Koombiyo

### URL Configuration

| Property | Value |
|----------|-------|
| Path | `webhooks/koombiyo/` |
| Full URL | `/api/webhooks/koombiyo/` |
| View | KoombiyoWebhookView.as_view() |
| Name | 'koombiyo-webhook' |
| Methods | POST only |

### URL Structure

```
Main URLs (backend/config/urls.py):
├─► /api/
    └─► shipping/
        └─► urls.py

Shipping URLs (apps/shipping/urls.py):
├─► webhooks/
    └─► koombiyo/ ──► KoombiyoWebhookView
```

### Complete URL Path

```
Development:
http://localhost:8000/api/webhooks/koombiyo/

Production:
https://yourdomain.com/api/webhooks/koombiyo/

Koombiyo Test Environment:
https://staging.yourdomain.com/api/webhooks/koombiyo/
```

### URL Registration Process

```
Step 1: Configure Django URL
    │
    ▼
Step 2: Deploy to Server
    │
    ▼
Step 3: Verify External Accessibility
    │
    ▼
Step 4: Register with Koombiyo
    │ (Provide full URL)
    ▼
Step 5: Configure Webhook Secret
    │
    ▼
Step 6: Test with Sample Webhook
```

### Nginx Configuration Example

```
Reverse Proxy Setup:
│
location /api/webhooks/koombiyo/ {
    proxy_pass http://django_app;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### URL Security Considerations

| Aspect | Implementation |
|--------|----------------|
| HTTPS | Required in production |
| Firewall | Allow Koombiyo IP ranges (optional) |
| Rate Limiting | Prevent abuse |
| CSRF | Exempt (signature auth) |

### URL Testing Checklist

| Test | Method | Expected Result |
|------|--------|-----------------|
| GET Request | GET /api/webhooks/koombiyo/ | 405 Method Not Allowed |
| POST No Signature | POST without header | 401 Unauthorized |
| POST Invalid Signature | POST with wrong signature | 401 Unauthorized |
| POST Valid | POST with valid signature | 200 OK |

### Webhook URL Documentation

```
Endpoint: POST /api/webhooks/koombiyo/
Purpose: Receive shipment status update webhooks from Koombiyo
Authentication: HMAC-SHA256 signature in X-Koombiyo-Signature header
Content-Type: application/json
Rate Limit: 100 requests per minute

Required Headers:
- X-Koombiyo-Signature: HMAC signature
- Content-Type: application/json

Response Codes:
- 200: Webhook processed successfully
- 400: Invalid payload
- 401: Invalid signature
- 500: Server error
```

### Expected Outcome
- Webhook URL configured and accessible
- URL follows REST conventions
- External accessibility verified
- URL registered with Koombiyo

### Verification Checklist
- [ ] URL pattern added to shipping/urls.py
- [ ] URL path is `webhooks/koombiyo/`
- [ ] View mapped correctly
- [ ] URL name set to 'koombiyo-webhook'
- [ ] CSRF exempt configured
- [ ] Shipping URLs included in main urls.py
- [ ] Full URL path documented
- [ ] External accessibility tested
- [ ] HTTPS configured in production
- [ ] URL registered with Koombiyo

---

## Task 61: Create Signature Verify

### Overview
Implement HMAC-SHA256 signature verification to authenticate webhook requests from Koombiyo. Signature verification ensures that webhook calls genuinely originate from Koombiyo and haven't been tampered with during transmission. This security mechanism uses a shared secret key to compute a signature of the request payload and compares it with the signature provided in the request header.

### Dependencies
- Task 59: Webhook view created
- Webhook secret configured in settings

### Instructions

1. **Create signature verification module**
   - Create file: `backend/apps/shipping/providers/koombiyo/signature.py`
   - Import hmac library
   - Import hashlib for SHA256
   - Import Django settings

2. **Define verify_webhook_signature function**
   - Function signature: `verify_webhook_signature(payload: bytes, signature: str) -> bool`
   - Accept raw request body as bytes
   - Accept signature string from header
   - Return True if valid, False otherwise

3. **Get webhook secret from settings**
   - Retrieve KOOMBIYO_WEBHOOK_SECRET from Django settings
   - Ensure secret is configured
   - Raise configuration error if missing
   - Convert secret to bytes if string

4. **Compute expected signature**
   - Use HMAC-SHA256 algorithm
   - Key: webhook secret (bytes)
   - Message: raw request payload (bytes)
   - Generate HMAC digest

5. **Format computed signature**
   - Convert HMAC digest to hexadecimal string
   - Use lowercase hex format
   - Prefix with algorithm if Koombiyo expects it (e.g., "sha256=")
   - Match Koombiyo's signature format exactly

6. **Compare signatures**
   - Use constant-time comparison (hmac.compare_digest)
   - Never use simple string equality (prevents timing attacks)
   - Return True if signatures match
   - Return False if signatures differ

7. **Handle signature format variations**
   - Check if signature includes algorithm prefix
   - Strip prefix if present before comparison
   - Handle uppercase/lowercase variations
   - Normalize both signatures before comparison

8. **Add error handling**
   - Catch HMAC computation errors
   - Catch encoding errors
   - Return False on any error
   - Log verification failures

9. **Implement timing-safe comparison**
   - Use hmac.compare_digest() for comparison
   - Prevents timing attack vulnerabilities
   - Ensures constant-time comparison
   - Critical for security

10. **Add logging**
    - Log verification attempts (without signatures)
    - Log verification failures
    - Log configuration issues
    - Use appropriate log levels

### HMAC Signature Flow

```
verify_webhook_signature(payload, signature)
    │
    ├─► Get webhook secret from settings
    │
    ├─► Compute HMAC-SHA256
    │   │ Key: webhook secret
    │   │ Message: raw payload
    │   └─► Digest (hex)
    │
    ├─► Format expected signature
    │   └─► Match Koombiyo's format
    │
    ├─► Compare with provided signature
    │   └─► Use hmac.compare_digest()
    │
    └─► Return True/False
```

### HMAC Computation

```
HMAC-SHA256 Signature:
│
Input:
├─► Secret Key: "your-webhook-secret"
└─► Message: Raw request body (bytes)

Algorithm:
├─► HMAC(key=secret, msg=body, digestmod=SHA256)
└─► Output: hexdigest string

Format:
├─► Lowercase hex: "a1b2c3d4e5f6..."
└─► With prefix: "sha256=a1b2c3d4e5f6..."
```

### Signature Comparison

```
Timing-Safe Comparison:
│
Expected: "sha256=abc123..."
Provided: "sha256=abc123..."
    │
    ├─► Normalize both signatures
    │   ├─► Remove prefix
    │   └─► Lowercase
    │
    ├─► hmac.compare_digest(expected, provided)
    │   └─► Constant-time comparison
    │
    └─► Return True/False
```

### Settings Configuration

```
# settings.py or settings/production.py

KOOMBIYO_WEBHOOK_SECRET = env('KOOMBIYO_WEBHOOK_SECRET')

# .env file
KOOMBIYO_WEBHOOK_SECRET=your-secret-key-from-koombiyo
```

### Signature Format Examples

| Format | Example |
|--------|---------|
| Hex Only | `a1b2c3d4e5f6789...` |
| With Prefix | `sha256=a1b2c3d4e5f6789...` |
| Base64 | `YTFiMmMzZDRlNWY2...` (if used) |

### Security Considerations

| Aspect | Implementation | Importance |
|--------|----------------|------------|
| Timing Attack | Use compare_digest() | Critical |
| Secret Storage | Environment variable | Critical |
| Secret Rotation | Support key rotation | High |
| Error Messages | Don't expose details | High |
| Logging | No secrets in logs | Critical |

### Verification Process

```
Koombiyo Webhook Request:
│
Headers:
├─► X-Koombiyo-Signature: sha256=abc123...
└─► Content-Type: application/json

Body:
└─► {"event_type": "picked_up", ...}

Our Verification:
├─► Read raw body (bytes)
├─► Compute HMAC with our secret
├─► Compare with header signature
└─► Accept or Reject
```

### Error Handling

| Error | Action | Return |
|-------|--------|--------|
| Missing Secret | Log error, raise exception | N/A |
| Invalid Payload | Log warning | False |
| HMAC Error | Log error | False |
| Signature Mismatch | Log warning | False |
| Encoding Error | Log error | False |

### Testing Signature Verification

```
Test Cases:
├─► Valid signature → True
├─► Invalid signature → False
├─► Missing signature → False
├─► Tampered payload → False
├─► Wrong secret → False
└─► Replay attack (same signature) → Depends on idempotency
```

### Expected Outcome
- Signature verification function working correctly
- HMAC-SHA256 computation accurate
- Timing-safe comparison prevents attacks
- Webhook security enforced

### Verification Checklist
- [ ] Signature verification function created
- [ ] HMAC-SHA256 algorithm used
- [ ] Webhook secret retrieved from settings
- [ ] Raw request body used for verification
- [ ] hmac.compare_digest() used for comparison
- [ ] Signature format matches Koombiyo's format
- [ ] Error handling implemented
- [ ] Logging added (without exposing secrets)
- [ ] Function tested with valid/invalid signatures
- [ ] Timing attack prevention verified

---

## Task 62: Create Webhook Parser

### Overview
Implement the webhook parser to extract and validate event data from incoming webhook payloads. The parser determines the event type, extracts relevant data fields, validates the payload structure, and routes events to the appropriate handler function. This component acts as the central dispatch mechanism for all webhook events.

### Dependencies
- Task 59: Webhook view created

### Instructions

1. **Create parser function**
   - Add to `backend/apps/shipping/providers/koombiyo/webhooks.py`
   - Function: `parse_webhook_event(payload: dict) -> tuple`
   - Accept parsed JSON payload
   - Return (event_type, event_data) tuple

2. **Validate payload structure**
   - Check required fields exist: event_type, waybill_number, data
   - Validate field types are correct
   - Raise ValidationError if structure invalid
   - Log validation failures

3. **Extract event type**
   - Get event_type field from payload
   - Normalize event type (lowercase, strip)
   - Validate against known event types
   - Raise error for unknown event types

4. **Extract waybill number**
   - Get waybill_number from payload
   - Validate format (not empty, correct pattern)
   - Look up waybill in database
   - Raise error if waybill not found

5. **Extract event data**
   - Get data object from payload
   - Validate data is a dictionary
   - Extract status, timestamp, location from data
   - Handle missing optional fields

6. **Parse event timestamp**
   - Extract timestamp from event data
   - Parse ISO 8601 datetime string
   - Convert to timezone-aware datetime (UTC)
   - Handle various datetime formats

7. **Parse event location**
   - Extract location from event data (optional)
   - Normalize location string
   - Default to empty string if not provided
   - Truncate if exceeds max length

8. **Map event type to handler**
   - Create dictionary mapping event types to handler functions
   - Return handler function along with event data
   - Support for unknown event types (log and ignore)

9. **Validate event data completeness**
   - Ensure all required fields present for event type
   - Validate field values within expected ranges
   - Check for any inconsistencies
   - Return validated event data

10. **Build event data dictionary**
    - Create standardized event data structure
    - Include waybill instance
    - Include status, timestamp, location
    - Include any additional metadata

11. **Handle parsing errors**
    - Catch JSON parsing errors
    - Catch datetime parsing errors
    - Catch validation errors
    - Return informative error messages

### Webhook Parser Flow

```
parse_webhook_event(payload)
    │
    ├─► Validate payload structure
    │   ├─► Check required fields
    │   └─► Validate types
    │
    ├─► Extract event_type
    │   └─► Normalize and validate
    │
    ├─► Extract waybill_number
    │   └─► Lookup waybill in database
    │
    ├─► Extract and parse event data
    │   ├─► status
    │   ├─► timestamp
    │   └─► location
    │
    ├─► Map event type to handler
    │
    └─► Return (event_type, event_data, handler)
```

### Event Type Mapping

| Event Type | Handler Function | Status |
|------------|------------------|--------|
| picked_up | handle_picked_up_event (Task 63) | PICKED_UP |
| in_transit | handle_in_transit_event (Task 64) | IN_TRANSIT |
| delivered | handle_delivered_event (Task 65) | DELIVERED |
| delivery_failed | handle_failed_event (Task 66) | FAILED |
| cancelled | handle_cancelled_event | CANCELLED |

### Expected Payload Structure

```
{
  "event_type": "picked_up",
  "event_id": "evt_123456",
  "waybill_number": "WB123456789",
  "timestamp": "2025-01-31T10:30:00Z",
  "data": {
    "status": "picked_up",
    "location": "Colombo Hub",
    "timestamp": "2025-01-31T10:30:00Z",
    "courier_name": "John Doe",
    "notes": "Package collected successfully"
  }
}
```

### Parsed Event Data Structure

```
{
  'waybill': <Waybill instance>,
  'status': 'PICKED_UP',
  'timestamp': datetime(2025, 1, 31, 10, 30, 0, tzinfo=UTC),
  'location': 'Colombo Hub',
  'metadata': {
    'event_id': 'evt_123456',
    'courier_name': 'John Doe',
    'notes': 'Package collected successfully'
  }
}
```

### Validation Rules

| Field | Validation | Action on Failure |
|-------|------------|-------------------|
| event_type | Required, in known types | Raise ValidationError |
| waybill_number | Required, exists in DB | Raise WaybillNotFound |
| data | Required, is dict | Raise ValidationError |
| timestamp | Valid datetime | Raise ValidationError |
| status | Valid status code | Raise ValidationError |

### Event Type Routing

```
Event Router:
│
├─► "picked_up" → handle_picked_up_event()
│
├─► "in_transit" → handle_in_transit_event()
│
├─► "out_for_delivery" → handle_in_transit_event()
│   (treat as in_transit)
│
├─► "delivered" → handle_delivered_event()
│
├─► "delivery_failed" → handle_failed_event()
│
└─► Unknown → Log and return 200 (ignore)
```

### Error Handling

| Error Type | HTTP Code | Response |
|------------|-----------|----------|
| Missing Field | 400 | "Missing required field: {field}" |
| Invalid Type | 400 | "Invalid field type: {field}" |
| Unknown Event | 200 | "Event type not supported" (log) |
| Waybill Not Found | 404 | "Waybill not found" |
| Invalid Timestamp | 400 | "Invalid timestamp format" |

### Handler Function Signature

```
Handler Functions:
│
def handle_event(waybill, event_data):
    │ waybill: Waybill instance
    │ event_data: dict with status, timestamp, location
    │
    ├─► Create TrackingEvent
    ├─► Update Waybill status
    ├─► Update Order status (if applicable)
    └─► Return None
```

### Expected Outcome
- Parser extracts and validates event data
- Event type determines handler routing
- Waybill lookup successful
- Event data properly structured for handlers

### Verification Checklist
- [ ] parse_webhook_event function created
- [ ] Payload structure validation
- [ ] Event type extraction and normalization
- [ ] Waybill number extraction and lookup
- [ ] Event data parsing (status, timestamp, location)
- [ ] Event type to handler mapping
- [ ] Error handling for invalid payloads
- [ ] Validation error messages informative
- [ ] Parser tested with sample payloads
- [ ] Unknown event types handled gracefully

---

## Task 63: Create Picked Up Event

### Overview
Implement the picked up event handler to process shipment pickup notifications from Koombiyo. When a courier collects a package from the sender, this handler creates a tracking event, updates the waybill status to PICKED_UP, and optionally updates the associated order status. This event marks the beginning of the shipment's journey through the delivery network.

### Dependencies
- Task 51-55: TrackingEvent model complete
- Task 62: Webhook parser ready

### Instructions

1. **Create event handler function**
   - Add to `backend/apps/shipping/providers/koombiyo/webhooks.py`
   - Function: `handle_picked_up_event(waybill, event_data: dict)`
   - Accept waybill instance and parsed event data
   - No return value needed

2. **Create tracking event record**
   - Create TrackingEvent instance
   - Set waybill foreign key
   - Set status to PICKED_UP
   - Set timestamp from event_data
   - Set location from event_data

3. **Validate event data**
   - Ensure required fields present
   - Validate timestamp is not in future
   - Validate status matches event type
   - Handle missing optional fields

4. **Check for duplicate events**
   - Query for existing event with same timestamp + status
   - Skip creation if duplicate found
   - Log duplicate detection
   - Return success for duplicates (idempotency)

5. **Save tracking event**
   - Call TrackingEvent.save()
   - Handle database errors
   - Log successful event creation
   - Catch and log save failures

6. **Update waybill status**
   - Set waybill.status = PICKED_UP
   - Set waybill.last_tracked_at = now()
   - Set waybill.picked_up_at timestamp (if field exists)
   - Save waybill instance

7. **Update related order status**
   - Get order from waybill.order
   - Check if order status update needed
   - Update order.status to IN_FULFILLMENT or similar
   - Save order instance

8. **Send pickup notification**
   - Trigger notification to customer (optional)
   - Email or SMS: "Your package has been picked up"
   - Include tracking URL
   - Queue notification via Celery

9. **Log event processing**
   - Log picked up event received
   - Log tracking event created
   - Log waybill status updated
   - Use INFO log level

10. **Handle errors gracefully**
    - Catch database errors
    - Catch notification errors
    - Log errors without failing
    - Ensure webhook returns success

### Picked Up Event Flow

```
handle_picked_up_event(waybill, event_data)
    │
    ├─► Validate event data
    │
    ├─► Check for duplicate event
    │   ├─► If exists: Log and return
    │   └─► If new: Continue
    │
    ├─► Create TrackingEvent
    │   ├─► waybill = waybill
    │   ├─► status = PICKED_UP
    │   ├─► timestamp = event_data['timestamp']
    │   └─► location = event_data['location']
    │
    ├─► Save TrackingEvent
    │
    ├─► Update Waybill
    │   ├─► status = PICKED_UP
    │   ├─► last_tracked_at = now()
    │   └─► picked_up_at = timestamp
    │
    ├─► Update Order (optional)
    │   └─► status = IN_FULFILLMENT
    │
    └─► Send pickup notification (async)
```

### Event Data Structure

```
event_data = {
  'status': 'PICKED_UP',
  'timestamp': datetime(2025, 1, 31, 10, 30, 0, tzinfo=UTC),
  'location': 'Colombo Hub',
  'metadata': {
    'courier_name': 'John Doe',
    'notes': 'Package collected successfully'
  }
}
```

### Status Update Sequence

```
Before Pickup:
├─► Waybill.status = PENDING
└─► Order.status = CONFIRMED

After Pickup:
├─► Waybill.status = PICKED_UP
├─► Order.status = IN_FULFILLMENT
└─► TrackingEvent created with PICKED_UP status
```

### Waybill Field Updates

| Field | Value | Purpose |
|-------|-------|---------|
| status | PICKED_UP | Current status |
| last_tracked_at | now() | Last update time |
| picked_up_at | event timestamp | Pickup time |

### Order Status Transition

```
Order Status Flow:
│
CONFIRMED
    │ (payment received)
    ▼
PROCESSING
    │ (waybill generated)
    ▼
IN_FULFILLMENT
    │ (package picked up)
    ▼
... (continues with delivery)
```

### Notification Example

```
Customer Notification:
│
Subject: Your Package Has Been Picked Up
│
Message:
├─► "Your order #ORD123 has been picked up by our courier."
├─► "Waybill: WB123456789"
├─► "Expected delivery: 2-3 business days"
└─► "Track your shipment: [tracking URL]"
```

### Duplicate Detection

| Check | Fields | Action |
|-------|--------|--------|
| Exact Match | waybill + timestamp + status | Skip, return success |
| Different Status | waybill + timestamp, diff status | Create new event |
| Same Event ID | event_id field | Skip if already processed |

### Error Handling

| Error | Action | Impact |
|-------|--------|--------|
| Duplicate Event | Skip, log, return success | Idempotent |
| Database Error | Log, raise exception | Webhook retried |
| Notification Error | Log, continue | Event still saved |
| Invalid Data | Log, raise exception | Webhook returns 400 |

### Logging Example

```
INFO: Picked up event received for waybill WB123456789
DEBUG: Event data validated successfully
INFO: TrackingEvent created with status PICKED_UP
INFO: Waybill status updated to PICKED_UP
INFO: Order status updated to IN_FULFILLMENT
INFO: Pickup notification queued for customer
```

### Expected Outcome
- Picked up event handler processes pickups correctly
- Tracking event created with PICKED_UP status
- Waybill and order statuses updated
- Customer notified of pickup

### Verification Checklist
- [ ] handle_picked_up_event function created
- [ ] Event data validation implemented
- [ ] Duplicate detection working
- [ ] TrackingEvent created with correct fields
- [ ] Waybill status updated to PICKED_UP
- [ ] last_tracked_at timestamp updated
- [ ] Order status updated if applicable
- [ ] Notification sent to customer
- [ ] Error handling implemented
- [ ] Logging statements added
- [ ] Handler tested with sample event

---

## Task 64: Create In Transit Event

### Overview
Implement the in transit event handler to process shipment transit notifications from Koombiyo. This handler processes events when a package moves between hubs, branches, or distribution centers. It creates tracking events for each transit checkpoint, updates the waybill status, and provides visibility into the package's journey through the delivery network.

### Dependencies
- Task 51-55: TrackingEvent model complete
- Task 62: Webhook parser ready

### Instructions

1. **Create event handler function**
   - Add to `backend/apps/shipping/providers/koombiyo/webhooks.py`
   - Function: `handle_in_transit_event(waybill, event_data: dict)`
   - Accept waybill instance and parsed event data
   - No return value needed

2. **Create tracking event record**
   - Create TrackingEvent instance
   - Set waybill foreign key
   - Set status to IN_TRANSIT
   - Set timestamp from event_data
   - Set location from event_data (important for transit)

3. **Validate event data**
   - Ensure timestamp provided
   - Validate location field (critical for transit tracking)
   - Check timestamp chronological order
   - Handle missing optional fields

4. **Check for duplicate events**
   - Query for existing event with same timestamp + status + location
   - Allow multiple IN_TRANSIT events (different locations)
   - Skip only exact duplicates
   - Log duplicate detection

5. **Save tracking event**
   - Call TrackingEvent.save()
   - Handle database errors
   - Log successful event creation
   - Catch and log save failures

6. **Update waybill status**
   - Set waybill.status = IN_TRANSIT
   - Set waybill.last_tracked_at = now()
   - Don't override if already at later status (e.g., DELIVERED)
   - Save waybill instance

7. **Handle status progression**
   - Check current waybill status
   - Only update if progressing forward
   - Don't downgrade from DELIVERED to IN_TRANSIT
   - Use status order: PENDING → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED

8. **Log transit event**
   - Log in transit event received
   - Log location information
   - Log tracking event created
   - Use INFO or DEBUG log level

9. **Handle errors gracefully**
   - Catch database errors
   - Log errors without failing webhook
   - Return success even if non-critical error
   - Ensure idempotency

### In Transit Event Flow

```
handle_in_transit_event(waybill, event_data)
    │
    ├─► Validate event data
    │
    ├─► Check for duplicate event
    │   ├─► If exact duplicate: Return
    │   └─► If new location: Continue
    │
    ├─► Create TrackingEvent
    │   ├─► waybill = waybill
    │   ├─► status = IN_TRANSIT
    │   ├─► timestamp = event_data['timestamp']
    │   └─► location = event_data['location']
    │
    ├─► Save TrackingEvent
    │
    ├─► Check status progression
    │   ├─► If forward: Update waybill
    │   └─► If backward: Skip update
    │
    └─► Update Waybill (if appropriate)
        ├─► status = IN_TRANSIT
        └─► last_tracked_at = now()
```

### Transit Event Timeline

```
Transit Journey:
│
Day 1, 10:00 - PICKED_UP (Colombo Hub)
    │
    ▼
Day 1, 16:00 - IN_TRANSIT (Colombo Sorting Center)
    │
    ▼
Day 2, 08:00 - IN_TRANSIT (Kandy Regional Hub)
    │
    ▼
Day 2, 14:00 - IN_TRANSIT (Kandy Branch)
    │
    ▼
Day 3, 07:00 - OUT_FOR_DELIVERY (Kandy Branch)
```

### Status Progression Rules

| Current Status | Event Status | Action |
|----------------|--------------|--------|
| PENDING | IN_TRANSIT | Update to IN_TRANSIT |
| PICKED_UP | IN_TRANSIT | Update to IN_TRANSIT |
| IN_TRANSIT | IN_TRANSIT | Keep IN_TRANSIT, add event |
| OUT_FOR_DELIVERY | IN_TRANSIT | Don't update (later stage) |
| DELIVERED | IN_TRANSIT | Don't update (terminal) |

### Multiple Transit Events

```
Multiple IN_TRANSIT Events:
│
All events created and saved:
├─► Event 1: Colombo Hub (Day 1)
├─► Event 2: Kandy Hub (Day 2)
└─► Event 3: Galle Branch (Day 3)

Waybill Status:
└─► Remains IN_TRANSIT throughout
```

### Location Tracking

| Event | Location | Distance | Time |
|-------|----------|----------|------|
| 1 | Colombo Central Hub | 0 km | Day 1, 10:00 |
| 2 | Colombo Sorting Center | 5 km | Day 1, 16:00 |
| 3 | Kandy Regional Hub | 115 km | Day 2, 08:00 |
| 4 | Kandy Branch Office | 3 km | Day 2, 14:00 |

### Duplicate Detection Strategy

| Check | Result | Action |
|-------|--------|--------|
| Same timestamp + location | Duplicate | Skip |
| Same timestamp, diff location | Valid | Create event |
| Different timestamp | Valid | Create event |

### Status Progression Logic

```
Determine If Update Allowed:
│
Current Status: PICKED_UP
Event Status: IN_TRANSIT
    │
    ├─► Check status order
    │   └─► IN_TRANSIT > PICKED_UP
    │
    ├─► Update allowed: Yes
    │
    └─► Update waybill status

Current Status: DELIVERED
Event Status: IN_TRANSIT
    │
    ├─► Check status order
    │   └─► IN_TRANSIT < DELIVERED
    │
    ├─► Update allowed: No
    │
    └─► Skip waybill update (log warning)
```

### Error Handling

| Error | Action | Impact |
|-------|--------|--------|
| Duplicate Event | Skip, log, return success | Idempotent |
| Invalid Location | Use empty string | Event created |
| Database Error | Log, raise exception | Webhook retried |
| Status Regression | Skip update, log warning | Event saved |

### Logging Example

```
INFO: In transit event received for waybill WB123456789
DEBUG: Location: Kandy Regional Hub
DEBUG: Timestamp: 2025-01-31T08:00:00Z
INFO: TrackingEvent created with status IN_TRANSIT
DEBUG: Waybill status: IN_TRANSIT (no change)
INFO: Transit event processed successfully
```

### Expected Outcome
- In transit event handler processes transit updates
- Multiple transit events with different locations tracked
- Waybill status updated appropriately
- Status progression rules enforced

### Verification Checklist
- [ ] handle_in_transit_event function created
- [ ] Event data validation implemented
- [ ] Duplicate detection for exact matches
- [ ] Multiple IN_TRANSIT events allowed
- [ ] TrackingEvent created with correct fields
- [ ] Location field populated
- [ ] Waybill status progression logic
- [ ] Status not downgraded from later stages
- [ ] Error handling implemented
- [ ] Logging statements added
- [ ] Handler tested with multiple transit events

---

## Task 65: Create Delivered Event

### Overview
Implement the delivered event handler to process successful delivery notifications from Koombiyo. This is a critical event that marks the completion of the shipment journey. The handler creates a tracking event, updates the waybill and order statuses to delivered/completed, processes COD payment confirmation if applicable, and triggers customer delivery notifications. This event concludes the shipping lifecycle.

### Dependencies
- Task 51-55: TrackingEvent model complete
- Task 62: Webhook parser ready
- Order model with status field

### Instructions

1. **Create event handler function**
   - Add to `backend/apps/shipping/providers/koombiyo/webhooks.py`
   - Function: `handle_delivered_event(waybill, event_data: dict)`
   - Accept waybill instance and parsed event data
   - No return value needed

2. **Create tracking event record**
   - Create TrackingEvent instance
   - Set waybill foreign key
   - Set status to DELIVERED
   - Set timestamp from event_data
   - Set location from event_data (delivery address)

3. **Validate event data**
   - Ensure timestamp provided
   - Validate delivery location
   - Check for proof of delivery data (optional)
   - Handle missing optional fields

4. **Check for duplicate delivery**
   - Query for existing DELIVERED event
   - Skip if already delivered
   - Log duplicate detection
   - Return success for idempotency

5. **Save tracking event**
   - Call TrackingEvent.save()
   - Handle database errors
   - Log successful event creation
   - Catch and log save failures

6. **Update waybill status**
   - Set waybill.status = DELIVERED
   - Set waybill.last_tracked_at = now()
   - Set waybill.delivered_at = event timestamp
   - Save waybill instance

7. **Update order status**
   - Get order from waybill.order
   - Set order.status = COMPLETED or DELIVERED
   - Set order.completed_at = event timestamp
   - Save order instance

8. **Process COD payment**
   - Check if waybill.is_cod = True
   - If COD, mark COD as collected
   - Update waybill.cod_collected = True
   - Update waybill.cod_collected_at = timestamp
   - Record COD amount received

9. **Trigger delivery notifications**
   - Send email to customer: "Your package has been delivered"
   - Send SMS notification (optional)
   - Include delivery timestamp and location
   - Queue notifications via Celery

10. **Update inventory (if applicable)**
    - For sales orders, confirm inventory deduction
    - Mark order items as fulfilled
    - Update product stock levels if not done earlier
    - Handle inventory synchronization

11. **Process customer feedback request**
    - Queue feedback email (delayed send)
    - Ask customer to rate delivery experience
    - Include order/delivery details
    - Schedule for 24 hours after delivery

12. **Log delivery event**
    - Log delivered event received
    - Log all status updates
    - Log COD processing if applicable
    - Use INFO log level for important events

13. **Handle errors gracefully**
    - Catch database errors
    - Catch notification errors
    - Log errors but don't fail webhook
    - Ensure idempotency

### Delivered Event Flow

```
handle_delivered_event(waybill, event_data)
    │
    ├─► Validate event data
    │
    ├─► Check for duplicate delivery
    │   ├─► If already delivered: Return
    │   └─► If new: Continue
    │
    ├─► Create TrackingEvent
    │   ├─► waybill = waybill
    │   ├─► status = DELIVERED
    │   ├─► timestamp = event_data['timestamp']
    │   └─► location = event_data['location']
    │
    ├─► Save TrackingEvent
    │
    ├─► Update Waybill
    │   ├─► status = DELIVERED
    │   ├─► delivered_at = timestamp
    │   └─► last_tracked_at = now()
    │
    ├─► Update Order
    │   ├─► status = COMPLETED
    │   └─► completed_at = timestamp
    │
    ├─► Process COD (if applicable)
    │   ├─► cod_collected = True
    │   └─► cod_collected_at = timestamp
    │
    ├─► Send delivery notifications
    │   ├─► Customer email
    │   └─► Customer SMS
    │
    └─► Queue feedback request (delayed)
```

### Status Update Sequence

```
Before Delivery:
├─► Waybill.status = OUT_FOR_DELIVERY
├─► Order.status = IN_FULFILLMENT
└─► COD status = Pending

After Delivery:
├─► Waybill.status = DELIVERED
├─► Waybill.delivered_at = timestamp
├─► Order.status = COMPLETED
├─► Order.completed_at = timestamp
└─► COD status = Collected (if COD)
```

### Waybill Field Updates

| Field | Value | Purpose |
|-------|-------|---------|
| status | DELIVERED | Terminal status |
| delivered_at | event timestamp | Delivery time |
| last_tracked_at | now() | Last update |
| cod_collected | True (if COD) | COD collected |
| cod_collected_at | timestamp (if COD) | COD collection time |

### Order Field Updates

| Field | Value | Purpose |
|-------|-------|---------|
| status | COMPLETED | Order fulfilled |
| completed_at | event timestamp | Completion time |
| fulfillment_status | FULFILLED | Shipping complete |

### COD Processing

```
If waybill.is_cod:
    │
    ├─► waybill.cod_collected = True
    ├─► waybill.cod_collected_at = timestamp
    ├─► waybill.cod_amount_received = waybill.cod_amount
    │
    ├─► Create Payment record
    │   ├─► method = COD
    │   ├─► amount = cod_amount
    │   ├─► status = RECEIVED
    │   └─► received_at = timestamp
    │
    └─► Update Order payment status
        └─► payment_status = PAID
```

### Delivery Notification Example

```
Email:
│
Subject: Your Package Has Been Delivered!
│
Message:
├─► "Good news! Your order #ORD123 has been delivered."
├─► "Delivered at: 2025-01-31, 4:30 PM"
├─► "Delivery location: {location}"
├─► "Waybill: WB123456789"
├─► [If COD] "COD amount: ₨{amount} collected"
└─► "Thank you for shopping with us!"
```

### Feedback Request (Delayed)

```
Scheduled Email (24 hours after delivery):
│
Subject: How was your delivery experience?
│
Message:
├─► "We'd love to hear about your experience!"
├─► "Rate your delivery: [1-5 stars]"
├─► "Rate courier service: [1-5 stars]"
└─► "Feedback link: [URL]"
```

### Duplicate Delivery Handling

| Check | Action | Result |
|-------|--------|--------|
| Waybill already DELIVERED | Skip all updates | Return success |
| Different delivery timestamp | Log warning, keep first | Idempotent |
| Same event_id | Skip processing | Idempotent |

### Error Handling

| Error | Action | Impact |
|-------|--------|--------|
| Duplicate Delivery | Skip, return success | Idempotent |
| Database Error | Log, raise exception | Webhook retried |
| Notification Error | Log, continue | Event still saved |
| COD Processing Error | Log, continue | Manual intervention |

### Logging Example

```
INFO: Delivered event received for waybill WB123456789
DEBUG: Delivery location: Colombo 07 - Customer Address
DEBUG: Delivery timestamp: 2025-01-31T16:30:00Z
INFO: TrackingEvent created with status DELIVERED
INFO: Waybill status updated to DELIVERED
INFO: Order ORD123 status updated to COMPLETED
INFO: COD marked as collected: ₨2500
INFO: Delivery notification sent to customer
INFO: Feedback request scheduled for 2025-02-01T16:30:00Z
INFO: Delivery event processed successfully
```

### Expected Outcome
- Delivered event handler processes deliveries correctly
- Waybill and order marked as completed
- COD payment processed if applicable
- Customer notified of delivery
- Feedback request queued

### Verification Checklist
- [ ] handle_delivered_event function created
- [ ] Event data validation implemented
- [ ] Duplicate delivery detection working
- [ ] TrackingEvent created with DELIVERED status
- [ ] Waybill status updated to DELIVERED
- [ ] Waybill delivered_at timestamp set
- [ ] Order status updated to COMPLETED
- [ ] COD processing logic implemented
- [ ] Delivery notification sent
- [ ] Feedback request queued
- [ ] Inventory updated if applicable
- [ ] Error handling implemented
- [ ] Logging statements added
- [ ] Handler tested with sample event

---

## Task 66: Create Failed Event

### Overview
Implement the failed event handler to process delivery failure notifications from Koombiyo. This handler manages unsuccessful delivery attempts, updating statuses, recording failure reasons, determining retry eligibility, and notifying relevant parties. Failed deliveries require special handling to determine next steps—whether to retry delivery, return to sender, or mark as permanently failed.

### Dependencies
- Task 51-55: TrackingEvent model complete
- Task 62: Webhook parser ready

### Instructions

1. **Create event handler function**
   - Add to `backend/apps/shipping/providers/koombiyo/webhooks.py`
   - Function: `handle_failed_event(waybill, event_data: dict)`
   - Accept waybill instance and parsed event data
   - No return value needed

2. **Create tracking event record**
   - Create TrackingEvent instance
   - Set waybill foreign key
   - Set status to FAILED
   - Set timestamp from event_data
   - Set location from event_data (attempted delivery location)

3. **Extract failure reason**
   - Get failure reason from event_data
   - Common reasons: "Customer unavailable", "Incorrect address", "Refused delivery"
   - Store reason in tracking event or waybill
   - Log failure reason for analysis

4. **Validate event data**
   - Ensure timestamp provided
   - Validate failure reason if provided
   - Check for retry information
   - Handle missing optional fields

5. **Check for duplicate failure**
   - Query for existing FAILED event with same timestamp
   - Allow multiple attempts with different timestamps
   - Skip exact duplicates
   - Log duplicate detection

6. **Save tracking event**
   - Call TrackingEvent.save()
   - Handle database errors
   - Log successful event creation
   - Catch and log save failures

7. **Increment delivery attempt counter**
   - Increment waybill.delivery_attempts counter
   - Track total attempts made
   - Use for retry eligibility determination
   - Save waybill instance

8. **Update waybill status**
   - Set waybill.status = FAILED or DELIVERY_FAILED
   - Set waybill.last_tracked_at = now()
   - Set waybill.last_delivery_attempt_at = timestamp
   - Store failure_reason in waybill

9. **Determine retry eligibility**
   - Check delivery_attempts < max_attempts (usually 3)
   - Check if retry is allowed for failure reason
   - Some reasons disqualify retry (e.g., "Refused delivery")
   - Calculate if retry should be attempted

10. **Schedule retry if eligible**
    - If retry eligible, schedule next delivery attempt
    - Set waybill.next_retry_at = timestamp + retry_delay
    - Notify Koombiyo to retry (via API or automatic)
    - Update waybill.status = RETRY_SCHEDULED

11. **Handle return to sender**
    - If max attempts reached or retry disqualified
    - Set waybill.status = RETURN_TO_SENDER
    - Initiate RTO process with Koombiyo
    - Update order status accordingly

12. **Update order status**
    - Get order from waybill.order
    - Update order.status based on retry eligibility
    - If retry: status = DELIVERY_PENDING
    - If RTO: status = DELIVERY_FAILED
    - Save order instance

13. **Send failure notifications**
    - Notify customer of delivery failure
    - Include failure reason
    - Inform about retry attempt or RTO
    - Provide contact information for resolution

14. **Notify operations team**
    - Alert operations about failed delivery
    - Especially for high-value or urgent shipments
    - Include waybill and failure details
    - Queue for manual review if needed

15. **Log failure event**
    - Log failed delivery event
    - Log failure reason
    - Log retry decision
    - Use WARNING or ERROR log level

16. **Handle errors gracefully**
    - Catch database errors
    - Catch notification errors
    - Log errors without failing webhook
    - Ensure idempotency

### Failed Event Flow

```
handle_failed_event(waybill, event_data)
    │
    ├─► Validate event data
    │
    ├─► Extract failure reason
    │
    ├─► Check for duplicate failure
    │   ├─► If duplicate: Return
    │   └─► If new: Continue
    │
    ├─► Create TrackingEvent
    │   ├─► waybill = waybill
    │   ├─► status = FAILED
    │   ├─► timestamp = event_data['timestamp']
    │   └─► location = event_data['location']
    │
    ├─► Save TrackingEvent
    │
    ├─► Increment delivery_attempts
    │
    ├─► Update Waybill
    │   ├─► status = FAILED
    │   ├─► last_delivery_attempt_at = timestamp
    │   ├─► failure_reason = reason
    │   └─► delivery_attempts += 1
    │
    ├─► Determine retry eligibility
    │   │
    │   ├─► If eligible:
    │   │   ├─► Schedule retry
    │   │   ├─► status = RETRY_SCHEDULED
    │   │   └─► next_retry_at = calculated
    │   │
    │   └─► If not eligible:
    │       ├─► Initiate RTO
    │       └─► status = RETURN_TO_SENDER
    │
    ├─► Update Order status
    │
    ├─► Send failure notifications
    │   ├─► Customer notification
    │   └─► Operations alert
    │
    └─► Log failure event
```

### Failure Reasons and Handling

| Failure Reason | Retry Eligible | Max Attempts | Action |
|----------------|----------------|--------------|--------|
| Customer Unavailable | Yes | 3 | Retry next day |
| Incorrect Address | No | 1 | Contact customer, RTO |
| Refused Delivery | No | 1 | Immediate RTO |
| Access Denied | Yes | 2 | Retry, contact customer |
| Customer Moved | No | 1 | Update address or RTO |
| Damaged Package | No | 1 | Return, refund/replace |

### Retry Eligibility Logic

```
Determine Retry:
│
├─► Check delivery_attempts < max_attempts (3)
│   └─► If exceeded: RTO
│
├─► Check failure_reason
│   ├─► "Customer Unavailable": Eligible
│   ├─► "Access Denied": Eligible
│   ├─► "Incorrect Address": Not Eligible
│   └─► "Refused Delivery": Not Eligible
│
└─► Return eligibility decision
```

### Retry Schedule

```
Attempt 1 Fails (Day 1):
    │
    ├─► delivery_attempts = 1
    ├─► next_retry_at = Day 2
    └─► Status = RETRY_SCHEDULED

Attempt 2 Fails (Day 2):
    │
    ├─► delivery_attempts = 2
    ├─► next_retry_at = Day 3
    └─► Status = RETRY_SCHEDULED

Attempt 3 Fails (Day 3):
    │
    ├─► delivery_attempts = 3
    ├─► Max attempts reached
    └─► Status = RETURN_TO_SENDER
```

### Waybill Field Updates

| Field | Value | Purpose |
|-------|-------|---------|
| status | FAILED or RETRY_SCHEDULED | Current status |
| delivery_attempts | +1 | Attempt counter |
| last_delivery_attempt_at | event timestamp | Last attempt time |
| failure_reason | From event | Why failed |
| next_retry_at | Calculated (if retry) | Next attempt time |

### Order Status Updates

| Scenario | Order Status | Notes |
|----------|--------------|-------|
| Retry Scheduled | DELIVERY_PENDING | Retry in progress |
| Max Attempts | DELIVERY_FAILED | Manual intervention |
| Immediate RTO | DELIVERY_FAILED | Not deliverable |

### Failure Notification Example

```
Customer Notification:
│
Subject: Delivery Attempt Unsuccessful
│
Message:
├─► "We attempted to deliver your order #ORD123 today."
├─► "Reason: Customer unavailable"
├─► "Next attempt: Tomorrow, 2025-02-01"
├─► "Please ensure someone is available to receive the package."
├─► "Contact us to reschedule: +94 XX XXX XXXX"
└─► "Waybill: WB123456789"

Operations Alert:
│
Subject: Delivery Failed - Waybill WB123456789
│
Message:
├─► "Delivery failed for waybill WB123456789"
├─► "Attempt: 2 of 3"
├─► "Reason: Customer unavailable"
├─► "Retry scheduled: 2025-02-01"
└─► "Review required: No"
```

### Return to Sender Process

```
Initiate RTO:
│
├─► Update waybill.status = RETURN_TO_SENDER
│
├─► Notify Koombiyo to initiate RTO
│   └─► API call or automatic RTO
│
├─► Update Order
│   ├─► status = DELIVERY_FAILED
│   └─► Add note: "Returning to sender"
│
├─► Notify customer
│   ├─► Package being returned
│   └─► Refund/replacement options
│
└─► Queue refund process (if prepaid)
```

### Error Handling

| Error | Action | Impact |
|-------|--------|--------|
| Duplicate Failure | Skip, return success | Idempotent |
| Database Error | Log, raise exception | Webhook retried |
| Notification Error | Log, continue | Event still saved |
| Retry Schedule Error | Log, manual review | Operations alerted |

### Logging Example

```
WARNING: Delivery failed for waybill WB123456789
DEBUG: Failure reason: Customer unavailable
DEBUG: Delivery attempt: 1 of 3
INFO: TrackingEvent created with status FAILED
INFO: Waybill delivery_attempts incremented to 1
INFO: Retry eligible: Yes
INFO: Next retry scheduled for: 2025-02-01T10:00:00Z
INFO: Waybill status updated to RETRY_SCHEDULED
INFO: Failure notification sent to customer
INFO: Failed event processed successfully
```

### Expected Outcome
- Failed event handler processes delivery failures
- Failure reason captured and stored
- Retry eligibility determined correctly
- Next steps executed (retry or RTO)
- Relevant parties notified

### Verification Checklist
- [ ] handle_failed_event function created
- [ ] Event data validation implemented
- [ ] Failure reason extraction working
- [ ] Duplicate failure detection
- [ ] TrackingEvent created with FAILED status
- [ ] Delivery attempts counter incremented
- [ ] Retry eligibility logic implemented
- [ ] Retry scheduling working
- [ ] RTO process initiated when appropriate
- [ ] Waybill status updated correctly
- [ ] Order status updated based on scenario
- [ ] Customer notification sent
- [ ] Operations alert sent
- [ ] Error handling implemented
- [ ] Logging statements added
- [ ] Handler tested with various failure reasons

---

## Summary

This document established the webhook infrastructure for real-time shipment status updates from Koombiyo. The webhook view accepts POST requests, verifies HMAC signatures for security, and routes events to appropriate handlers. The webhook URL is configured as a public endpoint accessible to Koombiyo's servers. Signature verification using HMAC-SHA256 ensures request authenticity. The webhook parser extracts and validates event data, routing each event type to its dedicated handler. Four event handlers process picked up, in transit, delivered, and failed events—each updating tracking records, waybill statuses, order statuses, and triggering appropriate notifications. This webhook system enables immediate, push-based tracking updates without polling, ensuring customers and operations teams have real-time visibility into shipment progress.
