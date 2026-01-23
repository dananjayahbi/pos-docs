# Tasks 67-72: Extension and Size Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** E - File Security & Validation  
> **Document:** 02 of 03  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-61-66_FileValidator-Class.md](01_Tasks-61-66_FileValidator-Class.md)
- **→ Next Document:** [03_Tasks-73-74_Cleanup-Command.md](03_Tasks-73-74_Cleanup-Command.md)

---

## Document Overview

This document covers the configuration of allowed file extensions and maximum file sizes. These settings define what types of files can be uploaded and how large they can be, providing essential security boundaries.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create Allowed Extensions Config | Simple |
| 68 | Define IMAGE_EXTENSIONS | Simple |
| 69 | Define DOCUMENT_EXTENSIONS | Simple |
| 70 | Create Max Size Config | Simple |
| 71 | Define MAX_IMAGE_SIZE | Simple |
| 72 | Define MAX_DOCUMENT_SIZE | Simple |

---

## Task 67: Create Allowed Extensions Config

### Overview
Create a configuration section in constants.py for allowed file extensions. This centralizes extension management and makes it easy to update allowed file types across the application.

### Dependencies
- Task 66: Add scan_for_malware Method

### Instructions

1. **Open constants.py file**
   - Navigate to `backend/apps/core/storage/constants.py`
   - Create allowed extensions section

2. **Add section header comment**
   - Document purpose of configuration
   - Note security implications
   - Reference validation usage

3. **Create extension lists structure**
   - Separate lists by file type
   - Use clear naming conventions
   - Support extensibility

4. **Add comprehensive documentation**
   - Document each extension list
   - Note security considerations
   - Provide usage examples

5. **Create helper functions**
   - Function to get extensions by category
   - Function to check if extension allowed
   - Function to validate against list

### Expected Outcome
```python
# In constants.py:

# ============================================================================
# FILE EXTENSION CONFIGURATION
# ============================================================================

"""
Allowed file extensions for uploads.

These lists define which file types can be uploaded to the system.
Only add extensions that are absolutely necessary and safe.

Security Note:
- Never allow executable extensions (.exe, .bat, .sh, .com)
- Be careful with script extensions (.js, .php, .py)
- Review and validate all new extensions before adding
"""

# All extensions should be lowercase without the dot
```

### Verification Checklist
- [ ] Allowed extensions section created
- [ ] Clear documentation added
- [ ] Security warnings included
- [ ] Structure prepared for extension lists

---

## Task 68: Define IMAGE_EXTENSIONS

### Overview
Define the list of allowed image file extensions. These are the image formats that users can upload for product photos, avatars, and other visual content.

### Dependencies
- Task 67: Create Allowed Extensions Config

### Instructions

1. **Open constants.py file**
   - Locate allowed extensions section
   - Add IMAGE_EXTENSIONS list

2. **Define image extensions**
   - Include common formats (jpg, png, gif, webp)
   - Exclude risky formats
   - Consider browser support

3. **Add comprehensive documentation**
   - Document each format
   - Note use cases
   - Reference browser compatibility

4. **Create image extension validator**
   - Function to check if extension is image
   - Support case-insensitive matching
   - Return boolean result

### Expected Outcome
```python
# In constants.py (IMAGE_EXTENSIONS):

# Image File Extensions
IMAGE_EXTENSIONS = [
    'jpg',    # JPEG images - most common, good compression
    'jpeg',   # JPEG alternative extension
    'png',    # PNG images - lossless, supports transparency
    'gif',    # GIF images - animations, limited colors
    'webp',   # WebP images - modern format, best compression
    'bmp',    # Bitmap images - uncompressed, large files
    'svg',    # SVG images - vector format, scalable (use with caution)
]

"""
Image Extension Notes:

Recommended for uploads:
- JPG/JPEG: Product photos, user uploads, general images
- PNG: Images with transparency, logos, icons
- WebP: Modern browsers, best quality-to-size ratio
- GIF: Simple animations, limited color palettes

Use with caution:
- SVG: Vector images (can contain scripts - sanitize!)
- BMP: Large file sizes, rarely needed

Not recommended:
- TIFF: Large files, limited browser support
- ICO: Icons only, use PNG instead
- HEIC: Apple format, limited browser support
"""

def is_image_extension(extension):
    """
    Check if extension is a valid image format.
    
    Args:
        extension: File extension (without dot)
        
    Returns:
        True if extension is in IMAGE_EXTENSIONS
    """
    return extension.lower() in IMAGE_EXTENSIONS
```

