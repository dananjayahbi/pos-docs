# Tasks 69-73: TaxSubmission Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** E - Filing & Reminders  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-74-80_Filing-Reminder-Service.md](02_Tasks-74-80_Filing-Reminder-Service.md)

---

## Document Overview

This document covers the TaxSubmission model implementation for tracking filed tax returns. The model stores submission details including acknowledgment numbers from Inland Revenue Department, submission timestamps, filing confirmation documents, and submission status. This provides a complete audit trail of all tax return submissions and enables tracking of filing confirmations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create TaxSubmission Model | Medium | 30 min |
| 70 | Add Submission Reference | Low | 15 min |
| 71 | Add Submission Date | Low | 15 min |
| 72 | Add Submission Document | Low | 20 min |
| 73 | Run TaxSubmission Migrations | Low | 10 min |

---

## Task 69: Create TaxSubmission Model

### Overview
Create the TaxSubmission model to track all tax return submissions filed with Sri Lankan tax authorities (Inland Revenue Department, CBSL, ETF Board). This model maintains a complete record of submissions including when they were filed, by whom, and their current status. Links to TaxPeriodRecord to associate submissions with specific tax periods.

### Dependencies
- Task 68: TaxPeriodRecord model exists
- Accounting app models structure established
- Django project configured

### Instructions

1. **Create model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `tax_submission.py`
   - This will contain the TaxSubmission model

2. **Add file imports**
   - Import Django models module
   - Import timezone utilities for date handling
   - Import User model from authentication
   - Import TaxPeriodRecord from same package
   - Import gettext_lazy for translation support

3. **Add module docstring**
   - Document the purpose of TaxSubmission model
   - Explain it tracks filed tax returns
   - Note Sri Lankan tax authority context
   - Reference applicable authorities (IRD, CBSL, ETF Board)

4. **Define TaxSubmission model class**
   - Create model inheriting from models.Model
   - Add comprehensive class docstring
   - Explain submission tracking purpose
   - Note relationship to TaxPeriodRecord

5. **Add tax_period foreign key**
   - Create ForeignKey to TaxPeriodRecord model
   - Set on_delete to CASCADE (delete submissions if period deleted)
   - Set related_name to 'submissions'
   - Add help_text explaining the tax period being submitted

6. **Add submitted_by foreign key**
   - Create ForeignKey to User model
   - Set on_delete to PROTECT (preserve user record)
   - Set related_name to 'tax_submissions'
   - Add help_text explaining who filed the return

7. **Add submission status field**
   - Create CharField for submission status
   - Define status choices:
     - SUBMITTED: Return filed with authority
     - ACCEPTED: Submission accepted and processed
     - REJECTED: Submission rejected (needs correction)
     - UNDER_REVIEW: Being reviewed by authority
   - Set max_length to 20 characters
   - Set default to 'SUBMITTED'
   - Add help_text explaining status tracking

8. **Add notes field**
   - Create TextField for submission notes
   - Set blank=True and null=True
   - Add help_text for internal notes about submission
   - Used for special circumstances or corrections

9. **Add timestamp fields**
   - Create created_at with auto_now_add=True
   - Create updated_at with auto_now=True
   - Tracks record creation and last modification

10. **Add Meta class**
    - Set db_table to 'tax_submission'
    - Set verbose_name to 'Tax Submission'
    - Set verbose_name_plural to 'Tax Submissions'
    - Add ordering by ['-submitted_at'] (newest first)
    - Add unique_together on tax_period if one submission per period

11. **Add __str__ method**
    - Return string representation
    - Format: "TaxSubmission - {tax_type} {period} - {status}"
    - Example: "TaxSubmission - VAT January 2026 - ACCEPTED"

12. **Add convenience property methods**
    - Create is_accepted property returning boolean
    - Create is_pending property returning boolean
    - Create can_resubmit property (True if REJECTED)
    - These enable easy status checks

### Model Field Summary

