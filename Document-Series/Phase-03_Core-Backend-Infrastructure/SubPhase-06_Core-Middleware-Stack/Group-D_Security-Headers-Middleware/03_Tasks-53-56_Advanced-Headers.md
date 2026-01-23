# Tasks 53-56: Advanced Headers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** D - Security Headers Middleware  
> **Document:** 03 of 04  
> **Tasks Covered:** 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-51-52_Content-Security-Policy.md](02_Tasks-51-52_Content-Security-Policy.md)
- **→ Next Document:** [04_Tasks-57-58_Registration-Testing.md](04_Tasks-57-58_Registration-Testing.md)

---

## Document Overview

This document covers advanced security headers including Permissions-Policy for browser feature control, Strict-Transport-Security (HSTS) for HTTPS enforcement, and X-Request-ID for request tracking.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 53 | Add Permissions-Policy | Medium |
| 54 | Add Strict-Transport-Security | Medium |
| 55 | Configure HSTS Age | Simple |
| 56 | Add X-Request-ID | Simple |

---

## Task 53: Add Permissions-Policy

### Overview
Add the Permissions-Policy header (formerly Feature-Policy) to control which browser features and APIs can be used. This prevents malicious scripts from accessing sensitive features like camera, microphone, or geolocation.

### Dependencies
- Task 52: Configure CSP Directives

### Instructions

1. **Add `_get_permissions_policy` method**
   - Create helper method to generate policy string
   - List restricted features
   - Set allowlist for each feature
   - Return complete policy value

2. **Update `_add_security_headers` method**
   - Call `_get_permissions_policy()`
   - Set Permissions-Policy header
   - Add inline comment

3. **Implement feature restrictions**
   - Disable geolocation
   - Disable camera
   - Disable microphone
   - Restrict payment APIs
   - Restrict other sensitive features

### Implementation

```python
def _add_security_headers(self, request, response):
    """
    Add all security headers to the response.
    
    This method adds various security headers based on configuration
    and environment settings.
    
    Args:
        request: HttpRequest object
        response: HttpResponse object
        
    Returns:
        HttpResponse with security headers added
    """
    # Prevent MIME type sniffing
    # Forces browser to respect Content-Type header
    response['X-Content-Type-Options'] = 'nosniff'
    
    # Prevent clickjacking attacks
    # Controls if page can be displayed in frame/iframe
    frame_options = getattr(settings, 'X_FRAME_OPTIONS', 'DENY')
    response['X-Frame-Options'] = frame_options
    
    # Enable XSS filter and block page if attack detected
    # Activates browser's built-in XSS protection
    response['X-XSS-Protection'] = '1; mode=block'
    
    # Control referrer information sent with requests
    # Protects user privacy and prevents information leakage
    response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Content Security Policy - control resource loading
    # Primary defense against XSS and data injection attacks
    response['Content-Security-Policy'] = self._get_csp_header()
    
    # Permissions Policy - control browser features and APIs
    # Prevents unauthorized access to sensitive device features
    response['Permissions-Policy'] = self._get_permissions_policy()
    
    # Additional headers will be added in subsequent tasks
    
    return response

def _get_permissions_policy(self):
    """
    Generate Permissions-Policy header value.
    
    Permissions-Policy (formerly Feature-Policy) controls which browser
    features and APIs can be used by the page and embedded iframes.
    
    Features are restricted to prevent malicious scripts from:
    - Accessing camera/microphone
    - Getting geolocation data
    - Using payment APIs
    - Accessing other sensitive device features
    
    Returns:
        str: Complete Permissions-Policy header value
    """
    # Restrict sensitive browser features
    # Format: feature=(allowlist)
    # () = nobody can use (most restrictive)
    # (self) = only same origin can use
    # * = everyone can use (least restrictive)
    
    policies = [
        "geolocation=()",      # No geolocation access
        "microphone=()",       # No microphone access
        "camera=()",           # No camera access
        "payment=()",          # No payment API access
        "usb=()",              # No USB device access
        "magnetometer=()",     # No magnetometer access
        "gyroscope=()",        # No gyroscope access
        "accelerometer=()",    # No accelerometer access
    ]
    
    return ", ".join(policies)
```

