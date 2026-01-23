# Tasks 15-19: Basic Settings

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** B - Schema Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_drf-spectacular-Setup/](../Group-A_drf-spectacular-Setup/)
- **→ Next Document:** [02_Tasks-20-24_Contact-Servers.md](02_Tasks-20-24_Contact-Servers.md)

---

## Document Overview

This document covers the initial configuration of SPECTACULAR_SETTINGS with basic API metadata including title, description, version, and schema serving options.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Configure SPECTACULAR_SETTINGS | Medium |
| 16 | Set TITLE | Simple |
| 17 | Set DESCRIPTION | Simple |
| 18 | Set VERSION | Simple |
| 19 | Set SERVE_INCLUDE_SCHEMA | Simple |

---

## Task 15: Configure SPECTACULAR_SETTINGS

### Overview
Create the SPECTACULAR_SETTINGS dictionary in the api_docs settings file to hold all drf-spectacular configuration options.

### Dependencies
- Task 14: Test Schema Download (Group A)

### Instructions

1. **Open api_docs settings file**
   - Navigate to `backend/config/settings/api_docs.py`
   - Locate the area where settings will be added
   - Prepare to create dictionary structure

2. **Create SPECTACULAR_SETTINGS dictionary**
   - Define SPECTACULAR_SETTINGS variable
   - Initialize as empty dictionary
   - Add docstring comment above

3. **Add configuration comment**
   - Document dictionary purpose
   - Note it controls schema generation
   - Reference drf-spectacular documentation

4. **Plan dictionary structure**
   - Will contain multiple setting keys
   - Organize by category (basic, contact, servers, etc.)
   - Keep consistent formatting

5. **Verify dictionary syntax**
   - Check proper Python dictionary syntax
   - Ensure proper indentation
   - Prepare for adding key-value pairs

### Dictionary Structure
```python
"""
drf-spectacular configuration for OpenAPI schema generation.
Controls schema metadata, UI settings, and documentation features.
"""

SPECTACULAR_SETTINGS = {
    # Basic settings will be added in subsequent tasks
}
```

### Setting Categories
| Category | Purpose | Tasks |
|----------|---------|-------|
| **Basic** | Title, description, version | 16-19 |
| **Contact** | Contact info, license | 20-21 |
| **Servers** | API server URLs | 22-24 |
| **Tags** | Endpoint organization | 25-28 |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # SPECTACULAR_SETTINGS dict created
```

### Verification Checklist
- [ ] SPECTACULAR_SETTINGS dictionary created
- [ ] Dictionary initialized in api_docs.py
- [ ] Docstring comment added
- [ ] Proper Python syntax
- [ ] Ready to add configuration keys

---

## Task 16: Set TITLE

### Overview
Configure the API title that will appear in the schema and documentation interfaces.

### Dependencies
- Task 15: Configure SPECTACULAR_SETTINGS

### Instructions

1. **Add TITLE key to SPECTACULAR_SETTINGS**
   - Open the SPECTACULAR_SETTINGS dictionary
   - Add 'TITLE' key as first setting
   - Use descriptive API name

2. **Set title value**
   - Use "LankaCommerce Cloud API"
   - Represents the platform API
   - Consistent with project branding

3. **Add inline comment**
   - Comment explaining the title
   - Note where it appears (Swagger UI, ReDoc)
   - Reference OpenAPI info.title field

4. **Consider title formatting**
   - Use proper capitalization
   - Include "API" suffix
   - Keep concise but descriptive

5. **Verify title display**
   - Title appears in schema
   - Displays in documentation interfaces
   - Properly formatted

### Title Configuration
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',  # API title in docs
}
```

### Title Best Practices
| Aspect | Guideline |
|--------|-----------|
| **Length** | Keep under 50 characters |
| **Format** | Title Case |
| **Suffix** | Include "API" |
| **Brand** | Include product name |
| **Clarity** | Self-explanatory |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # TITLE configured
```

### Verification Checklist
- [ ] TITLE key added to SPECTACULAR_SETTINGS
- [ ] Value set to "LankaCommerce Cloud API"
- [ ] Inline comment added
- [ ] Proper string formatting
- [ ] Title will display in schema

---

## Task 17: Set DESCRIPTION

### Overview
Configure the API description that provides an overview of the API's purpose and capabilities.

### Dependencies
- Task 16: Set TITLE

### Instructions

1. **Add DESCRIPTION key**
   - Add 'DESCRIPTION' key to SPECTACULAR_SETTINGS
   - Place after TITLE
   - Use multi-line string for readability

2. **Write comprehensive description**
   - Explain API purpose
   - Mention multi-tenant architecture
   - Note Sri Lankan market focus
   - List key features

3. **Include key information**
   - Multi-tenant SaaS platform
   - POS, Webstore, and ERP modules
   - Sri Lanka-specific features
   - Target audience (SMEs)

4. **Format description**
   - Use multi-line string (triple quotes)
   - Keep paragraphs short
   - Use clear language
   - Avoid technical jargon

5. **Add description comment**
   - Comment above DESCRIPTION
   - Note it appears in schema info
   - Reference OpenAPI info.description

### Description Configuration
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    
    # API description (appears in schema info section)
    'DESCRIPTION': '''
    Multi-tenant SaaS ERP platform for Sri Lankan SMEs.
    
    LankaCommerce Cloud provides integrated POS, Webstore, and ERP
    modules with full support for Sri Lankan business requirements
    including LKR currency, Sinhala language, and local integrations.
    ''',
}
```

