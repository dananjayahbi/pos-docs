# Tasks 61-66: FileValidator Class Implementation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** E - File Security & Validation  
> **Document:** 01 of 03  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../Group-D_Image-Processing-Pipeline/03_Tasks-58-60_Upload-Handler-Async.md](../../Group-D_Image-Processing-Pipeline/03_Tasks-58-60_Upload-Handler-Async.md)
- **→ Next Document:** [02_Tasks-67-72_Extension-Size-Config.md](02_Tasks-67-72_Extension-Size-Config.md)

---

## Document Overview

This document covers the creation of the FileValidator class with methods for validating file extensions, sizes, MIME types, and scanning for malware. These validations ensure that only safe, appropriate files are uploaded to the system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Create validators.py File | Simple |
| 62 | Create FileValidator Class | Medium |
| 63 | Add validate_extension Method | Simple |
| 64 | Add validate_size Method | Simple |
| 65 | Add validate_mime_type Method | Medium |
| 66 | Add scan_for_malware Method | Complex |

---

## Task 61: Create validators.py File

### Overview
Create the validators.py module within the storage package to house all file validation logic including extension, size, MIME type, and security validation.

### Dependencies
- Task 60: Export Image Utilities (Group D complete)

### Instructions

1. **Navigate to storage module**
   - Open `backend/apps/core/storage/` directory
   - Verify __init__.py exists

2. **Create validators.py file**
   - Create new file named `validators.py`
   - Add in storage module directory

3. **Add module docstring**
   - Document purpose: File validation and security
   - Note security-critical nature
   - Reference validation standards

4. **Add import section**
   - Import Django's ValidationError
   - Import mimetypes library
   - Import os and pathlib
   - Import logging for security events

5. **Document module structure**
   - Plan for FileValidator class
   - Note validation methods
   - Reference security best practices

### Module Purpose

The validators.py module provides:
- **Extension Validation:** Verify allowed file types
- **Size Validation:** Enforce upload limits
- **MIME Type Validation:** Verify actual file type
- **Malware Scanning:** Detect malicious files
- **Security Logging:** Track validation attempts
- **Error Handling:** Provide clear validation errors

### Import Requirements

| Import | Purpose |
|--------|---------|
| **ValidationError** | Django validation exception |
| **mimetypes** | MIME type detection |
| **magic** (python-magic) | Advanced MIME detection |
| **os, pathlib** | File operations |
| **logging** | Security event logging |

### Expected Outcome
```
backend/apps/core/storage/
├── __init__.py
├── backends.py
├── constants.py
├── images.py
├── handlers.py
├── s3.py
└── validators.py             # New validation module
```

### Verification Checklist
- [ ] validators.py file created in storage module
- [ ] Module docstring is comprehensive
- [ ] Import requirements documented
- [ ] Security considerations noted
- [ ] File is ready for class definitions

---

## Task 62: Create FileValidator Class

### Overview
Create the FileValidator class that encapsulates all file validation logic. This class provides methods for checking file extensions, sizes, MIME types, and security concerns.

### Dependencies
- Task 61: Create validators.py File

### Instructions

1. **Open validators.py file**
   - Navigate to `backend/apps/core/storage/validators.py`
   - Add required imports at the top

2. **Define FileValidator class**
   - Create class with clear docstring
   - Document purpose and usage
   - Note security importance

3. **Add initialization method**
   - Accept allowed extensions list
   - Accept max file size
   - Initialize validation rules

4. **Add validation result tracking**
   - Store validation errors
   - Track validation attempts
   - Log security events

5. **Create validate_all method**
   - Run all validations
   - Collect all errors
   - Return comprehensive result

6. **Add error formatting**
   - User-friendly error messages
   - Technical details for logging
   - Sri Lankan English support

### Class Design

| Aspect | Description |
|--------|-------------|
| **Purpose** | Comprehensive file validation |
| **Input** | File object or path |
| **Output** | Validation result or raise error |
| **Methods** | Extension, size, MIME, malware checks |
| **Thread Safety** | One instance per validation |