### Permissions-Policy Features
| Feature | Default | Purpose |
|---------|---------|---------|
| **geolocation** | () | Block location tracking |
| **camera** | () | Block camera access |
| **microphone** | () | Block audio recording |
| **payment** | () | Block payment request API |
| **usb** | () | Block USB device access |
| **magnetometer** | () | Block magnetometer sensor |
| **gyroscope** | () | Block gyroscope sensor |
| **accelerometer** | () | Block accelerometer sensor |

### Allowlist Syntax
| Syntax | Meaning | Example |
|--------|---------|---------|
| **()** | No one can use | `camera=()` |
| **(self)** | Only same origin | `camera=(self)` |
| **(origin)** | Specific origin | `camera=(https://trusted.com)` |
| **\*** | Everyone can use | `camera=*` |

### Feature Categories
1. **Sensor Features:**
   - accelerometer, gyroscope, magnetometer
   - Used for device orientation
   - Privacy concern: Can track user behavior

2. **Media Features:**
   - camera, microphone
   - User privacy critical
   - Requires explicit permission

3. **Location Features:**
   - geolocation
   - Highly sensitive personal data
   - Requires explicit permission

4. **Payment Features:**
   - payment
   - Payment Request API
   - Security critical

### Why Block By Default?
1. **Security:** Malicious scripts can't request access
2. **Privacy:** Prevents tracking and fingerprinting
3. **Explicit Enablement:** Features enabled only when needed
4. **Iframe Protection:** Embedded content can't access features

### Enabling Features When Needed
```python
# If your app needs camera/microphone:
policies = [
    "geolocation=()",
    "microphone=(self)",    # Allow same-origin
    "camera=(self)",        # Allow same-origin
    "payment=()",
]

# If specific origin needs access:
policies = [
    "camera=(self https://trusted-video-cdn.com)",
]

# If feature needed for all:
policies = [
    "geolocation=*",  # Not recommended
]
```

### Additional Restrictable Features
```python
# Full list of features that can be controlled:
advanced_policies = [
    "geolocation=()",
    "microphone=()",
    "camera=()",
    "payment=()",
    "usb=()",
    "magnetometer=()",
    "gyroscope=()",
    "accelerometer=()",
    "ambient-light-sensor=()",
    "autoplay=()",
    "encrypted-media=()",
    "fullscreen=(self)",      # Allow fullscreen for videos
    "picture-in-picture=()",
    "screen-wake-lock=()",
    "web-share=()",
]
```

### Browser Support
| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | Yes (v88+) | Full support |
| Edge | Yes (v88+) | Chromium-based |
| Firefox | Partial | Limited features |
| Safari | Partial | Limited features |
| IE | No | Not supported |

### Expected Outcome
- `_get_permissions_policy` method implemented
- Permissions-Policy header added
- Sensitive features restricted
- Privacy protection enhanced

### Verification Checklist
- [ ] `_get_permissions_policy` method created
- [ ] Method returns properly formatted policy string
- [ ] Permissions-Policy header added in `_add_security_headers`
- [ ] At least 8 features restricted
- [ ] Features joined with ", "
- [ ] Inline comment explains purpose

---

## Task 54: Add Strict-Transport-Security

### Overview
Add the Strict-Transport-Security (HSTS) header to force browsers to use HTTPS. This header should only be sent when HTTPS is enabled.

### Dependencies
- Task 53: Add Permissions-Policy

### Instructions

1. **Add `_get_hsts_header` method**
   - Create helper method to generate HSTS value
   - Include max-age directive
   - Include includeSubDomains directive
   - Include preload directive
   - Return complete HSTS value

2. **Update `_add_security_headers` method**
   - Check if HTTPS is enabled
   - Call `_get_hsts_header()` only in production
   - Set Strict-Transport-Security header
   - Add inline comment

3. **Add HTTPS detection**
   - Check settings.SECURE_SSL_REDIRECT
   - Or check request.is_secure()
   - Only add HSTS if HTTPS is used

