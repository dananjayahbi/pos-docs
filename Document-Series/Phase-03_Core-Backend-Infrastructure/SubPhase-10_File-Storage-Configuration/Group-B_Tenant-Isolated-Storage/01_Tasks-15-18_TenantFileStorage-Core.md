# Tasks 15-18: TenantFileStorage Core Implementation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** B - Tenant-Isolated Storage  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../Group-A_Storage-Backend-Setup/03_Tasks-09-14_Static-Media-Config.md](../../Group-A_Storage-Backend-Setup/03_Tasks-09-14_Static-Media-Config.md)
- **→ Next Document:** [02_Tasks-19-24_Storage-Methods-Classes.md](02_Tasks-19-24_Storage-Methods-Classes.md)

---

## Document Overview

This document covers the creation of the tenant-isolated storage backend. The TenantFileStorage class ensures that all file uploads are automatically organized in tenant-specific directories, preventing cross-tenant data access and maintaining strict data isolation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create backends.py File | Simple |
| 16 | Create TenantFileStorage Class | Medium |
| 17 | Override _save Method | Medium |
| 18 | Override url Method | Simple |

---

## Task 15: Create backends.py File

### Overview
Create the backends.py file within the storage module to house custom storage backend classes that implement tenant-aware file storage logic.

### Dependencies
- Task 14: Test Basic File Upload (Group A complete)

### Instructions

1. **Navigate to storage module**
   - Open `backend/apps/core/storage/` directory
   - Verify __init__.py exists

2. **Create backends.py file**
   - Create new file named `backends.py`
   - Add file in storage module directory

3. **Add module docstring**
   - Add comprehensive docstring explaining purpose
   - Document custom storage backends
   - Note tenant isolation approach

4. **Add import section**
   - Import Django's FileSystemStorage
   - Import connection from django-tenants
   - Import os and datetime utilities
   - Prepare for Path utilities

5. **Document file structure**
   - Add section comments for different classes
   - Plan for TenantFileStorage class
   - Plan for specialized storage classes

### Module Purpose

The backends.py module provides:
- **Tenant Isolation:** Automatic tenant prefix for all uploads
- **Path Management:** Consistent directory structure per tenant
- **Security:** Prevents cross-tenant file access
- **Flexibility:** Support for public and tenant-specific storage
- **Extensibility:** Base for specialized storage classes

### Import Requirements

| Import | Purpose |
|--------|---------|
| FileSystemStorage | Base storage class to extend |
| connection | Access current tenant information |
| os | File path operations |
| datetime | Date-based path organization |
| settings | Access storage configuration |

### File Structure Planning

```python
backends.py:
├── Imports
├── TenantFileStorage (base class)
│   ├── _save() override
│   ├── url() override
│   ├── path() override
│   ├── delete() override
│   ├── exists() override
│   └── get_tenant_path() utility
├── TenantMediaStorage (preconfigured)
└── PublicStorage (no tenant prefix)
```

### Expected Outcome
```
backend/apps/core/storage/
├── __init__.py
└── backends.py               # New custom storage backends
```

### Verification Checklist
- [ ] backends.py file created in storage module
- [ ] Module docstring is comprehensive
- [ ] Required imports are planned
- [ ] File structure is documented
- [ ] Module is ready for class definitions

---

## Task 16: Create TenantFileStorage Class

### Overview
Create the TenantFileStorage class that extends Django's FileSystemStorage to automatically prepend tenant identifiers to all file paths, ensuring complete data isolation between tenants.

### Dependencies
- Task 15: Create backends.py File

### Instructions

1. **Open backends.py file**
   - Navigate to `backend/apps/core/storage/backends.py`
   - Add required imports at the top

2. **Define TenantFileStorage class**
   - Create class that extends FileSystemStorage
   - Add class docstring explaining tenant isolation
   - Document expected path format

3. **Add initialization method**
   - Define __init__ method if needed
   - Call parent class __init__
   - Set up any tenant-specific configuration

4. **Document tenant path format**
   - Explain tenant-{schema}/ prefix pattern
   - Show example paths for different file types
   - Note public vs tenant storage distinction

5. **Add class attributes**
   - Document important class properties
   - Note base location configuration
   - Explain how tenant is determined

### Class Design

| Aspect | Description |
|--------|-------------|
| **Base Class** | FileSystemStorage |
| **Purpose** | Tenant-isolated file storage |
| **Path Pattern** | tenant-{schema}/{type}/{filename} |
| **Tenant Source** | connection.tenant.schema_name |
| **Methods** | Override save, url, path, delete, exists |

### Tenant Path Pattern

| File Type | Path Format | Example |
|-----------|-------------|---------|
| **Product Image** | tenant-{schema}/products/YYYY/MM/DD/{uuid}.jpg | tenant-shop123/products/2026/01/22/abc123.jpg |
| **Invoice PDF** | tenant-{schema}/invoices/{number}.pdf | tenant-cafe456/invoices/INV-001.pdf |
| **User Avatar** | tenant-{schema}/avatars/{user_id}.jpg | tenant-store789/avatars/user_42.jpg |
| **Document** | tenant-{schema}/documents/{type}/{name} | tenant-rest456/documents/reports/report.pdf |

