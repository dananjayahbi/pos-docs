# Tasks 51-52: Content Security Policy

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** D - Security Headers Middleware  
> **Document:** 02 of 04  
> **Tasks Covered:** 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-50_Security-Middleware-Setup.md](01_Tasks-45-50_Security-Middleware-Setup.md)
- **→ Next Document:** [03_Tasks-53-56_Advanced-Headers.md](03_Tasks-53-56_Advanced-Headers.md)

---

## Document Overview

This document covers the implementation of Content-Security-Policy (CSP) header with environment-specific configurations. CSP is one of the most powerful security headers, controlling which resources can be loaded and executed.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Add Content-Security-Policy | Medium |
| 52 | Configure CSP Directives | Medium |

---

## Task 51: Add Content-Security-Policy

### Overview
Add the Content-Security-Policy header to control which resources (scripts, styles, images, etc.) can be loaded and executed. This is the most powerful security header for preventing XSS and data injection attacks.

### Dependencies
- Task 50: Add Referrer-Policy

### Instructions

1. **Add `_get_csp_header` method**
   - Create helper method to generate CSP string
   - Build directive list
   - Join with semicolons
   - Return complete CSP header value

2. **Update `_add_security_headers` method**
   - Call `_get_csp_header()`
   - Set Content-Security-Policy header
   - Add inline comment

3. **Implement basic CSP directives**
   - default-src 'self'
   - script-src with appropriate policies
   - style-src with appropriate policies
   - img-src for image sources
   - font-src for web fonts
   - connect-src for AJAX/WebSocket
   - frame-ancestors for iframe embedding

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
    
    # Additional headers will be added in subsequent tasks
    
    return response

def _get_csp_header(self):
    """
    Generate Content-Security-Policy header value.
    
    CSP directives control which resources can be loaded and executed.
    More permissive in development for debugging tools.
    Strict in production for maximum security.
    
    Returns:
        str: Complete CSP header value with all directives
    """
    # Basic CSP directives
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
```

### CSP Directive Explanation
| Directive | Value | Purpose |
|-----------|-------|---------|
| **default-src** | 'self' | Fallback for all resource types |
| **script-src** | 'self' 'unsafe-inline' | JavaScript sources |
| **style-src** | 'self' 'unsafe-inline' | CSS sources |
| **img-src** | 'self' data: https: | Image sources |
| **font-src** | 'self' https://fonts.gstatic.com | Web font sources |
| **connect-src** | 'self' | AJAX, WebSocket, EventSource |
| **frame-ancestors** | 'none' | Who can embed this page |

### CSP Source Values
| Value | Meaning | Example |
|-------|---------|---------|
| **'self'** | Same origin | https://example.com |
| **'none'** | Nothing allowed | Block all |
| **'unsafe-inline'** | Inline scripts/styles | `<script>...</script>` |
| **'unsafe-eval'** | eval() and similar | `eval('code')` |
| **data:** | Data URIs | `data:image/png;base64,...` |
| **https:** | Any HTTPS source | https://cdn.example.com |
| **domain** | Specific domain | https://trusted.com |

### Why unsafe-inline?
For initial implementation, 'unsafe-inline' is used for compatibility:
- Many frameworks use inline styles
- Development tools inject inline scripts
- Gradual migration to nonces/hashes

**Production Goal:** Remove 'unsafe-inline' and use:
- Nonces: `<script nonce="random">`
- Hashes: `script-src 'sha256-hash'`
- External files only

### CSP Blocking Behavior
```
// Without CSP:
<script src="https://evil.com/malware.js"></script>  ✓ Loads
<script>alert('XSS')</script>                        ✓ Executes

// With CSP (script-src 'self'):
<script src="https://evil.com/malware.js"></script>  ✗ Blocked
<script src="/static/app.js"></script>               ✓ Allowed
<script>alert('XSS')</script>                        ✗ Blocked (no unsafe-inline)
```

### Frame-Ancestors Directive
Complements X-Frame-Options with more control:
- `'none'`: No framing (like X-Frame-Options: DENY)
- `'self'`: Same-origin framing (like SAMEORIGIN)
- `https://trusted.com`: Specific origins