### Implementation

```python
def _add_security_headers(self, request, response):
    """
    Add all security headers to the response.
    
    This method adds various security headers based on configuration
    and environment settings.
    
    Args:
        request: HttpRequest object
        response: HttpResponse object
        
    Returns:
        HttpResponse with security headers added
    """
    # Prevent MIME type sniffing
    # Forces browser to respect Content-Type header
    response['X-Content-Type-Options'] = 'nosniff'
    
    # Prevent clickjacking attacks
    # Controls if page can be displayed in frame/iframe
    frame_options = getattr(settings, 'X_FRAME_OPTIONS', 'DENY')
    response['X-Frame-Options'] = frame_options
    
    # Enable XSS filter and block page if attack detected
    # Activates browser's built-in XSS protection
    response['X-XSS-Protection'] = '1; mode=block'
    
    # Control referrer information sent with requests
    # Protects user privacy and prevents information leakage
    response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Content Security Policy - control resource loading
    # Primary defense against XSS and data injection attacks
    response['Content-Security-Policy'] = self._get_csp_header()
    
    # Permissions Policy - control browser features and APIs
    # Prevents unauthorized access to sensitive device features
    response['Permissions-Policy'] = self._get_permissions_policy()
    
    # Strict-Transport-Security - force HTTPS
    # Only add in production with HTTPS enabled
    if self._should_add_hsts(request):
        response['Strict-Transport-Security'] = self._get_hsts_header()
    
    # Additional headers will be added in subsequent tasks
    
    return response

def _should_add_hsts(self, request):
    """
    Check if HSTS header should be added.
    
    HSTS should only be added when:
    1. Not in DEBUG mode (production)
    2. HTTPS is enabled (SSL redirect configured)
    3. Request is secure (optional check)
    
    Args:
        request: HttpRequest object
        
    Returns:
        bool: True if HSTS should be added
    """
    # Don't add HSTS in development
    if getattr(settings, 'DEBUG', False):
        return False
    
    # Check if HTTPS is configured
    ssl_redirect = getattr(settings, 'SECURE_SSL_REDIRECT', False)
    
    return ssl_redirect

def _get_hsts_header(self):
    """
    Generate Strict-Transport-Security header value.
    
    HSTS tells browsers to only access the site via HTTPS.
    Once set, browser will automatically upgrade HTTP to HTTPS
    for the specified duration.
    
    Directives:
    - max-age: Duration in seconds to remember HTTPS-only
    - includeSubDomains: Apply to all subdomains
    - preload: Site can be included in browser HSTS preload list
    
    Returns:
        str: Complete HSTS header value
    """
    # Get max-age from settings, default to 1 year
    max_age = getattr(settings, 'SECURE_HSTS_SECONDS', 31536000)
    
    # Build HSTS header with directives
    hsts_value = f"max-age={max_age}"
    
    # Include subdomains if configured (default: yes)
    include_subdomains = getattr(settings, 'SECURE_HSTS_INCLUDE_SUBDOMAINS', True)
    if include_subdomains:
        hsts_value += "; includeSubDomains"
    
    # Include preload directive if configured (default: no)
    # Preload requires submission to hstspreload.org
    preload = getattr(settings, 'SECURE_HSTS_PRELOAD', False)
    if preload:
        hsts_value += "; preload"
    
    return hsts_value
```

### HSTS Directive Explanation
| Directive | Purpose | Value |
|-----------|---------|-------|
| **max-age** | How long to remember | Seconds (e.g., 31536000 = 1 year) |
| **includeSubDomains** | Apply to subdomains | Flag (no value) |
| **preload** | Browser preload list | Flag (no value) |

### Max-Age Values
| Duration | Seconds | Use Case |
|----------|---------|----------|
| **5 minutes** | 300 | Testing only |
| **1 day** | 86400 | Initial deployment |
| **1 week** | 604800 | Early production |
| **1 month** | 2592000 | Stable production |
| **1 year** | 31536000 | Recommended |
| **2 years** | 63072000 | Maximum security |

