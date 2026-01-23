# Tasks 25-28: Tags Organization

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** B - Schema Configuration  
> **Document:** 03 of 03  
> **Tasks Covered:** 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-20-24_Contact-Servers.md](02_Tasks-20-24_Contact-Servers.md)
- **→ Next Group:** [../Group-C_Swagger-UI-Setup/](../Group-C_Swagger-UI-Setup/)

---

## Document Overview

This document covers organizing API endpoints using tags to group related operations together in the documentation interface.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Configure TAGS | Medium |
| 26 | Define Authentication Tag | Simple |
| 27 | Define Core Tag | Simple |
| 28 | Define Module Tags | Medium |

---

## Task 25: Configure TAGS

### Overview
Create the TAGS list structure to organize API endpoints into logical categories for better navigation in documentation interfaces.

### Dependencies
- Task 24: Add Production Server

### Instructions

1. **Add TAGS list**
   - Add 'TAGS' key to SPECTACULAR_SETTINGS
   - Initialize as empty list
   - Will contain tag dictionaries

2. **Understand tag structure**
   - Each tag is a dictionary
   - Contains name and description
   - Can include externalDocs

3. **Plan tag organization**
   - Group by functional area
   - Authentication endpoints
   - Core system endpoints
   - Module-specific endpoints

4. **Add configuration comment**
   - Comment explaining tags purpose
   - Note endpoint grouping
   - Reference OpenAPI tags field

5. **Consider tag hierarchy**
   - Keep flat structure
   - Use clear naming
   - Organize logically
   - Match module structure

### Tags Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    # Endpoint organization tags
    'TAGS': [
        # Tags will be added in subsequent tasks
    ],
}
```

### Tag Structure
| Field | Required | Purpose |
|-------|----------|---------|
| **name** | Yes | Tag identifier |
| **description** | Yes | Tag description |
| **externalDocs** | No | External documentation link |

### Tag Organization Strategy
- **Authentication:** Login, tokens, permissions
- **Core:** Users, tenants, settings
- **Modules:** Products, orders, inventory, etc.

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # TAGS list created
```

### Verification Checklist
- [ ] TAGS key added
- [ ] Initialized as list
- [ ] Comment added
- [ ] Ready to add tag entries
- [ ] Proper list syntax

---

## Task 26: Define Authentication Tag

### Overview
Define the Authentication tag to group all authentication-related endpoints including login, token refresh, and password management.

### Dependencies
- Task 25: Configure TAGS

### Instructions

1. **Add Authentication tag dictionary**
   - Create dictionary in TAGS list
   - First tag in the list
   - Define name and description

2. **Set tag name**
   - Use 'Authentication'
   - Clear and standard naming
   - Matches common API patterns

3. **Add tag description**
   - Describe authentication endpoints
   - Mention JWT tokens
   - Note login and refresh operations

4. **List covered endpoints**
   - Login endpoint
   - Token refresh endpoint
   - Password reset endpoints
   - Logout endpoint

5. **Add inline comment**
   - Comment explaining tag usage
   - Note which endpoints use this tag
   - Reference authentication flow

### Authentication Tag Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    'TAGS': [
        {
            'name': 'Authentication',
            'description': 'User authentication, JWT token management, and session handling',
        },
    ],
}
```

### Authentication Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| **/api/token/** | POST | Obtain JWT token |
| **/api/token/refresh/** | POST | Refresh access token |
| **/api/password/reset/** | POST | Request password reset |
| **/api/password/change/** | POST | Change password |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Authentication tag added
```

### Verification Checklist
- [ ] Authentication tag dictionary added
- [ ] Name set to 'Authentication'
- [ ] Description explains auth endpoints
- [ ] Mentions JWT tokens
- [ ] First in TAGS list

---

## Task 27: Define Core Tag

### Overview
Define the Core tag to group fundamental system endpoints including users, tenants, and system settings.

### Dependencies
- Task 26: Define Authentication Tag

