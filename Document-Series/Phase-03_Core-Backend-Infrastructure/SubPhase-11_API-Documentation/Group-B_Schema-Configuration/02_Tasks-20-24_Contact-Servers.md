# Tasks 20-24: Contact & Servers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** B - Schema Configuration  
> **Document:** 02 of 03  
> **Tasks Covered:** 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-19_Basic-Settings.md](01_Tasks-15-19_Basic-Settings.md)
- **→ Next Document:** [03_Tasks-25-28_Tags-Organization.md](03_Tasks-25-28_Tags-Organization.md)

---

## Document Overview

This document covers configuring contact information, license details, and server URLs for the API documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 20 | Configure CONTACT Info | Simple |
| 21 | Configure LICENSE | Simple |
| 22 | Configure SERVERS | Medium |
| 23 | Add Development Server | Simple |
| 24 | Add Production Server | Simple |

---

## Task 20: Configure CONTACT Info

### Overview
Add contact information to the API schema so users know how to reach the development team for support and inquiries.

### Dependencies
- Task 19: Set SERVE_INCLUDE_SCHEMA

### Instructions

1. **Add CONTACT dictionary**
   - Add 'CONTACT' key to SPECTACULAR_SETTINGS
   - Initialize as nested dictionary
   - Place after SERVE_INCLUDE_SCHEMA

2. **Add contact name**
   - Set 'name' to "LankaCommerce Cloud Support"
   - Represents support team
   - Professional team identifier

3. **Add contact email**
   - Set 'email' to "support@lankacommerce.com"
   - Primary support contact
   - Monitored email address

4. **Add contact URL**
   - Set 'url' to support or docs website
   - Provides additional contact channel
   - Link to support resources

5. **Add configuration comment**
   - Comment explaining contact info
   - Note it appears in schema
   - Reference OpenAPI info.contact

### Contact Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    # Contact information
    'CONTACT': {
        'name': 'LankaCommerce Cloud Support',
        'email': 'support@lankacommerce.com',
        'url': 'https://lankacommerce.com/support',
    },
}
```

### Contact Information Fields
| Field | Purpose | Example |
|-------|---------|---------|
| **name** | Team/person name | "LankaCommerce Cloud Support" |
| **email** | Support email | support@lankacommerce.com |
| **url** | Support URL | https://lankacommerce.com/support |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # CONTACT configured
```

### Verification Checklist
- [ ] CONTACT dictionary added
- [ ] 'name' field set
- [ ] 'email' field set to support email
- [ ] 'url' field set to support URL
- [ ] Comment added
- [ ] Proper dictionary nesting

---

## Task 21: Configure LICENSE

### Overview
Add license information to the API schema to define usage terms and legal requirements.

### Dependencies
- Task 20: Configure CONTACT Info

### Instructions

1. **Add LICENSE dictionary**
   - Add 'LICENSE' key to SPECTACULAR_SETTINGS
   - Initialize as nested dictionary
   - Place after CONTACT

2. **Set license name**
   - Set 'name' to "Proprietary"
   - Indicates commercial/closed source
   - Matches project license model

3. **Add license URL**
   - Set 'url' to terms of service URL
   - Points to full license terms
   - Legal documentation link

4. **Add configuration comment**
   - Comment explaining license
   - Note proprietary/commercial nature
   - Reference terms of service

5. **Consider license type**
   - Proprietary for commercial SaaS
   - Update if using open source license
   - Keep consistent with project LICENSE file

### License Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    # License information
    'LICENSE': {
        'name': 'Proprietary',
        'url': 'https://lankacommerce.com/terms',
    },
}
```

### License Options
| Type | Name | Use Case |
|------|------|----------|
| **Proprietary** | Proprietary | Commercial SaaS |
| **MIT** | MIT License | Open source |
| **Apache 2.0** | Apache-2.0 | Open source |
| **GPL** | GPL-3.0 | Open source |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # LICENSE configured
```

### Verification Checklist
- [ ] LICENSE dictionary added
- [ ] 'name' set to "Proprietary"
- [ ] 'url' points to terms of service
- [ ] Comment added
- [ ] Consistent with project license

---

## Task 22: Configure SERVERS

### Overview
Configure the SERVERS list to define available API server environments for testing and production use.

### Dependencies
- Task 21: Configure LICENSE

### Instructions

1. **Add SERVERS list**
   - Add 'SERVERS' key to SPECTACULAR_SETTINGS
   - Initialize as empty list
   - Will contain server dictionaries

2. **Plan server structure**
   - Each server is a dictionary
   - Contains url and description
   - Can include variables

3. **Add configuration comment**
   - Comment explaining servers list
   - Note multiple environments supported
   - Reference OpenAPI servers field

4. **Prepare for server definitions**
   - Development server (localhost)
   - Production server (live API)
   - Can add staging if needed

5. **Understand server purpose**
   - Allows API testing in different environments
   - UI can switch between servers
   - Each server has unique URL

### Servers Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    # API servers (development and production)
    'SERVERS': [
        # Servers will be added in next tasks
    ],
}
```

### Server Structure
| Field | Required | Purpose |
|-------|----------|---------|
| **url** | Yes | Server base URL |
| **description** | Yes | Server description |
| **variables** | No | URL variables |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # SERVERS list created
```

### Verification Checklist
- [ ] SERVERS key added
- [ ] Initialized as list
- [ ] Comment added
- [ ] Ready to add server entries
- [ ] Proper list syntax