### Expected Outcome
- `_get_csp_header` method implemented
- Content-Security-Policy header added
- Basic CSP directives configured
- Resource loading controlled

### Verification Checklist
- [ ] `_get_csp_header` method created
- [ ] Method returns properly formatted CSP string
- [ ] CSP header added in `_add_security_headers`
- [ ] All 7 directives included
- [ ] Directives joined with "; "
- [ ] Inline comment explains CSP purpose

---

## Task 52: Configure CSP Directives

### Overview
Enhance the CSP implementation with environment-specific configurations. Development needs more permissive policies for debugging, while production should be strict.

### Dependencies
- Task 51: Add Content-Security-Policy

### Instructions

1. **Add environment detection**
   - Check settings.DEBUG
   - Use different CSP for development vs production
   - Add inline comments explaining differences

2. **Create development CSP**
   - More permissive for debugging tools
   - Allow 'unsafe-eval' for development tools
   - Allow WebSocket connections
   - Include localhost and development servers

3. **Create production CSP**
   - Strict policy for maximum security
   - No 'unsafe-inline' (future goal)
   - No 'unsafe-eval'
   - HTTPS only sources
   - Add upgrade-insecure-requests

4. **Add CSP configuration comments**
   - Document each directive purpose
   - Explain environment differences
   - Note future improvements

### Enhanced Implementation

```python
def _get_csp_header(self):
    """
    Generate Content-Security-Policy header value.
    
    CSP directives control which resources can be loaded and executed.
    More permissive in development for debugging tools.
    Strict in production for maximum security.
    
    Environment-specific behavior:
    - Development: Allows unsafe-inline, unsafe-eval, ws: connections
    - Production: Strict policy, HTTPS only, upgrade insecure requests
    
    Returns:
        str: Complete CSP header value with all directives
    """
    # Determine if we're in development or production
    is_debug = getattr(settings, 'DEBUG', False)
    
    if is_debug:
        # Development CSP - More permissive for debugging
        directives = [
            # Default policy for unspecified resource types
            "default-src 'self'",
            
            # Allow inline scripts and eval for development tools
            # Hot reload, React DevTools, etc. need these
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            
            # Allow inline styles for development
            # CSS hot reload and styled-components need this
            "style-src 'self' 'unsafe-inline'",
            
            # Allow images from any HTTPS source and data URIs
            "img-src 'self' data: https:",
            
            # Allow web fonts from common CDNs
            "font-src 'self' https://fonts.gstatic.com",
            
            # Allow AJAX and WebSocket connections
            # WebSocket for hot reload (ws: for local, wss: for remote)
            "connect-src 'self' ws://localhost:* wss://localhost:*",
            
            # Prevent framing by any site (same as X-Frame-Options: DENY)
            "frame-ancestors 'none'",
        ]
    else:
        # Production CSP - Strict security policy
        directives = [
            # Default policy - same origin only
            "default-src 'self'",
            
            # Scripts from same origin only
            # TODO: Remove unsafe-inline and use nonces/hashes
            "script-src 'self' 'unsafe-inline'",
            
            # Styles from same origin only
            # TODO: Remove unsafe-inline and use nonces/hashes
            "style-src 'self' 'unsafe-inline'",
            
            # Images from same origin, data URIs, and HTTPS sources
            "img-src 'self' data: https:",
            
            # Fonts from same origin and Google Fonts
            "font-src 'self' https://fonts.gstatic.com",
            
            # AJAX connections to same origin only
            "connect-src 'self'",
            
            # Prevent framing by any site
            "frame-ancestors 'none'",
            
            # Upgrade insecure requests (HTTP → HTTPS)
            "upgrade-insecure-requests",
            
            # Block all mixed content
            "block-all-mixed-content",
        ]
    
    return "; ".join(directives)
```

