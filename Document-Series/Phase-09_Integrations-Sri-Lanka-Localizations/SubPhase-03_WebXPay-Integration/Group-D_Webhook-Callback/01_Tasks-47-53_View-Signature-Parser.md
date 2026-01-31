# Group-D: WebXPay Webhook Callback Implementation
## Document 01: View, Signature, and Parser (Tasks 47-53)

### Navigation Links
- **Previous Group:** [Group-C: Payment Request Checkout](../Group-C_Payment-Request-Checkout/02_Tasks-39-46_Cart-Submit-Token.md)
- **Next Document:** [02: Handlers, Update, and Verify (Tasks 54-60)](02_Tasks-54-60_Handlers-Update-Verify.md)
- **Phase Index:** [Phase-09: Integrations Sri Lanka Localizations](../../00_SUBPHASES_SUMMARY.md)
- **SubPhase Index:** [SubPhase-03: WebXPay Integration](../00_GROUPS_SUMMARY.md)

---

## Document Overview

### Purpose
This document implements secure WebXPay webhook callback handling with HMAC-SHA256 signature verification, payload parsing, and comprehensive security measures. The implementation ensures secure communication between WebXPay and our system while maintaining data integrity and preventing unauthorized access.

### Scope
- **Tasks Covered:** 47-53 (7 tasks)
- **Technology Stack:** Django 5.x, CSRF exemption, HMAC-SHA256, webhook security
- **Security Focus:** Signature verification, rate limiting, IP allowlist, security headers
- **Integration Points:** WebXPay webhook endpoints, payment status updates, transaction verification

### Task Distribution
```
Group-D: Webhook Callback (14 tasks total)
├── Document 01 (Tasks 47-53): View, Signature, Parser [7 tasks] ← Current
└── Document 02 (Tasks 54-60): Handlers, Update, Verify [7 tasks]
```

---

## Architecture Overview

### Webhook Flow Diagram
```
WebXPay Servers → HTTPS → Django App → Webhook View → Security Validation
                                                    ├── CSRF Exemption
                                                    ├── IP Allowlist Check
                                                    ├── Rate Limiting
                                                    ├── HMAC Verification
                                                    └── Payload Parsing
                                                            ↓
Status Mapping → Transaction Update → Response Generation → WebXPay Confirmation
```

### Security Architecture
```
Incoming Webhook Request
├── IP Address Validation (Allowlist)
├── Rate Limiting (Per IP)
├── Security Headers Validation
├── HMAC-SHA256 Signature Verification
├── Payload Structure Validation
├── Transaction Status Mapping
└── Secure Response Generation
```

---

## Task Breakdown

## Task 47: Create Webhook View Endpoint

### Objective
Implement a dedicated Django view endpoint to receive WebXPay webhook callbacks with proper URL routing and request handling.

### Implementation Requirements

#### View Structure Setup
1. **Create Webhook Views Module**
   - File: `integrations/webxpay/views/webhook_views.py`
   - Import required Django modules and WebXPay utilities
   - Implement class-based view inheritance from `View`
   - Set up proper logging for webhook events

2. **HTTP Method Support**
   - Accept POST requests only
   - Return 405 Method Not Allowed for other methods
   - Handle OPTIONS for CORS preflight if needed
   - Implement proper HTTP status code responses

3. **URL Configuration**
   - Create webhook-specific URL patterns
   - Use secure, unpredictable endpoint paths
   - Implement URL namespacing for WebXPay integration
   - Set up reverse URL resolution for testing

#### Request Handling Framework
1. **Request Processing Pipeline**
   - Parse incoming HTTP headers
   - Extract request body as raw bytes
   - Validate content-type expectations
   - Handle malformed requests gracefully

2. **Error Response Structure**
   - Return JSON-formatted error responses
   - Include appropriate HTTP status codes
   - Log error details for debugging
   - Maintain security through error message sanitization

### Technical Specifications
- **URL Pattern:** `/integrations/webxpay/webhook/callback/`
- **HTTP Method:** POST only
- **Content-Type:** `application/json`
- **Response Format:** JSON with status and message fields
- **Logging Level:** INFO for successful requests, ERROR for failures

---

## Task 48: Create CSRF Exemption

### Objective
Implement CSRF exemption for the WebXPay webhook endpoint since external services cannot provide CSRF tokens.

### Implementation Requirements

#### CSRF Exemption Setup
1. **Django CSRF Exemption**
   - Apply `@csrf_exempt` decorator to webhook view
   - Document security implications and mitigations
   - Ensure exemption applies only to webhook endpoints
   - Maintain CSRF protection for other endpoints

