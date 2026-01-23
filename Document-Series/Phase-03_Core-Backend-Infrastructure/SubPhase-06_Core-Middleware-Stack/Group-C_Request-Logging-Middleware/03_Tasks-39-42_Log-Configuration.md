# Tasks 39-42: Log Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** C - Request Logging Middleware  
> **Document:** 03 of 04  
> **Tasks Covered:** 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-34-38_Request-Response-Logging.md](02_Tasks-34-38_Request-Response-Logging.md)
- **→ Next Document:** [04_Tasks-43-44_Registration-Testing.md](04_Tasks-43-44_Registration-Testing.md)

---

## Document Overview

This document covers the configuration of structured logging format, optional request body logging with sanitization, and path exclusion refinements.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 39 | Configure Log Format | Medium |
| 40 | Add Request Body Logging | Medium |
| 41 | Exclude Health Check | Simple |
| 42 | Exclude Static Files | Simple |

---

## Task 39: Configure Log Format

### Overview
Configure structured JSON logging format for machine-readable logs that can be easily parsed, searched, and analyzed by log aggregation tools.

### Dependencies
- Task 35: Log Response Details (logger usage)
- Project: Django settings configuration

### Instructions

1. **Install python-json-logger package**
   - Add to requirements.txt or pyproject.toml
   - Package: `python-json-logger`
   - Provides JSON formatter for Python logging

2. **Create logging configuration file**
   - Create `backend/config/settings/logging.py`
   - Or add to existing settings file
   - Configure formatters, handlers, and loggers

3. **Configure JSON formatter**
   - Use JsonFormatter from pythonjsonlogger
   - Define field format string
   - Include timestamp, level, logger name

4. **Configure API request handler**
   - StreamHandler for console output
   - Use JSON formatter
   - Set to INFO level

5. **Configure api.request logger**
   - Point to api handler
   - Set to INFO level
   - Disable propagation to root logger

6. **Import in main settings**
   - Import LOGGING config into main settings
   - Or define inline in settings.py

### Logging Configuration

```python
# backend/config/settings/logging.py
# or add to backend/config/settings/base.py

"""
Logging Configuration

Configures structured JSON logging for API requests and responses.
"""

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    
    'formatters': {
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(timestamp)s %(level)s %(name)s %(message)s',
            'rename_fields': {
                'levelname': 'level',
                'asctime': 'timestamp',
            },
        },
        'verbose': {
            'format': '[{levelname}] {asctime} {name} - {message}',
            'style': '{',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'level': 'INFO',
        },
        'api': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
            'level': 'INFO',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/api.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'json',
            'level': 'INFO',
        },
    },
    
    'loggers': {
        # API request/response logging
        'api.request': {
            'handlers': ['api', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        # Django framework logs
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        # Database query logs (development only)
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',  # Set to DEBUG to see queries
            'propagate': False,
        },
        # Application logs
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    },
    
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
```

### JSON Format Output Example

```json
{
    "timestamp": "2026-01-23T10:30:45.123456",
    "level": "INFO",
    "name": "api.request",
    "message": "Request completed: POST /api/orders/ - 201",
    "event": "request_completed",
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "method": "POST",
    "path": "/api/orders/",
    "status": 201,
    "duration_ms": 78.45,
    "tenant_id": "tenant_abc123",
    "user_id": "12345",
    "client_ip": "192.168.1.100"
}
```

### Format Field Mapping
| Python Field | JSON Field | Description |
|-------------|-----------|-------------|
| **levelname** | level | Log level (INFO, WARNING, ERROR) |
| **asctime** | timestamp | ISO 8601 timestamp |
| **name** | name | Logger name (api.request) |
| **message** | message | Log message |
| **extra** | (merged) | All extra fields merged at root |

### Handler Configuration
| Handler | Purpose | Format | Destination |
|---------|---------|--------|-------------|
| **api** | API requests | JSON | Console (stdout) |
| **file** | API requests | JSON | Rotating file |
| **console** | General logs | Verbose | Console (stdout) |

### Rotating File Handler
```python
# Configuration:
'filename': 'logs/api.log'      # Log file path
'maxBytes': 10485760            # 10MB per file
'backupCount': 5                # Keep 5 old files

# Results in:
# logs/api.log        (current)
# logs/api.log.1      (previous)
# logs/api.log.2      (older)
# logs/api.log.3
# logs/api.log.4
# logs/api.log.5      (oldest, deleted when new rotation)
```

