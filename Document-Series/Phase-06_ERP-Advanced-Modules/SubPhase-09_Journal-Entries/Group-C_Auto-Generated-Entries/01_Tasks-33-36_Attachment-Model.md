# Tasks 33-36: JournalEntryAttachment Model & File Handling

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** C - Auto-Generated Entries  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous:** [../Group-B_Double-Entry-Validation/02_Tasks-27-32_Double-Entry-Validators.md](../Group-B_Double-Entry-Validation/02_Tasks-27-32_Double-Entry-Validators.md)
- **→ Next Document:** [02_Tasks-37-41_JournalEntry-Service.md](02_Tasks-37-41_JournalEntry-Service.md)

---

## Document Overview

This document implements the file attachment system for journal entries, allowing users to attach supporting documents such as receipts, invoices, bank statements, contracts, and other financial documentation to journal entries. The system integrates with S3-compatible storage for scalable, secure file management with comprehensive metadata tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time | Dependencies |
|--------|-----------|------------|-----------|--------------|
| 33 | Create JournalEntryAttachment Model | Medium | 25 min | Task 32 |
| 34 | Add Attachment File Field | Low | 15 min | Task 33 |
| 35 | Add Attachment Metadata | Low | 20 min | Task 33 |
| 36 | Run Attachment Migrations | Low | 10 min | Task 35 |

---

## Task 33: Create JournalEntryAttachment Model

### Overview
Create the JournalEntryAttachment model to serve as the foundation for attaching files to journal entries. This model establishes the relationship between journal entries and their supporting documents, enabling proper audit trails, compliance documentation, and reference materials for accounting entries.

### Dependencies
- Task 32: JournalEntry model core fields exist
- Django file storage configured (S3 or compatible)
- BaseModel available for tenant isolation
- Multi-tenancy infrastructure operational

### Instructions

1. **Create attachment model file**
   - Navigate to `apps/journal_entries/models/` directory
   - Create new file named `journal_entry_attachment.py`
   - Add module docstring explaining attachment purpose
   - Import necessary Django modules and BaseModel

2. **Define JournalEntryAttachment model class**
   - Extend `BaseModel` for tenant isolation
   - Add comprehensive class docstring
   - Explain relationship to JournalEntry
   - Document file storage approach

3. **Add journal_entry foreign key**
   - Type: `ForeignKey` to JournalEntry model
   - Related name: `'attachments'`
   - On delete: `CASCADE` (delete attachments when entry deleted)
   - Required field (no null)
   - Purpose: Links attachment to specific journal entry
   - Indexed for query performance

4. **Configure cascade deletion behavior**
   - CASCADE ensures attachment cleanup when journal entry deleted
   - Prevents orphaned files in storage
   - Maintains data integrity
   - Consider soft delete alternatives for audit requirements

5. **Add model Meta class**
   - Set `db_table = 'journal_entry_attachments'`
   - Set `verbose_name = 'Journal Entry Attachment'`
   - Set `verbose_name_plural = 'Journal Entry Attachments'`
   - Set `ordering = ['-uploaded_at']` (newest first)
   - Add index on `journal_entry_id`

6. **Import and register in models init**
   - Import JournalEntryAttachment in `models/__init__.py`
   - Expose for use across application
   - Ensure proper model discovery

### Model Structure (Basic)

```
JournalEntryAttachment Model (Foundation)
├── id                    [UUID, PK, auto]
├── tenant                [FK to Tenant, inherited from BaseModel]
├── journal_entry         [FK to JournalEntry, CASCADE, indexed]
├── created_at            [DateTimeField, auto_now_add]
└── updated_at            [DateTimeField, auto_now]
```

### Foreign Key Specification

| Field | Target Model | Related Name | On Delete | Nullable | Purpose |
|-------|--------------|--------------|-----------|----------|---------|
| journal_entry | JournalEntry | attachments | CASCADE | No | Links to journal entry |

### CASCADE Deletion Rationale

**Why CASCADE:**
- Attachments are dependent on journal entry existence
- No business value for orphaned attachments
- Simplifies cleanup when entries are deleted
- Reduces storage costs from abandoned files

**Alternative Approaches:**
- SOFT DELETE: Flag as deleted but retain in database
- PROTECT: Prevent journal entry deletion if attachments exist
- SET_NULL: Not applicable (attachment must have entry)

**Chosen: CASCADE** because:
- Attachments are supporting documents, not primary records
- Journal entry deletion is rare (usually corrections, not deletions)
- Audit trail maintained at journal entry level
- Storage cleanup automated

### Reverse Relationship Usage

**From JournalEntry:**
```
# Get all attachments for entry
entry.attachments.all()

# Count attachments
entry.attachments.count()

# Check if has attachments
entry.attachments.exists()

# Get specific file types
entry.attachments.filter(
    original_filename__endswith='.pdf'
)
```

### Expected Outcome
- JournalEntryAttachment model created
- Foreign key to JournalEntry established
- CASCADE deletion configured
- Foundation ready for file fields

### Verification Checklist
- [ ] `journal_entry_attachment.py` created in models directory
- [ ] JournalEntryAttachment class extends BaseModel
- [ ] journal_entry ForeignKey defined with CASCADE
- [ ] Meta class configured with proper table name
- [ ] Model imported in `__init__.py`

---

## Task 34: Add Attachment File Field

### Overview
Add the file field to store uploaded documents in S3-compatible storage. This field handles the actual file upload, storage path generation, and retrieval while integrating with Django's file storage abstraction layer for cloud storage compatibility.

### Dependencies
- Task 33: JournalEntryAttachment Model created
- Django storage backend configured (S3, MinIO, or compatible)
- Storage bucket and credentials configured in settings
- File upload settings defined (max size, allowed types)

### Instructions

1. **Open journal_entry_attachment.py**
   - Continue editing the JournalEntryAttachment model
   - Import FileField from Django

2. **Add file field**
   - Type: `FileField`
   - Upload to: Dynamic path using upload_to callable
   - Required field (no null or blank)
   - Purpose: Stores the actual file in S3-compatible storage

3. **Define upload_to callable function**
   - Create function `journal_entry_attachment_path(instance, filename)`
   - Place before model class definition
   - Generate unique storage path
   - Include tenant ID for multi-tenancy isolation
   - Include journal entry ID for organization
   - Include timestamp for uniqueness
   - Preserve original file extension

4. **Implement path generation logic**
   - Format: `journal_entries/tenant_{tenant_id}/entry_{entry_id}/{timestamp}_{filename}`
   - Example: `journal_entries/tenant_abc123/entry_def456/20260125_143022_receipt.pdf`
   - Ensures no path conflicts
   - Organizes by tenant and entry
   - Maintains chronological ordering

5. **Add file validation considerations**
   - Note: Actual validation done in serializers/forms
   - File size limits (e.g., 10MB max)
   - Allowed extensions (.pdf, .jpg, .png, .doc, .docx, .xls, .xlsx)
   - MIME type validation
   - Virus scanning hook point (future)

6. **Configure storage backend**
   - Verify Django settings use S3 storage backend
   - Check `DEFAULT_FILE_STORAGE` setting
   - Ensure AWS_STORAGE_BUCKET_NAME configured
   - Verify AWS credentials or compatible endpoint

### File Field Specifications

