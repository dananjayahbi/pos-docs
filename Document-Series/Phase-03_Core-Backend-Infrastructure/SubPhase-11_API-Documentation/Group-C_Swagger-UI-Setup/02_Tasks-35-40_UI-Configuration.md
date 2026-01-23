# Tasks 35-40: UI Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** C - Swagger UI Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-34_Swagger-Setup.md](01_Tasks-29-34_Swagger-Setup.md)
- **→ Next Document:** [03_Tasks-41-42_Testing.md](03_Tasks-41-42_Testing.md)

---

## Document Overview

This document covers advanced Swagger UI configuration including authentication, persistence, deep linking, filtering, display options, and custom CSS branding.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Configure Auth Button | Medium |
| 36 | Configure Persist Auth | Simple |
| 37 | Configure Deep Linking | Simple |
| 38 | Configure Filter | Simple |
| 39 | Configure Display Options | Simple |
| 40 | Add Custom CSS | Medium |

---

## Task 35: Configure Auth Button

### Overview
Configure the authorization button in Swagger UI to support JWT Bearer token authentication for API testing.

### Dependencies
- Task 34: Configure Try It Out

### Instructions

1. **Add security scheme to SPECTACULAR_SETTINGS**
   - Open `backend/config/settings/api_docs.py`
   - Add COMPONENT_SPLIT_REQUEST setting
   - Add security scheme configuration

2. **Define Bearer token security**
   - Add SECURITY setting to SPECTACULAR_SETTINGS
   - Define Bearer authentication
   - Specify JWT token format

3. **Configure auth button behavior**
   - Button appears in top-right of UI
   - Opens authentication modal
   - Accepts Bearer token input

4. **Add security schemes**
   - Define in COMPONENT_SPLIT_REQUEST
   - Type: http
   - Scheme: bearer
   - Bearer format: JWT

5. **Document token format**
   - Add comment about token input
   - Note "Bearer" prefix not needed
   - Reference authentication endpoints

### Security Configuration
```python
# In SPECTACULAR_SETTINGS
SPECTACULAR_SETTINGS = {
    # ... existing settings ...
    
    # Security configuration
    'COMPONENT_SPLIT_REQUEST': True,
    'SECURITY': [
        {
            'Bearer': []
        }
    ],
    'COMPONENT_SECURITY_SCHEMES': {
        'Bearer': {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
        }
    },
}
```

### Authentication Flow
| Step | Action |
|------|--------|
| 1 | User clicks "Authorize" button |
| 2 | Modal opens for token input |
| 3 | User pastes JWT token |
| 4 | Token saved in browser |
| 5 | Included in all API requests |

### Token Format
```
# User obtains token from /api/token/
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# Swagger automatically adds "Bearer" prefix
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Security schemes configured
```

### Verification Checklist
- [ ] COMPONENT_SPLIT_REQUEST set to True
- [ ] SECURITY list added with Bearer
- [ ] COMPONENT_SECURITY_SCHEMES configured
- [ ] Type set to 'http'
- [ ] Scheme set to 'bearer'
- [ ] bearerFormat set to 'JWT'
- [ ] Comment added explaining auth

---

## Task 36: Configure Persist Auth

### Overview
Enable persistent authorization so JWT tokens remain stored in the browser across page reloads.

### Dependencies
- Task 35: Configure Auth Button

### Instructions

1. **Verify persistAuthorization setting**
   - Already added in Task 34
   - Confirm in SWAGGER_UI_SETTINGS
   - Ensure set to True

2. **Understand persistence behavior**
   - Token saved in browser localStorage
   - Persists across page reloads
   - Removed on logout or clear

3. **Test persistence**
   - Add token via Authorize button
   - Reload page
   - Verify token still present

4. **Add security note**
   - Comment about security implications
   - Note tokens stored in browser
   - Reference logout procedure

5. **Configure logout behavior**
   - Token cleared on explicit logout
   - User can manually delete
   - Expires based on JWT expiry

### Persistence Configuration
```python
SWAGGER_UI_SETTINGS = {
    # ... existing settings ...
    
    # Persist authorization across page reloads
    'persistAuthorization': True,  # Stores token in localStorage
}
```

### Persistence Benefits
| Benefit | Description |
|---------|-------------|
| **Convenience** | No need to re-enter token |
| **Testing** | Seamless multi-request testing |
| **Development** | Faster iteration |
| **User Experience** | Smooth workflow |