### Development vs Production Configuration

```python
# Development - verbose console output
if DEBUG:
    LOGGING['loggers']['django.db.backends']['level'] = 'DEBUG'
    LOGGING['handlers']['api']['formatter'] = 'verbose'

# Production - JSON for log aggregation
else:
    LOGGING['handlers']['api']['formatter'] = 'json'
    LOGGING['handlers']['console']['level'] = 'WARNING'
```

### Expected Outcome
- Structured JSON logging configured
- API requests logged to console and file
- Log rotation prevents disk space issues
- Machine-readable format for parsing

### Verification Checklist
- [ ] python-json-logger added to requirements
- [ ] LOGGING configuration added to settings
- [ ] JSON formatter configured with field mapping
- [ ] api handler uses JSON formatter
- [ ] api.request logger configured
- [ ] File handler has rotation settings
- [ ] logs/ directory created or in .gitignore

---

## Task 40: Add Request Body Logging

### Overview
Add optional request body logging with sanitization to prevent logging sensitive data like passwords and tokens.

### Dependencies
- Task 34: Log Request Details
- Task 39: Configure Log Format

### Instructions

1. **Add configuration flag**
   - Add LOG_REQUEST_BODY setting
   - Default to False (disabled)
   - Enable only in development

2. **Create _sanitize_body method**
   - Accept body string or dict
   - Recursively sanitize sensitive fields
   - Return sanitized copy

3. **Define sensitive field patterns**
   - password, passwd, pwd
   - token, access_token, refresh_token
   - secret, api_key, private_key
   - credit_card, cvv, ssn

4. **Add body to request logs**
   - Check LOG_REQUEST_BODY flag
   - Parse request.body
   - Sanitize before logging
   - Handle JSON and form data

5. **Add size limit**
   - Define MAX_BODY_LENGTH
   - Truncate large bodies
   - Log size information

### Implementation

```python
# Add to settings
# backend/config/settings/base.py or dev.py

# Request body logging (disabled by default for security)
LOG_REQUEST_BODY = False  # Set to True in development only
MAX_BODY_LENGTH = 10000   # Maximum body length to log (10KB)

# Sensitive field patterns to sanitize
SENSITIVE_FIELDS = [
    'password', 'passwd', 'pwd',
    'token', 'access_token', 'refresh_token', 'id_token',
    'secret', 'api_key', 'private_key', 'secret_key',
    'credit_card', 'card_number', 'cvv', 'cvc',
    'ssn', 'social_security',
    'authorization',
]
```

```python
# Add to RequestLoggingMiddleware class
# backend/apps/core/middleware/logging.py

import json
from django.conf import settings


class RequestLoggingMiddleware:
    # ... existing code ...
    
    # Sensitive field patterns
    SENSITIVE_FIELDS = getattr(
        settings, 
        'SENSITIVE_FIELDS',
        ['password', 'token', 'secret', 'api_key']
    )
    
    def _log_request(self, request: HttpRequest) -> None:
        """
        Log request details.
        
        Args:
            request: The HTTP request
        """
        log_data = {
            'event': 'request_started',
            'request_id': getattr(request, 'request_id', None),
            'method': request.method,
            'path': request.path,
            'query_string': request.META.get('QUERY_STRING', ''),
            'client_ip': self._get_client_ip(request),
            'user_agent': self._get_user_agent(request),
            'user_id': self._get_user_id(request),
            'authenticated': hasattr(request, 'user') and request.user.is_authenticated,
        }
        
        # Add request body if enabled
        if getattr(settings, 'LOG_REQUEST_BODY', False):
            body_data = self._get_request_body(request)
            if body_data:
                log_data['body'] = body_data
        
        logger.info(
            f"Request started: {request.method} {request.path}",
            extra=log_data
        )
    
    def _get_request_body(self, request: HttpRequest) -> dict | str | None:
        """
        Extract and sanitize request body.
        
        Args:
            request: The HTTP request
            
        Returns:
            Sanitized body data or None
        """
        # Skip if no body or GET request
        if not request.body or request.method == 'GET':
            return None
        
        try:
            # Check body size
            max_length = getattr(settings, 'MAX_BODY_LENGTH', 10000)
            if len(request.body) > max_length:
                return f"<body too large: {len(request.body)} bytes>"
            
            # Try to parse as JSON
            content_type = request.META.get('CONTENT_TYPE', '')
            if 'application/json' in content_type:
                body_data = json.loads(request.body)
                # Sanitize sensitive fields
                return self._sanitize_body(body_data)
            
            # For form data, use request.POST
            elif 'application/x-www-form-urlencoded' in content_type:
                body_data = dict(request.POST)
                return self._sanitize_body(body_data)
            
            # For multipart (file uploads), don't log body
            elif 'multipart/form-data' in content_type:
                return "<multipart form data>"
            
            # Unknown content type
            else:
                return f"<{content_type}>"
                
        except (json.JSONDecodeError, UnicodeDecodeError):
            return "<unable to parse body>"
        except Exception as e:
            return f"<error reading body: {str(e)}>"
    
    def _sanitize_body(self, body: dict | list | str) -> dict | list | str:
        """
        Recursively sanitize sensitive fields from request body.
        
        Args:
            body: Request body data (dict, list, or string)
            
        Returns:
            Sanitized copy of body
        """
        if isinstance(body, dict):
            sanitized = {}
            for key, value in body.items():
                # Check if key matches sensitive field pattern
                if any(pattern in key.lower() for pattern in self.SENSITIVE_FIELDS):
                    sanitized[key] = "***REDACTED***"
                else:
                    # Recursively sanitize nested structures
                    sanitized[key] = self._sanitize_body(value)
            return sanitized
        
        elif isinstance(body, list):
            return [self._sanitize_body(item) for item in body]
        
        else:
            # Primitive values (string, int, etc.) - return as-is
            return body
```

