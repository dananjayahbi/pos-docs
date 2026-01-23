# Tasks 61-64: Batch Optimization, Migration & Caching

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** D - WebP Conversion & Optimization  
> **Document:** 03 of 03  
> **Tasks Covered:** 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-55-60_Responsive-CDN-Placeholder.md](02_Tasks-55-60_Responsive-CDN-Placeholder.md)
- **→ Next Group:** [../Group-E_Media-Serializers-API-Views/](../Group-E_Media-Serializers-API-Views/)

---

## Document Overview

This document covers batch optimization management commands, format migration tasks, optimization reporting, and cache header utilities for optimal browser and CDN caching behavior.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Add batch optimization command | High |
| 62 | Create image format migration | High |
| 63 | Add optimization report | Low |
| 64 | Create cache headers utility | Low |

---

## Task 61: Add Batch Optimization Command

### Overview
Create a Django management command to batch optimize existing images, generating missing variants, converting to WebP, and creating placeholders for images uploaded before optimization features were implemented.

### Dependencies
- Task 26: Create Celery task for processing
- Task 49: Create WebP converter service
- Task 59: Add placeholder generation

### Instructions

1. **Create management command directory**
   - Navigate to `backend/apps/products/media/`
   - Create `management/` directory if not exists
   - Create `management/commands/` subdirectory
   - Add `__init__.py` to both directories

2. **Create optimize_images.py command file**
   - Create file in `management/commands/` directory
   - Name: `optimize_images.py`
   - Django management command structure

3. **Import required modules**
   - Import `BaseCommand` from `django.core.management.base`
   - Import ProductImage, VariantImage models
   - Import ImageVariant model
   - Import image processing services
   - Import Celery tasks

4. **Define Command class**
   - Create class inheriting from BaseCommand
   - Set help text explaining command purpose
   - Add command description

5. **Add command arguments**
   - Add `--product-id` argument (optional): Optimize specific product
   - Add `--tenant` argument (optional): Optimize specific tenant
   - Add `--force` flag: Re-optimize even if already processed
   - Add `--async` flag: Use Celery for async processing
   - Add `--batch-size` argument: Process N images at a time (default: 100)
   - Add `--dry-run` flag: Show what would be done without doing it

6. **Implement handle method**
   - Main command logic
   - Parse arguments
   - Query images based on filters
   - Display count of images to process
   - Confirm if not --force or --dry-run

7. **Query images needing optimization**
   - Find ProductImages without ImageVariants
   - Find ImageVariants without WebP paths
   - Find images without placeholders
   - Build queryset based on criteria

8. **Process images in batches**
   - Iterate through queryset in chunks
   - For each image:
     - Generate missing size variants
     - Convert to WebP if not exists
     - Generate placeholder if missing
   - Display progress bar or percentage

9. **Handle async processing**
   - If --async flag set, queue Celery tasks
   - Don't block command execution
   - Display task IDs for tracking
   - Otherwise process synchronously

10. **Generate summary report**
    - Count images processed
    - Count variants generated
    - Count WebP conversions
    - Count placeholders created
    - Display total storage savings
    - Show execution time

11. **Add error handling**
    - Catch and log individual image errors
    - Continue processing other images
    - Report failed images at end
    - Return appropriate exit codes

12. **Test command**
    - Run with --dry-run first
    - Verify correct images selected
    - Check progress reporting
    - Validate batch processing

### Command Usage Examples

```bash
# Optimize all images across all tenants
python manage.py optimize_images

# Optimize specific product
python manage.py optimize_images --product-id=123

# Optimize specific tenant
python manage.py optimize_images --tenant=acme_corp

# Dry run to see what would be done
python manage.py optimize_images --dry-run

# Force re-optimization of all images
python manage.py optimize_images --force

# Use async processing with Celery
python manage.py optimize_images --async --batch-size=50
```

### Optimization Criteria

