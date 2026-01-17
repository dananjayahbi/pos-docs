# SubPhase 10: File Storage Configuration - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 10 of 12  
> **SubPhase Goal:** Configure file storage with tenant isolation  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 6-7 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Caching-Layer](../SubPhase-09_Caching-Layer/)
- **→ Next SubPhase:** [SubPhase-11_API-Documentation](../SubPhase-11_API-Documentation/)

---

## SubPhase Overview

This sub-phase implements the file storage system for the LankaCommerce Cloud platform. Files are organized by tenant with local storage for development and S3 for production.

### Key Outcomes
- Local file storage for development
- S3 storage for production
- Tenant-isolated file paths
- Image optimization pipeline
- Signed URLs for private files
- File validation & security

### Storage Structure
```
/media/
├── tenant-001/
│   ├── products/
│   ├── invoices/
│   └── documents/
├── tenant-002/
│   ├── products/
│   ├── invoices/
│   └── documents/
└── public/          # Shared assets
```

### Dependencies
- **Requires:** SubPhase-06 (Core Middleware Stack)

---

## Task Execution Order

```
TASK GROUP A: Storage Backend Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: Tenant-Isolated Storage (Tasks 15-30)
        │
        ▼
TASK GROUP C: S3 Production Storage (Tasks 31-46)
        │
        ▼
TASK GROUP D: Image Processing Pipeline (Tasks 47-60)
        │
        ▼
TASK GROUP E: File Security & Validation (Tasks 61-74)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 75-86)
```

---

## Task Index

### Group A: Storage Backend Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install django-storages** | pip install django-storages | SubPhase-06 | 🔴 Not Created |
| 02 | **Pin django-storages Version** | Add to requirements.txt | Task 01 | 🔴 Not Created |
| 03 | **Install Pillow** | Image processing library | Task 02 | 🔴 Not Created |
| 04 | **Pin Pillow Version** | Add to requirements.txt | Task 03 | 🔴 Not Created |
| 05 | **Create storage Module** | apps/core/storage/ | Task 04 | 🔴 Not Created |
| 06 | **Create storage __init__.py** | Export storage classes | Task 05 | 🔴 Not Created |
| 07 | **Create Storage Settings File** | settings/storage.py | Task 06 | 🔴 Not Created |
| 08 | **Configure MEDIA_URL** | /media/ path | Task 07 | 🔴 Not Created |
| 09 | **Configure MEDIA_ROOT** | Local media directory | Task 08 | 🔴 Not Created |
| 10 | **Configure STATIC_URL** | /static/ path | Task 09 | 🔴 Not Created |
| 11 | **Configure STATIC_ROOT** | Static files directory | Task 10 | 🔴 Not Created |
| 12 | **Create Media Directory** | Local dev directory | Task 11 | 🔴 Not Created |
| 13 | **Import Storage Settings** | In base.py | Task 12 | 🔴 Not Created |
| 14 | **Test Basic File Upload** | Verify setup | Task 13 | 🔴 Not Created |

---

### Group B: Tenant-Isolated Storage (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create backends.py File** | Storage backends | Task 14 | 🔴 Not Created |
| 16 | **Create TenantFileStorage Class** | Tenant-aware storage | Task 15 | 🔴 Not Created |
| 17 | **Override _save Method** | Tenant path prefix | Task 16 | 🔴 Not Created |
| 18 | **Override url Method** | Tenant-scoped URLs | Task 17 | 🔴 Not Created |
| 19 | **Override path Method** | Tenant-scoped paths | Task 18 | 🔴 Not Created |
| 20 | **Override delete Method** | Safe tenant delete | Task 19 | 🔴 Not Created |
| 21 | **Override exists Method** | Tenant-scoped check | Task 20 | 🔴 Not Created |
| 22 | **Add get_tenant_path Method** | Generate tenant path | Task 21 | 🔴 Not Created |
| 23 | **Create TenantMediaStorage** | Media files storage | Task 22 | 🔴 Not Created |
| 24 | **Create PublicStorage** | Public assets storage | Task 23 | 🔴 Not Created |
| 25 | **Create paths.py File** | Path utilities | Task 24 | 🔴 Not Created |
| 26 | **Create product_path Function** | Products upload path | Task 25 | 🔴 Not Created |
| 27 | **Create invoice_path Function** | Invoices upload path | Task 26 | 🔴 Not Created |
| 28 | **Create document_path Function** | Documents upload path | Task 27 | 🔴 Not Created |
| 29 | **Create avatar_path Function** | User avatars path | Task 28 | 🔴 Not Created |
| 30 | **Export Storage Classes** | In __init__.py | Task 29 | 🔴 Not Created |

