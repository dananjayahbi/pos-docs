# Tasks 52-58: File Storage, Upload API, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** D - Proof Upload & Verification  
> **Document:** 02 of 02  
> **Tasks Covered:** 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-51_Model-Validation.md](01_Tasks-45-51_Model-Validation.md)
- **→ Next Group:** [../Group-E_Admin-Verification-Workflow/](../Group-E_Admin-Verification-Workflow/)

---

## Document Overview

This document covers file storage configuration, upload API implementation, and verification testing for payment proof uploads. It implements file size limits, automatic image compression for large files, secure pre-signed upload URLs, S3 storage configuration with proper bucket organization, RESTful upload API endpoints with authentication, support for multiple proof uploads per transaction, and comprehensive end-to-end verification of the complete upload workflow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 52 | Create File Size Limit (5MB) | Low | 20 min |
| 53 | Create Image Compression | Medium | 45 min |
| 54 | Create Secure Upload URLs | Medium | 40 min |
| 55 | Create S3 Storage Configuration | Medium | 50 min |
| 56 | Create Upload API Endpoint | Medium | 50 min |
| 57 | Create Multiple Uploads Support | Low | 25 min |
| 58 | Verify Upload Flow | Low | 30 min |

---

## Task 52: Create File Size Limit (5MB)

### Overview
Implement a 5MB file size limit for payment proof uploads to prevent abuse, manage storage costs, and ensure reasonable upload times. This validator rejects oversized files before processing, provides clear error messages, and works in conjunction with image compression (Task 53) to handle legitimate receipts that exceed the limit.

### Dependencies
- Task 49: Create Upload Validation Framework

### Instructions

1. **Define file size constant**
   - Open `file_validators.py`
   - Define MAX_FILE_SIZE constant
   - Set value to 5 * 1024 * 1024 (5,242,880 bytes = 5 MB)
   - Use constant for consistency

2. **Create size validator function**
   - Define `validate_file_size(file)` function
   - This function checks file size against limit
   - Called early in validation chain

3. **Get file size**
   - Access file.size attribute (in bytes)
   - Django's UploadedFile provides this property
   - Size available without reading entire file

4. **Compare to maximum**
   - Check if file.size > MAX_FILE_SIZE
   - If exceeded, raise ValidationError
   - Include actual size and limit in error message

5. **Format error message**
   - Convert bytes to human-readable format (MB)
   - "File size exceeds 5MB limit. Your file: 6.2MB"
   - Use helper function for formatting

6. **Create size formatting utility**
   - Define `format_file_size(bytes)` function
   - Convert bytes to KB, MB, GB as appropriate
   - Return formatted string with unit

7. **Add validator to framework**
   - Call `validate_file_size()` early in validation
   - Check size before opening file (efficiency)
   - Prevents processing of oversized files

8. **Consider compression exemption**
   - Note: Images may be compressed before validation
   - If compressed in Task 53, size checked after compression
   - Ensures final stored file under limit

### File Size Validation Flow

```
File Upload
    │
    ▼
validate_file_size(file)
    │
    ├─► Get file.size (bytes)
    │
    ├─► Compare to MAX_FILE_SIZE (5 MB)
    │       │
    │       ├─► ✓ file.size <= 5 MB → Continue
    │       │
    │       └─► ✗ file.size > 5 MB
    │               │
    │               ├─► Is image? → Compress (Task 53) → Re-check
    │               │
    │               └─► Not image → ValidationError
    │
    └─► Continue to other validators
```

### Size Limit Rationale

| Aspect | Consideration | 5MB Limit |
|--------|---------------|-----------|
| Average receipt | 50-500 KB | ✓ Well under limit |
| Scanned document | 1-2 MB | ✓ Acceptable |
| High-res photo | 2-4 MB | ✓ Can compress |
| Excessive file | > 5 MB | ✗ Unnecessary |
| Storage cost | Per-GB pricing | ✓ Cost-effective |
| Upload time | On mobile networks | ✓ Reasonable |

### File Size Examples

| File | Original Size | Compressed | After Validation | Result |
|------|---------------|------------|------------------|--------|
| receipt.jpg | 350 KB | N/A | 350 KB | ✓ Pass |
| scan.pdf | 2.1 MB | N/A | 2.1 MB | ✓ Pass |
| photo.jpg | 6.5 MB | 3.2 MB | 3.2 MB | ✓ Pass (compressed) |
| photo.png | 4.8 MB | N/A | 4.8 MB | ✓ Pass |
| document.pdf | 7 MB | N/A | 7 MB | ✗ Fail (PDF not compressed) |
| huge.jpg | 15 MB | 8 MB | 8 MB | ✗ Still too large |

### Size Formatting Function

```python
def format_file_size(bytes):
    """
    Convert bytes to human-readable format.
    
    Examples:
        1024 → "1.0 KB"
        1048576 → "1.0 MB"
        5242880 → "5.0 MB"
    """
    if bytes < 1024:
        return f"{bytes} B"
    elif bytes < 1024 * 1024:
        return f"{bytes / 1024:.1f} KB"
    elif bytes < 1024 * 1024 * 1024:
        return f"{bytes / (1024 * 1024):.1f} MB"
    else:
        return f"{bytes / (1024 * 1024 * 1024):.1f} GB"
```

### Error Messages

| Scenario | Error Message | Action |
|----------|---------------|--------|
| PDF too large | "File size (6.2 MB) exceeds 5MB limit" | Reject, ask user to reduce size |
| Image too large | "Image too large, attempting compression..." | Compress, then re-validate |
| After compression | "File size (3.1 MB) acceptable after compression" | Success |
| Compression failed | "File exceeds 5MB even after compression (6.8 MB)" | Reject |

### Configuration

| Setting | Value | Location |
|---------|-------|----------|
| MAX_FILE_SIZE | 5242880 (5 MB) | file_validators.py |
| Setting name | PAYMENT_PROOF_MAX_SIZE | settings.py (optional) |
| Environment var | MAX_PROOF_SIZE_MB | .env (optional) |
| Default | 5 MB | Hardcoded fallback |

### Expected Outcome
- File size limit of 5MB enforced
- Clear error messages with actual sizes
- Size checked early to save processing
- Integration with image compression
- Human-readable size formatting

### Verification Checklist
- [ ] MAX_FILE_SIZE constant defined (5 MB)
- [ ] validate_file_size() function created
- [ ] File size accessed via file.size attribute
- [ ] ValidationError raised for oversized files
- [ ] Error message includes actual and max size
- [ ] format_file_size() utility function created
- [ ] Validator integrated into validation framework
- [ ] Tested with files under, at, and over limit
- [ ] Works with compression in Task 53

