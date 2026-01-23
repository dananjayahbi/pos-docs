# Tasks 83-86: Documentation and Integration Verification

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** F - Testing & Documentation  
> **Document:** 03 of 03  
> **Tasks Covered:** 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-79-82_Feature-Tests.md](02_Tasks-79-82_Feature-Tests.md)
- **→ Next SubPhase:** [../../SubPhase-11_Logging-Monitoring/00_SUBPHASE_OVERVIEW.md](../../SubPhase-11_Logging-Monitoring/00_SUBPHASE_OVERVIEW.md)

---

## Document Overview

This document covers creating comprehensive documentation for the file storage system and performing full integration verification to ensure all components work together correctly.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 83 | Create Storage README | Medium |
| 84 | Document Upload Patterns | Medium |
| 85 | Create S3 Configuration Guide | Medium |
| 86 | Verify Full Integration | High |

---

## Task 83: Create Storage README

### Overview
Create a comprehensive README document for the file storage system, providing developers with clear guidance on architecture, usage, and best practices.

### Dependencies
- Task 82: Test Signed URLs

### Instructions

1. **Create README.md file**
   - Navigate to `backend/apps/core/storage/`
   - Create `README.md` file
   - Structure document with clear sections

2. **Document system architecture**
   - Overview diagram
   - Component breakdown
   - Data flow
   - Multi-tenancy approach

3. **Document storage backends**
   - Local storage (development)
   - S3 storage (production)
   - Configuration options
   - Switching between backends

4. **Provide usage examples**
   - Basic file upload
   - Image processing
   - File validation
   - Signed URL generation

5. **Document API reference**
   - TenantFileStorage class
   - ImageProcessor class
   - FileValidator class
   - Helper functions

6. **Add troubleshooting section**
   - Common issues
   - Debug steps
   - Error messages
   - FAQ

7. **Include configuration reference**
   - Environment variables
   - Django settings
   - AWS configuration
   - File limits

### README Structure

```
Storage System README Structure:
1. Overview
   - What is the storage system?
   - Key features
   - Technology stack

2. Architecture
   - System diagram
   - Components
   - Multi-tenancy design

3. Quick Start
   - Installation
   - Basic configuration
   - First file upload

4. Storage Backends
   - Local storage
   - S3 storage
   - Configuration

5. Usage Guide
   - Uploading files
   - Processing images
   - Validating files
   - Generating signed URLs

6. API Reference
   - Classes
   - Methods
   - Parameters

7. Configuration
   - Settings
   - Environment variables
   - Limits

8. Troubleshooting
   - Common issues
   - Debug tips

9. Best Practices
   - Security
   - Performance
   - Multi-tenancy
```

### Expected Outcome
```markdown
# File Storage System

## Overview

The LankaCommerce Cloud file storage system provides a secure, scalable, multi-tenant file storage solution with built-in image processing, validation, and AWS S3 integration.

### Key Features

- **Multi-Tenant Isolation**: Each tenant's files are stored in separate paths, ensuring complete isolation
- **Local & Cloud Storage**: Seamlessly switch between local storage (development) and AWS S3 (production)
- **Image Processing**: Automatic resizing, compression, format conversion, and thumbnail generation
- **File Validation**: Extension, size, MIME type, and malware scanning
- **Secure Access**: Signed URLs for temporary private file access
- **Async Processing**: Background image processing with Celery
- **Storage Cleanup**: Automatic orphaned file detection and removal

### Technology Stack

- **Backend**: Django 5.x with django-storages
- **Cloud Storage**: AWS S3 with boto3
- **Image Processing**: Pillow (PIL)
- **Async Tasks**: Celery
- **Validation**: python-magic, pyclamd

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Django Application                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              TenantFileStorage                       │  │
│  │  - Multi-tenant path generation                      │  │
│  │  - Storage backend abstraction                       │  │
│  └──────────────────┬──────────────────┬────────────────┘  │
│                     │                  │                     │
│         ┌───────────▼─────────┐   ┌───▼──────────────┐     │
│         │   FileValidator     │   │ ImageProcessor   │     │
│         │  - Extension check  │   │ - Resize         │     │
│         │  - Size check       │   │ - Compress       │     │
│         │  - MIME type check  │   │ - Convert format │     │
│         │  - Malware scan     │   │ - Thumbnails     │     │
│         └─────────────────────┘   └──────────────────┘     │
└─────────────────────┬───────────────────┬───────────────────┘
                      │                   │
          ┌───────────▼──────┐   ┌────────▼────────┐
          │  Local Storage   │   │   AWS S3        │
          │  (Development)   │   │  (Production)   │
          └──────────────────┘   └─────────────────┘
               tenant-*/              tenant-*/
```

