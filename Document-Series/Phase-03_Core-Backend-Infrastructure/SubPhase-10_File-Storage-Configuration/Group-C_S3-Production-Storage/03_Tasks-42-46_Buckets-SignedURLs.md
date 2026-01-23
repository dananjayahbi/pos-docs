# Tasks 42-46: Buckets and Signed URLs

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** C - S3 Production Storage  
> **Document:** 03 of 03  
> **Tasks Covered:** 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-37-41_S3-Configuration.md](02_Tasks-37-41_S3-Configuration.md)
- **→ Next Document:** [../../Group-D_Image-Processing-Pipeline/01_Tasks-47-52_ImageProcessor-Core.md](../../Group-D_Image-Processing-Pipeline/01_Tasks-47-52_ImageProcessor-Core.md)

---

## Document Overview

This document covers the configuration of separate S3 buckets for public and private files, implementation of signed URLs for secure access, and the storage backend switching mechanism for development and production environments.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 42 | Configure Private Files Bucket | Medium |
| 43 | Configure Public Files Bucket | Simple |
| 44 | Create S3 Signed URLs | Complex |
| 45 | Configure URL Expiry | Simple |
| 46 | Configure Storage Backend Switch | Medium |

---

## Task 42: Configure Private Files Bucket

### Overview
Configure a dedicated S3 bucket for private tenant files that require authentication and signed URLs. This bucket stores sensitive documents like invoices, contracts, and financial reports.

### Dependencies
- Task 41: Override S3 Path Methods

### Instructions

1. **Create PrivateTenantS3Storage class**
   - Open `backend/apps/core/storage/backends.py`
   - Create new class inheriting from TenantS3Storage
   - Configure for private file storage

2. **Configure bucket name for private files**
   - Add PRIVATE_BUCKET_NAME setting
   - Use environment variable for configuration
   - Default to main bucket with suffix

3. **Set ACL to private**
   - Override default_acl property
   - Set to 'private' explicitly
   - Ensure no public access

4. **Enable querystring authentication**
   - Set querystring_auth to True
   - Require signed URLs for access
   - Configure expiry time

5. **Configure file permissions**
   - Block public access completely
   - Require authentication for all files
   - Enable encryption at rest

6. **Document private file types**
   - List file types for private bucket
   - Note security requirements
   - Reference compliance needs

### Private vs Public Files

| File Type | Storage | Access | Example |
|-----------|---------|--------|---------|
| **Invoices** | Private | Signed URL | invoice-001.pdf |
| **Contracts** | Private | Signed URL | contract-2026-01.pdf |
| **Financial Reports** | Private | Signed URL | report-q1-2026.xlsx |
| **Product Images** | Public | Direct URL | product-123.jpg |
| **Avatars** | Public | Direct URL | avatar-user42.jpg |

### Private Bucket Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **ACL** | private | No public access |
| **Querystring Auth** | True | Signed URLs required |
| **Encryption** | AES-256 | Data at rest security |
| **Versioning** | Enabled | File history/recovery |
| **Access Logging** | Enabled | Audit trail |

### Bucket Policy Example

```
Private Bucket Policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-name/*",
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

### Private File Organization

```
Private Bucket Structure:
lankacommerce-prod-private/
├── tenant-shop123/
│   ├── invoices/
│   │   ├── 2026/01/
│   │   │   ├── INV-001.pdf
│   │   │   └── INV-002.pdf
│   ├── contracts/
│   │   └── supplier-contract-2026.pdf
│   └── reports/
│       └── financial/
│           └── q1-2026.xlsx
└── tenant-cafe456/
    ├── invoices/
    ├── contracts/
    └── reports/
```

### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| **No Public Access** | Block all public ACLs |
| **HTTPS Only** | Reject HTTP requests |
| **Signed URLs** | All access via signed URLs |
| **Expiry** | URLs expire after set time |
| **Logging** | Log all access attempts |
| **Encryption** | AES-256 at rest |

### Expected Outcome
```python
# In backends.py:

