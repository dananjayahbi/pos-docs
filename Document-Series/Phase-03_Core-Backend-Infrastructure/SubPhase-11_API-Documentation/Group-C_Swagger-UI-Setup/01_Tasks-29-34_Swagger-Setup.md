# Tasks 29-34: Swagger Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** C - Swagger UI Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Schema-Configuration/](../Group-B_Schema-Configuration/)
- **→ Next Document:** [02_Tasks-35-40_UI-Configuration.md](02_Tasks-35-40_UI-Configuration.md)

---

## Document Overview

This document covers installing the drf-spectacular sidecar package and configuring the basic Swagger UI interface with theme and "Try It Out" functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Install drf-spectacular[sidecar] | Simple |
| 30 | Add sidecar to INSTALLED_APPS | Simple |
| 31 | Configure SWAGGER_UI Settings | Medium |
| 32 | Add Swagger UI URL | Simple |
| 33 | Configure UI Theme | Simple |
| 34 | Configure Try It Out | Simple |

---

## Task 29: Install drf-spectacular[sidecar]

### Overview
Install the drf-spectacular-sidecar package to enable self-hosted Swagger UI assets instead of relying on CDN delivery.

### Dependencies
- Task 28: Define Module Tags (Group B)

### Instructions

1. **Understand sidecar purpose**
   - Provides self-hosted UI assets
   - Eliminates CDN dependencies
   - Better for offline development
   - Improved privacy and security

2. **Add to requirements file**
   - Open `backend/requirements/base.txt`
   - Add drf-spectacular-sidecar entry
   - Place near drf-spectacular package

3. **Use extras syntax**
   - Can use drf-spectacular[sidecar]
   - Or install drf-spectacular-sidecar separately
   - Both approaches work

4. **Install the package**
   - Run pip install command
   - Use backend Python environment
   - Verify installation succeeds

5. **Verify installation**
   - Check package installed
   - Verify static files available
   - Confirm importable

### Installation Options

**Option 1: Extras syntax**
```
drf-spectacular[sidecar]>=0.27.0
```

**Option 2: Separate package**
```
drf-spectacular>=0.27.0
drf-spectacular-sidecar>=2023.1.1
```

### Package Purpose
| Package | Purpose |
|---------|---------|
| **drf-spectacular** | Schema generation |
| **sidecar** | Self-hosted UI assets |

### Expected Outcome
```
backend/requirements/
└── base.txt              # drf-spectacular-sidecar added
```

### Verification Checklist
- [ ] drf-spectacular-sidecar in requirements
- [ ] Package installed successfully
- [ ] Version compatible with drf-spectacular
- [ ] No installation errors
- [ ] Static files available

---

## Task 30: Add sidecar to INSTALLED_APPS

### Overview
Register drf-spectacular-sidecar in Django's INSTALLED_APPS to enable static file serving for Swagger UI assets.

### Dependencies
- Task 29: Install drf-spectacular[sidecar]

### Instructions

1. **Open settings file**
   - Navigate to `backend/config/settings/base.py`
   - Find INSTALLED_APPS list
   - Locate drf_spectacular entry

2. **Add sidecar app**
   - Add 'drf_spectacular_sidecar' to list
   - Place immediately after 'drf_spectacular'
   - Maintain grouping with API tools

3. **Add configuration comment**
   - Comment explaining sidecar purpose
   - Note self-hosted assets
   - Reference Swagger UI and ReDoc

4. **Verify app order**
   - Ensure correct placement
   - After drf_spectacular
   - Before local apps

5. **Run collectstatic**
   - Collect static files
   - Verify UI assets copied
   - Check static directory

### INSTALLED_APPS Configuration
```python
INSTALLED_APPS = [
    # Django apps...
    
    # Third-party apps
    'rest_framework',
    'drf_spectacular',           # OpenAPI schema
    'drf_spectacular_sidecar',   # Self-hosted UI assets
    
    # Local apps...
]
```

### Expected Outcome
```
backend/config/settings/
└── base.py                   # sidecar in INSTALLED_APPS
```

### Verification Checklist
- [ ] 'drf_spectacular_sidecar' added
- [ ] Placed after 'drf_spectacular'
- [ ] Comment added
- [ ] Django check command passes
- [ ] Static files collectstatic ready

---

## Task 31: Configure SWAGGER_UI Settings

### Overview
Create the SWAGGER_UI_SETTINGS dictionary in api_docs settings to configure Swagger UI appearance and behavior.

### Dependencies
- Task 30: Add sidecar to INSTALLED_APPS

### Instructions