### Verification Checklist
- [ ] IMAGE_EXTENSIONS list defined
- [ ] Common formats included
- [ ] Comprehensive documentation
- [ ] Helper function created

---

## Task 69: Define DOCUMENT_EXTENSIONS

### Overview
Define the list of allowed document file extensions. These are the document formats that users can upload for invoices, reports, contracts, and other business documents.

### Dependencies
- Task 68: Define IMAGE_EXTENSIONS

### Instructions

1. **Open constants.py file**
   - Locate allowed extensions section
   - Add DOCUMENT_EXTENSIONS list after images

2. **Define document extensions**
   - Include PDF (primary format)
   - Add Office formats (doc, docx, xls, xlsx)
   - Include text formats (txt, csv)
   - Consider security implications

3. **Add comprehensive documentation**
   - Document each format
   - Note use cases
   - Reference security considerations

4. **Create document extension validator**
   - Function to check if extension is document
   - Support case-insensitive matching
   - Return boolean result

### Expected Outcome
```python
# In constants.py (DOCUMENT_EXTENSIONS):

# Document File Extensions
DOCUMENT_EXTENSIONS = [
    'pdf',    # PDF documents - preferred format
    'doc',    # Microsoft Word (old format)
    'docx',   # Microsoft Word (modern format)
    'xls',    # Microsoft Excel (old format)
    'xlsx',   # Microsoft Excel (modern format)
    'txt',    # Plain text files
    'csv',    # CSV files - data import/export
    'rtf',    # Rich Text Format
    'odt',    # OpenDocument Text
    'ods',    # OpenDocument Spreadsheet
]

"""
Document Extension Notes:

Preferred formats:
- PDF: Invoices, contracts, reports (recommended)
- XLSX: Spreadsheets, data files
- CSV: Data import/export

Allowed for compatibility:
- DOC/DOCX: Word documents
- XLS: Excel files (legacy)
- TXT: Plain text files
- RTF: Rich text documents

Security Considerations:
- Office files can contain macros - validate carefully
- PDF files can have JavaScript - consider disabling
- Always scan documents for malware
- Limit file sizes to prevent DoS attacks

Use Cases:
- Invoices: PDF
- Reports: PDF, XLSX
- Contracts: PDF
- Data Import: CSV, XLSX
- Documentation: PDF, DOCX
"""

def is_document_extension(extension):
    """
    Check if extension is a valid document format.
    
    Args:
        extension: File extension (without dot)
        
    Returns:
        True if extension is in DOCUMENT_EXTENSIONS
    """
    return extension.lower() in DOCUMENT_EXTENSIONS


def get_allowed_extensions_by_type(file_type='all'):
    """
    Get allowed extensions by file type.
    
    Args:
        file_type: 'image', 'document', or 'all'
        
    Returns:
        List of allowed extensions
    """
    if file_type == 'image':
        return IMAGE_EXTENSIONS.copy()
    elif file_type == 'document':
        return DOCUMENT_EXTENSIONS.copy()
    elif file_type == 'all':
        return IMAGE_EXTENSIONS + DOCUMENT_EXTENSIONS
    else:
        return []
```

### Verification Checklist
- [ ] DOCUMENT_EXTENSIONS list defined
- [ ] Common formats included
- [ ] Security considerations documented
- [ ] Helper functions created

---

## Task 70: Create Max Size Config

### Overview
Create a configuration section for maximum file sizes. This defines how large uploaded files can be for different file types, preventing resource exhaustion and abuse.

### Dependencies
- Task 69: Define DOCUMENT_EXTENSIONS

### Instructions

1. **Open constants.py file**
   - Create max size configuration section
   - Add section header comment

2. **Define size in bytes**
   - Use clear calculations (MB * 1024 * 1024)
   - Add inline comments
   - Make values easy to modify

3. **Add comprehensive documentation**
   - Document rationale for limits
   - Note server resource impact
   - Reference performance considerations

4. **Create size validation helpers**
   - Function to check if size within limit
   - Human-readable size formatting
   - Size comparison utilities

### Expected Outcome
```python
# In constants.py:

# ============================================================================
# FILE SIZE LIMITS
# ============================================================================

"""
Maximum file sizes for uploads.

These limits protect against:
- Resource exhaustion (disk space, memory)
- Denial of Service (DoS) attacks
- Slow uploads on poor connections
- Processing timeouts

Adjust based on:
- Server resources
- Expected use cases
- Network bandwidth
- Storage costs
"""

# Size calculation helpers (for clarity)
KB = 1024
MB = 1024 * KB
GB = 1024 * MB
```