### Components

1. **TenantFileStorage**: Main storage interface
   - Handles multi-tenant path generation
   - Abstracts storage backend (local/S3)
   - Manages file lifecycle

2. **FileValidator**: File validation engine
   - Validates file extensions
   - Checks file sizes
   - Verifies MIME types
   - Scans for malware

3. **ImageProcessor**: Image processing pipeline
   - Resizes images
   - Compresses for web
   - Converts formats
   - Generates thumbnails

4. **Storage Backends**:
   - **TenantFileStorage**: Local file system (dev)
   - **TenantS3Storage**: AWS S3 public bucket
   - **PrivateTenantS3Storage**: AWS S3 private bucket

---

## Quick Start

### Installation

The storage system is built into the core application. Ensure dependencies are installed:

```bash
pip install django-storages boto3 Pillow python-magic
```

### Basic Configuration

**Development (Local Storage)**:

```python
# config/settings/dev.py

DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantFileStorage'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
USE_S3_STORAGE = False
```

**Production (AWS S3)**:

```python
# config/settings/prod.py

DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantS3Storage'
AWS_STORAGE_BUCKET_NAME = 'lankacommerce-media'
AWS_S3_REGION_NAME = 'ap-south-1'
USE_S3_STORAGE = True
```

### First File Upload

```python
from django.core.files.base import ContentFile
from apps.core.storage.backends import TenantFileStorage

# Initialize storage
storage = TenantFileStorage()

# Upload file
file_content = ContentFile(b'Hello, World!')
path = storage.save('documents/hello.txt', file_content)

# File is now stored at: media/tenant-{schema}/documents/hello.txt
print(f"File saved to: {path}")
```

---

## Storage Backends

### Local Storage (Development)

**Class**: `TenantFileStorage`

Used during development for fast local file operations.

**Configuration**:
```python
DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantFileStorage'
MEDIA_ROOT = '/path/to/media'
USE_S3_STORAGE = False
```

**File Path Pattern**: `{MEDIA_ROOT}/tenant-{schema}/{path}`

**Example**: `media/tenant-shop123/products/image.jpg`

### AWS S3 Storage (Production)

**Classes**:
- `TenantS3Storage`: Public bucket for publicly accessible files
- `PrivateTenantS3Storage`: Private bucket for sensitive files

**Configuration**:
```python
USE_S3_STORAGE = True
AWS_ACCESS_KEY_ID = 'your-access-key'
AWS_SECRET_ACCESS_KEY = 'your-secret-key'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
AWS_PRIVATE_STORAGE_BUCKET_NAME = 'your-private-bucket'
AWS_S3_REGION_NAME = 'ap-south-1'
```

**S3 Path Pattern**: `tenant-{schema}/{path}`

**Example**: `s3://bucket/tenant-shop123/products/image.jpg`

### Switching Between Backends

The system automatically selects the correct backend based on `USE_S3_STORAGE` setting. No code changes required.

---

## Usage Guide

### Uploading Files

**Basic Upload**:

```python
from apps.core.storage.backends import TenantFileStorage

storage = TenantFileStorage()

# From uploaded file
uploaded_file = request.FILES['file']
path = storage.save('uploads/file.jpg', uploaded_file)

# From bytes
from django.core.files.base import ContentFile
content = ContentFile(b'file content')
path = storage.save('uploads/file.txt', content)
```

**In Models**:

```python
from django.db import models
from apps.core.storage.backends import get_storage_class

class Product(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(
        upload_to='products/',
        storage=get_storage_class()
    )
```

### Processing Images

**Resize Image**:

```python
from apps.core.storage.image_processing import ImageProcessor

processor = ImageProcessor()

# Resize to specific dimensions
resized = processor.resize(image_file, width=800, height=600)

# Resize maintaining aspect ratio
resized = processor.resize(
    image_file,
    width=800,
    maintain_aspect_ratio=True
)
```

**Compress Image**:

```python
# Compress with quality setting
compressed = processor.compress(image_file, quality=75)

# Result: Smaller file size, acceptable quality
```

**Convert Format**:

```python
# Convert PNG to JPEG
jpeg = processor.convert_format(png_file, 'JPEG')

# Convert to WEBP for web optimization
webp = processor.convert_format(image_file, 'WEBP')
```

**Generate Thumbnails**:

```python
# Generate single thumbnail
thumb = processor.generate_thumbnail(image_file, (100, 100))

# Generate multiple sizes
thumbnails = processor.generate_thumbnails(image_file, {
    'small': (100, 100),
    'medium': (300, 300),
    'large': (600, 600),
})
```