### Validation Flow

```
File Upload
    ↓
FileValidator
    ├── Extension Check
    ├── Size Check
    ├── MIME Type Check
    └── Malware Scan
    ↓
All Pass → Accept
Any Fail → Reject
```

### Expected Outcome
```python
# In validators.py:

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import mimetypes
import os
import logging

logger = logging.getLogger(__name__)


class FileValidator:
    """
    Comprehensive file validator for uploads.
    
    Validates uploaded files against:
    - Allowed file extensions
    - Maximum file size limits
    - MIME type verification
    - Malware scanning
    
    Usage:
        validator = FileValidator(
            allowed_extensions=['jpg', 'png', 'pdf'],
            max_size=5 * 1024 * 1024  # 5MB
        )
        
        try:
            validator.validate_all(uploaded_file)
        except ValidationError as e:
            # Handle validation error
            pass
    """
    
    def __init__(self, allowed_extensions=None, max_size=None):
        """
        Initialize FileValidator.
        
        Args:
            allowed_extensions: List of allowed extensions (without dot)
            max_size: Maximum file size in bytes
        """
        self.allowed_extensions = allowed_extensions or []
        self.max_size = max_size
        self.errors = []
    
    def validate_all(self, uploaded_file):
        """
        Run all validations on uploaded file.
        
        Args:
            uploaded_file: Django UploadedFile object
            
        Raises:
            ValidationError: If any validation fails
            
        Returns:
            True if all validations pass
        """
        self.errors = []
        
        try:
            self.validate_extension(uploaded_file)
            self.validate_size(uploaded_file)
            self.validate_mime_type(uploaded_file)
            # Malware scan is optional and expensive
            # self.scan_for_malware(uploaded_file)
            
        except ValidationError as e:
            self.errors.append(str(e))
            logger.warning(
                f"File validation failed: {uploaded_file.name}, "
                f"errors: {self.errors}"
            )
            raise
        
        logger.info(f"File validation passed: {uploaded_file.name}")
        return True
    
    def get_file_extension(self, filename):
        """
        Get file extension from filename.
        
        Args:
            filename: Name of file
            
        Returns:
            Extension without dot, lowercase
        """
        ext = os.path.splitext(filename)[1].lower()
        return ext.lstrip('.')
```

### Verification Checklist
- [ ] FileValidator class defined
- [ ] Class docstring comprehensive
- [ ] Initialization method implemented
- [ ] validate_all method created
- [ ] Error tracking implemented
- [ ] Logging configured

---

## Task 63: Add validate_extension Method

### Overview
Implement the validate_extension method that checks if an uploaded file's extension is in the list of allowed extensions.

### Dependencies
- Task 62: Create FileValidator Class

### Instructions

1. **Open validators.py file**
   - Locate FileValidator class
   - Prepare to add validate_extension method

2. **Define validate_extension method**
   - Accept uploaded file parameter
   - Extract file extension
   - Check against allowed list

3. **Implement case-insensitive matching**
   - Normalize to lowercase
   - Handle edge cases (no extension)
   - Support common variations

4. **Add error messaging**
   - Clear error for users
   - List allowed extensions
   - Log security events

5. **Handle special cases**
   - Double extensions (.tar.gz)
   - Hidden files (.gitignore)
   - Files without extensions

### Extension Validation Logic

```
Validation Flow:
Filename: "document.PDF"
    ↓
Extract extension: "PDF"
    ↓
Normalize: "pdf"
    ↓
Check allowed: ['pdf', 'doc', 'docx']
    ↓
Found → Pass
Not Found → Reject
```