class PrivateTenantS3Storage(TenantS3Storage):
    """
    Private S3 storage for sensitive tenant files.
    
    Used for files that require authentication:
    - Invoices and receipts
    - Contracts and agreements
    - Financial reports
    - Sensitive documents
    
    All files require signed URLs for access.
    """
    
    default_acl = 'private'
    querystring_auth = True  # Require signed URLs
    file_overwrite = False   # Prevent accidental overwrites
    
    def __init__(self, **kwargs):
        # Use separate private bucket if configured
        private_bucket = os.environ.get('AWS_PRIVATE_BUCKET_NAME')
        if private_bucket:
            kwargs['bucket_name'] = private_bucket
        super().__init__(**kwargs)
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
USE_S3=False
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_STORAGE_BUCKET_NAME=lankacommerce-prod-media
AWS_PRIVATE_BUCKET_NAME=lankacommerce-prod-private
AWS_S3_REGION_NAME=ap-south-1
```

### Verification Checklist
- [ ] PrivateTenantS3Storage class created
- [ ] ACL set to private
- [ ] Querystring auth enabled
- [ ] Separate bucket support configured
- [ ] Private file types documented
- [ ] Security requirements noted

---

## Task 43: Configure Public Files Bucket

### Overview
Configure a storage class for public files that can be accessed directly without authentication. These files use a public S3 bucket or public paths with CloudFront CDN for optimal performance.

### Dependencies
- Task 42: Configure Private Files Bucket

### Instructions

1. **Create PublicTenantS3Storage class**
   - Open `backend/apps/core/storage/backends.py`
   - Create new class inheriting from TenantS3Storage
   - Configure for public file storage

2. **Set ACL to public-read**
   - Override default_acl property
   - Set to 'public-read'
   - Allow direct access

3. **Disable querystring authentication**
   - Set querystring_auth to False
   - Enable direct URL access
   - Optimize for CDN caching

4. **Configure public bucket**
   - Support separate public bucket
   - Use environment variable
   - Default to main bucket

5. **Optimize for caching**
   - Set long cache headers
   - Enable CloudFront integration
   - Configure immutable flag

6. **Document public file types**
   - List appropriate file types
   - Note caching strategy
   - Reference CDN integration

### Public File Types

| File Type | Purpose | Cache Duration |
|-----------|---------|----------------|
| **Product Images** | E-commerce display | 1 year |
| **Category Images** | Navigation | 1 year |
| **User Avatars** | Profile display | 1 day |
| **Public Documents** | Catalogs, brochures | 1 month |
| **Static Assets** | Icons, logos | 1 year |

### Public Bucket Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **ACL** | public-read | Direct access |
| **Querystring Auth** | False | No signatures |
| **Cache-Control** | max-age=31536000 | Long cache |
| **CloudFront** | Enabled | CDN distribution |
| **Compression** | Enabled | Faster transfer |

### Public vs Private Comparison

| Aspect | Public Bucket | Private Bucket |
|--------|--------------|----------------|
| **Access** | Direct URL | Signed URL only |
| **ACL** | public-read | private |
| **Caching** | Long duration | No cache |
| **CDN** | Full caching | Limited caching |
| **Performance** | Faster | Slower |
| **Security** | Lower | Higher |

### CloudFront Integration

```
Public File Access Flow:
User Request
    ↓
CloudFront Edge Location (check cache)
    ↓
If cached: Return immediately
    ↓
If not cached: Fetch from S3
    ↓
Cache at edge location
    ↓
Return to user
    ↓
Future requests: Served from edge (fast)
```

### Cache Headers

```
Public File Cache Headers:
Cache-Control: max-age=31536000, public, immutable
Content-Type: image/jpeg
ETag: "abc123def456"
Last-Modified: Thu, 22 Jan 2026 10:00:00 GMT
```

### Expected Outcome
```python
# In backends.py:

class PublicTenantS3Storage(TenantS3Storage):
    """
    Public S3 storage for tenant files accessible without authentication.
    
    Used for files that can be publicly accessed:
    - Product images
    - Category images
    - User avatars (optional)
    - Public documents and catalogs
    
    Files are cached aggressively via CloudFront CDN.
    """
    
    default_acl = 'public-read'
    querystring_auth = False  # Direct access, no signed URLs
    file_overwrite = False    # Prevent accidental overwrites
    
    # Aggressive caching for public files
    object_parameters = {
        'CacheControl': 'max-age=31536000, public, immutable',
    }
    
    def __init__(self, **kwargs):
        # Use separate public bucket if configured
        public_bucket = os.environ.get('AWS_PUBLIC_BUCKET_NAME')
        if public_bucket:
            kwargs['bucket_name'] = public_bucket
        super().__init__(**kwargs)
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
AWS_STORAGE_BUCKET_NAME=lankacommerce-prod-media
AWS_PRIVATE_BUCKET_NAME=lankacommerce-prod-private
AWS_PUBLIC_BUCKET_NAME=lankacommerce-prod-public
AWS_S3_CUSTOM_DOMAIN=cdn.lankacommerce.lk
```

### Verification Checklist
- [ ] PublicTenantS3Storage class created
- [ ] ACL set to public-read
- [ ] Querystring auth disabled
- [ ] Cache headers optimized
- [ ] CloudFront integration ready
- [ ] Public file types documented

---

## Task 44: Create S3 Signed URLs

### Overview
Implement signed URL generation for secure, time-limited access to private files. Signed URLs provide temporary access without exposing AWS credentials or making files public.

### Dependencies
- Task 43: Configure Public Files Bucket

### Instructions

1. **Create s3.py utilities file**
   - Create `backend/apps/core/storage/s3.py`
   - Add module docstring
   - Import boto3 client

2. **Create generate_signed_url function**
   - Accept file path and expiry time
   - Use boto3 to generate signed URL
   - Return presigned URL string

3. **Add tenant context handling**
   - Ensure tenant prefix in path
   - Verify file belongs to current tenant
   - Prevent cross-tenant access

4. **Configure expiry time**
   - Accept expiry parameter (seconds)
   - Default to 3600 seconds (1 hour)
   - Support custom expiry times

5. **Add error handling**
   - Handle invalid file paths
   - Catch S3 errors
   - Return None or raise exceptions

6. **Create bulk URL generator**
   - Function to generate multiple signed URLs
   - Optimize for batch operations
   - Return dictionary of paths to URLs

### Signed URL Purpose

| Use Case | Description | Expiry |
|----------|-------------|--------|
| **Invoice Download** | Customer downloads invoice | 1 hour |
| **Report Access** | Manager views report | 4 hours |
| **Document Share** | Temporary document share | 24 hours |
| **File Preview** | Preview before download | 30 minutes |

### Signed URL Flow

```
Generate Signed URL:
1. Get file path in S3
2. Add tenant prefix
3. Set expiry time
4. Generate signature using AWS credentials
5. Create presigned URL
6. Return URL with signature
7. URL valid until expiry time

User Access:
1. Receive signed URL
2. Click URL within expiry window
3. S3 verifies signature
4. If valid and not expired: Grant access
5. If invalid or expired: Deny access
```

### URL Format

```
Signed URL Format:
https://bucket-name.s3.region.amazonaws.com/tenant-shop123/invoices/INV-001.pdf
?X-Amz-Algorithm=AWS4-HMAC-SHA256
&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20260122%2Fap-south-1%2Fs3%2Faws4_request
&X-Amz-Date=20260122T100000Z
&X-Amz-Expires=3600
&X-Amz-SignedHeaders=host
&X-Amz-Signature=abc123def456...
```

### Security Features

| Feature | Purpose |
|---------|---------|
| **Signature** | Verifies URL authenticity |
| **Expiry** | Limits access window |
| **Credentials** | Signed with AWS secret key |
| **Immutable** | Cannot be modified without breaking signature |
| **One-time** | Can be revoked by changing credentials |

### Expected Outcome
```python
# In s3.py:

import boto3
from django.conf import settings
from django_tenants.utils import connection
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)


def generate_signed_url(file_path, expiry=3600):
    """
    Generate a signed URL for secure, temporary access to a private S3 file.
    
    Args:
        file_path: Path to file in S3 (without tenant prefix)
        expiry: URL expiry time in seconds (default: 1 hour)
        
    Returns:
        Presigned URL string, or None if error
        
    Example:
        url = generate_signed_url('invoices/INV-001.pdf', expiry=7200)
        # Returns URL valid for 2 hours
    """
    try:
        # Get current tenant
        tenant_schema = connection.tenant.schema_name
        
        # Build full S3 key with tenant prefix
        s3_key = f"tenant-{tenant_schema}/{file_path}"
        
        # Create S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        
        # Generate presigned URL
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': s3_key,
            },
            ExpiresIn=expiry,
        )
        
        return url
        
    except ClientError as e:
        logger.error(f"Error generating signed URL for {file_path}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error generating signed URL: {e}")
        return None


def generate_bulk_signed_urls(file_paths, expiry=3600):
    """
    Generate signed URLs for multiple files.
    
    Args:
        file_paths: List of file paths
        expiry: URL expiry time in seconds
        
    Returns:
        Dictionary mapping file paths to signed URLs
    """
    urls = {}
    for path in file_paths:
        url = generate_signed_url(path, expiry)
        if url:
            urls[path] = url
    return urls