1. **Open api_docs settings**
   - Navigate to `backend/config/settings/api_docs.py`
   - Add settings after SPECTACULAR_SETTINGS
   - Prepare new dictionary

2. **Create SWAGGER_UI_SETTINGS**
   - Initialize dictionary
   - Add docstring comment
   - Note configuration purpose

3. **Add settings comment**
   - Explain Swagger UI customization
   - Note theme and behavior options
   - Reference spectacular documentation

4. **Plan configuration categories**
   - Theme settings
   - Authentication settings
   - Display options
   - Interaction features

5. **Verify dictionary structure**
   - Proper Python syntax
   - Ready for adding keys
   - Consistent indentation

### Settings Structure
```python
# Swagger UI Configuration
SWAGGER_UI_SETTINGS = {
    # Settings will be added in subsequent tasks
}
```

### Configuration Categories
| Category | Purpose |
|----------|---------|
| **Theme** | Colors, fonts, dark/light mode |
| **Display** | Layout, filtering, sorting |
| **Try It Out** | Interactive testing |
| **Auth** | Authentication configuration |
| **Deep Linking** | URL-based navigation |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # SWAGGER_UI_SETTINGS created
```

### Verification Checklist
- [ ] SWAGGER_UI_SETTINGS dictionary created
- [ ] Added after SPECTACULAR_SETTINGS
- [ ] Docstring comment added
- [ ] Proper dictionary syntax
- [ ] Ready for configuration

---

## Task 32: Add Swagger UI URL

### Overview
Add a URL pattern to serve the Swagger UI interface at a dedicated endpoint.

### Dependencies
- Task 31: Configure SWAGGER_UI Settings

### Instructions

1. **Open api_docs URLs**
   - Navigate to `backend/apps/core/api_docs/urls.py`
   - Locate urlpatterns list
   - Prepare to add new pattern

2. **Import Swagger view**
   - Import SpectacularSwaggerView
   - From drf_spectacular.views
   - Add to imports section

3. **Add Swagger URL pattern**
   - Add path for 'docs/'
   - Use SpectacularSwaggerView.as_view()
   - Set name to 'swagger-ui'

4. **Configure view parameters**
   - Pass url_name='api_docs:schema'
   - Links to schema endpoint
   - Enables schema loading

5. **Add pattern comment**
   - Explain Swagger UI endpoint
   - Note interactive documentation
   - Reference "Try It Out" feature

### URL Pattern Configuration
```python
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI - Interactive API documentation
    path(
        'docs/',
        SpectacularSwaggerView.as_view(url_name='api_docs:schema'),
        name='swagger-ui'
    ),
]
```

### URL Details
| Aspect | Value |
|--------|-------|
| **Path** | docs/ |
| **Full URL** | /api/docs/ |
| **View** | SpectacularSwaggerView |
| **Name** | swagger-ui |
| **Purpose** | Interactive documentation |

### Expected Outcome
```
backend/apps/core/api_docs/
└── urls.py                  # Swagger UI URL added
```

### Verification Checklist
- [ ] SpectacularSwaggerView imported
- [ ] URL pattern added for 'docs/'
- [ ] View configured with url_name parameter
- [ ] Name set to 'swagger-ui'
- [ ] Comment added
- [ ] Proper syntax

---

## Task 33: Configure UI Theme

### Overview
Configure the Swagger UI theme settings for consistent branding and improved visual appearance.

### Dependencies
- Task 32: Add Swagger UI URL

### Instructions

1. **Add theme settings to dictionary**
   - Open SWAGGER_UI_SETTINGS
   - Add theme-related keys
   - Configure appearance

2. **Configure deep linking**
   - Set 'deepLinking' to True
   - Enables URL-based navigation
   - Allows direct endpoint linking

3. **Configure display mode**
   - Consider displayOperationId
   - Consider docExpansion
   - Set user-friendly defaults

4. **Add syntaxHighlight setting**
   - Enable syntax highlighting
   - Use theme 'monokai' or 'agate'
   - Improves code readability

5. **Consider custom CSS**
   - Plan for custom styles
   - Will add in later task
   - Theme foundation here

### Theme Configuration
```python
SWAGGER_UI_SETTINGS = {
    # Theme and display
    'deepLinking': True,
    'displayOperationId': False,
    'defaultModelsExpandDepth': 3,
    'defaultModelExpandDepth': 3,
    'docExpansion': 'list',  # 'none', 'list', 'full'
    'syntaxHighlight.theme': 'monokai',
}
```

### Theme Options
| Setting | Values | Purpose |
|---------|--------|---------|
| **docExpansion** | none, list, full | Initial expansion state |
| **deepLinking** | true/false | URL navigation |
| **syntaxHighlight** | monokai, agate | Code theme |
| **displayOperationId** | true/false | Show operation IDs |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Theme settings configured
```