---

### Group C: S3 Production Storage (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Install boto3** | AWS SDK | Task 30 | 🔴 Not Created |
| 32 | **Pin boto3 Version** | Add to requirements.txt | Task 31 | 🔴 Not Created |
| 33 | **Create S3 Settings** | S3 configuration | Task 32 | 🔴 Not Created |
| 34 | **Configure AWS_ACCESS_KEY_ID** | Environment variable | Task 33 | 🔴 Not Created |
| 35 | **Configure AWS_SECRET_ACCESS_KEY** | Environment variable | Task 34 | 🔴 Not Created |
| 36 | **Configure AWS_STORAGE_BUCKET_NAME** | Bucket name | Task 35 | 🔴 Not Created |
| 37 | **Configure AWS_S3_REGION_NAME** | Region setting | Task 36 | 🔴 Not Created |
| 38 | **Configure AWS_S3_CUSTOM_DOMAIN** | CDN domain | Task 37 | 🔴 Not Created |
| 39 | **Configure AWS_S3_OBJECT_PARAMETERS** | Cache control | Task 38 | 🔴 Not Created |
| 40 | **Create TenantS3Storage Class** | S3 tenant storage | Task 39 | 🔴 Not Created |
| 41 | **Override S3 path Methods** | Tenant prefix in S3 | Task 40 | 🔴 Not Created |
| 42 | **Configure Private Files Bucket** | Secure bucket | Task 41 | 🔴 Not Created |
| 43 | **Configure Public Files Bucket** | Public bucket | Task 42 | 🔴 Not Created |
| 44 | **Create S3 Signed URLs** | Pre-signed URLs | Task 43 | 🔴 Not Created |
| 45 | **Configure URL Expiry** | Signed URL timeout | Task 44 | 🔴 Not Created |
| 46 | **Configure Storage Backend Switch** | Dev vs Prod | Task 45 | 🔴 Not Created |

---

### Group D: Image Processing Pipeline (Tasks 47-60)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create images.py File** | Image utilities | Task 46 | 🔴 Not Created |
| 48 | **Create ImageProcessor Class** | Image processing | Task 47 | 🔴 Not Created |
| 49 | **Add resize Method** | Resize images | Task 48 | 🔴 Not Created |
| 50 | **Add compress Method** | Compress images | Task 49 | 🔴 Not Created |
| 51 | **Add convert_format Method** | Format conversion | Task 50 | 🔴 Not Created |
| 52 | **Add generate_thumbnail Method** | Thumbnail creation | Task 51 | 🔴 Not Created |
| 53 | **Add optimize_for_web Method** | Web optimization | Task 52 | 🔴 Not Created |
| 54 | **Create Thumbnail Sizes Config** | Size presets | Task 53 | 🔴 Not Created |
| 55 | **Define THUMB_SMALL (100x100)** | Small thumbnail | Task 54 | 🔴 Not Created |
| 56 | **Define THUMB_MEDIUM (300x300)** | Medium thumbnail | Task 55 | 🔴 Not Created |
| 57 | **Define THUMB_LARGE (600x600)** | Large thumbnail | Task 56 | 🔴 Not Created |
| 58 | **Create Image Upload Handler** | Pre-save processing | Task 57 | 🔴 Not Created |
| 59 | **Create Async Image Task** | Celery optimization | Task 58 | 🔴 Not Created |
| 60 | **Export Image Utilities** | In __init__.py | Task 59 | 🔴 Not Created |

---

