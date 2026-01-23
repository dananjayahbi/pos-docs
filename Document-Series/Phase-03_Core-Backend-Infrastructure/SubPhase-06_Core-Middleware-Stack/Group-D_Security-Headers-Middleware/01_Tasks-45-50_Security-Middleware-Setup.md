# Tasks 45-50: Security Middleware Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** D - Security Headers Middleware  
> **Document:** 01 of 04  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-C_Request-Logging-Middleware/](../Group-C_Request-Logging-Middleware/)
- **→ Next Document:** [02_Tasks-51-52_Content-Security-Policy.md](02_Tasks-51-52_Content-Security-Policy.md)

---

## Document Overview

This document covers the creation of the SecurityHeadersMiddleware class with basic security headers. These headers provide fundamental protection against XSS, clickjacking, and MIME sniffing attacks.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Create SecurityHeadersMiddleware File | Simple |
| 46 | Create SecurityHeadersMiddleware Class | Simple |
| 47 | Add X-Content-Type-Options | Simple |
| 48 | Add X-Frame-Options | Simple |
| 49 | Add X-XSS-Protection | Simple |
| 50 | Add Referrer-Policy | Simple |

---

## Task 45: Create SecurityHeadersMiddleware File

### Overview
Create the security.py file in the middleware directory to house the SecurityHeadersMiddleware class.

### Dependencies
- SubPhase-06 Group-A: Middleware directory exists
- Django middleware framework available

### Instructions

1. **Navigate to middleware directory**
   - Path: `backend/apps/core/middleware/`
   - Verify directory exists from Group-A setup

2. **Create security.py file**
   - Filename: `security.py`
   - Location: `backend/apps/core/middleware/security.py`

3. **Add file header**
   - Module docstring explaining purpose
   - Document security headers added
   - Note environment-specific behavior

4. **Add imports**
   - Import settings from django.conf
   - Import uuid for request ID generation
   - Leave space for additional imports

### File Structure

```python
"""
Security Headers Middleware

Adds security-related HTTP headers to all responses to protect against
common web vulnerabilities:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Content Security Policy violations
- Referrer information leakage

Security headers added:
- X-Content-Type-Options: Prevents MIME sniffing
- X-Frame-Options: Prevents clickjacking
- X-XSS-Protection: Enables XSS filter
- Referrer-Policy: Controls referrer information
- Content-Security-Policy: Restricts resource loading
- Permissions-Policy: Controls browser features
- Strict-Transport-Security: Forces HTTPS (production only)
- X-Request-ID: Request tracking header

Environment-specific behavior:
- CSP is more permissive in development
- HSTS only added in production with HTTPS
- Request IDs propagated from logging middleware
"""

from django.conf import settings
import uuid


# SecurityHeadersMiddleware class will be added in next task
```

### File Purpose
| Component | Purpose |
|-----------|---------|
| **Module** | Security headers middleware |
| **Primary Class** | SecurityHeadersMiddleware |
| **Scope** | All HTTP responses |
| **Environment** | Development and Production |

### Expected Outcome
- security.py file created in middleware directory
- File header with comprehensive documentation
- Required imports added
- Ready for class definition

### Verification Checklist
- [ ] File created at `backend/apps/core/middleware/security.py`
- [ ] Module docstring explains all headers
- [ ] django.conf.settings imported
- [ ] uuid module imported
- [ ] File follows project code style

---

## Task 46: Create SecurityHeadersMiddleware Class

### Overview
Define the SecurityHeadersMiddleware class with initialization and call methods. This class will intercept all responses and add security headers.

### Dependencies
- Task 45: Create SecurityHeadersMiddleware File

### Instructions

1. **Define SecurityHeadersMiddleware class**
   - Class name: `SecurityHeadersMiddleware`
   - Standard Django middleware pattern
   - Add comprehensive class docstring

2. **Add `__init__` method**
   - Accept `get_response` callable
   - Store as instance variable
   - Initialize any required state

3. **Add `__call__` method**
   - Accept `request` parameter
   - Get response from next middleware
   - Add security headers to response
   - Return modified response

4. **Add `_add_security_headers` method stub**
   - Accept `request` and `response`
   - Return response with headers
   - Will be implemented in subsequent tasks

5. **Add class attributes**
   - Document configuration options
   - Note environment-specific behavior

### Class Definition Structure

