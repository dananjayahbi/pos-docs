# Tasks 55-60: Schema Extensions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** E - Documentation Enhancements  
> **Document:** 01 of 03  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_ReDoc-Setup/](../Group-D_ReDoc-Setup/)
- **→ Next Document:** [02_Tasks-61-66_Schemas-Examples.md](02_Tasks-61-66_Schemas-Examples.md)

---

## Document Overview

This document covers creating custom schema extensions to enhance API documentation with multi-tenant headers, JWT authentication flows, and standardized error responses.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create extensions.py File | Simple |
| 56 | Create Custom Preprocessor | Complex |
| 57 | Add Tenant Header Doc | Medium |
| 58 | Document JWT Authentication | Medium |
| 59 | Document Refresh Token | Simple |
| 60 | Document Error Responses | Medium |

---

## Task 55: Create extensions.py File

### Overview
Create an extensions.py file in the api_docs module to house custom OpenAPI schema preprocessing functions and documentation enhancements.

### Dependencies
- Task 54: Compare with Swagger (Group D)

### Instructions

1. **Create extensions file**
   - Navigate to `backend/apps/core/api_docs/`
   - Create new file named `extensions.py`
   - Initialize with file docstring

2. **Add file header documentation**
   - Add comprehensive docstring
   - Explain custom schema extensions
   - Note preprocessing functionality
   - Reference drf-spectacular hooks

3. **Add import statements**
   - Import typing modules
   - Import spectacular utilities
   - Import Django/DRF components
   - Prepare for custom functions

4. **Add file structure**
   - Organize by function type
   - Preprocessors section
   - Schema enhancements section
   - Helper functions section

5. **Prepare for custom code**
   - Add section comments
   - Plan preprocessor structure
   - Prepare for exports

### File Structure
```python
"""
API Documentation Extensions

Custom OpenAPI schema preprocessing and enhancements for
LankaCommerce Cloud API documentation. Includes multi-tenant
header documentation, authentication flows, and error schemas.
"""

from typing import Any, Dict
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.extensions import OpenApiSerializerExtension

# Custom preprocessor functions will be added here

# Helper functions will be added here
```

### Expected Outcome
```
backend/apps/core/api_docs/
├── __init__.py
├── urls.py
└── extensions.py         # New file
```

### Verification Checklist
- [ ] extensions.py created in api_docs directory
- [ ] File docstring added
- [ ] Import statements added
- [ ] File structure organized
- [ ] Ready for custom functions

---

## Task 56: Create Custom Preprocessor

### Overview
Create a custom OpenAPI schema preprocessor to enhance the generated schema with multi-tenant headers and additional documentation.

### Dependencies
- Task 55: Create extensions.py File

### Instructions

1. **Create preprocessor function**
   - Define `custom_preprocessing_hook` function
   - Accept required parameters (endpoints, **kwargs)
   - Return modified endpoints list

2. **Add function documentation**
   - Document preprocessor purpose
   - Explain parameters
   - Note modifications made
   - Reference registration process

3. **Implement tenant header injection**
   - Iterate through endpoints
   - Add X-Tenant-ID to parameters
   - Set as required header
   - Add description

4. **Add authentication enhancement**
   - Check for authenticated endpoints
   - Enhance security documentation
   - Add authentication notes

5. **Configure in settings**
   - Add PREPROCESSING_HOOKS to SPECTACULAR_SETTINGS
   - Register custom preprocessor
   - Verify hook executes

### Preprocessor Implementation
```python
def custom_preprocessing_hook(endpoints):
    """
    Custom OpenAPI schema preprocessing.
    
    Enhances the schema with:
    - X-Tenant-ID header for multi-tenant endpoints
    - Enhanced authentication documentation
    - Additional endpoint metadata
    
    Args:
        endpoints: List of endpoint tuples (path, method, callback)
        
    Returns:
        Modified endpoints list
    """
    processed_endpoints = []
    
    for (path, path_regex, method, callback) in endpoints:
        # Add multi-tenant header to tenant-scoped endpoints
        if not path.startswith('/api/public/'):
            # Process endpoint to add X-Tenant-ID header
            pass
            
        processed_endpoints.append((path, path_regex, method, callback))
    
    return processed_endpoints
```