### Sanitization Examples

```python
# Original request body
{
    "username": "john.doe",
    "password": "secret123",
    "email": "john@example.com",
    "api_key": "sk_live_abc123xyz"
}

# Sanitized for logging
{
    "username": "john.doe",
    "password": "***REDACTED***",
    "email": "john@example.com",
    "api_key": "***REDACTED***"
}
```

```python
# Nested structures
{
    "user": {
        "name": "John Doe",
        "credentials": {
            "password": "secret123",
            "token": "abc123xyz"
        }
    }
}

# Sanitized
{
    "user": {
        "name": "John Doe",
        "credentials": {
            "password": "***REDACTED***",
            "token": "***REDACTED***"
        }
    }
}
```

### Body Logging Decision Tree
```
Request has body?
    │
    ├── NO: Return None
    │
    └── YES
        │
        ├── Body > MAX_LENGTH?
        │   └── YES: Return "<too large>"
        │
        ├── Content-Type?
        │   ├── application/json: Parse and sanitize
        │   ├── form-urlencoded: Use request.POST, sanitize
        │   ├── multipart/form-data: Return "<multipart>"
        │   └── other: Return "<content-type>"
        │
        └── Parse error?
            └── YES: Return "<unable to parse>"
```

### Security Considerations
| Risk | Mitigation |
|------|------------|
| **Password logging** | Sanitize all password-like fields |
| **Token logging** | Sanitize all token fields |
| **Large bodies** | Size limit and truncation |
| **File uploads** | Don't log multipart data |
| **Parse errors** | Catch and log error message only |
| **Production leaks** | Disable by default, enable only in dev |

### Expected Outcome
- Request bodies logged only when enabled
- Sensitive fields always sanitized
- Large bodies truncated
- File uploads not logged
- Secure by default

### Verification Checklist
- [ ] LOG_REQUEST_BODY setting added (default False)
- [ ] MAX_BODY_LENGTH setting added
- [ ] SENSITIVE_FIELDS list defined
- [ ] _get_request_body method extracts body
- [ ] _sanitize_body recursively sanitizes dicts and lists
- [ ] Content type checking handles JSON and form data
- [ ] Size limit prevents logging huge bodies
- [ ] Multipart form data returns placeholder
- [ ] Body added to log_data only if enabled

---

## Task 41: Exclude Health Check

### Overview
Refine path exclusions to skip health check endpoints and prevent log spam.

### Dependencies
- Task 30: Create RequestLoggingMiddleware Class (EXCLUDED_PATHS)

### Instructions

1. **Add health check patterns**
   - Add /health/ to EXCLUDED_PATHS
   - Add /health/liveness/ for Kubernetes
   - Add /health/readiness/ for Kubernetes
   - Add /ready/ as alias

2. **Test exclusion**
   - Verify health checks don't create logs
   - Check _should_log returns False
   - Confirm no performance impact