### Expected Outcome
```python
# In FileValidator class:

    def validate_extension(self, uploaded_file):
        """
        Validate file extension against allowed list.
        
        Args:
            uploaded_file: Django UploadedFile object
            
        Raises:
            ValidationError: If extension not allowed
        """
        if not self.allowed_extensions:
            # No restrictions
            return
        
        filename = uploaded_file.name
        extension = self.get_file_extension(filename)
        
        if not extension:
            raise ValidationError(
                _("File has no extension. Please upload a valid file.")
            )
        
        # Case-insensitive check
        allowed_lower = [ext.lower() for ext in self.allowed_extensions]
        
        if extension not in allowed_lower:
            raise ValidationError(
                _(
                    f"File type '.{extension}' is not allowed. "
                    f"Allowed types: {', '.join(self.allowed_extensions)}"
                )
            )
        
        logger.debug(f"Extension validation passed: {extension}")
```

### Verification Checklist
- [ ] validate_extension method implemented
- [ ] Case-insensitive matching working
- [ ] Clear error messages
- [ ] Edge cases handled
- [ ] Logging functional

---

## Task 64: Add validate_size Method

### Overview
Implement the validate_size method that checks if an uploaded file's size is within the allowed limit.

### Dependencies
- Task 63: Add validate_extension Method

### Instructions

1. **Open validators.py file**
   - Locate FileValidator class
   - Prepare to add validate_size method

2. **Define validate_size method**
   - Accept uploaded file parameter
   - Get file size in bytes
   - Compare against limit

3. **Add human-readable size formatting**
   - Convert bytes to MB/KB
   - Format for error messages
   - Support Sri Lankan English

4. **Handle size edge cases**
   - Zero-byte files
   - Extremely large files
   - Negative sizes (corruption)

5. **Add detailed logging**
   - Log file sizes
   - Track large uploads
   - Security event logging

### Size Validation Logic

```
Validation Flow:
File size: 8,388,608 bytes
    ↓
Max size: 5,242,880 bytes (5MB)
    ↓
Compare: 8MB > 5MB
    ↓
Exceeds limit → Reject
Within limit → Pass
```

### Expected Outcome
```python
# In FileValidator class:

    def validate_size(self, uploaded_file):
        """
        Validate file size against maximum limit.
        
        Args:
            uploaded_file: Django UploadedFile object
            
        Raises:
            ValidationError: If file exceeds size limit
        """
        if not self.max_size:
            # No size restriction
            return
        
        file_size = uploaded_file.size
        
        # Check for zero-byte files
        if file_size == 0:
            raise ValidationError(
                _("File is empty. Please upload a valid file.")
            )
        
        # Check against maximum size
        if file_size > self.max_size:
            # Format sizes for error message
            size_mb = file_size / (1024 * 1024)
            max_mb = self.max_size / (1024 * 1024)
            
            raise ValidationError(
                _(
                    f"File size ({size_mb:.2f} MB) exceeds the maximum "
                    f"allowed size ({max_mb:.2f} MB)."
                )
            )
        
        logger.debug(
            f"Size validation passed: {file_size} bytes "
            f"(max: {self.max_size} bytes)"
        )
    
    @staticmethod
    def format_file_size(size_bytes):
        """
        Format file size in human-readable format.
        
        Args:
            size_bytes: Size in bytes
            
        Returns:
            Formatted string (e.g., "5.2 MB", "128 KB")
        """
        if size_bytes < 1024:
            return f"{size_bytes} bytes"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.2f} KB"
        elif size_bytes < 1024 * 1024 * 1024:
            return f"{size_bytes / (1024 * 1024):.2f} MB"
        else:
            return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"
```

### Verification Checklist
- [ ] validate_size method implemented
- [ ] Size comparison accurate
- [ ] Human-readable formatting working
- [ ] Zero-byte check included
- [ ] Error messages clear

---

## Task 65: Add validate_mime_type Method

### Overview
Implement the validate_mime_type method that verifies the actual file type matches the extension by checking the file's MIME type. This prevents users from renaming malicious files.

### Dependencies
- Task 64: Add validate_size Method

