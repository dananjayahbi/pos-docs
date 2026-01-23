# Tasks 37-41: S3 Configuration and TenantS3Storage

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** C - S3 Production Storage  
> **Document:** 02 of 03  
> **Tasks Covered:** 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-36_boto3-AWS-Setup.md](01_Tasks-31-36_boto3-AWS-Setup.md)
- **→ Next Document:** [03_Tasks-42-46_Buckets-SignedURLs.md](03_Tasks-42-46_Buckets-SignedURLs.md)

---

## Document Overview

This document covers advanced S3 configuration including region setup, custom domain configuration, object parameters, and the creation of the TenantS3Storage class that combines tenant isolation with S3 backend.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 37 | Configure AWS_S3_REGION_NAME | Simple |
| 38 | Configure AWS_S3_CUSTOM_DOMAIN | Medium |
| 39 | Configure AWS_S3_OBJECT_PARAMETERS | Medium |
| 40 | Create TenantS3Storage Class | Complex |
| 41 | Override S3 Path Methods | Medium |

---

## Task 37: Configure AWS_S3_REGION_NAME

### Overview
Configure the AWS region where the S3 bucket is located. For LankaCommerce Cloud, using the Mumbai region (ap-south-1) provides the lowest latency for Sri Lankan users.

### Dependencies
- Task 36: Configure AWS_STORAGE_BUCKET_NAME

### Instructions

1. **Open storage.py settings file**
   - Locate S3 configuration section
   - Position after bucket name setting

2. **Add AWS_S3_REGION_NAME setting**
   - Set to 'ap-south-1' (Mumbai) as default
   - Allow override via environment variable
   - Document region choice rationale

3. **Document region selection**
   - Note proximity to Sri Lanka
   - Explain latency benefits
   - Reference pricing considerations

4. **Add region validation**
   - Verify region format is valid
   - Check region is an AWS S3 region
   - Log region selection on startup

5. **Document alternative regions**
   - List other suitable regions
   - Note Singapore (ap-southeast-1) as backup
   - Explain multi-region considerations

### AWS Regions Near Sri Lanka

| Region Code | Region Name | Latency (approx) | Notes |
|-------------|-------------|------------------|-------|
| **ap-south-1** | Mumbai, India | 30-50ms | Closest, recommended |
| **ap-southeast-1** | Singapore | 50-80ms | Good alternative |
| **ap-south-2** | Hyderabad, India | 40-60ms | New region |
| **ap-southeast-3** | Jakarta | 80-100ms | Southeast Asia |

### Region Selection Criteria

| Factor | Consideration |
|--------|---------------|
| **Latency** | Distance to Sri Lanka |
| **Pricing** | Regional price variations |
| **Compliance** | Data residency requirements |
| **Services** | Feature availability |
| **Reliability** | Uptime track record |

### Latency Impact

```
Sri Lanka → Mumbai (ap-south-1):
  Latency: 30-50ms
  Upload Speed: Fast
  Download Speed: Fast
  User Experience: Excellent
  
Sri Lanka → Singapore (ap-southeast-1):
  Latency: 50-80ms
  Upload Speed: Good
  Download Speed: Good
  User Experience: Good
  
Sri Lanka → Sydney (ap-southeast-2):
  Latency: 150-200ms
  Upload Speed: Slower
  Download Speed: Slower
  User Experience: Acceptable
```

### Regional Endpoint Format

```
S3 Regional Endpoints:
- ap-south-1: s3.ap-south-1.amazonaws.com
- ap-southeast-1: s3.ap-southeast-1.amazonaws.com
- ap-south-2: s3.ap-south-2.amazonaws.com

Bucket URL Format:
- Path Style: s3.ap-south-1.amazonaws.com/bucket-name/key
- Virtual Hosted: bucket-name.s3.ap-south-1.amazonaws.com/key
```

### Multi-Region Considerations

For future scaling:
1. **Primary Region:** ap-south-1 (Mumbai)
2. **Backup Region:** ap-southeast-1 (Singapore)
3. **Replication:** Cross-region replication for DR
4. **CloudFront:** Multi-region CDN distribution
5. **Failover:** Automatic region failover

### Expected Outcome
```python
# In storage.py:

if USE_S3:
    # AWS Credentials
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    
    # S3 Bucket Configuration
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    
    # S3 Region (Mumbai - closest to Sri Lanka)
    AWS_S3_REGION_NAME = os.environ.get(
        'AWS_S3_REGION_NAME', 
        'ap-south-1'  # Mumbai, India - lowest latency for Sri Lanka
    )
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
USE_S3=False
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_STORAGE_BUCKET_NAME=lankacommerce-prod-media
AWS_S3_REGION_NAME=ap-south-1
```