3. **Document excluded paths**
   - Add comment explaining exclusions
   - Note that health checks are high-frequency
   - Document Kubernetes compatibility

### Implementation

```python
class RequestLoggingMiddleware:
    """
    Middleware for logging HTTP requests and responses.
    
    ... (docstring continues)
    """
    
    # Paths that should not be logged
    # These are excluded to prevent log spam and reduce overhead
    EXCLUDED_PATHS = [
        # Health checks (called frequently by load balancers)
        '/health/',
        '/health/liveness/',   # Kubernetes liveness probe
        '/health/readiness/',  # Kubernetes readiness probe
        '/ready/',             # Alternative readiness endpoint
        '/ping/',              # Simple health check
        
        # Static and media files (handled by web server in production)
        '/static/',
        '/media/',
        
        # Django admin static files
        '/admin/jsi18n/',
        
        # Monitoring and metrics
        '/metrics/',
        '/prometheus/',
    ]
```

### Health Check Patterns
| Path | Purpose | Called By |
|------|---------|-----------|
| **/health/** | General health check | Load balancers |
| **/health/liveness/** | Kubernetes liveness | K8s kubelet |
| **/health/readiness/** | Kubernetes readiness | K8s kubelet |
| **/ready/** | Readiness alias | Load balancers |
| **/ping/** | Simple ping | Monitoring tools |

### Why Exclude Health Checks?
```python
# Health checks are called every few seconds:
# - Load balancer: every 5 seconds
# - Kubernetes liveness: every 10 seconds
# - Kubernetes readiness: every 5 seconds

# Without exclusion, logs would be dominated by health checks:
# [INFO] Request completed: GET /health/ - 200
# [INFO] Request completed: GET /health/ - 200
# [INFO] Request completed: GET /health/ - 200
# [INFO] Request completed: GET /health/ - 200
# [INFO] Request completed: POST /api/orders/ - 201  <- Actual request
# [INFO] Request completed: GET /health/ - 200
# [INFO] Request completed: GET /health/ - 200

# With exclusion, only actual requests are logged:
# [INFO] Request completed: POST /api/orders/ - 201
# [INFO] Request completed: GET /api/products/ - 200
```

### Kubernetes Health Check Example
```yaml
# Kubernetes deployment with health checks
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
spec:
  containers:
  - name: api
    image: pos-api:latest
    livenessProbe:
      httpGet:
        path: /health/liveness/
        port: 8000
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /health/readiness/
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 5
```

### Expected Outcome
- Health check endpoints excluded from logs
- No log spam from frequent health checks
- Performance improved (no timing overhead)
- Kubernetes compatibility

### Verification Checklist
- [ ] /health/ added to EXCLUDED_PATHS
- [ ] /health/liveness/ added for Kubernetes
- [ ] /health/readiness/ added for Kubernetes
- [ ] /ready/ and /ping/ added
- [ ] Comment explains why paths are excluded
- [ ] _should_log correctly filters these paths

---

## Task 42: Exclude Static Files

### Overview
Exclude static and media file requests to prevent logging overhead for assets served by Django during development.

### Dependencies
- Task 30: Create RequestLoggingMiddleware Class (EXCLUDED_PATHS)
- Task 41: Exclude Health Check

### Instructions

1. **Add static file patterns**
   - /static/ for static assets
   - /media/ for uploaded files
   - /admin/jsi18n/ for Django admin
   - /favicon.ico for browser requests

2. **Document static file handling**
   - Note that in production, static files served by nginx/CDN
   - Exclusion mainly for development
   - Reduces log noise during development

3. **Consider custom patterns**
   - Allow configuration of additional exclusions
   - Support wildcard patterns
   - Document how to add custom exclusions

### Implementation

```python
class RequestLoggingMiddleware:
    """
    Middleware for logging HTTP requests and responses.
    
    ... (docstring continues)
    """
    
    # Paths that should not be logged
    # These are excluded to prevent log spam and reduce overhead
    EXCLUDED_PATHS = [
        # Health checks (called frequently by load balancers)
        '/health/',
        '/health/liveness/',   # Kubernetes liveness probe
        '/health/readiness/',  # Kubernetes readiness probe
        '/ready/',             # Alternative readiness endpoint
        '/ping/',              # Simple health check
        
        # Static and media files
        # In production, these should be served by nginx/CDN
        # In development, Django serves them - exclude to reduce log noise
        '/static/',            # Static assets (CSS, JS, images)
        '/media/',             # User-uploaded files
        '/favicon.ico',        # Browser requests
        
        # Django admin static files
        '/admin/jsi18n/',      # Admin internationalization
        
        # Monitoring and metrics
        '/metrics/',           # Prometheus metrics
        '/prometheus/',        # Prometheus endpoint
    ]
    
    def __init__(self, get_response: Callable):
        """
        Initialize the middleware.
        
        Args:
            get_response: Callable that takes a request and returns a response
        """
        self.get_response = get_response
        
        # Allow custom exclusion patterns from settings
        custom_exclusions = getattr(settings, 'LOG_EXCLUDED_PATHS', [])
        self.excluded_paths = list(self.EXCLUDED_PATHS) + custom_exclusions
    
    def _should_log(self, request: HttpRequest) -> bool:
        """
        Check if the request path should be logged.
        
        Args:
            request: The HTTP request
            
        Returns:
            True if should log, False if should skip
        """
        return not any(
            request.path.startswith(path) 
            for path in self.excluded_paths
        )
```

### Custom Exclusions Configuration

```python
# backend/config/settings/base.py

# Custom paths to exclude from logging
# Add project-specific paths here
LOG_EXCLUDED_PATHS = [
    '/api/internal/',      # Internal API endpoints
    '/webhooks/stripe/',   # High-frequency webhooks
    '/socket/',            # WebSocket connections
]
```

### Static File Serving
| Environment | Served By | Logged? |
|------------|-----------|---------|
| **Development** | Django | No (excluded) |
| **Production** | Nginx/CDN | N/A (never hits Django) |

### Why Exclude Static Files?
```python
# Without exclusion, every page load generates dozens of logs:
# [INFO] Request completed: GET /api/products/ - 200
# [INFO] Request completed: GET /static/css/main.css - 200
# [INFO] Request completed: GET /static/css/theme.css - 200
# [INFO] Request completed: GET /static/js/app.js - 200
# [INFO] Request completed: GET /static/js/vendor.js - 200
# [INFO] Request completed: GET /static/images/logo.png - 200
# [INFO] Request completed: GET /static/images/icon.svg - 200
# [INFO] Request completed: GET /media/products/img1.jpg - 200
# [INFO] Request completed: GET /media/products/img2.jpg - 200
# [INFO] Request completed: GET /favicon.ico - 200

# With exclusion:
# [INFO] Request completed: GET /api/products/ - 200
```

### Production Static File Serving
```nginx
# nginx configuration for production
server {
    listen 80;
    server_name example.com;
    
    # Static files - served directly by nginx
    location /static/ {
        alias /var/www/static/;
        expires 30d;
        access_log off;  # Don't even log at nginx level
    }
    
    # Media files - served directly by nginx
    location /media/ {
        alias /var/www/media/;
        expires 7d;
        access_log off;
    }
    
    # API requests - proxy to Django
    location / {
        proxy_pass http://django:8000;
        # ... proxy headers ...
    }
}
```

### Expected Outcome
- Static and media files excluded from logs
- Custom exclusion paths supported
- Development logs cleaner
- No performance overhead for assets

### Verification Checklist
- [ ] /static/ added to EXCLUDED_PATHS
- [ ] /media/ added to EXCLUDED_PATHS
- [ ] /favicon.ico added
- [ ] /admin/jsi18n/ added
- [ ] Custom exclusions loaded from settings
- [ ] excluded_paths combines defaults and custom
- [ ] _should_log uses excluded_paths list
- [ ] Comment explains static file handling

---

## Group C Next Steps

After completing Tasks 39-42, proceed to:
- **Next Document:** [04_Tasks-43-44_Registration-Testing.md](04_Tasks-43-44_Registration-Testing.md)
- Register middleware in Django settings
- Create comprehensive tests
- Verify logging output
- Test exclusion patterns

---

## Notes for AI Agents

1. **JSON Logging:** python-json-logger is industry standard, use it
2. **Sensitive Data:** Never log passwords, tokens, or secrets
3. **Size Limits:** Always limit body size to prevent memory issues
4. **Health Checks:** Exclude high-frequency endpoints to reduce noise
5. **Static Files:** In production, these never hit Django (served by nginx)
6. **Custom Exclusions:** Support project-specific exclusion patterns
7. **Log Rotation:** Configure to prevent disk space issues
8. **Development vs Production:** Different log levels and formats