### HSTS Behavior
```
First Visit:
Browser: http://example.com
Server:  HTTP 301 → https://example.com
         Strict-Transport-Security: max-age=31536000
Browser: Remembers for 1 year

Subsequent Visits (within 1 year):
User types: http://example.com
Browser:    Automatically upgrades to https://example.com
            No HTTP request sent!
```

### includeSubDomains Consideration
```
Without includeSubDomains:
HSTS applies to: example.com
NOT applied to:  api.example.com, www.example.com

With includeSubDomains:
HSTS applies to: example.com
ALSO applied to: api.example.com, www.example.com, *.example.com

Warning: All subdomains MUST support HTTPS
```

### HSTS Preload List
1. **What is Preload?**
   - Browser-maintained list of HSTS sites
   - HSTS enforced even on first visit
   - Built into Chrome, Firefox, Safari, Edge

2. **Requirements for Preload:**
   - Serve valid certificate
   - Redirect HTTP to HTTPS (same host)
   - Serve HSTS header on HTTPS
   - max-age at least 31536000 (1 year)
   - Include includeSubDomains directive
   - Include preload directive
   - Submit to hstspreload.org

3. **Benefits:**
   - Protection from first visit
   - No HTTP request ever sent
   - Defeats man-in-the-middle attacks

4. **Risks:**
   - Hard to remove from list (months/years)
   - All subdomains must support HTTPS
   - Breaks HTTP-only subdomains

### Security Benefits
| Threat | HSTS Protection |
|--------|-----------------|
| **SSL Stripping** | Prevents downgrade to HTTP |
| **Man-in-the-Middle** | Forces encrypted connection |
| **Cookie Hijacking** | Cookies sent over HTTPS only |
| **First-Visit Attack** | With preload, protected from first visit |

### Configuration Examples
```python
# settings.py

# Basic HSTS (1 year, no subdomains)
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False

# Recommended production settings
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = False  # Set to True only if ready

# Maximum security (preload list)
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 63072000  # 2 years
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Expected Outcome
- `_should_add_hsts` method checks HTTPS status
- `_get_hsts_header` method generates HSTS value
- HSTS header only added in production with HTTPS
- Configurable max-age and directives

### Verification Checklist
- [ ] `_should_add_hsts` method checks DEBUG and SSL settings
- [ ] `_get_hsts_header` method generates proper HSTS value
- [ ] max-age read from SECURE_HSTS_SECONDS setting
- [ ] includeSubDomains directive supported
- [ ] preload directive supported
- [ ] HSTS only added when HTTPS enabled
- [ ] Comments explain HSTS behavior

---

## Task 55: Configure HSTS Age

### Overview
Add configuration validation and documentation for HSTS max-age values. Ensure sensible defaults and provide guidance on choosing appropriate values.

### Dependencies
- Task 54: Add Strict-Transport-Security

### Instructions

1. **Add max-age validation**
   - Ensure max-age is positive integer
   - Warn if max-age too short
   - Document recommended values

2. **Add age constants**
   - Define common max-age values
   - Use descriptive constant names
   - Add comments with durations

3. **Update `_get_hsts_header` comments**
   - Add max-age value recommendations
   - Explain testing vs production values
   - Note preload requirements

### Enhanced Implementation

```python
# Add at module level after imports

# HSTS max-age constants (in seconds)
HSTS_MAX_AGE_TESTING = 300        # 5 minutes - testing only
HSTS_MAX_AGE_INITIAL = 86400      # 1 day - initial deployment
HSTS_MAX_AGE_SHORT = 604800       # 1 week - early production
HSTS_MAX_AGE_MEDIUM = 2592000     # 1 month - stable production
HSTS_MAX_AGE_RECOMMENDED = 31536000   # 1 year - recommended
HSTS_MAX_AGE_MAXIMUM = 63072000   # 2 years - maximum security


