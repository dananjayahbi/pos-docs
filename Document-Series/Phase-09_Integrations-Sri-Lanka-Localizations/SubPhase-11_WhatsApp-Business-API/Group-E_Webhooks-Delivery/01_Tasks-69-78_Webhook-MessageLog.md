# Tasks 69-78: Webhook Endpoint and MessageLog Model

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** E - Webhooks & Delivery  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-D/02_Tasks-63-68_Celery-Signals-Verify.md](../Group-D_Notification-Service/02_Tasks-63-68_Celery-Signals-Verify.md)
- **→ Next Document:** [02_Tasks-79-82_Handler-Alert-Verify.md](02_Tasks-79-82_Handler-Alert-Verify.md)

---

## Document Overview

This document covers the creation of the WhatsApp webhook endpoint and message logging system. It establishes the webhook infrastructure to receive delivery status updates from Meta's WhatsApp Business API, validate webhook requests using signature verification, process message status events, and track message delivery lifecycle through a comprehensive MessageLog model.

Webhooks are critical for tracking message delivery status in real-time. Meta sends webhook notifications when messages are sent, delivered, read, or fail. This bi-directional communication ensures the system has accurate delivery information and can respond to failures appropriately.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Webhook Endpoint | Medium | 30 min |
| 70 | Create Webhook Verification | Low | 20 min |
| 71 | Create Signature Validation | Medium | 35 min |
| 72 | Create Message Status Handler | Medium | 30 min |
| 73 | Create MessageLog Model | Medium | 25 min |
| 74 | Create message_id Field | Low | 10 min |
| 75 | Create status Field | Low | 15 min |
| 76 | Create delivered_at Field | Low | 10 min |
| 77 | Create read_at Field | Low | 10 min |
| 78 | Create failed_reason Field | Low | 10 min |

---

## Task 69: Create Webhook Endpoint

### Overview

Create the primary webhook endpoint that receives POST requests from Meta's WhatsApp Business API. This endpoint must be publicly accessible and handle incoming webhook events containing message status updates, delivery receipts, and failure notifications. The endpoint serves as the entry point for all webhook traffic from WhatsApp.

Meta sends webhook notifications to this endpoint whenever there's an update to message status. The endpoint must be fast, reliable, and capable of handling high volumes of concurrent requests during peak messaging periods. It should acknowledge receipt quickly and process events asynchronously to prevent timeouts.

### Dependencies

- Task 68: Verify notification flow (Group-D)
- SubPhase-03 (Core Backend Infrastructure) API framework must be complete
- Notifications app must be properly configured
- Public URL must be available for webhook registration

### Instructions

1. **Create webhook module structure**
   - Navigate to `backend/apps/notifications/webhooks/` directory
   - Create new file named `whatsapp_webhook.py` for webhook logic
   - Create `__init__.py` to make it a proper Python package
   - This organizes webhook-related code separately from main notification logic

2. **Define webhook view class**
   - Create a Django REST Framework APIView class named `WhatsAppWebhookView`
   - This view handles both GET (verification) and POST (events) requests
   - Use APIView instead of standard View for better DRF integration
   - The view should be stateless and focus only on webhook processing

3. **Configure POST endpoint for events**
   - Define `post()` method to handle incoming webhook events
   - Method accepts request object containing event payload
   - Extract JSON payload from request body
   - Validate payload structure before processing

4. **Implement request validation**
   - Check for required webhook payload structure
   - Verify the payload contains expected fields (object, entry array)
   - Validate that entry contains changes array with message statuses
   - Return HTTP 400 for malformed payloads

5. **Extract webhook event data**
   - Parse the nested webhook structure (object → entry → changes)
   - Extract message status updates from changes array
   - Identify the specific status event type (message_status update)
   - Extract message ID, status, and timestamp from event

6. **Handle webhook acknowledgment**
   - Return HTTP 200 status code immediately after validation
   - Meta requires acknowledgment within 20 seconds
   - Fast response prevents webhook retries and timeouts
   - Actual event processing should happen asynchronously (handled in Task 81)

7. **Add CSRF exemption**
   - Decorate view with `@csrf_exempt` for webhook endpoint
   - External services cannot provide CSRF tokens
   - Signature validation (Task 71) provides security instead
   - This is standard practice for webhook endpoints

8. **Configure URL routing**
   - Add webhook URL pattern to notifications app URLs
   - Use path: `/api/webhooks/whatsapp/`
   - Connect pattern to WhatsAppWebhookView class
   - Name the URL pattern `whatsapp-webhook` for reverse lookup

9. **Set up logging infrastructure**
   - Create logger instance for webhook events
   - Log all incoming webhook requests with payload summary
   - Log validation failures with reason details
   - Include request metadata (IP address, user agent)

10. **Handle error scenarios gracefully**
    - Catch and log exceptions without failing the endpoint
    - Return appropriate HTTP status codes for different errors
    - Ensure endpoint remains available even during processing failures
    - Failed events should not block subsequent webhook deliveries

### Webhook Event Structure

```
Meta WhatsApp Webhook Payload:
┌─────────────────────────────────────────────┐
│ {                                           │
│   "object": "whatsapp_business_account",    │
│   "entry": [                                │
│     {                                       │
│       "id": "WHATSAPP_BUSINESS_ACCOUNT_ID", │
│       "changes": [                          │
│         {                                   │
│           "value": {                        │
│             "messaging_product": "whatsapp",│
│             "metadata": {...},              │
│             "statuses": [                   │
│               {                             │
│                 "id": "wamid.XXX",         │
│                 "status": "delivered",      │
│                 "timestamp": "1234567890",  │
│                 "recipient_id": "+94..."   │
│               }                             │
│             ]                               │
│           },                                │
│           "field": "messages"               │
│         }                                   │
│       ]                                     │
│     }                                       │
│   ]                                         │
│ }                                           │
└─────────────────────────────────────────────┘
```

### Webhook Flow Diagram

```
Meta WhatsApp API                  LCC Backend
┌──────────────┐                   ┌────────────────┐
│              │                   │                │
│  Message     │                   │   Webhook      │
│  Status      │    POST Request   │   Endpoint     │
│  Changed     │──────────────────>│                │
│              │                   │  Validate      │
│              │                   │  Structure     │
│              │                   │                │
│              │   200 OK (Fast)   │                │
│              │<──────────────────│                │
│              │                   │                │
│              │                   │  Queue for     │
│              │                   │  Processing    │
│              │                   │                │
└──────────────┘                   └────────────────┘
       │                                    │
       │ If no ACK within 20s              │
       │ Meta retries webhook              │
       │ (exponential backoff)             │
       ▼                                    ▼
  Retry after                      Async Processing
  15s, 30s, 1m...                  (Task 81)
```

### Endpoint Characteristics

| Property | Value | Reason |
|----------|-------|--------|
| Method | POST | Receive webhook events |
| URL | `/api/webhooks/whatsapp/` | Standard webhook path |
| Authentication | None (uses signature) | External service |
| CSRF | Exempt | External POST requests |
| Response Time | < 5 seconds | Prevent Meta timeout |
| Rate Limit | None | Don't block Meta webhooks |
| Timeout | 20 seconds max | Meta requirement |

### Webhook Event Types

| Event Type | Description | Priority |
|------------|-------------|----------|
| message_status | Status update for sent message | High |
| message | Incoming message from user | Medium |
| message_reaction | User reaction to message | Low |
| message_template_status_update | Template approval status | Medium |

This implementation focuses on `message_status` events for delivery tracking.

### Expected Outcome

- Functional webhook endpoint at POST `/api/webhooks/whatsapp/`
- Endpoint accessible from external networks (Meta servers)
- Fast acknowledgment (< 5 seconds) prevents webhook retries
- Structured logging for all webhook events
- Error handling ensures endpoint availability
- Foundation for signature validation and event processing

### Verification Checklist

- [ ] Webhook endpoint created at correct URL path
- [ ] POST method handler implemented
- [ ] Request payload validation logic added
- [ ] HTTP 200 response returned within 5 seconds
- [ ] CSRF exemption applied to endpoint
- [ ] Logging infrastructure configured
- [ ] Error handling prevents endpoint failures
- [ ] URL routing properly configured

---

## Task 70: Create Webhook Verification

### Overview

Implement GET endpoint for webhook verification required by Meta during webhook configuration. When setting up webhooks in the Meta dashboard, Meta sends a GET request with verification parameters. The endpoint must validate these parameters and return the challenge token to complete webhook verification. This is a one-time setup verification process.

Meta requires webhook verification to ensure the endpoint is controlled by the developer and can receive webhooks. The verification happens before Meta starts sending actual webhook events. The endpoint must validate the verify token (configured in Meta dashboard) and return the challenge parameter exactly as received.

### Dependencies

- Task 69: Create Webhook Endpoint
- Webhook configuration settings must be defined
- Verify token must be configured in settings