| Criterion | Check | Action |
|-----------|-------|--------|
| Missing variants | No ImageVariant record | Generate all sizes |
| Missing WebP | ImageVariant exists, no webp_*_path | Convert to WebP |
| Missing placeholder | No placeholder_data_uri | Generate LQIP |
| Force flag | --force present | Re-process everything |

### Expected Outcome
```
backend/apps/products/media/
└── management/
    ├── __init__.py
    └── commands/
        ├── __init__.py
        └── optimize_images.py (NEW)

Command usage:
python manage.py optimize_images [options]

Batch processes existing images
Generates missing variants and WebP
Creates placeholders
Reports progress and results
```

### Verification Checklist
- [ ] management/commands directory structure created
- [ ] optimize_images.py command file created
- [ ] Command class inherits from BaseCommand
- [ ] Arguments added: product-id, tenant, force, async, batch-size, dry-run
- [ ] handle method implements main logic
- [ ] Queries images needing optimization
- [ ] Processes in batches
- [ ] Supports async processing via Celery
- [ ] Generates summary report
- [ ] Error handling for failed images
- [ ] Progress reporting during execution
- [ ] Dry-run mode works correctly

---

## Task 62: Create Image Format Migration

### Overview
Create a Celery task or management command to migrate existing JPEG/PNG images to WebP format in the background, handling large numbers of images efficiently without blocking operations.

### Dependencies
- Task 49: Create WebP converter service
- Task 61: Add batch optimization command (reference pattern)

### Instructions

1. **Create migrate_to_webp.py command**
   - In `management/commands/` directory
   - Similar structure to optimize_images command
   - Focused specifically on WebP migration

2. **Add migration-specific arguments**
   - Add `--source-format` argument: 'jpeg', 'png', or 'all'
   - Add `--delete-original` flag: Remove original after conversion (dangerous!)
   - Add `--verify` flag: Verify WebP quality before deleting original
   - Add `--resume` flag: Resume interrupted migration

3. **Implement migration strategy**
   - Query images by source format
   - Check if WebP already exists (skip if so)
   - Convert to WebP
   - Verify conversion success
   - Optionally delete original

4. **Add migration state tracking**
   - Store migration progress in database or cache
   - Track: total images, processed, failed, skipped
   - Allows resuming interrupted migrations
   - Show progress on re-run

5. **Create Celery task for background migration**
   - Task: `migrate_images_to_webp`
   - Accept list of image IDs
   - Process asynchronously
   - Can be scheduled or triggered manually

6. **Implement quality verification**
   - If --verify flag set:
     - Compare file sizes (WebP should be smaller)
     - Optionally: Compare image similarity (SSIM)
     - Only delete original if verification passes
   - Safety measure before deleting originals

7. **Add rollback capability**
   - Store original file hash or copy
   - Allow reverting to original if issues found
   - Command: `rollback_webp_migration`
   - Important safety feature

8. **Handle mixed galleries**
   - Some images already WebP, others not
   - Don't re-process existing WebP
   - Skip already migrated images
   - Track migration status per image

9. **Generate migration report**
   - Images migrated: count
   - Storage saved: bytes
   - Failed conversions: list
   - Time taken
   - Save report to file for audit

10. **Schedule periodic migration**
    - Create Celery beat task
    - Run daily/weekly to catch new uploads
    - Migrate recently uploaded non-WebP images
    - Keeps system optimized automatically

### Migration Flow

```
┌─────────────────────────┐
│ Query Non-WebP Images   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ For Each Image:         │
│ - Check if WebP exists  │
│ - Convert to WebP       │
│ - Verify conversion     │
└───────────┬─────────────┘
            │
            ▼
      ┌──────────┐
      │ Delete   │
      │ Original?│
      └────┬─┬───┘
           │ │
          Yes No
           │ │
           │ └────────────┐
           │              │
           ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Verify   │   │ Keep     │
    │ Quality  │   │ Original │
    └────┬─────┘   └──────────┘
         │
         ▼
    ┌──────────┐
    │ Delete if│
    │ Verified │
    └──────────┘
```