### Tenant Determination

The storage backend determines the current tenant:
1. Access django-tenants connection object
2. Retrieve connection.tenant property
3. Get schema_name from tenant object
4. Use schema_name as tenant identifier
5. Prepend to all file paths

### Class Structure

```python
class TenantFileStorage(FileSystemStorage):
    """
    Custom file storage backend with tenant isolation.
    
    Automatically prepends tenant identifier to all file paths,
    ensuring complete data separation between tenants.
    
    Path Format: tenant-{schema}/{file_path}
    Example: tenant-shop123/products/2026/01/22/product.jpg
    """
    
    # Methods will be added in subsequent tasks
```

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **Path Validation** | Verify tenant prefix in all operations |
| **Cross-Tenant Access** | Prevent access to other tenant files |
| **Public Files** | Separate storage for non-tenant files |
| **Delete Operations** | Verify ownership before deletion |

### Expected Outcome
```python
# In backends.py:

from django.core.files.storage import FileSystemStorage
from django_tenants.utils import connection

class TenantFileStorage(FileSystemStorage):
    """
    Tenant-isolated file storage backend.
    Automatically organizes files by tenant schema.
    """
    pass  # Methods will be added in next tasks
```

### Verification Checklist
- [ ] TenantFileStorage class defined
- [ ] Class extends FileSystemStorage
- [ ] Class docstring is comprehensive
- [ ] Imports are correct
- [ ] Tenant path pattern is documented

---

## Task 17: Override _save Method

### Overview
Override the _save method to automatically prepend the tenant identifier to the file path before saving, ensuring all uploaded files are stored in the correct tenant directory.

### Dependencies
- Task 16: Create TenantFileStorage Class

### Instructions

1. **Open backends.py file**
   - Locate the TenantFileStorage class
   - Prepare to add _save method

2. **Define _save method signature**
   - Method accepts name and content parameters
   - Returns final saved path
   - Follows parent class signature

3. **Get current tenant identifier**
   - Access connection.tenant object
   - Retrieve schema_name property
   - Handle case when no tenant is active (public context)

4. **Prepend tenant to file path**
   - Format: tenant-{schema}/{original_path}
   - Use os.path.join for cross-platform compatibility
   - Preserve original filename and subdirectories

5. **Call parent _save method**
   - Pass modified path to parent _save
   - Include content parameter
   - Return the saved path

6. **Add error handling**
   - Handle missing tenant gracefully
   - Log tenant path for debugging
   - Validate path before saving

### _save Method Flow

```
File Upload Request
        ↓
Get Current Tenant (connection.tenant.schema_name)
        ↓
Prepend Tenant Prefix (tenant-{schema}/)
        ↓
Combine with Original Path
        ↓
Call Parent _save Method
        ↓
Return Final Path
```

### Path Transformation Examples

| Original Path | Tenant | Final Path |
|---------------|--------|------------|
| products/item.jpg | shop123 | tenant-shop123/products/item.jpg |
| invoices/INV-001.pdf | cafe456 | tenant-cafe456/invoices/INV-001.pdf |
| avatars/user_42.jpg | store789 | tenant-store789/avatars/user_42.jpg |

### Method Signature

```python
def _save(self, name, content):
    """
    Save file with tenant prefix.
    
    Args:
        name: Original file path/name
        content: File content object
        
    Returns:
        Final saved path with tenant prefix
    """
```

### Tenant Context Handling

| Context | Tenant Available | Action |
|---------|------------------|--------|
| **Tenant Request** | Yes | Add tenant prefix |
| **Public Schema** | No (public) | Use "public" prefix |
| **Management Command** | Maybe | Handle gracefully |
| **Celery Task** | Context-dependent | Pass tenant explicitly |

### Error Handling Scenarios

| Scenario | Handling |
|----------|----------|
| **No Tenant Context** | Use "public" directory or raise error |
| **Invalid Schema Name** | Sanitize schema name |
| **Duplicate Filename** | Let parent handle uniqueness |
| **Permission Error** | Let parent raise exception |

### Expected Outcome
```python
# In TenantFileStorage class:

def _save(self, name, content):
    """
    Save file with automatic tenant prefix.
    
    Prepends tenant-{schema}/ to the file path before saving.
    """
    # Get current tenant
    if hasattr(connection, 'tenant'):
        tenant_id = connection.tenant.schema_name
    else:
        tenant_id = 'public'  # Fallback for public schema
    
    # Prepend tenant to path
    tenant_path = os.path.join(f'tenant-{tenant_id}', name)
    
    # Call parent save with modified path
    return super()._save(tenant_path, content)
```

### Verification Checklist
- [ ] _save method defined in TenantFileStorage
- [ ] Method signature matches parent class
- [ ] Tenant identifier is retrieved correctly
- [ ] Tenant prefix is prepended to path
- [ ] Parent _save is called with modified path
- [ ] Error handling for missing tenant
- [ ] Method includes docstring