### Description Content Guidelines
| Element | Include |
|---------|---------|
| **Platform Type** | Multi-tenant SaaS ERP |
| **Target Market** | Sri Lankan SMEs |
| **Modules** | POS, Webstore, ERP |
| **Localization** | LKR, Sinhala support |
| **Purpose** | Business management |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # DESCRIPTION configured
```

### Verification Checklist
- [ ] DESCRIPTION key added
- [ ] Multi-line string used
- [ ] Mentions multi-tenant architecture
- [ ] References Sri Lankan market
- [ ] Lists main modules
- [ ] Clear and concise
- [ ] Proper formatting

---

## Task 18: Set VERSION

### Overview
Configure the API version number using semantic versioning to track API changes and compatibility.

### Dependencies
- Task 17: Set DESCRIPTION

### Instructions

1. **Add VERSION key**
   - Add 'VERSION' key to SPECTACULAR_SETTINGS
   - Place after DESCRIPTION
   - Use semantic versioning format

2. **Set initial version**
   - Use 'v1.0.0' for initial API version
   - Follow semantic versioning (MAJOR.MINOR.PATCH)
   - Include 'v' prefix for clarity

3. **Add version comment**
   - Comment explaining versioning
   - Note semantic versioning usage
   - Reference version update policy

4. **Plan version strategy**
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes
   - Update as API evolves

5. **Document version policy**
   - Note how versions are incremented
   - Reference API changelog
   - Plan for future versioning

### Version Configuration
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': '''...''',
    
    'VERSION': 'v1.0.0',  # Semantic versioning
}
```

### Semantic Versioning
| Component | When to Increment | Example |
|-----------|------------------|---------|
| **MAJOR** | Breaking changes | v1.0.0 → v2.0.0 |
| **MINOR** | New features | v1.0.0 → v1.1.0 |
| **PATCH** | Bug fixes | v1.0.0 → v1.0.1 |

### Version Considerations
- **Start:** v1.0.0 for production
- **Pre-release:** v0.x.x for beta
- **Format:** vMAJOR.MINOR.PATCH
- **Prefix:** Use 'v' prefix

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # VERSION configured
```

### Verification Checklist
- [ ] VERSION key added
- [ ] Set to 'v1.0.0'
- [ ] Follows semantic versioning
- [ ] Comment added
- [ ] Version displays in schema

---

## Task 19: Set SERVE_INCLUDE_SCHEMA

### Overview
Configure whether to include the schema definition in the served API documentation, controlling schema visibility and download options.

### Dependencies
- Task 18: Set VERSION

### Instructions

1. **Add SERVE_INCLUDE_SCHEMA key**
   - Add key to SPECTACULAR_SETTINGS
   - Place after VERSION
   - Use boolean value

2. **Set value to False**
   - Set SERVE_INCLUDE_SCHEMA to False
   - Prevents automatic schema inclusion
   - Schema available via dedicated endpoint

3. **Add configuration comment**
   - Explain purpose of setting
   - Note schema available at /api/schema/
   - Reference dedicated schema endpoint

4. **Understand the setting**
   - False: Schema served separately
   - True: Schema embedded in UI
   - False recommended for production

5. **Consider implications**
   - Dedicated endpoint more flexible
   - Better separation of concerns
   - Easier to version and cache

### Configuration
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': '''...''',
    'VERSION': 'v1.0.0',
    
    # Schema served via dedicated endpoint (/api/schema/)
    'SERVE_INCLUDE_SCHEMA': False,
}
```

### Setting Options
| Value | Behavior | Use Case |
|-------|----------|----------|
| **False** | Separate endpoint | Production (recommended) |
| **True** | Embedded in UI | Development (optional) |

### Schema Serving Strategy
- **Schema Endpoint:** /api/schema/ (dedicated)
- **Swagger UI:** /api/docs/ (references schema)
- **ReDoc:** /api/redoc/ (references schema)
- **Download:** Direct from schema endpoint

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # SERVE_INCLUDE_SCHEMA configured
```

### Verification Checklist
- [ ] SERVE_INCLUDE_SCHEMA key added
- [ ] Value set to False
- [ ] Comment added explaining choice
- [ ] Schema served via /api/schema/
- [ ] UI interfaces reference schema endpoint

---

## Summary

After completing these tasks, the basic SPECTACULAR_SETTINGS configuration will be in place with essential API metadata.

### What We Accomplished
1. ✅ Created SPECTACULAR_SETTINGS dictionary
2. ✅ Set API title to "LankaCommerce Cloud API"
3. ✅ Added comprehensive API description
4. ✅ Set version to v1.0.0
5. ✅ Configured schema serving strategy

### Next Steps
- Add contact information
- Configure license details
- Add server configurations
- Define development and production servers

### Current Configuration
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': '''
    Multi-tenant SaaS ERP platform for Sri Lankan SMEs.
    
    LankaCommerce Cloud provides integrated POS, Webstore, and ERP
    modules with full support for Sri Lankan business requirements
    including LKR currency, Sinhala language, and local integrations.
    ''',
    'VERSION': 'v1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

### Schema Info Section
These settings populate the OpenAPI `info` section:
```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "LankaCommerce Cloud API",
    "description": "Multi-tenant SaaS ERP...",
    "version": "v1.0.0"
  }
}
```

### Git Commit Message
```
feat(api-docs): configure basic SPECTACULAR_SETTINGS

- Create SPECTACULAR_SETTINGS dictionary
- Set API title to "LankaCommerce Cloud API"
- Add comprehensive description with multi-tenant focus
- Set initial version to v1.0.0 (semantic versioning)
- Configure SERVE_INCLUDE_SCHEMA to False

Part of SubPhase-11 Group B (Tasks 15-19)
```
