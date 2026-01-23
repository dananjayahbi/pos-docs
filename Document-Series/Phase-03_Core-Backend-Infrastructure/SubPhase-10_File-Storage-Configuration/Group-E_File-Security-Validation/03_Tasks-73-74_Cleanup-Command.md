# Tasks 73-74: Cleanup Command and File Management

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** E - File Security & Validation  
> **Document:** 03 of 03  
> **Tasks Covered:** 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-67-72_Extension-Size-Config.md](02_Tasks-67-72_Extension-Size-Config.md)
- **→ Next Document:** [../../Group-F_Testing-Documentation/01_Tasks-75-78_Test-Setup-Isolation.md](../../Group-F_Testing-Documentation/01_Tasks-75-78_Test-Setup-Isolation.md)

---

## Document Overview

This document covers the creation of file cleanup utilities and a Django management command for removing orphaned files. This maintains a clean storage system and prevents accumulation of unused files.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 73 | Create File Cleanup Utility | Medium |
| 74 | Create Management Command | Medium |

---

## Task 73: Create File Cleanup Utility

### Overview
Create a utility module for identifying and cleaning up orphaned files—files that exist in storage but are no longer referenced by any database records.

### Dependencies
- Task 72: Define MAX_DOCUMENT_SIZE

### Instructions

1. **Create cleanup.py utilities file**
   - Navigate to `backend/apps/core/storage/`
   - Create new file named `cleanup.py`
   - Add module docstring

2. **Import required dependencies**
   - Import Django ORM
   - Import storage backends
   - Import file system utilities
   - Import logging

3. **Create find_orphaned_files function**
   - Scan storage for all files
   - Compare with database references
   - Identify unreferenced files
   - Return list of orphaned files

4. **Create delete_orphaned_files function**
   - Accept list of orphaned files
   - Delete from storage
   - Log deletion actions
   - Return deletion report

5. **Add dry-run mode**
   - Preview what would be deleted
   - Don't actually delete files
   - Generate report

6. **Implement safety checks**
   - Minimum file age before deletion
   - Exclude recently uploaded files
   - Backup critical files
   - Confirm before bulk delete

### Orphaned Files Scenario

```
Orphaned Files Examples:
1. User uploads image
2. User deletes product before saving
3. Image file remains in storage
   → Orphaned file

1. Product image updated
2. Old image not deleted
3. Old image remains in storage
   → Orphaned file

1. Failed upload leaves temp file
2. Upload never completes
3. Temp file remains
   → Orphaned file
```

### Cleanup Strategy

```
Cleanup Flow:
1. Scan all files in storage
2. Build list of file paths
3. Query database for referenced files
4. Compare lists
5. Identify orphaned files (in storage, not in DB)
6. Filter by age (> 7 days old)
7. Delete orphaned files
8. Generate report
```