| Property | Configuration | Purpose |
|----------|---------------|---------|
| upload_to | Dynamic callable | Generates unique storage paths |
| null | False | File required for attachment |
| blank | False | Must upload file on creation |
| max_length | 500 (default) | Storage path length limit |

### Storage Path Strategy

**Path Components:**
1. **Base directory:** `journal_entries/`
2. **Tenant isolation:** `tenant_{tenant_id}/`
3. **Entry grouping:** `entry_{journal_entry_id}/`
4. **Unique filename:** `{timestamp}_{sanitized_filename}`

**Example Paths:**
```
journal_entries/tenant_a1b2c3/entry_d4e5f6/20260125_143022_receipt.pdf
journal_entries/tenant_a1b2c3/entry_d4e5f6/20260125_143155_invoice.jpg
journal_entries/tenant_a1b2c3/entry_g7h8i9/20260125_144530_contract.docx
journal_entries/tenant_x9y8z7/entry_k1l2m3/20260125_150000_statement.pdf
```

**Benefits:**
- Tenant data isolation at storage level
- Easy backup/restore per tenant
- Organized by journal entry
- No filename conflicts
- Chronological ordering
- Original filename preserved in metadata

### Upload Path Generation Function

**Function Structure:**
```
def journal_entry_attachment_path(instance, filename):
    """
    Generate unique storage path for journal entry attachment.
    
    Args:
        instance: JournalEntryAttachment instance
        filename: Original uploaded filename
        
    Returns:
        String path for file storage
    """
    # Implementation generates path with:
    # - Tenant ID from instance.tenant.id
    # - Journal entry ID from instance.journal_entry.id
    # - Timestamp from current datetime
    # - Sanitized filename
```

**Filename Sanitization:**
- Remove/replace special characters
- Preserve extension
- Limit length (e.g., 100 characters)
- Handle unicode characters
- Prevent directory traversal (../)

### Storage Backend Configuration

**Django Settings (S3):**
```
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'erp-journal-attachments'
AWS_S3_REGION_NAME = 'ap-southeast-1'  # Singapore region
AWS_S3_FILE_OVERWRITE = False
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',  # 1 day cache
}
```

**Compatible Storage Backends:**
- **Amazon S3:** AWS S3 buckets
- **MinIO:** Self-hosted S3-compatible
- **DigitalOcean Spaces:** S3-compatible object storage
- **Google Cloud Storage:** With S3 compatibility layer
- **Local Development:** Django's FileSystemStorage

### File Upload Security

**Validation Requirements:**
1. **Size limits:** Maximum 10MB per file
2. **Type restrictions:** Only business document types
3. **Virus scanning:** Integration point for antivirus
4. **Access control:** Tenant isolation enforced
5. **Encryption:** S3 server-side encryption enabled

**Allowed File Types:**
- Documents: .pdf, .doc, .docx
- Images: .jpg, .jpeg, .png
- Spreadsheets: .xls, .xlsx, .csv
- Archives: .zip (for multiple documents)

**Rejected File Types:**
- Executables: .exe, .bat, .sh
- Scripts: .js, .py, .php
- Potentially dangerous: .htm, .html (executable content)

### Expected Outcome
- File field added to model
- Dynamic upload path generation implemented
- S3-compatible storage integration
- Unique file paths per attachment
- Ready for file uploads

### Verification Checklist
- [ ] file FileField added to model
- [ ] upload_to callable function defined
- [ ] Path generation includes tenant and entry IDs
- [ ] Filename sanitization implemented
- [ ] Storage backend configured in settings
- [ ] File validation strategy documented

---

## Task 35: Add Attachment Metadata

### Overview
Add comprehensive metadata fields to track file information, upload details, and user activity. These fields provide essential context for attachments, enable file management, support audit trails, and improve user experience by displaying meaningful file information.

### Dependencies
- Task 33: JournalEntryAttachment Model created
- Task 34: Attachment File Field added
- User model available for upload tracking
- Tenant-aware BaseModel in use

### Instructions

1. **Continue editing journal_entry_attachment.py**
   - Add metadata fields after file field
   - Import User model for foreign key
   - Import timezone utilities for datetime handling

2. **Add original_filename field**
   - Type: `CharField`
   - Max length: 255 characters
   - Required field (no blank)
   - Purpose: Stores user's original filename
   - Displayed in UI instead of storage path
   - Preserves meaningful names

3. **Add file_size field**
   - Type: `BigIntegerField`
   - Stores size in bytes
   - Required field
   - Purpose: Display file size to users
   - Enable storage quota tracking
   - Validate against size limits

4. **Add mime_type field**
   - Type: `CharField`
   - Max length: 100 characters
   - Optional (nullable, blankable)
   - Purpose: Stores detected MIME type
   - Examples: `application/pdf`, `image/jpeg`
   - Enables type-based filtering

5. **Add description field**
   - Type: `TextField`
   - Optional (blankable)
   - Purpose: User-provided description of attachment
   - Explains document purpose
   - Improves searchability

6. **Add uploaded_by field**
   - Type: `ForeignKey` to User model
   - Related name: `'journal_attachments'`
   - On delete: `SET_NULL` (preserve record if user deleted)
   - Nullable: Yes
   - Purpose: Tracks who uploaded the file
   - Audit trail for compliance

7. **Add uploaded_at field**
   - Type: `DateTimeField`
   - Auto now add: Yes
   - Purpose: Timestamp of upload
   - Audit trail
   - Display to users

8. **Update __str__ method**
   - Return meaningful string representation
   - Format: `"{original_filename} - {journal_entry}"`
   - Example: `"receipt.pdf - JE-2026-00123"`

9. **Add helper properties**
   - `file_size_display`: Human-readable size (e.g., "2.5 MB")
   - `file_extension`: Extract extension from filename
   - `is_image`: Boolean check if image file
   - `is_pdf`: Boolean check if PDF file

10. **Update Meta class**
    - Add index on `uploaded_at` for chronological queries
    - Add index on `uploaded_by` for user activity tracking
    - Consider composite index (journal_entry, uploaded_at)

### Extended Model Structure

```
JournalEntryAttachment Model (Complete)
├── id                    [UUID, PK, auto]
├── tenant                [FK to Tenant, inherited from BaseModel]
├── journal_entry         [FK to JournalEntry, CASCADE, indexed]
├── file                  [FileField, S3 storage]
├── original_filename     [CharField(255), required]
├── file_size             [BigIntegerField, bytes]
├── mime_type             [CharField(100), nullable]
├── description           [TextField, optional]
├── uploaded_by           [FK to User, SET_NULL, indexed]
├── uploaded_at           [DateTimeField, auto_now_add, indexed]
├── created_at            [DateTimeField, auto_now_add]
└── updated_at            [DateTimeField, auto_now]
```

### Metadata Field Specifications

| Field | Type | Required | Indexed | Purpose |
|-------|------|----------|---------|---------|
| original_filename | CharField(255) | Yes | No | Display name |
| file_size | BigInteger | Yes | No | Size in bytes |
| mime_type | CharField(100) | No | No | File type detection |
| description | TextField | No | No | User notes |
| uploaded_by | FK User | No | Yes | Audit trail |
| uploaded_at | DateTime | Yes | Yes | Upload timestamp |

### File Size Tracking