### Group E: File Security & Validation (Tasks 61-74)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 61 | **Create validators.py File** | File validators | Task 60 | 🔴 Not Created |
| 62 | **Create FileValidator Class** | Validation logic | Task 61 | 🔴 Not Created |
| 63 | **Add validate_extension Method** | Extension check | Task 62 | 🔴 Not Created |
| 64 | **Add validate_size Method** | Size limit check | Task 63 | 🔴 Not Created |
| 65 | **Add validate_mime_type Method** | MIME type check | Task 64 | 🔴 Not Created |
| 66 | **Add scan_for_malware Method** | Security scan | Task 65 | 🔴 Not Created |
| 67 | **Create Allowed Extensions Config** | Per file type | Task 66 | 🔴 Not Created |
| 68 | **Define IMAGE_EXTENSIONS** | jpg, png, webp | Task 67 | 🔴 Not Created |
| 69 | **Define DOCUMENT_EXTENSIONS** | pdf, doc, xlsx | Task 68 | 🔴 Not Created |
| 70 | **Create Max Size Config** | Size limits | Task 69 | 🔴 Not Created |
| 71 | **Define MAX_IMAGE_SIZE** | 5MB limit | Task 70 | 🔴 Not Created |
| 72 | **Define MAX_DOCUMENT_SIZE** | 25MB limit | Task 71 | 🔴 Not Created |
| 73 | **Create File Cleanup Utility** | Orphan removal | Task 72 | 🔴 Not Created |
| 74 | **Create Management Command** | cleanmedia command | Task 73 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 75-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 75 | **Create Storage Test Utils** | Test utilities | Task 74 | 🔴 Not Created |
| 76 | **Configure Test Storage** | In-memory storage | Task 75 | 🔴 Not Created |
| 77 | **Test TenantFileStorage** | Tenant storage tests | Task 76 | 🔴 Not Created |
| 78 | **Test Storage Isolation** | Tenant isolation | Task 77 | 🔴 Not Created |
| 79 | **Test Image Processing** | Image pipeline tests | Task 78 | 🔴 Not Created |
| 80 | **Test File Validation** | Validator tests | Task 79 | 🔴 Not Created |
| 81 | **Test S3 Storage** | S3 integration tests | Task 80 | 🔴 Not Created |
| 82 | **Test Signed URLs** | URL generation tests | Task 81 | 🔴 Not Created |
| 83 | **Create Storage README** | Usage documentation | Task 82 | 🔴 Not Created |
| 84 | **Document Upload Patterns** | Upload guide | Task 83 | 🔴 Not Created |
| 85 | **Document S3 Configuration** | S3 setup guide | Task 84 | 🔴 Not Created |
| 86 | **Verify Full Integration** | End-to-end test | Task 85 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/core/
├── storage/
│   ├── __init__.py
│   ├── backends.py
│   ├── paths.py
│   ├── images.py
│   ├── validators.py
│   └── constants.py
├── management/
│   └── commands/
│       └── cleanmedia.py
├── tests/
│   └── test_storage/
│       ├── __init__.py
│       ├── test_backends.py
│       ├── test_images.py
│       └── test_validators.py
└── docs/
    └── storage/
        ├── overview.md
        ├── uploads.md
        └── s3-config.md
```

---

## Storage Path Patterns

```
┌─────────────────────────────────────────────────────┐
│              STORAGE PATH PATTERNS                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Local Development:                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ /media/tenant-{id}/products/{date}/{file}   │   │
│  │ /media/tenant-{id}/invoices/{year}/{month}/ │   │
│  │ /media/tenant-{id}/documents/{file}         │   │
│  │ /media/tenant-{id}/avatars/{user_id}/{file} │   │
│  │ /media/public/shared-assets/{file}          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  S3 Production:                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ s3://bucket/tenant-{id}/products/{file}     │   │
│  │ s3://bucket/tenant-{id}/invoices/{file}     │   │
│  │ s3://bucket/tenant-{id}/documents/{file}    │   │
│  │ s3://private/tenant-{id}/sensitive/{file}   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## File Size Limits

```
┌─────────────────────────────────────────────────────┐
│               FILE SIZE LIMITS                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Images:                                            │
│  ├── Product images: 5 MB                          │
│  ├── User avatars: 2 MB                            │
│  └── Category banners: 10 MB                       │
│                                                     │
│  Documents:                                         │
│  ├── Invoices (PDF): 10 MB                         │
│  ├── Reports (Excel): 25 MB                        │
│  └── Contracts: 50 MB                              │
│                                                     │
│  Tenant Quota:                                      │
│  ├── Free tier: 1 GB                               │
│  ├── Basic tier: 10 GB                             │
│  ├── Pro tier: 50 GB                               │
│  └── Enterprise: Unlimited                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 86 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Tenant Isolation:** All files in tenant-prefixed paths
3. **Dev vs Prod:** Use local storage for dev, S3 for prod
4. **Image Optimization:** Process before storage
5. **Validation First:** Validate before saving
6. **Signed URLs:** Use for private files
7. **Cleanup:** Run orphan removal periodically
8. **Size Limits:** Enforce per file type
9. **Async Processing:** Use Celery for heavy tasks