| Field Name | Type | Purpose | Required |
|------------|------|---------|----------|
| tax_period | ForeignKey | Links to TaxPeriodRecord | Yes |
| submitted_by | ForeignKey | User who submitted | Yes |
| status | CharField | Current submission status | Yes |
| notes | TextField | Internal notes | No |
| created_at | DateTimeField | Record creation time | Auto |
| updated_at | DateTimeField | Last modification time | Auto |

### Submission Status Choices

| Status | Description | Next Actions |
|--------|-------------|--------------|
| SUBMITTED | Filed with authority | Wait for confirmation |
| ACCEPTED | Authority accepted return | None - complete |
| REJECTED | Authority rejected return | Correct and resubmit |
| UNDER_REVIEW | Being reviewed | Monitor status |

### Expected Model Structure
```
TaxSubmission Model:
├── ID (Primary Key)
├── tax_period (FK → TaxPeriodRecord)
├── submitted_by (FK → User)
├── status (CharField)
├── notes (TextField)
├── created_at (DateTimeField)
└── updated_at (DateTimeField)
```

### Expected Outcome
- TaxSubmission model class defined
- All base fields configured
- Status tracking implemented
- User and period relationships established
- Proper Meta configuration

### Verification Checklist
- [ ] File `tax_submission.py` created in models directory
- [ ] All necessary imports included
- [ ] TaxSubmission model class defined
- [ ] tax_period ForeignKey configured
- [ ] submitted_by ForeignKey configured
- [ ] status CharField with choices defined
- [ ] notes TextField added
- [ ] Timestamp fields (created_at, updated_at) added
- [ ] Meta class with proper configuration
- [ ] __str__ method returns meaningful string
- [ ] Property methods for status checks added

---

## Task 70: Add Submission Reference

### Overview
Add the submission_reference field to store acknowledgment numbers provided by tax authorities upon successful filing. For Sri Lankan tax authorities, this includes IRD reference numbers for VAT/PAYE returns, CBSL reference numbers for EPF submissions, and ETF Board confirmation numbers. This reference number is critical for tracking and verifying submissions.

### Dependencies
- Task 69: TaxSubmission model created

### Instructions

1. **Open tax_submission.py file**
   - Navigate to TaxSubmission model definition
   - Locate field definitions section

2. **Add submission_reference field**
   - Create CharField for submission reference
   - Set max_length to 100 characters
   - Set unique=True (each reference number used once)
   - Set blank=True and null=True initially
   - Add help_text explaining it's the acknowledgment number

3. **Add reference format documentation**
   - Add comment above field explaining reference formats:
     - IRD VAT: Format "VAT-YYYY-NNNNNN"
     - IRD PAYE: Format "PAYE-YYYY-NNNNNN"
     - CBSL EPF: Format "EPF-C-YYYY-NNNNN"
     - ETF Board: Format "ETF-YYYY-NNNNN"

4. **Add reference validation method**
   - Create validate_submission_reference method
   - Check reference format matches tax type
   - Raise ValidationError if format incorrect
   - Called during model clean()

5. **Update model clean method**
   - Override clean() method if not exists
   - Call validate_submission_reference()
   - Ensure reference present if status is ACCEPTED
   - Raise ValidationError if missing on accepted status

6. **Add reference lookup method**
   - Create class method get_by_reference()
   - Takes reference number as parameter
   - Returns TaxSubmission or None
   - Used for quick reference lookups

7. **Update __str__ method**
   - Modify to include reference if present
   - Format: "{tax_type} {period} - {reference} - {status}"
   - Example: "VAT Jan 2026 - VAT-2026-001234 - ACCEPTED"

### Sri Lankan Tax Authority References

| Authority | Tax Type | Reference Format | Example |
|-----------|----------|------------------|---------|
| Inland Revenue | VAT | VAT-YYYY-NNNNNN | VAT-2026-001234 |
| Inland Revenue | PAYE | PAYE-YYYY-NNNNNN | PAYE-2026-005678 |
| CBSL | EPF | EPF-C-YYYY-NNNNN | EPF-C-2026-12345 |
| ETF Board | ETF | ETF-YYYY-NNNNN | ETF-2026-67890 |