### Settings Configuration
```python
# In SPECTACULAR_SETTINGS
SPECTACULAR_SETTINGS = {
    # ... existing settings ...
    
    # Custom preprocessing hooks
    'PREPROCESSING_HOOKS': [
        'apps.core.api_docs.extensions.custom_preprocessing_hook',
    ],
}
```

### Preprocessor Capabilities
| Enhancement | Description |
|-------------|-------------|
| **Headers** | Add required multi-tenant headers |
| **Auth** | Enhance authentication docs |
| **Metadata** | Add additional endpoint info |
| **Examples** | Inject example values |

### Expected Outcome
```
backend/
├── apps/core/api_docs/
│   └── extensions.py         # Preprocessor added
└── config/settings/
    └── api_docs.py           # PREPROCESSING_HOOKS configured
```

### Verification Checklist
- [ ] custom_preprocessing_hook function created
- [ ] Function documented
- [ ] Processes endpoints list
- [ ] Returns modified endpoints
- [ ] Registered in PREPROCESSING_HOOKS
- [ ] Settings import updated

---

## Task 57: Add Tenant Header Doc

### Overview
Document the X-Tenant-ID header requirement for multi-tenant API endpoints in the OpenAPI schema.

### Dependencies
- Task 56: Create Custom Preprocessor

### Instructions

1. **Create header documentation function**
   - Define function to add tenant header docs
   - Accept schema parameters
   - Return enhanced schema

2. **Add header to parameters**
   - Define X-Tenant-ID parameter
   - Set type as string
   - Mark as required
   - Add description

3. **Add header description**
   - Explain multi-tenant purpose
   - Note tenant isolation
   - Reference tenant selection
   - Include example value

4. **Add header to global parameters**
   - Add to SPECTACULAR_SETTINGS
   - Define in COMPONENT_SECURITY_SCHEMES or parameters
   - Ensure appears in all endpoints

5. **Document tenant context**
   - Explain tenant database schema
   - Note data isolation
   - Reference tenant provisioning

### Header Documentation
```python
# In SPECTACULAR_SETTINGS
SPECTACULAR_SETTINGS = {
    # ... existing settings ...
    
    # Global parameters (multi-tenant header)
    'APPEND_PARAMETERS': {
        'X-Tenant-ID': {
            'name': 'X-Tenant-ID',
            'in': 'header',
            'required': True,
            'schema': {
                'type': 'string',
                'format': 'uuid',
            },
            'description': '''
            Tenant identifier for multi-tenant isolation.
            Each request must include the tenant ID to access
            tenant-specific data. Contact support for your tenant ID.
            ''',
            'example': '550e8400-e29b-41d4-a716-446655440000',
        }
    },
}
```

### Tenant Header Details
| Aspect | Value |
|--------|-------|
| **Name** | X-Tenant-ID |
| **Location** | Header |
| **Type** | String (UUID) |
| **Required** | Yes |
| **Purpose** | Tenant isolation |

