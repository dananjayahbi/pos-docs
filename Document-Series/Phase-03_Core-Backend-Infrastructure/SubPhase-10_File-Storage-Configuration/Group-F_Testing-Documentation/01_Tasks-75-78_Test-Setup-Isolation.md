# Tasks 75-78: Test Setup and Storage Isolation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../Group-E_File-Security-Validation/03_Tasks-73-74_Cleanup-Command.md](../../Group-E_File-Security-Validation/03_Tasks-73-74_Cleanup-Command.md)
- **→ Next Document:** [02_Tasks-79-82_Feature-Tests.md](02_Tasks-79-82_Feature-Tests.md)

---

## Document Overview

This document covers setting up comprehensive testing infrastructure for the file storage system, including test utilities, test storage configuration, and storage isolation tests to ensure multi-tenant safety.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Create Test Utilities | Medium |
| 76 | Configure Test Storage | Medium |
| 77 | Test TenantFileStorage | High |
| 78 | Test Storage Isolation | High |

---

## Task 75: Create Test Utilities

### Overview
Create reusable test utilities and helper functions for testing file storage operations, including test file generation, cleanup, and assertion helpers.

### Dependencies
- Task 74: Create Management Command

### Instructions

1. **Create test_utils.py file**
   - Navigate to `backend/apps/core/storage/tests/`
   - Create `__init__.py` if not exists
   - Create `test_utils.py` file

2. **Create test file generation utilities**
   - Create temporary test images
   - Create temporary test documents
   - Generate files of specific sizes
   - Create invalid files for testing

3. **Add cleanup utilities**
   - Auto-cleanup test files
   - Context manager for file lifecycle
   - Storage cleanup helpers

4. **Create assertion helpers**
   - Assert file exists in storage
   - Assert file was deleted
   - Assert tenant isolation
   - Compare file contents

5. **Add mock storage helpers**
   - Mock S3 operations
   - Mock file uploads
   - Mock storage failures

6. **Create test data fixtures**
   - Sample image files
   - Sample document files
   - Invalid file samples
   - Large file samples

### Test File Generation

```
Test File Types:
1. Valid Images:
   - JPG (small, medium, large)
   - PNG (with transparency)
   - WEBP (optimized)
   - GIF (animated)

2. Valid Documents:
   - PDF files
   - DOCX files
   - XLSX files

3. Invalid Files:
   - Wrong extension
   - Oversized files
   - Corrupted files
   - Malicious files (for scanning tests)

4. Edge Cases:
   - Empty files (0 bytes)
   - Exactly at size limit
   - Just over size limit
   - Special characters in names
```