**Storage in Bytes:**
```
1 KB = 1,024 bytes
1 MB = 1,048,576 bytes
1 GB = 1,073,741,824 bytes

Example values:
- Small PDF: 245,678 bytes (240 KB)
- Photo: 1,892,456 bytes (1.8 MB)
- Scanned document: 8,456,789 bytes (8.1 MB)
```

**Display Conversion:**
```
file_size_display property converts:
- < 1 KB: "245 bytes"
- < 1 MB: "240.5 KB"
- < 1 GB: "8.1 MB"
- ≥ 1 GB: "1.2 GB"
```

**Quota Tracking:**
- Track total storage per tenant
- Alert when approaching limits
- Enable storage analytics
- Support pricing tiers

### MIME Type Examples

**Common Business Documents:**
```
PDF:        application/pdf
Word:       application/vnd.openxmlformats-officedocument.wordprocessingml.document
Excel:      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
JPEG:       image/jpeg
PNG:        image/png
CSV:        text/csv
ZIP:        application/zip
```

**Detection Methods:**
- Python `mimetypes` module
- `python-magic` library (libmagic)
- File extension fallback
- Content inspection

### User Tracking with SET_NULL

**Why SET_NULL for uploaded_by:**
- Preserve attachment even if uploader account deleted
- Maintain audit trail integrity
- Avoid cascade deletion of important records
- User information still valuable even if user gone

**Alternative Approaches:**
- PROTECT: Prevent user deletion if has uploads (too restrictive)
- CASCADE: Delete attachments when user deleted (loses data)
- DO_NOTHING: Causes database constraint errors

**Chosen: SET_NULL** because:
- Attachments remain accessible
- User ID preserved until deletion
- No data loss on user removal
- Can display "Uploaded by: [Deleted User]"

### Helper Properties Implementation

**file_size_display:**
```
Property that converts bytes to human-readable format:
- Input: 2456789 bytes
- Output: "2.3 MB"
- Uses appropriate unit (bytes, KB, MB, GB)
```

**file_extension:**
```
Property that extracts extension from original_filename:
- Input: "invoice_jan_2026.pdf"
- Output: ".pdf" or "pdf"
- Handles no extension gracefully
```

**is_image:**
```
Property that checks if file is image:
- Checks mime_type starts with "image/"
- Or checks extension in ['.jpg', '.jpeg', '.png', '.gif']
- Returns: Boolean
```

**is_pdf:**
```
Property that checks if file is PDF:
- Checks mime_type == "application/pdf"
- Or checks extension == ".pdf"
- Returns: Boolean
- Useful for PDF-specific operations (preview, merge)
```

### Audit Trail Information

**Upload Tracking:**
- Who uploaded: `uploaded_by` (User FK)
- When uploaded: `uploaded_at` (DateTime)
- Where stored: `file` (S3 path)
- What uploaded: `original_filename`, `file_size`

**Audit Queries:**
```
# All attachments uploaded by user
user.journal_attachments.all()

# Attachments uploaded today
JournalEntryAttachment.objects.filter(
    uploaded_at__date=today
)

# Large attachments (> 5MB)
JournalEntryAttachment.objects.filter(
    file_size__gt=5242880
)

# PDF attachments
JournalEntryAttachment.objects.filter(
    mime_type='application/pdf'
)
```

### Description Field Usage

**Purpose Examples:**
- "Receipt from supplier XYZ for office supplies purchase"
- "Bank statement showing payment clearance"
- "Signed contract for lease agreement"
- "Invoice supporting journal entry adjustment"

**Best Practices:**
- Encourage meaningful descriptions
- Optional but recommended
- Searchable via text search
- Displayed in attachment lists

### Expected Outcome
- Comprehensive metadata tracking
- User-friendly file information display
- Audit trail for compliance
- Helper properties for file type detection
- Ready for migrations

### Verification Checklist
- [ ] original_filename CharField added
- [ ] file_size BigIntegerField added
- [ ] mime_type CharField added (nullable)
- [ ] description TextField added (blank=True)
- [ ] uploaded_by ForeignKey to User added (SET_NULL)
- [ ] uploaded_at DateTimeField added (auto_now_add)
- [ ] __str__ method updated
- [ ] Helper properties defined (file_size_display, file_extension, is_image, is_pdf)
- [ ] Meta class indexes updated

---

## Task 36: Run Attachment Migrations

### Overview
Generate and apply Django migrations to create the journal_entry_attachments table in the database with all fields, constraints, and indexes. This finalizes the attachment model implementation and enables actual file attachment functionality in the application.

### Dependencies
- Task 33: JournalEntryAttachment Model created
- Task 34: Attachment File Field added
- Task 35: Attachment Metadata added
- PostgreSQL database accessible
- Django migrations system operational

### Instructions

1. **Verify model completeness**
   - Open `apps/journal_entries/models/journal_entry_attachment.py`
   - Confirm all fields present (journal_entry, file, original_filename, file_size, mime_type, description, uploaded_by, uploaded_at)
   - Verify Meta class configuration
   - Check model imports in `__init__.py`

2. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment if needed
   - Run migration creation command
   - Django will detect new model and fields

3. **Review generated migration**
   - Navigate to `apps/journal_entries/migrations/`
   - Open latest migration file (e.g., `0004_journalentryattachment.py`)
   - Verify CreateModel operation present
   - Check field definitions match model

4. **Verify foreign key constraints**
   - Confirm `journal_entry` FK to `journal_entries.JournalEntry`
   - Confirm `uploaded_by` FK to `users.User`
   - Check `on_delete` settings (CASCADE and SET_NULL)
   - Verify related names

5. **Verify indexes**
   - Check index on `journal_entry_id`
   - Check index on `uploaded_by_id` (if specified)
   - Check index on `uploaded_at` (if specified)
   - Verify composite indexes if defined

6. **Check field constraints**
   - `file` field: not null
   - `original_filename`: not null, max length 255
   - `file_size`: not null, BigInteger
   - `mime_type`: nullable, max length 100
   - `description`: nullable, text
   - `uploaded_by`: nullable FK
   - `uploaded_at`: not null, auto now add

7. **Apply migration to database**
   - Run migration apply command
   - Migration should execute without errors
   - Verify table created successfully

8. **Verify database schema**
   - Connect to database (psql, pgAdmin, DBeaver)
   - Confirm `journal_entry_attachments` table exists
   - Check all columns present with correct types
   - Verify foreign key constraints created
   - Verify indexes created

9. **Test reverse migration (optional)**
   - Run migration rollback to previous state
   - Verify table dropped cleanly
   - Re-apply migration for final state
   - Ensures migration reversibility

10. **Update migration dependency chain**
    - Note migration number for documentation
    - Update any dependent migrations in other apps
    - Document migration in changelog

### Migration Commands

**Generate Migration:**
```bash
python manage.py makemigrations journal_entries
```

**Expected Output:**
```
Migrations for 'journal_entries':
  apps/journal_entries/migrations/0004_journalentryattachment.py
    - Create model JournalEntryAttachment
```

**Apply Migration:**
```bash
python manage.py migrate journal_entries
```

**Expected Output:**
```
Running migrations:
  Applying journal_entries.0004_journalentryattachment... OK
```

**Check Migration Status:**
```bash
python manage.py showmigrations journal_entries
```

**Expected Output:**
```
journal_entries
 [X] 0001_initial
 [X] 0002_journalentry
 [X] 0003_journalentryline
 [X] 0004_journalentryattachment
```