```

### Usage Examples

```python
# Single file
from apps.core.storage.s3 import generate_signed_url

invoice_url = generate_signed_url(
    'invoices/2026/01/INV-001.pdf',
    expiry=3600  # 1 hour
)

# Multiple files
from apps.core.storage.s3 import generate_bulk_signed_urls

document_paths = [
    'invoices/INV-001.pdf',
    'invoices/INV-002.pdf',
    'reports/monthly-report.pdf',
]

urls = generate_bulk_signed_urls(document_paths, expiry=7200)
```

### Verification Checklist
- [ ] s3.py file created
- [ ] generate_signed_url function implemented
- [ ] Tenant prefix handling included
- [ ] Expiry time configurable
- [ ] Error handling comprehensive
- [ ] Bulk generation function added

---

## Task 45: Configure URL Expiry

### Overview
Configure default and context-specific expiry times for signed URLs. Different file types and use cases require different expiry durations based on security and usability requirements.

### Dependencies
- Task 44: Create S3 Signed URLs

### Instructions

1. **Create expiry constants**
   - Open `backend/apps/core/storage/constants.py`
   - Define expiry time constants
   - Use clear, descriptive names

2. **Define default expiry**
   - Set DEFAULT_SIGNED_URL_EXPIRY
   - Use 3600 seconds (1 hour) as default
   - Document rationale

3. **Add file-type-specific expiry**
   - Create dictionary of expiry times by file type
   - Match expiry to use case sensitivity
   - Balance security and usability

4. **Create expiry helper function**
   - Function to get expiry for file type
   - Accept file path or type
   - Return appropriate expiry time

5. **Document expiry policies**
   - Explain security considerations
   - Note compliance requirements
   - Reference best practices

6. **Add configuration settings**
   - Make expiry times configurable
   - Support environment overrides
   - Allow per-tenant customization

### Expiry Time Constants

| Constant | Value | Use Case |
|----------|-------|----------|
| **SHORT_EXPIRY** | 1800s (30 min) | Quick previews |
| **DEFAULT_EXPIRY** | 3600s (1 hour) | General access |
| **MEDIUM_EXPIRY** | 14400s (4 hours) | Reports, analysis |
| **LONG_EXPIRY** | 86400s (24 hours) | Shared documents |
| **EXTENDED_EXPIRY** | 604800s (7 days) | Archival access |

### File Type Expiry Matrix

| File Type | Expiry | Reason |
|-----------|--------|--------|
| **Invoice** | 1 hour | Sensitive financial data |
| **Receipt** | 1 hour | Payment information |
| **Contract** | 24 hours | Legal documents, review time |
| **Report** | 4 hours | Analysis and review |
| **Statement** | 1 hour | Financial data |
| **Document** | 4 hours | General documents |

### Security Considerations

| Factor | Impact on Expiry |
|--------|-----------------|
| **Data Sensitivity** | More sensitive = shorter expiry |
| **File Size** | Larger files = longer expiry |
| **User Role** | Higher privilege = longer expiry |
| **Compliance** | Regulations may mandate limits |
| **Use Case** | Download vs preview affects duration |

### Expected Outcome
```python
# In constants.py:

# Signed URL Expiry Times (in seconds)
SIGNED_URL_SHORT_EXPIRY = 1800        # 30 minutes
SIGNED_URL_DEFAULT_EXPIRY = 3600      # 1 hour
SIGNED_URL_MEDIUM_EXPIRY = 14400      # 4 hours
SIGNED_URL_LONG_EXPIRY = 86400        # 24 hours
SIGNED_URL_EXTENDED_EXPIRY = 604800   # 7 days

# File Type Expiry Mapping
SIGNED_URL_EXPIRY_BY_TYPE = {
    'invoice': SIGNED_URL_DEFAULT_EXPIRY,
    'receipt': SIGNED_URL_DEFAULT_EXPIRY,
    'contract': SIGNED_URL_LONG_EXPIRY,
    'report': SIGNED_URL_MEDIUM_EXPIRY,
    'statement': SIGNED_URL_DEFAULT_EXPIRY,
    'document': SIGNED_URL_MEDIUM_EXPIRY,
    'image': SIGNED_URL_SHORT_EXPIRY,
}