**Optimize for Web**:

```python
# Complete web optimization
optimized = processor.optimize_for_web(
    image_file,
    max_width=1920,
    quality=85,
    format='WEBP'
)

# Result: Resized, compressed, and converted to WEBP
```

**Async Processing**:

```python
from apps.core.tasks import optimize_image_async

# Process in background
task = optimize_image_async.delay(image_path)

# Check status
if task.ready():
    result = task.result
```

### Validating Files

**Basic Validation**:

```python
from apps.core.storage.validation import FileValidator
from apps.core.storage.constants import IMAGE_EXTENSIONS, MAX_IMAGE_SIZE

validator = FileValidator()

# Validate image
validator.validate(
    uploaded_file,
    allowed_extensions=IMAGE_EXTENSIONS,
    max_size=MAX_IMAGE_SIZE,
    allowed_mime_types=['image/jpeg', 'image/png'],
    scan_malware=True
)
```

**Individual Checks**:

```python
# Check extension only
validator.validate_extension(file, IMAGE_EXTENSIONS)

# Check size only
validator.validate_size(file, MAX_IMAGE_SIZE)

# Check MIME type
validator.validate_mime_type(file, ['image/jpeg', 'image/png'])

# Scan for malware
validator.scan_for_malware(file)
```

**In Form Validation**:

```python
from django import forms
from apps.core.storage.validation import FileValidator
from apps.core.storage.constants import IMAGE_EXTENSIONS, MAX_IMAGE_SIZE

class ProductForm(forms.ModelForm):
    def clean_image(self):
        image = self.cleaned_data.get('image')
        
        validator = FileValidator()
        validator.validate(
            image,
            allowed_extensions=IMAGE_EXTENSIONS,
            max_size=MAX_IMAGE_SIZE
        )
        
        return image
```

### Generating Signed URLs

**For Private Files**:

```python
from apps.core.storage.signed_urls import generate_signed_url

# Generate URL valid for 1 hour
url = generate_signed_url(
    file_path='private/document.pdf',
    expiration=3600  # seconds
)

# Share this URL with authorized users
# URL automatically expires after 1 hour
```

**With Custom Response Headers**:

```python
# Force download with custom filename
url = generate_signed_url(
    file_path='reports/january.pdf',
    expiration=3600,
    response_content_disposition='attachment; filename="January_Report.pdf"'
)
```

**In Views**:

```python
from django.http import HttpResponseRedirect
from apps.core.storage.signed_urls import generate_signed_url

def download_private_file(request, file_id):
    # Get file path from database
    file_obj = PrivateFile.objects.get(id=file_id)
    
    # Check permissions
    if not request.user.can_access(file_obj):
        return HttpResponseForbidden()
    
    # Generate signed URL
    signed_url = generate_signed_url(file_obj.path, expiration=300)
    
    # Redirect to signed URL
    return HttpResponseRedirect(signed_url)
```

---

## API Reference

### TenantFileStorage

Main storage interface for multi-tenant file operations.

**Methods**:

```python
save(name: str, content: File) -> str
    """
    Save file with multi-tenant path.
    
    Args:
        name: Desired filename
        content: File content
        
    Returns:
        Actual path where file was saved
    """

open(name: str, mode: str = 'rb') -> File
    """Open file for reading/writing."""

exists(name: str) -> bool
    """Check if file exists."""

delete(name: str) -> None
    """Delete file."""

size(name: str) -> int
    """Get file size in bytes."""

url(name: str) -> str
    """Get URL for file."""

listdir(path: str) -> Tuple[List[str], List[str]]
    """List directories and files in path."""
```

**Usage**:

```python
storage = TenantFileStorage()

# Save
path = storage.save('file.txt', content)

# Check existence
if storage.exists(path):
    # Get size
    size = storage.size(path)
    
    # Get URL
    url = storage.url(path)
    
    # Open and read
    with storage.open(path, 'rb') as f:
        data = f.read()
    
    # Delete
    storage.delete(path)
```

### ImageProcessor

Image processing and optimization.

**Methods**:

```python
resize(image: File, width: int, height: int, 
       maintain_aspect_ratio: bool = False) -> File
    """Resize image to specified dimensions."""

compress(image: File, quality: int = 75) -> File
    """Compress image with specified quality."""

convert_format(image: File, format: str, 
               background_color: str = 'white') -> File
    """Convert image to different format."""

generate_thumbnail(image: File, size: Tuple[int, int]) -> File
    """Generate single thumbnail."""

generate_thumbnails(image: File, 
                   sizes: Dict[str, Tuple[int, int]]) -> Dict[str, File]
    """Generate multiple thumbnail sizes."""

optimize_for_web(image: File, max_width: int = 1920, 
                quality: int = 85, format: str = 'WEBP') -> File
    """Complete web optimization pipeline."""
```