### Migration File Structure

**Expected Contents:**
```python
# Generated migration file structure:

operations = [
    migrations.CreateModel(
        name='JournalEntryAttachment',
        fields=[
            ('id', UUID field),
            ('created_at', DateTimeField),
            ('updated_at', DateTimeField),
            ('file', FileField with upload_to),
            ('original_filename', CharField max_length=255),
            ('file_size', BigIntegerField),
            ('mime_type', CharField max_length=100, null=True),
            ('description', TextField blank=True),
            ('uploaded_at', DateTimeField auto_now_add=True),
            ('journal_entry', ForeignKey to JournalEntry, on_delete=CASCADE),
            ('uploaded_by', ForeignKey to User, null=True, on_delete=SET_NULL),
        ],
        options={
            'db_table': 'journal_entry_attachments',
            'ordering': ['-uploaded_at'],
        },
    ),
    migrations.AddIndex(...),  # Indexes as defined
]
```

### Database Schema Verification

**Using PostgreSQL psql:**
```sql
-- Connect to database
psql -U postgres -d erp_database

-- Describe table structure
\d journal_entry_attachments;

-- Expected output shows:
-- Column names and types
-- Indexes
-- Foreign key constraints
```

**Table Structure:**
```
Table: journal_entry_attachments

Columns:
├── id                    uuid PRIMARY KEY
├── created_at            timestamp with time zone NOT NULL
├── updated_at            timestamp with time zone NOT NULL
├── tenant_id             uuid NOT NULL
├── journal_entry_id      uuid NOT NULL
├── file                  varchar(500) NOT NULL
├── original_filename     varchar(255) NOT NULL
├── file_size             bigint NOT NULL
├── mime_type             varchar(100)
├── description           text
├── uploaded_by_id        uuid
└── uploaded_at           timestamp with time zone NOT NULL

Indexes:
├── journal_entry_attachments_pkey (PRIMARY KEY on id)
├── journal_entry_attachments_journal_entry_id_idx (on journal_entry_id)
├── journal_entry_attachments_uploaded_by_id_idx (on uploaded_by_id)
└── journal_entry_attachments_uploaded_at_idx (on uploaded_at)

Foreign Keys:
├── journal_entry_id → journal_entries(id) ON DELETE CASCADE
├── uploaded_by_id → users(id) ON DELETE SET NULL
└── tenant_id → tenants(id) ON DELETE CASCADE
```

### Multi-Tenancy Migration Considerations

**Tenant-Specific Tables:**
- Migration applies to tenant schemas, not public schema
- Each tenant gets own `journal_entry_attachments` table
- Tenant ID column added by BaseModel
- Isolation enforced at database level

**Shared vs Tenant Migrations:**
- This migration is TENANT_APPS migration
- Runs for each tenant schema
- Not applied to public schema
- New tenants automatically get this table

### Common Migration Issues

**Issue: Foreign Key Not Found**
- **Cause:** JournalEntry model not migrated yet
- **Solution:** Ensure journal entry migrations run first
- **Check:** Migration dependencies list

**Issue: File Field Max Length**
- **Cause:** Storage paths exceed default 100 characters
- **Solution:** Set `max_length=500` on FileField
- **Check:** Path length in upload_to function

**Issue: Index Name Too Long**
- **Cause:** PostgreSQL 63-character index name limit
- **Solution:** Manually specify shorter index names
- **Check:** Index definitions in Meta.indexes

**Issue: Migration Conflicts**
- **Cause:** Multiple developers generated migrations
- **Solution:** Squash or merge migrations
- **Check:** Migration dependency chain

### Rollback Procedure

**If Migration Fails:**
```bash
# Roll back to previous migration
python manage.py migrate journal_entries 0003

# Fix model or migration issues
# Regenerate migration
python manage.py makemigrations journal_entries

# Reapply migration
python manage.py migrate journal_entries
```

**Clean Slate (Development Only):**
```bash
# WARNING: Destroys data
# Drop all journal_entries migrations
python manage.py migrate journal_entries zero

# Regenerate all migrations
python manage.py makemigrations journal_entries

# Reapply all migrations
python manage.py migrate journal_entries
```

### Post-Migration Testing

**Verify Model Functionality:**
```python
# Django shell
python manage.py shell

# Import model
from apps.journal_entries.models import JournalEntryAttachment

# Check model loads
JournalEntryAttachment.objects.count()  # Should return 0 initially

# Check model can be instantiated
attachment = JournalEntryAttachment()

# Check fields accessible
attachment.original_filename = "test.pdf"
attachment.file_size = 12345
```

**Verify Foreign Keys:**
```python
# Check reverse relationship from JournalEntry
from apps.journal_entries.models import JournalEntry
entry = JournalEntry.objects.first()
entry.attachments.all()  # Should return empty queryset

# Check uploaded_by relationship
from apps.users.models import User
user = User.objects.first()
user.journal_attachments.all()  # Should return empty queryset
```

### Expected Outcome
- Migration file generated successfully
- Database table created with all fields
- Foreign key constraints established
- Indexes created for performance
- Model ready for use in application

### Verification Checklist
- [ ] Migration file generated (`makemigrations` command)
- [ ] Migration file reviewed (correct fields and constraints)
- [ ] Migration applied (`migrate` command)
- [ ] Table exists in database (`journal_entry_attachments`)
- [ ] All columns present with correct types
- [ ] Foreign key constraints created (journal_entry, uploaded_by)
- [ ] Indexes created (journal_entry_id, uploaded_by_id, uploaded_at)
- [ ] Model imports successfully in Django shell
- [ ] Reverse relationships work (entry.attachments, user.journal_attachments)
- [ ] Migration documented in changelog

---

## Related Diagrams

### Attachment Model Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│            JOURNAL ENTRY ATTACHMENT MODEL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Core Relationship:                                             │
│  ├─ journal_entry: FK → JournalEntry (CASCADE)                 │
│  └─ Purpose: Links file to specific journal entry              │
│                                                                 │
│  File Storage:                                                  │
│  ├─ file: FileField → S3-compatible storage                    │
│  └─ upload_to: journal_entries/tenant_{id}/entry_{id}/{file}  │
│                                                                 │
│  Metadata:                                                      │
│  ├─ original_filename: User's filename (display)               │
│  ├─ file_size: Size in bytes (quota tracking)                  │
│  ├─ mime_type: Detected file type (filtering)                  │
│  └─ description: User notes (searchable)                       │
│                                                                 │
│  Audit Trail:                                                   │
│  ├─ uploaded_by: FK → User (SET_NULL)                          │
│  └─ uploaded_at: Timestamp (chronological tracking)            │
│                                                                 │
│  Tenant Isolation:                                              │
│  ├─ tenant: FK → Tenant (from BaseModel)                       │
│  └─ Storage path includes tenant ID                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Entity Relationships

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  JOURNAL ENTRY   │         │   ATTACHMENT     │         │      USER        │
│                  │         │                  │         │                  │
│ - id             │         │ - id             │         │ - id             │
│ - entry_number   │         │ - file           │         │ - username       │
│ - date           │◄────────┤ - journal_entry  │         │ - email          │
│ - description    │ CASCADE │ - original_name  │         │                  │
│ - total_debit    │         │ - file_size      │         │                  │
│ - total_credit   │         │ - mime_type      │         │                  │
└────────┬─────────┘         │ - description    │         └────────┬─────────┘
         │                   │ - uploaded_at    ├─────────────────►│
         │ attachments       │ - uploaded_by    │  SET_NULL        │
         │ (reverse FK)      └──────────────────┘                  │
         │                                                          │
         └────────────────────────────────────────────────────────►│
                             created_by (journal entry)            │
                             FK to User                             │
