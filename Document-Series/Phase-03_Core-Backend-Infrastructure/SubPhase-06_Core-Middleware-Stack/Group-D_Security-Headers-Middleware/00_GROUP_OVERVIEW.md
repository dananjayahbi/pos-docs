# Group D: Security Headers Middleware

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** D of F  
> **Tasks Covered:** 45-58  
> **Group Goal:** Add security headers to all responses for XSS, clickjacking, and content protection

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Request-Logging-Middleware](../Group-C_Request-Logging-Middleware/)
- **→ Next Group:** [Group-E_Rate-Limiting-Middleware](../Group-E_Rate-Limiting-Middleware/)

---

## Group Overview

This group creates the SecurityHeadersMiddleware that adds security-related HTTP headers to all responses. These headers protect against common web vulnerabilities like XSS, clickjacking, and content sniffing.

### Key Components
- **SecurityHeadersMiddleware:** Main security middleware
- **XSS Protection:** X-XSS-Protection header
- **Clickjacking Protection:** X-Frame-Options header
- **Content Security Policy:** CSP header with directives
- **HSTS:** Strict-Transport-Security for HTTPS

### Security Headers
| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | XSS filter |
| Referrer-Policy | strict-origin | Control referrer |
| Content-Security-Policy | ... | Resource loading |
| Permissions-Policy | ... | Feature restrictions |
| Strict-Transport-Security | max-age=... | Force HTTPS |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Security Middleware Setup | Tasks 45-50 | Basic security headers |
| DOC-02 | Content Security Policy | Tasks 51-52 | CSP configuration |
| DOC-03 | Advanced Headers | Tasks 53-56 | HSTS, Permissions, X-Request-ID |
| DOC-04 | Registration & Testing | Tasks 57-58 | Add to settings and test |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 45 | Create SecurityHeadersMiddleware File | security.py |
| 46 | Create SecurityHeadersMiddleware Class | Main class |
| 47 | Add X-Content-Type-Options | nosniff |
| 48 | Add X-Frame-Options | DENY or SAMEORIGIN |
| 49 | Add X-XSS-Protection | 1; mode=block |
| 50 | Add Referrer-Policy | strict-origin |
| 51 | Add Content-Security-Policy | CSP header |
| 52 | Configure CSP Directives | Per environment |
| 53 | Add Permissions-Policy | Feature policy |
| 54 | Add Strict-Transport-Security | HSTS header |
| 55 | Configure HSTS Age | max-age value |
| 56 | Add X-Request-ID | Request tracking |
| 57 | Register in MIDDLEWARE | Add to settings |
| 58 | Test Security Headers | Header tests |

---

## Execution Order

```
[Tasks 45-50: Basic Headers]
        │
        ▼
[Tasks 51-52: CSP Configuration]
        │
        ▼
[Tasks 53-56: Advanced Headers]
        │
        ▼
[Tasks 57-58: Registration & Tests]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── middleware/
│   └── security.py
│       └── class SecurityHeadersMiddleware:
│           ├── __init__(get_response)
│           ├── __call__(request)
│           ├── _add_security_headers(response)
│           ├── _get_csp_header()
│           ├── _get_hsts_header()
│           └── _get_permissions_policy()
└── tests/
    └── test_security_middleware.py
```

### Security Headers Middleware
```python
from django.conf import settings

class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        return self._add_security_headers(request, response)
    
    def _add_security_headers(self, request, response):
        # XSS Protection
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Clickjacking Protection
        response['X-Frame-Options'] = 'DENY'
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Content Security Policy
        response['Content-Security-Policy'] = self._get_csp_header()
        
        # Permissions Policy
        response['Permissions-Policy'] = self._get_permissions_policy()
        
        # HSTS (only in production with HTTPS)
        if settings.SECURE_SSL_REDIRECT:
            response['Strict-Transport-Security'] = self._get_hsts_header()
        
        # Request ID tracking
        if hasattr(request, 'request_id'):
            response['X-Request-ID'] = request.request_id
        
        return response
    
    def _get_csp_header(self):
        directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self'",
            "frame-ancestors 'none'",
        ]
        return "; ".join(directives)
    
    def _get_hsts_header(self):
        max_age = getattr(settings, 'SECURE_HSTS_SECONDS', 31536000)
        return f"max-age={max_age}; includeSubDomains; preload"
    
    def _get_permissions_policy(self):
        return "geolocation=(), microphone=(), camera=()"
```

### Environment-Specific CSP
```python
# Development CSP (more permissive)
DEV_CSP = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'connect-src': ["'self'", "ws://localhost:*"],
}

# Production CSP (strict)
PROD_CSP = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': True,
}
```

---

## Notes for AI Agents

1. **X-Frame-Options:** Use DENY unless iframe needed
2. **CSP Development:** More permissive for dev tools
3. **CSP Production:** Strict policy, no unsafe-inline
4. **HSTS:** Only add with HTTPS enabled
5. **HSTS Preload:** Add to preload list for browsers
6. **Request ID:** Pass through from logging middleware
7. **Early in Stack:** Add headers on all responses
8. **Test Coverage:** Verify all headers present