### Expected Outcome
```python
# In cleanup.py:

import os
from datetime import datetime, timedelta
from django.apps import apps
from django.db import models
from apps.core.storage.backends import get_storage_class
import logging

logger = logging.getLogger(__name__)


class FileCleanup:
    """
    Utility for cleaning up orphaned files in storage.
    
    Orphaned files are files that exist in storage but are no longer
    referenced by any database records. These can accumulate over time
    from failed uploads, deleted records, or application errors.
    """
    
    def __init__(self, storage=None, dry_run=True):
        """
        Initialize FileCleanup utility.
        
        Args:
            storage: Storage backend to use (default: get_storage_class())
            dry_run: If True, don't actually delete files (default: True)
        """
        self.storage = storage or get_storage_class()()
        self.dry_run = dry_run
        self.orphaned_files = []
        self.deleted_count = 0
        self.skipped_count = 0
        self.error_count = 0
    
    def find_orphaned_files(self, path='', min_age_days=7):
        """
        Find files in storage that are not referenced in database.
        
        Args:
            path: Storage path to scan (empty = root)
            min_age_days: Minimum age in days before considering orphaned
            
        Returns:
            List of orphaned file paths
        """
        logger.info(f"Scanning for orphaned files in: {path or 'root'}")
        
        # Get all files in storage
        storage_files = set()
        try:
            dirs, files = self.storage.listdir(path)
            
            for file_name in files:
                file_path = os.path.join(path, file_name) if path else file_name
                
                # Check file age
                try:
                    modified_time = self.storage.get_modified_time(file_path)
                    age = datetime.now() - modified_time
                    
                    if age.days >= min_age_days:
                        storage_files.add(file_path)
                    else:
                        logger.debug(f"Skipping recent file: {file_path}")
                
                except Exception as e:
                    logger.warning(f"Error checking file age: {file_path}, {e}")
                    storage_files.add(file_path)
            
            # Recursively scan subdirectories
            for dir_name in dirs:
                subpath = os.path.join(path, dir_name) if path else dir_name
                storage_files.update(
                    self.find_orphaned_files(subpath, min_age_days)
                )
        
        except Exception as e:
            logger.error(f"Error listing directory {path}: {e}")
            return set()
        
        # Get all referenced files from database
        referenced_files = self.get_referenced_files()
        
        # Find orphaned files (in storage but not in database)
        orphaned = storage_files - referenced_files
        
        logger.info(
            f"Found {len(storage_files)} files in storage, "
            f"{len(referenced_files)} referenced, "
            f"{len(orphaned)} orphaned"
        )
        
        return list(orphaned)
    
    def get_referenced_files(self):
        """
        Get all file paths referenced in database.
        
        Returns:
            Set of file paths referenced in FileField/ImageField
        """
        referenced_files = set()
        
        # Get all models with FileField or ImageField
        for model in apps.get_models():
            file_fields = [
                field for field in model._meta.get_fields()
                if isinstance(field, (models.FileField, models.ImageField))
            ]
            
            if not file_fields:
                continue
            
            # Query all instances
            for instance in model.objects.all():
                for field in file_fields:
                    file_field = getattr(instance, field.name)
                    
                    if file_field and file_field.name:
                        referenced_files.add(file_field.name)
        
        return referenced_files
    
    def delete_orphaned_files(self, orphaned_files=None):
        """
        Delete orphaned files from storage.
        
        Args:
            orphaned_files: List of file paths to delete (None = use found)
            
        Returns:
            Dictionary with deletion statistics
        """
        if orphaned_files is None:
            orphaned_files = self.orphaned_files
        
        if not orphaned_files:
            logger.info("No orphaned files to delete")
            return {
                'deleted': 0,
                'skipped': 0,
                'errors': 0,
                'total_size_freed': 0
            }
        
        total_size = 0
        
        for file_path in orphaned_files:
            try:
                # Get file size before deletion
                try:
                    file_size = self.storage.size(file_path)
                    total_size += file_size
                except:
                    file_size = 0
                
                if self.dry_run:
                    logger.info(f"[DRY RUN] Would delete: {file_path} ({file_size} bytes)")
                    self.skipped_count += 1
                else:
                    self.storage.delete(file_path)
                    logger.info(f"Deleted: {file_path} ({file_size} bytes)")
                    self.deleted_count += 1
            
            except Exception as e:
                logger.error(f"Error deleting {file_path}: {e}")
                self.error_count += 1
        
        result = {
            'deleted': self.deleted_count,
            'skipped': self.skipped_count,
            'errors': self.error_count,
            'total_size_freed': total_size
        }
        
        logger.info(
            f"Cleanup complete: {result['deleted']} deleted, "
            f"{result['skipped']} skipped, {result['errors']} errors, "
            f"{result['total_size_freed']} bytes freed"
        )
        
        return result
    
    def cleanup(self, path='', min_age_days=7):
        """
        Find and delete orphaned files.
        
        Args:
            path: Storage path to scan
            min_age_days: Minimum age in days
            
        Returns:
            Dictionary with cleanup statistics
        """
        self.orphaned_files = self.find_orphaned_files(path, min_age_days)
        return self.delete_orphaned_files()


def cleanup_old_files(days_old=30, dry_run=True):
    """
    Clean up files older than specified days.
    
    Args:
        days_old: Delete files older than this many days
        dry_run: If True, don't actually delete
        
    Returns:
        Deletion statistics
    """
    cleanup = FileCleanup(dry_run=dry_run)
    return cleanup.cleanup(min_age_days=days_old)
```