```python
class SecurityHeadersMiddleware:
    """
    Middleware to add security headers to all HTTP responses.
    
    This middleware adds various security-related headers to protect against
    common web vulnerabilities. Headers are added to all responses regardless
    of status code or content type.
    
    Security Headers:
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY or SAMEORIGIN
    - X-XSS-Protection: 1; mode=block
    - Referrer-Policy: strict-origin-when-cross-origin
    - Content-Security-Policy: Configurable CSP directives
    - Permissions-Policy: Browser feature restrictions
    - Strict-Transport-Security: HTTPS enforcement (production only)
    - X-Request-ID: Request tracking (if available)
    
    Configuration:
    Settings can be customized via Django settings:
    - SECURE_SSL_REDIRECT: Enable HSTS
    - SECURE_HSTS_SECONDS: HSTS max-age value
    - X_FRAME_OPTIONS: Frame options (DENY/SAMEORIGIN)
    
    Environment Behavior:
    - Development: More permissive CSP for debugging
    - Production: Strict CSP, HSTS enabled
    """
    
    def __init__(self, get_response):
        """
        Initialize middleware.
        
        Args:
            get_response: Callable to get response from next middleware
        """
        self.get_response = get_response
    
    def __call__(self, request):
        """
        Process request and add security headers to response.
        
        Args:
            request: HttpRequest object
            
        Returns:
            HttpResponse with security headers added
        """
        # Get response from next middleware/view
        response = self.get_response(request)
        
        # Add security headers
        response = self._add_security_headers(request, response)
        
        return response
    
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
        # Headers will be added in subsequent tasks
        return response
```

### Middleware Flow
```
Request
    │
    ▼
[SecurityHeadersMiddleware.__call__]
    │
    ├─► self.get_response(request)
    │       │
    │       ▼
    │   [Next Middleware/View]
    │       │
    │       ▼
    │   [Response Generated]
    │       │
    ├─◄─────┘
    │
    ├─► _add_security_headers(request, response)
    │       │
    │       ▼
    │   [Add X-Content-Type-Options]
    │   [Add X-Frame-Options]
    │   [Add X-XSS-Protection]
    │   [Add Referrer-Policy]
    │   [Add CSP]
    │   [Add Permissions-Policy]
    │   [Add HSTS if production]
    │   [Add X-Request-ID if available]
    │       │
    ├─◄─────┘
    │
    ▼
Response with Headers
```

### Expected Outcome
- SecurityHeadersMiddleware class defined
- Proper initialization and call methods
- Structure ready for header implementation
- Helper method stub created

### Verification Checklist
- [ ] Class name is SecurityHeadersMiddleware
- [ ] Class docstring documents all headers
- [ ] `__init__` method stores get_response
- [ ] `__call__` method follows standard pattern
- [ ] `_add_security_headers` method stub exists
- [ ] All methods have proper docstrings

---

## Task 47: Add X-Content-Type-Options

### Overview
Add the X-Content-Type-Options header to prevent MIME type sniffing. This header instructs browsers to respect the Content-Type header.

### Dependencies
- Task 46: Create SecurityHeadersMiddleware Class

### Instructions

1. **Implement in `_add_security_headers` method**
   - Add X-Content-Type-Options header
   - Set value to 'nosniff'
   - Apply to all responses

2. **Add inline comment**
   - Explain MIME sniffing protection
   - Note browser behavior change

3. **No configuration needed**
   - Always set to 'nosniff'
   - No environment-specific logic

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
    
    # Additional headers will be added in subsequent tasks
    
    return response
```

### Header Details
| Aspect | Value |
|--------|-------|
| **Header Name** | X-Content-Type-Options |
| **Value** | nosniff |
| **Purpose** | Prevent MIME sniffing |
| **Applies To** | All responses |

### What is MIME Sniffing?
MIME sniffing is when browsers try to guess the content type of a resource by examining its content, ignoring the Content-Type header. This can lead to security vulnerabilities:

1. **Attack Vector:**
   - Attacker uploads file with malicious content
   - Server sets Content-Type: text/plain
   - Browser sniffs content and executes as JavaScript
   - XSS vulnerability created

2. **Protection:**
   - X-Content-Type-Options: nosniff
   - Browser respects Content-Type header
   - No content sniffing performed
   - Malicious content not executed

### Browser Support
| Browser | Support |
|---------|---------|
| Chrome | Yes (all versions) |
| Firefox | Yes (v50+) |
| Safari | Yes (all versions) |
| Edge | Yes (all versions) |
| IE | Yes (IE 8+) |

### Expected Outcome
- X-Content-Type-Options header added
- Set to 'nosniff' for all responses
- MIME sniffing protection enabled

### Verification Checklist
- [ ] Header added in `_add_security_headers`
- [ ] Value set to 'nosniff'
- [ ] Inline comment explains purpose
- [ ] Applied to all responses
- [ ] No conditional logic needed

---

## Task 48: Add X-Frame-Options

### Overview
Add the X-Frame-Options header to prevent clickjacking attacks. This header controls whether the page can be displayed in frames or iframes.

### Dependencies
- Task 47: Add X-Content-Type-Options

### Instructions

1. **Implement in `_add_security_headers` method**
   - Add X-Frame-Options header
   - Default to 'DENY'
   - Allow configuration override

2. **Add configuration support**
   - Check for settings.X_FRAME_OPTIONS
   - Fall back to 'DENY' if not configured
   - Support 'DENY' and 'SAMEORIGIN' values

3. **Add inline comment**
   - Explain clickjacking protection
   - Note frame embedding behavior

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
    
    # Additional headers will be added in subsequent tasks
    
    return response
```