```

### File Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    FILE ATTACHMENT WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  USER    │
    │ UPLOADS  │
    │   FILE   │
    └────┬─────┘
         │
         │ 1. POST /api/journal-entries/{id}/attachments/
         ▼
    ┌────────────────┐
    │  SERIALIZER    │ 2. Validate file
    │  VALIDATION    │    - Check size (< 10MB)
    └───────┬────────┘    - Check type (allowed extensions)
            │             - Scan for malware
            │
            │ 3. Valid
            ▼
    ┌────────────────┐
    │  CREATE MODEL  │ 4. JournalEntryAttachment.objects.create()
    │   INSTANCE     │    - Link to journal entry
    └───────┬────────┘    - Set metadata
            │
            │ 5. Save file
            ▼
    ┌────────────────┐
    │ UPLOAD TO S3   │ 6. File stored at generated path
    │   STORAGE      │    journal_entries/tenant_X/entry_Y/file.pdf
    └───────┬────────┘
            │
            │ 7. Return URL
            ▼
    ┌────────────────┐
    │ SAVE METADATA  │ 8. Save to database
    │  TO DATABASE   │    - file path
    └───────┬────────┘    - original_filename
            │             - file_size
            │             - mime_type
            │             - uploaded_by
            │             - uploaded_at
            │
            │ 9. Success response
            ▼
    ┌────────────────┐
    │  RETURN JSON   │ 10. Return attachment details to client
    │   RESPONSE     │     - id, original_filename, file_size, etc.
    └────────────────┘
```

### Storage Path Organization

```
S3 Bucket: erp-journal-attachments
│
├── journal_entries/
│   │
│   ├── tenant_a1b2c3d4/
│   │   │
│   │   ├── entry_j1k2l3m4/
│   │   │   ├── 20260125_143022_receipt.pdf
│   │   │   ├── 20260125_143155_invoice.jpg
│   │   │   └── 20260125_144530_contract.docx
│   │   │
│   │   ├── entry_j5k6l7m8/
│   │   │   ├── 20260125_150000_statement.pdf
│   │   │   └── 20260125_151200_approval.pdf
│   │   │
│   │   └── entry_j9k0l1m2/
│   │       └── 20260126_090000_receipt.jpg
│   │
│   ├── tenant_e5f6g7h8/
│   │   │
│   │   ├── entry_n3o4p5q6/
│   │   │   └── 20260125_160000_invoice.pdf
│   │   │
│   │   └── entry_n7o8p9q0/
│   │       └── 20260125_170000_receipt.png
│   │
│   └── tenant_i9j0k1l2/
│       └── entry_r1s2t3u4/
│           └── 20260126_080000_document.pdf
│
└── [other tenant directories...]

Benefits:
✓ Tenant data isolation
✓ Easy backup/restore per tenant
✓ Organized by journal entry
✓ Chronological ordering
✓ No filename conflicts
```

### Attachment Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                  ATTACHMENT LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────┘

    CREATION
    ────────
         │
         │ User uploads file via API
         ▼
    ┌──────────────┐
    │   UPLOADED   │ File stored in S3
    │              │ Record created in database
    │              │ Status: Active
    └──────┬───────┘
           │
           │
    ACTIVE USE
    ──────────
           │
           │ File downloadable
           │ Visible in UI
           │ Attached to journal entry
           │
           ▼
    ┌──────────────┐
    │    ACTIVE    │ Metadata searchable
    │              │ Audit trail maintained
    │              │ Access controlled
    └──────┬───────┘
           │
           │
           │ Journal entry edited/updated
           │ Additional attachments added
           │
           │
    DELETION
    ────────
           │
           │ Option A: Journal entry deleted
           ▼
    ┌──────────────┐
    │  CASCADE     │ Attachment record deleted
    │  DELETE      │ File removed from S3
    └──────────────┘

           │ Option B: Manual attachment deletion
           ▼
    ┌──────────────┐
    │  SOFT DELETE │ Mark as deleted (optional)
    │  (Optional)  │ File retained temporarily
    └──────┬───────┘
           │
           │ After retention period
           ▼
    ┌──────────────┐
    │  HARD DELETE │ Permanent removal
    │              │ File purged from S3
    └──────────────┘