### Verification Checklist
- [ ] AWS_S3_REGION_NAME setting added
- [ ] Default region set to ap-south-1
- [ ] Environment variable override supported
- [ ] Region choice documented
- [ ] .env.example updated
- [ ] Alternative regions documented

---

## Task 38: Configure AWS_S3_CUSTOM_DOMAIN

### Overview
Configure a custom domain (typically CloudFront CDN) for S3 file URLs. This provides better performance through edge caching and allows branded URLs instead of direct S3 URLs.

### Dependencies
- Task 37: Configure AWS_S3_REGION_NAME

### Instructions

1. **Open storage.py settings file**
   - Locate S3 configuration section
   - Position after region setting

2. **Add AWS_S3_CUSTOM_DOMAIN setting**
   - Read from environment variable
   - Default to None (use direct S3 URLs)
   - Support CloudFront distribution domain

3. **Document custom domain purpose**
   - Explain CloudFront CDN benefits
   - Note branded URL advantage
   - Reference SSL/TLS considerations

4. **Configure CLOUDFRONT_DOMAIN**
   - Create separate setting for CloudFront
   - Format: xxxxxxxxxxxx.cloudfront.net
   - Allow custom domain (media.lankacommerce.lk)

5. **Add URL generation logic**
   - Use custom domain if configured
   - Fall back to S3 direct URLs
   - Handle both public and private URLs

### Custom Domain Benefits

| Benefit | Description |
|---------|-------------|
| **CDN Caching** | Files cached at edge locations |
| **Global Performance** | Fast access worldwide |
| **Branded URLs** | Use own domain name |
| **SSL/TLS** | HTTPS for all file access |
| **Cost Reduction** | Lower data transfer costs |
| **DDoS Protection** | AWS Shield integration |

### CloudFront vs Direct S3

| Aspect | Direct S3 | CloudFront CDN |
|--------|-----------|----------------|
| **Speed** | Region-based | Edge-cached |
| **Cost** | Standard transfer | Lower transfer cost |
| **URLs** | s3.region.amazonaws.com | custom.cloudfront.net |
| **SSL** | S3 certificate | Custom certificate |
| **Caching** | No edge cache | Global edge cache |
| **Latency** | Variable | Consistently low |

### URL Formats

```
Direct S3 URL:
https://lankacommerce-prod-media.s3.ap-south-1.amazonaws.com/tenant-shop123/products/item.jpg

CloudFront URL:
https://d111111abcdef8.cloudfront.net/tenant-shop123/products/item.jpg

Custom Domain:
https://media.lankacommerce.lk/tenant-shop123/products/item.jpg
```

### CloudFront Configuration

Key CloudFront settings:
1. **Origin:** S3 bucket
2. **Viewer Protocol:** Redirect HTTP to HTTPS
3. **Cached Methods:** GET, HEAD, OPTIONS
4. **Compress:** Enable automatic compression
5. **Price Class:** Use All Edges for global
6. **SSL Certificate:** ACM certificate for custom domain

### Custom Domain Setup Process

```
Setup Flow:
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure SSL certificate (ACM)
4. Create CNAME record: media.lankacommerce.lk
5. Update AWS_S3_CUSTOM_DOMAIN setting
6. Test file access via custom domain
```

### Cache Control Strategy

| File Type | Cache Duration | Policy |
|-----------|---------------|---------|
| **Product Images** | 1 year | Immutable |
| **Avatars** | 1 day | Short cache |
| **Documents** | 1 hour | Private, no cache |
| **Static Assets** | 1 year | Immutable |

### Expected Outcome
```python
# In storage.py:

if USE_S3:
    # ... previous settings ...
    
    # S3 Region
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'ap-south-1')
    
    # CloudFront CDN (optional but recommended for production)
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('AWS_S3_CUSTOM_DOMAIN')
    
    # If custom domain is set, use it for file URLs
    # Otherwise, use direct S3 URLs
    if AWS_S3_CUSTOM_DOMAIN:
        # Example: d111111abcdef8.cloudfront.net or media.lankacommerce.lk
        AWS_S3_URL_PROTOCOL = 'https:'
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
USE_S3=False
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_STORAGE_BUCKET_NAME=lankacommerce-prod-media
AWS_S3_REGION_NAME=ap-south-1
AWS_S3_CUSTOM_DOMAIN=media.lankacommerce.lk
```

### Verification Checklist
- [ ] AWS_S3_CUSTOM_DOMAIN setting added
- [ ] CloudFront configuration documented
- [ ] URL formats documented
- [ ] SSL/TLS considerations noted
- [ ] Cache control strategy defined
- [ ] .env.example updated