### Safety Considerations

| Risk | Mitigation |
|------|------------|
| Data loss | Never delete originals by default |
| Poor conversion | Verify quality before deletion |
| Interrupted migration | Track progress, allow resume |
| Disk space | Monitor available space |
| Load | Use async processing, rate limiting |

### Expected Outcome
```
Commands created:
- migrate_to_webp.py management command
- Celery task for background migration
- rollback_webp_migration.py command (optional)

Features:
- Source format filtering
- Optional original deletion
- Quality verification
- Resume capability
- Migration reporting
- Scheduled periodic migration
```

### Verification Checklist
- [ ] migrate_to_webp.py command created
- [ ] Arguments: source-format, delete-original, verify, resume
- [ ] Queries images by format
- [ ] Checks for existing WebP (skips if exists)
- [ ] Converts to WebP format
- [ ] Verifies conversion if --verify flag set
- [ ] Tracks migration progress
- [ ] Allows resuming interrupted migration
- [ ] Generates migration report
- [ ] Celery task for async migration
- [ ] Optional: Rollback command
- [ ] Optional: Scheduled periodic migration
- [ ] Safety measures to prevent data loss

---

## Task 63: Add Optimization Report

### Overview
Create a report generation system that shows optimization statistics, storage savings, and performance metrics, helping administrators understand the impact of image optimization.

### Dependencies
- Task 60: Create image compression analyzer
- Task 61: Add batch optimization command

### Instructions

1. **Create optimization_report.py utility**
   - Navigate to `backend/apps/products/media/utils/`
   - Create file named `optimization_report.py`
   - Report generation and formatting logic

2. **Define OptimizationReport class**
   - Class to build and format optimization reports
   - Methods for different report types
   - Output formats: text, JSON, HTML

3. **Add generate_summary_report method**
   - Method signature: `generate_summary_report(tenant=None)`
   - High-level overview of optimization status
   - Total images, storage used, savings
   - WebP adoption rate
   - Average optimization score

4. **Add generate_detailed_report method**
   - Method: `generate_detailed_report(product=None, tenant=None)`
   - Detailed breakdown per product or tenant
   - List of poorly optimized images
   - Recommendations for improvement
   - Format-specific statistics

5. **Calculate key metrics**
   - Total images in system
   - Images with WebP: count and percentage
   - Images with all variants: count and percentage
   - Images with placeholders: count and percentage
   - Total storage used vs unoptimized baseline
   - Total storage saved

6. **Add savings calculation**
   - Use ImageCompressionAnalyzer from Task 60
   - Aggregate savings across all images
   - Calculate what storage would be without optimization
   - Show savings in bytes, KB, MB, GB
   - Show percentage savings

7. **Identify optimization opportunities**
   - List images without WebP (top 10 by size)
   - List images without variants
   - List images with low optimization scores
   - Provide actionable recommendations

8. **Create report formats**
   - Text format for terminal output
   - JSON format for API consumption
   - HTML format for web dashboard
   - CSV format for spreadsheet analysis

9. **Add report command**
   - Management command: `optimization_report.py`
   - Arguments: --format (text/json/html/csv)
   - Argument: --output (file path)
   - Argument: --tenant, --product for filtering
   - Generate and save or display report

10. **Schedule periodic reports**
    - Celery beat task to generate weekly reports
    - Email reports to administrators
    - Store historical reports for trending
    - Track optimization improvements over time

### Report Structure Example