2. **Alternative Security Measures**
   - Implement HMAC signature verification as primary security
   - Use IP allowlist for additional protection
   - Apply rate limiting to prevent abuse
   - Monitor and log all exempt requests

#### Security Considerations
1. **Risk Mitigation**
   - Document why CSRF exemption is necessary
   - Explain alternative security measures
   - Implement comprehensive logging
   - Set up monitoring alerts for unusual activity

2. **Scope Limitation**
   - Apply exemption only to specific webhook views
   - Maintain CSRF protection for admin and user interfaces
   - Use middleware ordering to ensure proper processing
   - Implement view-level security checks

### Technical Specifications
- **Decorator:** `@csrf_exempt`
- **Scope:** WebXPay webhook views only
- **Alternative Security:** HMAC-SHA256 verification
- **Monitoring:** Log all CSRF-exempt requests
- **Documentation:** Security implications and mitigation strategies

---

## Task 49: Create HMAC Verification

### Objective
Implement HMAC-SHA256 signature verification to authenticate webhook requests from WebXPay servers and ensure payload integrity.

### Implementation Requirements

#### HMAC Implementation
1. **Signature Extraction**
   - Parse WebXPay signature from HTTP headers
   - Handle different signature header formats
   - Validate signature format and encoding
   - Extract timestamp for replay attack prevention

2. **HMAC Generation**
   - Use webhook secret key from environment variables
   - Generate HMAC-SHA256 hash of request payload
   - Include timestamp in signature calculation if required
   - Handle binary and hexadecimal encoding properly

#### Verification Process
1. **Signature Comparison**
   - Implement constant-time comparison for security
   - Handle case-insensitive comparisons if needed
   - Validate signature length and format
   - Return clear error messages for failed verification

2. **Security Enhancements**
   - Implement timestamp validation to prevent replay attacks
   - Set reasonable time window for valid requests (5 minutes)
   - Log all verification attempts and results
   - Rate limit failed verification attempts

### Security Flow Diagram
```
Incoming Request
├── Extract Signature from Headers
├── Get Request Body (raw bytes)
├── Retrieve Secret Key from Environment
├── Generate Expected HMAC-SHA256
├── Constant-Time Comparison
├── Timestamp Validation (if applicable)
└── Return Verification Result (True/False)
```

### Technical Specifications
- **Algorithm:** HMAC-SHA256
- **Header Name:** `X-WebXPay-Signature` or similar
- **Encoding:** Hexadecimal string
- **Time Window:** 5 minutes for timestamp validation
- **Comparison:** Constant-time to prevent timing attacks

---

## Task 50: Create Payload Parser

### Objective
Implement secure and robust parsing of WebXPay webhook payloads with validation, error handling, and data sanitization.

### Implementation Requirements

#### Payload Parsing Structure
1. **JSON Parsing**
   - Parse webhook payload as JSON
   - Handle malformed JSON gracefully
   - Validate required fields presence
   - Implement field type validation

2. **Data Extraction**
   - Extract transaction ID, status, and amount
   - Parse customer and order information
   - Handle optional fields with default values
   - Validate data formats and constraints

#### Validation Framework
1. **Schema Validation**
   - Define expected payload schema
   - Validate field types and formats
   - Check required vs optional fields
   - Implement nested object validation

2. **Business Logic Validation**
   - Validate transaction amounts and currencies
   - Check status values against allowed options
   - Verify order ID format and existence
   - Validate timestamp formats and ranges

#### Error Handling
1. **Parse Error Management**
   - Handle JSON decode errors
   - Manage missing required fields
   - Process invalid data types
   - Return structured error responses

2. **Data Sanitization**
   - Escape special characters in string fields
   - Validate numeric ranges and precision
   - Sanitize customer information
   - Remove potentially harmful data

### Payload Structure Example
```json
Expected WebXPay Webhook Payload:
{
    "transaction_id": "string",
    "order_id": "string",
    "status": "completed|failed|pending",
    "amount": "decimal",
    "currency": "LKR",
    "timestamp": "ISO 8601",
    "customer": {
        "email": "email",
        "phone": "phone_number"
    },
    "payment_method": "string"
}
```

### Technical Specifications
- **Input Format:** JSON string
- **Encoding:** UTF-8
- **Validation Library:** Django REST Framework serializers or custom validators
- **Error Response:** JSON with field-specific error messages
- **Sanitization:** HTML entity encoding for strings

---

## Task 51: Create Status Mapping

### Objective
Implement comprehensive mapping between WebXPay payment statuses and internal system status codes with proper state management.

### Implementation Requirements