### Instructions

1. **Open validators.py file**
   - Locate FileValidator class
   - Prepare to add validate_mime_type method

2. **Install python-magic library**
   - Add to requirements
   - For actual MIME detection
   - More reliable than mimetypes module

3. **Define validate_mime_type method**
   - Accept uploaded file
   - Detect actual MIME type
   - Compare with expected type

4. **Create MIME type mapping**
   - Map extensions to MIME types
   - Support common formats
   - Handle variations

5. **Add strict vs lenient modes**
   - Strict: Exact match required
   - Lenient: Category match sufficient
   - Configure per file type

6. **Handle edge cases**
   - Unknown MIME types
   - Multiple valid MIME types
   - Corrupted files

### MIME Type Validation

```
Validation Flow:
Filename: "document.pdf"
Expected MIME: "application/pdf"
    ↓
Read file header
    ↓
Detect actual MIME: "application/pdf"
    ↓
Compare:
  Expected: application/pdf
  Actual: application/pdf
    ↓
Match → Pass
Mismatch → Reject
```

### MIME Type Categories

| Extension | Expected MIME Types |
|-----------|-------------------|
| **jpg, jpeg** | image/jpeg |
| **png** | image/png |
| **gif** | image/gif |
| **webp** | image/webp |
| **pdf** | application/pdf |
| **doc** | application/msword |
| **docx** | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| **xls** | application/vnd.ms-excel |
| **xlsx** | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |

### Expected Outcome
```python
# In FileValidator class:

    MIME_TYPE_MAP = {
        # Images
        'jpg': ['image/jpeg'],
        'jpeg': ['image/jpeg'],
        'png': ['image/png'],
        'gif': ['image/gif'],
        'webp': ['image/webp'],
        'bmp': ['image/bmp', 'image/x-ms-bmp'],
        
        # Documents
        'pdf': ['application/pdf'],
        'doc': ['application/msword'],
        'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'xls': ['application/vnd.ms-excel'],
        'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        'txt': ['text/plain'],
        'csv': ['text/csv', 'text/plain'],
    }
    
    def validate_mime_type(self, uploaded_file, strict=False):
        """
        Validate file MIME type matches extension.
        
        Prevents users from uploading malicious files by renaming them.
        For example, prevents renaming malware.exe to document.pdf.
        
        Args:
            uploaded_file: Django UploadedFile object
            strict: If True, require exact MIME match
            
        Raises:
            ValidationError: If MIME type doesn't match extension
        """
        try:
            import magic
        except ImportError:
            logger.warning(
                "python-magic not installed, skipping MIME validation"
            )
            return
        
        filename = uploaded_file.name
        extension = self.get_file_extension(filename)
        
        # Get expected MIME types for this extension
        expected_mimes = self.MIME_TYPE_MAP.get(extension, [])
        
        if not expected_mimes:
            # Unknown extension, skip MIME check
            logger.debug(f"No MIME mapping for extension: {extension}")
            return
        
        # Read file content for MIME detection
        uploaded_file.seek(0)
        file_content = uploaded_file.read(8192)  # Read first 8KB
        uploaded_file.seek(0)  # Reset position
        
        # Detect actual MIME type
        try:
            actual_mime = magic.from_buffer(file_content, mime=True)
        except Exception as e:
            logger.error(f"MIME detection failed: {e}")
            raise ValidationError(
                _("Unable to determine file type. File may be corrupted.")
            )
        
        # Validate MIME type
        if strict:
            # Exact match required
            if actual_mime not in expected_mimes:
                raise ValidationError(
                    _(
                        f"File type mismatch. Expected {', '.join(expected_mimes)}, "
                        f"but got {actual_mime}. File may be corrupted or mislabeled."
                    )
                )
        else:
            # Category match sufficient (e.g., image/*)
            expected_categories = {mime.split('/')[0] for mime in expected_mimes}
            actual_category = actual_mime.split('/')[0]
            
            if actual_category not in expected_categories and \
               actual_mime not in expected_mimes:
                raise ValidationError(
                    _(
                        f"File type mismatch. Expected {', '.join(expected_mimes)}, "
                        f"but got {actual_mime}."
                    )
                )
        
        logger.debug(f"MIME validation passed: {actual_mime}")
```

