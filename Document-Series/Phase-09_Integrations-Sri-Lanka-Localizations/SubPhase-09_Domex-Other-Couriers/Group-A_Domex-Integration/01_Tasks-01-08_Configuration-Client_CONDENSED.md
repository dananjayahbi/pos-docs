# Tasks 01-08: Configuration and Client Setup

> **Phase:** 09 | **SubPhase:** 09 | **Group:** A | **Document:** 01 of 03

## Navigation
- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md) | **→ Next:** [02_Tasks-09-15_Provider-Waybill.md](02_Tasks-09-15_Provider-Waybill.md)

## Document Overview
Foundational configuration and client setup for Domex: constants, settings, API keys, tenant config model, HTTP client, authentication, request handling, and error handling.

### Tasks Summary
| Task | Name | Time | Task | Name | Time |
|------|------|------|------|------|------|
| 01 | Constants | 15m | 05 | Client Class | 60m |
| 02 | Settings | 20m | 06 | Authentication | 30m |
| 03 | API Key | 15m | 07 | Request Handler | 50m |
| 04 | Config Model | 45m | 08 | Error Handling | 45m |

---

## Task 01: Create Domex Constants

**Overview:** Create constants module with API URLs, endpoints, timeouts, service types, and status mappings.

**Dependencies:** SubPhase-08 complete, shipping app structure ready

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/constants.py`
2. Define base URLs: DOMEX_SANDBOX_BASE_URL, DOMEX_PRODUCTION_BASE_URL
3. Define endpoint paths: CREATE_SHIPMENT_PATH, GET_RATES_PATH, TRACK_SHIPMENT_PATH, etc.
4. Define timeouts: REQUEST_TIMEOUT=30, MAX_RETRIES=3, RETRY_DELAY=1
5. Define service types: SERVICE_STANDARD, SERVICE_EXPRESS, SERVICE_SAME_DAY
6. Define status mappings: STATUS_PENDING, STATUS_DELIVERED, etc.
7. Add API version constant

**Key Constants:**
- **URLs:** Sandbox (sandbox-api.domex.lk/v1) vs Production (api.domex.lk/v1)
- **Endpoints:** /shipments, /rates, /track/{waybill}, /waybill/{id}, /labels/{id}, /pickup
- **Services:** standard (2-3 days), express (1-2 days), same_day
- **Status:** PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, CANCELLED

**Verification:** ✓ constants.py created ✓ URLs defined ✓ Endpoints listed ✓ Timeouts set ✓ Service types ✓ Status mappings

---

## Task 02: Create Domex Settings

**Overview:** Django settings module for environment-specific Domex configuration.

**Dependencies:** Task 01 complete

**Instructions:**
1. Create `backend/config/settings/domex.py`
2. Import constants from Task 01
3. Define DOMEX_ENVIRONMENT (default: "sandbox", choices: sandbox/production)
4. Compute DOMEX_BASE_URL based on environment
5. Define DOMEX_API_KEY (from env var, required in production)
6. Define timeouts: DOMEX_REQUEST_TIMEOUT (default: 30)
7. Define retries: DOMEX_MAX_RETRIES (default: 3)
8. Define feature flags: ENABLE_COD, ENABLE_PICKUP_SCHEDULING, ENABLE_WEBHOOK (all True)
9. Define logging: LOG_REQUESTS, LOG_RESPONSES (both False in prod)
10. Import in main settings file

**Key Settings:** DOMEX_ENVIRONMENT → DOMEX_BASE_URL | DOMEX_API_KEY | TIMEOUT=30 | RETRIES=3 | Feature flags

**Validation:** Environment must be sandbox/production, API key required in prod, timeout positive

**Verification:** ✓ domex.py created ✓ Environment switching ✓ API key placeholder ✓ Timeouts ✓ Feature flags ✓ Imported to main

---

## Task 03: Create Domex API Key

**Overview:** Configure API key in environment variables for secure authentication.

**Dependencies:** Task 02 complete

**Instructions:**
1. Add DOMEX_API_KEY to `.env.example` with placeholder
2. Create/update `.env` with sandbox API key (not committed)
3. Settings read DOMEX_API_KEY via os.environ
4. Validate: not empty, min length 20, required in production
5. Document acquisition process (contact Domex sales/support)
6. Production: use AWS Secrets Manager or Vault
7. Ensure .env in .gitignore, never log API key

**Security:** Never hardcode | Not in git | Rotate every 90 days | Never log

**Validation:** Check exists, not empty, min length, format. Error in production if missing.

**Verification:** ✓ Added to .env.example ✓ Settings read from env ✓ Validation ✓ .env in gitignore ✓ Docs added ✓ Never logged

---

## Task 04: Create DomexConfig Model

**Overview:** Tenant-specific Domex configuration model with encrypted credentials.

**Dependencies:** Task 02, Multi-tenancy Phase 02, Base models Phase 03

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/config.py`
2. Import Django models, tenant models, base mixins
3. Define DomexConfig model: inherit base model + TimestampMixin + SoftDeleteMixin
4. Add tenant ForeignKey (unique, CASCADE/PROTECT)
5. Add credentials: api_key (encrypted), api_secret (encrypted), merchant_id
6. Add environment field (choices: sandbox/production, default: sandbox)
7. Add operational: is_active, default_service_type, enable_cod, enable_pickup_scheduling
8. Add pickup: default_pickup_address, contact_name, contact_phone
9. Add webhook: webhook_url, webhook_secret (encrypted), enable_webhooks
10. Add methods: get_base_url(), is_configured(), get_credentials(), validate_credentials()
11. Add validators: require api_key when active, pickup fields when scheduling enabled
12. Add display properties: masked_api_key, __str__()