---

## Task 53: Create Image Compression

### Overview
Implement automatic image compression for large uploaded photos to ensure they meet the 5MB size limit while maintaining sufficient quality for verification. This feature uses Pillow library to resize and compress images intelligently, reducing file size without significant quality loss. Compression applies only to images over a threshold (e.g., 2MB), preserving original quality for smaller files.

### Dependencies
- Task 49: Create Upload Validation Framework
- Task 50: Create Image Validation
- Task 52: Create File Size Limit

### Instructions

1. **Define compression constants**
   - Create COMPRESSION_THRESHOLD = 2 * 1024 * 1024 (2 MB)
   - Create MAX_DIMENSION = 2000 (pixels)
   - Create COMPRESSION_QUALITY = 85 (JPEG quality)
   - These control when and how to compress

2. **Create compression function**
   - Define `compress_image(file)` function
   - Returns compressed file or original if no compression needed
   - Preserves file format (JPG → JPG, PNG → PNG)

3. **Check if compression needed**
   - If file.size <= COMPRESSION_THRESHOLD, return original
   - Only compress files over 2MB
   - Avoids unnecessary quality loss

4. **Open image with Pillow**
   - Use `Image.open(file)` to load image
   - Get current dimensions: width, height
   - Get image format: 'JPEG' or 'PNG'

5. **Calculate new dimensions**
   - If both dimensions <= MAX_DIMENSION, skip resize
   - Find scaling factor to fit within MAX_DIMENSION
   - Maintain aspect ratio
   - Example: 4000x3000 → 2000x1500

6. **Resize image**
   - Use `image.thumbnail((max_w, max_h), Image.LANCZOS)`
   - LANCZOS provides high-quality downscaling
   - Maintains aspect ratio automatically

7. **Compress and save**
   - For JPEG: Save with quality=COMPRESSION_QUALITY (85%)
   - For PNG: Use optimize=True for better compression
   - Save to BytesIO buffer to keep in memory
   - Convert buffer to Django UploadedFile

8. **Handle PNG to JPEG conversion**
   - If PNG > 3MB, consider converting to JPEG
   - PNG files are larger but lossless
   - JPEG more efficient for photos
   - Ask user or auto-convert with notification

9. **Integrate with validation**
   - Call `compress_image()` before size validation
   - If original > 5MB, try compression first
   - Then validate compressed size
   - Store compressed version if successful

10. **Preserve metadata**
    - Copy important EXIF data if needed
    - Preserve orientation information
    - Strip unnecessary metadata for privacy

### Image Compression Flow

```
Large Image Upload (e.g., 6.5 MB, 4000x3000)
    │
    ▼
compress_image(file)
    │
    ├─► Check size: 6.5 MB > 2 MB threshold?
    │       └─► ✓ Yes → Compress needed
    │
    ├─► Check dimensions: 4000x3000 > 2000 max?
    │       └─► ✓ Yes → Resize needed
    │
    ├─► Calculate new dimensions
    │       4000x3000 → 2000x1500 (maintain ratio)
    │
    ├─► Resize image
    │       LANCZOS algorithm (high quality)
    │
    ├─► Compress JPEG
    │       Quality: 85%
    │       Result: 3.2 MB
    │
    ├─► Check final size: 3.2 MB < 5 MB?
    │       └─► ✓ Yes → Success
    │
    └─► Return compressed file
            │
            ▼
        Continue validation
```

### Compression Scenarios

| Original | Dimensions | Size | Action | Result Dims | Result Size |
|----------|------------|------|--------|-------------|-------------|
| photo.jpg | 1600x1200 | 800 KB | None (< 2MB) | 1600x1200 | 800 KB |
| scan.jpg | 3000x2000 | 3.5 MB | Resize + Compress | 2000x1333 | 1.8 MB |
| highres.jpg | 5000x4000 | 8 MB | Resize + Compress | 2000x1600 | 3.5 MB |
| phone.jpg | 4032x3024 | 6.2 MB | Resize + Compress | 2000x1500 | 2.9 MB |
| screenshot.png | 2560x1440 | 4.5 MB | Optimize PNG | 2000x1125 | 2.1 MB |

### Compression Algorithm

```python
def compress_image(file):
    # Check if compression needed
    if file.size <= COMPRESSION_THRESHOLD:
        return file
    
    # Open image
    image = Image.open(file)
    width, height = image.size
    format = image.format
    
    # Calculate new dimensions
    max_dim = MAX_DIMENSION
    if width > max_dim or height > max_dim:
        if width > height:
            new_width = max_dim
            new_height = int(height * (max_dim / width))
        else:
            new_height = max_dim
            new_width = int(width * (max_dim / height))
        
        # Resize
        image.thumbnail((new_width, new_height), Image.LANCZOS)
    
    # Save compressed
    buffer = BytesIO()
    if format == 'JPEG':
        image.save(buffer, format='JPEG', quality=COMPRESSION_QUALITY, optimize=True)
    elif format == 'PNG':
        image.save(buffer, format='PNG', optimize=True)
    
    buffer.seek(0)
    return InMemoryUploadedFile(buffer, ...)
```

### Quality Comparison

| Quality | File Size | Visual Quality | Use Case |
|---------|-----------|----------------|----------|
| 95% | Largest | Excellent | Professional photos |
| 85% | Medium | Very Good | ✓ Payment proofs (recommended) |
| 75% | Small | Good | Acceptable for receipts |
| 60% | Smallest | Fair | Not recommended |

### PNG vs JPEG

| Format | Pros | Cons | Best For |
|--------|------|------|----------|
| JPEG | Smaller size, efficient compression | Lossy, no transparency | Photos, complex images |
| PNG | Lossless, transparency support | Larger files | Screenshots, simple graphics |

### Compression Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| COMPRESSION_THRESHOLD | 2 MB | Only compress files > 2MB |
| MAX_DIMENSION | 2000 px | Maximum width/height |
| COMPRESSION_QUALITY | 85% | Balance size/quality |
| RESIZE_ALGORITHM | LANCZOS | High-quality downscale |

### Expected Outcome
- Automatic compression for large images
- Files over 2MB intelligently reduced
- Image dimensions capped at 2000 pixels
- JPEG quality of 85% maintains readability
- Compressed files stored instead of originals
- Users can upload high-res photos without manual resize

