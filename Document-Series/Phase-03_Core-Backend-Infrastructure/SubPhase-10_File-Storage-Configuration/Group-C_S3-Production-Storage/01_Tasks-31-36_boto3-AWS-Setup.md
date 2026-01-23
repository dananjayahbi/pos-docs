# Tasks 31-36: boto3 and AWS Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** C - S3 Production Storage  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../Group-B_Tenant-Isolated-Storage/03_Tasks-25-30_Path-Utilities.md](../../Group-B_Tenant-Isolated-Storage/03_Tasks-25-30_Path-Utilities.md)
- **→ Next Document:** [02_Tasks-37-41_S3-Configuration.md](02_Tasks-37-41_S3-Configuration.md)

---

## Document Overview

This document covers the installation of boto3 and basic AWS configuration for S3 storage. These tasks establish the foundation for using Amazon S3 as the production file storage backend, including credentials and bucket configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Install boto3 | Simple |
| 32 | Pin boto3 Version | Simple |
| 33 | Create S3 Settings | Medium |
| 34 | Configure AWS_ACCESS_KEY_ID | Simple |
| 35 | Configure AWS_SECRET_ACCESS_KEY | Simple |
| 36 | Configure AWS_STORAGE_BUCKET_NAME | Simple |

---

## Task 31: Install boto3

### Overview
Install boto3, the official AWS SDK for Python, which provides the interface for interacting with Amazon S3 and other AWS services.

### Dependencies
- Task 30: Create File Path Utilities (Group B complete)

### Instructions

1. **Navigate to requirements directory**
   - Open `backend/requirements/` directory
   - Locate production.txt file

2. **Add boto3 to requirements**
   - Open production.txt file
   - Add boto3 to dependencies list
   - Place in storage section if organized

3. **Add django-storages package**
   - Add django-storages to same file
   - This package provides S3 storage backend
   - Includes boto3 integration

4. **Document package purposes**
   - Add comment explaining boto3 purpose
   - Note AWS S3 integration use
   - Reference storage backend usage

5. **Prepare for version pinning**
   - Leave version unpinned initially
   - Will pin in next task
   - Note latest version compatibility

### Package Purpose

| Package | Purpose | Usage |
|---------|---------|-------|
| **boto3** | AWS SDK for Python | S3 file operations, API calls |
| **django-storages** | Django storage backends | S3 integration with Django |

### AWS SDK Capabilities

boto3 provides:
- **S3 Operations:** Upload, download, delete files
- **Bucket Management:** Create, list, configure buckets
- **Access Control:** Manage permissions and policies
- **Signed URLs:** Generate temporary access URLs
- **Multipart Uploads:** Handle large file transfers
- **Metadata:** Set and retrieve file metadata

### Integration Points

```
Django Application
        ↓
django-storages (S3Boto3Storage)
        ↓
boto3 SDK
        ↓
AWS S3 API
        ↓
S3 Bucket Storage
```

### Expected Outcome
```
backend/requirements/
├── base.txt
├── development.txt
└── production.txt           # boto3 added
```

### Verification Checklist
- [ ] boto3 added to production.txt
- [ ] django-storages added to production.txt
- [ ] Comments document package purpose
- [ ] File is ready for version pinning

---

## Task 32: Pin boto3 Version

### Overview
Pin specific versions of boto3 and django-storages to ensure consistent behavior across environments and prevent unexpected breaking changes from automatic updates.

### Dependencies
- Task 31: Install boto3

### Instructions

1. **Check latest stable versions**
   - Visit PyPI for boto3
   - Visit PyPI for django-storages
   - Note current stable releases

2. **Pin boto3 version**
   - Add specific version constraint
   - Use format: boto3==1.34.0 (or latest)
   - Document version choice

3. **Pin django-storages version**
   - Add specific version constraint
   - Use format: django-storages[s3]==1.14.2 (or latest)
   - Include s3 extras for boto3 integration

4. **Add version comments**
   - Note date of version selection
   - Document known compatibility
   - Reference any security considerations

5. **Document update policy**
   - Add comment on version update frequency
   - Note security patch policy
   - Reference dependency review process