### Security Considerations
- **localStorage:** Token stored in browser
- **Expiry:** Respect JWT expiration
- **Logout:** Clear token on logout
- **Development:** Acceptable for dev environment
- **Production:** Consider security implications

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # persistAuthorization confirmed
```

### Verification Checklist
- [ ] persistAuthorization set to True
- [ ] Token persists across reloads
- [ ] Can be manually cleared
- [ ] Security considerations documented
- [ ] Works with Bearer authentication

---

## Task 37: Configure Deep Linking

### Overview
Configure deep linking to enable URL-based navigation to specific API endpoints in the documentation.

### Dependencies
- Task 36: Configure Persist Auth

### Instructions

1. **Verify deepLinking setting**
   - Already added in Task 33
   - Confirm in SWAGGER_UI_SETTINGS
   - Ensure set to True

2. **Understand deep linking**
   - URLs reflect current endpoint
   - Can share links to specific operations
   - Browser history integration

3. **Test deep linking**
   - Navigate to endpoint
   - Check URL changes
   - Copy and share URL
   - Verify URL loads correct endpoint

4. **Add URL format comment**
   - Comment explaining URL structure
   - Note tag and operation IDs
   - Reference bookmarking capability

### Deep Linking Configuration
```python
SWAGGER_UI_SETTINGS = {
    # ... existing settings ...
    
    # Enable deep linking for direct endpoint URLs
    'deepLinking': True,  # URLs reflect current endpoint
}
```

### URL Structure
```
# Base documentation
/api/docs/

# Specific tag
/api/docs/#/Products

# Specific operation
/api/docs/#/Products/products_list

# With query params
/api/docs/#/Products/products_retrieve?id=123
```

### Deep Linking Benefits
| Benefit | Use Case |
|---------|----------|
| **Sharing** | Send link to specific endpoint |
| **Bookmarking** | Save frequently used endpoints |
| **History** | Browser back/forward navigation |
| **Documentation** | Reference in guides and tickets |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # deepLinking confirmed
```

### Verification Checklist
- [ ] deepLinking set to True
- [ ] URL updates when navigating
- [ ] Can share URLs to endpoints
- [ ] Browser history works
- [ ] Bookmarks load correct endpoint

---

## Task 38: Configure Filter

### Overview
Enable the filter/search functionality to allow users to quickly find endpoints in the documentation.

### Dependencies
- Task 37: Configure Deep Linking

### Instructions

1. **Verify filter setting**
   - Already added in Task 34
   - Confirm in SWAGGER_UI_SETTINGS
   - Ensure set to True

2. **Understand filter functionality**
   - Search box at top of UI
   - Filters endpoints by name/path
   - Real-time filtering
   - Case-insensitive search

3. **Test filter feature**
   - Access /api/docs/
   - Use search box
   - Filter by endpoint name
   - Filter by HTTP method
   - Filter by tag

4. **Add filter comment**
   - Comment explaining search capability
   - Note real-time filtering
   - Reference large API navigation

### Filter Configuration
```python
SWAGGER_UI_SETTINGS = {
    # ... existing settings ...
    
    # Enable endpoint filtering/search
    'filter': True,  # Search box for finding endpoints
}
```

### Filter Capabilities
| Feature | Description |
|---------|-------------|
| **Search** | Find endpoints by name |
| **Real-time** | Instant filtering |
| **Case-insensitive** | Flexible matching |
| **Path matching** | Filter by URL path |
| **Tag filtering** | Filter by category |

### Search Examples
```
# Find all product endpoints
products

# Find POST requests
POST

# Find by path
/api/orders/

# Find by tag
Authentication
```

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # filter confirmed
```

### Verification Checklist
- [ ] filter set to True
- [ ] Search box appears in UI
- [ ] Filtering works real-time
- [ ] Case-insensitive matching
- [ ] Filters by path, method, tag

---

## Task 39: Configure Display Options

### Overview
Configure additional display options to optimize the documentation interface layout and information density.

### Dependencies
- Task 38: Configure Filter

### Instructions

1. **Configure operation expansion**
   - Verify defaultModelsExpandDepth
   - Verify defaultModelExpandDepth
   - Verify docExpansion

2. **Add sorting configuration**
   - Configure operationsSorter
   - Can sort by method or alpha
   - Consider user preference

3. **Configure validation display**
   - Enable/disable request validation
   - Show/hide schemas
   - Configure model rendering

4. **Add response display options**
   - Configure response interception
   - Show response time
   - Display headers

5. **Consider layout options**
   - Configure layout mode
   - Consider plugin options
   - Optimize for usability

### Display Configuration
```python
SWAGGER_UI_SETTINGS = {
    # ... existing settings ...
    
    # Display and layout options
    'defaultModelsExpandDepth': 3,
    'defaultModelExpandDepth': 3,
    'docExpansion': 'list',  # 'none', 'list', 'full'
    'operationsSorter': 'alpha',  # 'alpha', 'method'
    'tagsSorter': 'alpha',
    'displayRequestDuration': True,
    'showExtensions': True,
    'showCommonExtensions': True,
}
```

### Display Options
| Option | Values | Purpose |
|--------|--------|---------|
| **docExpansion** | none, list, full | Initial expansion |
| **operationsSorter** | alpha, method | Endpoint sorting |
| **tagsSorter** | alpha | Tag sorting |
| **showExtensions** | true/false | Show OpenAPI extensions |

### Layout Modes
- **list:** Collapsed endpoints, expanded on click
- **full:** All endpoints expanded
- **none:** All collapsed

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Display options configured
```