def get_signed_url_expiry(file_path=None, file_type=None):
    """
    Get appropriate expiry time for signed URL.
    
    Args:
        file_path: Path to file (optional)
        file_type: Type of file (optional)
        
    Returns:
        Expiry time in seconds
    """
    # Determine file type from path or explicit type
    if file_type:
        return SIGNED_URL_EXPIRY_BY_TYPE.get(
            file_type, 
            SIGNED_URL_DEFAULT_EXPIRY
        )
    
    if file_path:
        # Extract type from path (e.g., 'invoices/file.pdf' -> 'invoice')
        path_lower = file_path.lower()
        for file_type, expiry in SIGNED_URL_EXPIRY_BY_TYPE.items():
            if file_type in path_lower:
                return expiry
    
    return SIGNED_URL_DEFAULT_EXPIRY
```

### Configuration Override

```python
# In storage.py settings:

# Signed URL Configuration
SIGNED_URL_DEFAULT_EXPIRY = int(
    os.environ.get('SIGNED_URL_DEFAULT_EXPIRY', 3600)
)

# Per-tenant expiry overrides (optional)
TENANT_SIGNED_URL_EXPIRY = {
    'premium_tenant': 86400,   # Premium tenants get 24 hour URLs
    'basic_tenant': 3600,      # Basic tenants get 1 hour URLs
}
```

### Usage in Code

```python
# Using file type
from apps.core.storage.constants import get_signed_url_expiry
from apps.core.storage.s3 import generate_signed_url

expiry = get_signed_url_expiry(file_type='invoice')
url = generate_signed_url('invoices/INV-001.pdf', expiry=expiry)

# Using file path
expiry = get_signed_url_expiry(file_path='invoices/2026/INV-001.pdf')
url = generate_signed_url('invoices/2026/INV-001.pdf', expiry=expiry)
```

### Verification Checklist
- [ ] Expiry constants defined
- [ ] File type mapping created
- [ ] Helper function implemented
- [ ] Environment override support added
- [ ] Security considerations documented
- [ ] Usage examples provided

---

## Task 46: Configure Storage Backend Switch

### Overview
Implement a configuration mechanism to seamlessly switch between local FileSystemStorage (development) and S3 storage (production) based on environment settings without code changes.

### Dependencies
- Task 45: Configure URL Expiry

### Instructions

1. **Open storage.py settings**
   - Locate storage backend configuration
   - Prepare for conditional logic

2. **Add USE_S3 environment flag**
   - Read from environment variable
   - Default to False for development
   - Convert string to boolean properly

3. **Configure DEFAULT_FILE_STORAGE**
   - If USE_S3: Use TenantS3Storage
   - Else: Use TenantFileStorage
   - Set Django DEFAULT_FILE_STORAGE setting

4. **Configure STATICFILES_STORAGE**
   - Separate setting for static files
   - Can use different backend than media
   - Consider S3 for production static files

5. **Add storage class selection logic**
   - Create helper to get storage class
   - Support per-model storage override
   - Allow mixing storage backends

6. **Document configuration patterns**
   - Show development setup
   - Show production setup
   - Document mixed scenarios

### Storage Backend Selection

```
Environment-Based Selection:
┌─────────────────────────────────────┐
│ Environment Variable: USE_S3        │
└─────────────┬───────────────────────┘
              │
      ┌───────┴────────┐
      │                │
   False            True
      │                │
      ▼                ▼
Development      Production
      │                │
FileSystemStorage   S3Storage
      │                │
MEDIA_ROOT       S3 Bucket
```

### Configuration Matrix

| Environment | USE_S3 | Storage Backend | Media Location |
|-------------|--------|----------------|----------------|
| **Local Dev** | False | TenantFileStorage | MEDIA_ROOT |
| **Docker Dev** | False | TenantFileStorage | Volume mount |
| **Staging** | True | TenantS3Storage | S3 staging bucket |
| **Production** | True | TenantS3Storage | S3 prod bucket |

### Storage Class Selection

```python
Backend Selection Logic:
if USE_S3:
    ├── DEFAULT_FILE_STORAGE = TenantS3Storage
    ├── PRIVATE_FILE_STORAGE = PrivateTenantS3Storage
    └── PUBLIC_FILE_STORAGE = PublicTenantS3Storage
else:
    ├── DEFAULT_FILE_STORAGE = TenantFileStorage
    ├── PRIVATE_FILE_STORAGE = TenantFileStorage
    └── PUBLIC_FILE_STORAGE = TenantFileStorage
```

### Expected Outcome
```python
# In storage.py:

import os
from django.core.exceptions import ImproperlyConfigured