### Multi-Tenant Documentation
- **Purpose:** Data isolation between tenants
- **Schema:** Each tenant has separate database schema
- **Security:** Prevents cross-tenant data access
- **Selection:** Determined from header value

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Tenant header documented
```

### Verification Checklist
- [ ] X-Tenant-ID parameter documented
- [ ] Added to SPECTACULAR_SETTINGS
- [ ] Type set to string/UUID
- [ ] Marked as required
- [ ] Description explains multi-tenancy
- [ ] Example value provided
- [ ] Appears in schema

---

## Task 58: Document JWT Authentication

### Overview
Document the JWT authentication flow including token acquisition and usage in API requests.

### Dependencies
- Task 57: Add Tenant Header Doc

### Instructions

1. **Create authentication documentation**
   - Add to SPECTACULAR_SETTINGS DESCRIPTION
   - Create authentication section
   - Explain JWT token usage

2. **Document token endpoint**
   - Describe /api/token/ endpoint
   - Explain POST request format
   - Show username/password fields
   - Document response format

3. **Document token usage**
   - Explain Bearer authentication
   - Show Authorization header format
   - Provide example header
   - Note token expiration

4. **Add authentication flow**
   - Step 1: POST credentials to /api/token/
   - Step 2: Receive access and refresh tokens
   - Step 3: Include access token in requests
   - Step 4: Refresh when expired

5. **Update security schemes**
   - Already configured in Group C
   - Verify Bearer scheme present
   - Ensure JWT format noted

### Authentication Documentation
```python
# Add to SPECTACULAR_SETTINGS['DESCRIPTION']
AUTHENTICATION_DOCS = '''

## Authentication

The API uses JWT (JSON Web Token) authentication. To authenticate:

1. **Obtain Token**: POST to `/api/token/` with credentials
   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

2. **Receive Tokens**: Response contains access and refresh tokens
   ```json
   {
     "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

3. **Use Access Token**: Include in Authorization header
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
   ```

4. **Token Expiry**: Access tokens expire in 60 minutes
5. **Refresh**: Use refresh token to obtain new access token
'''
```

### Authentication Flow
```
1. Client → POST /api/token/
           {username, password}

2. Server → 200 OK
           {access_token, refresh_token}

3. Client → GET /api/endpoint/
           Authorization: Bearer {access_token}

4. Server → 200 OK
           {data}
```

### Token Details
| Token Type | Expiry | Purpose |
|------------|--------|---------|
| **Access** | 60 min | API requests |
| **Refresh** | 24 hours | Renew access token |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # JWT auth documented
```

### Verification Checklist
- [ ] Authentication section added
- [ ] Token endpoint documented
- [ ] Request format shown
- [ ] Response format shown
- [ ] Header format explained
- [ ] Token expiry noted
- [ ] Refresh flow mentioned

---

## Task 59: Document Refresh Token

### Overview
Document the refresh token endpoint and process for obtaining new access tokens without re-authentication.

### Dependencies
- Task 58: Document JWT Authentication

### Instructions

1. **Add refresh token documentation**
   - Extend authentication documentation
   - Add refresh section
   - Explain refresh purpose

2. **Document refresh endpoint**
   - Describe /api/token/refresh/ endpoint
   - Explain POST request format
   - Show refresh token field
   - Document response format

3. **Explain refresh flow**
   - When access token expires
   - POST refresh token to endpoint
   - Receive new access token
   - Continue making requests

4. **Add refresh notes**
   - Refresh tokens also expire
   - Re-authentication needed after refresh expires
   - Security best practices
   - Token rotation considerations

5. **Update authentication flow**
   - Add refresh step to flow
   - Show complete lifecycle
   - Include error scenarios