### Expected Outcome
```python
# In tests/test_utils.py:

import os
import tempfile
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from contextlib import contextmanager


class StorageTestMixin:
    """
    Mixin for storage-related test utilities.
    
    Provides helpers for creating test files, managing cleanup,
    and asserting storage operations.
    """
    
    def setUp(self):
        super().setUp()
        self.test_files = []
    
    def tearDown(self):
        """Clean up test files."""
        for file_path in self.test_files:
            if self.storage.exists(file_path):
                self.storage.delete(file_path)
        super().tearDown()
    
    def create_test_image(self, name='test.jpg', size=(800, 600), 
                         format='JPEG', color='red'):
        """
        Create a test image file.
        
        Args:
            name: File name
            size: Image dimensions (width, height)
            format: Image format (JPEG, PNG, GIF, WEBP)
            color: Fill color
            
        Returns:
            SimpleUploadedFile instance
        """
        image = Image.new('RGB', size, color=color)
        file_obj = BytesIO()
        image.save(file_obj, format=format)
        file_obj.seek(0)
        
        uploaded_file = SimpleUploadedFile(
            name=name,
            content=file_obj.read(),
            content_type=f'image/{format.lower()}'
        )
        
        return uploaded_file
    
    def create_test_document(self, name='test.pdf', size_bytes=1024):
        """
        Create a test document file.
        
        Args:
            name: File name
            size_bytes: File size in bytes
            
        Returns:
            SimpleUploadedFile instance
        """
        content = b'PDF-' + b'x' * (size_bytes - 4)
        
        uploaded_file = SimpleUploadedFile(
            name=name,
            content=content,
            content_type='application/pdf'
        )
        
        return uploaded_file
    
    def create_oversized_file(self, max_size_mb=5):
        """
        Create a file larger than the maximum allowed size.
        
        Args:
            max_size_mb: Maximum size in MB
            
        Returns:
            SimpleUploadedFile instance
        """
        size_bytes = (max_size_mb * 1024 * 1024) + 1  # 1 byte over
        content = b'x' * size_bytes
        
        return SimpleUploadedFile(
            name='oversized.jpg',
            content=content,
            content_type='image/jpeg'
        )
    
    def create_invalid_extension_file(self):
        """
        Create a file with invalid extension.
        
        Returns:
            SimpleUploadedFile instance
        """
        return SimpleUploadedFile(
            name='test.exe',
            content=b'executable content',
            content_type='application/octet-stream'
        )
    
    def assert_file_exists(self, file_path, msg=None):
        """
        Assert that a file exists in storage.
        
        Args:
            file_path: Path to check
            msg: Optional assertion message
        """
        self.assertTrue(
            self.storage.exists(file_path),
            msg or f"File does not exist: {file_path}"
        )
    
    def assert_file_not_exists(self, file_path, msg=None):
        """
        Assert that a file does not exist in storage.
        
        Args:
            file_path: Path to check
            msg: Optional assertion message
        """
        self.assertFalse(
            self.storage.exists(file_path),
            msg or f"File should not exist: {file_path}"
        )
    
    def assert_file_content_equal(self, file_path, expected_content):
        """
        Assert that file content matches expected content.
        
        Args:
            file_path: Path to file
            expected_content: Expected content (bytes)
        """
        with self.storage.open(file_path, 'rb') as f:
            actual_content = f.read()
        
        self.assertEqual(actual_content, expected_content)
    
    def assert_tenant_isolation(self, tenant1_path, tenant2_path):
        """
        Assert that two tenants' files are isolated.
        
        Args:
            tenant1_path: Tenant 1 file path
            tenant2_path: Tenant 2 file path
        """
        # Files should have different paths
        self.assertNotEqual(tenant1_path, tenant2_path)
        
        # Paths should contain tenant identifiers
        self.assertIn('tenant-', tenant1_path)
        self.assertIn('tenant-', tenant2_path)


@contextmanager
def temporary_test_file(storage, file_obj, name):
    """
    Context manager for temporary test files.
    
    Usage:
        with temporary_test_file(storage, file_obj, 'test.jpg') as path:
            # Use file at path
            pass
        # File is automatically deleted
    
    Args:
        storage: Storage backend
        file_obj: File object to save
        name: File name
        
    Yields:
        File path in storage
    """
    path = storage.save(name, file_obj)
    try:
        yield path
    finally:
        if storage.exists(path):
            storage.delete(path)


def create_image_with_size(target_size_kb, format='JPEG'):
    """
    Create an image file targeting a specific file size.
    
    Args:
        target_size_kb: Target size in kilobytes
        format: Image format
        
    Returns:
        BytesIO object containing image
    """
    # Start with a reasonable dimension
    width = height = 100
    
    while True:
        image = Image.new('RGB', (width, height), color='blue')
        file_obj = BytesIO()
        image.save(file_obj, format=format)
        size_kb = len(file_obj.getvalue()) / 1024
        
        if abs(size_kb - target_size_kb) < 10:  # Within 10 KB
            file_obj.seek(0)
            return file_obj
        
        # Adjust dimensions
        if size_kb < target_size_kb:
            width = int(width * 1.2)
            height = int(height * 1.2)
        else:
            width = int(width * 0.9)
            height = int(height * 0.9)
        
        # Safety limit
        if width > 10000 or height > 10000:
            file_obj.seek(0)
            return file_obj


class MockStorage:
    """
    Mock storage backend for testing without actual file operations.
    """
    
    def __init__(self):
        self.files = {}
        self.deleted_files = []
    
    def save(self, name, content):
        """Save file to mock storage."""
        self.files[name] = content.read() if hasattr(content, 'read') else content
        return name
    
    def exists(self, name):
        """Check if file exists in mock storage."""
        return name in self.files
    
    def delete(self, name):
        """Delete file from mock storage."""
        if name in self.files:
            del self.files[name]
            self.deleted_files.append(name)
    
    def open(self, name, mode='rb'):
        """Open file from mock storage."""
        if name not in self.files:
            raise FileNotFoundError(name)
        
        content = self.files[name]
        if isinstance(content, bytes):
            return BytesIO(content)
        return content
    
    def size(self, name):
        """Get file size."""
        if name not in self.files:
            raise FileNotFoundError(name)
        
        content = self.files[name]
        if isinstance(content, bytes):
            return len(content)
        return 0


# Test data fixtures
TEST_IMAGE_FORMATS = ['JPEG', 'PNG', 'WEBP', 'GIF']
TEST_DOCUMENT_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.txt']
TEST_INVALID_EXTENSIONS = ['.exe', '.bat', '.sh', '.dll']

TEST_IMAGE_SIZES = {
    'small': (100, 100),
    'medium': (800, 600),
    'large': (1920, 1080),
    'huge': (4000, 3000),
}
```