---

## Task 39: Configure AWS_S3_OBJECT_PARAMETERS

### Overview
Configure default parameters applied to all objects uploaded to S3. These parameters control caching, content encoding, access permissions, and metadata.

### Dependencies
- Task 38: Configure AWS_S3_CUSTOM_DOMAIN

### Instructions

1. **Open storage.py settings file**
   - Locate S3 configuration section
   - Position after custom domain setting

2. **Create AWS_S3_OBJECT_PARAMETERS dictionary**
   - Define as Python dictionary
   - Include Cache-Control header
   - Set content encoding options

3. **Configure Cache-Control**
   - Set max-age for browser caching
   - Use long cache for static assets
   - Configure based on file type

4. **Configure ACL (Access Control List)**
   - Set default ACL for objects
   - Use 'private' for tenant files
   - Use 'public-read' for public assets

5. **Add content encoding**
   - Enable gzip compression
   - Set content-encoding header
   - Optimize for transfer speed

6. **Document parameter purposes**
   - Explain each parameter
   - Note performance impact
   - Reference AWS documentation

### Object Parameters

| Parameter | Purpose | Example Value |
|-----------|---------|---------------|
| **CacheControl** | Browser caching duration | max-age=86400 |
| **ContentEncoding** | Compression method | gzip |
| **ACL** | Access permissions | private |
| **StorageClass** | Storage tier | STANDARD |
| **Metadata** | Custom metadata | {'tenant': 'shop123'} |

### Cache-Control Values

| File Type | Cache Duration | Cache-Control Header |
|-----------|---------------|---------------------|
| **Images** | 1 year | max-age=31536000, immutable |
| **CSS/JS** | 1 year | max-age=31536000, immutable |
| **Documents** | 1 hour | max-age=3600, private |
| **API Responses** | No cache | no-cache, no-store, must-revalidate |

### ACL (Access Control List)

| ACL Value | Description | Use Case |
|-----------|-------------|----------|
| **private** | Owner only | Invoices, contracts, private docs |
| **public-read** | Anyone can read | Product images, public content |
| **authenticated-read** | AWS authenticated users | Shared resources |

### Storage Classes

| Class | Cost | Retrieval | Use Case |
|-------|------|-----------|----------|
| **STANDARD** | Higher | Instant | Frequently accessed files |
| **INTELLIGENT_TIERING** | Variable | Instant | Unknown access patterns |
| **STANDARD_IA** | Lower | Instant | Infrequently accessed |
| **GLACIER** | Lowest | Minutes-hours | Archives |

### Content Encoding

Compression benefits:
1. **Bandwidth:** Reduced data transfer
2. **Speed:** Faster downloads
3. **Cost:** Lower transfer costs
4. **UX:** Better user experience

### Expected Outcome
```python
# In storage.py:

if USE_S3:
    # ... previous settings ...
    
    # CloudFront CDN
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('AWS_S3_CUSTOM_DOMAIN')
    
    # Object Parameters (applied to all uploaded files)
    AWS_S3_OBJECT_PARAMETERS = {
        # Cache for 1 day by default (can be overridden per file type)
        'CacheControl': 'max-age=86400',
    }
    
    # File access control
    AWS_DEFAULT_ACL = 'private'  # Private by default for security
    
    # Disable query string authentication for public files
    AWS_QUERYSTRING_AUTH = True  # Enable signed URLs for private files
```

### File-Specific Parameters

Different files may need different settings:

```python
# Example of file-type-specific parameters
OBJECT_PARAMETERS_BY_TYPE = {
    'images': {
        'CacheControl': 'max-age=31536000, immutable',
        'ContentType': 'image/jpeg',
    },
    'documents': {
        'CacheControl': 'max-age=3600, private',
        'ContentType': 'application/pdf',
    },
    'videos': {
        'CacheControl': 'max-age=86400',
        'ContentType': 'video/mp4',
    },
}
```

### Verification Checklist
- [ ] AWS_S3_OBJECT_PARAMETERS dictionary created
- [ ] Cache-Control configured appropriately
- [ ] ACL set to private by default
- [ ] Query string auth configured
- [ ] Content encoding considered
- [ ] File-type variations documented

---

## Task 40: Create TenantS3Storage Class

### Overview
Create the TenantS3Storage class that combines tenant isolation (from TenantFileStorage) with S3 backend capabilities. This class ensures tenant-specific paths while storing files in S3.

### Dependencies
- Task 39: Configure AWS_S3_OBJECT_PARAMETERS