#### Status Mapping Framework
1. **Status Dictionary Creation**
   - Map WebXPay status codes to internal statuses
   - Handle edge cases and unknown statuses
   - Implement bidirectional mapping if needed
   - Document all status meanings and implications

2. **State Transition Validation**
   - Validate allowed status transitions
   - Prevent invalid state changes
   - Log all status change attempts
   - Handle concurrent status updates

#### Mapping Implementation
1. **Status Categories**
   - **Successful:** completed, settled, confirmed
   - **Failed:** failed, rejected, cancelled
   - **Pending:** pending, processing, authorized
   - **Unknown:** Handle unmapped statuses safely

2. **Business Logic Integration**
   - Trigger appropriate business logic for each status
   - Update order status in ERP system
   - Send customer notifications for status changes
   - Handle inventory updates for confirmed payments

#### Advanced Status Handling
1. **Status History Tracking**
   - Maintain status change history
   - Record timestamps for all transitions
   - Track status change sources and reasons
   - Implement audit trail for compliance

2. **Error Recovery**
   - Handle temporary status inconsistencies
   - Implement retry logic for failed updates
   - Provide manual override capabilities
   - Alert administrators for critical status issues

### Status Mapping Table
```
WebXPay Status → Internal Status → Action Required
─────────────────────────────────────────────────
completed      → paid           → Complete order, update inventory
failed         → failed         → Cancel order, notify customer
pending        → pending        → Monitor, no immediate action
cancelled      → cancelled      → Cancel order, release inventory
refunded       → refunded       → Process refund, update records
disputed       → disputed       → Flag for review, freeze funds
```

### Technical Specifications
- **Mapping Storage:** Python dictionary or database table
- **Default Handling:** Map unknown statuses to 'pending' with alerts
- **Validation:** Check current status before applying new status
- **Logging:** Record all status mapping operations
- **Performance:** Cache frequently accessed mappings

---

## Task 52: Create Security Headers

### Objective
Implement comprehensive security headers for webhook responses to enhance security posture and protect against various web vulnerabilities.

### Implementation Requirements