### Header Details
| Aspect | Value |
|--------|-------|
| **Header Name** | X-Frame-Options |
| **Default Value** | DENY |
| **Allowed Values** | DENY, SAMEORIGIN |
| **Configurable** | Yes (settings.X_FRAME_OPTIONS) |

### Frame Options Explained
| Value | Behavior | Use Case |
|-------|----------|----------|
| **DENY** | No framing allowed | Maximum security, no iframe usage |
| **SAMEORIGIN** | Same-origin framing only | Allow embedding within same domain |
| **ALLOW-FROM** | Specific origin allowed | Deprecated, use CSP instead |

### Clickjacking Attack Example
1. **Attack Setup:**
   - Attacker creates malicious page
   - Embeds target page in invisible iframe
   - Overlays fake UI elements
   - User clicks on fake UI
   - Click registered on hidden iframe
   - Unintended action performed

2. **Protection:**
   - X-Frame-Options: DENY
   - Browser refuses to load page in iframe
   - Clickjacking attack prevented

### Configuration Examples
```python
# settings.py

# Maximum security - no framing
X_FRAME_OPTIONS = 'DENY'

# Allow framing from same origin
# Use if your app needs to iframe itself
X_FRAME_OPTIONS = 'SAMEORIGIN'
```

### Browser Support
| Browser | Support |
|---------|---------|
| Chrome | Yes (all versions) |
| Firefox | Yes (all versions) |
| Safari | Yes (all versions) |
| Edge | Yes (all versions) |
| IE | Yes (IE 8+) |

### Expected Outcome
- X-Frame-Options header added
- Default to 'DENY' for maximum security
- Configurable via settings
- Clickjacking protection enabled

### Verification Checklist
- [ ] Header added in `_add_security_headers`
- [ ] Default value is 'DENY'
- [ ] Reads from settings.X_FRAME_OPTIONS
- [ ] Falls back to 'DENY' if not configured
- [ ] Inline comment explains clickjacking

---

## Task 49: Add X-XSS-Protection

### Overview
Add the X-XSS-Protection header to enable browser XSS filters. This header activates the browser's built-in XSS protection mechanism.

### Dependencies
- Task 48: Add X-Frame-Options

### Instructions

1. **Implement in `_add_security_headers` method**
   - Add X-XSS-Protection header
   - Set value to '1; mode=block'
   - Apply to all responses

2. **Add inline comment**
   - Explain XSS filter activation
   - Note blocking behavior

3. **No configuration needed**
   - Always set to '1; mode=block'
   - No environment-specific logic

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
    
    # Additional headers will be added in subsequent tasks
    
    return response
```

### Header Details
| Aspect | Value |
|--------|-------|
| **Header Name** | X-XSS-Protection |
| **Value** | 1; mode=block |
| **Purpose** | Enable XSS filter |
| **Behavior** | Block page if XSS detected |

### X-XSS-Protection Values
| Value | Behavior |
|-------|----------|
| **0** | Disable XSS filter |
| **1** | Enable XSS filter, sanitize page |
| **1; mode=block** | Enable XSS filter, block page if attack detected |
| **1; report=<uri>** | Enable XSS filter, report violation |

### Why Use mode=block?
| Mode | Behavior | Risk |
|------|----------|------|
| **Sanitize (1)** | Remove malicious content | May create new vulnerabilities |
| **Block (mode=block)** | Block entire page | Safer, prevents rendering |

### XSS Attack Example
1. **Attack Vector:**
   ```html
   <!-- Attacker injects script in URL parameter -->
   https://example.com/search?q=<script>alert('XSS')</script>
   
   <!-- Server reflects input without sanitization -->
   <div>Results for: <script>alert('XSS')</script></div>
   ```

2. **Protection:**
   - X-XSS-Protection: 1; mode=block
   - Browser detects reflected XSS pattern
   - Page rendering blocked
   - User sees error instead of executing script

### Modern CSP Note
While X-XSS-Protection is useful, modern security relies on Content-Security-Policy:
- CSP provides more comprehensive protection
- CSP can disable inline scripts entirely
- X-XSS-Protection as defense-in-depth
- Support for older browsers

### Browser Support
| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | Deprecated | Removed in v88, use CSP |
| Firefox | Never supported | CSP recommended |
| Safari | Yes | Still supported |
| Edge | Deprecated | Chromium version removed |
| IE | Yes (IE 8+) | Legacy support |

### Expected Outcome
- X-XSS-Protection header added
- Set to '1; mode=block' for blocking behavior
- XSS filter enabled for supporting browsers

### Verification Checklist
- [ ] Header added in `_add_security_headers`
- [ ] Value set to '1; mode=block'
- [ ] Inline comment explains XSS protection
- [ ] Applied to all responses
- [ ] No conditional logic needed

---

## Task 50: Add Referrer-Policy

### Overview
Add the Referrer-Policy header to control how much referrer information is sent with requests. This protects user privacy and prevents information leakage.

### Dependencies
- Task 49: Add X-XSS-Protection

### Instructions

1. **Implement in `_add_security_headers` method**
   - Add Referrer-Policy header
   - Set value to 'strict-origin-when-cross-origin'
   - Apply to all responses

2. **Add inline comment**
   - Explain referrer information control
   - Note privacy protection

3. **No configuration needed**
   - Always set to 'strict-origin-when-cross-origin'
   - Balanced security and functionality

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
    
    # Additional headers will be added in subsequent tasks
    
    return response
```