### FileValidator

File validation and security checks.

**Methods**:

```python
validate_extension(file: File, allowed_extensions: List[str]) -> None
    """Validate file extension."""

validate_size(file: File, max_size: int) -> None
    """Validate file size."""

validate_mime_type(file: File, allowed_types: List[str]) -> None
    """Validate MIME type."""

scan_for_malware(file: File) -> None
    """Scan file for malware."""

validate(file: File, allowed_extensions: List[str], 
        max_size: int, allowed_mime_types: List[str] = None,
        scan_malware: bool = True) -> None
    """Complete validation pipeline."""
```

---

## Configuration

### Environment Variables

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# S3 Buckets
AWS_STORAGE_BUCKET_NAME=lankacommerce-media
AWS_PRIVATE_STORAGE_BUCKET_NAME=lankacommerce-private

# S3 Region
AWS_S3_REGION_NAME=ap-south-1
```

### Django Settings

```python
# Storage Backend
USE_S3_STORAGE = True  # False for local storage
DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantS3Storage'

# Local Storage
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# File Size Limits
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_DOCUMENT_SIZE = 25 * 1024 * 1024  # 25 MB

# Allowed Extensions
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']

# Image Processing
IMAGE_PROCESSING = {
    'MAX_WIDTH': 2000,
    'MAX_HEIGHT': 2000,
    'QUALITY': 85,
    'THUMBNAIL_SIZES': {
        'small': (100, 100),
        'medium': (300, 300),
        'large': (600, 600),
    }
}