### Version Pinning Strategy

| Aspect | Strategy |
|--------|----------|
| **Format** | Exact version (==) for production |
| **Updates** | Regular security reviews |
| **Testing** | Test upgrades in staging first |
| **Documentation** | Comment rationale for versions |
| **Security** | Monitor CVE announcements |

### Version Format Examples

```
# AWS SDK and Storage
boto3==1.34.0              # AWS SDK - updated 2026-01-15
django-storages[s3]==1.14.2  # S3 storage backend - S3 extras included
```

### Compatibility Considerations

| Package | Minimum Version | Python Version | Django Version |
|---------|----------------|----------------|----------------|
| **boto3** | 1.28.0+ | 3.12+ | N/A |
| **django-storages** | 1.14.0+ | 3.12+ | 5.0+ |

### Security Updates

When to update pinned versions:
1. **Critical Security Patch:** Update immediately
2. **High Severity CVE:** Update within 1 week
3. **Medium Severity:** Update in next sprint
4. **Feature Release:** Evaluate quarterly
5. **Breaking Changes:** Plan migration carefully

### Expected Outcome
```python
# In production.txt:

# AWS SDK and Storage (Production file storage)
boto3==1.34.0                # AWS SDK for Python - S3 integration
django-storages[s3]==1.14.2  # Django storage backends with S3 support
```

### Verification Checklist
- [ ] boto3 version is pinned with ==
- [ ] django-storages version is pinned with [s3] extras
- [ ] Version numbers are current and stable
- [ ] Comments explain version choices
- [ ] Update policy is documented

---

## Task 33: Create S3 Settings

### Overview
Create a dedicated settings module for S3 configuration, organizing all AWS-related settings in one location for easy management and environment-specific overrides.

### Dependencies
- Task 32: Pin boto3 Version

### Instructions

1. **Create storage.py settings module**
   - Navigate to `backend/config/settings/` directory
   - Create new file named `storage.py`
   - This will hold all storage-related settings

2. **Add module docstring**
   - Document purpose: S3 and file storage configuration
   - Note environment variable usage
   - Reference production vs development backends

3. **Add import section**
   - Import os for environment variables
   - Import environ for type-safe env access
   - Prepare for settings organization

4. **Create S3 settings section**
   - Add clear comment header
   - Group all AWS S3 settings together
   - Prepare for configuration variables

5. **Add backend switcher**
   - Create USE_S3 flag from environment
   - Default to False for development
   - Allow override for production

6. **Document settings structure**
   - Add comments explaining each section
   - Note required vs optional settings
   - Reference AWS documentation

### Settings Module Structure

```
storage.py:
├── Module Docstring
├── Imports
├── S3 Configuration Section
│   ├── USE_S3 flag
│   ├── AWS credentials
│   ├── Bucket configuration
│   ├── Region settings
│   ├── Custom domain (CloudFront)
│   └── Object parameters
├── Storage Backend Selection
│   ├── If USE_S3: S3Boto3Storage
│   └── Else: FileSystemStorage
└── File Upload Settings
    ├── Max file size
    ├── Allowed extensions
    └── Upload path templates
```

### Configuration Organization

| Section | Purpose | Settings |
|---------|---------|----------|
| **AWS Credentials** | Authentication | ACCESS_KEY_ID, SECRET_ACCESS_KEY |
| **Bucket Config** | Storage location | BUCKET_NAME, REGION |
| **URL Config** | Public access | CUSTOM_DOMAIN, QUERYSTRING_AUTH |
| **Object Settings** | File metadata | Cache-Control, ACL |
| **Backend Selection** | Storage choice | DEFAULT_FILE_STORAGE |

### Environment-Based Configuration

```
Development:
  USE_S3 = False
  Storage = FileSystemStorage
  Location = MEDIA_ROOT
  
Production:
  USE_S3 = True
  Storage = S3Boto3Storage
  Location = S3 Bucket
```

### Storage Backend Switching

The USE_S3 flag controls:
1. **Storage Backend:** FileSystemStorage vs S3Boto3Storage
2. **Media URLs:** Local URLs vs S3/CloudFront URLs
3. **File Operations:** Local filesystem vs S3 API
4. **Cost:** No cost (dev) vs S3 charges (prod)