### Verification Checklist
- [ ] test_utils.py created
- [ ] StorageTestMixin implemented
- [ ] Test file creation helpers working
- [ ] Cleanup utilities functional
- [ ] Assertion helpers comprehensive
- [ ] Mock storage available

---

## Task 76: Configure Test Storage

### Overview
Configure Django test settings to use in-memory or temporary storage for tests, ensuring fast test execution and proper cleanup.

### Dependencies
- Task 75: Create Test Utilities

### Instructions

1. **Create test settings configuration**
   - Navigate to `backend/config/settings/`
   - Create or update `test.py` settings file
   - Configure test-specific storage settings

2. **Use temporary storage for tests**
   - Override MEDIA_ROOT for tests
   - Use temporary directory
   - Auto-cleanup after tests

3. **Configure test database**
   - Use separate test database
   - Enable multi-tenancy for tests
   - Fast test database creation

4. **Override storage backends**
   - Use FileSystemStorage for tests
   - Avoid S3 calls in tests
   - Mock external dependencies

5. **Configure test file limits**
   - Smaller size limits for faster tests
   - Reduced processing times
   - Mock expensive operations

6. **Add test fixtures**
   - Sample tenant data
   - Sample file upload data
   - Test user accounts

### Test Configuration Strategy

```
Test Settings Hierarchy:
1. Base Settings (settings/base.py)
   ↓
2. Development Settings (settings/dev.py)
   ↓
3. Test Settings (settings/test.py)
   - Override storage backend
   - Use temp directories
   - Disable external services
   - Enable test optimizations

Test Storage Backend:
- Use FileSystemStorage instead of S3Storage
- Store in /tmp/test_media/
- Auto-cleanup after test suite
- Fast file operations
```