def _get_hsts_header(self):
    """
    Generate Strict-Transport-Security header value.
    
    HSTS tells browsers to only access the site via HTTPS.
    Once set, browser will automatically upgrade HTTP to HTTPS
    for the specified duration.
    
    Max-Age Recommendations:
    - Testing: 300 seconds (5 minutes) - easy to reset
    - Initial: 86400 seconds (1 day) - catch issues quickly
    - Production: 31536000 seconds (1 year) - recommended
    - Preload: 31536000+ seconds - required for preload list
    
    Directives:
    - max-age: Duration in seconds to remember HTTPS-only
    - includeSubDomains: Apply to all subdomains
    - preload: Site can be included in browser HSTS preload list
    
    Returns:
        str: Complete HSTS header value
    """
    # Get max-age from settings, default to 1 year
    max_age = getattr(settings, 'SECURE_HSTS_SECONDS', HSTS_MAX_AGE_RECOMMENDED)
    
    # Validate max-age value
    if max_age < 300:
        # Warn if max-age too short (less than 5 minutes)
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(
            f"HSTS max-age ({max_age}) is very short. "
            f"Consider using at least {HSTS_MAX_AGE_TESTING} seconds."
        )
    
    # Build HSTS header with directives
    hsts_value = f"max-age={max_age}"
    
    # Include subdomains if configured (default: yes)
    include_subdomains = getattr(settings, 'SECURE_HSTS_INCLUDE_SUBDOMAINS', True)
    if include_subdomains:
        hsts_value += "; includeSubDomains"
    
    # Include preload directive if configured (default: no)
    # Preload requires submission to hstspreload.org
    preload = getattr(settings, 'SECURE_HSTS_PRELOAD', False)
    if preload:
        hsts_value += "; preload"
        
        # Warn if max-age too short for preload
        if max_age < HSTS_MAX_AGE_RECOMMENDED:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(
                f"HSTS preload requires max-age >= {HSTS_MAX_AGE_RECOMMENDED} seconds. "
                f"Current: {max_age} seconds."
            )
    
    return hsts_value
```

### Max-Age Selection Guide
| Phase | Max-Age | Constant | Rationale |
|-------|---------|----------|-----------|
| **Testing** | 300s | HSTS_MAX_AGE_TESTING | Easy to clear cache |
| **Initial Deploy** | 1 day | HSTS_MAX_AGE_INITIAL | Catch issues early |
| **Early Production** | 1 week | HSTS_MAX_AGE_SHORT | Still flexible |
| **Stable Production** | 1 month | HSTS_MAX_AGE_MEDIUM | Good balance |
| **Recommended** | 1 year | HSTS_MAX_AGE_RECOMMENDED | Industry standard |
| **Maximum** | 2 years | HSTS_MAX_AGE_MAXIMUM | Maximum protection |

### Progressive HSTS Deployment
```
Week 1: max-age=86400 (1 day)
  └─ Monitor for issues

Week 2: max-age=604800 (1 week)
  └─ Confidence building

Month 1: max-age=2592000 (1 month)
  └─ Extended testing

Month 2: max-age=31536000 (1 year)
  └─ Production ready

Month 3+: Add includeSubDomains
  └─ Full deployment

Month 6+: Add preload directive
  └─ Submit to preload list
```

### Validation Logic
```python
# Pseudo-code for comprehensive validation

def validate_hsts_config():
    max_age = settings.SECURE_HSTS_SECONDS
    include_subdomains = settings.SECURE_HSTS_INCLUDE_SUBDOMAINS
    preload = settings.SECURE_HSTS_PRELOAD
    
    # Check max-age minimum
    if max_age < 300:
        raise ValueError("HSTS max-age too short")
    
    # Preload requires long max-age
    if preload and max_age < HSTS_MAX_AGE_RECOMMENDED:
        raise ValueError("Preload requires max-age >= 1 year")
    
    # Preload requires includeSubDomains
    if preload and not include_subdomains:
        raise ValueError("Preload requires includeSubDomains")