### Refresh Token Documentation
```python
# Add to authentication documentation
REFRESH_TOKEN_DOCS = '''

### Token Refresh

When the access token expires (after 60 minutes), use the refresh
token to obtain a new access token without re-authenticating:

1. **Refresh Request**: POST to `/api/token/refresh/`
   ```json
   {
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

2. **New Access Token**: Response contains new access token
   ```json
   {
     "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

3. **Refresh Expiry**: Refresh tokens expire in 24 hours
4. **Re-authentication**: After refresh expires, login again

**Security Note**: Store refresh tokens securely and never expose
them in client-side code or URLs.
'''
```

### Complete Token Lifecycle
```
1. Initial Login
   → POST /api/token/
   → Receive access + refresh tokens

2. Make API Requests (up to 60 min)
   → Include access token in headers
   → Successful requests

3. Access Token Expires
   → API returns 401 Unauthorized
   → Token expired error

4. Refresh Access Token
   → POST /api/token/refresh/
   → Receive new access token
   → Continue making requests

5. Refresh Token Expires (after 24 hours)
   → Refresh request fails
   → Must login again (step 1)
```

### Token Lifecycle
| Stage | Duration | Action |
|-------|----------|--------|
| **Access Valid** | 60 min | Use for API requests |
| **Access Expired** | After 60 min | Refresh token |
| **Refresh Valid** | 24 hours | Can refresh access |
| **Refresh Expired** | After 24 hours | Re-authenticate |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Refresh token documented
```

### Verification Checklist
- [ ] Refresh section added
- [ ] Refresh endpoint documented
- [ ] Request format shown
- [ ] Response format shown
- [ ] Refresh expiry noted
- [ ] Complete lifecycle documented
- [ ] Security notes added

---

## Task 60: Document Error Responses

### Overview
Document standard error response formats to help developers understand and handle API errors consistently.

### Dependencies
- Task 59: Document Refresh Token

### Instructions

1. **Create error documentation section**
   - Add errors section to description
   - Explain error format
   - List common status codes

2. **Document error structure**
   - Standard error response format
   - Error code field
   - Error message field
   - Error details field

3. **List common errors**
   - 400 Bad Request (validation errors)
   - 401 Unauthorized (auth errors)
   - 403 Forbidden (permission errors)
   - 404 Not Found
   - 500 Internal Server Error

4. **Provide error examples**
   - Example validation error
   - Example authentication error
   - Example permission error
   - Example not found error

5. **Add error handling guidance**
   - Check response status codes
   - Parse error messages
   - Handle specific errors
   - Retry strategies

### Error Response Documentation
```python
# Add to SPECTACULAR_SETTINGS description
ERROR_DOCS = '''

## Error Responses

The API returns standardized error responses for all error conditions:

### Error Format
```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": ["Specific field error"]
    }
  }
}
```

### Common HTTP Status Codes

| Code | Description | Example |
|------|-------------|---------|
| **400** | Bad Request | Validation errors |
| **401** | Unauthorized | Missing/invalid token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Internal server error |

### Error Examples

**Validation Error (400)**
```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid input data",
    "details": {
      "price": ["Ensure this value is greater than 0."]
    }
  }
}
```

**Authentication Error (401)**
```json
{
  "error": {
    "code": "authentication_failed",
    "message": "Authentication credentials were not provided."
  }
}
```

**Permission Error (403)**
```json
{
  "error": {
    "code": "permission_denied",
    "message": "You do not have permission to perform this action."
  }
}
```
'''
```

### Standard Error Format
| Field | Type | Description |
|-------|------|-------------|
| **error** | Object | Error container |
| **error.code** | String | Machine-readable error code |
| **error.message** | String | Human-readable message |
| **error.details** | Object | Field-specific errors |

### HTTP Status Codes
- **2xx:** Success responses
- **4xx:** Client errors (request issues)
- **5xx:** Server errors (server issues)

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Error responses documented
```

### Verification Checklist
- [ ] Error section added
- [ ] Error format documented
- [ ] Common status codes listed
- [ ] Error examples provided
- [ ] Validation errors shown
- [ ] Auth errors shown
- [ ] Permission errors shown
- [ ] Not found errors shown

---

## Summary

After completing these tasks, the API documentation will have comprehensive custom extensions including multi-tenant headers, authentication flows, and error response formats.

### What We Accomplished
1. ✅ Created extensions.py file
2. ✅ Created custom schema preprocessor
3. ✅ Documented X-Tenant-ID header
4. ✅ Documented JWT authentication flow
5. ✅ Documented refresh token process
6. ✅ Documented error response formats

### Next Steps
- Create reusable error schemas
- Document pagination format
- Document filtering and ordering
- Create request examples
- Create response examples

### Files Created
```
backend/apps/core/api_docs/
├── __init__.py
├── urls.py
└── extensions.py            # Custom preprocessor
```

### Git Commit Message
```
feat(api-docs): add custom schema extensions and auth docs

- Create extensions.py for custom preprocessing
- Implement custom_preprocessing_hook function
- Document X-Tenant-ID header for multi-tenancy
- Document JWT authentication flow with examples
- Document refresh token process and lifecycle
- Document standard error response formats
- Add PREPROCESSING_HOOKS to settings

Part of SubPhase-11 Group E (Tasks 55-60)
```