### Reference Number Importance

| Purpose | Description |
|---------|-------------|
| **Tracking** | Unique identifier for each submission |
| **Verification** | Proves submission to authority |
| **Audit Trail** | Required for compliance audits |
| **Status Checks** | Used to query submission status |
| **Documentation** | Included in filing records |

### Expected Field Configuration
```
submission_reference:
├── Type: CharField
├── Max Length: 100
├── Unique: True
├── Blank/Null: True (initially)
├── Help Text: "Acknowledgment number from tax authority"
└── Validation: Format matches tax type
```

### Expected Outcome
- submission_reference field added to model
- Unique constraint ensures no duplicates
- Reference format validation implemented
- Lookup method for reference queries
- __str__ method includes reference

### Verification Checklist
- [ ] submission_reference CharField added
- [ ] max_length set to 100
- [ ] unique=True constraint set
- [ ] blank=True and null=True configured
- [ ] help_text explains acknowledgment number
- [ ] Comment documenting reference formats added
- [ ] validate_submission_reference method created
- [ ] clean() method validates reference
- [ ] get_by_reference() class method added
- [ ] __str__ method updated to include reference

---

## Task 71: Add Submission Date

### Overview
Add the submitted_at field to accurately record when the tax return was filed with the authority. This timestamp is crucial for tracking filing deadlines, calculating late submission penalties, and maintaining compliance records. Must distinguish between when record was created vs when actual submission occurred.

### Dependencies
- Task 69: TaxSubmission model created

### Instructions

1. **Open tax_submission.py file**
   - Navigate to TaxSubmission model definition
   - Locate field definitions section

2. **Add submitted_at field**
   - Create DateTimeField for submission timestamp
   - Set default to timezone.now (current datetime)
   - Set help_text explaining actual submission time
   - This is when return filed with authority

3. **Add submission vs creation distinction**
   - Add comment clarifying difference:
     - submitted_at: When filed with authority
     - created_at: When record created in system
   - These may differ if recorded retroactively

4. **Add deadline comparison property**
   - Create is_submitted_on_time property
   - Compare submitted_at with tax_period.due_date
   - Return True if submitted before due date
   - Return False if submitted after due date

5. **Add days late calculation method**
   - Create get_days_late() method
   - Calculate days between due_date and submitted_at
   - Return 0 if submitted on time
   - Return positive integer if late
   - Used for penalty calculations

6. **Add days early calculation method**
   - Create get_days_early() method
   - Calculate days between submitted_at and due_date
   - Return 0 if submitted late
   - Return positive integer if early
   - Useful for early filing incentives

7. **Add submission month/year properties**
   - Create submission_month property returning month name
   - Create submission_year property returning year
   - Used for filtering and reporting

8. **Update Meta ordering**
   - Ensure ordering includes '-submitted_at'
   - Most recent submissions appear first
   - Maintains chronological order

### Submission Timing Considerations

| Timing Aspect | Importance | Sri Lankan Context |
|--------------|------------|-------------------|
| **On-Time Filing** | Avoids penalties | IRD penalties apply for late VAT/PAYE |
| **Early Filing** | Good practice | No specific incentives but reduces risk |
| **Deadline Tracking** | Critical for compliance | VAT: 20th, PAYE: 15th, EPF/ETF: Last day |
| **Retroactive Entry** | May occur | Recording past submissions after system implementation |

### Sri Lankan Filing Deadlines Reference

| Tax Type | Due Date | Late Penalty (Sri Lanka) |
|----------|----------|--------------------------|
| VAT | 20th of following month | Penalty fees apply per IRD Act |
| PAYE | 15th of following month | Penalty fees apply per IRD Act |
| EPF | Last day of following month | CBSL penalties apply |
| ETF | Last day of following month | ETF Board penalties apply |