### Verification Checklist
- [ ] Model expansion depth configured
- [ ] docExpansion set appropriately
- [ ] Sorting configured
- [ ] Request duration display enabled
- [ ] Extensions display configured

---

## Task 40: Add Custom CSS

### Overview
Create custom CSS to apply LankaCommerce Cloud branding to the Swagger UI interface.

### Dependencies
- Task 39: Configure Display Options

### Instructions

1. **Create static directory structure**
   - Create `backend/static/api_docs/` directory
   - Prepare for custom CSS file
   - Ensure static files configured

2. **Create custom CSS file**
   - Create `custom.css` in api_docs directory
   - Add branding styles
   - Customize colors and fonts

3. **Add brand colors**
   - Define primary brand color
   - Define secondary colors
   - Apply to UI elements

4. **Customize components**
   - Style header/navigation
   - Style buttons and inputs
   - Adjust spacing and typography

5. **Configure CSS loading**
   - Add customCssUrl to SWAGGER_UI_SETTINGS
   - Point to static file
   - Ensure CSS loads in UI

6. **Test CSS application**
   - Load Swagger UI
   - Verify styles applied
   - Check responsive behavior

### Custom CSS File
```css
/* backend/static/api_docs/custom.css */

/* LankaCommerce Cloud Branding */
:root {
    --primary-color: #1976d2;
    --secondary-color: #424242;
    --accent-color: #ff6f00;
}

/* Header styling */
.swagger-ui .topbar {
    background-color: var(--primary-color);
    border-bottom: 3px solid var(--accent-color);
}

/* Info section */
.swagger-ui .info .title {
    color: var(--primary-color);
    font-weight: 600;
}

/* Operation blocks */
.swagger-ui .opblock-tag {
    border-bottom: 2px solid var(--primary-color);
}

/* Buttons */
.swagger-ui .btn.authorize {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

/* Authorize button */
.swagger-ui .btn.authorize svg {
    fill: white;
}
```

### CSS Configuration
```python
SWAGGER_UI_SETTINGS = {
    # ... existing settings ...
    
    # Custom branding CSS
    'customCssUrl': '/static/api_docs/custom.css',
}
```

### Branding Elements
| Element | Customization |
|---------|---------------|
| **Header** | Brand color, logo |
| **Buttons** | Primary color |
| **Links** | Accent color |
| **Typography** | Font family |
| **Spacing** | Padding, margins |

### Expected Outcome
```
backend/
├── config/settings/
│   └── api_docs.py          # customCssUrl configured
└── static/
    └── api_docs/
        └── custom.css       # Custom branding styles
```

### Verification Checklist
- [ ] static/api_docs/ directory created
- [ ] custom.css file created
- [ ] Brand colors defined
- [ ] UI components styled
- [ ] customCssUrl configured
- [ ] CSS loads in Swagger UI
- [ ] Branding visible and consistent

---

## Summary

After completing these tasks, the Swagger UI will be fully configured with authentication, persistence, navigation features, and custom branding.

### What We Accomplished
1. ✅ Configured JWT Bearer authentication button
2. ✅ Enabled persistent authorization
3. ✅ Configured deep linking for URL navigation
4. ✅ Enabled filter/search functionality
5. ✅ Configured display options
6. ✅ Added custom CSS for branding

### Next Steps
- Test Swagger UI interface
- Test API calls through UI
- Verify authentication flow
- Check all features working

### Complete Configuration
```python
# backend/config/settings/api_docs.py

SPECTACULAR_SETTINGS = {
    # ... existing settings ...
    'COMPONENT_SPLIT_REQUEST': True,
    'SECURITY': [{'Bearer': []}],
    'COMPONENT_SECURITY_SCHEMES': {
        'Bearer': {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
        }
    },
}

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
    'operationsSorter': 'alpha',
    'tagsSorter': 'alpha',
    'showExtensions': True,
    'showCommonExtensions': True,
    'customCssUrl': '/static/api_docs/custom.css',
}
```

### Features Enabled
- ✅ JWT Bearer authentication
- ✅ Persistent token storage
- ✅ Deep linking to endpoints
- ✅ Endpoint filtering/search
- ✅ Optimized display options
- ✅ Custom branding CSS

### Git Commit Message
```
feat(api-docs): configure advanced Swagger UI features

- Configure JWT Bearer authentication button
- Enable persistent authorization in localStorage
- Configure deep linking for URL-based navigation
- Enable filter/search for finding endpoints
- Configure display options (sorting, expansion)
- Add custom CSS for LankaCommerce branding
- Create static/api_docs/custom.css with brand colors

Part of SubPhase-11 Group C (Tasks 35-40)
```