### Verification Checklist
- [ ] cleanup.py file created
- [ ] FileCleanup class implemented
- [ ] find_orphaned_files method working
- [ ] delete_orphaned_files method working
- [ ] Dry-run mode functional
- [ ] Safety checks implemented

---

## Task 74: Create Management Command

### Overview
Create a Django management command that wraps the cleanup utilities, making it easy to run cleanup operations from the command line or scheduled tasks.

### Dependencies
- Task 73: Create File Cleanup Utility

### Instructions

1. **Create management command structure**
   - Navigate to `backend/apps/core/management/commands/`
   - Create `cleanmedia.py` file
   - Follow Django command structure

2. **Define command class**
   - Inherit from BaseCommand
   - Add help text
   - Define command arguments

3. **Add command arguments**
   - --dry-run flag (default True)
   - --path argument
   - --min-age-days argument
   - --force flag

4. **Implement handle method**
   - Parse arguments
   - Call cleanup utilities
   - Display results
   - Handle errors gracefully

5. **Add progress output**
   - Show scanning progress
   - Display found files
   - Confirm before deletion
   - Show final statistics

6. **Add safety confirmations**
   - Require --force for actual deletion
   - Show preview before deleting
   - Confirm for large batches
   - Prevent accidental data loss

### Command Structure

```
Management Command:
python manage.py cleanmedia [options]

Options:
  --dry-run          Preview without deleting (default)
  --force            Actually delete files
  --path PATH        Scan specific path
  --min-age-days N   Minimum age in days (default: 7)
  --tenant SCHEMA    Clean specific tenant only
```

### Expected Outcome
```python
# In management/commands/cleanmedia.py:

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from apps.core.storage.cleanup import FileCleanup, cleanup_old_files
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """
    Clean up orphaned media files.
    
    This command finds and deletes files in storage that are no longer
    referenced by any database records. Use with caution!
    
    Examples:
        # Preview orphaned files (dry run)
        python manage.py cleanmedia
        
        # Actually delete orphaned files
        python manage.py cleanmedia --force
        
        # Delete files older than 30 days
        python manage.py cleanmedia --force --min-age-days 30
        
        # Clean specific path
        python manage.py cleanmedia --force --path tenant-shop123/
    """
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            default=True,
            help='Preview files without deleting (default)',
        )
        
        parser.add_argument(
            '--force',
            action='store_true',
            default=False,
            help='Actually delete orphaned files (disables dry-run)',
        )
        
        parser.add_argument(
            '--path',
            type=str,
            default='',
            help='Storage path to clean (default: root)',
        )
        
        parser.add_argument(
            '--min-age-days',
            type=int,
            default=7,
            help='Minimum file age in days (default: 7)',
        )
        
        parser.add_argument(
            '--tenant',
            type=str,
            default='',
            help='Clean specific tenant only (tenant schema name)',
        )
    
    def handle(self, *args, **options):
        # Determine if this is a dry run
        dry_run = not options['force']
        path = options['path']
        min_age_days = options['min_age_days']
        tenant = options['tenant']
        
        # Build path if tenant specified
        if tenant:
            path = f"tenant-{tenant}/"
        
        # Display mode
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    '\n=== DRY RUN MODE ===\n'
                    'No files will be deleted. Use --force to actually delete files.\n'
                )
            )
        else:
            self.stdout.write(
                self.style.ERROR(
                    '\n=== LIVE MODE ===\n'
                    'Files will be PERMANENTLY DELETED!\n'
                )
            )
        
        # Display settings
        self.stdout.write(f"Path: {path or '(root)'}")
        self.stdout.write(f"Minimum age: {min_age_days} days")
        self.stdout.write("")
        
        # Confirm if not dry run
        if not dry_run:
            confirm = input('Are you sure you want to delete files? Type "yes" to confirm: ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Operation cancelled'))
                return
        
        try:
            # Create cleanup instance
            cleanup = FileCleanup(dry_run=dry_run)
            
            # Find orphaned files
            self.stdout.write("Scanning for orphaned files...")
            orphaned_files = cleanup.find_orphaned_files(path, min_age_days)
            
            if not orphaned_files:
                self.stdout.write(
                    self.style.SUCCESS('\nNo orphaned files found!')
                )
                return
            
            # Display found files
            self.stdout.write(
                self.style.WARNING(
                    f'\nFound {len(orphaned_files)} orphaned files:'
                )
            )
            
            # Show first 10 files as preview
            for file_path in orphaned_files[:10]:
                try:
                    size = cleanup.storage.size(file_path)
                    size_kb = size / 1024
                    self.stdout.write(f"  - {file_path} ({size_kb:.2f} KB)")
                except:
                    self.stdout.write(f"  - {file_path}")
            
            if len(orphaned_files) > 10:
                self.stdout.write(f"  ... and {len(orphaned_files) - 10} more")
            
            self.stdout.write("")
            
            # Delete files
            if dry_run:
                self.stdout.write(
                    self.style.WARNING(
                        'Dry run complete. Use --force to delete these files.'
                    )
                )
            else:
                self.stdout.write("Deleting orphaned files...")
                result = cleanup.delete_orphaned_files(orphaned_files)
                
                # Display results
                self.stdout.write("")
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Cleanup complete!\n"
                        f"  Deleted: {result['deleted']}\n"
                        f"  Skipped: {result['skipped']}\n"
                        f"  Errors: {result['errors']}\n"
                        f"  Space freed: {result['total_size_freed'] / (1024 * 1024):.2f} MB"
                    )
                )
        
        except Exception as e:
            logger.error(f"Error during cleanup: {e}", exc_info=True)
            raise CommandError(f"Cleanup failed: {e}")
```