### Expected Field Configuration
```
submitted_at:
├── Type: DateTimeField
├── Default: timezone.now
├── Indexed: Yes (for queries)
├── Help Text: "Date and time return filed with authority"
└── Used For: Deadline compliance tracking
```

### Expected Outcome
- submitted_at field captures filing timestamp
- Deadline comparison methods implemented
- Days late/early calculations available
- Proper distinction from created_at
- Reporting properties added

### Verification Checklist
- [ ] submitted_at DateTimeField added
- [ ] default=timezone.now configured
- [ ] help_text explains filing timestamp
- [ ] Comment distinguishing submitted_at vs created_at
- [ ] is_submitted_on_time property created
- [ ] get_days_late() method implemented
- [ ] get_days_early() method implemented
- [ ] submission_month property added
- [ ] submission_year property added
- [ ] Meta ordering includes '-submitted_at'

---

## Task 72: Add Submission Document

### Overview
Add the confirmation_document field to store PDF or image files of official submission confirmations from tax authorities. In Sri Lankan context, this includes IRD acknowledgment letters, CBSL receipt confirmations, and ETF Board submission receipts. These documents serve as proof of filing for audits and compliance verification.

### Dependencies
- Task 69: TaxSubmission model created
- File storage configured in Django settings

### Instructions

1. **Import file handling utilities**
   - Add import for FileField from django.db.models
   - Import file validators if needed
   - Import file storage backend from settings

2. **Add confirmation_document field**
   - Create FileField for document upload
   - Set upload_to to 'tax_submissions/confirmations/'
   - Set blank=True and null=True (optional initially)
   - Add help_text explaining purpose (proof of filing)

3. **Configure file storage path structure**
   - Implement upload_to as callable function
   - Create path pattern: 'tax_submissions/{year}/{month}/{reference}.pdf'
   - Use tax_period.period_start for year/month
   - Use submission_reference for filename
   - Ensures organized file storage

4. **Add file type validation**
   - Create validate_document_type method
   - Check file extension (.pdf, .jpg, .png, .tiff)
   - Raise ValidationError for unsupported types
   - Sri Lankan authorities typically provide PDF

5. **Add file size validation**
   - Limit file size to 10MB maximum
   - Create validate_document_size method
   - Check file.size attribute
   - Raise ValidationError if exceeds limit

6. **Add document presence check**
   - Create has_confirmation_document property
   - Return True if document exists
   - Return False if no document uploaded
   - Used in admin and API responses

7. **Add document URL method**
   - Create get_document_url() method
   - Return full URL to document if exists
   - Return None if no document
   - Use Django storage backend's url() method

8. **Add document download method**
   - Create get_document_download_response() method
   - Returns HttpResponse with proper headers
   - Sets Content-Type and Content-Disposition
   - Enables direct download from API

9. **Update clean method**
   - Add validation for document if status is ACCEPTED
   - Recommend uploading confirmation for accepted returns
   - Not mandatory but best practice

10. **Configure file deletion on model delete**
    - Override delete() method
    - Delete associated file from storage
    - Prevents orphaned files in storage
    - Call super().delete() after file deletion

### Sri Lankan Tax Authority Documents

| Authority | Tax Type | Document Type | Format |
|-----------|----------|---------------|--------|
| Inland Revenue | VAT | Acknowledgment Letter | PDF |
| Inland Revenue | PAYE | Submission Receipt | PDF |
| CBSL | EPF | C-Form Receipt | PDF |
| ETF Board | ETF | Confirmation Letter | PDF |

### File Storage Structure
```
media/tax_submissions/confirmations/
├── 2026/
│   ├── 01/  (January)
│   │   ├── VAT-2026-001234.pdf
│   │   └── PAYE-2026-005678.pdf
│   ├── 02/  (February)
│   │   ├── VAT-2026-001456.pdf
│   │   └── EPF-C-2026-12345.pdf
│   └── ...
└── 2027/
    └── ...
```