### Instructions

1. **Open backends.py file**
   - Navigate to `backend/apps/core/storage/backends.py`
   - Prepare to add new class

2. **Import S3Boto3Storage**
   - Add import from storages.backends.s3boto3
   - Import S3Boto3Storage class
   - Prepare for inheritance

3. **Define TenantS3Storage class**
   - Inherit from S3Boto3Storage
   - Add comprehensive class docstring
   - Explain S3 + tenant isolation

4. **Add tenant path logic**
   - Import connection from django-tenants
   - Get current tenant schema
   - Prepend tenant to S3 paths

5. **Override key methods**
   - Prepare to override _save method
   - Plan for url method override
   - Plan for delete method override

6. **Document class usage**
   - Explain when to use vs FileSystemStorage
   - Note production vs development
   - Reference configuration requirements

### Class Design

| Aspect | Implementation |
|--------|----------------|
| **Base Class** | S3Boto3Storage |
| **Purpose** | Tenant-isolated S3 storage |
| **Path Pattern** | tenant-{schema}/{path} |
| **Backend** | AWS S3 |
| **Methods** | Override _save, url, delete |

### Inheritance Hierarchy

```
Django Storage Hierarchy:
Storage (base)
    ├── FileSystemStorage
    │   └── TenantFileStorage
    └── S3Boto3Storage
        └── TenantS3Storage (new)
```

### Storage Class Comparison

| Storage Class | Backend | Tenant Isolation | Use Case |
|---------------|---------|-----------------|----------|
| **FileSystemStorage** | Local disk | No | Development |
| **TenantFileStorage** | Local disk | Yes | Development with tenants |
| **S3Boto3Storage** | AWS S3 | No | Production, single tenant |
| **TenantS3Storage** | AWS S3 | Yes | Production, multi-tenant |

### Path Transformation Flow

```
File Upload:
  products/item.jpg
        ↓
Get Tenant: shop123
        ↓
Prepend Tenant: tenant-shop123/products/item.jpg
        ↓
Upload to S3: s3://bucket/tenant-shop123/products/item.jpg
        ↓
Return URL: https://cdn.domain.com/tenant-shop123/products/item.jpg
```

### Method Override Strategy

| Method | Purpose | Override Reason |
|--------|---------|----------------|
| **_save** | Save file to S3 | Add tenant prefix to path |
| **url** | Get file URL | Include tenant in URL |
| **delete** | Delete file | Verify tenant ownership |
| **exists** | Check file exists | Scope to tenant only |

### Expected Outcome
```python
# In backends.py:

from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage
from django_tenants.utils import connection

class TenantFileStorage(FileSystemStorage):
    """
    Tenant-isolated local file storage.
    Used in development.
    """
    # ... existing implementation ...


class TenantS3Storage(S3Boto3Storage):
    """
    Tenant-isolated S3 storage backend.
    
    Extends S3Boto3Storage to automatically prepend tenant identifier
    to all file paths, ensuring complete data isolation between tenants
    in production S3 storage.
    
    Path Format: tenant-{schema}/{file_path}
    Example: tenant-shop123/products/2026/01/22/item.jpg
    
    Usage:
        from apps.core.storage.backends import TenantS3Storage
        
        class ProductImage(models.Model):
            image = models.ImageField(storage=TenantS3Storage())
    """
    
    def get_tenant_path(self, name):
        """
        Prepend tenant identifier to file path.
        
        Args:
            name: Original file path
            
        Returns:
            Tenant-prefixed path: tenant-{schema}/{name}
        """
        # Get current tenant schema
        tenant_schema = connection.tenant.schema_name
        
        # Prepend tenant prefix
        return f"tenant-{tenant_schema}/{name}"
```

### Verification Checklist
- [ ] TenantS3Storage class defined
- [ ] Inherits from S3Boto3Storage
- [ ] Class docstring comprehensive
- [ ] get_tenant_path method created
- [ ] Imports are correct
- [ ] Usage example included

---

## Task 41: Override S3 Path Methods

### Overview
Override the _save, url, and delete methods in TenantS3Storage to ensure tenant isolation is maintained for all S3 operations. These overrides ensure tenant prefixes are consistently applied.

### Dependencies
- Task 40: Create TenantS3Storage Class

### Instructions

1. **Open backends.py file**
   - Locate TenantS3Storage class
   - Prepare to add method overrides

2. **Override _save method**
   - Accept name and content parameters
   - Get tenant path using get_tenant_path
   - Call parent _save with modified path
   - Return saved path

3. **Override url method**
   - Accept name parameter
   - Apply tenant prefix to path
   - Call parent url method
   - Return S3 or CloudFront URL

