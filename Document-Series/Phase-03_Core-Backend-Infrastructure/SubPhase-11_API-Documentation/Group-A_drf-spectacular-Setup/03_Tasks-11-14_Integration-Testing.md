# Tasks 11-14: Integration & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** A - drf-spectacular Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Settings-URLs.md](02_Tasks-06-10_Settings-URLs.md)
- **→ Next Group:** [../Group-B_Schema-Configuration/](../Group-B_Schema-Configuration/)

---

## Document Overview

This document covers integrating the schema URLs into the main URL configuration and testing the schema generation functionality to ensure proper OpenAPI 3.0 output.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Include in Main URLs | Simple |
| 12 | Test Schema Generation | Simple |
| 13 | Verify OpenAPI 3.0 Format | Simple |
| 14 | Test Schema Download | Simple |

---

## Task 11: Include in Main URLs

### Overview
Include the api_docs URL patterns in the main project URL configuration to make the schema endpoint accessible via the API base path.

### Dependencies
- Task 10: Add Schema URL Pattern

### Instructions

1. **Open main URLs file**
   - Navigate to `backend/config/urls.py`
   - Locate the urlpatterns list
   - Find the API URL patterns section

2. **Import include function**
   - Ensure include is imported from django.urls
   - Verify import statement at top of file
   - Add if not already present

3. **Add api_docs URL include**
   - Add path for api_docs URLs
   - Use prefix 'api/' to place under API namespace
   - Include 'core.api_docs.urls' module
   - Set namespace to 'api_docs'

4. **Add configuration comment**
   - Comment explaining API documentation URLs
   - Note schema endpoint location
   - Reference Swagger UI and ReDoc (to be added)

5. **Verify URL structure**
   - Check syntax is correct
   - Ensure proper indentation
   - Verify path ends with /

6. **Test URL resolution**
   - Run server or URL check
   - Verify URLs resolve correctly
   - Check for URL configuration errors

### URL Include Pattern
```python
from django.urls import path, include

urlpatterns = [
    # ... other patterns ...
    
    # API Documentation
    path('api/', include('core.api_docs.urls', namespace='api_docs')),
    
    # ... other patterns ...
]
```

### URL Structure After Inclusion
| Endpoint | Full Path | Purpose |
|----------|-----------|---------|
| **Schema** | /api/schema/ | OpenAPI 3.0 JSON schema |
| **Swagger** | /api/docs/ | Interactive documentation (Group C) |
| **ReDoc** | /api/redoc/ | Alternative documentation (Group D) |

### Expected Outcome
```
backend/config/
└── urls.py                  # api_docs URLs included
```

### Verification Checklist
- [ ] api_docs URLs included in main urlpatterns
- [ ] URL prefix is 'api/'
- [ ] Namespace set to 'api_docs'
- [ ] Comment added explaining purpose
- [ ] include imported from django.urls
- [ ] URL syntax correct
- [ ] Server starts without URL errors

---

## Task 12: Test Schema Generation

### Overview
Test that the schema endpoint is accessible and generates a valid OpenAPI schema document.

### Dependencies
- Task 11: Include in Main URLs

### Instructions

1. **Start development server**
   - Ensure database migrations are current
   - Start Django development server
   - Verify server starts without errors

2. **Access schema endpoint**
   - Open browser or use curl/httpie
   - Navigate to http://localhost:8000/api/schema/
   - Verify endpoint is accessible

3. **Check response status**
   - Verify HTTP 200 OK response
   - Check that response is received
   - Ensure no 404 or 500 errors

4. **Verify JSON response**
   - Check Content-Type is application/json
   - Verify response is valid JSON
   - Ensure JSON parses correctly

5. **Inspect schema structure**
   - Check for 'openapi' field
   - Verify 'info' section exists
   - Look for 'paths' section
   - Check 'components' section present

6. **Test with different methods**
   - Try GET request
   - Verify other methods return appropriate errors
   - Check CORS headers if applicable

### Testing Commands

**Using curl:**
```bash
curl http://localhost:8000/api/schema/
```

**Using httpie:**
```bash
http GET http://localhost:8000/api/schema/
```

**Using browser:**
```
http://localhost:8000/api/schema/
```

### Expected Response Structure
```json
{
  "openapi": "3.0.3",
  "info": { ... },
  "paths": { ... },
  "components": { ... }
}
```

### Verification Checklist
- [ ] Development server starts successfully
- [ ] /api/schema/ endpoint accessible
- [ ] HTTP 200 OK response received
- [ ] Response Content-Type is application/json
- [ ] Valid JSON returned
- [ ] Schema has basic structure (openapi, info, paths)

---

## Task 13: Verify OpenAPI 3.0 Format

### Overview
Verify that the generated schema conforms to the OpenAPI 3.0.3 specification format.

### Dependencies
- Task 12: Test Schema Generation

### Instructions

1. **Check OpenAPI version**
   - Locate 'openapi' field in schema
   - Verify value is '3.0.3' or '3.0.x'
   - Confirm not using older Swagger 2.0 format

2. **Verify info section**
   - Check 'info' object exists
   - Verify 'title' field present
   - Check 'version' field exists
   - Confirm 'description' included

3. **Verify paths section**
   - Check 'paths' object exists
   - Verify it contains endpoint definitions
   - Check path structure follows OpenAPI format
   - Verify HTTP methods are defined

4. **Verify components section**
   - Check 'components' object exists
   - Verify 'schemas' section present
   - Check for security schemes
   - Verify reusable components defined

