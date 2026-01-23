# Tasks 01-04: Package Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** A - Storage Backend Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document)
- **→ Next Document:** [02_Tasks-05-08_Storage-Module-Setup.md](02_Tasks-05-08_Storage-Module-Setup.md)

---

## Document Overview

This document covers the installation of essential packages for file storage functionality in LankaCommerce Cloud. The django-storages package provides backends for various storage systems (local, S3, GCS, Azure), while Pillow handles image processing and manipulation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install django-storages | Simple |
| 02 | Pin django-storages Version | Simple |
| 03 | Install Pillow | Simple |
| 04 | Pin Pillow Version | Simple |

---

## Task 01: Install django-storages

### Overview
Install the django-storages package, which provides support for multiple storage backends including local file system, Amazon S3, Google Cloud Storage, and Azure Storage.

### Dependencies
- SubPhase-06: Core Middleware Stack (settings structure in place)
- Working Django project structure
- Active Python virtual environment

### Instructions

1. **Verify current environment**
   - Confirm you are in the backend directory
   - Ensure virtual environment is activated
   - Check that Django is already installed

2. **Locate requirements file**
   - Navigate to `backend/requirements/` directory
   - Identify the `base.txt` file for base dependencies

3. **Add django-storages to requirements**
   - Open `backend/requirements/base.txt`
   - Add django-storages to the file storage section
   - Place it after Django core packages

4. **Install the package**
   - Use pip to install the package
   - Run installation from backend directory
   - Verify installation completes successfully

5. **Verify installation**
   - Check that django-storages appears in pip list
   - Verify the installed version number
   - Confirm no installation errors occurred

### Package Information

| Property | Value |
|----------|-------|
| **Package Name** | django-storages |
| **Purpose** | Provides storage backends for Django |
| **Category** | File Storage |
| **Required** | Yes |
| **Supports** | Local, S3, GCS, Azure, FTP, SFTP |

### Storage Backends Provided

| Backend | Class | Use Case |
|---------|-------|----------|
| **File System** | FileSystemStorage | Local development |
| **Amazon S3** | S3Boto3Storage | Production cloud storage |
| **Google Cloud** | GoogleCloudStorage | GCS users |
| **Azure** | AzureStorage | Azure ecosystem |
| **Dropbox** | DropBoxStorage | Dropbox integration |
| **FTP/SFTP** | FTPStorage, SFTPStorage | Legacy systems |

### Expected Outcome
```
backend/
└── requirements/
    └── base.txt              # django-storages added
```

### Verification Checklist
- [ ] django-storages added to requirements/base.txt
- [ ] Package installed in virtual environment
- [ ] No installation errors occurred
- [ ] Package appears in pip list

---

## Task 02: Pin django-storages Version

### Overview
Pin the django-storages package to a specific version to ensure consistent behavior across development, staging, and production environments.

### Dependencies
- Task 01: Install django-storages

### Instructions

1. **Check installed version**
   - Use pip to display the installed version of django-storages
   - Note the exact version number

2. **Research version compatibility**
   - Check django-storages release notes
   - Verify compatibility with Django 5.x
   - Confirm Python 3.12+ support

3. **Update requirements with pinned version**
   - Open `backend/requirements/base.txt`
   - Find the django-storages line
   - Replace with version specification using `>=` operator

4. **Add version constraint comment**
   - Add inline comment explaining version choice
   - Note any specific features required
   - Document any known version issues

5. **Test version compatibility**
   - Reinstall dependencies from requirements file
   - Verify correct version is installed
   - Check for any dependency conflicts

### Version Pinning Strategy

| Strategy | Format | Example | When to Use |
|----------|--------|---------|-------------|
| **Exact** | `==X.Y.Z` | `==1.14.2` | Production stability |
| **Minimum** | `>=X.Y.Z` | `>=1.14.0` | Recommended for development |
| **Range** | `>=X.Y.Z,<X+1.0.0` | `>=1.14.0,<2.0.0` | Major version lock |
| **Compatible** | `~=X.Y` | `~=1.14` | Minor updates only |