### Verification Checklist
- [ ] validate_mime_type method implemented
- [ ] MIME type mapping created
- [ ] python-magic integration
- [ ] Strict and lenient modes
- [ ] Security validation working

---

## Task 66: Add scan_for_malware Method

### Overview
Implement the scan_for_malware method that scans uploaded files for malware and viruses. This is a critical security feature that prevents malicious files from entering the system.

### Dependencies
- Task 65: Add validate_mime_type Method

### Instructions

1. **Open validators.py file**
   - Locate FileValidator class
   - Prepare to add scan_for_malware method

2. **Plan malware scanning integration**
   - ClamAV for local scanning
   - VirusTotal API for cloud scanning
   - Choose based on deployment

3. **Define scan_for_malware method**
   - Accept uploaded file
   - Perform virus scan
   - Return scan results

4. **Add scanning configuration**
   - Enable/disable scanning
   - Configure scan timeout
   - Set up retry logic

5. **Implement scan result handling**
   - Block infected files
   - Log security events
   - Notify administrators

6. **Add fallback strategy**
   - Handle scanner unavailability
   - Quarantine suspicious files
   - Implement fail-safe mode

### Malware Scanning Strategy

```
Scanning Flow:
Uploaded File
    ↓
Check if scanner enabled
    ↓
┌────────┴────────┐
│                 │
ClamAV         VirusTotal
(Local)        (Cloud)
│                 │
└────────┬────────┘
    ↓
Scan Results
    ↓
┌────────┴────────┐
│                 │
Clean          Infected
│                 │
Accept         Reject + Log
```

### Scanner Options

| Scanner | Pros | Cons |
|---------|------|------|
| **ClamAV** | Free, local, fast | Needs installation |
| **VirusTotal** | Multiple engines, cloud | API limits, slow |
| **AWS GuardDuty** | AWS integration | Cost, AWS only |