```
=== OPTIMIZATION REPORT ===
Generated: 2026-01-23 10:00:00

OVERVIEW
--------
Total Images: 1,234
Images with WebP: 1,100 (89%)
Images with All Variants: 1,234 (100%)
Images with Placeholders: 1,050 (85%)

STORAGE
-------
Total Storage Used: 456.7 MB
Estimated Without Optimization: 678.3 MB
Storage Saved: 221.6 MB (32.7%)

FORMAT BREAKDOWN
----------------
Original JPEG: 800 images, 350 MB
WebP from JPEG: 800 images, 231 MB (34% savings)
Original PNG: 434 images, 106 MB
WebP from PNG: 300 images, 75 MB (29% savings)

OPTIMIZATION OPPORTUNITIES
--------------------------
1. 134 PNG images without WebP (potential 39 MB savings)
2. 184 images without placeholders
3. 45 images with optimization score < 50

TOP UNOPTIMIZED IMAGES
----------------------
1. product_123_image_5.jpg (5.2 MB, no WebP)
2. product_456_image_2.png (3.8 MB, no WebP)
3. product_789_image_1.jpg (3.1 MB, low quality variants)

RECOMMENDATIONS
---------------
- Run: python manage.py optimize_images --force
- Enable automatic WebP conversion for new uploads
- Review and re-upload top unoptimized images
```

### Report Metrics

| Metric | Description | Importance |
|--------|-------------|------------|
| WebP Adoption | % of images with WebP | High - major savings |
| Variant Coverage | % with all size variants | High - responsiveness |
| Placeholder Coverage | % with LQIP | Medium - UX |
| Avg Optimization Score | Mean score across images | Medium - overall health |
| Total Savings | Absolute storage saved | High - cost reduction |
| Savings Percentage | % reduction from baseline | High - efficiency |

### Expected Outcome
```
optimization_report.py created with:
- OptimizationReport class
- generate_summary_report()
- generate_detailed_report()
- Multiple output formats (text, JSON, HTML, CSV)

Management command:
- python manage.py optimization_report [options]

Scheduled reports:
- Weekly email reports to admins
- Historical tracking
```

### Verification Checklist
- [ ] optimization_report.py file created
- [ ] OptimizationReport class defined
- [ ] generate_summary_report method implemented
- [ ] generate_detailed_report method implemented
- [ ] Calculates all key metrics
- [ ] Shows storage savings
- [ ] Identifies optimization opportunities
- [ ] Supports multiple output formats
- [ ] Management command created
- [ ] Can filter by tenant or product
- [ ] Optional: Scheduled periodic reports
- [ ] Optional: Email delivery
- [ ] Reports are clear and actionable

---

## Task 64: Create Cache Headers Utility

### Overview
Create a utility to set appropriate HTTP cache headers for image responses, enabling effective browser and CDN caching to reduce server load and improve performance.

### Dependencies
- Task 58: Create image CDN URL generation

### Instructions

1. **Create cache_headers.py utility**
   - Navigate to `backend/apps/products/media/utils/`
   - Create file named `cache_headers.py`
   - Cache header generation functions

2. **Define get_image_cache_headers function**
   - Function signature: `get_image_cache_headers(image_type='original')`
   - Accept image type: 'original', 'variant', 'placeholder'
   - Return dictionary of HTTP headers

3. **Set Cache-Control headers**
   - For original images: `Cache-Control: public, max-age=31536000, immutable`
   - For variants: `Cache-Control: public, max-age=31536000, immutable`
   - For placeholders: `Cache-Control: public, max-age=31536000, immutable`
   - Long cache time because images are versioned by name/path

4. **Add Expires header**
   - Set to 1 year in future
   - Calculate: `datetime.now() + timedelta(days=365)`
   - Format as HTTP date: `Expires: Thu, 31 Dec 2026 23:59:59 GMT`
   - Legacy support for old browsers

5. **Add ETag support**
   - Generate ETag from file hash or modified time
   - Function: `generate_etag(image_path)`
   - Use MD5 hash of file or modification timestamp
   - Format: `ETag: "5d41402abc4b2a76b9719d911017c592"`

6. **Add Last-Modified header**
   - Get file modification time
   - Format as HTTP date
   - Enables conditional requests