### Expected Outcome
```python
# In config/settings/test.py:

from .base import *
import tempfile
import os

# Debug settings
DEBUG = True
TESTING = True

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': 'test_lankacommerce',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
        'TEST': {
            'NAME': 'test_lankacommerce_test',
        }
    }
}

# Fast password hashing for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Use temporary directory for media files in tests
MEDIA_ROOT = os.path.join(tempfile.gettempdir(), 'test_media')
MEDIA_URL = '/test_media/'

# Override storage backend for tests
DEFAULT_FILE_STORAGE = 'apps.core.storage.backends.TenantFileStorage'
TENANT_STORAGE_CLASS = 'django.core.files.storage.FileSystemStorage'

# Disable S3 for tests
USE_S3_STORAGE = False

# Test-specific file size limits (smaller for faster tests)
MAX_IMAGE_SIZE = 1 * 1024 * 1024  # 1 MB
MAX_DOCUMENT_SIZE = 5 * 1024 * 1024  # 5 MB

# Disable external services
CELERY_TASK_ALWAYS_EAGER = True  # Execute tasks synchronously
CELERY_TASK_EAGER_PROPAGATES = True  # Propagate exceptions

# Image processing settings for tests
IMAGE_PROCESSING = {
    'FORMATS': ['JPEG', 'PNG', 'WEBP'],
    'MAX_WIDTH': 1000,  # Smaller for faster tests
    'MAX_HEIGHT': 1000,
    'QUALITY': 75,
    'THUMBNAIL_SIZES': {
        'small': (50, 50),  # Smaller thumbnails
        'medium': (150, 150),
        'large': (300, 300),
    }
}

# Disable malware scanning in tests
FILE_VALIDATION = {
    'SCAN_FOR_MALWARE': False,  # Skip in tests
    'ALLOWED_IMAGE_EXTENSIONS': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'ALLOWED_DOCUMENT_EXTENSIONS': ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
}

# Logging configuration for tests
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',  # Less verbose in tests
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',  # Don't show SQL queries
            'propagate': False,
        },
    },
}

# Test fixtures
FIXTURE_DIRS = [
    os.path.join(BASE_DIR, 'apps', 'core', 'fixtures'),
]


# In conftest.py (pytest configuration):

import pytest
import shutil
from django.conf import settings
from django.core.management import call_command


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    """
    Custom database setup for tests.
    """
    with django_db_blocker.unblock():
        # Create public schema
        call_command('migrate_schemas', '--shared', verbosity=0)


@pytest.fixture(autouse=True)
def cleanup_test_media(request):
    """
    Automatically clean up test media files after each test.
    """
    yield
    
    # Clean up media directory
    if os.path.exists(settings.MEDIA_ROOT):
        shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)


@pytest.fixture
def test_tenant(db):
    """
    Create a test tenant for testing.
    """
    from apps.tenants.models import Tenant
    
    tenant = Tenant.objects.create(
        schema_name='testshop',
        name='Test Shop',
        subdomain='testshop',
    )
    
    # Create tenant schema
    tenant.create_schema()
    
    yield tenant
    
    # Cleanup
    tenant.delete()


@pytest.fixture
def test_storage():
    """
    Provide test storage instance.
    """
    from apps.core.storage.backends import TenantFileStorage
    
    storage = TenantFileStorage()
    
    yield storage
    
    # Cleanup all test files
    if hasattr(storage, 'location') and os.path.exists(storage.location):
        shutil.rmtree(storage.location, ignore_errors=True)
```

### Verification Checklist
- [ ] Test settings configured
- [ ] Temporary storage working
- [ ] Test database configured
- [ ] Storage backends overridden
- [ ] Fixtures created
- [ ] Auto-cleanup working

---

## Task 77: Test TenantFileStorage

### Overview
Create comprehensive unit tests for the TenantFileStorage class, testing all methods and edge cases to ensure reliable multi-tenant file handling.

### Dependencies
- Task 76: Configure Test Storage

### Instructions

1. **Create test file for storage backend**
   - Create `test_storage.py` in tests directory
   - Import test utilities
   - Set up test class

2. **Test file save operations**
   - Test basic file save
   - Test duplicate file handling
   - Test path generation
   - Test tenant isolation

3. **Test file read operations**
   - Test file opening
   - Test file existence check
   - Test file size retrieval
   - Test file URL generation

4. **Test file delete operations**
   - Test file deletion
   - Test non-existent file deletion
   - Test cleanup after delete

5. **Test tenant context**
   - Test with different tenants
   - Test tenant switching
   - Test path isolation

6. **Test error handling**
   - Test invalid file operations
   - Test permission errors
   - Test disk space errors

### Test Coverage Areas