```

### HSTS Testing Strategy
1. **Local Development:**
   - Don't use HSTS (DEBUG=True)
   - Test with HTTPS if needed

2. **Staging Environment:**
   - Start with 5 minute max-age
   - Test HTTPS redirects
   - Verify all subdomains support HTTPS

3. **Production Rollout:**
   - Week 1: max-age=1 day
   - Week 2: max-age=1 week
   - Month 1: max-age=1 month
   - Month 2: max-age=1 year

4. **Subdomain Testing:**
   - Test all subdomains individually
   - Enable includeSubDomains only when all ready
   - One broken subdomain breaks entire domain

### Expected Outcome
- HSTS max-age constants defined
- Validation for max-age values
- Comprehensive documentation
- Progressive deployment guidance

### Verification Checklist
- [ ] HSTS constants defined at module level
- [ ] Constants have descriptive names
- [ ] Validation checks max-age minimum
- [ ] Warning for preload requirements
- [ ] Comments explain progressive deployment
- [ ] Default uses HSTS_MAX_AGE_RECOMMENDED

---

## Task 56: Add X-Request-ID

### Overview
Add the X-Request-ID header to track requests through the system. This header should propagate request IDs from the logging middleware for distributed tracing.

### Dependencies
- Task 55: Configure HSTS Age
- SubPhase-06 Group-C: Request logging middleware (for request_id)

### Instructions

1. **Update `_add_security_headers` method**
   - Check if request has request_id attribute
   - Add X-Request-ID header if present
   - Add inline comment

2. **Handle missing request_id**
   - Gracefully handle missing attribute
   - Don't generate new IDs here
   - Rely on logging middleware

3. **Add comments**
   - Explain request tracking purpose
   - Note dependency on logging middleware
   - Describe distributed tracing use case

### Implementation

```python
def _add_security_headers(self, request, response):
    """
    Add all security headers to the response.
    
    This method adds various security headers based on configuration
    and environment settings.
    
    Args:
        request: HttpRequest object
        response: HttpResponse object
        
    Returns:
        HttpResponse with security headers added
    """
    # Prevent MIME type sniffing
    # Forces browser to respect Content-Type header
    response['X-Content-Type-Options'] = 'nosniff'
    
    # Prevent clickjacking attacks
    # Controls if page can be displayed in frame/iframe
    frame_options = getattr(settings, 'X_FRAME_OPTIONS', 'DENY')
    response['X-Frame-Options'] = frame_options
    
    # Enable XSS filter and block page if attack detected
    # Activates browser's built-in XSS protection
    response['X-XSS-Protection'] = '1; mode=block'
    
    # Control referrer information sent with requests
    # Protects user privacy and prevents information leakage
    response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Content Security Policy - control resource loading
    # Primary defense against XSS and data injection attacks
    response['Content-Security-Policy'] = self._get_csp_header()
    
    # Permissions Policy - control browser features and APIs
    # Prevents unauthorized access to sensitive device features
    response['Permissions-Policy'] = self._get_permissions_policy()
    
    # Strict-Transport-Security - force HTTPS
    # Only add in production with HTTPS enabled
    if self._should_add_hsts(request):
        response['Strict-Transport-Security'] = self._get_hsts_header()
    
    # Request ID tracking - propagate from logging middleware
    # Enables request tracing across services and logs
    if hasattr(request, 'request_id'):
        response['X-Request-ID'] = request.request_id
    
    return response
```

### X-Request-ID Purpose
| Use Case | Benefit |
|----------|---------|
| **Log Correlation** | Link all logs for one request |
| **Distributed Tracing** | Track request across services |
| **Error Debugging** | Find all logs for failed request |
| **Performance Analysis** | Measure end-to-end latency |
| **User Support** | Users can provide request ID |

### Request ID Flow
```
Client Request
    │
    ▼
[RequestLoggingMiddleware]
    ├─► Generate UUID
    ├─► Set request.request_id
    ├─► Log request with ID
    │
    ▼
[Application Code]
    ├─► Access request.request_id
    ├─► Log events with ID
    ├─► Pass to external services
    │
    ▼
[SecurityHeadersMiddleware]
    ├─► Add X-Request-ID header
    │
    ▼
Client Response
    ├─► Receives X-Request-ID
    ├─► Can use for support tickets