### Development vs Production CSP
| Directive | Development | Production | Reason |
|-----------|-------------|------------|--------|
| **script-src** | 'unsafe-inline' 'unsafe-eval' | 'unsafe-inline' only | Dev tools need eval |
| **connect-src** | 'self' ws://localhost:* | 'self' | Hot reload needs WebSocket |
| **upgrade-insecure-requests** | Not included | Included | Force HTTPS |
| **block-all-mixed-content** | Not included | Included | No HTTP resources |

### Development Features Requiring Permissive CSP
| Feature | Requires | Reason |
|---------|----------|--------|
| **Hot Module Reload** | ws:, unsafe-eval | WebSocket for updates |
| **React DevTools** | unsafe-eval | Inspect component tree |
| **Vue DevTools** | unsafe-eval | Debug reactive state |
| **Source Maps** | unsafe-eval | Map minified to original |
| **Styled Components** | unsafe-inline | Runtime CSS injection |

### Production Security Enhancements
1. **upgrade-insecure-requests:**
   - Automatically upgrades HTTP → HTTPS
   - Example: `<img src="http://example.com/img.jpg">` → `https://example.com/img.jpg`
   - Prevents mixed content warnings

2. **block-all-mixed-content:**
   - Blocks any HTTP resource on HTTPS page
   - Stricter than upgrade-insecure-requests
   - Fails if resource not available on HTTPS

3. **frame-ancestors 'none':**
   - Prevents any iframe embedding
   - More flexible than X-Frame-Options
   - Can specify allowed origins if needed

### Future Improvements
```python
# Goal: Remove unsafe-inline with nonces

# In view/middleware:
nonce = base64.b64encode(os.urandom(16)).decode('utf-8')
request.csp_nonce = nonce

# In CSP:
"script-src 'self' 'nonce-{nonce}'"

# In template:
<script nonce="{{ request.csp_nonce }}">
    // Inline script
</script>
```

### CSP Violation Reporting
```python
# Add report-uri directive for CSP violations
directives.append("report-uri /api/csp-report/")

# Create endpoint to log violations
# Helps identify CSP issues in production
```

### Custom CSP Overrides
```python
# Allow custom CSP configuration in settings

# settings.py
CSP_OVERRIDES = {
    'script-src': ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
}

# In _get_csp_header:
custom_csp = getattr(settings, 'CSP_OVERRIDES', None)
if custom_csp:
    # Merge custom directives with defaults
    pass
```

### Browser Support
| Browser | CSP Version | Features |
|---------|-------------|----------|
| Chrome | CSP 3 | Full support |
| Firefox | CSP 3 | Full support |
| Safari | CSP 2 | Most features |
| Edge | CSP 3 | Full support |
| IE 11 | CSP 1 | Basic support |

### Expected Outcome
- Environment-specific CSP implemented
- Development CSP allows debugging tools
- Production CSP enforces strict security
- Comprehensive documentation added

### Verification Checklist
- [ ] Environment detection using settings.DEBUG
- [ ] Development CSP includes unsafe-eval
- [ ] Development CSP allows WebSocket (ws:)
- [ ] Production CSP includes upgrade-insecure-requests
- [ ] Production CSP includes block-all-mixed-content
- [ ] Both environments have frame-ancestors 'none'
- [ ] Comments explain each directive
- [ ] Future improvements documented

---

## Document Next Steps

After completing Tasks 51-52, proceed to:
- **Next Document:** [03_Tasks-53-56_Advanced-Headers.md](03_Tasks-53-56_Advanced-Headers.md)
- Implement Permissions-Policy header
- Add Strict-Transport-Security (HSTS)
- Implement X-Request-ID for request tracking

---

## Notes for AI Agents

1. **CSP Syntax:** Directives separated by "; ", sources separated by space
2. **Quote Values:** Special values like 'self', 'none', 'unsafe-inline' need quotes
3. **Environment:** Check settings.DEBUG for environment detection
4. **WebSocket:** Development needs ws: and wss: for hot reload
5. **unsafe-eval:** Required for many development tools, avoid in production
6. **Nonces:** Future improvement to remove unsafe-inline
7. **Testing:** Test with browser DevTools Console for CSP violations
8. **Documentation:** Keep comments updated with directive changes
