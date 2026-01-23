# Tasks 19-24: Storage Methods and Classes

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** B - Tenant-Isolated Storage  
> **Document:** 02 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-18_TenantFileStorage-Core.md](01_Tasks-15-18_TenantFileStorage-Core.md)
- **→ Next Document:** [03_Tasks-25-30_Path-Utilities.md](03_Tasks-25-30_Path-Utilities.md)

---

## Document Overview

This document completes the TenantFileStorage implementation by overriding additional file operation methods and creating specialized storage classes for different use cases (tenant media storage and public storage).

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Override path Method | Simple |
| 20 | Override delete Method | Simple |
| 21 | Override exists Method | Simple |
| 22 | Add get_tenant_path Method | Medium |
| 23 | Create TenantMediaStorage | Simple |
| 24 | Create PublicStorage | Simple |

---

## Task 19: Override path Method

### Overview
Override the path method to return the absolute filesystem path for tenant-isolated files, ensuring path operations correctly reference tenant-specific directories.

### Dependencies
- Task 18: Override url Method

### Instructions

1. **Open backends.py file**
   - Locate the TenantFileStorage class
   - Add path method after url method

2. **Define path method signature**
   - Method accepts name parameter
   - Returns absolute filesystem path
   - Follows parent class signature

3. **Add tenant prefix to name**
   - Check if name already has tenant prefix
   - Get current tenant identifier if not prefixed
   - Prepend tenant-{schema}/ to name

4. **Call parent path method**
   - Pass modified name to parent path
   - Parent combines with MEDIA_ROOT
   - Return absolute path

5. **Add method docstring**
   - Explain purpose of path method
   - Document return value
   - Show usage examples

### path Method Purpose

| Purpose | Description |
|---------|-------------|
| **Absolute Path** | Return full filesystem path to file |
| **File Operations** | Used for direct file system access |
| **Tenant Isolation** | Ensure path includes tenant directory |
| **Cross-Platform** | Works on Windows, Linux, macOS |

### Method Flow

```
Request File Path
        ↓
Check for Tenant Prefix
        ↓
Add Prefix if Missing
        ↓
Call Parent path Method
        ↓
Return Absolute Path (MEDIA_ROOT + tenant_path)
```

### Path Examples

| File Name | Tenant | Absolute Path |
|-----------|--------|---------------|
| products/item.jpg | shop123 | /app/media/tenant-shop123/products/item.jpg |
| invoices/inv.pdf | cafe456 | /app/media/tenant-cafe456/invoices/inv.pdf |
| avatars/user.jpg | store789 | /app/media/tenant-store789/avatars/user.jpg |

### Method Signature

```python
def path(self, name):
    """
    Return absolute filesystem path for file.
    
    Args:
        name: File path (may or may not have tenant prefix)
        
    Returns:
        Absolute path to file on filesystem
    """
```

### Path Components

| Component | Source | Example |
|-----------|--------|---------|
| **Base Path** | MEDIA_ROOT | /app/media/ |
| **Tenant Prefix** | connection.tenant | tenant-shop123/ |
| **File Path** | name parameter | products/item.jpg |
| **Full Path** | Combined | /app/media/tenant-shop123/products/item.jpg |

### Expected Outcome
```python
# In TenantFileStorage class:

def path(self, name):
    """
    Return absolute filesystem path with tenant prefix.
    
    Used for direct file system operations.
    """
    # Add tenant prefix if not present
    if not name.startswith('tenant-'):
        if hasattr(connection, 'tenant'):
            tenant_id = connection.tenant.schema_name
        else:
            tenant_id = 'public'
        name = os.path.join(f'tenant-{tenant_id}', name)
    
    # Return absolute path from parent
    return super().path(name)
```

### Verification Checklist
- [ ] path method defined in TenantFileStorage
- [ ] Method adds tenant prefix when needed
- [ ] Parent path method is called
- [ ] Returns absolute filesystem path
- [ ] Method includes docstring
- [ ] Works across operating systems

---

## Task 20: Override delete Method

### Overview
Override the delete method to ensure file deletion operations respect tenant isolation and only delete files within the current tenant's directory.

### Dependencies
- Task 19: Override path Method

### Instructions

1. **Open backends.py file**
   - Locate the TenantFileStorage class
   - Add delete method after path method