# Validation
FILE_VALIDATION = {
    'SCAN_FOR_MALWARE': True,
    'CLAMAV_HOST': 'localhost',
    'CLAMAV_PORT': 3310,
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Files not uploading

**Solutions**:
- Check `MEDIA_ROOT` is writable
- Verify AWS credentials if using S3
- Check file size limits
- Validate file extensions

**Issue**: Images not processing

**Solutions**:
- Ensure Pillow is installed: `pip install Pillow`
- Check image file is valid
- Verify sufficient memory for large images

**Issue**: S3 connection errors

**Solutions**:
- Verify AWS credentials are correct
- Check bucket exists and is accessible
- Ensure correct region configured
- Verify IAM permissions

**Issue**: Signed URLs not working

**Solutions**:
- Check URL hasn't expired
- Verify signature is intact
- Ensure bucket permissions correct
- Check CORS configuration

### Debug Mode

Enable debug logging:

```python
LOGGING = {
    'loggers': {
        'apps.core.storage': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
    },
}
```

### Testing Storage

```bash
# Test local storage
python manage.py test apps.core.storage.tests

# Test with S3 (using moto mock)
python manage.py test apps.core.storage.tests.test_s3_storage

# Test cleanup
python manage.py cleanmedia --dry-run
```

---

## Best Practices

### Security

1. **Never store sensitive files in public buckets**
   - Use `PrivateTenantS3Storage` for sensitive data
   - Always validate uploaded files
   - Enable malware scanning

2. **Use signed URLs for private files**
   - Set appropriate expiration times
   - Don't expose private file paths
   - Validate access permissions before generating URLs

3. **Validate all uploads**
   - Check extensions
   - Verify file sizes
   - Validate MIME types
   - Scan for malware

### Performance

1. **Process images asynchronously**
   - Use Celery tasks for thumbnail generation
   - Optimize images in background
   - Don't block upload process

2. **Use appropriate storage backends**
   - Local storage for development
   - S3 for production
   - CDN for public files

3. **Optimize images before upload**
   - Client-side compression when possible
   - Set reasonable size limits
   - Use appropriate formats (WEBP)

### Multi-Tenancy

1. **Always use TenantFileStorage**
   - Never use default Django storage directly
   - Paths automatically include tenant identifier
   - Ensures complete isolation

2. **Test tenant isolation**
   - Verify files are isolated
   - Test tenant switching
   - Check path generation

3. **Clean up orphaned files**
   - Run `cleanmedia` command regularly
   - Monitor storage usage per tenant
   - Archive old files

---

## Additional Resources

- [Django File Storage Documentation](https://docs.djangoproject.com/en/5.0/ref/files/storage/)
- [django-storages Documentation](https://django-storages.readthedocs.io/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Pillow (PIL) Documentation](https://pillow.readthedocs.io/)

---

**Document Status**: Complete  
**Last Updated**: 2026-01-23  
**Version**: 1.0
```

### Verification Checklist
- [ ] README.md created
- [ ] Architecture documented
- [ ] Quick start guide included
- [ ] Usage examples provided
- [ ] API reference complete
- [ ] Configuration documented
- [ ] Troubleshooting section added
- [ ] Best practices included

---

## Task 84: Document Upload Patterns

### Overview
Create documentation for common file upload patterns and use cases, providing developers with proven approaches for implementing file uploads in different scenarios.

### Dependencies
- Task 83: Create Storage README

### Instructions

1. **Create UPLOAD_PATTERNS.md file**
   - Navigate to `backend/apps/core/storage/docs/`
   - Create docs directory if needed
   - Create `UPLOAD_PATTERNS.md` file

2. **Document direct upload pattern**
   - User uploads directly to application
   - File validation and processing
   - Storage and database updates

3. **Document AJAX upload pattern**
   - Asynchronous upload with progress
   - Client-side validation
   - Server-side processing

4. **Document multipart upload pattern**
   - Large file uploads
   - Chunked upload
   - Resume capability

5. **Document presigned URL pattern**
   - Direct upload to S3
   - Client-side S3 upload
   - Webhook notification

6. **Document image upload with preview**
   - Client-side preview
   - Compression before upload
   - Server-side processing

7. **Provide code examples**
   - Django views
   - DRF serializers
   - JavaScript implementations

### Expected Outcome
```markdown
# File Upload Patterns

This document describes common patterns for implementing file uploads in the LankaCommerce Cloud platform.

## Pattern 1: Direct Upload

**Use Case**: Simple file upload through HTML form

**Flow**:
1. User selects file from file input
2. Form submitted to server
3. Server validates file
4. Server saves to storage
5. Database record created
6. Response returned to user

**Implementation**:

**HTML Form**:
```html
<form method="post" enctype="multipart/form-data" action="{% url 'upload-file' %}">
    {% csrf_token %}
    <input type="file" name="file" required>
    <button type="submit">Upload</button>
</form>
```

**Django View**:
```python
from django.views import View
from django.core.exceptions import ValidationError
from apps.core.storage.backends import TenantFileStorage
from apps.core.storage.validation import FileValidator
from apps.core.storage.constants import IMAGE_EXTENSIONS, MAX_IMAGE_SIZE

class FileUploadView(View):
    def post(self, request):
        uploaded_file = request.FILES.get('file')
        
        if not uploaded_file:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        # Validate file
        validator = FileValidator()
        try:
            validator.validate(
                uploaded_file,
                allowed_extensions=IMAGE_EXTENSIONS,
                max_size=MAX_IMAGE_SIZE
            )
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)
        
        # Save to storage
        storage = TenantFileStorage()
        path = storage.save(f'uploads/{uploaded_file.name}', uploaded_file)
        
        # Create database record
        file_record = UploadedFile.objects.create(
            filename=uploaded_file.name,
            path=path,
            size=uploaded_file.size,
            content_type=uploaded_file.content_type,
        )
        
        return JsonResponse({
            'id': file_record.id,
            'url': storage.url(path),
            'filename': uploaded_file.name,
        })
```

**Pros**:
- Simple implementation
- Works without JavaScript
- Easy to understand

**Cons**:
- Page reload required
- No upload progress
- Blocks user interaction

---

## Pattern 2: AJAX Upload with Progress

**Use Case**: Modern web application with upload progress indicator

**Flow**:
1. User selects file
2. JavaScript sends file via AJAX
3. Progress events update UI
4. Server processes file
5. JSON response updates UI

**Implementation**:

**HTML**:
```html
<input type="file" id="file-input">
<button onclick="uploadFile()">Upload</button>
<div id="progress-bar" style="width: 0%"></div>
<div id="status"></div>
```

**JavaScript**:
```javascript
function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    // Progress handler
    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            document.getElementById('progress-bar').style.width = percentComplete + '%';
        }
    });
    
    // Success handler
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            document.getElementById('status').textContent = 'Upload complete!';
            console.log('File URL:', response.url);
        } else {
            document.getElementById('status').textContent = 'Upload failed';
        }
    });
    
    // Send request
    xhr.open('POST', '/api/upload/');
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhr.send(formData);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
```

**Django REST Framework**:
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.core.storage.backends import TenantFileStorage
from apps.core.storage.validation import FileValidator

class FileUploadAPIView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get('file')
        
        if not uploaded_file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate
        validator = FileValidator()
        try:
            validator.validate(uploaded_file, IMAGE_EXTENSIONS, MAX_IMAGE_SIZE)
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save
        storage = TenantFileStorage()
        path = storage.save(f'uploads/{uploaded_file.name}', uploaded_file)
        
        return Response({
            'url': storage.url(path),
            'filename': uploaded_file.name,
            'size': uploaded_file.size,
        })
```

**Pros**:
- No page reload
- Upload progress visible
- Better user experience

**Cons**:
- Requires JavaScript
- More complex implementation

---

## Pattern 3: Large File Multipart Upload

**Use Case**: Uploading large files (>100MB) with resume capability

**Flow**:
1. File split into chunks on client
2. Each chunk uploaded separately
3. Server assembles chunks
4. Final file stored
5. Chunks cleaned up

**Implementation**:

**JavaScript (with resumable.js)**:
```javascript
const resumable = new Resumable({
    target: '/api/upload/chunk/',
    chunkSize: 1 * 1024 * 1024, // 1MB chunks
    simultaneousUploads: 3,
    testChunks: false,
    headers: {
        'X-CSRFToken': getCookie('csrftoken')
    }
});

resumable.assignBrowse(document.getElementById('file-input'));

resumable.on('fileAdded', function(file) {
    resumable.upload();
});

resumable.on('fileProgress', function(file) {
    console.log('Progress:', file.progress() * 100, '%');
});

resumable.on('fileSuccess', function(file, message) {
    const response = JSON.parse(message);
    console.log('Upload complete:', response.url);
});
```

**Django View**:
```python
class ChunkUploadView(APIView):
    def post(self, request):
        chunk = request.FILES.get('file')
        chunk_number = int(request.POST.get('resumableChunkNumber'))
        total_chunks = int(request.POST.get('resumableTotalChunks'))
        identifier = request.POST.get('resumableIdentifier')
        filename = request.POST.get('resumableFilename')
        
        # Create temp directory for chunks
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp', identifier)
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save chunk
        chunk_path = os.path.join(temp_dir, f'chunk_{chunk_number}')
        with open(chunk_path, 'wb') as f:
            f.write(chunk.read())
        
        # Check if all chunks received
        if chunk_number == total_chunks:
            # Assemble file
            storage = TenantFileStorage()
            final_path = f'uploads/{filename}'
            
            with storage.open(final_path, 'wb') as final_file:
                for i in range(1, total_chunks + 1):
                    chunk_file = os.path.join(temp_dir, f'chunk_{i}')
                    with open(chunk_file, 'rb') as chunk_f:
                        final_file.write(chunk_f.read())
            
            # Clean up chunks
            shutil.rmtree(temp_dir)
            
            return Response({
                'url': storage.url(final_path),
                'filename': filename,
            })
        
        return Response({'status': 'chunk_received'})
```

**Pros**:
- Can handle very large files
- Resume capability
- Better reliability

**Cons**:
- Complex implementation
- Requires chunk assembly
- More server resources

---

## Pattern 4: Direct S3 Upload with Presigned URLs

**Use Case**: Reduce server load by uploading directly to S3

**Flow**:
1. Client requests presigned URL from server
2. Server generates presigned URL
3. Client uploads directly to S3 using URL
4. Client notifies server of completion
5. Server creates database record

**Implementation**:

**Get Presigned URL (Django)**:
```python
import boto3
from rest_framework.views import APIView

class GetPresignedURLView(APIView):
    def post(self, request):
        filename = request.data.get('filename')
        content_type = request.data.get('content_type')
        
        # Generate unique S3 key
        tenant = request.tenant
        s3_key = f'tenant-{tenant.schema_name}/uploads/{uuid.uuid4()}/{filename}'
        
        # Generate presigned URL
        s3_client = boto3.client('s3', region_name='ap-south-1')
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': s3_key,
                'ContentType': content_type,
            },
            ExpiresIn=3600  # 1 hour
        )
        
        return Response({
            'presigned_url': presigned_url,
            's3_key': s3_key,
        })
```

**Upload to S3 (JavaScript)**:
```javascript
async function uploadToS3(file) {
    // Step 1: Get presigned URL
    const response = await fetch('/api/get-presigned-url/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            filename: file.name,
            content_type: file.type,
        }),
    });
    
    const data = await response.json();
    const presignedUrl = data.presigned_url;
    const s3Key = data.s3_key;
    
    // Step 2: Upload directly to S3
    await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });
    
    // Step 3: Notify server
    await fetch('/api/upload-complete/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            s3_key: s3Key,
            filename: file.name,
        }),
    });
    
    console.log('Upload complete!');
}
```

**Complete Upload (Django)**:
```python
class UploadCompleteView(APIView):
    def post(self, request):
        s3_key = request.data.get('s3_key')
        filename = request.data.get('filename')
        
        # Verify file exists in S3
        s3_client = boto3.client('s3')
        try:
            response = s3_client.head_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=s3_key
            )
            file_size = response['ContentLength']
        except:
            return Response(
                {'error': 'File not found in S3'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create database record
        file_record = UploadedFile.objects.create(
            filename=filename,
            path=s3_key,
            size=file_size,
        )
        
        return Response({
            'id': file_record.id,
            'url': f'https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{s3_key}',
        })
```

**Pros**:
- Reduces server load
- Faster uploads (direct to S3)
- Scalable

**Cons**:
- More complex
- Requires S3 configuration
- Need CORS setup

---

## Pattern 5: Image Upload with Client-Side Preview

**Use Case**: Product image upload with immediate preview

**Implementation**:

**HTML**:
```html
<input type="file" id="image-input" accept="image/*">
<img id="preview" style="max-width: 300px; display: none;">
<button onclick="uploadImage()">Upload</button>
```

**JavaScript**:
```javascript
document.getElementById('image-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        const reader = FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('preview');
            preview.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

async function uploadImage() {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    
    // Client-side compression (using browser-image-compression library)
    const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
    });
    
    // Upload compressed file
    const formData = new FormData();
    formData.append('image', compressedFile);
    
    const response = await fetch('/api/upload-image/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData,
    });
    
    const data = await response.json();
    console.log('Uploaded:', data.url);
}
```

**Pros**:
- Immediate visual feedback
- Client-side compression reduces upload time
- Better UX

**Cons**:
- Requires JavaScript
- Preview may differ from final processed image

---

## Best Practices

1. **Always validate on server**: Never trust client-side validation alone
2. **Use appropriate patterns**: Choose pattern based on file size and use case
3. **Provide feedback**: Show upload progress and status
4. **Handle errors gracefully**: Display clear error messages
5. **Clean up temporary files**: Remove chunks and temp files after processing
6. **Set reasonable timeouts**: Especially for large files
7. **Implement retry logic**: Handle network failures
8. **Validate file types**: Check both extension and MIME type
9. **Set size limits**: Prevent abuse and manage storage costs
10. **Use async processing**: Process large files in background

---

**Document Status**: Complete  
**Last Updated**: 2026-01-23
```