### Verification Checklist
- [ ] Max size section created
- [ ] Size calculation helpers defined
- [ ] Comprehensive documentation
- [ ] Rationale explained

---

## Task 71: Define MAX_IMAGE_SIZE

### Overview
Define the maximum size for image uploads. This limit balances image quality with reasonable file sizes and upload times.

### Dependencies
- Task 70: Create Max Size Config

### Instructions

1. **Open constants.py file**
   - Locate max size section
   - Define MAX_IMAGE_SIZE constant

2. **Set appropriate limit**
   - Recommended: 5MB for images
   - Consider use cases
   - Balance quality and performance

3. **Add detailed documentation**
   - Explain size choice
   - Note typical image sizes
   - Reference processing impact

4. **Consider different image types**
   - Product photos: 2-5MB
   - Avatars: 500KB-2MB
   - Banners: 3-10MB

### Expected Outcome
```python
# In constants.py (MAX_IMAGE_SIZE):

# Maximum Image Size (5 MB)
MAX_IMAGE_SIZE = 5 * MB  # 5,242,880 bytes

"""
Maximum Image Size: 5 MB

Rationale:
- High-quality product photos: ~2-4 MB
- Modern smartphone photos: ~3-6 MB
- Allows good quality without excessive size
- Reasonable upload time on 3G/4G connections

Typical Image Sizes:
- Product photo (1920x1080, JPEG 85%): ~500KB - 2MB
- User avatar (300x300): ~50KB - 200KB
- Banner image (1920x600): ~300KB - 1MB
- High-res product (4000x3000): ~2MB - 5MB

Processing Time:
- 1MB image: ~1-2 seconds
- 5MB image: ~3-5 seconds
- 10MB image: ~8-12 seconds (too slow)

Considerations:
- Images are automatically optimized on upload
- Thumbnails are generated (add processing time)
- Large images increase storage costs
- Mobile uploads may timeout on slow connections

Recommended Usage:
- Product images: Use MAX_IMAGE_SIZE
- Avatars: Use 2MB limit (MAX_IMAGE_SIZE / 2.5)
- Banners: Use MAX_IMAGE_SIZE or slightly higher
"""

# Specialized image size limits
MAX_AVATAR_SIZE = 2 * MB      # User avatars (2 MB)
MAX_PRODUCT_IMAGE_SIZE = 5 * MB  # Product images (5 MB)
MAX_BANNER_SIZE = 10 * MB     # Banner images (10 MB)


def validate_image_size(file_size, image_type='default'):
    """
    Validate if image size is within limits.
    
    Args:
        file_size: Size in bytes
        image_type: 'default', 'avatar', 'product', 'banner'
        
    Returns:
        Tuple of (is_valid, max_allowed, error_message)
    """
    size_limits = {
        'default': MAX_IMAGE_SIZE,
        'avatar': MAX_AVATAR_SIZE,
        'product': MAX_PRODUCT_IMAGE_SIZE,
        'banner': MAX_BANNER_SIZE,
    }
    
    max_size = size_limits.get(image_type, MAX_IMAGE_SIZE)
    
    if file_size > max_size:
        from apps.core.storage.validators import FileValidator
        size_mb = file_size / MB
        max_mb = max_size / MB
        return (
            False,
            max_size,
            f"Image size ({size_mb:.2f} MB) exceeds maximum ({max_mb:.2f} MB)"
        )
    
    return (True, max_size, None)
```

### Verification Checklist
- [ ] MAX_IMAGE_SIZE defined (5MB)
- [ ] Rationale documented
- [ ] Specialized limits defined
- [ ] Validation helper created

---

## Task 72: Define MAX_DOCUMENT_SIZE

### Overview
Define the maximum size for document uploads. Documents typically need larger limits than images due to multi-page PDFs and spreadsheets.

### Dependencies
- Task 71: Define MAX_IMAGE_SIZE

### Instructions

1. **Open constants.py file**
   - Locate max size section
   - Define MAX_DOCUMENT_SIZE constant after images

2. **Set appropriate limit**
   - Recommended: 25MB for documents
   - Consider PDF page counts
   - Balance usability and security

3. **Add detailed documentation**
   - Explain size choice
   - Note typical document sizes
   - Reference use cases

4. **Consider different document types**
   - Invoices: 100KB-1MB
   - Reports: 1-10MB
   - Contracts: 500KB-5MB
   - Spreadsheets: 1-50MB