### Expected Field Configuration
```
confirmation_document:
├── Type: FileField
├── Upload To: Dynamic path function
├── Blank/Null: True
├── Max Size: 10MB
├── Allowed Types: PDF, JPG, PNG, TIFF
└── Help Text: "Official confirmation from tax authority"
```

### Document Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| **File Type** | Must be PDF, JPG, PNG, or TIFF | "Unsupported file type. Use PDF, JPG, PNG, or TIFF" |
| **File Size** | Maximum 10MB | "File size exceeds 10MB limit" |
| **Best Practice** | Upload for ACCEPTED status | Warning if missing on accepted return |

### Expected Outcome
- confirmation_document field stores filing proof
- Organized file storage by year/month
- File type and size validation
- Download method for API access
- Automatic cleanup on deletion

### Verification Checklist
- [ ] FileField imports added
- [ ] confirmation_document FileField created
- [ ] upload_to dynamic path function implemented
- [ ] File storage path structure configured
- [ ] validate_document_type method created
- [ ] validate_document_size method created
- [ ] has_confirmation_document property added
- [ ] get_document_url() method implemented
- [ ] get_document_download_response() method created
- [ ] clean() method validates document on ACCEPTED status
- [ ] delete() method removes file on model deletion
- [ ] Max file size set to 10MB
- [ ] Allowed file types documented

---

## Task 73: Run TaxSubmission Migrations

### Overview
Generate and apply Django migrations for the TaxSubmission model. This creates the database table and all associated fields, indexes, and constraints. Ensures the tax submission tracking functionality is ready for use in the production environment.

### Dependencies
- Task 69: TaxSubmission model created
- Task 70: Submission reference field added
- Task 71: Submission date field added
- Task 72: Submission document field added

### Instructions

1. **Verify model imports**
   - Open `apps/accounting/models/__init__.py`
   - Ensure TaxSubmission is imported
   - Add: `from .tax_submission import TaxSubmission`
   - Ensures model is discovered by Django

2. **Check for model errors**
   - Run Django check command
   - Execute: `python manage.py check`
   - Verify no errors reported
   - Fix any issues before proceeding

3. **Generate migration file**
   - Run makemigrations command
   - Execute: `python manage.py makemigrations accounting`
   - Django will detect new TaxSubmission model
   - Review generated migration file

4. **Review migration file**
   - Open generated migration file in `apps/accounting/migrations/`
   - Expected name: `0023_taxsubmission.py` (number may vary)
   - Verify all fields present:
     - tax_period (ForeignKey)
     - submitted_by (ForeignKey)
     - submission_reference (CharField, unique)
     - submitted_at (DateTimeField)
     - confirmation_document (FileField)
     - status (CharField)
     - notes (TextField)
     - created_at (DateTimeField)
     - updated_at (DateTimeField)

5. **Verify migration dependencies**
   - Check migration depends on previous migration
   - Ensure proper dependency chain
   - Verify User model dependency if needed

6. **Review indexes and constraints**
   - Verify unique constraint on submission_reference
   - Check index on submitted_at for queries
   - Verify foreign key constraints
   - Ensure Meta options applied (ordering, verbose_name)

7. **Apply migration to development database**
   - Run migrate command
   - Execute: `python manage.py migrate accounting`
   - Django applies migration to database
   - Verify success message

8. **Verify database table**
   - Access database using management command
   - Execute: `python manage.py dbshell`
   - Check table exists: `\dt tax_submission` (PostgreSQL)
   - Verify columns: `\d tax_submission`

9. **Test model operations**
   - Open Django shell
   - Execute: `python manage.py shell`
   - Import model: `from apps.accounting.models import TaxSubmission`
   - Verify model accessible
   - Test queryset: `TaxSubmission.objects.all()`

10. **Create test submission record**
    - In Django shell, create test instance
    - Set required fields (tax_period, submitted_by)
    - Set optional fields for testing
    - Save and verify record created
    - Delete test record after verification