### Recommended Version
- **Minimum Version:** 1.14.0
- **Reasoning:** Full Django 5.x support, Python 3.12+ compatibility
- **Format:** `django-storages>=1.14.0`

### Version Compatibility Matrix

| django-storages | Django | Python | S3 Support | Key Features |
|-----------------|--------|--------|------------|--------------|
| 1.14.x | 4.2-5.0 | 3.8-3.12 | ✓ | Full Django 5.x support |
| 1.13.x | 3.2-4.2 | 3.7-3.11 | ✓ | Older Django versions |
| 1.12.x | 3.2-4.1 | 3.6-3.10 | ✓ | Legacy support |

### Expected Outcome
```
backend/
└── requirements/
    └── base.txt              # django-storages version pinned
```

### Verification Checklist
- [ ] django-storages version is specified in base.txt
- [ ] Version format uses `>=` operator
- [ ] Version is compatible with Django 5.x
- [ ] Version is compatible with Python 3.12+
- [ ] Comment explains version choice

---

## Task 03: Install Pillow

### Overview
Install Pillow, the Python Imaging Library fork, which provides image processing capabilities for file uploads, thumbnails, and image transformations.

### Dependencies
- Task 02: Pin django-storages Version

### Instructions

1. **Add Pillow to requirements**
   - Open `backend/requirements/base.txt`
   - Add Pillow to the image processing section
   - Place it near django-storages for organization

2. **Install system dependencies (if needed)**
   - Check if system image libraries are installed
   - On Ubuntu/Debian: libjpeg-dev, zlib1g-dev, libpng-dev
   - On macOS: Usually included with Xcode tools
   - On Windows: Pillow includes prebuilt binaries

3. **Install the package**
   - Use pip to install Pillow
   - Run installation from backend directory
   - Monitor for any compilation warnings

4. **Verify installation**
   - Check that Pillow appears in pip list
   - Verify the installed version number
   - Test import in Python shell

5. **Test image format support**
   - Verify JPEG support is enabled
   - Verify PNG support is enabled
   - Verify WebP support is available (optional)

### Package Information

| Property | Value |
|----------|-------|
| **Package Name** | Pillow |
| **Purpose** | Image processing and manipulation |
| **Category** | Image Processing |
| **Required** | Yes |
| **Supports** | JPEG, PNG, WebP, GIF, BMP, TIFF |

### Image Processing Features

| Feature | Purpose | Use Case |
|---------|---------|----------|
| **Resize** | Change image dimensions | Thumbnails, optimization |
| **Crop** | Extract image region | Profile pictures, product images |
| **Rotate** | Change orientation | EXIF correction |
| **Format Conversion** | Convert between formats | PNG to JPEG, optimize size |
| **Filters** | Apply effects | Blur, sharpen, enhance |
| **Watermark** | Add text/image overlay | Brand protection |

### System Dependencies

| Platform | Dependencies | Installation |
|----------|-------------|--------------|
| **Ubuntu/Debian** | libjpeg-dev, zlib1g-dev, libpng-dev | `apt install libjpeg-dev zlib1g-dev libpng-dev` |
| **macOS** | Xcode Command Line Tools | Usually pre-installed |
| **Windows** | None (prebuilt binaries) | Automatic |
| **Docker** | Included in Python base image | No action needed |

### Expected Outcome
```
backend/
└── requirements/
    └── base.txt              # Pillow added
```

### Verification Checklist
- [ ] Pillow added to requirements/base.txt
- [ ] System dependencies installed (if applicable)
- [ ] Package installed in virtual environment
- [ ] No compilation errors occurred
- [ ] JPEG support confirmed
- [ ] PNG support confirmed

---

## Task 04: Pin Pillow Version

### Overview
Pin the Pillow package to a specific version to ensure consistent image processing behavior and prevent unexpected changes from version updates.