### Instructions

1. **Understand verification flow**
   - Meta sends GET request during webhook setup
   - Request contains three query parameters: mode, verify_token, challenge
   - Endpoint must validate mode and verify_token
   - Must return challenge value in response body

2. **Define GET method handler**
   - Add `get()` method to WhatsAppWebhookView class
   - This method handles webhook verification requests
   - Separate from POST method which handles actual events
   - Method accepts request object containing query parameters

3. **Extract query parameters**
   - Get `hub.mode` parameter from request query string
   - Get `hub.verify_token` parameter from query string
   - Get `hub.challenge` parameter from query string
   - Handle missing parameters gracefully

4. **Validate verification mode**
   - Check that `hub.mode` equals "subscribe"
   - This indicates Meta is attempting webhook subscription
   - Return error if mode is missing or incorrect
   - Log verification attempts with mode value

5. **Configure verify token in settings**
   - Add `WHATSAPP_WEBHOOK_VERIFY_TOKEN` to Django settings
   - Use environment variable for security
   - Token should be long, random, and secret
   - Never commit token to version control

6. **Validate verify token**
   - Compare `hub.verify_token` from request with configured token
   - Use constant-time comparison to prevent timing attacks
   - Token must match exactly (case-sensitive)
   - Return HTTP 403 if token doesn't match

7. **Return challenge response**
   - If validation passes, return `hub.challenge` value
   - Return challenge as plain text (not JSON)
   - Use HTTP 200 status code
   - Meta completes webhook setup upon receiving correct challenge

8. **Handle verification failures**
   - Log all failed verification attempts with details
   - Include received token (first 4 characters only) in logs
   - Return HTTP 403 for invalid tokens
   - Return HTTP 400 for missing parameters

9. **Add security considerations**
   - Implement rate limiting for verification endpoint
   - Log IP addresses of verification attempts
   - Alert on repeated failed verification attempts
   - Consider IP whitelist for Meta servers (optional)

10. **Document verification process**
    - Create documentation for webhook setup process
    - Include steps to configure verify token in Meta dashboard
    - Document expected verification flow
    - Include troubleshooting guide for common failures

### Webhook Verification Flow

```
Meta Dashboard                    LCC Backend                  Developer
┌──────────────┐                 ┌────────────────┐           ┌──────────┐
│              │                 │                │           │          │
│  Configure   │                 │                │           │  Setup   │
│  Webhook     │                 │                │           │  Token   │
│  URL         │                 │                │           │          │
│              │                 │                │           │          │
│  Enter       │                 │                │           │  Add to  │
│  Verify      │                 │                │           │  .env    │
│  Token       │                 │                │           │          │
└──────┬───────┘                 └────────────────┘           └──────────┘
       │                                  │
       │  GET /api/webhooks/whatsapp/    │
       │  ?hub.mode=subscribe             │
       │  &hub.verify_token=SECRET        │
       │  &hub.challenge=RANDOM_STRING    │
       ├─────────────────────────────────>│
       │                                  │
       │                         Validate mode
       │                         Validate token
       │                                  │
       │        Challenge String          │
       │<─────────────────────────────────┤
       │                                  │
       │   Webhook Verified ✓             │
       │   Start sending events           │
       │                                  │
```

### Verification Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| hub.mode | Verification mode | `"subscribe"` |
| hub.verify_token | Secret token from Meta dashboard | `"mySecretToken123"` |
| hub.challenge | Random string to echo back | `"1234567890"` |

### Verification Responses

| Scenario | HTTP Status | Response Body | Action |
|----------|-------------|---------------|--------|
| Valid token | 200 OK | Challenge string | Webhook verified |
| Invalid token | 403 Forbidden | Error message | Verification fails |
| Missing parameters | 400 Bad Request | Error message | Verification fails |
| Wrong mode | 400 Bad Request | Error message | Verification fails |

### Configuration Settings

```
Environment Variables Required:
┌──────────────────────────────────────────────┐
│ WHATSAPP_WEBHOOK_VERIFY_TOKEN=              │
│   Random string, minimum 20 characters       │
│   Example: "wh_verify_xyz789_secure_token"  │
│                                              │
│ Must match token entered in Meta dashboard   │
└──────────────────────────────────────────────┘
```

### Security Considerations

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Token Length | Minimum 20 characters | Prevent brute force |
| Token Complexity | Alphanumeric + special chars | Increase entropy |
| Token Storage | Environment variables | Prevent exposure |
| Comparison | Constant-time comparison | Prevent timing attacks |
| Rate Limiting | Max 10 requests/minute | Prevent abuse |
| Logging | Log all attempts | Security audit trail |

### Expected Outcome

- GET endpoint handler for webhook verification
- Query parameter extraction and validation
- Verify token validation against configured secret
- Challenge response returns correct value
- Failed verification attempts logged with details
- Webhook verification completes successfully in Meta dashboard

### Verification Checklist

- [ ] GET method handler added to webhook view
- [ ] Query parameter extraction implemented
- [ ] Verify token configured in settings/environment
- [ ] Token validation logic with constant-time comparison
- [ ] Challenge response returns plain text
- [ ] Error responses for invalid parameters
- [ ] Logging for all verification attempts
- [ ] Documentation for setup process created

---

## Task 71: Create Signature Validation

### Overview

Implement X-Hub-Signature-256 validation to verify that webhook requests genuinely originate from Meta's servers and haven't been tampered with. Meta signs every webhook request using HMAC-SHA256 with the app secret. The endpoint must validate this signature before processing any webhook payload. This prevents malicious actors from sending fake webhook requests.

Signature validation is the primary security mechanism for webhooks. Since the endpoint is publicly accessible and doesn't use traditional authentication, signature validation ensures only Meta can send valid webhook requests. Without signature validation, attackers could send fake delivery receipts or status updates.

### Dependencies

- Task 69: Create Webhook Endpoint
- App secret must be configured in settings
- Python hashlib library for HMAC computation

### Instructions

1. **Understand signature mechanism**
   - Meta computes HMAC-SHA256 hash of request body using app secret
   - Hash is sent in `X-Hub-Signature-256` header
   - Format: `sha256=<hex_digest>`
   - Server must compute same hash and compare

2. **Create signature validation module**
   - Create new file `backend/apps/notifications/webhooks/signature.py`
   - Define function `validate_webhook_signature()`
   - This function handles all signature validation logic
   - Keep signature logic separate for reusability and testing

3. **Extract signature from header**
   - Get `X-Hub-Signature-256` header from request
   - Split header value to extract hex digest
   - Format: `sha256=<digest>` → extract `<digest>` part
   - Handle missing header gracefully

4. **Configure app secret in settings**
   - Add `WHATSAPP_APP_SECRET` to Django settings
   - Load from environment variable for security
   - This is the secret from Meta App Dashboard
   - Never commit app secret to version control

5. **Compute expected signature**
   - Get raw request body bytes (before parsing)
   - Important: Use raw bytes, not parsed JSON
   - Compute HMAC-SHA256 using app secret as key
   - Convert digest to hexadecimal string

6. **Implement constant-time comparison**
   - Use `hmac.compare_digest()` for signature comparison
   - Never use standard equality comparison
   - Prevents timing attacks that could reveal signature
   - Return True if signatures match, False otherwise

7. **Integrate validation into webhook view**
   - Call validation function at start of POST handler
   - Pass request object to validation function
   - Reject request with HTTP 401 if validation fails
   - Log failed validation attempts with IP address

8. **Handle validation failures**
   - Return HTTP 401 Unauthorized for invalid signatures
   - Don't reveal why signature failed (security)
   - Log detailed validation failure info for debugging
   - Include request IP, timestamp, and signature received

9. **Add monitoring and alerting**
   - Count failed signature validations
   - Alert security team on multiple failures from same IP
   - Track failed validations over time
   - This indicates potential attack attempts

10. **Test signature validation**
    - Create test cases with known signatures
    - Test with tampered payloads
    - Test with missing signature header
    - Test with incorrect app secret
    - Ensure validation works with Meta's actual requests

### Signature Validation Flow

```
Meta Server                       LCC Backend
┌──────────────┐                 ┌────────────────────────────┐
│              │                 │                            │
│  Webhook     │  1. Create      │                            │
│  Payload     │     POST body   │                            │
│              │                 │                            │
│  App Secret  │  2. Compute     │                            │
│  (Private)   │     HMAC-SHA256 │                            │
│              │                 │                            │
│  Signature   │  3. Add header  │                            │
│  = Hash      │     X-Hub-Sig   │                            │
└──────┬───────┘                 └────────────────────────────┘
       │
       │  POST /webhooks/whatsapp/
       │  Header: X-Hub-Signature-256: sha256=abc123...
       │  Body: {webhook payload}
       ├────────────────────────────────────────>
       │                                          │
       │                                    4. Extract
       │                                       signature
       │                                          │
       │                                    5. Get raw
       │                                       body bytes
       │                                          │
       │                                    6. Compute
       │                                       HMAC with
       │                                       app secret
       │                                          │
       │                                    7. Compare
       │                                       signatures
       │                                          │
       │          If match: Process          │
       │          If mismatch: Reject 401    │
       │<────────────────────────────────────────┤
```