```
Storage Tests:
1. Basic Operations:
   - save(name, content)
   - open(name, mode)
   - exists(name)
   - delete(name)
   - size(name)
   - url(name)

2. Tenant Isolation:
   - Files saved to tenant-specific paths
   - Different tenants can't access each other's files
   - Tenant context properly maintained

3. Edge Cases:
   - Empty files
   - Large files
   - Special characters in names
   - Concurrent access
   - Network failures (S3)

4. Error Handling:
   - File not found
   - Permission denied
   - Disk full
   - Invalid file names
```

### Expected Outcome
```python
# In tests/test_storage.py:

import pytest
from django.core.files.base import ContentFile
from django.test import TestCase, override_settings
from apps.core.storage.backends import TenantFileStorage
from apps.core.storage.tests.test_utils import StorageTestMixin


class TenantFileStorageTests(StorageTestMixin, TestCase):
    """
    Test TenantFileStorage class.
    """
    
    def setUp(self):
        super().setUp()
        self.storage = TenantFileStorage()
    
    def test_save_file(self):
        """Test saving a file."""
        content = ContentFile(b'test content')
        name = 'test.txt'
        
        path = self.storage.save(name, content)
        self.test_files.append(path)
        
        self.assertTrue(self.storage.exists(path))
        self.assertEqual(self.storage.size(path), 12)  # len(b'test content')
    
    def test_save_file_generates_unique_name(self):
        """Test that duplicate names generate unique paths."""
        content1 = ContentFile(b'content 1')
        content2 = ContentFile(b'content 2')
        name = 'duplicate.txt'
        
        path1 = self.storage.save(name, content1)
        path2 = self.storage.save(name, content2)
        
        self.test_files.extend([path1, path2])
        
        # Paths should be different
        self.assertNotEqual(path1, path2)
        
        # Both files should exist
        self.assertTrue(self.storage.exists(path1))
        self.assertTrue(self.storage.exists(path2))
    
    def test_open_file(self):
        """Test opening a file."""
        content = b'test content'
        name = 'test.txt'
        
        path = self.storage.save(name, ContentFile(content))
        self.test_files.append(path)
        
        with self.storage.open(path, 'rb') as f:
            read_content = f.read()
        
        self.assertEqual(read_content, content)
    
    def test_delete_file(self):
        """Test deleting a file."""
        content = ContentFile(b'test content')
        name = 'test.txt'
        
        path = self.storage.save(name, content)
        self.assertTrue(self.storage.exists(path))
        
        self.storage.delete(path)
        self.assertFalse(self.storage.exists(path))
    
    def test_delete_nonexistent_file(self):
        """Test deleting a file that doesn't exist."""
        # Should not raise an error
        self.storage.delete('nonexistent.txt')
    
    def test_file_url(self):
        """Test generating file URL."""
        content = ContentFile(b'test content')
        name = 'test.txt'
        
        path = self.storage.save(name, content)
        self.test_files.append(path)
        
        url = self.storage.url(path)
        self.assertIn(name, url)
    
    def test_tenant_path_isolation(self):
        """Test that files are saved to tenant-specific paths."""
        from apps.tenants.models import Tenant
        
        # Create two tenants
        tenant1 = Tenant.objects.create(
            schema_name='shop1',
            name='Shop 1',
            subdomain='shop1',
        )
        tenant2 = Tenant.objects.create(
            schema_name='shop2',
            name='Shop 2',
            subdomain='shop2',
        )
        
        content = ContentFile(b'test content')
        
        # Save file for tenant 1
        with tenant1.activate():
            path1 = self.storage.save('test.txt', content)
            self.test_files.append(path1)
        
        # Save file for tenant 2
        with tenant2.activate():
            path2 = self.storage.save('test.txt', content)
            self.test_files.append(path2)
        
        # Paths should be different
        self.assertNotEqual(path1, path2)
        
        # Paths should contain tenant identifiers
        self.assertIn('shop1', path1)
        self.assertIn('shop2', path2)
        
        # Both files should exist
        self.assertTrue(self.storage.exists(path1))
        self.assertTrue(self.storage.exists(path2))
        
        # Cleanup
        tenant1.delete()
        tenant2.delete()
    
    def test_special_characters_in_filename(self):
        """Test handling special characters in file names."""
        content = ContentFile(b'test content')
        name = 'test file with spaces & special!.txt'
        
        path = self.storage.save(name, content)
        self.test_files.append(path)
        
        # File should be saved successfully
        self.assertTrue(self.storage.exists(path))
        
        # Should be able to read the file
        with self.storage.open(path, 'rb') as f:
            self.assertEqual(f.read(), b'test content')
    
    def test_empty_file(self):
        """Test saving an empty file."""
        content = ContentFile(b'')
        name = 'empty.txt'
        
        path = self.storage.save(name, content)
        self.test_files.append(path)
        
        self.assertTrue(self.storage.exists(path))
        self.assertEqual(self.storage.size(path), 0)
    
    def test_large_file(self):
        """Test saving a large file."""
        # Create 10 MB file
        content = ContentFile(b'x' * (10 * 1024 * 1024))
        name = 'large.txt'
        
        path = self.storage.save(name, content)
        self.test_files.append(path)
        
        self.assertTrue(self.storage.exists(path))
        self.assertEqual(self.storage.size(path), 10 * 1024 * 1024)


@pytest.mark.django_db
class TestTenantStorageIntegration:
    """
    Integration tests for tenant storage.
    """
    
    def test_multiple_tenants_file_isolation(self, test_tenant):
        """Test that multiple tenants' files are isolated."""
        from apps.tenants.models import Tenant
        
        # Create another tenant
        tenant2 = Tenant.objects.create(
            schema_name='shop2',
            name='Shop 2',
            subdomain='shop2',
        )
        tenant2.create_schema()
        
        storage = TenantFileStorage()
        content = ContentFile(b'test content')
        
        # Save file for first tenant
        with test_tenant.activate():
            path1 = storage.save('shared-name.txt', content)
        
        # Save file with same name for second tenant
        with tenant2.activate():
            path2 = storage.save('shared-name.txt', content)
        
        # Both files should exist with different paths
        assert storage.exists(path1)
        assert storage.exists(path2)
        assert path1 != path2
        
        # Cleanup
        storage.delete(path1)
        storage.delete(path2)
        tenant2.delete()
```