#### Security Headers Implementation
1. **Response Security Headers**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security: max-age=31536000`
   - `Content-Security-Policy: default-src 'none'`

2. **Custom Headers**
   - Add webhook-specific identification headers
   - Include response timestamp
   - Add correlation ID for request tracking
   - Implement signature for response verification

#### Header Management
1. **Header Middleware**
   - Create custom middleware for webhook security headers
   - Apply headers only to webhook endpoints
   - Allow header customization through settings
   - Implement header validation and sanitization

2. **Response Enhancement**
   - Add headers to all webhook responses
   - Include security metadata
   - Implement response fingerprinting
   - Add rate limiting information

#### Advanced Security Features
1. **IP-Based Headers**
   - Add client IP information (for logging)
   - Include geolocation data if available
   - Add suspicious activity flags
   - Implement IP reputation scoring

2. **Monitoring Headers**
   - Include request processing time
   - Add authentication status information
   - Include rate limiting status
   - Add system health indicators

### Security Headers Configuration
```python
WEBHOOK_SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'none'",
    'Referrer-Policy': 'no-referrer',
    'X-WebXPay-Response': 'webhook-v1',
    'X-Rate-Limit-Remaining': '{{remaining_requests}}',
    'X-Response-Time': '{{processing_time_ms}}ms'
}
```

### Technical Specifications
- **Header Application:** Middleware-based for consistent application
- **Customization:** Environment-specific header values
- **Monitoring:** Log header application and any failures
- **Compliance:** Follow OWASP security header recommendations
- **Performance:** Minimal overhead for header addition

---

## Task 53: Create Rate Limiting

### Objective
Implement comprehensive rate limiting for WebXPay webhook endpoints to prevent abuse, ensure service availability, and maintain system performance.

### Implementation Requirements

#### Rate Limiting Framework
1. **Rate Limiting Strategy**
   - Implement per-IP address limiting
   - Use sliding window or token bucket algorithm
   - Set reasonable limits based on expected traffic
   - Provide burst capacity for legitimate spikes

2. **Storage Backend**
   - Use Redis for distributed rate limiting
   - Implement fallback to memory-based limiting
   - Set appropriate key expiration times
   - Handle storage backend failures gracefully

#### Rate Limiting Implementation
1. **Limiting Rules**
   - **Per IP:** 60 requests per minute
   - **Per Endpoint:** 1000 requests per minute total
   - **Burst Allowance:** 10 requests in 10 seconds
   - **Blocked Duration:** 5 minutes for exceeded limits

2. **Whitelist Management**
   - Allow WebXPay official IP addresses unlimited access
   - Implement emergency override mechanisms
   - Support dynamic whitelist updates
   - Log all whitelist usage

#### Advanced Rate Limiting Features
1. **Adaptive Limiting**
   - Adjust limits based on system load
   - Implement time-of-day variations
   - Use machine learning for anomaly detection
   - Support manual limit adjustments

2. **Monitoring and Alerting**
   - Track rate limiting metrics
   - Alert on unusual traffic patterns
   - Monitor blocked requests and patterns
   - Generate rate limiting reports

#### Rate Limiting Responses
1. **Limit Exceeded Responses**
   - Return HTTP 429 Too Many Requests
   - Include Retry-After header with wait time
   - Provide clear error messages
   - Log rate limiting events

2. **Rate Limiting Headers**
   - `X-RateLimit-Limit`: Request limit per time window
   - `X-RateLimit-Remaining`: Requests remaining in current window
   - `X-RateLimit-Reset`: Time when the rate limit resets
   - `Retry-After`: Seconds to wait before next request

### Rate Limiting Configuration
```python
WEBHOOK_RATE_LIMITING = {
    'per_ip': {
        'requests': 60,
        'window': 60,  # seconds
        'burst': 10
    },
    'global': {
        'requests': 1000,
        'window': 60,
        'burst': 50
    },
    'blocked_duration': 300,  # 5 minutes
    'whitelist_ips': [
        # WebXPay server IPs
    ]
}
```

### Technical Specifications
- **Algorithm:** Token bucket with sliding window
- **Storage:** Redis with memory fallback
- **Granularity:** Per-IP and global limits
- **Response:** HTTP 429 with appropriate headers
- **Monitoring:** Comprehensive metrics and alerting

---

## Integration Guidelines

### Implementation Sequence
1. **Task 47:** Set up basic webhook view structure
2. **Task 48:** Apply CSRF exemption with documentation
3. **Task 49:** Implement HMAC signature verification
4. **Task 50:** Create robust payload parser with validation
5. **Task 51:** Implement comprehensive status mapping
6. **Task 52:** Add security headers for response protection
7. **Task 53:** Implement rate limiting for abuse prevention

### Testing Strategy
1. **Unit Testing**
   - Test each component independently
   - Mock external dependencies
   - Validate error handling paths
   - Test security boundary conditions

2. **Integration Testing**
   - Test complete webhook flow
   - Validate security measures
   - Test rate limiting behavior
   - Verify status mapping accuracy

### Security Considerations
1. **Input Validation**
   - Validate all incoming data
   - Sanitize user-provided content
   - Check for injection attempts
   - Implement strict type checking

2. **Error Handling**
   - Never expose sensitive information
   - Log security events appropriately
   - Implement proper error responses
   - Monitor for attack patterns

### Performance Optimization
1. **Caching Strategy**
   - Cache HMAC verification results
   - Cache status mapping lookups
   - Optimize database queries
   - Use connection pooling

2. **Monitoring**
   - Track response times
   - Monitor resource usage
   - Alert on performance degradation
   - Implement performance benchmarks

---

## Technical Dependencies

### Required Packages
- `Django >= 5.0`
- `djangorestframework`
- `redis` (for rate limiting)
- `cryptography` (for HMAC operations)

### Environment Variables
```python
WEBXPAY_WEBHOOK_SECRET_KEY=your_webhook_secret_key
WEBXPAY_WEBHOOK_TIMEOUT=300  # 5 minutes
RATE_LIMIT_STORAGE_URL=redis://localhost:6379/1
```

### Database Requirements
- Rate limiting storage (Redis recommended)
- Webhook event logging table
- Transaction status history table

---

## Next Steps

### Document 02 Preview
The next document (Tasks 54-60) will cover:
- **Task 54:** Payment Status Update Handlers
- **Task 55:** Order Processing Integration
- **Task 56:** Customer Notification System
- **Task 57:** Inventory Update Triggers
- **Task 58:** Audit Trail Implementation
- **Task 59:** Error Recovery Mechanisms
- **Task 60:** Webhook Response Verification

### Integration Points
- Connect webhook processor to ERP order management
- Integrate with customer notification system
- Link to inventory management for stock updates
- Connect to audit and compliance tracking

---

## Documentation Metadata

- **Document ID:** Phase-09-SubPhase-03-Group-D-Doc-01
- **Version:** 1.0.0
- **Last Updated:** January 31, 2026
- **Tasks Covered:** 47-53 (7 tasks)
- **Estimated Implementation Time:** 16-20 hours
- **Complexity Level:** High (Security and Integration Focus)
- **Dependencies:** Redis, cryptography, Django 5.x
- **Testing Requirements:** Unit tests, integration tests, security tests