4. **Override delete method**
   - Accept name parameter
   - Apply tenant prefix
   - Verify file belongs to current tenant
   - Call parent delete method

5. **Add exists method override**
   - Check if file exists with tenant prefix
   - Prevent cross-tenant file checks
   - Return boolean result

6. **Add error handling**
   - Handle missing tenant context
   - Catch S3 operation errors
   - Log errors appropriately

### Method Implementation Strategy

| Method | Input | Process | Output |
|--------|-------|---------|--------|
| **_save** | name, content | Add tenant prefix → S3 upload | S3 path |
| **url** | name | Add tenant prefix → Generate URL | Full URL |
| **delete** | name | Add tenant prefix → S3 delete | None |
| **exists** | name | Add tenant prefix → Check S3 | Boolean |

### _save Method Flow

```
_save(name, content):
1. Get current tenant: connection.tenant.schema_name
2. Build tenant path: tenant-{schema}/{name}
3. Call parent _save(tenant_path, content)
4. Return saved path
5. Handle errors (log and raise)
```

### url Method Flow

```
url(name):
1. Get current tenant schema
2. Build tenant path: tenant-{schema}/{name}
3. Call parent url(tenant_path)
4. Returns CloudFront or S3 URL
5. URL includes tenant prefix automatically
```

### delete Method Flow

```
delete(name):
1. Get current tenant schema
2. Build tenant path: tenant-{schema}/{name}
3. Verify path starts with current tenant prefix
4. Call parent delete(tenant_path)
5. Log deletion for audit
```

### Error Handling

| Error Type | Handling Strategy |
|------------|------------------|
| **No Tenant Context** | Raise error (public schema not allowed) |
| **S3 Access Denied** | Log and raise PermissionDenied |
| **Bucket Not Found** | Log and raise ImproperlyConfigured |
| **Network Error** | Retry 3 times then raise |

### Expected Outcome
```python
# In backends.py (TenantS3Storage class):

    def _save(self, name, content):
        """
        Save file to S3 with tenant prefix.
        
        Args:
            name: File path
            content: File content
            
        Returns:
            Saved file path with tenant prefix
        """
        tenant_path = self.get_tenant_path(name)
        return super()._save(tenant_path, content)
    
    def url(self, name):
        """
        Get URL for file with tenant prefix.
        
        Args:
            name: File path
            
        Returns:
            Full URL (S3 or CloudFront)
        """
        tenant_path = self.get_tenant_path(name)
        return super().url(tenant_path)
    
    def delete(self, name):
        """
        Delete file from S3 with tenant prefix.
        
        Args:
            name: File path
        """
        tenant_path = self.get_tenant_path(name)
        return super().delete(tenant_path)
    
    def exists(self, name):
        """
        Check if file exists in tenant's S3 storage.
        
        Args:
            name: File path
            
        Returns:
            True if file exists
        """
        tenant_path = self.get_tenant_path(name)
        return super().exists(tenant_path)
```

### Testing Considerations

Test scenarios to verify:
1. **Save:** File uploaded to correct tenant path
2. **URL:** Generated URL includes tenant prefix
3. **Delete:** Only tenant's own files can be deleted
4. **Exists:** Only finds files in tenant's path
5. **Cross-Tenant:** Tenant A cannot access Tenant B files

### Verification Checklist
- [ ] _save method overridden
- [ ] url method overridden
- [ ] delete method overridden
- [ ] exists method overridden
- [ ] Tenant path applied consistently
- [ ] Error handling implemented
- [ ] Methods return correct types

---

## Summary

This document configured advanced S3 settings and created the TenantS3Storage class:

### Completed Configuration
1. ✅ AWS region configured (ap-south-1 Mumbai)
2. ✅ CloudFront custom domain support added
3. ✅ S3 object parameters configured
4. ✅ TenantS3Storage class created
5. ✅ S3 path methods overridden for tenant isolation
6. ✅ Complete tenant + S3 integration ready

### Next Steps
Proceed to [03_Tasks-42-46_Buckets-SignedURLs.md](03_Tasks-42-46_Buckets-SignedURLs.md) to configure separate buckets for public/private files and implement signed URLs.

### Key Achievements
- 🎯 TenantS3Storage combines best of both worlds
- 🎯 Tenant isolation maintained in S3
- 🎯 CloudFront CDN support configured
- 🎯 All S3 operations tenant-aware
- 🎯 Ready for production deployment

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [03_Tasks-42-46_Buckets-SignedURLs.md](03_Tasks-42-46_Buckets-SignedURLs.md)