```

---

## Business Scenarios

### Scenario 1: Receipt Attachment for Expense Entry

**Context:**
Accountant creates manual journal entry for office supply expense and needs to attach the receipt for audit purposes.

**Actors:**
- Sarah (Accountant)
- Audit system

**Flow:**
1. Sarah creates journal entry JE-2026-00123 for office supplies expense (Rs. 15,000 debit to Office Supplies, credit to Cash)
2. Sarah clicks "Attach Files" button on journal entry detail screen
3. Sarah selects receipt photo from local computer (receipt_jan25.jpg, 2.3 MB)
4. System validates file (image, under 10MB limit, no malware)
5. System uploads to S3: `journal_entries/tenant_abc/entry_123/20260125_143022_receipt_jan25.jpg`
6. System creates JournalEntryAttachment record with metadata
7. System displays attachment in journal entry view with thumbnail
8. Sarah adds description: "Receipt from Office Mart for printer paper and toner"
9. Attachment saved and available for download
10. Auditor later accesses journal entry and downloads receipt for verification

**Outcome:**
✓ Receipt permanently linked to journal entry  
✓ Audit trail established with upload timestamp and user  
✓ File securely stored in S3 with tenant isolation  
✓ Easy retrieval for compliance and audit

### Scenario 2: Multiple Documents for Large Transaction

**Context:**
Finance manager records a major asset purchase requiring multiple supporting documents including invoice, bank transfer confirmation, and contract.

**Actors:**
- Kumar (Finance Manager)
- Bank system
- Vendor

**Flow:**
1. Kumar creates journal entry JE-2026-00124 for equipment purchase (Rs. 2,500,000 debit to Equipment, credit to Bank)
2. Kumar attaches vendor invoice (invoice_12345.pdf, 450 KB)
   - Description: "Vendor invoice for manufacturing equipment from ABC Industries"
3. Kumar attaches bank transfer confirmation (bank_confirmation.pdf, 1.2 MB)
   - Description: "Bank transfer confirmation showing payment to vendor account"
4. Kumar attaches purchase agreement (purchase_agreement.pdf, 3.5 MB)
   - Description: "Signed purchase agreement with warranty terms"
5. System uploads each file to separate S3 paths under same journal entry directory
6. Journal entry now shows 3 attachments with total size 5.15 MB
7. Each attachment independently downloadable
8. CFO reviews journal entry and accesses all three documents for approval
9. Documents remain accessible for multi-year retention period

**Outcome:**
✓ Complete documentation package linked to transaction  
✓ All supporting evidence in one location  
✓ Individual file management maintained  
✓ Comprehensive audit trail for high-value purchase

### Scenario 3: Bank Statement for Reconciliation Entry

**Context:**
Monthly bank reconciliation reveals discrepancies requiring adjusting journal entries with bank statement attachment for reference.

**Actors:**
- Priya (Accounting Clerk)
- Bank
- Reconciliation system

**Flow:**
1. Priya performs monthly bank reconciliation for January 2026
2. Identifies Rs. 5,000 bank service charges not recorded in books
3. Creates adjusting journal entry JE-2026-00125 (Bank Charges debit Rs. 5,000, Bank credit Rs. 5,000)
4. Downloads January bank statement from bank portal (bank_statement_jan2026.pdf, 8.7 MB)
5. Attaches bank statement to journal entry
6. Highlights relevant section in description: "See page 3, item 14 for bank service charges"
7. System stores statement with journal entry
8. Reconciliation report links to journal entry with statement attachment
9. Future audits can verify charges against actual bank statement
10. Year-end audit easily accesses all monthly statements via journal entry attachments

**Outcome:**
✓ Bank statement preserved as evidence for adjustment  
✓ Easy verification of reconciliation entries  
✓ Complete audit trail for bank transactions  
✓ Efficient year-end audit preparation

### Scenario 4: Contract Attachment for Lease Agreement Entry

**Context:**
Company signs new office lease requiring initial journal entry for security deposit with lease contract attachment.

**Actors:**
- Finance Director
- Landlord
- Legal Department

**Flow:**
1. Finance Director receives signed lease agreement (lease_agreement_2026.pdf, 2.1 MB)
2. Creates journal entry JE-2026-00126 for security deposit (Deposits debit Rs. 300,000, Bank credit Rs. 300,000)
3. Attaches lease agreement to journal entry
4. Description: "Office lease agreement for 3 years starting Feb 1, 2026 - Security deposit 2 months rent"
5. System stores contract with journal entry
6. Legal department references attachment when reviewing lease terms
7. Monthly rent entries created with reference back to original entry
8. Lease termination process references original entry with contract
9. Security deposit refund (3 years later) references original entry and contract

**Outcome:**
✓ Lease contract permanently accessible via accounting system  
✓ Deposit entry linked to legal documentation  
✓ Multi-year reference maintained  
✓ Single source of truth for lease financial terms

### Scenario 5: Photo Evidence for Asset Disposal

**Context:**
Company disposes of old equipment and accountant needs to attach photos showing asset condition for loss calculation and audit defense.

**Actors:**
- Asset Manager
- Accountant
- Auditor

**Flow:**
1. Asset Manager identifies damaged equipment for disposal (machinery originally Rs. 800,000, accumulated depreciation Rs. 600,000)
2. Takes photos of equipment showing damage and inoperability (3 photos, total 5.2 MB)
3. Accountant creates disposal journal entry JE-2026-00127
   - Accumulated Depreciation debit Rs. 600,000
   - Loss on Disposal debit Rs. 200,000
   - Equipment credit Rs. 800,000
4. Accountant attaches all 3 photos to journal entry
5. Description for each: "Photo 1: Front view showing damage", "Photo 2: Motor burnout", "Photo 3: Serial number plate"
6. System stores all photos with journal entry
7. Year-end auditor reviews disposal and accesses photos
8. Auditor validates loss calculation based on photo evidence
9. Photos serve as evidence for insurance claim (if applicable)

**Outcome:**
✓ Visual documentation of asset condition  
✓ Evidence supporting loss calculation  
✓ Audit defense for unusual transactions  
✓ Insurance claim support

---

## File Type Guidelines

### Supported Document Types

**Primary Business Documents:**
```
PDF Documents (.pdf)
├── Invoices
├── Receipts
├── Contracts
├── Bank statements
├── Tax forms
├── Audit reports
└── Legal documents

Purpose: Most common business document format
Maximum Size: 10 MB per file
Advantages: Universal compatibility, printable, secure
Use Cases: All formal business documentation
```

**Image Files (.jpg, .jpeg, .png)**
```
Image Files
├── Receipt photos
├── Asset photographs
├── Signature captures
├── Scanned documents (if no PDF)
├── Product images
└── Facility photos

Purpose: Visual documentation and scanned receipts
Maximum Size: 10 MB per file (typically 1-3 MB)
Advantages: Universal viewing, mobile capture
Use Cases: Mobile receipt capture, asset documentation
```

**Office Documents (.doc, .docx)**
```
Word Documents
├── Draft agreements
├── Internal memos
├── Correspondence
├── Policy documents
└── Meeting notes

Purpose: Editable text documents
Maximum Size: 10 MB per file
Advantages: Editable, familiar format
Use Cases: Internal documentation, drafts
Recommendation: Convert to PDF for finalization
```

**Spreadsheets (.xls, .xlsx, .csv)**
```
Excel/CSV Files
├── Supporting calculations
├── Data imports
├── Budget worksheets
├── Analysis spreadsheets
└── Reconciliation workpapers

Purpose: Numerical data and calculations
Maximum Size: 10 MB per file
Advantages: Calculation preservation, data analysis
Use Cases: Complex calculations, supporting schedules
```

**Archives (.zip)**
```
ZIP Archives
├── Multiple related documents
├── Bulk uploads
├── Document packages
└── Email attachments collections