2. **Define delete method signature**
   - Method accepts name parameter
   - Returns nothing (void)
   - Follows parent class signature

3. **Add tenant prefix validation**
   - Check if name has tenant prefix
   - Add tenant prefix if missing
   - Verify tenant ownership before deletion

4. **Call parent delete method**
   - Pass modified name to parent delete
   - Parent handles actual file deletion
   - Ensures file system cleanup

5. **Add security considerations**
   - Document cross-tenant deletion prevention
   - Note that tenant prefix enforces isolation
   - Explain error handling

### delete Method Security

| Security Aspect | Implementation |
|-----------------|----------------|
| **Tenant Isolation** | Prefix ensures only tenant files deleted |
| **Path Validation** | Verify tenant prefix before deletion |
| **Cross-Tenant Prevention** | Cannot delete other tenant files |
| **Public Files** | Separate handling for public storage |

### Method Flow

```
Delete Request
        ↓
Check Tenant Prefix
        ↓
Add Prefix if Missing
        ↓
Validate Tenant Ownership
        ↓
Call Parent delete Method
        ↓
File Removed from Filesystem
```

### Deletion Examples

| File Name | Tenant | Deleted Path |
|-----------|--------|--------------|
| products/old.jpg | shop123 | tenant-shop123/products/old.jpg |
| invoices/old.pdf | cafe456 | tenant-cafe456/invoices/old.pdf |
| avatars/old.jpg | store789 | tenant-store789/avatars/old.jpg |

### Method Signature

```python
def delete(self, name):
    """
    Delete file with tenant prefix validation.
    
    Args:
        name: File path to delete
        
    Security:
        Tenant prefix ensures isolation during deletion
    """
```

### Security Scenarios

| Scenario | Action |
|----------|--------|
| **Same Tenant Delete** | Allowed - delete succeeds |
| **Cross-Tenant Attempt** | Blocked - path doesn't exist in current tenant dir |
| **Public File Delete** | Depends on storage class used |
| **Non-existent File** | Parent handles gracefully |

### Expected Outcome
```python
# In TenantFileStorage class:

def delete(self, name):
    """
    Delete file with tenant prefix validation.
    
    Ensures only files in current tenant directory can be deleted.
    """
    # Add tenant prefix if not present
    if not name.startswith('tenant-'):
        if hasattr(connection, 'tenant'):
            tenant_id = connection.tenant.schema_name
        else:
            tenant_id = 'public'
        name = os.path.join(f'tenant-{tenant_id}', name)
    
    # Call parent delete
    return super().delete(name)
```

### Verification Checklist
- [ ] delete method defined in TenantFileStorage
- [ ] Method adds tenant prefix
- [ ] Parent delete method is called
- [ ] Tenant isolation is maintained
- [ ] Method includes docstring
- [ ] Security implications documented

---

## Task 21: Override exists Method

### Overview
Override the exists method to check file existence within tenant-isolated directories, ensuring file existence checks respect tenant boundaries.

### Dependencies
- Task 20: Override delete Method

### Instructions

1. **Open backends.py file**
   - Locate the TenantFileStorage class
   - Add exists method after delete method

2. **Define exists method signature**
   - Method accepts name parameter
   - Returns boolean (True/False)
   - Follows parent class signature

3. **Add tenant prefix to name**
   - Check if name has tenant prefix
   - Get current tenant identifier
   - Prepend tenant-{schema}/ if needed

4. **Call parent exists method**
   - Pass modified name to parent exists
   - Parent checks filesystem
   - Return boolean result

5. **Document existence checking**
   - Explain why tenant prefix matters
   - Note cross-tenant file hiding
   - Show usage examples

### exists Method Purpose

| Purpose | Description |
|---------|-------------|
| **File Presence** | Check if file exists on filesystem |
| **Tenant Scoped** | Only check within tenant directory |
| **Upload Validation** | Verify file before operations |
| **Overwrite Prevention** | Check before saving duplicates |

### Method Flow

```
Check File Existence
        ↓
Add Tenant Prefix
        ↓
Call Parent exists Method
        ↓
Return True/False
```

### Existence Check Examples

| File Name | Tenant | Checks Path |
|-----------|--------|-------------|
| products/item.jpg | shop123 | tenant-shop123/products/item.jpg |
| invoices/inv.pdf | cafe456 | tenant-cafe456/invoices/inv.pdf |
| avatars/user.jpg | store789 | tenant-store789/avatars/user.jpg |