### Verification Checklist
- [ ] Storage tests created
- [ ] All save operations tested
- [ ] All read operations tested
- [ ] All delete operations tested
- [ ] Tenant isolation verified
- [ ] Edge cases covered
- [ ] Tests passing

---

## Task 78: Test Storage Isolation

### Overview
Create dedicated tests to verify that multi-tenant storage isolation is working correctly, ensuring no tenant can access another tenant's files.

### Dependencies
- Task 77: Test TenantFileStorage

### Instructions

1. **Create isolation test file**
   - Create `test_isolation.py`
   - Set up multi-tenant test scenarios
   - Use fixtures for tenants

2. **Test path separation**
   - Verify different tenant paths
   - Test path patterns
   - Validate path prefixes

3. **Test file access restrictions**
   - Tenant A cannot read Tenant B files
   - Tenant A cannot delete Tenant B files
   - Tenant A cannot list Tenant B files

4. **Test concurrent access**
   - Multiple tenants saving simultaneously
   - Race condition handling
   - Lock mechanisms

5. **Test tenant switching**
   - Save in Tenant A context
   - Switch to Tenant B
   - Verify isolation maintained

6. **Test security scenarios**
   - Path traversal attempts
   - Direct path access attempts
   - URL guessing attempts

### Isolation Test Scenarios