### Dependencies
- Task 03: Install Pillow

### Instructions

1. **Check installed version**
   - Use pip to display the installed version of Pillow
   - Note the exact version number

2. **Research version compatibility**
   - Check Pillow release notes
   - Verify Python 3.12+ support
   - Confirm security fixes are included

3. **Update requirements with pinned version**
   - Open `backend/requirements/base.txt`
   - Find the Pillow line
   - Replace with version specification using `>=` operator

4. **Add version constraint comment**
   - Add inline comment explaining version choice
   - Note security considerations
   - Document any format support requirements

5. **Test version compatibility**
   - Reinstall dependencies from requirements file
   - Verify correct version is installed
   - Test basic image operations

### Recommended Version
- **Minimum Version:** 10.0.0
- **Reasoning:** Python 3.12 support, security fixes, WebP support
- **Format:** `Pillow>=10.0.0`

### Version Security Considerations

| Version | Python | Security | WebP | JPEG XL |
|---------|--------|----------|------|---------|
| 10.x | 3.8-3.12 | ✓ Latest | ✓ | ✓ |
| 9.x | 3.7-3.11 | ⚠ Older | ✓ | ✗ |
| 8.x | 3.6-3.10 | ⚠ EOL | Limited | ✗ |

### Security Best Practices
- Always use the latest stable major version
- Monitor security advisories for Pillow
- Update regularly for security patches
- Test thoroughly after version updates

### Image Format Support

| Format | Extension | Use Case | Supported in v10.0+ |
|--------|-----------|----------|---------------------|
| **JPEG** | .jpg, .jpeg | Photos, product images | ✓ |
| **PNG** | .png | Transparent images, logos | ✓ |
| **WebP** | .webp | Modern web format | ✓ |
| **GIF** | .gif | Animations | ✓ |
| **BMP** | .bmp | Legacy format | ✓ |
| **TIFF** | .tiff, .tif | High quality | ✓ |
| **ICO** | .ico | Favicons | ✓ |
| **JPEG XL** | .jxl | Next-gen format | ✓ |

### Expected Outcome
```
backend/
└── requirements/
    └── base.txt              # Both packages pinned

# File content example:
# django-storages>=1.14.0  # Storage backends for S3, GCS, Azure
# Pillow>=10.0.0          # Image processing and manipulation
```

### Verification Checklist
- [ ] Pillow version is specified in base.txt
- [ ] Version format uses `>=` operator
- [ ] Version is compatible with Python 3.12+
- [ ] Version includes latest security fixes
- [ ] Comment explains version choice
- [ ] Both packages are properly documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Install django-storages | django-storages package installed |
| 02 | Pin django-storages Version | Version constraint added (>=1.14.0) |
| 03 | Install Pillow | Pillow package installed |
| 04 | Pin Pillow Version | Version constraint added (>=10.0.0) |

### Final Requirements Structure
```
backend/
└── requirements/
    └── base.txt              # Updated with storage packages

# File content includes:
# django-storages>=1.14.0
# Pillow>=10.0.0
```

### Package Installation Summary

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| django-storages | >=1.14.0 | Storage backends | ✓ Installed |
| Pillow | >=10.0.0 | Image processing | ✓ Installed |

### Next Steps
1. Install the packages from requirements file
2. Proceed to [02_Tasks-05-08_Storage-Module-Setup.md](02_Tasks-05-08_Storage-Module-Setup.md) to create the storage module

---

## Notes for AI Agents

1. **Execution Order:** Tasks 01-04 must be executed sequentially
2. **Version Requirements:** Use django-storages>=1.14.0 and Pillow>=10.0.0
3. **System Dependencies:** Pillow may require system libraries on Linux
4. **Docker Note:** System dependencies should be in Dockerfile
5. **Security:** Always use latest stable versions for security patches
6. **Testing:** Verify installation before proceeding to next document