### Expected Outcome
```
backend/config/settings/
├── __init__.py
├── base.py
├── development.py
├── production.py
└── storage.py               # New S3 configuration module
```

### Verification Checklist
- [ ] storage.py file created in settings directory
- [ ] Module docstring is comprehensive
- [ ] Imports are included
- [ ] S3 settings section is prepared
- [ ] USE_S3 flag is defined
- [ ] File is ready for configuration variables

---

## Task 34: Configure AWS_ACCESS_KEY_ID

### Overview
Configure the AWS Access Key ID setting, which provides authentication for AWS services. This credential identifies the AWS account and user making API requests.

### Dependencies
- Task 33: Create S3 Settings

### Instructions

1. **Open storage.py settings file**
   - Navigate to `backend/config/settings/storage.py`
   - Locate S3 configuration section

2. **Add AWS_ACCESS_KEY_ID setting**
   - Read from environment variable
   - Use AWS_ACCESS_KEY_ID as variable name
   - Set default to None or empty string

3. **Add security warning comment**
   - Note: Never commit credentials to git
   - Explain environment variable requirement
   - Reference .env file usage

4. **Document credential source**
   - AWS IAM user or role
   - Required permissions for S3
   - Least privilege principle

5. **Add validation**
   - Check if USE_S3 is True
   - Verify ACCESS_KEY_ID is set
   - Raise error if missing in production

### AWS Access Key ID Purpose

| Aspect | Description |
|--------|-------------|
| **Purpose** | Identifies AWS account/user |
| **Format** | 20 uppercase alphanumeric characters |
| **Example** | AKIAIOSFODNN7EXAMPLE |
| **Paired With** | SECRET_ACCESS_KEY |
| **Rotation** | Should rotate periodically |

### Security Best Practices

1. **Never Hardcode:** Always use environment variables
2. **Rotate Regular:** Change keys every 90 days
3. **Limit Scope:** Use IAM roles with minimal permissions
4. **Monitor Usage:** Enable CloudTrail logging
5. **Separate Keys:** Different keys for dev/staging/prod
6. **Secure Storage:** Use secrets manager in production

### Required IAM Permissions

Minimum S3 permissions needed:
```
S3 Permissions Required:
- s3:PutObject (upload files)
- s3:GetObject (download files)
- s3:DeleteObject (delete files)
- s3:ListBucket (list files)
- s3:PutObjectAcl (set permissions)
```

### Environment Variable Configuration

| Environment | Variable Source | Backup |
|-------------|----------------|--------|
| **Development** | .env file | Local only |
| **Staging** | Platform env vars | Secrets manager |
| **Production** | Secrets manager | Encrypted backup |

### Credential Validation

```
Validation Flow:
1. Check if USE_S3 = True
2. If True, verify AWS_ACCESS_KEY_ID is set
3. If missing, raise ImproperlyConfigured error
4. Log warning if using default/placeholder value
5. Verify format (20 characters, alphanumeric)
```

### Expected Outcome
```python
# In storage.py:

import os
from django.core.exceptions import ImproperlyConfigured

# AWS S3 Configuration
USE_S3 = os.environ.get('USE_S3', 'False') == 'True'

if USE_S3:
    # AWS Credentials - NEVER commit these to git
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    
    if not AWS_ACCESS_KEY_ID:
        raise ImproperlyConfigured(
            'AWS_ACCESS_KEY_ID environment variable is required when USE_S3=True'
        )
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
USE_S3=False
AWS_ACCESS_KEY_ID=your_access_key_here
```

### Verification Checklist
- [ ] AWS_ACCESS_KEY_ID setting added
- [ ] Reads from environment variable
- [ ] Security warning comment included
- [ ] Validation logic added for production
- [ ] .env.example updated with placeholder
- [ ] Never hardcoded actual credentials

---

## Task 35: Configure AWS_SECRET_ACCESS_KEY

### Overview
Configure the AWS Secret Access Key setting, which is the password component of AWS credentials. This secret key must be kept secure and never exposed in code or logs.