7. **Implement conditional request handling**
   - Check If-None-Match (ETag)
   - Check If-Modified-Since (Last-Modified)
   - Return 304 Not Modified if match
   - Saves bandwidth

8. **Add Vary header**
   - Set `Vary: Accept` for WebP content negotiation
   - Tells caches to vary by Accept header
   - Important for serving different formats

9. **Configure CDN-specific headers**
   - Add `X-Accel-Expires` for nginx
   - Add `Surrogate-Control` for Fastly
   - Add `CDN-Cache-Control` for Cloudflare
   - Provider-specific caching instructions

10. **Create middleware or view mixin**
    - Apply headers to image responses automatically
    - Middleware: `ImageCacheHeadersMiddleware`
    - Or ViewMixin for class-based views
    - Ensures consistent caching

11. **Add cache invalidation helper**
    - Function: `invalidate_image_cache(image_url)`
    - When image updated, invalidate caches
    - Send purge requests to CDN
    - Clear local cache if any

### Cache Strategy by Image Type

| Image Type | Cache Duration | Immutable | Reasoning |
|-----------|----------------|-----------|-----------|
| Original | 1 year | Yes | Filename includes hash/ID |
| Variants | 1 year | Yes | Generated from original |
| Placeholder | 1 year | Yes | Never changes |
| Dynamic sizes | 1 hour | No | May be regenerated |

### HTTP Cache Headers Example

```
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000, immutable
Expires: Fri, 23 Jan 2027 00:00:00 GMT
ETag: "5d41402abc4b2a76b9719d911017c592"
Last-Modified: Thu, 23 Jan 2026 10:00:00 GMT
Vary: Accept
Content-Type: image/jpeg
```

### Conditional Request Flow

```
┌─────────────────────────┐
│ Browser Request         │
│ If-None-Match: "abc123" │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Server: Check ETag      │
└───────────┬─────────────┘
            │
            ▼
      ┌──────────┐
      │ ETag     │
      │ Matches? │
      └────┬─┬───┘
           │ │
          Yes No
           │ │
           │ └────────────┐
           │              │
           ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ 304 Not  │   │ 200 OK   │
    │ Modified │   │ + Image  │
    └──────────┘   └──────────┘
      (No body)     (Full body)
```

### Expected Outcome
```
cache_headers.py created with:
- get_image_cache_headers(image_type)
- generate_etag(image_path)
- Conditional request handling
- CDN-specific headers

Middleware or mixin:
- ImageCacheHeadersMiddleware
- Applies headers automatically

Cache invalidation:
- invalidate_image_cache(url)
```

### Verification Checklist
- [ ] cache_headers.py file created
- [ ] get_image_cache_headers function implemented
- [ ] Sets Cache-Control with long max-age
- [ ] Sets Expires header (1 year future)
- [ ] generate_etag function creates ETag
- [ ] Sets Last-Modified header
- [ ] Handles conditional requests (304)
- [ ] Sets Vary: Accept header
- [ ] CDN-specific headers included
- [ ] Middleware or mixin applies headers automatically
- [ ] Cache invalidation helper created
- [ ] Headers tested with browser dev tools
- [ ] 304 responses work correctly

---

## Summary

This document completed the optimization infrastructure:

- **Batch Optimization Command**: Management command to optimize existing images at scale with progress tracking
- **Format Migration**: Celery task and command for migrating JPEG/PNG to WebP with safety measures
- **Optimization Reports**: Comprehensive reporting on optimization status, savings, and opportunities
- **Cache Headers**: HTTP cache header utilities for optimal browser and CDN caching behavior

These tools enable administrators to maintain an optimized image system at scale with visibility into performance gains.

---

## Next Steps

Continue to [Group-E_Media-Serializers-API-Views](../Group-E_Media-Serializers-API-Views/) to implement DRF serializers and ViewSets for media management API endpoints.