### Instructions

1. **Add Core tag dictionary**
   - Create second dictionary in TAGS list
   - Place after Authentication tag
   - Define name and description

2. **Set tag name**
   - Use 'Core'
   - Represents core system features
   - Distinguishes from modules

3. **Add tag description**
   - Describe core endpoints
   - Mention users and tenants
   - Note system configuration

4. **List covered endpoints**
   - User management
   - Tenant management
   - System settings
   - Health checks

5. **Add inline comment**
   - Comment explaining core features
   - Note multi-tenant foundation
   - Reference system operations

### Core Tag Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    'TAGS': [
        {
            'name': 'Authentication',
            'description': 'User authentication, JWT token management, and session handling',
        },
        {
            'name': 'Core',
            'description': 'Core system endpoints including users, tenants, and system configuration',
        },
    ],
}
```

### Core Endpoints
| Category | Endpoints |
|----------|-----------|
| **Users** | /api/users/, /api/users/{id}/ |
| **Tenants** | /api/tenants/, /api/tenants/{id}/ |
| **Settings** | /api/settings/, /api/settings/{key}/ |
| **Health** | /api/health/, /api/status/ |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Core tag added
```

### Verification Checklist
- [ ] Core tag dictionary added
- [ ] Name set to 'Core'
- [ ] Description explains core endpoints
- [ ] Mentions users and tenants
- [ ] Second in TAGS list

---

## Task 28: Define Module Tags

### Overview
Define tags for each ERP module to organize module-specific endpoints including Products, Orders, Inventory, and Financial operations.

### Dependencies
- Task 27: Define Core Tag

### Instructions

1. **Add Products tag**
   - Create tag for product management
   - Include catalog and categories
   - Note inventory relationship

2. **Add Orders tag**
   - Create tag for order processing
   - Include sales and purchases
   - Note POS integration

3. **Add Inventory tag**
   - Create tag for stock management
   - Include warehouses and transfers
   - Note stock level tracking

4. **Add Customers tag**
   - Create tag for customer management
   - Include CRM features
   - Note loyalty programs

5. **Add Financial tag**
   - Create tag for accounting
   - Include invoices and payments
   - Note LKR currency support

6. **Add Reports tag**
   - Create tag for reporting
   - Include analytics
   - Note export capabilities

7. **Add Webstore tag**
   - Create tag for ecommerce
   - Include storefront operations
   - Note customer-facing features

8. **Consider additional tags**
   - Add more as modules develop
   - Keep organized by module
   - Maintain consistent naming

### Module Tags Configuration
```python
SPECTACULAR_SETTINGS = {
    # ... previous settings ...
    
    'TAGS': [
        {
            'name': 'Authentication',
            'description': 'User authentication, JWT token management, and session handling',
        },
        {
            'name': 'Core',
            'description': 'Core system endpoints including users, tenants, and system configuration',
        },
        {
            'name': 'Products',
            'description': 'Product catalog, categories, variants, and pricing management',
        },
        {
            'name': 'Orders',
            'description': 'Sales orders, purchase orders, and POS transactions',
        },
        {
            'name': 'Inventory',
            'description': 'Stock management, warehouses, and inventory transfers',
        },
        {
            'name': 'Customers',
            'description': 'Customer management, CRM, and loyalty programs',
        },
        {
            'name': 'Financial',
            'description': 'Invoices, payments, accounting, and LKR currency handling',
        },
        {
            'name': 'Reports',
            'description': 'Business reports, analytics, and data exports',
        },
        {
            'name': 'Webstore',
            'description': 'E-commerce storefront, shopping cart, and customer orders',
        },
    ],
}
```

### Module Tags Overview
| Tag | Module | Key Features |
|-----|--------|--------------|
| **Products** | Catalog | Products, categories, pricing |
| **Orders** | Sales | Orders, POS, transactions |
| **Inventory** | Stock | Warehouses, transfers, levels |
| **Customers** | CRM | Customers, loyalty, contacts |
| **Financial** | Accounting | Invoices, payments, LKR |
| **Reports** | Analytics | Reports, dashboards, exports |
| **Webstore** | E-commerce | Storefront, cart, checkout |