### Method Signature

```python
def exists(self, name):
    """
    Check if file exists with tenant prefix.
    
    Args:
        name: File path to check
        
    Returns:
        True if file exists, False otherwise
    """
```

### Cross-Tenant Behavior

| Scenario | Result | Reason |
|----------|--------|--------|
| **File in Same Tenant** | True | File exists in tenant dir |
| **File in Other Tenant** | False | Different tenant prefix |
| **Public File** | Depends | Based on storage class |
| **Non-existent File** | False | File doesn't exist |

### Expected Outcome
```python
# In TenantFileStorage class:

def exists(self, name):
    """
    Check if file exists with tenant prefix.
    
    Returns True only if file exists in current tenant directory.
    """
    # Add tenant prefix if not present
    if not name.startswith('tenant-'):
        if hasattr(connection, 'tenant'):
            tenant_id = connection.tenant.schema_name
        else:
            tenant_id = 'public'
        name = os.path.join(f'tenant-{tenant_id}', name)
    
    # Check existence via parent
    return super().exists(name)
```

### Verification Checklist
- [ ] exists method defined in TenantFileStorage
- [ ] Method adds tenant prefix
- [ ] Parent exists method is called
- [ ] Returns boolean value
- [ ] Method includes docstring
- [ ] Cross-tenant isolation maintained

---

## Task 22: Add get_tenant_path Method

### Overview
Create a utility method that returns the tenant-prefixed path for a given file name, centralizing the tenant prefix logic and making it reusable across the class.

### Dependencies
- Task 21: Override exists Method

### Instructions

1. **Open backends.py file**
   - Locate the TenantFileStorage class
   - Add get_tenant_path method

2. **Define method signature**
   - Method accepts name parameter
   - Returns tenant-prefixed path string
   - Make it a utility/helper method

3. **Implement tenant prefix logic**
   - Check if name already has tenant prefix
   - Get current tenant from connection
   - Format path with tenant-{schema}/ prefix

4. **Handle edge cases**
   - Missing tenant context (public schema)
   - Already-prefixed paths
   - Empty or None name values

5. **Refactor existing methods (optional)**
   - Consider using get_tenant_path in other methods
   - Reduce code duplication
   - Improve maintainability

6. **Add comprehensive docstring**
   - Explain method purpose
   - Document parameters and return value
   - Show usage examples

### Method Purpose

| Purpose | Benefit |
|---------|---------|
| **Centralize Logic** | Single place for tenant prefix logic |
| **Code Reuse** | Used by _save, url, path, delete, exists |
| **Maintainability** | Easier to update tenant prefix format |
| **Consistency** | Ensures uniform path handling |

### Method Flow

```
Input: File Name
        ↓
Check if Already Prefixed
        ↓
If Not → Get Current Tenant
        ↓
Format: tenant-{schema}/{name}
        ↓
Return Prefixed Path
```

### Path Transformation

| Input | Tenant | Output |
|-------|--------|--------|
| products/item.jpg | shop123 | tenant-shop123/products/item.jpg |
| tenant-shop123/products/item.jpg | shop123 | tenant-shop123/products/item.jpg |
| avatars/user.jpg | cafe456 | tenant-cafe456/avatars/user.jpg |

### Method Signature

```python
def get_tenant_path(self, name):
    """
    Return tenant-prefixed path for file.
    
    Args:
        name: Original file name/path
        
    Returns:
        Path with tenant prefix (tenant-{schema}/{name})
        
    Example:
        'products/item.jpg' → 'tenant-shop123/products/item.jpg'
    """
```

### Tenant Context Handling

| Context | Tenant ID | Prefix |
|---------|-----------|--------|
| **Active Tenant** | shop123 | tenant-shop123/ |
| **Public Schema** | public | tenant-public/ or public/ |
| **No Tenant** | None | public/ (fallback) |

### Expected Outcome
```python
# In TenantFileStorage class:

def get_tenant_path(self, name):
    """
    Return tenant-prefixed path for file.
    
    Centralizes tenant prefix logic for reuse across methods.
    """
    # Return as-is if already prefixed
    if name.startswith('tenant-'):
        return name
    
    # Get current tenant
    if hasattr(connection, 'tenant') and connection.tenant:
        tenant_id = connection.tenant.schema_name
    else:
        tenant_id = 'public'
    
    # Return prefixed path
    return os.path.join(f'tenant-{tenant_id}', name)
```