### Dependencies
- Task 34: Configure AWS_ACCESS_KEY_ID

### Instructions

1. **Open storage.py settings file**
   - Locate AWS credentials section
   - Position after AWS_ACCESS_KEY_ID

2. **Add AWS_SECRET_ACCESS_KEY setting**
   - Read from environment variable
   - Use AWS_SECRET_ACCESS_KEY as variable name
   - Set default to None

3. **Add enhanced security warning**
   - Note critical security importance
   - Warn against logging this value
   - Reference encryption requirements

4. **Add validation**
   - Verify secret key is set when USE_S3 is True
   - Check minimum length (40 characters)
   - Raise error if missing or invalid

5. **Document key rotation policy**
   - Note recommended rotation frequency
   - Reference credential update process
   - Link to AWS security best practices

### AWS Secret Access Key Properties

| Aspect | Description |
|--------|-------------|
| **Purpose** | Password for AWS authentication |
| **Format** | 40 characters (base64-encoded) |
| **Example** | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| **Security** | Must be kept absolutely secret |
| **Paired With** | AWS_ACCESS_KEY_ID |

### Security Considerations

| Risk | Mitigation |
|------|------------|
| **Git Exposure** | Use environment variables only |
| **Log Leakage** | Never log or print secret key |
| **Code Review** | Scan for hardcoded secrets |
| **Access Control** | Limit who can view production secrets |
| **Transmission** | Use encrypted channels only |
| **Storage** | Encrypt at rest in secrets manager |

### Secret Key Validation

```
Validation Steps:
1. Check if USE_S3 = True
2. Verify AWS_SECRET_ACCESS_KEY is set
3. Validate length (should be 40 characters)
4. Verify format (alphanumeric + symbols)
5. Ensure not using placeholder value
6. Raise ImproperlyConfigured if invalid
```

### Key Rotation Process

1. **Generate New Key:** Create new access key in IAM
2. **Update Staging:** Deploy new key to staging
3. **Test Staging:** Verify S3 operations work
4. **Update Production:** Deploy to production
5. **Monitor:** Check for authentication errors
6. **Deactivate Old:** Disable old key after verification
7. **Delete Old:** Remove old key after grace period

### Environment-Specific Management

| Environment | Storage Method | Access Control |
|-------------|---------------|----------------|
| **Local Dev** | .env file (gitignored) | Developer only |
| **Staging** | Platform secrets | DevOps team |
| **Production** | AWS Secrets Manager | Senior DevOps only |

### Expected Outcome
```python
# In storage.py:

if USE_S3:
    # AWS Credentials - NEVER commit these to git
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    
    # Validate credentials are set
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        raise ImproperlyConfigured(
            'AWS credentials (ACCESS_KEY_ID and SECRET_ACCESS_KEY) '
            'are required when USE_S3=True'
        )
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
USE_S3=False
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### Security Checklist
- [ ] AWS_SECRET_ACCESS_KEY setting added
- [ ] Reads from environment variable
- [ ] Enhanced security warnings included
- [ ] Validation logic verifies presence
- [ ] Never logged or printed
- [ ] Never hardcoded actual secret
- [ ] .env.example shows placeholder only

---

## Task 36: Configure AWS_STORAGE_BUCKET_NAME

### Overview
Configure the S3 bucket name where files will be stored. The bucket name must be globally unique across all AWS accounts and follow AWS naming conventions.

### Dependencies
- Task 35: Configure AWS_SECRET_ACCESS_KEY

### Instructions

1. **Open storage.py settings file**
   - Locate S3 configuration section
   - Position after AWS credentials

2. **Add AWS_STORAGE_BUCKET_NAME setting**
   - Read from environment variable
   - Use AWS_STORAGE_BUCKET_NAME as variable name
   - No default value for production

3. **Document bucket naming rules**
   - Lowercase letters only
   - Numbers and hyphens allowed
   - 3-63 characters length
   - No uppercase or underscores

4. **Add validation**
   - Check bucket name is set when USE_S3 is True
   - Validate format (lowercase, no spaces)
   - Raise error if invalid or missing

5. **Document bucket organization**
   - Note tenant isolation strategy
   - Explain public vs private bucket usage
   - Reference bucket policy requirements

### S3 Bucket Naming Rules

| Rule | Requirement |
|------|-------------|
| **Length** | 3-63 characters |
| **Characters** | Lowercase letters, numbers, hyphens |
| **Start/End** | Must start and end with letter or number |
| **No Uppercase** | All lowercase only |
| **No Spaces** | No spaces or special characters |
| **Unique** | Globally unique across all AWS |
| **DNS Compliant** | Valid DNS name format |

### Bucket Naming Examples

| Type | Example | Purpose |
|------|---------|---------|
| **Development** | lankacommerce-dev-media | Dev environment files |
| **Staging** | lankacommerce-staging-media | Staging environment |
| **Production** | lankacommerce-prod-media | Production tenant files |
| **Public Assets** | lankacommerce-public-assets | Non-tenant static files |
| **Backups** | lankacommerce-prod-backups | Database backups |

### Bucket Organization Strategy

```
S3 Bucket Structure:
lankacommerce-prod-media/
├── tenant-shop123/
│   ├── products/
│   ├── invoices/
│   └── avatars/
├── tenant-cafe456/
│   ├── products/
│   ├── invoices/
│   └── avatars/
└── tenant-store789/
    ├── products/
    ├── invoices/
    └── avatars/