### Usage Examples

```bash
# Preview orphaned files (safe)
python manage.py cleanmedia

# Preview with custom age threshold
python manage.py cleanmedia --min-age-days 30

# Preview specific tenant
python manage.py cleanmedia --tenant shop123

# Actually delete files (requires confirmation)
python manage.py cleanmedia --force

# Delete files older than 30 days
python manage.py cleanmedia --force --min-age-days 30

# Clean specific path
python manage.py cleanmedia --force --path tenant-shop123/products/
```

### Scheduled Cleanup

```python
# In celery beat schedule:
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'cleanup-orphaned-files': {
        'task': 'apps.core.tasks.cleanup_orphaned_files',
        'schedule': crontab(hour=3, minute=0, day_of_week=1),  # Monday 3 AM
    },
}

# In tasks.py:
@shared_task
def cleanup_orphaned_files():
    """
    Scheduled task to clean up orphaned files.
    """
    from django.core.management import call_command
    
    call_command('cleanmedia', force=True, min_age_days=30)
```

### Verification Checklist
- [ ] cleanmedia command created
- [ ] Command arguments defined
- [ ] Dry-run mode working
- [ ] Force mode requires confirmation
- [ ] Progress output clear
- [ ] Error handling comprehensive
- [ ] Can be scheduled via Celery

---

## Summary

This document completed file cleanup utilities and management:

### Completed Implementation
1. ✅ File cleanup utility created
2. ✅ Orphaned file detection implemented
3. ✅ Safe deletion with dry-run mode
4. ✅ Django management command created
5. ✅ Comprehensive error handling
6. ✅ Scheduling support for automated cleanup

### Key Achievements
- 🎯 Prevents storage bloat
- 🎯 Safe cleanup with dry-run preview
- 🎯 Comprehensive orphaned file detection
- 🎯 Easy command-line interface
- 🎯 Scheduled cleanup support
- 🎯 Detailed logging and reporting

### Next Phase
Proceed to **Group F: Testing & Documentation** to create comprehensive tests and documentation for the file storage system.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Group:** [Group-F_Testing-Documentation](../../Group-F_Testing-Documentation/)