Purpose: Bundle multiple files
Maximum Size: 10 MB total
Advantages: Reduced upload count, organized sets
Use Cases: Multiple receipts, document packages
```

### File Type Recommendations by Scenario

| Scenario | Recommended Format | Alternative | Notes |
|----------|-------------------|-------------|-------|
| Vendor Invoice | PDF | JPEG (photo) | PDF preferred for clarity |
| Receipt (POS) | JPEG | PDF | Mobile photo acceptable |
| Bank Statement | PDF | - | Always use bank's PDF export |
| Contract | PDF | DOCX (draft only) | PDF for signed versions |
| Supporting Calculations | XLSX | PDF (final) | Preserve formulas in Excel |
| Asset Photo | JPEG/PNG | - | Good quality, reasonable size |
| Email Thread | PDF | - | Export email to PDF |
| Multiple Receipts | ZIP of PDFs | Individual files | Group related items |

### File Size Guidelines

**Target Sizes:**
```
Receipt Photos:      500 KB - 2 MB (good quality)
Scanned Documents:   1 MB - 3 MB (300 DPI)
Bank Statements:     2 MB - 5 MB (multi-page)
Contracts:           1 MB - 4 MB (10-20 pages)
Spreadsheets:        100 KB - 2 MB (typical)
```

**Maximum Limits:**
```
Per File:            10 MB (hard limit)
Per Journal Entry:   50 MB total (soft limit)
Per Tenant/Month:    5 GB (quota limit)
```

**Compression Recommendations:**
- Images: Use JPEG compression (quality 85%)
- PDFs: Use medium compression (Acrobat Standard)
- Large files: Split into multiple files if over 8 MB
- Archives: Use ZIP compression for multiple files

### File Naming Best Practices

**Good Filenames:**
```
✓ invoice_supplier_date_amount.pdf
✓ receipt_2026-01-25_office_supplies.jpg
✓ bank_statement_2026-01_checking.pdf
✓ contract_lease_office_2026-2029.pdf
✓ asset_photo_equipment_123.jpg
```

**Avoid:**
```
✗ document.pdf (too generic)
✗ IMG_1234.jpg (meaningless)
✗ Scan 2026-01-25 14.30.22.pdf (too long)
✗ receipt!!!.jpg (special characters)
✗ file (1).pdf (version indicators)
```

**Naming Guidelines:**
- Use descriptive names
- Include date if relevant (YYYY-MM-DD format)
- Include key identifiers (invoice number, asset ID)
- Use underscores, not spaces
- Keep under 100 characters
- Avoid special characters

---

## Storage Configuration

### S3-Compatible Storage Setup

**Amazon S3 Configuration:**
```python
# Django settings.py

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'erp-journal-attachments-prod'
AWS_S3_REGION_NAME = 'ap-southeast-1'  # Singapore
AWS_S3_FILE_OVERWRITE = False
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
    'ServerSideEncryption': 'AES256',
}
AWS_DEFAULT_ACL = None
AWS_QUERYSTRING_AUTH = True
AWS_QUERYSTRING_EXPIRE = 3600  # 1 hour signed URLs
```

**Configuration Parameters:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| BUCKET_NAME | erp-journal-attachments-prod | Dedicated bucket for attachments |
| REGION | ap-southeast-1 (Singapore) | Low latency for Sri Lanka |
| FILE_OVERWRITE | False | Prevent accidental overwrites |
| ENCRYPTION | AES256 | Server-side encryption |
| SIGNED_URLs | True, 1 hour | Secure time-limited access |
| ACL | None (private) | Bucket-level permissions only |

### MinIO Self-Hosted Alternative

**MinIO Configuration:**
```python
# Django settings.py (MinIO)

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = 'minioadmin'
AWS_SECRET_ACCESS_KEY = 'minioadmin'
AWS_STORAGE_BUCKET_NAME = 'journal-attachments'
AWS_S3_ENDPOINT_URL = 'http://minio:9000'  # Internal Docker service
AWS_S3_REGION_NAME = 'us-east-1'  # MinIO default
AWS_S3_USE_SSL = False  # True in production
AWS_S3_SIGNATURE_VERSION = 's3v4'
```

**MinIO Advantages:**
- Self-hosted (data sovereignty)
- S3-compatible API
- No cloud costs
- Suitable for Sri Lankan deployments
- Docker-friendly

### Storage Bucket Structure

**Bucket Organization:**
```
erp-journal-attachments/
│
├── journal_entries/          # Journal entry attachments
│   ├── tenant_{id}/
│   │   └── entry_{id}/
│
├── invoices/                 # Invoice attachments (future)
│   ├── tenant_{id}/
│   │   └── invoice_{id}/
│
├── receipts/                 # Payment receipts (future)
│   ├── tenant_{id}/
│   │   └── receipt_{id}/
│
└── [other modules]/
```

### Access Control

**IAM Policy (AWS S3):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::erp-journal-attachments/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::erp-journal-attachments"
    }
  ]
}
```

**Access Levels:**
- Application: Full CRUD access via IAM credentials
- Users: No direct S3 access (through application only)
- Signed URLs: Time-limited download access
- Tenant isolation: Enforced by application logic

### Backup and Retention

**Backup Strategy:**
```
Daily:    Incremental backups of new/modified files
Weekly:   Full bucket snapshot
Monthly:  Long-term archive to Glacier (AWS) or tape (self-hosted)
Yearly:   Compliance archive (7 years for financial records)
```

**Retention Policy:**
```
Active Attachments:     Retain indefinitely (while entry exists)
Deleted Entries:        Cascade delete attachments
Audit Trail:            Maintain deletion logs (metadata only)
Compliance Documents:   Minimum 7 years (Sri Lankan tax law)
```

### Storage Quotas

**Per Tenant Limits:**
```
Free Tier:       1 GB storage
Basic Plan:      10 GB storage
Professional:    50 GB storage
Enterprise:      Unlimited (fair use)
```

**Quota Enforcement:**
```python
# Check tenant storage usage before upload
def check_storage_quota(tenant, file_size):
    """
    Verify tenant has sufficient storage quota.
    
    Calculates:
    - Current usage across all attachments
    - Requested file size
    - Tenant plan limit
    
    Raises:
    - QuotaExceededError if upload would exceed limit
    """
    pass
```

**Quota Monitoring:**
- Dashboard showing storage usage
- Alerts at 80% and 95% capacity
- Monthly storage reports
- Upgrade prompts for over-quota tenants

---

## Security Considerations

### File Upload Security

**Validation Layers:**
```
1. Client-Side
   ├─ File size check (< 10 MB)
   ├─ Extension validation
   └─ Preview generation

2. Application-Side (Django)
   ├─ Re-validate size and type
   ├─ Check tenant quota
   ├─ Sanitize filename
   ├─ Scan for malware (optional)
   └─ Generate secure storage path

3. Storage-Side (S3)
   ├─ Bucket policies
   ├─ Encryption at rest
   └─ Access logging
```

**File Type Validation:**
```python
# Serializer validation
ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.zip']
ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/zip',
]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_file(file):
    """
    Comprehensive file validation.
    
    Checks:
    - File extension in allowed list
    - MIME type matches extension
    - File size within limits
    - Filename sanitized
    - No executable content
    """
    pass
```

### Malware Scanning

**Integration Options:**
```
1. ClamAV (Open Source)
   ├─ Self-hosted antivirus
   ├─ Docker container
   └─ Scan before S3 upload

2. AWS Lambda + ClamAV
   ├─ Serverless scanning
   ├─ Triggered on S3 upload
   └─ Quarantine infected files

3. Commercial Solutions
   ├─ VirusTotal API
   ├─ Metadefender
   └─ Third-party scanning services
```

**Scanning Workflow:**
```
1. File uploaded to application
2. Save to temporary location
3. Scan with ClamAV
4. If clean: Upload to S3
5. If infected: Reject and notify user
6. Log scan results for audit
```

### Access Control

**Permission Requirements:**
```
View Attachments:
- User must have permission to view journal entry
- Tenant-level access enforced
- No cross-tenant access

Upload Attachments:
- User must have permission to edit journal entry
- Enforce tenant quota limits
- Log upload activity

Download Attachments:
- Signed URLs with expiration (1 hour)
- IP-based restrictions (optional)
- Download activity logged

Delete Attachments:
- Restricted to entry creator or supervisor
- Soft delete option for audit
- Permanent deletion after retention period
```

**Django Permissions:**
```python
# Permission checks in views
class JournalEntryAttachmentViewSet(viewsets.ModelViewSet):
    """
    Permission requirements:
    - List: journal_entries.view_journalentry
    - Create: journal_entries.add_journalentryattachment
    - Retrieve: journal_entries.view_journalentry
    - Destroy: journal_entries.delete_journalentryattachment
    
    Tenant isolation enforced via queryset filtering.
    """
    pass
```

### Data Encryption

**At Rest:**
```
S3 Server-Side Encryption (SSE-S3):
- Automatic encryption of all objects
- AES-256 encryption
- Transparent to application
- No performance impact

Alternative: SSE-KMS
- Customer-managed keys
- Enhanced audit trail
- Key rotation support
- Higher cost
```

**In Transit:**
```
HTTPS/TLS:
- All API calls use HTTPS
- TLS 1.2 minimum
- Strong cipher suites
- Certificate validation

Signed URLs:
- Pre-signed for downloads
- HTTPS enforced
- Time-limited validity
- Revocable if needed
```

### Audit Logging