### Refactoring Opportunity

After creating get_tenant_path, previous methods can be simplified:
```python
def _save(self, name, content):
    name = self.get_tenant_path(name)
    return super()._save(name, content)

def url(self, name):
    name = self.get_tenant_path(name)
    return super().url(name)
```

### Verification Checklist
- [ ] get_tenant_path method defined
- [ ] Method checks for existing prefix
- [ ] Method gets current tenant correctly
- [ ] Method returns properly formatted path
- [ ] Method includes comprehensive docstring
- [ ] Edge cases are handled

---

## Task 23: Create TenantMediaStorage

### Overview
Create a preconfigured storage class specifically for tenant media files, providing a ready-to-use storage backend for model FileField and ImageField declarations.

### Dependencies
- Task 22: Add get_tenant_path Method

### Instructions

1. **Open backends.py file**
   - Locate after TenantFileStorage class
   - Add new class definition

2. **Define TenantMediaStorage class**
   - Extend TenantFileStorage
   - No additional methods needed initially
   - Acts as semantic alias

3. **Add class docstring**
   - Explain purpose as media-specific storage
   - Document typical use cases
   - Show model field usage examples

4. **Configure default settings (optional)**
   - Can set custom location if needed
   - Configure file permissions
   - Set URL generation preferences

5. **Document usage in models**
   - Show FileField usage example
   - Show ImageField usage example
   - Explain storage parameter

### TenantMediaStorage Purpose

| Aspect | Description |
|--------|-------------|
| **Purpose** | Dedicated storage for user uploads |
| **Base Class** | TenantFileStorage |
| **Usage** | FileField and ImageField models |
| **Isolation** | Automatic tenant prefix |

### Use Cases

| Use Case | Model Field | Storage |
|----------|-------------|---------|
| **Product Images** | ImageField | TenantMediaStorage |
| **Invoice PDFs** | FileField | TenantMediaStorage |
| **User Avatars** | ImageField | TenantMediaStorage |
| **Document Uploads** | FileField | TenantMediaStorage |

### Model Integration

```python
# In models.py:

from apps.core.storage import TenantMediaStorage

class Product(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(
        upload_to='products/%Y/%m/%d/',
        storage=TenantMediaStorage()
    )
```

### Class Structure

```python
class TenantMediaStorage(TenantFileStorage):
    """
    Tenant-isolated media storage for user uploads.
    
    Use this storage class for FileField and ImageField
    to ensure tenant isolation for all uploaded files.
    
    Usage:
        image = models.ImageField(
            upload_to='products/',
            storage=TenantMediaStorage()
        )
    """
    pass  # Inherits all functionality from TenantFileStorage
```

### Storage Configuration

| Setting | Default | Can Override |
|---------|---------|--------------|
| **location** | MEDIA_ROOT | Yes |
| **base_url** | MEDIA_URL | Yes |
| **file_permissions** | 0o644 | Yes |
| **directory_permissions** | 0o755 | Yes |

### Expected Outcome
```python
# In backends.py (after TenantFileStorage):

class TenantMediaStorage(TenantFileStorage):
    """
    Preconfigured storage for tenant media files.
    
    Automatically isolates uploads by tenant.
    Use in model FileField and ImageField declarations.
    """
    pass
```

### Verification Checklist
- [ ] TenantMediaStorage class defined
- [ ] Class extends TenantFileStorage
- [ ] Class docstring is comprehensive
- [ ] Usage examples documented
- [ ] Class is ready for model integration

---

## Task 24: Create PublicStorage

### Overview
Create a storage class for public files that should not be tenant-isolated, such as platform logos, shared assets, and system-wide resources.

### Dependencies
- Task 23: Create TenantMediaStorage

### Instructions

1. **Open backends.py file**
   - Locate after TenantMediaStorage class
   - Add new class definition

2. **Define PublicStorage class**
   - Extend FileSystemStorage (not TenantFileStorage)
   - Override methods to prevent tenant prefix
   - Or create simple wrapper with public/ prefix

3. **Add class docstring**
   - Explain purpose for shared files
   - Document when to use vs TenantMediaStorage
   - Show usage examples