```

### Logging Integration
```python
# In logging middleware (already exists):
import uuid

class RequestLoggingMiddleware:
    def __call__(self, request):
        # Generate unique request ID
        request.request_id = str(uuid.uuid4())
        
        # Log request with ID
        logger.info(
            "Request received",
            extra={'request_id': request.request_id}
        )
        
        response = self.get_response(request)
        
        # Log response with same ID
        logger.info(
            "Response sent",
            extra={'request_id': request.request_id}
        )
        
        return response

# In security middleware (this task):
# Just propagate the ID to response header
if hasattr(request, 'request_id'):
    response['X-Request-ID'] = request.request_id
```

### Example Request ID
```
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000

Format: UUID4 (universally unique identifier)
Parts:
- 550e8400: Timestamp-based
- e29b: Version and variant
- 41d4: Random
- a716-446655440000: MAC address + random
```

### Log Correlation Example
```
# All logs for one request:
[2026-01-23 10:15:23] INFO request_id=550e8400... Request received: GET /api/products
[2026-01-23 10:15:23] DEBUG request_id=550e8400... Authenticating user
[2026-01-23 10:15:23] INFO request_id=550e8400... User authenticated: user@example.com
[2026-01-23 10:15:24] DEBUG request_id=550e8400... Querying database
[2026-01-23 10:15:24] INFO request_id=550e8400... Response sent: 200 OK

# Easy to grep:
$ grep "550e8400" application.log
# Returns all logs for this request
```

### Distributed Tracing
```
Client → API Gateway → Backend → Database
           │              │
           ▼              ▼
    X-Request-ID    X-Request-ID
    passed in       logged and
    header          passed to next

All services log same request_id:
[API Gateway] request_id=abc123 Routing to backend
[Backend]     request_id=abc123 Processing request
[Backend]     request_id=abc123 Querying database
[Backend]     request_id=abc123 Sending response
[API Gateway] request_id=abc123 Forwarding response
```

### User Support Integration
```
Error Page:
┌─────────────────────────────────────┐
│  Oops! Something went wrong         │
│                                      │
│  Please contact support with        │
│  this Request ID:                   │
│                                      │
│  550e8400-e29b-41d4-a716-446655440000│
└─────────────────────────────────────┘

Support can then:
1. Search logs with request_id
2. Find exact error
3. See full request context
4. Debug issue quickly
```

### Alternative: Generate ID if Missing
```python
# Optional: Generate ID if logging middleware not present
if hasattr(request, 'request_id'):
    response['X-Request-ID'] = request.request_id
else:
    # Fallback: generate ID here
    response['X-Request-ID'] = str(uuid.uuid4())
    # Note: Won't be in request logs

# Better: Always require logging middleware first
```

### Expected Outcome
- X-Request-ID header added to responses
- Request ID propagated from logging middleware
- Request tracking enabled across system
- Graceful handling if request_id missing

### Verification Checklist
- [ ] X-Request-ID header added in `_add_security_headers`
- [ ] Checks for request.request_id attribute
- [ ] Uses hasattr() for safe attribute access
- [ ] Inline comment explains request tracking
- [ ] No new ID generated (relies on logging middleware)
- [ ] Header only added if request_id present

---

## Document Next Steps

After completing Tasks 53-56, proceed to:
- **Next Document:** [04_Tasks-57-58_Registration-Testing.md](04_Tasks-57-58_Registration-Testing.md)
- Register middleware in Django settings
- Create comprehensive tests for all security headers
- Verify middleware execution order

---

## Notes for AI Agents

1. **Permissions-Policy:** New name for Feature-Policy, use updated syntax
2. **HSTS Testing:** Start with short max-age, increase gradually
3. **HSTS Preload:** Only enable when fully ready, hard to remove
4. **Request ID:** Don't generate here, propagate from logging middleware
5. **Logging Import:** Only import logging module when needed (in method)
6. **Constants:** Define at module level for reusability
7. **Validation:** Log warnings, don't raise exceptions (graceful degradation)
8. **Comments:** Explain security benefits of each header