### Verification Checklist
- [ ] deepLinking set to True
- [ ] docExpansion configured
- [ ] Syntax highlighting enabled
- [ ] Display settings configured
- [ ] Theme settings applied

---

## Task 34: Configure Try It Out

### Overview
Enable and configure the "Try It Out" functionality to allow users to test API endpoints directly from the documentation interface.

### Dependencies
- Task 33: Configure UI Theme

### Instructions

1. **Enable Try It Out**
   - Add 'supportedSubmitMethods' to settings
   - List HTTP methods to support
   - Enable for testing endpoints

2. **Configure supported methods**
   - Include GET, POST, PUT, PATCH, DELETE
   - Match actual API methods
   - Allow comprehensive testing

3. **Add interaction settings**
   - Configure request duration display
   - Enable response display
   - Show request/response headers

4. **Configure validation**
   - Enable request validation
   - Show validation errors
   - Guide users to correct requests

5. **Add security considerations**
   - Note authentication required
   - Reference auth configuration (next doc)
   - Ensure safe testing environment

### Try It Out Configuration
```python
SWAGGER_UI_SETTINGS = {
    # Theme and display
    'deepLinking': True,
    'displayOperationId': False,
    'defaultModelsExpandDepth': 3,
    'defaultModelExpandDepth': 3,
    'docExpansion': 'list',
    'syntaxHighlight.theme': 'monokai',
    
    # Try It Out functionality
    'supportedSubmitMethods': ['get', 'post', 'put', 'patch', 'delete'],
    'tryItOutEnabled': True,
    'displayRequestDuration': True,
    'filter': True,
    'persistAuthorization': True,
}
```

### Supported Methods
| Method | Purpose |
|--------|---------|
| **GET** | Retrieve resources |
| **POST** | Create resources |
| **PUT** | Update resources (full) |
| **PATCH** | Update resources (partial) |
| **DELETE** | Delete resources |

### Try It Out Features
- **Request Testing:** Send actual API requests
- **Response Preview:** View real responses
- **Header Display:** See request/response headers
- **Duration Tracking:** Monitor request timing
- **Validation:** Check request format

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Try It Out configured
```

### Verification Checklist
- [ ] supportedSubmitMethods configured
- [ ] All HTTP methods included
- [ ] tryItOutEnabled set to True
- [ ] Request duration display enabled
- [ ] Filter enabled
- [ ] Authorization persistence enabled

---

## Summary

After completing these tasks, the basic Swagger UI will be configured and accessible with theme customization and interactive testing capabilities.

### What We Accomplished
1. ✅ Installed drf-spectacular-sidecar for self-hosted assets
2. ✅ Registered sidecar in INSTALLED_APPS
3. ✅ Created SWAGGER_UI_SETTINGS dictionary
4. ✅ Added Swagger UI URL at /api/docs/
5. ✅ Configured UI theme settings
6. ✅ Enabled Try It Out functionality

### Next Steps
- Configure authorization button
- Enable persistent authorization
- Configure deep linking
- Add filter functionality
- Configure display options
- Add custom CSS for branding

### Current Configuration
```python
# backend/config/settings/api_docs.py

SWAGGER_UI_SETTINGS = {
    'deepLinking': True,
    'displayOperationId': False,
    'defaultModelsExpandDepth': 3,
    'defaultModelExpandDepth': 3,
    'docExpansion': 'list',
    'syntaxHighlight.theme': 'monokai',
    'supportedSubmitMethods': ['get', 'post', 'put', 'patch', 'delete'],
    'tryItOutEnabled': True,
    'displayRequestDuration': True,
    'filter': True,
    'persistAuthorization': True,
}
```

### Access Points
- **Swagger UI:** http://localhost:8000/api/docs/
- **Schema:** http://localhost:8000/api/schema/

### Git Commit Message
```
feat(api-docs): configure Swagger UI with theme and Try It Out

- Install drf-spectacular-sidecar for self-hosted assets
- Add sidecar to INSTALLED_APPS
- Create SWAGGER_UI_SETTINGS configuration
- Add Swagger UI endpoint at /api/docs/
- Configure theme with monokai syntax highlighting
- Enable Try It Out for all HTTP methods
- Configure display and interaction settings

Part of SubPhase-11 Group C (Tasks 29-34)
```