---

## Task 18: Override url Method

### Overview
Override the url method to generate URLs that include the tenant prefix, ensuring file URLs correctly point to tenant-isolated files.

### Dependencies
- Task 17: Override _save Method

### Instructions

1. **Open backends.py file**
   - Locate the TenantFileStorage class
   - Add url method after _save

2. **Define url method signature**
   - Method accepts name parameter
   - Returns complete file URL
   - Follows parent class signature

3. **Check if name has tenant prefix**
   - Verify if path already includes tenant prefix
   - Handle paths that may already be tenant-aware
   - Avoid double-prefixing

4. **Add tenant prefix if needed**
   - Get current tenant identifier
   - Prepend tenant-{schema}/ if not present
   - Use consistent path format

5. **Call parent url method**
   - Pass modified name to parent url
   - Parent combines with MEDIA_URL
   - Return final URL

6. **Handle edge cases**
   - Empty name handling
   - Already-prefixed paths
   - Public file URLs

### url Method Flow

```
Request File URL
        ↓
Check if Path Has Tenant Prefix
        ↓
Add Prefix if Missing
        ↓
Call Parent url Method
        ↓
Return Complete URL (MEDIA_URL + tenant_path)
```

### URL Generation Examples

| File Path | Tenant | Generated URL |
|-----------|--------|---------------|
| products/item.jpg | shop123 | /media/tenant-shop123/products/item.jpg |
| tenant-shop123/products/item.jpg | shop123 | /media/tenant-shop123/products/item.jpg |
| invoices/inv.pdf | cafe456 | /media/tenant-cafe456/invoices/inv.pdf |

### Method Signature

```python
def url(self, name):
    """
    Generate URL for file with tenant prefix.
    
    Args:
        name: File path (may or may not have tenant prefix)
        
    Returns:
        Complete URL to access file
    """
```

### Path Prefix Detection

| Path | Has Prefix | Action |
|------|------------|--------|
| tenant-shop123/products/item.jpg | Yes | Use as-is |
| products/item.jpg | No | Add tenant prefix |
| public/logo.png | No | Add tenant prefix (or keep public) |

### URL Components

| Component | Source | Example |
|-----------|--------|---------|
| **Base URL** | MEDIA_URL setting | /media/ |
| **Tenant Prefix** | connection.tenant | tenant-shop123/ |
| **File Path** | Original name | products/item.jpg |
| **Full URL** | Combined | /media/tenant-shop123/products/item.jpg |

### Expected Outcome
```python
# In TenantFileStorage class:

def url(self, name):
    """
    Return URL for file with tenant prefix.
    
    Ensures URL includes tenant identifier for proper file access.
    """
    # Check if name already has tenant prefix
    if not name.startswith('tenant-'):
        # Get current tenant
        if hasattr(connection, 'tenant'):
            tenant_id = connection.tenant.schema_name
        else:
            tenant_id = 'public'
        
        # Add tenant prefix
        name = os.path.join(f'tenant-{tenant_id}', name)
    
    # Return URL from parent
    return super().url(name)
```

### Verification Checklist
- [ ] url method defined in TenantFileStorage
- [ ] Method signature matches parent class
- [ ] Checks for existing tenant prefix
- [ ] Adds tenant prefix when missing
- [ ] Parent url method is called
- [ ] Returns correct URL format
- [ ] Method includes docstring

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create backends.py File | backends.py module created |
| 16 | Create TenantFileStorage Class | TenantFileStorage class defined |
| 17 | Override _save Method | Automatic tenant prefix on save |
| 18 | Override url Method | Tenant-aware URL generation |

### TenantFileStorage Class Structure
```python
class TenantFileStorage(FileSystemStorage):
    """Tenant-isolated file storage backend"""
    
    def _save(self, name, content):
        """Save with tenant prefix"""
        # Implementation
        
    def url(self, name):
        """Generate URL with tenant prefix"""
        # Implementation
```

### Path and URL Examples

| Operation | Input | Output |
|-----------|-------|--------|
| **Save** | products/item.jpg | tenant-shop123/products/item.jpg |
| **URL** | products/item.jpg | /media/tenant-shop123/products/item.jpg |
| **URL (prefixed)** | tenant-shop123/products/item.jpg | /media/tenant-shop123/products/item.jpg |

### Next Steps
1. Complete remaining storage methods (path, delete, exists)
2. Proceed to [02_Tasks-19-24_Storage-Methods-Classes.md](02_Tasks-19-24_Storage-Methods-Classes.md)

---

## Notes for AI Agents

1. **Execution Order:** Tasks 15-18 must be executed sequentially
2. **Tenant Access:** Use connection.tenant.schema_name from django-tenants
3. **Path Format:** Always use tenant-{schema}/ prefix
4. **Public Context:** Handle cases where no tenant is active
5. **Path Joining:** Use os.path.join for cross-platform compatibility
6. **Error Handling:** Gracefully handle missing tenant context
7. **Testing:** Test with different tenant contexts