# Storage Backend Selection
USE_S3 = os.environ.get('USE_S3', 'False').lower() in ('true', '1', 'yes')

if USE_S3:
    # Production: Use S3 Storage
    DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantS3Storage'
    PRIVATE_FILE_STORAGE = 'apps.core.storage.backends.PrivateTenantS3Storage'
    PUBLIC_FILE_STORAGE = 'apps.core.storage.backends.PublicTenantS3Storage'
    
    # Validate S3 configuration
    required_settings = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_STORAGE_BUCKET_NAME',
    ]
    for setting in required_settings:
        if not os.environ.get(setting):
            raise ImproperlyConfigured(
                f'{setting} is required when USE_S3=True'
            )
    
else:
    # Development: Use FileSystem Storage
    DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantFileStorage'
    PRIVATE_FILE_STORAGE = 'apps.core.storage.backends.TenantFileStorage'
    PUBLIC_FILE_STORAGE = 'apps.core.storage.backends.TenantFileStorage'
    
    # Local storage paths
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    MEDIA_URL = '/media/'


# Static Files (can use separate backend)
USE_S3_FOR_STATIC = os.environ.get('USE_S3_FOR_STATIC', 'False').lower() in ('true', '1', 'yes')

if USE_S3_FOR_STATIC:
    STATICFILES_STORAGE = 'apps.core.storage.backends.StaticS3Storage'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
else:
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    STATIC_URL = '/static/'
```

### Helper Functions

```python
# In backends.py or utils.py:

def get_storage_class(storage_type='default'):
    """
    Get appropriate storage class based on configuration.
    
    Args:
        storage_type: 'default', 'private', or 'public'
        
    Returns:
        Storage class instance
    """
    from django.conf import settings
    from django.utils.module_loading import import_string
    
    storage_setting_map = {
        'default': 'DEFAULT_FILE_STORAGE',
        'private': 'PRIVATE_FILE_STORAGE',
        'public': 'PUBLIC_FILE_STORAGE',
    }
    
    setting_name = storage_setting_map.get(storage_type, 'DEFAULT_FILE_STORAGE')
    storage_path = getattr(settings, setting_name)
    
    return import_string(storage_path)()
```

### Model Usage Examples

```python
# Using default storage (switches automatically)
class Product(models.Model):
    image = models.ImageField(upload_to='products/')

# Using explicit storage type
from apps.core.storage.utils import get_storage_class

class Invoice(models.Model):
    pdf = models.FileField(
        upload_to='invoices/',
        storage=get_storage_class('private')
    )

class ProductImage(models.Model):
    image = models.ImageField(
        upload_to='products/',
        storage=get_storage_class('public')
    )
```

### Environment Configuration

Development `.env`:
```bash
# Development Storage (Local FileSystem)
USE_S3=False
USE_S3_FOR_STATIC=False
```

Production `.env`:
```bash
# Production Storage (AWS S3)
USE_S3=True
USE_S3_FOR_STATIC=True
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCY
AWS_STORAGE_BUCKET_NAME=lankacommerce-prod-media
AWS_PRIVATE_BUCKET_NAME=lankacommerce-prod-private
AWS_PUBLIC_BUCKET_NAME=lankacommerce-prod-public
AWS_S3_REGION_NAME=ap-south-1
AWS_S3_CUSTOM_DOMAIN=cdn.lankacommerce.lk
```

### Verification Checklist
- [ ] USE_S3 flag implemented
- [ ] DEFAULT_FILE_STORAGE switches correctly
- [ ] Storage validation added
- [ ] Helper functions created
- [ ] Model usage documented
- [ ] Environment examples provided

---

## Summary

This document completed S3 production storage configuration:

### Completed Configuration
1. ✅ Private bucket configured for sensitive files
2. ✅ Public bucket configured for publicly accessible files
3. ✅ Signed URL generation implemented
4. ✅ URL expiry policies defined
5. ✅ Storage backend switching configured
6. ✅ Complete S3 integration ready for production

### Key Achievements
- 🎯 Secure private file storage with signed URLs
- 🎯 Optimized public file storage with CDN caching
- 🎯 Flexible expiry policies by file type
- 🎯 Seamless dev/prod storage switching
- 🎯 Ready for production deployment
- 🎯 Tenant isolation maintained across all storage types

### Next Phase
Proceed to **Group D: Image Processing Pipeline** to implement image optimization, resizing, and thumbnail generation.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Group:** [Group-D_Image-Processing-Pipeline](../../Group-D_Image-Processing-Pipeline/)