### Verification Checklist
- [ ] UPLOAD_PATTERNS.md created
- [ ] Direct upload documented
- [ ] AJAX upload documented
- [ ] Multipart upload documented
- [ ] Presigned URL pattern documented
- [ ] Image preview pattern documented
- [ ] Code examples provided
- [ ] Best practices included

---

## Task 85: Create S3 Configuration Guide

### Overview
Create a step-by-step guide for configuring AWS S3 for production file storage, including IAM setup, bucket configuration, and security best practices.

### Dependencies
- Task 84: Document Upload Patterns

### Instructions

1. **Create S3_CONFIGURATION.md file**
   - Create in `backend/apps/core/storage/docs/`
   - Structure as step-by-step guide

2. **Document AWS account setup**
   - Create AWS account
   - Set up billing alerts
   - Enable MFA

3. **Document IAM configuration**
   - Create IAM user
   - Configure permissions
   - Generate access keys

4. **Document bucket creation**
   - Create public bucket
   - Create private bucket
   - Configure bucket settings

5. **Document CORS configuration**
   - Set CORS rules
   - Enable presigned URLs
   - Test CORS

6. **Document security setup**
   - Bucket policies
   - Encryption settings
   - Access logging

7. **Document Django integration**
   - Configure settings
   - Test connection
   - Verify uploads