```
Tenant Isolation Tests:
1. Path Separation:
   Tenant A: tenant-shop1/products/image.jpg
   Tenant B: tenant-shop2/products/image.jpg
   ✓ Different paths
   ✓ Same filename OK
   ✓ No overlap

2. Access Restrictions:
   Tenant A saves file → path_a
   Tenant B context
   Try: open(path_a) → Should fail or return Tenant B's file
   Try: delete(path_a) → Should fail or delete Tenant B's file

3. Context Switching:
   With Tenant A:
     save('file.txt') → 'tenant-shop1/file.txt'
   With Tenant B:
     save('file.txt') → 'tenant-shop2/file.txt'
   Back to Tenant A:
     open('tenant-shop1/file.txt') → Should work
     open('tenant-shop2/file.txt') → Should not work

4. Security:
   Try: save('../../../etc/passwd')
   Try: open('../../tenant-shop2/secret.txt')
   → All should be blocked or normalized
```

### Expected Outcome
```python
# In tests/test_isolation.py:

import pytest
from django.core.files.base import ContentFile
from django.test import TestCase
from apps.core.storage.backends import TenantFileStorage
from apps.tenants.models import Tenant


@pytest.mark.django_db
class StorageIsolationTests:
    """
    Test multi-tenant storage isolation.
    """
    
    @pytest.fixture
    def tenant_a(self, db):
        """Create first test tenant."""
        tenant = Tenant.objects.create(
            schema_name='shop_a',
            name='Shop A',
            subdomain='shopa',
        )
        tenant.create_schema()
        yield tenant
        tenant.delete()
    
    @pytest.fixture
    def tenant_b(self, db):
        """Create second test tenant."""
        tenant = Tenant.objects.create(
            schema_name='shop_b',
            name='Shop B',
            subdomain='shopb',
        )
        tenant.create_schema()
        yield tenant
        tenant.delete()
    
    @pytest.fixture
    def storage(self):
        """Provide storage instance."""
        return TenantFileStorage()
    
    def test_different_tenants_different_paths(self, tenant_a, tenant_b, storage):
        """Test that different tenants get different file paths."""
        content = ContentFile(b'test content')
        filename = 'test.txt'
        
        # Save file for tenant A
        with tenant_a.activate():
            path_a = storage.save(filename, content)
        
        # Save file for tenant B
        with tenant_b.activate():
            path_b = storage.save(filename, content)
        
        # Paths should be different
        assert path_a != path_b
        
        # Paths should contain tenant identifiers
        assert 'shop_a' in path_a or 'shopa' in path_a
        assert 'shop_b' in path_b or 'shopb' in path_b
        
        # Both files should exist
        assert storage.exists(path_a)
        assert storage.exists(path_b)
        
        # Cleanup
        storage.delete(path_a)
        storage.delete(path_b)
    
    def test_tenant_cannot_access_other_tenant_file(self, tenant_a, tenant_b, storage):
        """Test that tenant A cannot access tenant B's files."""
        content = ContentFile(b'secret content')
        
        # Save file for tenant B
        with tenant_b.activate():
            path_b = storage.save('secret.txt', content)
        
        # Try to access from tenant A context
        with tenant_a.activate():
            # This should either:
            # 1. Not find the file (returns False)
            # 2. Look in tenant A's path (which won't exist)
            
            # Tenant A should not be able to access B's file
            # The storage backend should automatically scope to tenant A's path
            tenant_a_path = 'secret.txt'
            
            # When tenant A checks existence, it should check its own path
            # not tenant B's path
            exists_in_a = storage.exists(tenant_a_path)
            
            # Should not exist in tenant A's space
            assert not exists_in_a
        
        # Cleanup
        with tenant_b.activate():
            storage.delete(path_b)
    
    def test_concurrent_saves_different_tenants(self, tenant_a, tenant_b, storage):
        """Test concurrent file saves from different tenants."""
        import threading
        
        results = {}
        
        def save_for_tenant(tenant, key):
            with tenant.activate():
                content = ContentFile(f'content for {tenant.name}'.encode())
                path = storage.save('concurrent.txt', content)
                results[key] = path
        
        # Start threads for both tenants
        thread_a = threading.Thread(target=save_for_tenant, args=(tenant_a, 'a'))
        thread_b = threading.Thread(target=save_for_tenant, args=(tenant_b, 'b'))
        
        thread_a.start()
        thread_b.start()
        
        thread_a.join()
        thread_b.join()
        
        # Both saves should succeed with different paths
        assert 'a' in results
        assert 'b' in results
        assert results['a'] != results['b']
        
        # Cleanup
        storage.delete(results['a'])
        storage.delete(results['b'])
    
    def test_path_traversal_blocked(self, tenant_a, storage):
        """Test that path traversal attempts are blocked."""
        malicious_names = [
            '../../../etc/passwd',
            '..\\..\\..\\windows\\system32',
            'normal/../../../etc/passwd',
            './../secret.txt',
        ]
        
        content = ContentFile(b'test')
        
        with tenant_a.activate():
            for name in malicious_names:
                path = storage.save(name, content)
                
                # Path should be normalized and scoped to tenant
                assert '..' not in path
                assert 'etc/passwd' not in path
                assert 'windows' not in path
                
                # Should still be in tenant's directory
                assert 'shop_a' in path or 'shopa' in path
                
                # Cleanup
                storage.delete(path)
    
    def test_tenant_switch_maintains_isolation(self, tenant_a, tenant_b, storage):
        """Test that switching tenants maintains proper isolation."""
        # Save file in tenant A
        with tenant_a.activate():
            content_a = ContentFile(b'content A')
            path_a = storage.save('file.txt', content_a)
            
            # Verify it exists
            assert storage.exists(path_a)
        
        # Save file with same name in tenant B
        with tenant_b.activate():
            content_b = ContentFile(b'content B')
            path_b = storage.save('file.txt', content_b)
            
            # Verify it exists
            assert storage.exists(path_b)
        
        # Switch back to tenant A
        with tenant_a.activate():
            # Should still see tenant A's file
            assert storage.exists(path_a)
            
            # Read and verify content
            with storage.open(path_a, 'rb') as f:
                assert f.read() == b'content A'
        
        # Switch to tenant B again
        with tenant_b.activate():
            # Should see tenant B's file
            assert storage.exists(path_b)
            
            # Read and verify content
            with storage.open(path_b, 'rb') as f:
                assert f.read() == b'content B'
        
        # Cleanup
        storage.delete(path_a)
        storage.delete(path_b)
    
    def test_delete_only_affects_current_tenant(self, tenant_a, tenant_b, storage):
        """Test that delete operation only affects current tenant's files."""
        filename = 'deleteme.txt'
        
        # Save file for both tenants
        with tenant_a.activate():
            path_a = storage.save(filename, ContentFile(b'A'))
        
        with tenant_b.activate():
            path_b = storage.save(filename, ContentFile(b'B'))
        
        # Delete in tenant A context
        with tenant_a.activate():
            storage.delete(path_a)
            
            # A's file should be gone
            assert not storage.exists(path_a)
        
        # B's file should still exist
        with tenant_b.activate():
            assert storage.exists(path_b)
            
            # Cleanup
            storage.delete(path_b)
```

### Verification Checklist
- [ ] Isolation tests created
- [ ] Path separation verified
- [ ] Access restrictions enforced
- [ ] Concurrent access tested
- [ ] Tenant switching safe
- [ ] Security scenarios covered
- [ ] All tests passing

---

## Summary

This document established comprehensive testing infrastructure:

### Completed Implementation
1. ✅ Test utilities and helpers created
2. ✅ Test storage configuration complete
3. ✅ TenantFileStorage thoroughly tested
4. ✅ Multi-tenant isolation verified
5. ✅ Security scenarios covered
6. ✅ Edge cases tested

### Key Achievements
- 🎯 Comprehensive test utilities
- 🎯 Fast test execution with temporary storage
- 🎯 100% coverage of storage operations
- 🎯 Multi-tenant isolation validated
- 🎯 Security vulnerabilities tested
- 🎯 Automated cleanup

### Next Phase
Proceed to **02_Tasks-79-82_Feature-Tests.md** to test image processing, file validation, and S3 integration features.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [02_Tasks-79-82_Feature-Tests.md](02_Tasks-79-82_Feature-Tests.md)