**Key Fields:** tenant (FK) | api_key (encrypted) | environment | is_active | COD/pickup flags | webhook config

**Methods:** get_base_url() → URL based on env | is_configured() → bool | get_credentials() → decrypted dict

**Validation:** API key required when active | Pickup address when scheduling enabled | Webhook secret when webhooks enabled

**Verification:** ✓ config.py created ✓ Model defined ✓ All fields ✓ Methods ✓ Validators ✓ Migration

---

## Task 05: Create DomexClient Class

**Overview:** HTTP client wrapper for Domex API communication with session management.

**Dependencies:** Task 04 complete

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/client.py`
2. Import requests, logging, json, DomexConfig, constants
3. Define DomexClient class with __init__(config: DomexConfig)
4. Initialize: store config, set base_url from config.get_base_url(), create requests.Session()
5. Configure session: default headers (Content-Type, Accept, User-Agent), retry strategy, timeout
6. Implement _get_headers(custom_headers) → build headers with auth (Task 06)
7. Implement _build_url(endpoint) → combine base_url + endpoint
8. Implement _log_request(method, url, data) → log if enabled (mask sensitive)
9. Implement _log_response(response, duration) → log response details
10. Implement __enter__/__exit__ for context manager
11. Implement close() for cleanup

**Session Config:** Pool size=10 | Max retries=3 | Backoff=0.3 | Retry on 429,500,502,503,504

**Headers:** Content-Type: application/json | Accept: application/json | User-Agent: LankaCommerce-ERP/1.0

**Context Manager:** Use with DomexClient(config) as client: ... for auto cleanup

**Verification:** ✓ client.py created ✓ __init__ ✓ Session initialized ✓ Headers ✓ URL building ✓ Logging ✓ Context manager

---

## Task 06: Create Authentication

**Overview:** Add API key authentication to request headers.

**Dependencies:** Task 05 complete

**Instructions:**
1. Review Domex auth method (API key in header: X-API-Key)
2. Update _get_headers() in DomexClient:
   - Get decrypted API key: config.get_credentials()
   - Add to headers: {'X-API-Key': api_key}
   - Handle missing key: raise AuthenticationError
3. Implement validate_authentication(): test request to verify credentials
4. Handle 401 errors: raise AuthenticationError with message
5. Mask API key in logs: show only last 4 chars (****1234)
6. Create test_connection(): call minimal endpoint to verify auth

**Auth Flow:** Get key from config → Decrypt → Add to headers (X-API-Key) → Send request → Handle 401/403

**Security:** Never log actual key | Mask in logs | Don't include in error messages

**Verification:** ✓ _get_headers updated ✓ API key added ✓ 401 handling ✓ test_connection() ✓ Key masking ✓ Security followed

---

## Task 07: Create Request Handler

**Overview:** Implement HTTP methods (GET, POST, PUT, DELETE) in DomexClient.

**Dependencies:** Task 06 complete

**Instructions:**
1. Implement main request(method, endpoint, data=None, params=None) method
2. Build URL: use _build_url(endpoint)
3. Prepare headers: call _get_headers() with auth
4. Prepare body: JSON encode data if present
5. Log request: call _log_request() if enabled
6. Execute: session.request(method, url, headers=headers, json=data, params=params, timeout=timeout)
7. Handle exceptions: wrap ConnectionError, Timeout in custom exceptions
8. Log response: call _log_response() with duration
9. Parse: check status code, parse JSON, validate structure
10. Implement convenience methods: get(), post(), put(), delete() wrapping request()
11. Add response validation: check expected structure
12. Handle pagination: detect and extract pagination metadata if present

**Method Signatures:**
- `request(method, endpoint, data=None, params=None)` → dict
- `get(endpoint, params=None)` → dict
- `post(endpoint, data)` → dict
- `put(endpoint, data)` → dict
- `delete(endpoint)` → dict

**Response Handling:**
- 200-299: Parse JSON and return
- 400-499: Raise DomexClientError
- 500-599: Raise DomexServerError (retry if configured)
- Timeout: Raise DomexTimeoutError
- Connection: Raise DomexConnectionError

**Verification:** ✓ request() implemented ✓ URL building ✓ Headers ✓ Body encoding ✓ Logging ✓ GET/POST/PUT/DELETE ✓ JSON parsing ✓ Error handling ✓ Retry logic

---

## Task 08: Create Error Handling

**Overview:** Comprehensive exception hierarchy and error parsing for all failure scenarios.

**Dependencies:** Task 07 complete

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/exceptions.py`
2. Define base: DomexError (inherits Exception)
3. Define auth: DomexAuthenticationError (401), DomexPermissionError (403)
4. Define client: DomexClientError (400-499), DomexValidationError, DomexNotFoundError, DomexConflictError, DomexRateLimitError (429)
5. Define server: DomexServerError (500-599), DomexServiceUnavailableError, DomexGatewayError
6. Define network: DomexConnectionError, DomexTimeoutError
7. Each exception: error_code, message, status_code, details attributes
8. Implement parse_error_response(response) → extract error info from API response
9. Update request() in DomexClient: check status codes, parse errors, raise appropriate exceptions
10. Add error context: request details, response details, timestamps
11. Implement error logging: appropriate severity, mask sensitive data
12. Add retry logic: retryable errors (timeout, connection, 429, 5xx) vs non-retryable (4xx)