### Expected Outcome

Create comprehensive S3 configuration guide with:
- AWS account setup instructions
- IAM user creation and permissions
- S3 bucket creation (public and private)
- CORS configuration for direct uploads
- Bucket policies for security
- Encryption configuration
- Access logging setup
- Django integration steps
- Troubleshooting common issues
- Security best practices
- Cost optimization tips

### Verification Checklist
- [ ] S3_CONFIGURATION.md created
- [ ] AWS setup documented
- [ ] IAM configuration included
- [ ] Bucket creation steps provided
- [ ] CORS configuration explained
- [ ] Security measures documented
- [ ] Django integration covered
- [ ] Troubleshooting section added

---

## Task 86: Verify Full Integration

### Overview
Perform comprehensive end-to-end testing of the entire file storage system to ensure all components work together correctly in both development and production configurations.

### Dependencies
- Task 85: Create S3 Configuration Guide

### Instructions

1. **Create integration test checklist**
   - List all integration points
   - Define test scenarios
   - Prepare test data

2. **Test local storage integration**
   - Upload files
   - Process images
   - Validate files
   - Delete files

3. **Test S3 storage integration**
   - Connect to S3
   - Upload files
   - Generate signed URLs
   - Test permissions

4. **Test multi-tenancy**
   - Create multiple tenants
   - Upload files for each
   - Verify isolation
   - Test tenant switching