### Header Details
| Aspect | Value |
|--------|-------|
| **Header Name** | Referrer-Policy |
| **Value** | strict-origin-when-cross-origin |
| **Purpose** | Control referrer information |
| **Balance** | Security and functionality |

### Referrer-Policy Values
| Value | Behavior | Use Case |
|-------|----------|----------|
| **no-referrer** | Never send referrer | Maximum privacy |
| **no-referrer-when-downgrade** | No referrer on HTTPS→HTTP | Default browser behavior |
| **origin** | Send origin only | Hide path/query |
| **origin-when-cross-origin** | Full URL same-origin, origin cross-origin | Good balance |
| **same-origin** | Send referrer only same-origin | Strict privacy |
| **strict-origin** | Send origin only, not on downgrade | Good privacy |
| **strict-origin-when-cross-origin** | Full URL same-origin, origin cross-origin, none on downgrade | **Recommended** |
| **unsafe-url** | Always send full URL | Poor privacy |

### Why strict-origin-when-cross-origin?
This policy provides a good balance between security and functionality:

1. **Same-Origin Requests:**
   - Sends full URL with path and query
   - Example: https://example.com/page1 → https://example.com/page2
   - Referrer: https://example.com/page1

2. **Cross-Origin Requests (HTTPS→HTTPS):**
   - Sends origin only (no path/query)
   - Example: https://example.com/page → https://other.com/api
   - Referrer: https://example.com

3. **Downgrade (HTTPS→HTTP):**
   - No referrer sent
   - Example: https://example.com/page → http://other.com/api
   - Referrer: (empty)

### Information Leakage Examples
```
Without Referrer-Policy:
URL: https://example.com/account/settings?token=abc123
User clicks external link
Referrer sent: https://example.com/account/settings?token=abc123
Token leaked to external site!

With strict-origin-when-cross-origin:
URL: https://example.com/account/settings?token=abc123
User clicks external link
Referrer sent: https://example.com
Token protected!
```

### Privacy Protection
| Scenario | Referrer Sent | Data Protected |
|----------|---------------|----------------|
| **Same origin** | Full URL | None (intentional) |
| **Cross origin** | Origin only | Path, query, fragments |
| **HTTPS → HTTP** | None | Full URL |

### Browser Support
| Browser | Support |
|---------|---------|
| Chrome | Yes (v61+) |
| Firefox | Yes (v52+) |
| Safari | Yes (v11.1+) |
| Edge | Yes (v79+) |
| IE | No (use meta tag) |

### Expected Outcome
- Referrer-Policy header added
- Set to 'strict-origin-when-cross-origin'
- Privacy protection enabled
- Functionality preserved

### Verification Checklist
- [ ] Header added in `_add_security_headers`
- [ ] Value set to 'strict-origin-when-cross-origin'
- [ ] Inline comment explains referrer control
- [ ] Applied to all responses
- [ ] Balances security and functionality

---

## Document Next Steps

After completing Tasks 45-50, proceed to:
- **Next Document:** [02_Tasks-51-52_Content-Security-Policy.md](02_Tasks-51-52_Content-Security-Policy.md)
- Implement Content-Security-Policy header
- Configure CSP directives for development and production
- Add environment-specific CSP handling

---

## Notes for AI Agents

1. **Header Order:** No specific order required, all added to response dict
2. **Settings Import:** Already imported at module level
3. **Configuration:** Use getattr() for optional settings with defaults
4. **Comments:** Explain why each header is important
5. **Testing:** Headers should appear on all responses
6. **Browser Support:** Most headers widely supported
7. **Defense in Depth:** Multiple headers provide layered security
8. **CSP Coming:** More sophisticated protection in next document