### Expected Outcome
```python
# In constants.py (MAX_DOCUMENT_SIZE):

# Maximum Document Size (25 MB)
MAX_DOCUMENT_SIZE = 25 * MB  # 26,214,400 bytes

"""
Maximum Document Size: 25 MB

Rationale:
- Multi-page PDFs: ~10-20 MB
- Large spreadsheets: ~5-50 MB
- Contracts with images: ~5-15 MB
- Allows comprehensive documents
- Balances usability and security

Typical Document Sizes:
- Simple invoice (1-2 pages): ~100KB - 500KB
- Report (10-20 pages): ~1MB - 5MB
- Contract (5-10 pages): ~500KB - 2MB
- Spreadsheet with data: ~1MB - 10MB
- Presentation: ~5MB - 20MB

Processing Time:
- 1MB PDF: Instant
- 10MB PDF: ~1-2 seconds
- 25MB Excel: ~3-5 seconds
- 50MB file: ~8-15 seconds (too slow)

Use Cases:
- Invoices: Small PDFs (< 1MB)
- Financial reports: Medium PDFs (1-10MB)
- Contracts: PDFs with images (2-5MB)
- Data imports: Large spreadsheets (5-25MB)
- Backups: Consider separate limit

Security Considerations:
- Large files can be used for DoS attacks
- Scan all documents for malware
- Consider async processing for files > 10MB
- Monitor upload patterns for abuse

Recommended Usage:
- Invoices/Receipts: 5MB limit
- Reports: MAX_DOCUMENT_SIZE
- Contracts: 10MB limit
- Data Import: MAX_DOCUMENT_SIZE or higher
"""

# Specialized document size limits
MAX_INVOICE_SIZE = 5 * MB        # Invoices and receipts (5 MB)
MAX_REPORT_SIZE = 25 * MB        # Reports and presentations (25 MB)
MAX_CONTRACT_SIZE = 10 * MB      # Contracts and agreements (10 MB)
MAX_IMPORT_SIZE = 50 * MB        # Data import files (50 MB)


def validate_document_size(file_size, document_type='default'):
    """
    Validate if document size is within limits.
    
    Args:
        file_size: Size in bytes
        document_type: 'default', 'invoice', 'report', 'contract', 'import'
        
    Returns:
        Tuple of (is_valid, max_allowed, error_message)
    """
    size_limits = {
        'default': MAX_DOCUMENT_SIZE,
        'invoice': MAX_INVOICE_SIZE,
        'report': MAX_REPORT_SIZE,
        'contract': MAX_CONTRACT_SIZE,
        'import': MAX_IMPORT_SIZE,
    }
    
    max_size = size_limits.get(document_type, MAX_DOCUMENT_SIZE)
    
    if file_size > max_size:
        size_mb = file_size / MB
        max_mb = max_size / MB
        return (
            False,
            max_size,
            f"Document size ({size_mb:.2f} MB) exceeds maximum ({max_mb:.2f} MB)"
        )
    
    return (True, max_size, None)


# Combined validation function
def get_max_size_for_extension(extension):
    """
    Get maximum file size for a given extension.
    
    Args:
        extension: File extension (without dot)
        
    Returns:
        Maximum size in bytes
    """
    if is_image_extension(extension):
        return MAX_IMAGE_SIZE
    elif is_document_extension(extension):
        return MAX_DOCUMENT_SIZE
    else:
        # Default to smaller limit for unknown types
        return 5 * MB
```

### Verification Checklist
- [ ] MAX_DOCUMENT_SIZE defined (25MB)
- [ ] Rationale documented
- [ ] Specialized limits defined
- [ ] Validation helper created
- [ ] Combined validation function added

---

## Summary

This document configured file extensions and size limits:

### Completed Configuration
1. ✅ Allowed extensions config structure created
2. ✅ IMAGE_EXTENSIONS list defined
3. ✅ DOCUMENT_EXTENSIONS list defined
4. ✅ Max size configuration section created
5. ✅ MAX_IMAGE_SIZE defined (5MB)
6. ✅ MAX_DOCUMENT_SIZE defined (25MB)

### Key Achievements
- 🎯 Comprehensive extension lists
- 🎯 Clear size limits with rationale
- 🎯 Specialized limits for different use cases
- 🎯 Helper functions for validation
- 🎯 Security considerations documented
- 🎯 Easy to maintain and extend

### Next Steps
Proceed to [03_Tasks-73-74_Cleanup-Command.md](03_Tasks-73-74_Cleanup-Command.md) to implement file cleanup utilities and management command.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [03_Tasks-73-74_Cleanup-Command.md](03_Tasks-73-74_Cleanup-Command.md)