4. **Implement location override**
   - Set location to public/ subdirectory
   - Ensure no tenant prefix is added
   - Keep files accessible across tenants

5. **Document use cases**
   - Platform logos
   - Shared documentation
   - System templates
   - Public resources

### PublicStorage Purpose

| Aspect | Description |
|--------|-------------|
| **Purpose** | Storage for non-tenant files |
| **Base Class** | FileSystemStorage (no tenant logic) |
| **Location** | public/ subdirectory |
| **Access** | Available to all tenants |

### Public vs Tenant Storage

| Aspect | TenantMediaStorage | PublicStorage |
|--------|-------------------|---------------|
| **Prefix** | tenant-{schema}/ | public/ |
| **Isolation** | Per-tenant | Shared |
| **Use For** | User uploads | Platform assets |
| **Access** | Single tenant | All tenants |

### Use Cases

| Use Case | Why Public | Storage |
|----------|------------|---------|
| **Platform Logo** | Same for all tenants | PublicStorage |
| **Email Templates** | Shared templates | PublicStorage |
| **System Icons** | Common icons | PublicStorage |
| **Documentation PDFs** | Platform docs | PublicStorage |

### Class Structure

```python
class PublicStorage(FileSystemStorage):
    """
    Storage for public shared files (no tenant isolation).
    
    Use for platform-wide assets that should be accessible
    to all tenants, such as logos, templates, and documentation.
    
    Files are stored in public/ directory without tenant prefix.
    
    Usage:
        logo = models.ImageField(
            upload_to='logos/',
            storage=PublicStorage()
        )
    """
    
    def __init__(self, *args, **kwargs):
        # Force location to public/ subdirectory
        kwargs['location'] = os.path.join(settings.MEDIA_ROOT, 'public')
        super().__init__(*args, **kwargs)
```

### Location Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **location** | MEDIA_ROOT/public/ | Dedicated public directory |
| **base_url** | MEDIA_URL/public/ | URL prefix for public files |

### Expected Outcome
```python
# In backends.py (after TenantMediaStorage):

class PublicStorage(FileSystemStorage):
    """
    Storage for public shared files accessible to all tenants.
    
    Use for platform logos, templates, and shared resources.
    No tenant isolation applied.
    """
    
    def __init__(self, *args, **kwargs):
        # Store in public/ directory
        kwargs['location'] = os.path.join(settings.MEDIA_ROOT, 'public')
        super().__init__(*args, **kwargs)
```

### Verification Checklist
- [ ] PublicStorage class defined
- [ ] Class extends FileSystemStorage
- [ ] Location set to public/ directory
- [ ] Class docstring explains purpose
- [ ] Use cases documented
- [ ] No tenant prefix applied

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Override path Method | Tenant-aware filesystem paths |
| 20 | Override delete Method | Secure tenant-isolated deletion |
| 21 | Override exists Method | Tenant-scoped existence checking |
| 22 | Add get_tenant_path Method | Centralized tenant prefix utility |
| 23 | Create TenantMediaStorage | Ready-to-use tenant storage class |
| 24 | Create PublicStorage | Shared file storage class |

### Complete Class Hierarchy
```
FileSystemStorage (Django)
    ├── TenantFileStorage
    │   └── TenantMediaStorage
    └── PublicStorage
```

### Storage Classes Summary

| Class | Base | Tenant Prefix | Use For |
|-------|------|---------------|---------|
| **TenantFileStorage** | FileSystemStorage | Yes | Base tenant storage |
| **TenantMediaStorage** | TenantFileStorage | Yes | Model file fields |
| **PublicStorage** | FileSystemStorage | No | Shared platform files |

### Next Steps
1. Create path utility functions for different file types
2. Proceed to [03_Tasks-25-30_Path-Utilities.md](03_Tasks-25-30_Path-Utilities.md)

---

## Notes for AI Agents

1. **Execution Order:** Tasks 19-24 must be executed sequentially
2. **Method Consistency:** All overridden methods use get_tenant_path
3. **Storage Classes:** TenantMediaStorage for models, PublicStorage for shared files
4. **Refactoring:** Consider simplifying methods using get_tenant_path
5. **Testing:** Test with multiple tenants and public context
6. **Security:** Tenant prefix ensures complete isolation