11. **Document migration**
    - Update project migration log if maintained
    - Note new table created
    - Record migration number and date
    - Document any special considerations

### Migration File Example Structure
```python
# Generated migration file structure
class Migration(migrations.Migration):
    
    dependencies = [
        ('accounting', '0022_taxpayeemployee'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='TaxSubmission',
            fields=[
                ('id', models.BigAutoField(...)),
                ('submission_reference', models.CharField(...)),
                ('submitted_at', models.DateTimeField(...)),
                ('confirmation_document', models.FileField(...)),
                ('status', models.CharField(...)),
                ('notes', models.TextField(...)),
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
                ('tax_period', models.ForeignKey(...)),
                ('submitted_by', models.ForeignKey(...)),
            ],
            options={
                'db_table': 'tax_submission',
                'verbose_name': 'Tax Submission',
                'ordering': ['-submitted_at'],
            },
        ),
    ]
```

### Database Table Verification

| Verification Step | Command | Expected Result |
|------------------|---------|-----------------|
| **Table exists** | `\dt tax_submission` | Table listed |
| **Columns exist** | `\d tax_submission` | All fields present |
| **Constraints** | Check unique on submission_reference | Unique constraint exists |
| **Foreign keys** | Verify tax_period and submitted_by | FK constraints present |

### Expected Outcome
- Migration file generated successfully
- Database table created with all fields
- Indexes and constraints applied
- Model accessible in Django shell
- Test record can be created and saved

### Verification Checklist
- [ ] TaxSubmission imported in models/__init__.py
- [ ] `python manage.py check` runs without errors
- [ ] Migration file generated with makemigrations
- [ ] Migration file reviewed and verified
- [ ] All fields present in migration
- [ ] Unique constraint on submission_reference verified
- [ ] Migration applied with migrate command
- [ ] Success message displayed
- [ ] Database table exists (verified in dbshell)
- [ ] All columns present in table
- [ ] Foreign key constraints configured
- [ ] Model accessible in Django shell
- [ ] Test record created and saved successfully
- [ ] Migration documented in project logs

---

## Notes for AI Agents

### TaxSubmission Model Purpose
The TaxSubmission model provides a complete audit trail of all tax returns filed with Sri Lankan tax authorities. It records who submitted the return, when it was submitted, the acknowledgment reference from the authority, and the current status. This is essential for compliance audits and deadline tracking.

### Sri Lankan Tax Authority Context
- **Inland Revenue Department (IRD):** Handles VAT and PAYE submissions
- **Central Bank of Sri Lanka (CBSL):** Handles EPF contributions
- **ETF Board:** Handles ETF contributions

Each authority provides unique acknowledgment numbers in specific formats upon successful submission.

### Submission Status Workflow
```
SUBMITTED → UNDER_REVIEW → ACCEPTED
                    ↓
                REJECTED → (Corrected and Resubmitted)
```

### Integration Points
- **TaxPeriodRecord:** Links submission to specific tax period
- **User Model:** Tracks who performed submission
- **Filing Reminder Service:** Checks for missing submissions
- **Dashboard Widget:** Displays submission status
- **API Endpoints:** Allows recording submissions from frontend

### File Storage Considerations
- Use tenant-aware file storage if multi-tenant system
- Ensure proper permissions on upload directory
- Consider cloud storage (S3, GCS) for production
- Implement file size limits to prevent abuse
- Virus scan uploaded documents in production

### Testing Considerations
- Test unique constraint on submission_reference
- Verify deadline calculations with various dates
- Test file upload and validation
- Verify status transitions
- Test retroactive submission recording
- Verify proper cascade deletion behavior

### Common Pitfalls to Avoid
- Don't auto-set submitted_at to created_at (may differ)
- Don't allow duplicate submission_reference values
- Don't delete confirmation documents without user confirmation
- Don't allow status changes without proper validation
- Ensure proper tenant filtering in multi-tenant setup