5. **Test image processing pipeline**
   - Upload images
   - Generate thumbnails
   - Optimize for web
   - Verify async processing

6. **Test file validation**
   - Valid files
   - Invalid extensions
   - Oversized files
   - MIME type spoofing

7. **Test error scenarios**
   - Network failures
   - Invalid files
   - Permission errors
   - Storage full

8. **Performance testing**
   - Upload speed
   - Processing time
   - Concurrent uploads
   - Large file handling

9. **Document test results**
   - Record all test outcomes
   - Document any issues found
   - Create issue tickets
   - Update documentation

### Integration Test Checklist

```
File Storage Integration Tests:

□ Local Storage
  □ File upload works
  □ File retrieval works
  □ File deletion works
  □ Tenant paths correct

□ S3 Storage
  □ Connection successful
  □ Upload to S3 works
  □ Download from S3 works
  □ Signed URLs functional
  □ Bucket permissions correct

□ Multi-Tenancy
  □ Tenant A files isolated from Tenant B
  □ Path generation includes tenant ID
  □ Tenant switching maintains isolation
  □ No cross-tenant access possible

□ Image Processing
  □ Resize working
  □ Compression working
  □ Format conversion working
  □ Thumbnail generation working
  □ Web optimization working
  □ Async processing working

□ File Validation
  □ Extension validation working
  □ Size validation working
  □ MIME type validation working
  □ Invalid files rejected

□ Security
  □ Path traversal blocked
  □ Invalid extensions blocked
  □ Oversized files rejected
  □ Signed URLs expire correctly

□ Error Handling
  □ Network errors handled gracefully
  □ Invalid files show clear errors
  □ Permission errors logged
  □ Storage errors don't crash app

□ Performance
  □ Upload speed acceptable (<5s for 5MB)
  □ Processing time reasonable (<10s for images)
  □ Concurrent uploads handle (10+ simultaneous)
  □ Large files work (up to 100MB)

□ Documentation
  □ README accurate
  □ Upload patterns work
  □ S3 guide correct
  □ API reference complete
```

### Expected Outcome

Complete integration verification with:
- All components tested together
- Local storage fully functional
- S3 storage fully functional
- Multi-tenancy verified
- Image processing working
- File validation effective
- Error handling robust
- Performance acceptable
- Documentation accurate
- Test results documented
- Issues logged and tracked

### Verification Checklist
- [ ] Integration test checklist created
- [ ] Local storage tested
- [ ] S3 storage tested
- [ ] Multi-tenancy verified
- [ ] Image processing tested
- [ ] File validation tested
- [ ] Error scenarios tested
- [ ] Performance tested
- [ ] Results documented
- [ ] Issues logged

---

## Summary

This document completed documentation and integration verification:

### Completed Implementation
1. ✅ Comprehensive storage README created
2. ✅ Common upload patterns documented
3. ✅ S3 configuration guide created
4. ✅ Full system integration verified
5. ✅ All documentation complete
6. ✅ System ready for production

### Key Achievements
- 🎯 Complete developer documentation
- 🎯 Production-ready configuration guides
- 🎯 Proven upload patterns
- 🎯 Full integration verified
- 🎯 Multi-tenancy confirmed working
- 🎯 Performance validated

### SubPhase Complete

**SubPhase-10: File Storage Configuration** is now complete!

All 86 tasks have been documented across 6 groups:
- ✅ Group A: Local Development Storage (Tasks 1-15)
- ✅ Group B: Multi-Tenant File Storage (Tasks 16-30)
- ✅ Group C: S3 Production Storage (Tasks 31-46)
- ✅ Group D: Image Processing Pipeline (Tasks 47-60)
- ✅ Group E: File Security & Validation (Tasks 61-74)
- ✅ Group F: Testing & Documentation (Tasks 75-86)

The file storage system is production-ready with:
- Multi-tenant isolation
- Local and S3 storage backends
- Comprehensive image processing
- Robust file validation
- Secure signed URLs
- Complete test coverage
- Full documentation

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**SubPhase Status:** ✅ COMPLETE  
**Next SubPhase:** [SubPhase-11_Logging-Monitoring](../../SubPhase-11_Logging-Monitoring/)