---

## Task 23: Add Development Server

### Overview
Add the development server configuration for local API testing during development.

### Dependencies
- Task 22: Configure SERVERS

### Instructions

1. **Add development server dictionary**
   - Create dictionary in SERVERS list
   - First server in the list
   - Define url and description

2. **Set development URL**
   - Use 'http://localhost:8000'
   - Standard Django development server
   - Include protocol (http)

3. **Add server description**
   - Set 'description' to "Development Server"
   - Clear identifier for environment
   - Helps distinguish from production

4. **Add inline comment**
   - Comment explaining development usage
   - Note local testing purpose
   - Reference Django runserver

5. **Verify URL format**
   - Include protocol (http://)
   - Use localhost or 127.0.0.1
   - Include port if not standard
   - No trailing slash

### Development Server Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    'SERVERS': [
        {
            'url': 'http://localhost:8000',
            'description': 'Development Server',
        },
    ],
}
```

### Development Server Details
| Aspect | Value |
|--------|-------|
| **URL** | http://localhost:8000 |
| **Protocol** | HTTP (not HTTPS) |
| **Host** | localhost |
| **Port** | 8000 (Django default) |
| **Purpose** | Local development and testing |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Development server added
```

### Verification Checklist
- [ ] Development server dictionary added
- [ ] URL set to http://localhost:8000
- [ ] Description set to "Development Server"
- [ ] Proper dictionary syntax
- [ ] First in SERVERS list

---

## Task 24: Add Production Server

### Overview
Add the production server configuration for the live API environment.

### Dependencies
- Task 23: Add Development Server

### Instructions

1. **Add production server dictionary**
   - Create second dictionary in SERVERS list
   - Place after development server
   - Define url and description

2. **Set production URL**
   - Use 'https://api.lankacommerce.com'
   - Production API domain
   - Use HTTPS protocol

3. **Add server description**
   - Set 'description' to "Production Server"
   - Clear identifier for live environment
   - Distinguishes from development

4. **Add inline comment**
   - Comment explaining production usage
   - Note live API access
   - Reference authentication requirements

5. **Consider URL structure**
   - Use HTTPS for security
   - Use api subdomain
   - No trailing slash
   - Use production domain

6. **Plan for staging**
   - Can add staging server later
   - Would go between dev and prod
   - Uses staging.api subdomain

### Production Server Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    'SERVERS': [
        {
            'url': 'http://localhost:8000',
            'description': 'Development Server',
        },
        {
            'url': 'https://api.lankacommerce.com',
            'description': 'Production Server',
        },
    ],
}
```

### Production Server Details
| Aspect | Value |
|--------|-------|
| **URL** | https://api.lankacommerce.com |
| **Protocol** | HTTPS (secure) |
| **Host** | api.lankacommerce.com |
| **Port** | 443 (HTTPS default) |
| **Purpose** | Live production API |

### Server Comparison
| Server | URL | Protocol | Use Case |
|--------|-----|----------|----------|
| **Development** | localhost:8000 | HTTP | Local testing |
| **Staging** | staging.api... | HTTPS | Pre-production testing |
| **Production** | api.lankacommerce.com | HTTPS | Live API |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Production server added
```

### Verification Checklist
- [ ] Production server dictionary added
- [ ] URL set to https://api.lankacommerce.com
- [ ] Uses HTTPS protocol
- [ ] Description set to "Production Server"
- [ ] Second in SERVERS list
- [ ] Proper dictionary syntax

---

## Summary

After completing these tasks, the API schema will have complete contact, license, and server configuration.

### What We Accomplished
1. ✅ Added contact information for support
2. ✅ Configured license as Proprietary
3. ✅ Created SERVERS list structure
4. ✅ Added development server configuration
5. ✅ Added production server configuration

### Next Steps
- Configure TAGS for endpoint organization
- Define Authentication tag
- Define Core tag
- Define module-specific tags

### Current Configuration
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': '''...''',
    'VERSION': 'v1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    
    'CONTACT': {
        'name': 'LankaCommerce Cloud Support',
        'email': 'support@lankacommerce.com',
        'url': 'https://lankacommerce.com/support',
    },
    
    'LICENSE': {
        'name': 'Proprietary',
        'url': 'https://lankacommerce.com/terms',
    },
    
    'SERVERS': [
        {
            'url': 'http://localhost:8000',
            'description': 'Development Server',
        },
        {
            'url': 'https://api.lankacommerce.com',
            'description': 'Production Server',
        },
    ],
}
```

### Schema Info Section
These settings populate OpenAPI fields:
```json
{
  "info": {
    "contact": {
      "name": "LankaCommerce Cloud Support",
      "email": "support@lankacommerce.com",
      "url": "https://lankacommerce.com/support"
    },
    "license": {
      "name": "Proprietary",
      "url": "https://lankacommerce.com/terms"
    }
  },
  "servers": [
    {
      "url": "http://localhost:8000",
      "description": "Development Server"
    },
    {
      "url": "https://api.lankacommerce.com",
      "description": "Production Server"
    }
  ]
}
```

### Git Commit Message
```
feat(api-docs): configure contact, license, and servers

- Add contact information with support email and URL
- Configure license as Proprietary with terms URL
- Create SERVERS list for environment switching
- Add development server (http://localhost:8000)
- Add production server (https://api.lankacommerce.com)

Part of SubPhase-11 Group B (Tasks 20-24)
```