### Verification Checklist
- [ ] Compression constants defined
- [ ] compress_image() function created
- [ ] Compression only applies to files > 2MB
- [ ] Image dimensions resized to max 2000 pixels
- [ ] Aspect ratio maintained during resize
- [ ] JPEG quality set to 85%
- [ ] PNG optimization enabled
- [ ] Function returns compressed UploadedFile
- [ ] Integrated with validation workflow
- [ ] Tested with various image sizes and formats
- [ ] Compressed images remain readable

---

## Task 54: Create Secure Upload URLs

### Overview
Implement pre-signed URL generation for secure direct-to-S3 uploads. This approach allows customers to upload payment proofs directly to S3 without routing through the Django backend, reducing server load and improving upload speed. Pre-signed URLs are time-limited (15 minutes), restricted to specific file paths, and require authentication to obtain, ensuring security while enabling efficient uploads.

### Dependencies
- Task 45: Create PaymentProof Model
- Task 55: Create S3 Storage Configuration (can implement in parallel)

### Instructions

1. **Install AWS SDK**
   - Add boto3 to requirements.txt
   - Version: boto3>=1.26.0
   - This library generates pre-signed URLs

2. **Create S3 utility file**
   - Navigate to `backend/apps/payments/utils/`
   - Create file `s3_utils.py`
   - This file handles S3 operations

3. **Define S3 configuration**
   - Import settings from Django
   - Get AWS credentials from settings
   - Get S3 bucket name from settings
   - Get region from settings

4. **Create S3 client**
   - Initialize boto3 S3 client
   - Use credentials from settings
   - Configure region

5. **Implement pre-signed URL generation**
   - Define `generate_presigned_upload_url()` function
   - Parameters: transaction, filename, content_type
   - Returns: dict with url, fields, and key

6. **Generate upload path**
   - Use same path logic as FileField
   - Format: `proofs/{tenant_id}/{order_ref}/{filename}`
   - Ensures consistency with direct uploads

7. **Create pre-signed POST policy**
   - Use `s3_client.generate_presigned_post()`
   - Set bucket name
   - Set object key (upload path)
   - Set expiration time (900 seconds = 15 minutes)
   - Set conditions for security

8. **Add upload conditions**
   - Content-Type must match specified type
   - Content-Length maximum (5 MB)
   - Restrict to specific object key
   - These prevent abuse of signed URL

9. **Return upload details**
   - Return dictionary with:
     - `url`: S3 endpoint URL
     - `fields`: Form fields for upload (key, policy, signature)
     - `key`: Object key (for reference)
     - `expires`: Expiration timestamp

10. **Create URL retrieval endpoint**
    - Add method to get pre-signed URL
    - Authenticate customer
    - Verify transaction ownership
    - Generate and return signed URL

### Pre-Signed URL Flow

```
Customer                  Django API              S3
    │                         │                    │
    │ 1. Request upload URL   │                    │
    ├─────────────────────────►                    │
    │                         │                    │
    │                         │ 2. Generate        │
    │                         │    pre-signed URL  │
    │                         │                    │
    │ 3. Return URL + fields  │                    │
    ◄─────────────────────────┤                    │
    │                         │                    │
    │ 4. Upload directly      │                    │
    ├──────────────────────────────────────────────►
    │                         │                    │
    │                         │                    │ 5. Store file
    │                         │                    │
    │ 6. Confirm upload       │                    │
    ◄──────────────────────────────────────────────┤
    │                         │                    │
    │ 7. Notify completion    │                    │
    ├─────────────────────────►                    │
    │                         │                    │
    │                         │ 8. Create record   │
    │                         │                    │
```

### Pre-Signed URL Components

| Component | Description | Example |
|-----------|-------------|---------|
| URL | S3 endpoint | https://bucket.s3.region.amazonaws.com/ |
| Key | Object path | proofs/tenant/order/file.jpg |
| Policy | Access rules | Base64-encoded JSON policy |
| Signature | HMAC signature | Validates authenticity |
| Expiration | Time limit | 2025-01-31T15:45:00Z (15 min) |
| Conditions | Upload restrictions | Max size, content type |

### Pre-Signed POST Policy

```python
def generate_presigned_upload_url(transaction, filename, content_type):
    # Generate key
    tenant_id = transaction.customer.tenant.id
    order_ref = transaction.order.reference
    key = f"proofs/{tenant_id}/{order_ref}/{filename}"
    
    # Set conditions
    conditions = [
        {'bucket': settings.AWS_STORAGE_BUCKET_NAME},
        {'key': key},
        {'Content-Type': content_type},
        ['content-length-range', 0, MAX_FILE_SIZE],
    ]
    
    # Generate presigned POST
    response = s3_client.generate_presigned_post(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key,
        Fields={'Content-Type': content_type},
        Conditions=conditions,
        ExpiresIn=900  # 15 minutes
    )
    
    return {
        'url': response['url'],
        'fields': response['fields'],
        'key': key,
        'expires_in': 900
    }
```

### Security Considerations

| Threat | Mitigation |
|--------|------------|
| Unauthorized upload | Require authentication to get URL |
| Upload wrong file | Restrict content-type in policy |
| Upload oversized file | Set max content-length |
| Upload to wrong path | Lock object key in policy |
| Reuse expired URL | 15-minute expiration |
| Intercept URL | HTTPS only |

### URL Expiration Handling

```
Time: T+0 minutes
  ├─► URL generated, valid for 15 minutes
  │
Time: T+5 minutes
  ├─► Customer selects file, starts upload ✓
  │
Time: T+10 minutes
  ├─► Upload in progress ✓
  │
Time: T+14 minutes
  ├─► Upload completes successfully ✓
  │
Time: T+16 minutes
  └─► URL expired, new upload attempt fails ✗
      └─► Customer must request new URL
```

### Expected Outcome
- Pre-signed URL generation implemented
- Direct-to-S3 uploads enabled
- 15-minute expiration for security
- Upload restricted by content-type and size
- Reduces backend server load
- Faster upload experience for customers

### Verification Checklist
- [ ] boto3 added to requirements.txt
- [ ] s3_utils.py created with S3 client
- [ ] generate_presigned_upload_url() function implemented
- [ ] Upload path matches FileField path logic
- [ ] generate_presigned_post() used for POST policy
- [ ] Expiration set to 900 seconds (15 minutes)
- [ ] Conditions restrict content-type and size
- [ ] Function returns url, fields, and key
- [ ] Authentication required to obtain URL
- [ ] Tested with actual S3 upload

---

## Task 55: Create S3 Storage Configuration