**Upload Events:**
```
Log Entry:
├─ Event: file_uploaded
├─ User: uploaded_by user ID
├─ Timestamp: uploaded_at
├─ Journal Entry: journal_entry_id
├─ File: original_filename
├─ Size: file_size
├─ IP Address: request IP
└─ User Agent: request user agent
```

**Download Events:**
```
Log Entry:
├─ Event: file_downloaded
├─ User: requesting user ID
├─ Timestamp: download time
├─ File: attachment ID
├─ Journal Entry: journal_entry_id
├─ IP Address: request IP
└─ Signed URL used: URL signature
```

**Deletion Events:**
```
Log Entry:
├─ Event: file_deleted
├─ User: deleting user ID
├─ Timestamp: deletion time
├─ File: original_filename
├─ Journal Entry: journal_entry_id (if cascade)
├─ Reason: manual or cascade
└─ File retained: soft delete retention period
```

---

## Performance Optimization

### Upload Performance

**Large File Handling:**
```
Techniques:
1. Chunked Uploads
   ├─ Split large files into 5MB chunks
   ├─ Upload chunks in parallel
   ├─ Reassemble on S3
   └─ Resume interrupted uploads

2. Direct S3 Upload
   ├─ Generate pre-signed POST URL
   ├─ Client uploads directly to S3
   ├─ Webhook notifies application
   └─ Reduces server load

3. Compression
   ├─ Compress before upload (ZIP)
   ├─ S3 handles decompression
   └─ Faster transfers for text documents
```

**Progress Indicators:**
```
Client-Side:
- Upload progress bar (percentage)
- Estimated time remaining
- Bytes uploaded / total
- Cancel option

Server-Side:
- Chunked transfer encoding
- Stream file to S3 (don't buffer fully)
- Non-blocking async uploads
```

### Download Performance

**CDN Integration:**
```
CloudFront (AWS) or CloudFlare:
├─ Cache frequently accessed files
├─ Edge location delivery (low latency)
├─ Reduce S3 data transfer costs
└─ Improve user experience

Configuration:
- Cache PDFs and images for 24 hours
- Invalidate cache on file updates
- Serve from nearest edge location
- Monitor cache hit ratio
```

**Lazy Loading:**
```
Attachment Lists:
- Load thumbnails first (small size)
- Lazy load full files on demand
- Paginate large attachment lists
- Infinite scroll for mobile

Detail Views:
- Preview generation for PDFs
- Thumbnail display for images
- Download button for full file
```

### Database Query Optimization

**N+1 Query Prevention:**
```python
# Bad: N+1 queries
entries = JournalEntry.objects.all()
for entry in entries:
    attachments = entry.attachments.all()  # Separate query per entry

# Good: Single query with join
entries = JournalEntry.objects.prefetch_related('attachments').all()
for entry in entries:
    attachments = entry.attachments.all()  # Already loaded
```

**Indexing Strategy:**
```sql
-- Indexes for common queries
CREATE INDEX idx_attachment_journal_entry ON journal_entry_attachments(journal_entry_id);
CREATE INDEX idx_attachment_uploaded_at ON journal_entry_attachments(uploaded_at);
CREATE INDEX idx_attachment_uploaded_by ON journal_entry_attachments(uploaded_by_id);

-- Composite index for filtered queries
CREATE INDEX idx_attachment_entry_uploaded ON journal_entry_attachments(journal_entry_id, uploaded_at);
```

### Storage Optimization

**Deduplication:**
```
Strategy:
1. Calculate file hash (SHA256) on upload
2. Check if hash exists in storage
3. If exists: Reference existing file
4. If new: Upload to S3
5. Track references in database

Benefits:
- Reduced storage costs
- Faster duplicate uploads
- Single copy of identical files

Considerations:
- Tenant isolation maintained
- Deletion requires reference counting
- Hash calculation overhead
```

**Compression:**
```
Automatic Compression:
├─ PDF: Use medium compression (Ghostscript)
├─ Images: JPEG quality 85%, PNG optimization
├─ Office Docs: ZIP compression (built-in)
└─ Archives: Already compressed (no double compression)

Size Reductions:
- PDFs: 20-40% smaller
- JPEGs: 30-50% smaller (lossy)
- PNGs: 10-30% smaller (lossless)
- Office: 40-60% smaller (ZIP)
```

---

## Notes for AI Agents

### Multi-Tenancy Isolation
- All attachments tenant-isolated via BaseModel
- Storage paths include tenant ID for physical separation
- No cross-tenant file access possible
- Tenant quota enforced at application level
- Each tenant's files in separate S3 directory structure

### Cascade Deletion Rationale
- Attachments are dependent documents, not primary records
- CASCADE ensures no orphaned files
- Journal entry deletion is audited separately
- Soft delete can be implemented at journal entry level
- Attachment deletion logs maintained for compliance

### Storage Backend Flexibility
- S3-compatible interface allows multiple backends
- Amazon S3 for cloud deployments
- MinIO for self-hosted/on-premise
- DigitalOcean Spaces for cost-effective cloud
- Local storage for development only (not production)

### File Security Best Practices
- Always validate file type and size
- Sanitize filenames to prevent injection
- Use signed URLs for time-limited access
- Implement malware scanning for production
- Encrypt at rest and in transit
- Log all file access for audit

### Performance Considerations
- Use select_related/prefetch_related for attachment queries
- Implement pagination for large attachment lists
- Consider CDN for frequently accessed files
- Cache file metadata to reduce S3 API calls
- Use background tasks for large file processing

### Sri Lankan Business Context
- Digital documentation adoption growing
- PDF preferred for invoices and contracts
- Mobile receipt photos common
- Bank statements always PDF format
- 7-year retention for tax compliance
- Data sovereignty considerations (self-hosted storage option)

### Future Enhancements
- Attachment versioning (multiple versions of same document)
- Optical Character Recognition (OCR) for searchable text
- Automatic metadata extraction from PDFs
- Thumbnail generation for preview
- Attachment templates (pre-fill description)
- Bulk upload support
- Document expiry dates with alerts
- E-signature integration

---

## Summary

This document implemented the complete file attachment system for journal entries:

1. ✅ **Task 33:** Created JournalEntryAttachment model with journal_entry foreign key (CASCADE deletion)
2. ✅ **Task 34:** Added file FileField with dynamic S3-compatible storage path generation
3. ✅ **Task 35:** Added comprehensive metadata (original_filename, file_size, mime_type, description, uploaded_by, uploaded_at)
4. ✅ **Task 36:** Generated and applied migrations to create journal_entry_attachments table

**Key Features Implemented:**
- S3-compatible storage integration for scalable file management
- Tenant-isolated storage paths for data separation
- Comprehensive metadata tracking for audit and management
- User attribution with SET_NULL for upload tracking
- Cascade deletion to maintain data integrity
- Helper properties for file type detection and display
- Foundation for file validation and security

**Storage Architecture:**
- Dynamic path generation: `journal_entries/tenant_{id}/entry_{id}/{timestamp}_{filename}`
- Support for multiple storage backends (S3, MinIO, DigitalOcean Spaces)
- Configurable quotas and size limits
- Encryption at rest and in transit

**Next Steps:** Proceed to [02_Tasks-37-41_JournalEntry-Service.md](02_Tasks-37-41_JournalEntry-Service.md) to implement journal entry business logic including validation, posting, reversal, and adjustment services.