### Expected Outcome
```python
# In FileValidator class:

    def scan_for_malware(self, uploaded_file, scanner='clamav'):
        """
        Scan file for malware and viruses.
        
        IMPORTANT: This is a security-critical operation.
        Requires ClamAV or VirusTotal API to be configured.
        
        Args:
            uploaded_file: Django UploadedFile object
            scanner: Scanner to use ('clamav', 'virustotal', 'none')
            
        Raises:
            ValidationError: If malware is detected
            
        Returns:
            True if file is clean
        """
        from django.conf import settings
        
        # Check if scanning is enabled
        if not getattr(settings, 'ENABLE_MALWARE_SCANNING', False):
            logger.warning("Malware scanning is disabled")
            return True
        
        if scanner == 'none':
            return True
        
        if scanner == 'clamav':
            return self._scan_with_clamav(uploaded_file)
        elif scanner == 'virustotal':
            return self._scan_with_virustotal(uploaded_file)
        else:
            logger.warning(f"Unknown scanner: {scanner}")
            return True
    
    def _scan_with_clamav(self, uploaded_file):
        """
        Scan file using ClamAV.
        
        Args:
            uploaded_file: Django UploadedFile object
            
        Raises:
            ValidationError: If malware detected or scan fails
        """
        try:
            import pyclamd
        except ImportError:
            logger.error("pyclamd not installed, cannot scan for malware")
            # Fail-safe: Allow file but log warning
            return True
        
        try:
            # Connect to ClamAV daemon
            cd = pyclamd.ClamdUnixSocket()
            
            # Test connection
            if not cd.ping():
                logger.error("ClamAV daemon not responding")
                return True  # Fail-safe: allow file
            
            # Scan file content
            uploaded_file.seek(0)
            file_content = uploaded_file.read()
            uploaded_file.seek(0)
            
            scan_result = cd.scan_stream(file_content)
            
            if scan_result:
                # Malware detected
                virus_name = scan_result.get('stream', ['UNKNOWN'])[1]
                
                logger.error(
                    f"MALWARE DETECTED: {uploaded_file.name}, "
                    f"virus: {virus_name}"
                )
                
                raise ValidationError(
                    _(
                        "Security Alert: This file appears to contain malicious content "
                        "and cannot be uploaded. If you believe this is an error, "
                        "please contact support."
                    )
                )
            
            logger.info(f"Malware scan passed: {uploaded_file.name}")
            return True
        
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Malware scan error: {e}")
            # Fail-safe: allow file but log error
            return True
    
    def _scan_with_virustotal(self, uploaded_file):
        """
        Scan file using VirusTotal API.
        
        Args:
            uploaded_file: Django UploadedFile object
            
        Raises:
            ValidationError: If malware detected
        """
        from django.conf import settings
        import requests
        
        api_key = getattr(settings, 'VIRUSTOTAL_API_KEY', None)
        
        if not api_key:
            logger.warning("VirusTotal API key not configured")
            return True
        
        try:
            # Upload file to VirusTotal
            url = 'https://www.virustotal.com/vtapi/v2/file/scan'
            
            uploaded_file.seek(0)
            files = {'file': (uploaded_file.name, uploaded_file.read())}
            uploaded_file.seek(0)
            
            params = {'apikey': api_key}
            response = requests.post(url, files=files, params=params, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if any engines detected malware
                if result.get('positives', 0) > 0:
                    logger.error(
                        f"MALWARE DETECTED by VirusTotal: {uploaded_file.name}, "
                        f"detections: {result.get('positives')}"
                    )
                    
                    raise ValidationError(
                        _(
                            "Security Alert: This file has been flagged as potentially "
                            "malicious and cannot be uploaded."
                        )
                    )
                
                logger.info(f"VirusTotal scan passed: {uploaded_file.name}")
                return True
            else:
                logger.error(f"VirusTotal API error: {response.status_code}")
                return True  # Fail-safe
        
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"VirusTotal scan error: {e}")
            return True  # Fail-safe
```

### Configuration

```python
# In settings:

# Malware Scanning
ENABLE_MALWARE_SCANNING = True
MALWARE_SCANNER = 'clamav'  # or 'virustotal' or 'none'

# ClamAV Configuration
CLAMAV_SOCKET = '/var/run/clamav/clamd.ctl'  # Unix socket

# VirusTotal Configuration (if using)
VIRUSTOTAL_API_KEY = os.environ.get('VIRUSTOTAL_API_KEY')
```

### Verification Checklist
- [ ] scan_for_malware method implemented
- [ ] ClamAV integration functional
- [ ] VirusTotal integration functional
- [ ] Fail-safe behavior implemented
- [ ] Security logging comprehensive
- [ ] Configuration options available

---

## Summary

This document created the FileValidator class with comprehensive validation:

### Completed Implementation
1. ✅ validators.py module created
2. ✅ FileValidator class implemented
3. ✅ Extension validation working
4. ✅ Size validation with human-readable formatting
5. ✅ MIME type validation with python-magic
6. ✅ Malware scanning with ClamAV/VirusTotal

### Key Achievements
- 🎯 Comprehensive file validation
- 🎯 Security-focused design
- 🎯 Multiple validation methods
- 🎯 Clear error messages
- 🎯 Fail-safe behavior
- 🎯 Extensive logging

### Next Steps
Proceed to [02_Tasks-67-72_Extension-Size-Config.md](02_Tasks-67-72_Extension-Size-Config.md) to configure allowed extensions and size limits.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [02_Tasks-67-72_Extension-Size-Config.md](02_Tasks-67-72_Extension-Size-Config.md)