5. **Check required fields**
   - Confirm all required OpenAPI fields present
   - Verify no deprecated fields from Swagger 2.0
   - Check field names match OpenAPI 3.0 spec

6. **Validate against OpenAPI specification**
   - Use online validator if available
   - Check for specification compliance
   - Verify no validation errors

### OpenAPI 3.0 Required Fields
| Section | Required Fields |
|---------|----------------|
| **Root** | openapi, info, paths |
| **Info** | title, version |
| **Paths** | path items with operations |
| **Components** | schemas (optional but expected) |

### Validation Tools
- **Swagger Editor:** https://editor.swagger.io/
- **OpenAPI Validator:** Paste schema into validator
- **drf-spectacular:** Built-in validation

### Expected Schema Format
```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "API Title",
    "version": "1.0.0",
    "description": "API Description"
  },
  "paths": {
    "/api/endpoint/": {
      "get": { ... }
    }
  },
  "components": {
    "schemas": { ... }
  }
}
```

### Verification Checklist
- [ ] 'openapi' field is '3.0.3'
- [ ] 'info' section exists with title and version
- [ ] 'paths' section exists with endpoints
- [ ] 'components' section exists
- [ ] No Swagger 2.0 deprecated fields
- [ ] Schema follows OpenAPI 3.0.3 specification
- [ ] Validation passes (if using validator)

---

## Task 14: Test Schema Download

### Overview
Test that the schema can be downloaded as a file for use with external tools, client generation, or documentation.

### Dependencies
- Task 13: Verify OpenAPI 3.0 Format

### Instructions

1. **Test JSON download**
   - Access /api/schema/ endpoint
   - Save response to file
   - Verify file contains valid JSON

2. **Test YAML format**
   - Add ?format=yaml to URL
   - Check if YAML format is supported
   - Verify YAML is valid if supported

3. **Test with curl download**
   - Use curl with -o option to save file
   - Verify file is saved correctly
   - Check file size is reasonable

4. **Test with wget**
   - Use wget to download schema
   - Verify download completes
   - Check saved file integrity

5. **Verify downloaded schema**
   - Open downloaded file
   - Verify content matches browser response
   - Check JSON is well-formed

6. **Test schema in external tools**
   - Import schema into Swagger Editor
   - Test with OpenAPI Generator
   - Verify schema is usable by tools

### Download Commands

**Using curl:**
```bash
curl http://localhost:8000/api/schema/ -o openapi-schema.json
```

**Using wget:**
```bash
wget http://localhost:8000/api/schema/ -O openapi-schema.json
```

**Using httpie:**
```bash
http GET http://localhost:8000/api/schema/ > openapi-schema.json
```

### Download Formats
| Format | URL | Content-Type |
|--------|-----|--------------|
| **JSON** | /api/schema/ | application/json |
| **YAML** | /api/schema/?format=yaml | application/yaml |

### Testing with External Tools
1. **Swagger Editor:** Import schema file
2. **Postman:** Import OpenAPI schema
3. **OpenAPI Generator:** Generate client SDK
4. **ReDoc:** Display documentation

### Verification Checklist
- [ ] Schema can be downloaded via curl
- [ ] Downloaded file contains valid JSON
- [ ] File size is reasonable (not empty or corrupt)
- [ ] Schema imports into Swagger Editor successfully
- [ ] YAML format available (if configured)
- [ ] Downloaded schema matches browser response
- [ ] Schema usable by external tools

---

## Summary

After completing these tasks, the drf-spectacular setup is complete with a working schema endpoint that generates valid OpenAPI 3.0 documentation.

### What We Accomplished
1. ✅ Integrated schema URLs into main URL configuration
2. ✅ Tested schema generation at /api/schema/
3. ✅ Verified OpenAPI 3.0.3 format compliance
4. ✅ Tested schema download functionality

### Next Steps (Group B)
- Configure SPECTACULAR_SETTINGS dictionary
- Add API title, description, and version
- Configure contact and license information
- Add server configurations
- Organize API tags by module

### Integration Points
```
Main URLs (/api/)
    ├── Schema (/api/schema/)          ✅ Working
    ├── Swagger UI (/api/docs/)        → Group C
    └── ReDoc (/api/redoc/)            → Group D
```

### Final Directory Structure
```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py           # DEFAULT_SCHEMA_CLASS + imports
│   │   └── api_docs.py       # API docs settings
│   └── urls.py               # api_docs URLs included
└── apps/
    └── core/
        └── api_docs/
            ├── __init__.py
            └── urls.py       # Schema URL patterns
```

### Verification Commands
```bash
# Start server
python manage.py runserver

# Test schema endpoint
curl http://localhost:8000/api/schema/

# Download schema
curl http://localhost:8000/api/schema/ -o openapi-schema.json

# Validate schema
# Import openapi-schema.json into https://editor.swagger.io/
```

### Git Commit Message
```
feat(api-docs): integrate schema endpoint and verify generation

- Include api_docs URLs in main URL configuration
- Test schema generation at /api/schema/
- Verify OpenAPI 3.0.3 format compliance
- Test schema download functionality
- Validate schema structure and required fields

Part of SubPhase-11 Group A (Tasks 11-14)
Group A Complete: drf-spectacular Setup
```

### Group A Completion Checklist
- [ ] All 14 tasks completed
- [ ] drf-spectacular installed and configured
- [ ] Schema endpoint accessible at /api/schema/
- [ ] OpenAPI 3.0.3 format verified
- [ ] Schema downloadable and valid
- [ ] Tests passing
- [ ] Changes committed to git
- [ ] Ready to proceed to Group B