```

### Bucket Configuration Requirements

| Setting | Recommended Value | Purpose |
|---------|------------------|---------|
| **Versioning** | Enabled | File recovery |
| **Encryption** | AES-256 (default) | Data security |
| **Access Logging** | Enabled | Audit trail |
| **Public Access** | Blocked (except public bucket) | Security |
| **Lifecycle Rules** | Optional | Cost optimization |

### Multi-Bucket Strategy

Different buckets for different purposes:

1. **Private Media Bucket:**
   - Tenant-specific files
   - Invoices, contracts
   - Signed URLs required
   - No public access

2. **Public Media Bucket:**
   - Product images
   - Public documents
   - Direct access allowed
   - CDN integration

3. **Static Assets Bucket:**
   - CSS, JS files
   - Frontend assets
   - CloudFront distribution
   - Cache-friendly

### Expected Outcome
```python
# In storage.py:

if USE_S3:
    # AWS Credentials
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    
    # S3 Bucket Configuration
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    
    # Validate bucket name
    if not AWS_STORAGE_BUCKET_NAME:
        raise ImproperlyConfigured(
            'AWS_STORAGE_BUCKET_NAME is required when USE_S3=True'
        )
```

### .env.example Entry
```bash
# AWS S3 Storage (Production only)
USE_S3=False
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_STORAGE_BUCKET_NAME=lankacommerce-prod-media
```

### Verification Checklist
- [ ] AWS_STORAGE_BUCKET_NAME setting added
- [ ] Reads from environment variable
- [ ] Validation logic checks presence
- [ ] Bucket naming rules documented
- [ ] .env.example updated with example
- [ ] Multi-bucket strategy documented
- [ ] Naming follows AWS rules (lowercase, hyphens)

---

## Summary

This document established the foundation for AWS S3 storage integration:

### Completed Configuration
1. ✅ boto3 and django-storages installed
2. ✅ Package versions pinned for consistency
3. ✅ S3 settings module created
4. ✅ AWS credentials configured securely
5. ✅ S3 bucket name configured
6. ✅ Environment variable structure established

### Next Steps
Proceed to [02_Tasks-37-41_S3-Configuration.md](02_Tasks-37-41_S3-Configuration.md) to configure S3 region, custom domain, and create the TenantS3Storage class.

### Security Reminders
- ⚠️ Never commit AWS credentials to git
- ⚠️ Use environment variables for all secrets
- ⚠️ Rotate access keys regularly (90 days)
- ⚠️ Use IAM roles with minimal permissions
- ⚠️ Enable CloudTrail for audit logging
- ⚠️ Monitor for unauthorized access

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [02_Tasks-37-41_S3-Configuration.md](02_Tasks-37-41_S3-Configuration.md)