### Signature Computation

```
Algorithm: HMAC-SHA256
┌─────────────────────────────────────────────┐
│                                             │
│  Key:     App Secret (from Meta Dashboard) │
│  Message: Raw HTTP request body bytes      │
│  Output:  Hex digest string                │
│                                             │
│  Example:                                   │
│    Key:     "my_app_secret_xyz"           │
│    Message: '{"object":"whatsapp_..."}'    │
│    Output:  "a1b2c3d4e5f6..."             │
│                                             │
└─────────────────────────────────────────────┘
```

### Validation Function Structure

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Extract signature | Get signature from header | Parse X-Hub-Signature-256 |
| Get raw body | Access request body bytes | request.body (not parsed) |
| Compute HMAC | Generate expected signature | hmac.new(secret, body, sha256) |
| Compare | Validate signatures match | hmac.compare_digest() |
| Return | Validation result | Boolean True/False |

### Common Validation Failures

| Failure Reason | HTTP Status | Cause | Resolution |
|----------------|-------------|-------|------------|
| Missing header | 401 | Header not sent | Check Meta configuration |
| Invalid format | 401 | Header format wrong | Verify header format |
| Signature mismatch | 401 | Different secrets | Check app secret matches |
| Body modified | 401 | Body changed after signing | Ensure raw body used |

### Security Best Practices

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| Constant-time comparison | hmac.compare_digest() | Prevents timing attacks |
| Raw body validation | Use request.body | Ensures integrity |
| Secret protection | Environment variables | Prevents exposure |
| Failed attempt logging | Log with IP and time | Security monitoring |
| Rate limiting | Max attempts per IP | Prevents brute force |
| Alert on failures | Notify security team | Detect attacks early |

### Configuration Requirements

```
Environment Variables:
┌──────────────────────────────────────────────┐
│ WHATSAPP_APP_SECRET=                        │
│   Found in Meta App Dashboard               │
│   Settings > Basic > App Secret             │
│   Click "Show" to reveal value              │
│   Example: "abc123def456..."                │
│                                              │
│ Keep secret secure, never commit to git     │
└──────────────────────────────────────────────┘
```

### Expected Outcome

- Signature validation module with HMAC-SHA256 computation
- Integration with webhook endpoint POST handler
- Rejection of requests with invalid/missing signatures
- Constant-time comparison prevents timing attacks
- Comprehensive logging of validation attempts
- Security monitoring for suspicious activity
- Webhook endpoint secured against fake requests

### Verification Checklist

- [ ] Signature validation function created
- [ ] App secret configured in settings
- [ ] HMAC-SHA256 computation implemented
- [ ] Signature extraction from header
- [ ] Raw request body used (not parsed)
- [ ] Constant-time comparison used
- [ ] Integration with POST handler
- [ ] HTTP 401 returned for invalid signatures
- [ ] Logging for failed validations
- [ ] Test cases for validation scenarios

---

## Task 72: Create Message Status Handler

### Overview