### Tag Best Practices
| Aspect | Guideline |
|--------|-----------|
| **Naming** | Singular or plural (be consistent) |
| **Order** | Logical grouping (auth first, core second) |
| **Description** | Clear, concise, feature-focused |
| **Coverage** | One tag per major module |
| **Growth** | Easy to add new tags as needed |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # All module tags added
```

### Verification Checklist
- [ ] Products tag added
- [ ] Orders tag added
- [ ] Inventory tag added
- [ ] Customers tag added
- [ ] Financial tag added
- [ ] Reports tag added
- [ ] Webstore tag added
- [ ] All tags have clear descriptions
- [ ] Tags organized logically
- [ ] Proper list syntax

---

## Summary

After completing these tasks, the SPECTACULAR_SETTINGS will be fully configured with comprehensive tag organization for all API endpoints.

### What We Accomplished
1. ✅ Created TAGS list structure
2. ✅ Defined Authentication tag
3. ✅ Defined Core tag
4. ✅ Defined all module tags (Products, Orders, Inventory, etc.)

### Next Steps (Group C)
- Install drf-spectacular-sidecar
- Configure Swagger UI settings
- Add Swagger UI URL
- Enable "Try It Out" functionality
- Configure authentication in UI

### Complete SPECTACULAR_SETTINGS
```python
SPECTACULAR_SETTINGS = {
    # Basic settings
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': '''
    Multi-tenant SaaS ERP platform for Sri Lankan SMEs.
    
    LankaCommerce Cloud provides integrated POS, Webstore, and ERP
    modules with full support for Sri Lankan business requirements
    including LKR currency, Sinhala language, and local integrations.
    ''',
    'VERSION': 'v1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    
    # Contact and license
    'CONTACT': {
        'name': 'LankaCommerce Cloud Support',
        'email': 'support@lankacommerce.com',
        'url': 'https://lankacommerce.com/support',
    },
    'LICENSE': {
        'name': 'Proprietary',
        'url': 'https://lankacommerce.com/terms',
    },
    
    # API servers
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
    
    # Endpoint tags
    'TAGS': [
        {'name': 'Authentication', 'description': '...'},
        {'name': 'Core', 'description': '...'},
        {'name': 'Products', 'description': '...'},
        {'name': 'Orders', 'description': '...'},
        {'name': 'Inventory', 'description': '...'},
        {'name': 'Customers', 'description': '...'},
        {'name': 'Financial', 'description': '...'},
        {'name': 'Reports', 'description': '...'},
        {'name': 'Webstore', 'description': '...'},
    ],
}
```

### Schema Tags Section
These settings populate the OpenAPI tags:
```json
{
  "tags": [
    {
      "name": "Authentication",
      "description": "User authentication, JWT token management..."
    },
    {
      "name": "Core",
      "description": "Core system endpoints..."
    }
  ]
}
```

### Git Commit Message
```
feat(api-docs): configure API tags for endpoint organization

- Create TAGS list structure
- Define Authentication tag for auth endpoints
- Define Core tag for system endpoints
- Add module tags: Products, Orders, Inventory
- Add Customer, Financial, Reports tags
- Add Webstore tag for e-commerce endpoints
- Organize tags logically by functional area

Part of SubPhase-11 Group B (Tasks 25-28)
Group B Complete: Schema Configuration
```

### Group B Completion Checklist
- [ ] All 14 tasks completed (15-28)
- [ ] SPECTACULAR_SETTINGS fully configured
- [ ] Basic settings (title, description, version)
- [ ] Contact and license information
- [ ] Development and production servers
- [ ] All API tags defined and organized
- [ ] Changes committed to git
- [ ] Ready to proceed to Group C