**Exception Hierarchy:**
```
DomexError (base)
├── DomexAuthenticationError (401)
├── DomexPermissionError (403)
├── DomexClientError (400-499)
│   ├── DomexValidationError (400)
│   ├── DomexNotFoundError (404)
│   ├── DomexConflictError (409)
│   └── DomexRateLimitError (429)
├── DomexServerError (500-599)
└── DomexNetworkError
    ├── DomexConnectionError
    └── DomexTimeoutError
```

**Error Response Parsing:** Extract error_code, message, field_errors from Domex API response format

**Retry Strategy:** Timeout/Connection/Rate Limit/Server errors → retry with exponential backoff | Client errors → no retry

**Verification:** ✓ exceptions.py created ✓ All exception classes ✓ parse_error_response() ✓ Request handler integration ✓ Error context ✓ Logging ✓ Retry logic

---

## Summary

**Completed:** 8 tasks establishing configuration and client infrastructure

**Deliverables:**
- Configuration Layer: Constants, settings, API keys
- Data Model: DomexConfig for multi-tenant support
- Client Infrastructure: HTTP client with session management
- Authentication: Secure API key handling
- Request Handling: Complete HTTP operations
- Error Management: Exception hierarchy and parsing

**Next:** Proceed to [02_Tasks-09-15_Provider-Waybill.md](02_Tasks-09-15_Provider-Waybill.md) for DomexProvider implementation

---

**Total Tasks:** 8 | **Est. Time:** 4.5 hours | **Lines:** ~900