Implement message status event handler that processes webhook payloads and extracts message delivery status updates. Meta sends various status updates for each message: sent (message accepted by Meta), delivered (message reached recipient's device), read (recipient opened message), and failed (delivery failed). The handler must parse webhook events and extract status information for logging.

The status handler is the core processing logic that interprets Meta's webhook payloads. It must understand Meta's webhook structure, extract relevant status data, and prepare it for database storage. This handler bridges the gap between Meta's webhook format and the application's internal message tracking system.

### Dependencies

- Task 71: Create Signature Validation
- Understanding of Meta webhook payload structure
- JSON parsing capabilities

### Instructions

1. **Understand webhook event structure**
   - Study Meta's webhook payload format
   - Identify status update events vs other event types
   - Understand nested structure: object → entry → changes → value → statuses
   - Review example webhook payloads from Meta documentation

2. **Create status handler function**
   - Define function `handle_message_status_event()` in webhook module
   - Function accepts parsed webhook payload dictionary
   - Returns list of status updates extracted from event
   - Keep handler function pure and testable

3. **Validate webhook object type**
   - Check payload contains `object` field
   - Verify `object` equals "whatsapp_business_account"
   - This ensures webhook is for WhatsApp Business API
   - Return empty list if object type doesn't match

4. **Extract entry array**
   - Get `entry` array from payload root
   - Entry array contains all changes in this webhook event
   - Handle case where entry array is missing or empty
   - Each entry represents a business account change

5. **Iterate through changes**
   - Loop through `changes` array within each entry
   - Each change represents a specific event
   - Filter for changes where `field` equals "messages"
   - Skip non-message changes (like template updates)

6. **Extract status updates**
   - Get `value` object from each change
   - Extract `statuses` array from value
   - Statuses array contains message status updates
   - Each status represents one message's status change

7. **Parse individual status objects**
   - Extract `id` field (message ID from WhatsApp)
   - Extract `status` field (sent/delivered/read/failed)
   - Extract `timestamp` field (Unix timestamp)
   - Extract `recipient_id` field (phone number)

8. **Handle different status types**
   - Recognize "sent" status (message sent to Meta servers)
   - Recognize "delivered" status (reached device)
   - Recognize "read" status (user opened message)
   - Recognize "failed" status (delivery failure)

9. **Extract failure information**
   - For "failed" status, extract `errors` array
   - Get error code, title, and message
   - This provides reason for delivery failure
   - Store failure details for troubleshooting

10. **Return structured status data**
    - Convert extracted data to structured format
    - Return list of dictionaries with standardized fields
    - Include: message_id, status, timestamp, recipient, errors
    - This format ready for database storage (Task 79)

### Message Status Lifecycle

```
Message Status Flow:
┌────────┐
│        │
│ CREATE │  Message created in database (status: pending)
│        │
└────┬───┘
     │
     ▼
┌────────┐
│        │
│  SENT  │  Message accepted by Meta API (webhook callback)
│        │  Timestamp: sent_at
└────┬───┘
     │
     ▼
┌────────────┐
│            │
│ DELIVERED  │  Message delivered to recipient's device (webhook callback)
│            │  Timestamp: delivered_at
└────┬───────┘
     │
     ▼
┌────────┐
│        │
│  READ  │  Recipient opened message (webhook callback)
│        │  Timestamp: read_at
└────────┘

Alternative Flow (Failure):
┌────────┐
│        │
│ FAILED │  Delivery failed (webhook callback)
│        │  Contains: failed_reason
└────────┘
```

### Webhook Payload Structure

```
Meta Webhook Payload Hierarchy:
┌───────────────────────────────────────────────┐
│ {                                             │
│   "object": "whatsapp_business_account",      │ ─┐
│   "entry": [                                  │  │ Root Level
│     {                                         │ ─┘
│       "id": "BUSINESS_ACCOUNT_ID",            │ ─┐
│       "changes": [                            │  │
│         {                                     │  │ Entry Level
│           "field": "messages",                │  │
│           "value": {                          │ ─┘
│             "messaging_product": "whatsapp",  │ ─┐
│             "metadata": {                     │  │
│               "phone_number_id": "12345"      │  │
│             },                                │  │
│             "statuses": [                     │  │ Value Level
│               {                               │  │
│                 "id": "wamid.XXXX",          │  │
│                 "status": "delivered",        │  │
│                 "timestamp": "1234567890",    │  │
│                 "recipient_id": "+94XXXX"    │ ─┘
│               }                               │ ─┐
│             ]                                 │  │ Status Level
│           }                                   │  │ (Target Data)
│         }                                     │ ─┘
│       ]                                       │
│     }                                         │
│   ]                                           │
│ }                                             │
└───────────────────────────────────────────────┘
```

### Status Event Types

| Status | Description | Timing | Webhook Fields |
|--------|-------------|--------|----------------|
| sent | Meta accepted message | Immediately after API call | id, status, timestamp |
| delivered | Reached recipient device | Seconds to minutes later | id, status, timestamp, recipient_id |
| read | Recipient opened message | When user opens chat | id, status, timestamp, recipient_id |
| failed | Delivery failed | After multiple retries | id, status, timestamp, errors |

### Failure Error Structure

```
Failed Status Webhook:
┌─────────────────────────────────────────────┐
│ "statuses": [                               │
│   {                                         │
│     "id": "wamid.XXX",                     │
│     "status": "failed",                     │
│     "timestamp": "1234567890",              │
│     "recipient_id": "+94771234567",        │
│     "errors": [                             │
│       {                                     │
│         "code": 131047,                     │
│         "title": "Re-engagement message",   │
│         "message": "Re-engagement msg..."   │
│       }                                     │
│     ]                                       │
│   }                                         │
│ ]                                           │
└─────────────────────────────────────────────┘
```

### Handler Output Format

| Field | Type | Source | Example |
|-------|------|--------|---------|
| message_id | string | statuses[].id | "wamid.XXX" |
| status | string | statuses[].status | "delivered" |
| timestamp | integer | statuses[].timestamp | 1234567890 |
| recipient_id | string | statuses[].recipient_id | "+94771234567" |
| errors | array | statuses[].errors | [{code, title, message}] |

### Error Handling

| Scenario | Action | Response |
|----------|--------|----------|
| Missing object field | Log warning, return empty list | Continue |
| Empty entry array | Log warning, return empty list | Continue |
| Invalid status format | Log error with payload, skip status | Continue |
| Missing required fields | Log error, skip status | Continue |
| Unknown status type | Log warning, process anyway | Continue |

### Expected Outcome

- Status handler function that parses webhook payloads
- Extraction of message IDs and status types
- Handling of all status types (sent/delivered/read/failed)
- Failure error extraction and formatting
- Structured output ready for database updates
- Robust error handling for malformed payloads

### Verification Checklist

- [ ] Status handler function created
- [ ] Webhook payload validation implemented
- [ ] Entry and changes array extraction
- [ ] Status array parsing logic
- [ ] Message ID extraction
- [ ] Status type extraction
- [ ] Timestamp extraction
- [ ] Failure error handling
- [ ] Structured output format
- [ ] Test with sample webhook payloads

---

## Task 73: Create MessageLog Model

### Overview

Create the MessageLog database model to track message delivery status and lifecycle. This model stores critical information about each WhatsApp message sent through the system, including message IDs, current status, delivery timestamps, and failure reasons. The model serves as the single source of truth for message delivery tracking and enables delivery analytics, failure diagnostics, and user notifications.

The MessageLog model complements the WhatsAppMessage model (from Group-C/D). WhatsAppMessage stores message content and sending details, while MessageLog tracks delivery lifecycle after sending. This separation allows efficient querying of delivery status without loading full message content.

### Dependencies

- Task 72: Create Message Status Handler
- SubPhase-02 (Database Architecture) multi-tenancy setup
- Notifications app database configuration
- Understanding of tenant schema structure

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/notifications/models/` directory
   - Create new file named `message_log.py`
   - This separates message logging from main notification models
   - Import necessary Django model classes and fields

2. **Define MessageLog model class**
   - Create class `MessageLog` inheriting from appropriate base model
   - Decide if model should be tenant-specific or public schema
   - Message logs are tenant-specific (delivery tracking per tenant)
   - Use TenantModel or add tenant foreign key

3. **Establish relationship with WhatsAppMessage**
   - Add ForeignKey to WhatsAppMessage model
   - Use `on_delete=models.CASCADE` to delete logs with message
   - Set `related_name='delivery_log'` for reverse lookup
   - This links delivery tracking to original message

4. **Add timestamp fields**
   - Create `created_at` field with auto_now_add=True
   - Create `updated_at` field with auto_now=True
   - These track when log entries are created and modified
   - Useful for debugging and analytics

5. **Plan for additional fields**
   - Model will contain: message_id, status, delivered_at, read_at, failed_reason
   - These fields added in subsequent tasks (74-78)
   - Base model structure created now
   - Fields added incrementally for organization

6. **Configure model metadata**
   - Set `db_table` name: `notifications_message_log`
   - Add `ordering` by created_at descending (newest first)
   - Set `verbose_name` and `verbose_name_plural` for admin
   - Add appropriate indexes for query performance

7. **Add model methods**
   - Create `__str__()` method returning message_id and status
   - Add method to check if message was delivered
   - Add method to check if message was read
   - Add method to get delivery duration (sent → delivered)

8. **Configure admin interface**
   - Register model with Django admin
   - Configure list display with key fields
   - Add filters for status and date ranges
   - Enable search by message_id and phone number

9. **Create database migration**
   - Run makemigrations command for notifications app
   - Review generated migration file
   - Ensure migration creates table in tenant schemas
   - Migration will be expanded in tasks 74-78

10. **Document model purpose**
    - Add comprehensive docstring to model class
    - Explain relationship between MessageLog and WhatsAppMessage
    - Document expected lifecycle of log entries
    - Include examples of common queries

### Model Relationships

```
Database Model Relationships:
┌──────────────────────┐
│                      │
│  WhatsAppMessage     │
│                      │
│  - id (PK)           │
│  - phone_number      │
│  - message_text      │
│  - template_name     │
│  - status            │
│  - sent_at           │
│                      │
└──────────┬───────────┘
           │
           │ One-to-Many
           │ (one message can have
           │  multiple log entries
           │  if resent)
           │
           ▼
┌──────────────────────┐
│                      │
│  MessageLog          │
│                      │
│  - id (PK)           │
│  - message (FK)      │────> Points to WhatsAppMessage
│  - message_id        │
│  - status            │
│  - delivered_at      │
│  - read_at           │
│  - failed_reason     │
│  - created_at        │
│  - updated_at        │
│                      │
└──────────────────────┘
```

### MessageLog vs WhatsAppMessage

| Aspect | WhatsAppMessage | MessageLog |
|--------|----------------|------------|
| Purpose | Store message content | Track delivery status |
| When Created | Before sending | After webhook event |
| Updated By | Application code | Webhook callbacks |
| Contains | Content, template, recipient | Status, timestamps, errors |
| Query For | Finding messages sent | Checking delivery status |
| Size | Larger (content) | Smaller (metadata) |

### Model Tenancy Considerations

| Consideration | Decision | Reason |
|---------------|----------|--------|
| Schema | Tenant-specific | Isolate tenant data |
| Foreign Keys | Point to tenant models | Maintain tenant boundaries |
| Queries | Automatic tenant filtering | Django-tenants handles |
| Migration | Applied to all tenants | Consistent schema |

### Database Indexes Strategy

| Index | Columns | Purpose |
|-------|---------|---------|
| Primary | id | Unique identifier |
| Foreign Key | message_id | Join with WhatsAppMessage |
| Status Lookup | status, created_at | Find pending/failed messages |
| Delivery Query | delivered_at | Delivery analytics |
| Read Query | read_at | Read receipt analytics |

### Model Lifecycle

```
MessageLog Lifecycle:
┌─────────────────────────────────────────────┐
│                                             │
│  1. WhatsAppMessage sent via API            │
│     (MessageLog not yet created)            │
│                                             │
│  2. Meta sends "sent" webhook               │
│     → Create MessageLog entry               │
│     → status = "sent"                       │
│                                             │
│  3. Meta sends "delivered" webhook          │
│     → Update MessageLog entry               │
│     → status = "delivered"                  │
│     → delivered_at = timestamp              │
│                                             │
│  4. Meta sends "read" webhook               │
│     → Update MessageLog entry               │
│     → status = "read"                       │
│     → read_at = timestamp                   │
│                                             │
│  Alternative: Meta sends "failed" webhook   │
│     → Update MessageLog entry               │
│     → status = "failed"                     │
│     → failed_reason = error details         │
│                                             │
└─────────────────────────────────────────────┘
```

### Common Query Patterns

| Query Purpose | Filter Criteria | Use Case |
|---------------|----------------|----------|
| Pending deliveries | status="sent", older than 5 min | Find stuck messages |
| Failed messages | status="failed" | Retry logic |
| Delivery rate | Count by status | Analytics dashboard |
| Unread messages | status="delivered", read_at is null | Follow-up reminders |
| Slow deliveries | delivered_at - created_at > 1 hour | Performance monitoring |

### Expected Outcome

- MessageLog model class defined with base structure
- Foreign key relationship to WhatsAppMessage
- Timestamp fields for creation and update tracking
- Database table created in tenant schemas
- Django admin interface configured for viewing logs
- Foundation ready for adding status fields (Tasks 74-78)

### Verification Checklist

- [ ] MessageLog model class created
- [ ] ForeignKey relationship to WhatsAppMessage defined
- [ ] created_at and updated_at fields added
- [ ] Model metadata configured (db_table, ordering)
- [ ] __str__ method implemented
- [ ] Django admin registration completed
- [ ] Database migration generated
- [ ] Migration applied successfully
- [ ] Model accessible in Django shell
- [ ] Base queries work correctly

---

## Task 74: Create message_id Field

### Overview

Add the message_id field to MessageLog model to store WhatsApp's unique message identifier. This ID (starting with "wamid.") is returned by Meta's API when sending messages and is included in all webhook status updates. The message_id serves as the primary key for matching webhook events to the correct message log entry and enables duplicate event detection.

Meta assigns a unique message_id to every WhatsApp message. This ID is different from the database primary key and is used by Meta to track messages through their system. Storing this ID is essential for correlating webhook events with sent messages and for querying Meta's API about specific messages.

### Dependencies

- Task 73: Create MessageLog Model
- Understanding of Meta's message ID format
- Knowledge of webhook payload structure

### Instructions

1. **Understand message_id characteristics**
   - Format: "wamid." followed by alphanumeric characters
   - Example: "wamid.HBgMOTE4NzczMjQyNzQ2FQIAERgSMUQxNEQ1N0I3RjREOEMzQjg3AA=="
   - Length: Variable, typically 80-100 characters
   - Uniqueness: Globally unique across all WhatsApp messages

2. **Add message_id field to model**
   - Open `message_log.py` model file
   - Add CharField for message_id
   - Set max_length to 255 to accommodate long IDs
   - Make field unique to prevent duplicate log entries

3. **Configure field properties**
   - Set `null=True` initially (message created before ID received)
   - Set `blank=True` for form validation
   - Add `db_index=True` for fast lookups by message_id
   - This field is set after receiving webhook event

4. **Add field validation**
   - Add validator to ensure format starts with "wamid."
   - This catches data entry errors and API changes
   - Use Django's RegexValidator or custom validator
   - Validation helps maintain data integrity

5. **Handle null case**
   - Field is null when log entry first created
   - Updated when first webhook event received (usually "sent")
   - Add model method `has_message_id()` to check if set
   - This indicates whether Meta has acknowledged the message

6. **Update model __str__ method**
   - Include message_id in string representation
   - Truncate long IDs for readability (first 20 chars)
   - Format: "Message wamid.HBgMOTE... - Status: delivered"
   - Makes admin interface more useful

7. **Add uniqueness constraint**
   - Ensure message_id is unique across all log entries
   - Prevents duplicate processing of same webhook event
   - Database-level uniqueness provides strong guarantee
   - Handles race conditions in concurrent webhook processing

8. **Create database migration**
   - Generate migration for new field
   - Migration adds column to existing table
   - Set default value for existing records (if any)
   - Review migration before applying

9. **Update admin interface**
   - Add message_id to list_display
   - Add message_id to search_fields for quick lookup
   - Add filter for messages with/without message_id
   - Enables support team to track specific messages

10. **Document field usage**
    - Add docstring explaining message_id source
    - Note that ID comes from Meta's API response
    - Document expected format and length
    - Include example values for reference

### Message ID Format

```
WhatsApp Message ID Format:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Format:  wamid.<BASE64_ENCODED_DATA>              │
│                                                     │
│  Example:                                           │
│    wamid.HBgMOTE4NzczMjQyNzQ2FQIAERgSMUQxNEQ1N0I3  │
│    RjREOEMzQjg3AA==                                │
│                                                     │
│  Length:  Typically 80-100 characters              │
│                                                     │
│  Parts:                                             │
│    1. Prefix: "wamid."                             │
│    2. Encoded data: Base64 encoded message info    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Message ID Sources

| Source | When Received | Field Updated |
|--------|---------------|---------------|
| Send Message API Response | Immediately after successful send | Can be set proactively |
| Webhook "sent" Event | Seconds after send | First webhook opportunity |
| Webhook "delivered" Event | Minutes after send | Usually already set |
| Webhook "read" Event | When user reads | Usually already set |

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Type | CharField | Variable length string |
| max_length | 255 | Accommodate long IDs |
| unique | True | Prevent duplicate logs |
| null | True | ID not available at creation |
| blank | True | Optional in forms |
| db_index | True | Fast webhook lookups |

### Uniqueness Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| Duplicate prevention | Same webhook not processed twice | Data integrity |
| Race condition safety | Concurrent webhooks don't conflict | Reliability |
| Event correlation | Link all events to same message | Tracking accuracy |
| Idempotency | Reprocessing webhooks is safe | Error recovery |

### Query Patterns

```
Common Queries Using message_id:
┌─────────────────────────────────────────────┐
│                                             │
│  1. Find log by Meta message ID:            │
│     MessageLog.objects.get(                 │
│         message_id="wamid.XXX"              │
│     )                                       │
│                                             │
│  2. Check if message ID exists:             │
│     MessageLog.objects.filter(              │
│         message_id="wamid.XXX"              │
│     ).exists()                              │
│                                             │
│  3. Find messages without ID:               │
│     MessageLog.objects.filter(              │
│         message_id__isnull=True             │
│     )                                       │
│                                             │
└─────────────────────────────────────────────┘
```

### Webhook Correlation Example

```
Correlating Webhook Events:
┌─────────────────────────────────────────────┐
│                                             │
│  1. Send message via API                    │
│     → Response includes message_id          │
│     → Store in MessageLog.message_id        │
│                                             │
│  2. Webhook "delivered" arrives             │
│     → Extract message_id from payload       │
│     → Query: MessageLog.objects.get(        │
│         message_id=extracted_id             │
│       )                                     │
│     → Update found log with delivery info   │
│                                             │
│  3. Webhook "read" arrives                  │
│     → Extract same message_id               │
│     → Find same log entry                   │
│     → Update with read timestamp            │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome

- message_id field added to MessageLog model
- Field configured with appropriate constraints
- Database index created for fast lookups
- Uniqueness constraint prevents duplicate processing
- Admin interface updated with message_id
- Migration generated and applied successfully
- Field ready to store WhatsApp message identifiers

### Verification Checklist

- [ ] message_id CharField added to model
- [ ] max_length set to 255
- [ ] unique=True constraint applied
- [ ] null=True and blank=True configured
- [ ] db_index=True for performance
- [ ] Field validation implemented
- [ ] __str__ method updated to include message_id
- [ ] Admin interface displays message_id
- [ ] Database migration created
- [ ] Migration applied successfully
- [ ] Field accessible in Django shell

---

## Task 75: Create status Field

### Overview

Add the status field to MessageLog model to track the current delivery state of each message. The status progresses through a defined lifecycle: pending (created), sent (accepted by Meta), delivered (reached device), read (opened by user), or failed (delivery unsuccessful). This field is the core indicator of message delivery progress and is updated by webhook events.

Message status is central to delivery tracking and user experience. Applications need to know whether messages were successfully delivered, and users expect delivery confirmations. The status field enables filtering messages by delivery state, calculating delivery rates, identifying failures, and triggering follow-up actions.

### Dependencies

- Task 74: Create message_id Field
- Understanding of message lifecycle
- Knowledge of Meta's status event types

### Instructions

1. **Define status choices**
   - Create Django choices class or tuple for status values
   - Define five status values: pending, sent, delivered, read, failed
   - Use uppercase constants: STATUS_PENDING, STATUS_SENT, etc.
   - This ensures consistency and prevents typos

2. **Add status field to model**
   - Add CharField with max_length=20
   - Set choices parameter to status choices
   - Set default value to STATUS_PENDING
   - This field is required (null=False)

3. **Configure status progression logic**
   - Status can only move forward in lifecycle
   - Exception: Any status can change to failed
   - Prevent backward transitions (delivered → sent invalid)
   - Add validation method to check valid transitions

4. **Add field indexing**
   - Set db_index=True for status field
   - Enables fast filtering by status (e.g., find all failed)
   - Common query pattern: get all pending messages
   - Index improves dashboard performance

5. **Create status check methods**
   - Add `is_pending()` method returning boolean
   - Add `is_sent()` method
   - Add `is_delivered()` method
   - Add `is_read()` method
   - Add `is_failed()` method

6. **Add status transition method**
   - Create `update_status(new_status)` method
   - Validate transition is allowed
   - Update status field and save
   - Log status change for audit trail

7. **Configure admin display**
   - Add status to list_display
   - Add status filter to list_filter
   - Use color coding for different statuses (success/danger)
   - Add status to search capabilities

8. **Add status analytics methods**
   - Create class method to count messages by status
   - Add method to calculate delivery rate percentage
   - Add method to find old pending messages (stuck)
   - These support dashboards and monitoring

9. **Create database migration**
   - Generate migration for status field
   - Set default value for existing records
   - Review migration before applying
   - Apply migration to all tenant schemas

10. **Document status lifecycle**
    - Add comprehensive docstring explaining status values
    - Document valid status transitions
    - Explain when each status is set
    - Include lifecycle diagram in comments

### Status Lifecycle

```
Message Status Progression:
┌──────────┐
│          │
│ PENDING  │  Initial state when log created
│          │  Message not yet sent
└────┬─────┘
     │
     │ Send API call successful
     │ Webhook "sent" event
     ▼
┌──────────┐
│          │
│   SENT   │  Meta accepted message
│          │  Message in Meta's system
└────┬─────┘
     │
     │ Webhook "delivered" event
     │ Message reached device
     ▼
┌──────────────┐
│              │
│  DELIVERED   │  Device received message
│              │  User may not have seen it
└────┬─────────┘
     │
     │ Webhook "read" event
     │ User opened message
     ▼
┌──────────┐
│          │
│   READ   │  User viewed message
│          │  Terminal state (success)
└──────────┘

Alternative Path (from any state):
     │
     │ Webhook "failed" event
     │ Delivery unsuccessful
     ▼
┌──────────┐
│          │
│  FAILED  │  Delivery failed
│          │  Terminal state (failure)
└──────────┘
```

### Status Choices Configuration

| Status Value | Display Name | Description | Terminal |
|--------------|--------------|-------------|----------|
| pending | Pending | Not yet sent | No |
| sent | Sent | Accepted by Meta | No |
| delivered | Delivered | Reached device | No |
| read | Read | Opened by user | Yes |
| failed | Failed | Delivery failed | Yes |

### Valid Status Transitions

| From Status | To Status | Valid? | Trigger |
|-------------|-----------|--------|---------|
| pending | sent | Yes | Webhook sent event |
| pending | failed | Yes | Send API failure |
| sent | delivered | Yes | Webhook delivered event |
| sent | failed | Yes | Webhook failed event |
| delivered | read | Yes | Webhook read event |
| delivered | failed | No | Cannot fail after delivery |
| sent | pending | No | Cannot go backward |
| delivered | sent | No | Cannot go backward |

### Status Query Patterns

```
Common Status Queries:
┌─────────────────────────────────────────────┐
│                                             │
│  1. Find all failed messages:               │
│     MessageLog.objects.filter(              │
│         status='failed'                     │
│     )                                       │
│                                             │
│  2. Find undelivered messages:              │
│     MessageLog.objects.filter(              │
│         status__in=['pending', 'sent']      │
│     )                                       │
│                                             │
│  3. Count by status:                        │
│     MessageLog.objects.values('status')     │
│         .annotate(count=Count('id'))        │
│                                             │
│  4. Delivery rate:                          │
│     total = MessageLog.objects.count()      │
│     delivered = MessageLog.objects.filter(  │
│         status__in=['delivered', 'read']    │
│     ).count()                               │
│     rate = (delivered / total) * 100        │
│                                             │
└─────────────────────────────────────────────┘
```

### Status-Based Business Logic

| Status | Action | Purpose |
|--------|--------|---------|
| pending > 5 min | Alert operations team | Detect stuck messages |
| sent > 1 hour | Check Meta API status | Investigate delay |
| failed | Retry message (if retryable) | Improve delivery |
| failed | Notify sender | User awareness |
| delivered | Mark as successful | Analytics |
| read | Trigger follow-up action | Engagement flow |

### Admin Interface Enhancements

| Enhancement | Implementation | Benefit |
|-------------|----------------|---------|
| Color coding | CSS classes per status | Visual distinction |
| Status filter | list_filter with status | Quick filtering |
| Bulk actions | Change status in bulk | Admin efficiency |
| Status counts | Display counts in list | Overview at glance |

### Expected Outcome

- status field added with defined choices
- Default value set to "pending"
- Database index for fast status queries
- Status check methods (is_pending, is_sent, etc.)
- Status transition validation logic
- Admin interface displays status clearly
- Migration applied successfully
- Field ready for webhook updates

### Verification Checklist

- [ ] status CharField added with choices
- [ ] Default value set to pending
- [ ] db_index=True applied
- [ ] Status choices defined (pending/sent/delivered/read/failed)
- [ ] Status check methods implemented
- [ ] update_status method with validation
- [ ] Admin list_display includes status
- [ ] Admin list_filter includes status
- [ ] Database migration created
- [ ] Migration applied successfully
- [ ] Status field functional in Django shell

---

## Task 76: Create delivered_at Field

### Overview

Add the delivered_at timestamp field to MessageLog model to record when a message was successfully delivered to the recipient's device. This timestamp is set when Meta sends a "delivered" status webhook event. The field enables calculation of delivery time (time between sending and delivery), delivery analytics, and SLA monitoring for message delivery performance.

Delivery timestamp is crucial for understanding message delivery speed and reliability. It helps identify slow deliveries, calculate average delivery times, detect network issues, and provide users with accurate delivery notifications. This field remains null until the message is delivered, distinguishing between sent and delivered states.

### Dependencies

- Task 75: Create status Field
- Understanding of webhook timestamp format
- Knowledge of timezone handling

### Instructions

1. **Add delivered_at field to model**
   - Add DateTimeField named `delivered_at`
   - Set null=True (not all messages are delivered)
   - Set blank=True for form validation
   - Field remains null until delivery occurs

2. **Configure timezone awareness**
   - Ensure field is timezone-aware (USE_TZ=True)
   - Store all timestamps in UTC
   - Convert webhook Unix timestamps to datetime objects
   - Django automatically handles timezone conversion

3. **Add field indexing**
   - Set db_index=True for analytics queries
   - Enables fast queries by delivery date range
   - Supports dashboard date filters
   - Improves performance for time-based reports

4. **Create delivery time calculation method**
   - Add method `get_delivery_duration()` to model
   - Calculate time between created_at and delivered_at
   - Return timedelta object
   - Handle case where delivered_at is null

5. **Add delivery check method**
   - Create `has_been_delivered()` method
   - Returns True if delivered_at is not null
   - Alternative to checking status == 'delivered'
   - More explicit and readable

6. **Handle webhook timestamp conversion**
   - Webhook sends Unix timestamp (seconds since epoch)
   - Convert to Python datetime: datetime.fromtimestamp()
   - Ensure timezone awareness: timezone.make_aware()
   - Validate timestamp is reasonable (not far future)

7. **Add delivery analytics helpers**
   - Create class method for average delivery time
   - Add method to find slow deliveries (> threshold)
   - Add method to count deliveries by hour of day
   - Support operational monitoring and reporting

8. **Configure admin display**
   - Add delivered_at to list_display
   - Format display as human-readable (e.g., "2 mins ago")
   - Add filter for delivered date range
   - Enable sorting by delivery time

9. **Add validation logic**
   - Ensure delivered_at is not before created_at
   - Validate delivered_at is not in future
   - Check delivered_at only set when status is delivered/read
   - Add clean() method for validation

10. **Create database migration**
    - Generate migration for delivered_at field
    - Review migration for correctness
    - Apply migration to all tenant schemas
    - Verify field accessible after migration

### Delivery Timing Flow

```
Message Delivery Timeline:
┌─────────────────────────────────────────────┐
│                                             │
│  T0: created_at                             │
│      Message log entry created              │
│      Status: pending                        │
│      delivered_at: NULL                     │
│                                             │
│  T1: Sent via API                           │
│      Status: sent                           │
│      delivered_at: NULL                     │
│                                             │
│  T2: Webhook "delivered" received           │
│      Status: delivered                      │
│      delivered_at: T2                       │
│                                             │
│  Delivery Duration = T2 - T0                │
│                                             │
└─────────────────────────────────────────────┘
```

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Type | DateTimeField | Store timestamp |
| null | True | Not immediately available |
| blank | True | Optional in forms |
| db_index | True | Analytics performance |
| auto_now | False | Manually set from webhook |
| auto_now_add | False | Not set at creation |

### Timestamp Conversion

```
Converting Webhook Timestamp:
┌─────────────────────────────────────────────┐
│                                             │
│  Webhook payload:                           │
│    "timestamp": "1640000000"                │
│                                             │
│  Conversion process:                        │
│    1. Extract timestamp (integer)           │
│    2. Convert to datetime object            │
│       dt = datetime.fromtimestamp(ts)       │
│    3. Make timezone-aware (UTC)             │
│       aware_dt = timezone.make_aware(dt)    │
│    4. Store in delivered_at field           │
│                                             │
└─────────────────────────────────────────────┘
```

### Delivery Analytics Queries

| Query Purpose | Implementation | Use Case |
|---------------|----------------|----------|
| Average delivery time | Calculate mean of delivery_duration | Performance monitoring |
| Slow deliveries | Filter where duration > threshold | Identify issues |
| Hourly distribution | Group by hour of delivered_at | Traffic patterns |
| Undelivered count | Count where delivered_at is null | Pending messages |
| Daily delivery rate | Count by date(delivered_at) | Trend analysis |

### Delivery Duration Calculation

```
Delivery Duration Calculation:
┌─────────────────────────────────────────────┐
│                                             │
│  def get_delivery_duration(self):           │
│      if not self.delivered_at:              │
│          return None                        │
│      return self.delivered_at - self.       │
│             created_at                      │
│                                             │
│  Returns: timedelta object                  │
│                                             │
│  Usage:                                     │
│    duration = log.get_delivery_duration()   │
│    seconds = duration.total_seconds()       │
│    minutes = seconds / 60                   │
│                                             │
└─────────────────────────────────────────────┘
```

### Delivery Performance Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Fast delivery | < 10 seconds | Excellent |
| Normal delivery | 10-60 seconds | Expected |
| Slow delivery | 1-5 minutes | Monitor |
| Very slow | > 5 minutes | Alert operations |
| Undelivered | > 1 hour | Investigate failure |

### Admin Display Formatting

| Format | Example | When Used |
|--------|---------|-----------|
| Relative | "2 minutes ago" | Recent deliveries |
| Absolute | "Jan 31, 2026 14:30" | Older deliveries |
| Null | "-" or "Not delivered" | Pending messages |
| Duration | "Delivered in 34s" | Combined with created_at |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Not before creation | delivered_at >= created_at | Delivery cannot precede creation |
| Not in future | delivered_at <= now() | Delivery cannot be in future |
| Status consistency | status in ['delivered', 'read'] | Delivery timestamp without status |
| Not with failure | status != 'failed' | Failed messages not delivered |

### Expected Outcome

- delivered_at timestamp field added to model
- Field properly configured as optional (null=True)
- Timezone-aware storage in UTC
- Delivery duration calculation method
- Analytics helper methods for delivery metrics
- Admin interface displays delivery timestamps
- Migration applied successfully
- Field ready for webhook updates

### Verification Checklist

- [ ] delivered_at DateTimeField added
- [ ] null=True and blank=True configured
- [ ] db_index=True applied
- [ ] Timezone awareness configured
- [ ] get_delivery_duration() method implemented
- [ ] has_been_delivered() method created
- [ ] Admin list_display includes delivered_at
- [ ] Admin date filter added
- [ ] Validation logic implemented
- [ ] Database migration created and applied
- [ ] Field functional in Django shell

---

## Task 77: Create read_at Field

### Overview

Add the read_at timestamp field to MessageLog model to record when a message was read (opened) by the recipient. This timestamp is set when Meta sends a "read" status webhook event, indicating the user has opened the chat and viewed the message. The read_at field enables read receipt tracking, engagement analytics, and understanding user behavior patterns.

Read receipts are valuable for understanding message engagement and user response times. Not all messaging scenarios provide read receipts (depends on recipient settings), so this field may remain null even for successfully delivered messages. The field helps measure true engagement beyond just delivery.

### Dependencies

- Task 76: Create delivered_at Field
- Understanding that read receipts are optional
- Knowledge of user privacy settings impact

### Instructions

1. **Add read_at field to model**
   - Add DateTimeField named `read_at`
   - Set null=True (not all messages are read, or receipts disabled)
   - Set blank=True for form validation
   - Field remains null until read event received

2. **Configure timezone awareness**
   - Ensure timezone-aware storage (UTC)
   - Convert webhook Unix timestamps to datetime
   - Consistent with delivered_at handling
   - Django timezone utilities handle conversion

3. **Add field indexing**
   - Set db_index=True for analytics
   - Enables queries for read rate analysis
   - Supports engagement reporting
   - Performance optimization for dashboards

4. **Create read time calculation method**
   - Add method `get_read_duration()` to calculate time from delivery to read
   - Calculate: read_at - delivered_at
   - Return timedelta object
   - Handle cases where either timestamp is null

5. **Add read check method**
   - Create `has_been_read()` method
   - Returns True if read_at is not null
   - Alternative to status == 'read' check
   - More explicit intent

6. **Handle webhook timestamp conversion**
   - Same process as delivered_at (Task 76)
   - Convert Unix timestamp to datetime
   - Ensure timezone awareness
   - Validate timestamp reasonableness

7. **Add engagement analytics helpers**
   - Create method for average read time (delivered → read)
   - Add method to calculate read rate percentage
   - Add method for read patterns by time of day
   - Support engagement analysis

8. **Configure admin display**
   - Add read_at to list_display
   - Format as human-readable relative time
   - Add filter for read status
   - Enable sorting by read time

9. **Add validation logic**
   - Ensure read_at is not before delivered_at
   - Validate read_at is not in future
   - Check read_at only set when status is read
   - Add to model's clean() method

10. **Create database migration**
    - Generate migration for read_at field
    - Review migration file
    - Apply to all tenant schemas
    - Verify field accessible

### Read Receipt Timeline

```
Message Read Timeline:
┌─────────────────────────────────────────────┐
│                                             │
│  T0: created_at                             │
│      Message created                        │
│      read_at: NULL                          │
│                                             │
│  T1: sent via API                           │
│      Status: sent                           │
│      read_at: NULL                          │
│                                             │
│  T2: delivered_at                           │
│      Status: delivered                      │
│      read_at: NULL                          │
│                                             │
│  T3: read_at                                │
│      Status: read                           │
│      read_at: T3                            │
│                                             │
│  Read Duration = T3 - T2                    │
│  (Time from delivery to read)               │
│                                             │
└─────────────────────────────────────────────┘
```

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Type | DateTimeField | Store timestamp |
| null | True | Read receipts optional |
| blank | True | Optional in forms |
| db_index | True | Analytics queries |
| auto_now | False | Set from webhook |
| auto_now_add | False | Not set at creation |

### Read Receipt Availability

| Scenario | read_at Value | Status | Reason |
|----------|---------------|--------|--------|
| User read message | T3 timestamp | read | Normal flow |
| User disabled read receipts | NULL | delivered | Privacy setting |
| Message not yet read | NULL | delivered | User hasn't opened |
| Message failed | NULL | failed | Never delivered |
| Read receipts not supported | NULL | delivered | WhatsApp Business limitation |

### Read Duration Calculation

```
Read Duration Calculation:
┌─────────────────────────────────────────────┐
│                                             │
│  def get_read_duration(self):               │
│      if not self.read_at:                   │
│          return None                        │
│      if not self.delivered_at:              │
│          return None                        │
│      return self.read_at - self.            │
│             delivered_at                    │
│                                             │
│  Returns: timedelta object                  │
│                                             │
│  Interpretation:                            │
│    Short duration: User actively waiting    │
│    Long duration: User checked later        │
│    NULL: Read receipt unavailable           │
│                                             │
└─────────────────────────────────────────────┘
```

### Engagement Metrics

| Metric | Calculation | Insight |
|--------|-------------|---------|
| Read rate | (read_count / delivered_count) * 100 | Engagement level |
| Average read time | Mean(read_at - delivered_at) | User responsiveness |
| Immediate reads | Count(read_duration < 1 min) | Urgency/attention |
| Delayed reads | Count(read_duration > 1 hour) | Non-urgent messages |
| Never read | Count(read_at is null AND delivered) | Low engagement |

### Read Time Patterns

| Pattern | Indicator | Business Insight |
|---------|-----------|------------------|
| Peak read hours | Hourly distribution of read_at | Optimal send times |
| Read latency | Average read duration | User responsiveness |
| Immediate engagement | Reads within 1 minute | High priority messages |
| Batch reading | Multiple reads same time | User checks periodically |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| After delivery | read_at >= delivered_at | Cannot read before delivery |
| Not in future | read_at <= now() | Read time cannot be future |
| Status consistency | status == 'read' | Read timestamp without read status |
| Delivery required | delivered_at is not null | Cannot read undelivered message |

### Privacy Considerations

| Aspect | Consideration | Implementation |
|--------|---------------|----------------|
| User privacy | Some users disable read receipts | Accept null read_at |
| Business context | B2B messages more likely to send receipts | Track by recipient type |
| UI display | Don't show "not read" judgmentally | Use neutral language |
| Analytics | Exclude null in read rate calculations | Accurate metrics |

### Admin Display

| Display Element | Format | Purpose |
|----------------|--------|---------|
| Read timestamp | Relative time | Quick understanding |
| Read duration | "Read in 3m 45s" | Engagement speed |
| Null handling | "Receipt not available" | Clarity |
| Color coding | Green for read | Visual distinction |

### Expected Outcome

- read_at timestamp field added to model
- Field properly configured as optional
- Timezone-aware UTC storage
- Read duration calculation method
- Engagement analytics helper methods
- Admin interface displays read timestamps
- Validation ensures data integrity
- Migration applied successfully

### Verification Checklist

- [ ] read_at DateTimeField added
- [ ] null=True and blank=True configured
- [ ] db_index=True applied
- [ ] Timezone awareness configured
- [ ] get_read_duration() method implemented
- [ ] has_been_read() method created
- [ ] Admin list_display includes read_at
- [ ] Admin filter for read status added
- [ ] Validation logic implemented
- [ ] Database migration created and applied
- [ ] Field functional in Django shell

---

## Task 78: Create failed_reason Field

### Overview

Add the failed_reason field to MessageLog model to store error details when message delivery fails. Meta includes error information in failed status webhooks, including error codes, titles, and messages. Storing this information enables failure analysis, automated retry logic, user notifications about specific failures, and troubleshooting delivery issues.

Understanding why messages fail is critical for improving delivery rates and user experience. Some failures are permanent (invalid phone number) while others are temporary (rate limit exceeded). The failed_reason field helps categorize failures, determine retry strategies, and provide meaningful error messages to users.

### Dependencies

- Task 77: Create read_at Field
- Understanding of Meta's error format
- Knowledge of common WhatsApp delivery errors

### Instructions

1. **Add failed_reason field to model**
   - Add TextField named `failed_reason`
   - Use TextField instead of CharField (error messages can be long)
   - Set null=True (only populated for failures)
   - Set blank=True for form validation

2. **Decide on storage format**
   - Store as JSON string for structured error data
   - Include error code, title, and message
   - Format: `{"code": 131047, "title": "...", "message": "..."}`
   - Enables parsing for automated retry logic

3. **Handle webhook error extraction**
   - Extract errors array from failed status webhook
   - Webhook contains errors list with code/title/message
   - May contain multiple errors (store all)
   - Serialize to JSON before storing

4. **Create error parsing method**
   - Add method `get_parsed_error()` to model
   - Parse JSON failed_reason back to dictionary
   - Handle cases where field is null or invalid JSON
   - Return structured error data for processing

5. **Add error categorization method**
   - Create method `get_failure_category()` to categorize errors
   - Categories: permanent, temporary, rate_limit, policy, unknown
   - Base categorization on error code
   - Helps determine if retry is appropriate

6. **Create retry eligibility method**
   - Add method `is_retryable()` based on error category
   - Temporary failures and rate limits are retryable
   - Permanent failures (invalid number) not retryable
   - Policy violations not retryable

7. **Add user-friendly error message method**
   - Create method `get_user_friendly_error()` for UI display
   - Convert technical errors to readable messages
   - Example: "Rate limit exceeded" → "Please try again in a few minutes"
   - Localize for multiple languages (Sinhala/English)

8. **Configure admin display**
   - Add failed_reason to list_display (truncated)
   - Add filter for failed messages
   - Display full error details in detail view
   - Add action to retry failed messages

9. **Add validation logic**
   - Ensure failed_reason only set when status is failed
   - Validate JSON format if present
   - Check failed_reason null when status not failed
   - Add to model's clean() method

10. **Create database migration**
    - Generate migration for failed_reason field
    - Review migration file
    - Apply to all tenant schemas
    - Verify field accessible

### Common WhatsApp Error Codes

| Error Code | Title | Category | Retryable |
|------------|-------|----------|-----------|
| 131047 | Re-engagement message | Temporary | Yes |
| 131026 | Message undeliverable | Permanent | No |
| 131056 | Rate limit exceeded | Rate Limit | Yes (after delay) |
| 131009 | Parameter value not valid | Permanent | No |
| 130429 | Rate limit hit | Rate Limit | Yes (after delay) |
| 133016 | Recipient phone number not valid | Permanent | No |
| 131031 | Not business initiated message | Policy | No |

### Error Storage Format

```
Failed Reason JSON Structure:
┌─────────────────────────────────────────────┐
│                                             │
│  Single Error:                              │
│  {                                          │
│    "code": 131047,                          │
│    "title": "Re-engagement message",        │
│    "message": "This message was not sent   │
│                because more than 24 hours  │
│                have passed..."              │
│  }                                          │
│                                             │
│  Multiple Errors:                           │
│  [                                          │
│    {                                        │
│      "code": 131026,                        │
│      "title": "Message undeliverable",      │
│      "message": "..."                       │
│    },                                       │
│    {                                        │
│      "code": 133016,                        │
│      "title": "Invalid phone number",       │
│      "message": "..."                       │
│    }                                        │
│  ]                                          │
│                                             │
└─────────────────────────────────────────────┘
```

### Error Categorization Logic

```
Error Category Mapping:
┌─────────────────────────────────────────────┐
│                                             │
│  TEMPORARY:                                 │
│    - 131047 (Re-engagement)                 │
│    - Network issues                         │
│    - Temporary server errors                │
│    Action: Retry after 24 hours             │
│                                             │
│  RATE_LIMIT:                                │
│    - 131056 (Rate limit exceeded)           │
│    - 130429 (Rate limit hit)                │
│    Action: Retry after cooldown             │
│                                             │
│  PERMANENT:                                 │
│    - 133016 (Invalid phone number)          │
│    - 131026 (Undeliverable)                 │
│    - 131009 (Invalid parameter)             │
│    Action: Do not retry, notify user        │
│                                             │
│  POLICY:                                    │
│    - 131031 (Not business initiated)        │
│    - Template not approved                  │
│    Action: Do not retry, review policy      │
│                                             │
└─────────────────────────────────────────────┘
```

### Retry Strategy

| Error Category | Retry? | Delay | Max Attempts | Action |
|----------------|--------|-------|--------------|--------|
| Temporary | Yes | 24 hours | 3 | Wait for 24-hour window |
| Rate Limit | Yes | 1 hour | 5 | Exponential backoff |
| Permanent | No | - | 0 | Notify user, don't retry |
| Policy | No | - | 0 | Review and fix issue |
| Unknown | No | - | 0 | Manual investigation |

### User-Friendly Error Messages

| Technical Error | User-Friendly Message (English) | User-Friendly Message (Sinhala) |
|----------------|----------------------------------|----------------------------------|
| Rate limit exceeded | Too many messages sent. Please try again in an hour. | පණිවිඩ ඕනෑවට වඩා යවා ඇත. පැයකින් නැවත උත්සහ කරන්න. |
| Invalid phone number | The phone number is invalid. Please check and try again. | දුරකතන අංකය වලංගු නැත. පරීක්ෂා කර නැවත උත්සහ කරන්න. |
| Re-engagement required | Message window expired. Template required for messages after 24h. | පණිවිඩ කවුළුව කල් ඉකුත් වී ඇත. පැය 24 කට පසුව ආකෘති පත්‍රයක් අවශ්‍යයි. |
| Message undeliverable | Message could not be delivered. | පණිවිඩය බෙදා හරිනු නොහැක. |

### Admin Interface Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Failed filter | Filter by status=failed | Quick access to failures |
| Error code filter | Filter by error code extracted | Group similar failures |
| Retry action | Bulk action to retry eligible | Operational efficiency |
| Error display | Truncated in list, full in detail | Readability |
| Export | Export failed messages with reasons | Analysis |

### Analytics Queries

```
Failure Analytics Queries:
┌─────────────────────────────────────────────┐
│                                             │
│  1. Count by error category:                │
│     Categorize all failed messages          │
│     Group by category                       │
│     Sort by frequency                       │
│                                             │
│  2. Retryable failures:                     │
│     Filter failed messages                  │
│     Check is_retryable() for each           │
│     Return eligible for retry               │
│                                             │
│  3. Top error codes:                        │
│     Extract error codes from failed_reason  │
│     Count occurrences                       │
│     Identify most common issues             │
│                                             │
│  4. Failure rate:                           │
│     (failed_count / total_count) * 100      │
│     Track over time                         │
│     Alert if above threshold                │
│                                             │
└─────────────────────────────────────────────┘
```

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Type | TextField | Store long error messages |
| null | True | Only for failed messages |
| blank | True | Optional field |
| db_index | False | Not commonly queried alone |
| default | None | Null by default |

### Expected Outcome

- failed_reason field added to store error details
- JSON storage format for structured error data
- Error parsing and categorization methods
- Retry eligibility determination logic
- User-friendly error message translation
- Admin interface displays failure information
- Analytics queries for failure patterns
- Migration applied successfully

### Verification Checklist

- [ ] failed_reason TextField added
- [ ] null=True and blank=True configured
- [ ] get_parsed_error() method implemented
- [ ] get_failure_category() method created
- [ ] is_retryable() method implemented
- [ ] get_user_friendly_error() method added
- [ ] Admin list_display shows failed_reason (truncated)
- [ ] Admin filter for failed messages
- [ ] Validation ensures consistency with status
- [ ] Database migration created and applied
- [ ] Field functional with JSON storage

---

## Summary

This document covered Tasks 69-78, establishing the webhook infrastructure and message logging system for WhatsApp Business API integration. The implementation includes:

**Webhook Infrastructure (Tasks 69-71):**
- POST endpoint for receiving webhook events from Meta
- GET endpoint for webhook verification during setup
- X-Hub-Signature-256 validation for request authentication

**Event Processing (Task 72):**
- Message status handler parsing webhook payloads
- Extraction of status updates from nested webhook structure
- Support for sent, delivered, read, and failed events

**MessageLog Model (Tasks 73-78):**
- Database model tracking message delivery lifecycle
- message_id field linking to WhatsApp message identifiers
- status field tracking progression through delivery states
- delivered_at and read_at timestamps for analytics
- failed_reason field storing detailed error information

The webhook system enables real-time delivery tracking, failure diagnostics, and engagement analytics. This foundation supports the status update handler, failure alerting, and asynchronous processing covered in the next document (Tasks 79-82).