### Overview
Configure Amazon S3 as the production storage backend for payment proof files. This setup provides scalable, durable, and secure cloud storage with proper bucket organization, access controls, lifecycle policies, and integration with Django's storage system. The configuration supports both development (local storage) and production (S3) environments through Django settings.

### Dependencies
- Task 46: Create File Field Configuration
- AWS account with S3 access

### Instructions

1. **Install S3 storage library**
   - Add django-storages to requirements.txt
   - Version: django-storages[boto3]>=1.13
   - Provides Django storage backend for S3

2. **Create S3 bucket**
   - Log in to AWS Console
   - Navigate to S3 service
   - Create new bucket named `lcc-payment-proofs` or similar
   - Select region (e.g., ap-south-1 for Mumbai)

3. **Configure bucket settings**
   - Block public access: Enable (files are private)
   - Versioning: Optional (recommended for audit)
   - Encryption: Enable (AES-256 or KMS)
   - Object lock: Disable (not needed)

4. **Create IAM user for Django**
   - Navigate to IAM in AWS Console
   - Create user: `django-s3-uploader`
   - Attach policy: Custom policy for this bucket only
   - Generate access key and secret key

5. **Define IAM policy**
   - Allow: s3:PutObject, s3:GetObject, s3:DeleteObject
   - Resource: arn:aws:s3:::bucket-name/*
   - Restrict to specific bucket only

6. **Configure Django settings**
   - Add storages to INSTALLED_APPS
   - Configure AWS credentials (from environment variables)
   - Set default storage backend

7. **Add S3 settings to settings.py**
   - AWS_ACCESS_KEY_ID from environment
   - AWS_SECRET_ACCESS_KEY from environment
   - AWS_STORAGE_BUCKET_NAME
   - AWS_S3_REGION_NAME
   - AWS_S3_FILE_OVERWRITE = False (preserve versions)
   - AWS_DEFAULT_ACL = 'private' (not public)

8. **Configure storage classes**
   - Define MediaStorage class for user uploads
   - Inherit from S3Boto3Storage
   - Set location = 'media/' (prefix in bucket)
   - Set file_overwrite = False

9. **Add environment-based switching**
   - In development: Use FileSystemStorage
   - In production: Use S3Boto3Storage
   - Use environment variable to toggle

10. **Configure CORS for direct uploads**
    - In S3 bucket settings, add CORS rules
    - Allow POST method from your domain
    - Allow required headers
    - Needed for pre-signed URLs (Task 54)

### S3 Bucket Structure

```
lcc-payment-proofs/
├── media/
│   └── proofs/
│       ├── tenant_abc123/
│       │   ├── ORD-2025-001/
│       │   │   ├── receipt_001.jpg
│       │   │   └── receipt_002.pdf
│       │   └── ORD-2025-002/
│       │       └── bank_slip.jpg
│       └── tenant_xyz789/
│           └── ORD-2025-003/
│               └── payment_proof.png
└── (other directories as needed)
```

### IAM Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::lcc-payment-proofs/*",
                "arn:aws:s3:::lcc-payment-proofs"
            ]
        }
    ]
}
```

### Django Settings Configuration

```python
# settings.py

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'storages',
]

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME', 'lcc-payment-proofs')
AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME', 'ap-south-1')
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = 'private'
AWS_S3_SIGNATURE_VERSION = 's3v4'

# Storage backends
if env('USE_S3', False):
    DEFAULT_FILE_STORAGE = 'apps.payments.storage.MediaStorage'
else:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    MEDIA_URL = '/media/'
```

### Storage Class

```python
# apps/payments/storage.py

from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'
```

### CORS Configuration

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["POST", "PUT"],
        "AllowedOrigins": [
            "https://yourdomain.com",
            "http://localhost:3000"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

### Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| USE_S3 | False | True | Toggle S3 storage |
| AWS_ACCESS_KEY_ID | (empty) | AKIA... | IAM access key |
| AWS_SECRET_ACCESS_KEY | (empty) | secret | IAM secret key |
| AWS_STORAGE_BUCKET_NAME | (empty) | lcc-payment-proofs | Bucket name |
| AWS_S3_REGION_NAME | (empty) | ap-south-1 | AWS region |

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Private ACL | Files not publicly accessible |
| IAM user | Dedicated user with minimal permissions |
| Encryption | Server-side encryption enabled |
| Environment vars | Credentials in .env, not code |
| HTTPS only | Enforce SSL/TLS |
| Bucket policy | Restrict to Django server IPs (optional) |

### Cost Optimization

| Strategy | Implementation | Savings |
|----------|----------------|---------|
| Lifecycle policy | Delete unverified after 30 days | Storage costs |
| Intelligent tiering | Auto-move to IA after 90 days | Up to 70% |
| Compression | Compress images before upload | Storage costs |
| Delete on cancellation | Remove proofs for cancelled orders | Storage costs |

### Expected Outcome
- S3 bucket created with proper security
- IAM user with minimal necessary permissions
- Django configured to use S3 in production
- Local storage for development
- Private file access with signed URLs
- Scalable storage for all tenants

### Verification Checklist
- [ ] S3 bucket created with unique name
- [ ] Bucket has block public access enabled
- [ ] Encryption enabled on bucket
- [ ] IAM user created with custom policy
- [ ] Access key and secret key generated
- [ ] django-storages installed
- [ ] AWS settings configured in settings.py
- [ ] MediaStorage class created
- [ ] Environment-based storage switching implemented
- [ ] CORS rules added for direct uploads
- [ ] Test file upload to S3 successful
- [ ] Files accessible via signed URLs

---

## Task 56: Create Upload API Endpoint

### Overview
Implement RESTful API endpoints for uploading payment proofs. This API allows authenticated customers to upload proof files for their bank transfer transactions, handles multipart form data, validates files through the validation framework, creates PaymentProof records, stores files to S3, and returns upload confirmations. The API supports both direct Django uploads and S3 pre-signed URL workflows.

### Dependencies
- Task 45: Create PaymentProof Model
- Task 49: Create Upload Validation Framework
- Task 54: Create Secure Upload URLs
- Task 55: Create S3 Storage Configuration
- Django REST Framework installed

### Instructions

1. **Create upload views file**
   - Navigate to `backend/apps/payments/api/`
   - Open or create `bank_transfer_views.py`
   - Add proof upload endpoints here

2. **Define upload endpoint**
   - Create `BankTransferProofUploadView` class
   - Inherit from APIView or GenericAPIView
   - Handle POST requests for file uploads

3. **Configure authentication**
   - Require authentication: `IsAuthenticated`
   - Verify customer owns transaction
   - Check transaction allows proof upload (status=pending_verification)

4. **Implement POST method**
   - Extract transaction_id from URL parameters
   - Get BankTransferTransaction object
   - Verify ownership and status
   - Handle multipart/form-data request

5. **Extract upload data**
   - Get 'file' from request.FILES
   - Get optional 'notes' from request.data
   - Validate presence of required fields

6. **Validate file**
   - File validation runs automatically via model validators
   - Catch ValidationError and return 400 response
   - Return clear error messages to client

7. **Create PaymentProof record**
   - Instantiate PaymentProof model
   - Set transaction, file, notes
   - uploaded_at set automatically
   - Save to database (also uploads to S3)

8. **Return success response**
   - Return 201 Created status
   - Include proof ID, upload timestamp, file URL
   - Use ProofSerializer for consistent response

9. **Implement pre-signed URL endpoint**
   - Create `BankTransferProofUploadURLView` endpoint
   - POST: Returns pre-signed URL for direct S3 upload
   - Parameters: filename, content_type
   - Returns: URL, fields, expiration

10. **Add URL patterns**
    - Map endpoints to URLs in urls.py
    - POST /api/payments/transactions/<id>/proofs/ (direct upload)
    - POST /api/payments/transactions/<id>/proofs/upload-url/ (pre-signed)
    - GET /api/payments/transactions/<id>/proofs/ (list proofs)

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/transactions/{id}/proofs/` | Upload proof directly | Customer |
| POST | `/api/payments/transactions/{id}/proofs/upload-url/` | Get pre-signed URL | Customer |
| GET | `/api/payments/transactions/{id}/proofs/` | List proofs | Customer/Admin |
| DELETE | `/api/payments/transactions/{id}/proofs/{proof_id}/` | Delete proof | Customer |

### Direct Upload Flow

```
Customer                    API Endpoint                  Database/S3
    │                            │                             │
    │ POST /proofs/              │                             │
    │ - file: receipt.jpg        │                             │
    │ - notes: "Transfer from..." │                            │
    ├────────────────────────────►                             │
    │                            │                             │
    │                            │ 1. Authenticate             │
    │                            │ 2. Verify transaction       │
    │                            │ 3. Validate file            │
    │                            │                             │
    │                            │ 4. Save PaymentProof        │
    │                            ├─────────────────────────────►
    │                            │                             │
    │                            │ 5. Upload to S3             │
    │                            ├─────────────────────────────►
    │                            │                             │
    │ 201 Created                │                             │
    │ { id, uploaded_at, url }   │                             │
    ◄────────────────────────────┤                             │
```

### Pre-Signed URL Flow

```
Customer                    API Endpoint                  S3
    │                            │                             │
    │ POST /proofs/upload-url/   │                             │
    │ - filename: receipt.jpg    │                             │
    │ - content_type: image/jpeg │                             │
    ├────────────────────────────►                             │
    │                            │                             │
    │                            │ 1. Authenticate             │
    │                            │ 2. Generate signed URL      │
    │                            │                             │
    │ 200 OK                     │                             │
    │ { url, fields, expires }   │                             │
    ◄────────────────────────────┤                             │
    │                            │                             │
    │ POST to S3 URL directly    │                             │
    ├──────────────────────────────────────────────────────────►
    │                            │                             │
    │ 201 Created (from S3)      │                             │
    ◄──────────────────────────────────────────────────────────┤
    │                            │                             │
    │ POST /proofs/ (confirm)    │                             │
    │ - key: proofs/.../file.jpg │                             │
    ├────────────────────────────►                             │
    │                            │                             │
    │                            │ 3. Create PaymentProof      │
    │                            │    (link to S3 object)      │
```

### Request/Response Examples

**Direct Upload Request:**
```http
POST /api/payments/transactions/123/proofs/
Content-Type: multipart/form-data
Authorization: Bearer <customer_token>

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="receipt.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary
Content-Disposition: form-data; name="notes"

Payment from my wife's account
------WebKitFormBoundary--
```

**Direct Upload Response:**
```json
{
    "id": "abc123def456",
    "transaction": 123,
    "uploaded_at": "2025-01-31T15:30:45Z",
    "notes": "Payment from my wife's account",
    "file_url": "/api/payments/proofs/abc123def456/download/",
    "file_name": "receipt.jpg",
    "file_size": 245760,
    "status": "pending_verification"
}
```

**Pre-Signed URL Request:**
```json
POST /api/payments/transactions/123/proofs/upload-url/
{
    "filename": "bank_receipt.jpg",
    "content_type": "image/jpeg"
}
```

**Pre-Signed URL Response:**
```json
{
    "upload_url": "https://bucket.s3.amazonaws.com/",
    "fields": {
        "key": "proofs/tenant_123/ORD-2025-001/bank_receipt.jpg",
        "AWSAccessKeyId": "ASIA...",
        "policy": "eyJleHBp...",
        "signature": "abc123..."
    },
    "expires_in": 900,
    "expires_at": "2025-01-31T15:45:00Z"
}
```

### Permissions & Authorization

| Check | Implementation | Error |
|-------|----------------|-------|
| Authenticated | `IsAuthenticated` permission | 401 Unauthorized |
| Transaction exists | Get or 404 | 404 Not Found |
| Customer owns transaction | `transaction.customer == request.user` | 403 Forbidden |
| Transaction pending | `status == 'pending_verification'` | 400 Bad Request |
| Upload allowed | Check payment method | 400 Bad Request |

### Error Handling

| Error | Status | Message |
|-------|--------|---------|
| File missing | 400 | "No file provided" |
| Invalid file type | 400 | "Only JPG, PNG, PDF allowed" |
| File too large | 400 | "File exceeds 5MB limit" |
| Transaction not found | 404 | "Transaction not found" |
| Not owner | 403 | "You don't own this transaction" |
| Wrong status | 400 | "Transaction not pending verification" |

### Expected Outcome
- RESTful API for proof uploads implemented
- Direct upload and pre-signed URL workflows supported
- Authentication and authorization enforced
- File validation integrated
- Clear error messages returned
- Multipart form data handled correctly

### Verification Checklist
- [ ] BankTransferProofUploadView created
- [ ] POST method handles multipart/form-data
- [ ] Authentication required (IsAuthenticated)
- [ ] Transaction ownership verified
- [ ] File extracted from request.FILES
- [ ] Notes extracted from request.data
- [ ] PaymentProof record created and saved
- [ ] File uploaded to S3 via model save
- [ ] Success response with 201 status
- [ ] Pre-signed URL endpoint implemented
- [ ] URL patterns added to urls.py
- [ ] Serializers created for responses
- [ ] Error handling for all scenarios
- [ ] Tested with Postman/curl

---

## Task 57: Create Multiple Uploads Support

### Overview
Extend the upload system to support multiple payment proofs per transaction. This feature allows customers to upload up to 3 different files (e.g., bank receipt, reference photo, confirmation SMS screenshot) for a single payment, improving verification confidence and handling complex payment scenarios. Implementation includes database support for multiple records, API changes for batch uploads, and frontend UX considerations.

### Dependencies
- Task 45: Create PaymentProof Model (already supports multiple via ForeignKey)
- Task 56: Create Upload API Endpoint

### Instructions

1. **Verify model supports multiple proofs**
   - Confirm PaymentProof has ForeignKey to transaction
   - ForeignKey allows multiple proofs per transaction
   - related_name='proofs' enables transaction.proofs.all()
   - No model changes needed

2. **Define maximum upload limit**
   - Create MAX_PROOFS_PER_TRANSACTION constant = 3
   - Add to settings or validators file
   - Reasonable limit prevents abuse

3. **Create upload count validator**
   - Define `validate_proof_count(transaction)` function
   - Count existing proofs: transaction.proofs.count()
   - Raise ValidationError if >= MAX_PROOFS_PER_TRANSACTION
   - Include count in error message

4. **Update upload view**
   - Before creating new proof, check count
   - Call validate_proof_count(transaction)
   - Return 400 if limit reached
   - Error: "Maximum 3 proofs allowed per transaction"

5. **Support batch upload endpoint**
   - Create optional batch upload endpoint
   - Accept multiple files in single request
   - POST /api/payments/transactions/{id}/proofs/batch/
   - Loop through files, create proof for each

6. **Implement individual upload preservation**
   - Keep existing single-file endpoint
   - Customers can upload one at a time
   - Or upload multiple in batch
   - Both approaches supported

7. **Add proof listing endpoint**
   - GET /api/payments/transactions/{id}/proofs/
   - Returns array of all proofs for transaction
   - Include file URLs, upload times, notes
   - Ordered by uploaded_at descending

8. **Add proof deletion endpoint**
   - DELETE /api/payments/transactions/{id}/proofs/{proof_id}/
   - Allow customers to delete their own proofs
   - Verify ownership before deletion
   - Delete file from S3 as well

9. **Update frontend guidance**
   - Display "Upload up to 3 files" instruction
   - Show count: "2 of 3 files uploaded"
   - Allow adding more until limit reached
   - Disable upload button at limit

10. **Consider verification implications**
    - Admins see all proofs for a transaction
    - Admins verify based on any/all proofs
    - Mark transaction verified if any proof valid
    - Or require all proofs to be valid (configurable)

### Multiple Proofs Data Model

```
BankTransferTransaction #123
    │
    ├─► PaymentProof #1
    │   ├─ file: bank_receipt.jpg
    │   ├─ uploaded_at: 2025-01-31 10:00
    │   └─ notes: "Original transfer receipt"
    │
    ├─► PaymentProof #2
    │   ├─ file: confirmation_sms.png
    │   ├─ uploaded_at: 2025-01-31 10:05
    │   └─ notes: "Bank confirmation SMS"
    │
    └─► PaymentProof #3
        ├─ file: account_statement.pdf
        ├─ uploaded_at: 2025-01-31 10:10
        └─ notes: "Account statement showing debit"
```

### Upload Count Validation

```python
MAX_PROOFS_PER_TRANSACTION = 3

def validate_proof_count(transaction):
    current_count = transaction.proofs.count()
    if current_count >= MAX_PROOFS_PER_TRANSACTION:
        raise ValidationError(
            f"Maximum {MAX_PROOFS_PER_TRANSACTION} proofs allowed. "
            f"This transaction already has {current_count} proofs."
        )
```

### Batch Upload Endpoint

**Request:**
```http
POST /api/payments/transactions/123/proofs/batch/
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="receipt1.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="receipt2.pdf"
Content-Type: application/pdf

<binary data>
------WebKitFormBoundary--
```

**Response:**
```json
{
    "uploaded": 2,
    "proofs": [
        {
            "id": "proof1_id",
            "file_name": "receipt1.jpg",
            "uploaded_at": "2025-01-31T10:00:00Z"
        },
        {
            "id": "proof2_id",
            "file_name": "receipt2.pdf",
            "uploaded_at": "2025-01-31T10:00:01Z"
        }
    ]
}
```

### List Proofs Response

```json
GET /api/payments/transactions/123/proofs/

{
    "count": 3,
    "max_allowed": 3,
    "can_upload_more": false,
    "proofs": [
        {
            "id": "proof3_id",
            "file_name": "account_statement.pdf",
            "file_url": "/api/payments/proofs/proof3_id/download/",
            "file_size": 180000,
            "uploaded_at": "2025-01-31T10:10:00Z",
            "notes": "Account statement showing debit"
        },
        {
            "id": "proof2_id",
            "file_name": "confirmation_sms.png",
            "file_url": "/api/payments/proofs/proof2_id/download/",
            "file_size": 45000,
            "uploaded_at": "2025-01-31T10:05:00Z",
            "notes": "Bank confirmation SMS"
        },
        {
            "id": "proof1_id",
            "file_name": "bank_receipt.jpg",
            "file_url": "/api/payments/proofs/proof1_id/download/",
            "file_size": 250000,
            "uploaded_at": "2025-01-31T10:00:00Z",
            "notes": "Original transfer receipt"
        }
    ]
}
```

### Use Cases for Multiple Proofs

| Scenario | Proofs Uploaded | Value |
|----------|----------------|-------|
| Standard payment | 1 file: Bank receipt | Sufficient |
| Different account | 2 files: Receipt + account holder ID | Verification |
| Large amount | 3 files: Receipt + statement + authorization | Confidence |
| Unclear receipt | 2 files: Receipt + clearer photo | Readability |
| Multiple payments | 2-3 files: Multiple receipts | Complex scenario |

### Frontend UI Mockup

```
┌──────────────────────────────────────────────┐
│  Upload Payment Proof (2 of 3 files)        │
├──────────────────────────────────────────────┤
│                                              │
│  ✓ bank_receipt.jpg (250 KB)                │
│    Uploaded: Jan 31, 10:00 AM                │
│    [Delete]                                  │
│                                              │
│  ✓ confirmation_sms.png (45 KB)             │
│    Uploaded: Jan 31, 10:05 AM                │
│    [Delete]                                  │
│                                              │
│  [+ Add Another File]  (1 more allowed)     │
│                                              │
│  Notes (optional):                           │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [Submit All Proofs]                         │
└──────────────────────────────────────────────┘
```

### API Endpoints Summary

| Method | Endpoint | Description | Max Count |
|--------|----------|-------------|-----------|
| POST | `/proofs/` | Upload single proof | Check before |
| POST | `/proofs/batch/` | Upload multiple proofs | Check before |
| GET | `/proofs/` | List all proofs | N/A |
| DELETE | `/proofs/{id}/` | Delete specific proof | N/A |
| GET | `/proofs/count/` | Get current count | N/A |

### Expected Outcome
- Support for up to 3 proofs per transaction
- Upload count validation prevents exceeding limit
- Batch upload endpoint for convenience
- Individual proof management (list, delete)
- Clear error messages when limit reached
- Frontend displays upload progress

### Verification Checklist
- [ ] MAX_PROOFS_PER_TRANSACTION constant defined (3)
- [ ] validate_proof_count() function created
- [ ] Upload view checks count before creating proof
- [ ] Error message includes current count
- [ ] Batch upload endpoint implemented
- [ ] List proofs endpoint returns all proofs
- [ ] Delete proof endpoint allows removal
- [ ] S3 files deleted when proof deleted
- [ ] API returns count and limit in responses
- [ ] Frontend can display multiple proofs
- [ ] Tested uploading 3 files sequentially
- [ ] Tested that 4th upload is rejected

---

## Task 58: Verify Upload Flow

### Overview
Perform comprehensive end-to-end verification of the complete payment proof upload system. This task validates that all components work together correctly, from customer authentication through file upload, validation, storage, and verification. Testing covers both happy paths and error scenarios, multiple upload workflows, and integration between frontend, API, storage, and database.

### Dependencies
- All previous Group-D tasks (45-57) complete
- Test environment with S3 access (or S3-compatible mock)
- Test customer accounts and transactions

### Instructions

1. **Set up test environment**
   - Create test database with sample tenants
   - Create test transactions in pending_verification status
   - Prepare test files: valid and invalid samples
   - Configure test S3 bucket or localstack

2. **Prepare test files**
   - Valid JPEG: 250 KB, 1024x768, bank receipt photo
   - Valid PNG: 180 KB, 800x600, screenshot
   - Valid PDF: 120 KB, 1 page, bank statement
   - Invalid: .exe file renamed to .jpg
   - Oversized: 7 MB JPEG photo
   - Corrupted: Truncated image file

3. **Test authentication and authorization**
   - Verify unauthenticated request returns 401
   - Verify customer can access their own transactions
   - Verify customer cannot access others' transactions
   - Verify admin can access all transactions

4. **Test single file upload (direct)**
   - Upload valid JPEG via POST /proofs/
   - Verify 201 Created response
   - Verify PaymentProof record created in database
   - Verify file stored in S3 with correct path
   - Verify file accessible via download URL

5. **Test file validation**
   - Upload .exe renamed as .jpg → Expect 400 error
   - Upload 7 MB file → Expect 400 error
   - Upload corrupted image → Expect 400 error
   - Verify error messages are descriptive

6. **Test image compression**
   - Upload 6 MB JPEG (4000x3000)
   - Verify file compressed automatically
   - Verify stored file < 5 MB
   - Verify dimensions reduced to max 2000px
   - Verify image still readable

7. **Test PDF upload**
   - Upload valid PDF bank statement
   - Verify PDF stored correctly
   - Verify PDF accessible via download URL
   - Upload password-protected PDF → Expect 400

8. **Test pre-signed URL workflow**
   - Request upload URL via POST /proofs/upload-url/
   - Verify signed URL returned with expiration
   - Upload file directly to S3 using signed URL
   - Verify upload to S3 succeeds
   - Confirm upload via POST /proofs/ with S3 key
   - Verify PaymentProof record created

9. **Test multiple uploads**
   - Upload first proof → Verify success
   - Upload second proof → Verify success
   - Upload third proof → Verify success
   - Upload fourth proof → Verify 400 error (limit reached)
   - Verify all 3 proofs listed in GET /proofs/

10. **Test proof listing**
    - GET /proofs/ returns all proofs for transaction
    - Verify proofs ordered by uploaded_at descending
    - Verify file URLs included in response
    - Verify customer notes included

11. **Test proof deletion**
    - Delete second proof via DELETE /proofs/{id}/
    - Verify 204 No Content response
    - Verify proof removed from database
    - Verify file deleted from S3
    - Upload new proof → Verify allowed (count now 2)

12. **Test storage organization**
    - Verify files stored in correct tenant directory
    - Verify files stored in correct order directory
    - Verify file paths match expected structure
    - Verify tenant isolation (no cross-tenant access)

13. **Test file download**
    - Request file download via GET /proofs/{id}/download/
    - Verify file content returned or redirect to S3
    - Verify Content-Disposition header for download
    - Verify file name preserved

14. **Test edge cases**
    - Upload with no notes → Verify accepted
    - Upload with 500 char notes → Verify accepted
    - Upload with 501 char notes → Verify rejected
    - Upload to completed transaction → Verify rejected
    - Upload to cancelled transaction → Verify rejected

15. **Document test results**
    - Create test report with all scenarios
    - Document any issues found
    - Verify all acceptance criteria met
    - Sign off on upload feature completion

### Test Scenarios Checklist

| # | Scenario | Expected Result | Status |
|---|----------|-----------------|--------|
| 1 | Upload valid JPEG (250 KB) | 201 Created, file stored | [ ] |
| 2 | Upload valid PNG (180 KB) | 201 Created, file stored | [ ] |
| 3 | Upload valid PDF (120 KB) | 201 Created, file stored | [ ] |
| 4 | Upload .exe as .jpg | 400 Bad Request | [ ] |
| 5 | Upload 7 MB file | 400 Bad Request | [ ] |
| 6 | Upload 6 MB JPEG | Compressed, 201 Created | [ ] |
| 7 | Upload corrupted image | 400 Bad Request | [ ] |
| 8 | Upload password-protected PDF | 400 Bad Request | [ ] |
| 9 | Upload without auth | 401 Unauthorized | [ ] |
| 10 | Upload to others' transaction | 403 Forbidden | [ ] |
| 11 | Upload 3 files sequentially | All succeed | [ ] |
| 12 | Upload 4th file | 400 Bad Request (limit) | [ ] |
| 13 | Delete proof | 204 No Content, file deleted | [ ] |
| 14 | List all proofs | Array of 3 proofs | [ ] |
| 15 | Download proof | File content returned | [ ] |
| 16 | Pre-signed URL workflow | Upload via S3 succeeds | [ ] |
| 17 | Upload with notes | Notes stored correctly | [ ] |
| 18 | Upload with 501 char notes | 400 Bad Request | [ ] |
| 19 | Tenant isolation | Cannot access other tenants | [ ] |
| 20 | File path structure | Correct tenant/order path | [ ] |

### Test Data Preparation

```python
# Test files
test_files = {
    'valid_jpeg': 'bank_receipt.jpg',      # 250 KB, 1024x768
    'valid_png': 'confirmation.png',       # 180 KB, 800x600
    'valid_pdf': 'statement.pdf',          # 120 KB, 1 page
    'large_jpeg': 'highres_photo.jpg',     # 6 MB, 4000x3000
    'oversized': 'huge_file.jpg',          # 7 MB
    'invalid_type': 'malware.exe',         # Executable
    'fake_jpeg': 'malware_as_jpg.jpg',     # .exe renamed
    'corrupted': 'broken_image.jpg',       # Truncated file
    'encrypted_pdf': 'protected.pdf',      # Password protected
}

# Test users
test_users = {
    'customer_a': {
        'tenant': 'tenant_abc123',
        'transactions': ['TXN-001', 'TXN-002']
    },
    'customer_b': {
        'tenant': 'tenant_xyz789',
        'transactions': ['TXN-003']
    },
    'admin': {
        'role': 'admin',
        'access': 'all_tenants'
    }
}
```

### Verification Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Upload Flow Verification              │
└─────────────────────────────────────────────────────────┘
    │
    ├─► 1. Authentication Test
    │       ├─► Unauthenticated → 401 ✓
    │       └─► Authenticated → Continue ✓
    │
    ├─► 2. Authorization Test
    │       ├─► Own transaction → Allow ✓
    │       └─► Others' transaction → 403 ✓
    │
    ├─► 3. File Validation Test
    │       ├─► Valid formats → Accept ✓
    │       ├─► Invalid formats → Reject ✓
    │       ├─► Oversized → Reject ✓
    │       └─► Corrupted → Reject ✓
    │
    ├─► 4. Compression Test
    │       ├─► Large image → Compress ✓
    │       └─► Result < 5MB → Accept ✓
    │
    ├─► 5. Storage Test
    │       ├─► File stored in S3 ✓
    │       ├─► Correct path structure ✓
    │       └─► Tenant isolated ✓
    │
    ├─► 6. Database Test
    │       ├─► PaymentProof record created ✓
    │       ├─► Fields populated ✓
    │       └─► Relationships correct ✓
    │
    ├─► 7. Multiple Upload Test
    │       ├─► 3 uploads → All succeed ✓
    │       └─► 4th upload → Rejected ✓
    │
    ├─► 8. CRUD Operations Test
    │       ├─► List proofs ✓
    │       ├─► Download proof ✓
    │       └─► Delete proof ✓
    │
    └─► 9. End-to-End Test
            ├─► Customer uploads → Admin sees ✓
            ├─► Admin verifies → Status updated ✓
            └─► Complete workflow ✓
```

### Acceptance Criteria

| Criterion | Description | Verified |
|-----------|-------------|----------|
| File types | JPG, PNG, PDF accepted | [ ] |
| Size limit | 5 MB enforced | [ ] |
| Compression | Large images compressed | [ ] |
| Validation | Invalid files rejected | [ ] |
| Security | Auth and authz enforced | [ ] |
| Storage | Files stored in S3 | [ ] |
| Organization | Correct path structure | [ ] |
| Multiple uploads | Up to 3 files supported | [ ] |
| API responses | Correct status codes | [ ] |
| Error messages | Clear and descriptive | [ ] |
| Tenant isolation | No cross-tenant access | [ ] |
| Pre-signed URLs | Direct S3 upload works | [ ] |

### Expected Outcome
- All test scenarios pass successfully
- Upload flow works end-to-end
- Validation catches all error cases
- Storage and database correctly updated
- Multiple uploads supported properly
- Security measures effective
- Performance acceptable

### Verification Checklist
- [ ] Test environment set up with sample data
- [ ] Test files prepared (valid and invalid)
- [ ] Authentication tests pass
- [ ] Authorization tests pass
- [ ] File validation tests pass
- [ ] Image compression tests pass
- [ ] PDF validation tests pass
- [ ] Direct upload workflow verified
- [ ] Pre-signed URL workflow verified
- [ ] Multiple uploads tested (3 files)
- [ ] 4th upload correctly rejected
- [ ] Proof listing tested
- [ ] Proof deletion tested
- [ ] S3 storage verified
- [ ] File path structure correct
- [ ] Tenant isolation verified
- [ ] Download functionality tested
- [ ] Edge cases tested
- [ ] Performance acceptable
- [ ] Test report documented
- [ ] All acceptance criteria met

---

## Summary

This document completed the file storage, upload API, and verification components of the payment proof upload system. The implementation includes file size limits, automatic image compression, secure pre-signed URLs for direct S3 uploads, comprehensive S3 storage configuration, RESTful upload API with authentication, support for multiple proof uploads per transaction, and thorough end-to-end verification.

### Completed Tasks
- Task 52: File size limit (5MB) enforced with clear errors
- Task 53: Automatic image compression for large files
- Task 54: Pre-signed URLs for secure direct S3 uploads
- Task 55: S3 storage configured with proper security
- Task 56: RESTful upload API with authentication
- Task 57: Multiple uploads support (up to 3 files)
- Task 58: Comprehensive verification of entire upload flow

### Key Achievements
- Scalable S3 storage with proper organization
- Efficient direct-to-S3 uploads reduce server load
- Automatic compression handles large photos
- Secure upload URLs with time expiration
- Support for multiple proofs per transaction
- Complete validation preventing malicious uploads
- End-to-end verification confirms system reliability

### System Integration
The proof upload system integrates seamlessly with:
- PaymentProof model and validation framework (Tasks 45-51)
- Django REST Framework for API endpoints
- Amazon S3 for scalable file storage
- Multi-tenant architecture for data isolation
- Bank transfer transaction workflow

### Next Steps
Continue to Group-E (Admin Verification Workflow) to implement the admin interface for reviewing uploaded proofs, approving or rejecting payments, adding verification notes, updating transaction status, and completing the bank transfer payment flow.
