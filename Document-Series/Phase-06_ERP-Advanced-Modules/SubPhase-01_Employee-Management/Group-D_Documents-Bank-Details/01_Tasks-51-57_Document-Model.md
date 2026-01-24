# Tasks 51-57: Employee Document Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** D - Documents & Bank Details  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-58-66_Bank-Account-Model.md](02_Tasks-58-66_Bank-Account-Model.md)

---

## Document Overview

This document covers the implementation of employee document storage functionality. Employees often need to submit various documents like contracts, resumes, NIC copies, certificates, and other files. This system provides secure storage, metadata tracking, expiry management, and visibility controls for employee documents.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Define DocumentType Choices | Low | 15 min |
| 52 | Create EmployeeDocument Model | Medium | 25 min |
| 53 | Add Document File Field | Medium | 20 min |
| 54 | Add Document Metadata Fields | Medium | 20 min |
| 55 | Add Document Expiry Fields | Low | 15 min |
| 56 | Add Document Visibility | Low | 15 min |
| 57 | Run EmployeeDocument Migrations | Low | 15 min |

---

## Task 51: Define DocumentType Choices

### Overview
Define standard document type constants that categorize different kinds of employee documents. These constants ensure consistency across the application when storing and managing employee documents, and enable proper document organization and retention policies.

### Dependencies
- Employee management app structure exists
- Constants module available

### Instructions

1. **Open or create constants.py file**
   - Navigate to `apps/employees/constants.py`
   - If file doesn't exist, create it
   - This will centralize all employee-related constants

2. **Add module docstring**
   - Add comprehensive documentation
   - Explain the purpose of document type constants
   - Note usage context (document storage, filtering, retention)

3. **Define DOCUMENT_TYPE_CHOICES constant**
   - Create tuple of document type choices
   - Follow Django's choices pattern (value, display_name)
   - Include all standard document types

4. **Define DOCUMENT_TYPE_CONTRACT constant**
   - Value: 'CONTRACT'
   - Display: 'Employment Contract'
   - Purpose: Store employment contracts
   - Retention: 7 years after employment ends

5. **Define DOCUMENT_TYPE_RESUME constant**
   - Value: 'RESUME'
   - Display: 'Resume/CV'
   - Purpose: Store employee CVs and resumes
   - Retention: Duration of employment + 3 years

6. **Define DOCUMENT_TYPE_NIC_COPY constant**
   - Value: 'NIC_COPY'
   - Display: 'NIC Copy'
   - Purpose: Store National Identity Card copies
   - Required for Sri Lankan legal compliance
   - Retention: 3 years after employment ends

7. **Define DOCUMENT_TYPE_CERTIFICATE constant**
   - Value: 'CERTIFICATE'
   - Display: 'Certificate'
   - Purpose: Educational/professional certificates
   - May have expiry dates (professional licenses)
   - Retention: Permanent for educational, varies for professional

8. **Define DOCUMENT_TYPE_OTHER constant**
   - Value: 'OTHER'
   - Display: 'Other Document'
   - Purpose: Miscellaneous documents not fitting other categories
   - Flexible retention based on document nature

### Document Type Specifications

| Constant | Value | Display Name | Primary Use | Retention Period |
|----------|-------|--------------|-------------|------------------|
| DOCUMENT_TYPE_CONTRACT | 'CONTRACT' | Employment Contract | Legal employment agreement | 7 years post-employment |
| DOCUMENT_TYPE_RESUME | 'RESUME' | Resume/CV | Initial application document | 3 years post-employment |
| DOCUMENT_TYPE_NIC_COPY | 'NIC_COPY' | NIC Copy | Identity verification | 3 years post-employment |
| DOCUMENT_TYPE_CERTIFICATE | 'CERTIFICATE' | Certificate | Qualifications proof | Varies by certificate type |
| DOCUMENT_TYPE_OTHER | 'OTHER' | Other Document | Miscellaneous files | 3 years default |

### Document Type Details

#### Employment Contract (CONTRACT)
```
Purpose:
├── Legal employment agreement
├── Terms and conditions
├── Compensation details
└── Job description

Contents:
├── Start date
├── Job title and duties
├── Salary and benefits
├── Working hours
├── Leave entitlements
├── Termination conditions
└── Signatures of both parties

Sri Lankan Requirements:
├── Must comply with Shop & Office Employees Act
├── Should reference EPF/ETF contributions
├── Include probation period terms
└── Specify notice period requirements
```

#### Resume/CV (RESUME)
```
Purpose:
├── Initial job application
├── Skill verification
├── Experience validation
└── Reference checking

Contents:
├── Personal information
├── Educational background
├── Work experience
├── Skills and competencies
├── References
└── Professional achievements

Usage:
├── Recruitment process
├── Performance reviews
├── Internal transfers
└── Promotion considerations
```

#### NIC Copy (NIC_COPY)
```
Purpose:
├── Identity verification
├── Legal compliance
├── Payroll setup (EPF/ETF)
└── Background verification

Sri Lankan Context:
├── New NIC: 12-digit number
├── Old NIC: 9 digits + V
├── Required for EPF registration
├── Required for tax purposes (TIN)
└── Validates citizenship/residency

Security:
├── Highly sensitive document
├── Should be encrypted at rest
├── Limited access (HR only)
└── Clear retention policy
```

#### Certificate (CERTIFICATE)
```
Types:
├── Educational Certificates
│   ├── O/L results
│   ├── A/L results
│   ├── Diplomas
│   └── Degrees
│
├── Professional Certifications
│   ├── CIM (Chartered Institute of Marketing)
│   ├── CIMA (Management Accountants)
│   ├── ACCA (Chartered Accountants)
│   └── Industry-specific licenses
│
└── Training Certificates
    ├── Safety training
    ├── Software certifications
    ├── Compliance training
    └── Skill development

Expiry Tracking:
├── Professional licenses (annual/biennial)
├── Safety certifications (periodic renewal)
├── First aid certificates (2-3 years)
└── Educational certificates (no expiry)
```

#### Other Documents (OTHER)
```
Examples:
├── Medical certificates (sick leave)
├── Police reports (background check)
├── Proof of address
├── Reference letters
├── Termination letters
├── Resignation letters
├── Warning letters
├── Performance reviews
├── Training materials
└── Miscellaneous correspondence
```

### Document Type Selection Guide

| Scenario | Recommended Type | Notes |
|----------|-----------------|-------|
| New employee joins | CONTRACT | Primary employment agreement |
| Recruitment stage | RESUME | Application materials |
| Identity verification | NIC_COPY | Legal requirement in Sri Lanka |
| Educational proof | CERTIFICATE | Degree, diploma, O/L, A/L |
| Professional license | CERTIFICATE | CIM, CIMA, ACCA, etc. |
| Medical leave | OTHER | Medical certificates |
| Disciplinary action | OTHER | Warning letters, investigation reports |
| Exit process | OTHER | Resignation/termination letters |

### Sri Lankan Legal Requirements

```
Mandatory Documents:
├── NIC Copy (National Identity Card)
│   └── Required for EPF registration
│
├── Employment Contract
│   ├── Must comply with labor laws
│   └── Filed with relevant authorities
│
├── Educational Certificates (if relevant to job)
│   └── Verification for professional roles
│
└── Medical Certificate (for certain industries)
    └── Food handling, childcare, healthcare
```

### Document Retention Compliance

| Document Type | Active Employment | Post-Employment | Legal Basis |
|---------------|-------------------|-----------------|-------------|
| CONTRACT | Retain | 7 years | Labor law compliance |
| RESUME | Retain | 3 years | Recruitment records |
| NIC_COPY | Retain | 3 years | EPF/ETF compliance |
| CERTIFICATE | Retain | Varies | Professional licensing |
| OTHER | Retain | 3 years default | General practice |

### Expected Outcome
- Clear document type categorization
- Consistent document type values
- Foundation for document organization
- Support for retention policies
- Sri Lankan compliance support

### Verification Checklist
- [ ] constants.py file exists
- [ ] Module docstring added
- [ ] DOCUMENT_TYPE_CHOICES tuple defined
- [ ] DOCUMENT_TYPE_CONTRACT constant created
- [ ] DOCUMENT_TYPE_RESUME constant created
- [ ] DOCUMENT_TYPE_NIC_COPY constant created
- [ ] DOCUMENT_TYPE_CERTIFICATE constant created
- [ ] DOCUMENT_TYPE_OTHER constant created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Values are in UPPER_CASE format

---

## Task 52: Create EmployeeDocument Model

### Overview
Create the core EmployeeDocument model that stores employee document records. This model serves as the foundation for document management, providing associations to employees, document type categorization, and timestamps for tracking purposes.

### Dependencies
- Task 51: Define DocumentType Choices
- Employee model exists
- User model exists (for uploaded_by tracking)
- Django ORM configured

### Instructions

1. **Create employee_document.py model file**
   - Create file at `apps/employees/models/employee_document.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TimestampMixin if available)
   - Import document type constants
   - Import Employee model
   - Import User model (Django auth)

3. **Define EmployeeDocument model class**
   - Inherit from Django models.Model
   - Include TimestampMixin if using base mixins
   - Add model docstring explaining purpose

4. **Add employee field**
   - ForeignKey to Employee model
   - on_delete=CASCADE (delete documents when employee deleted)
   - related_name='documents'
   - Required field (no blank/null)
   - Enables employee.documents.all() queries

5. **Add document_type field**
   - CharField with choices from DOCUMENT_TYPE_CHOICES
   - Max length 50 (sufficient for type values)
   - Required field (no blank/null)
   - Used for categorization and filtering

6. **Add uploaded_by field**
   - ForeignKey to User model
   - on_delete=SET_NULL (keep document if user deleted)
   - null=True, blank=True
   - related_name='uploaded_employee_documents'
   - Tracks who uploaded the document

7. **Add uploaded_at field**
   - DateTimeField with auto_now_add=True
   - Automatically set on document creation
   - Immutable timestamp
   - Used for audit trails

8. **Add Meta class**
   - Set verbose_name = 'Employee Document'
   - Set verbose_name_plural = 'Employee Documents'
   - Add ordering: ['-uploaded_at'] (newest first)
   - Add indexes on: employee, document_type, uploaded_at
   - Add unique_together if needed

9. **Add __str__ method**
   - Return meaningful string representation
   - Include employee name and document type
   - Format: "Employee Name - Document Type"

10. **Add get_document_type_display method**
    - Uses Django's built-in choices display method
    - Returns human-readable document type
    - Format: "Employment Contract" instead of "CONTRACT"

11. **Update models/__init__.py**
    - Import EmployeeDocument
    - Add to __all__ list

### EmployeeDocument Model Structure

```
┌─────────────────────────────────────────────────┐
│        EmployeeDocument Model (Core)            │
├─────────────────────────────────────────────────┤
│ Relationship Fields:                            │
│  • employee (ForeignKey → Employee)             │
│  • uploaded_by (ForeignKey → User)              │
│                                                 │
│ Classification:                                 │
│  • document_type (CharField with choices)       │
│                                                 │
│ Timestamps:                                     │
│  • uploaded_at (DateTimeField, auto)            │
│  • created_at (if using TimestampMixin)         │
│  • updated_at (if using TimestampMixin)         │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│   Employee   │◄─────────────────────│ EmployeeDocument   │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌────────────────────┐
                                      │       User         │
                                      │   (uploaded_by)    │
                                      └────────────────────┘
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| employee | ForeignKey | Yes | - | Links to employee record |
| document_type | CharField | Yes | - | Categorizes document |
| uploaded_by | ForeignKey | No | null | Tracks uploader |
| uploaded_at | DateTimeField | Yes | auto | Upload timestamp |

### Employee Relationship

```
Employee → Documents Relationship
═════════════════════════════════

Employee: EMP-0001 (John Silva)
  ├── Document 1: Employment Contract
  ├── Document 2: NIC Copy
  ├── Document 3: O/L Certificate
  ├── Document 4: A/L Certificate
  └── Document 5: Resume

Query Examples:
  employee.documents.all()           # All documents
  employee.documents.filter(         # Contracts only
      document_type='CONTRACT'
  )
  employee.documents.count()         # Total documents
```

### Document Type Distribution

```
Typical Document Count Per Employee
════════════════════════════════════

New Hire:
├── CONTRACT (1)
├── RESUME (1)
├── NIC_COPY (1)
├── CERTIFICATE (2-3)
└── Total: 5-6 documents

Experienced Employee (3+ years):
├── CONTRACT (1-2, if renewed)
├── RESUME (1)
├── NIC_COPY (1)
├── CERTIFICATE (5-10)
├── OTHER (10-20, performance reviews, etc.)
└── Total: 18-34 documents

Management Level:
├── All of the above
├── Additional professional certifications
├── Training completion certificates
├── Performance appraisals (annual)
└── Total: 40+ documents over career
```

### Document Upload Tracking

```
Upload Audit Trail
══════════════════

Document: Employment Contract
├── Uploaded by: hr_admin@company.lk
├── Uploaded at: 2026-01-15 09:30:25
├── Employee: John Silva (EMP-0001)
├── Type: CONTRACT
└── File: employment_contract_2026.pdf

Benefits of Tracking:
├── Audit compliance
├── User accountability
├── Problem investigation
├── Access control verification
└── Regulatory compliance
```

### Query Patterns

#### Get All Documents for Employee
```
Purpose: View all documents for specific employee
Filter: employee=employee_instance
Order: Most recent first

Use Cases:
├── Employee profile page
├── HR document review
├── Audit preparation
└── Document inventory
```

#### Get Documents by Type
```
Purpose: Find all documents of specific type
Filter: document_type='CONTRACT'
Order: Most recent first

Use Cases:
├── Contract renewal process
├── Certificate expiry checking
├── Document type reporting
└── Compliance verification
```

#### Get Recent Uploads
```
Purpose: Track recent document uploads
Filter: uploaded_at__gte=date_threshold
Order: Most recent first

Use Cases:
├── HR dashboard
├── Recent activity monitoring
├── Document processing queue
└── Upload verification
```

#### Get Documents by Uploader
```
Purpose: Track who uploaded what
Filter: uploaded_by=user_instance
Order: Most recent first

Use Cases:
├── User activity audit
├── Upload responsibility tracking
├── Training verification
└── Access review
```

### Expected Outcome
- Functional EmployeeDocument model
- Employee-document relationships
- Document type categorization
- Upload tracking capability
- Foundation for document management

### Verification Checklist
- [ ] employee_document.py file created
- [ ] EmployeeDocument class defined
- [ ] employee ForeignKey added
- [ ] document_type field with choices
- [ ] uploaded_by ForeignKey added
- [ ] uploaded_at field added
- [ ] Meta class configured
- [ ] Proper indexes defined
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py
- [ ] Related name set correctly

---

## Task 53: Add Document File Field

### Overview
Add the file storage field and related metadata to the EmployeeDocument model. This field handles the actual document file upload, storage path generation, and file metadata tracking including file size and MIME type.

### Dependencies
- Task 52: Create EmployeeDocument model
- Django file storage configured (local or S3)
- File upload settings in Django settings.py

### Instructions

1. **Open employee_document.py model file**
   - Navigate to `apps/employees/models/employee_document.py`
   - Locate EmployeeDocument model class

2. **Import file-related modules**
   - Import os module for path operations
   - Import File validators if needed
   - Import storage backend if using custom storage

3. **Define upload path function**
   - Create function: employee_document_upload_path
   - Accept instance and filename parameters
   - Generate organized path structure
   - Include employee ID and document type in path

4. **Add file field**
   - FileField with upload_to=employee_document_upload_path
   - Required field (no blank/null)
   - Stores actual document file
   - Supports various file formats

5. **Add file_size field**
   - PositiveIntegerField for file size in bytes
   - Null=True, blank=True initially
   - Auto-populated on file upload
   - Used for storage management and quotas

6. **Add file_type field**
   - CharField for MIME type (e.g., 'application/pdf')
   - Max length 100
   - Null=True, blank=True initially
   - Auto-detected from uploaded file
   - Used for file handling and validation

7. **Add original_filename field**
   - CharField to store original upload filename
   - Max length 255
   - Null=True, blank=True
   - Preserves user's original filename
   - Helpful for document identification

8. **Override save method**
   - Extract file size from uploaded file
   - Detect MIME type from file
   - Store original filename
   - Call parent save method

9. **Add file validation method**
   - Method: validate_file_size
   - Check maximum file size (e.g., 10MB)
   - Raise ValidationError if too large

10. **Add allowed file types validation**
    - Method: validate_file_type
    - Check allowed MIME types
    - Raise ValidationError for disallowed types

11. **Update model docstring**
    - Document file field and metadata
    - List supported file types
    - Note file size limits

### Document Upload Path Structure

```
File Storage Organization
═════════════════════════

Base Path: documents/employees/

Full Path Structure:
documents/employees/{employee_id}/{document_type}/{timestamp}_{filename}

Examples:
documents/employees/EMP-0001/contract/20260115_093025_employment_contract.pdf
documents/employees/EMP-0001/nic_copy/20260115_093045_nic_front.jpg
documents/employees/EMP-0002/certificate/20260116_141530_degree_certificate.pdf
documents/employees/EMP-0002/resume/20260116_141600_john_silva_cv.pdf

Path Components:
├── documents/employees/     (Base directory)
├── EMP-0001/               (Employee ID)
├── contract/               (Document type, lowercase)
└── 20260115_093025_employment_contract.pdf  (Timestamped file)
```

### Upload Path Function Logic

```
Function: employee_document_upload_path(instance, filename)

Steps:
1. Get employee ID from instance
   └── employee_id = instance.employee.employee_id

2. Get document type, convert to lowercase
   └── doc_type = instance.document_type.lower()

3. Generate timestamp for uniqueness
   └── timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

4. Clean filename (remove special characters)
   └── clean_name = sanitize_filename(filename)

5. Construct full path
   └── return f'documents/employees/{employee_id}/{doc_type}/{timestamp}_{clean_name}'

Benefits:
├── Organized by employee
├── Organized by document type
├── No filename conflicts (timestamp)
├── Easy to browse and manage
└── Supports backup and archival
```

### File Metadata Fields

```
┌────────────────────────────────────────────────┐
│         Document File Metadata                 │
├────────────────────────────────────────────────┤
│ Storage:                                       │
│  • file (FileField)                            │
│  • original_filename (CharField)               │
│                                                │
│ Metadata:                                      │
│  • file_size (PositiveIntegerField, bytes)     │
│  • file_type (CharField, MIME type)            │
└────────────────────────────────────────────────┘
```

### Supported File Types

| Category | MIME Types | Extensions | Use Case |
|----------|-----------|------------|----------|
| PDF Documents | application/pdf | .pdf | Contracts, certificates, official documents |
| Images | image/jpeg, image/png | .jpg, .jpeg, .png | NIC scans, photos, signatures |
| Word Documents | application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document | .doc, .docx | Resumes, letters |
| Scanned Documents | image/tiff | .tif, .tiff | Scanned certificates, contracts |

### File Size Limits

```
Recommended Limits
══════════════════

General Documents (PDF, Word):
├── Maximum: 10 MB
├── Typical: 500 KB - 2 MB
└── Warning: > 5 MB

Images (Photos, Scans):
├── Maximum: 5 MB
├── Typical: 500 KB - 1 MB
└── Recommendation: Compress before upload

System Configuration:
├── Django FILE_UPLOAD_MAX_MEMORY_SIZE: 10 MB
├── Django DATA_UPLOAD_MAX_MEMORY_SIZE: 10 MB
└── Web server (Nginx/Apache): 10 MB
```

### File Validation Examples

#### Size Validation
```
Maximum File Size: 10 MB (10,485,760 bytes)

Validation Logic:
1. Check file size on upload
2. Compare against MAX_UPLOAD_SIZE
3. Reject if exceeds limit
4. Show user-friendly error message

Error Message:
"File size exceeds maximum limit of 10 MB. 
Please compress your file and try again."
```

#### Type Validation
```
Allowed MIME Types:
├── application/pdf
├── image/jpeg
├── image/png
├── application/msword
├── application/vnd.openxmlformats-officedocument.wordprocessingml.document
└── image/tiff

Validation Logic:
1. Detect MIME type from file
2. Check against ALLOWED_FILE_TYPES
3. Reject if not in allowed list
4. Show user-friendly error message

Error Message:
"File type '.exe' is not allowed. 
Allowed types: PDF, JPG, PNG, DOC, DOCX"
```

### File Storage Backend Options

#### Local File Storage (Development)
```
Configuration:
├── MEDIA_ROOT = BASE_DIR / 'media'
├── MEDIA_URL = '/media/'
└── Storage: FileSystemStorage (default)

Pros:
├── Simple setup
├── No external dependencies
├── Fast for development
└── Easy to debug

Cons:
├── Not scalable
├── No redundancy
├── Backup complexity
└── Not suitable for production
```

#### Amazon S3 Storage (Production)
```
Configuration:
├── AWS_ACCESS_KEY_ID
├── AWS_SECRET_ACCESS_KEY
├── AWS_STORAGE_BUCKET_NAME
├── AWS_S3_REGION_NAME
└── Storage: S3Boto3Storage

Pros:
├── Scalable and reliable
├── Automatic backups
├── CDN integration
├── Cost-effective
└── Industry standard

Cons:
├── Requires AWS account
├── Internet dependency
├── Monthly costs
└── Configuration complexity
```

### File Metadata Auto-Population

```
Save Method Override
════════════════════

When document is saved with file:

1. Calculate file size
   └── file_size = uploaded_file.size

2. Detect MIME type
   └── file_type = mimetypes.guess_type(filename)[0]

3. Store original filename
   └── original_filename = uploaded_file.name

4. Save metadata to database
   └── All fields populated automatically

Benefits:
├── No manual metadata entry
├── Accurate file information
├── Storage quota tracking
└── File type validation
```

### File Access Security

```
Security Considerations
═══════════════════════

Access Control:
├── Files not directly accessible via URL
├── Require authentication to download
├── Check user permissions before serving
└── Implement view: serve_employee_document

Download Process:
1. User requests document
2. System checks authentication
3. System verifies permissions
4. System serves file or denies access

URL Pattern:
/api/employees/{employee_id}/documents/{document_id}/download/
```

### Expected Outcome
- File upload capability
- Organized storage structure
- Automatic metadata tracking
- File size and type validation
- Secure file storage

### Verification Checklist
- [ ] Upload path function defined
- [ ] file field added with upload_to
- [ ] file_size field added
- [ ] file_type field added
- [ ] original_filename field added
- [ ] save method overridden for metadata
- [ ] File size validation implemented
- [ ] File type validation implemented
- [ ] Storage backend configured
- [ ] File access security considered
- [ ] Model docstring updated

---

## Task 54: Add Document Metadata Fields

### Overview
Add descriptive metadata fields to the EmployeeDocument model. These fields provide human-readable information about each document, including title, description, and purpose. Proper metadata improves document organization, searchability, and user understanding.

### Dependencies
- Task 53: Add document file field

### Instructions

1. **Open employee_document.py model file**
   - Continue in `apps/employees/models/employee_document.py`
   - Locate EmployeeDocument model class

2. **Add title field**
   - CharField with max_length=200
   - Required field (no blank)
   - Human-readable document name
   - Example: "Employment Contract 2026", "NIC Front Copy"

3. **Add description field**
   - TextField for detailed description
   - Optional (blank=True, null=True)
   - Explain document contents or purpose
   - Can include notes about document significance

4. **Add notes field**
   - TextField for internal notes
   - Optional (blank=True, null=True)
   - HR team can add processing notes
   - Not visible to employee

5. **Add is_verified field**
   - BooleanField, default=False
   - Indicates document has been reviewed
   - Important for compliance documents

6. **Add verified_by field**
   - ForeignKey to User model
   - on_delete=SET_NULL, null=True, blank=True
   - Tracks who verified the document
   - related_name='verified_employee_documents'

7. **Add verified_at field**
   - DateTimeField, null=True, blank=True
   - Timestamp when verification occurred
   - Used for audit trails

8. **Add verification_notes field**
   - TextField, optional (blank=True, null=True)
   - Notes from verification process
   - Any issues or observations

9. **Add document status field**
   - CharField with choices
   - Options: PENDING, APPROVED, REJECTED
   - Default: PENDING
   - Workflow status tracking

10. **Add helper methods**
    - Method: mark_as_verified(user)
    - Method: mark_as_approved(user)
    - Method: mark_as_rejected(user, reason)

11. **Update model docstring**
    - Document all metadata fields
    - Explain verification workflow
    - Note field usage guidelines

### Document Metadata Structure

```
┌────────────────────────────────────────────────┐
│         Document Metadata Fields               │
├────────────────────────────────────────────────┤
│ Descriptive:                                   │
│  • title (CharField, 200)                      │
│  • description (TextField, optional)           │
│  • notes (TextField, optional, internal)       │
│                                                │
│ Verification:                                  │
│  • is_verified (BooleanField)                  │
│  • verified_by (ForeignKey to User)            │
│  • verified_at (DateTimeField)                 │
│  • verification_notes (TextField, optional)    │
│                                                │
│ Status:                                        │
│  • document_status (CharField with choices)    │
└────────────────────────────────────────────────┘
```

### Document Status Workflow

```
Document Lifecycle States
═════════════════════════

PENDING → Initial state after upload
   │
   ├──→ APPROVED → Document verified and accepted
   │
   └──→ REJECTED → Document not acceptable, reupload needed

Status Transitions:
├── PENDING → APPROVED (HR verification)
├── PENDING → REJECTED (Issues found)
└── REJECTED → PENDING (Reupload new version)
```

### Title Field Examples

| Document Type | Good Title Examples | Poor Title Examples |
|--------------|-------------------|-------------------|
| CONTRACT | "Employment Contract 2026", "Contract Renewal 2026" | "contract", "doc1" |
| RESUME | "John Silva CV 2026", "Updated Resume January 2026" | "resume", "cv" |
| NIC_COPY | "NIC Front Copy", "NIC Back Copy", "New NIC" | "nic", "id" |
| CERTIFICATE | "BSc Computer Science Degree", "O/L Certificate 2018" | "cert", "certificate1" |
| OTHER | "Medical Certificate - Sick Leave Jan 2026" | "other", "file" |

### Description Field Examples

#### Employment Contract
```
Title: Employment Contract 2026
Description:
Main employment agreement for permanent position as Senior 
Software Engineer. Contract term: 2 years (Jan 2026 - Jan 2028).
Includes salary details, benefits, leave entitlements, and 
termination clauses. Signed by both employee and Director HR.
```

#### Educational Certificate
```
Title: BSc Computer Science Degree
Description:
Bachelor of Science degree in Computer Science from University 
of Colombo, graduated July 2020 with Second Class Upper Division.
Final GPA: 3.45/4.00. Required for senior-level technical position.
```

#### NIC Copy
```
Title: NIC Front Copy
Description:
National Identity Card (new format) front side scan. 
NIC Number: 199012345678. Required for EPF registration 
and payroll setup. Verified against original on 2026-01-15.
```

### Verification Workflow

```
Document Verification Process
═════════════════════════════

Step 1: Employee uploads document
├── document_status = PENDING
├── is_verified = False
└── Awaiting HR review

Step 2: HR reviews document
├── Check document quality
├── Verify authenticity
├── Compare with original (if applicable)
└── Check completeness

Step 3: Verification decision
├── Option A: Approve
│   ├── is_verified = True
│   ├── verified_by = Current HR user
│   ├── verified_at = Current timestamp
│   ├── document_status = APPROVED
│   └── verification_notes = "Verified against original"
│
└── Option B: Reject
    ├── is_verified = False
    ├── document_status = REJECTED
    ├── verification_notes = "Document unclear, please reupload"
    └── Notify employee to reupload

Step 4: If rejected, employee reuploads
├── Upload new version (new document record)
└── Status back to PENDING
```

### Verification Scenarios

#### Scenario 1: NIC Verification
```
Document: NIC Copy
Process:
1. Employee uploads NIC scan
2. HR receives notification
3. HR checks:
   ├── Is image clear and readable?
   ├── Is NIC number visible?
   ├── Does name match employee record?
   └── Is document authentic?
4. HR compares with physical NIC
5. If all checks pass:
   ├── Mark as verified
   ├── Add note: "Verified against original NIC on 2026-01-15"
   └── Status: APPROVED
```

#### Scenario 2: Contract Verification
```
Document: Employment Contract
Process:
1. HR uploads signed contract
2. Senior HR or Legal reviews
3. Checks:
   ├── All pages present?
   ├── Signatures present?
   ├── Correct employee details?
   └── Terms match offer letter?
4. If complete:
   ├── Mark as verified
   ├── Add note: "Complete contract with all signatures"
   └── Status: APPROVED
```

#### Scenario 3: Certificate Verification
```
Document: Degree Certificate
Process:
1. Employee uploads certificate scan
2. HR reviews document
3. Checks:
   ├── Is document official?
   ├── Institution name visible?
   ├── Graduation date present?
   ├── Matches resume information?
   └── Need to verify with institution?
4. If verification needed:
   ├── Contact institution
   ├── Wait for confirmation
   └── Then mark as verified
5. Final verification:
   ├── Mark as verified
   ├── Add note: "Verified with University of Colombo on 2026-01-20"
   └── Status: APPROVED
```

### Internal Notes vs Verification Notes

| Field | Purpose | Visibility | Examples |
|-------|---------|------------|----------|
| notes | General internal notes | HR only | "Requested during onboarding", "Renewal due next year" |
| verification_notes | Specific verification findings | HR only | "Verified against original", "Document unclear, requested reupload" |
| description | Document explanation | Employee & HR | "Employment contract for permanent position starting Jan 2026" |

### Helper Methods Usage

#### mark_as_verified Method
```
Purpose: Mark document as verified by HR user

Parameters:
├── user: User instance (who is verifying)
└── notes: Optional verification notes

Actions:
├── Set is_verified = True
├── Set verified_by = user
├── Set verified_at = current timestamp
├── Set document_status = APPROVED
├── Add verification_notes if provided
└── Save record

Usage Example:
document.mark_as_verified(
    user=request.user,
    notes="Verified against original NIC"
)
```

#### mark_as_approved Method
```
Purpose: Approve document without full verification

Parameters:
├── user: User instance (who is approving)
└── notes: Optional approval notes

Actions:
├── Set document_status = APPROVED
├── Set verified_by = user
├── Set verified_at = current timestamp
└── Save record

Usage Example:
document.mark_as_approved(
    user=request.user,
    notes="Document acceptable for HR records"
)
```

#### mark_as_rejected Method
```
Purpose: Reject document with reason

Parameters:
├── user: User instance (who is rejecting)
└── reason: Rejection reason (required)

Actions:
├── Set document_status = REJECTED
├── Set verified_by = user
├── Set verified_at = current timestamp
├── Set verification_notes = reason
└── Save record

Usage Example:
document.mark_as_rejected(
    user=request.user,
    reason="Document image is unclear. Please upload a clearer scan."
)
```

### Expected Outcome
- Rich document metadata
- Clear verification workflow
- Audit trail for document review
- Helper methods for common operations
- Improved document management

### Verification Checklist
- [ ] title field added
- [ ] description field added
- [ ] notes field added
- [ ] is_verified field added
- [ ] verified_by ForeignKey added
- [ ] verified_at field added
- [ ] verification_notes field added
- [ ] document_status field with choices
- [ ] mark_as_verified method implemented
- [ ] mark_as_approved method implemented
- [ ] mark_as_rejected method implemented
- [ ] Model docstring updated

---

## Task 55: Add Document Expiry Fields

### Overview
Add expiry date tracking fields to the EmployeeDocument model. Many documents like professional licenses, training certificates, work permits, and medical certificates have expiry dates that require monitoring. This system enables proactive renewal management and compliance tracking.

### Dependencies
- Task 54: Add document metadata fields

### Instructions

1. **Open employee_document.py model file**
   - Continue in `apps/employees/models/employee_document.py`
   - Locate EmployeeDocument model class

2. **Add issue_date field**
   - DateField for document issue/effective date
   - Optional (null=True, blank=True)
   - Not all documents have issue dates
   - Example: Certificate issue date, contract start date

3. **Add expiry_date field**
   - DateField for document expiration
   - Optional (null=True, blank=True)
   - Only applicable to certain document types
   - Example: License expiry, certificate validity end

4. **Add is_expiring_soon property**
   - Read-only property (not database field)
   - Returns True if expiring within 30 days
   - Returns False if no expiry or expired
   - Used for alerts and notifications

5. **Add is_expired property**
   - Read-only property (not database field)
   - Returns True if past expiry date
   - Returns False if no expiry date set
   - Used for compliance checking

6. **Add days_until_expiry property**
   - Read-only property (not database field)
   - Returns number of days until expiry
   - Returns None if no expiry date
   - Negative value if already expired

7. **Add validity_period property**
   - Read-only property (not database field)
   - Returns duration between issue and expiry
   - Returns None if either date missing
   - Useful for renewal processing

8. **Add expiry alert method**
   - Method: get_expiry_alert_level
   - Returns: 'expired', 'warning', 'expiring_soon', 'ok', 'none'
   - Based on days remaining
   - Used for UI color coding

9. **Add index on expiry_date**
   - Database index for efficient expiry queries
   - Supports expiry reports and alerts
   - Improves query performance

10. **Update model docstring**
    - Document expiry tracking fields
    - Explain property methods
    - Note expiry alert thresholds

### Document Expiry Fields Structure

```
┌────────────────────────────────────────────────┐
│         Document Expiry Tracking               │
├────────────────────────────────────────────────┤
│ Date Fields:                                   │
│  • issue_date (DateField, optional)            │
│  • expiry_date (DateField, optional)           │
│                                                │
│ Computed Properties:                           │
│  • is_expired (Boolean)                        │
│  • is_expiring_soon (Boolean)                  │
│  • days_until_expiry (Integer)                 │
│  • validity_period (timedelta)                 │
│  • get_expiry_alert_level (String)             │
└────────────────────────────────────────────────┘
```

### Documents with Expiry Dates

| Document Type | Has Expiry | Typical Validity | Renewal Required |
|--------------|-----------|------------------|------------------|
| Professional License (CIM, CIMA) | Yes | 1-2 years | Yes |
| First Aid Certificate | Yes | 2-3 years | Yes |
| Food Handlers Certificate | Yes | 1 year | Yes |
| Medical Fitness Certificate | Yes | 1 year | Yes |
| Work Permit (Foreigners) | Yes | 1-2 years | Yes |
| Employment Contract | Conditional | 1-3 years | Sometimes |
| Safety Training Certificate | Yes | 2 years | Yes |
| Educational Certificates | No | Permanent | No |
| NIC Copy | No | Permanent | No |
| Resume | No | - | No |

### Expiry Alert Levels

```
Alert Level Thresholds
══════════════════════

EXPIRED:
├── Condition: expiry_date < today
├── Days: Negative value
├── Action: Immediate renewal required
└── UI Color: Red

WARNING:
├── Condition: 1-15 days until expiry
├── Action: Urgent renewal needed
└── UI Color: Orange

EXPIRING_SOON:
├── Condition: 16-30 days until expiry
├── Action: Plan renewal
└── UI Color: Yellow

OK:
├── Condition: > 30 days until expiry
├── Action: No action needed
└── UI Color: Green

NONE:
├── Condition: No expiry date set
├── Action: N/A
└── UI Color: Gray
```

### Expiry Tracking Examples

#### Example 1: Professional License (CIMA)
```
Document: CIMA Practicing Certificate
├── issue_date: 2025-07-01
├── expiry_date: 2026-06-30
├── validity_period: 365 days (1 year)
│
└── Status Checks (as of 2026-01-24):
    ├── is_expired: False
    ├── is_expiring_soon: False
    ├── days_until_expiry: 157 days
    └── get_expiry_alert_level(): "ok"

Future Status (as of 2026-06-15):
    ├── is_expired: False
    ├── is_expiring_soon: True
    ├── days_until_expiry: 15 days
    └── get_expiry_alert_level(): "warning"
```

#### Example 2: First Aid Certificate
```
Document: First Aid Training Certificate
├── issue_date: 2024-03-15
├── expiry_date: 2026-03-15
├── validity_period: 730 days (2 years)
│
└── Status Checks (as of 2026-01-24):
    ├── is_expired: False
    ├── is_expiring_soon: False
    ├── days_until_expiry: 50 days
    └── get_expiry_alert_level(): "ok"

Future Status (as of 2026-03-01):
    ├── is_expired: False
    ├── is_expiring_soon: True
    ├── days_until_expiry: 14 days
    └── get_expiry_alert_level(): "warning"
```

#### Example 3: Expired Medical Certificate
```
Document: Medical Fitness Certificate
├── issue_date: 2025-01-10
├── expiry_date: 2026-01-10
├── validity_period: 365 days (1 year)
│
└── Status Checks (as of 2026-01-24):
    ├── is_expired: True
    ├── is_expiring_soon: False (already expired)
    ├── days_until_expiry: -14 days
    └── get_expiry_alert_level(): "expired"
```

### Expiry Alert System

```
Proactive Expiry Management
═══════════════════════════

30 Days Before Expiry:
├── Send notification to employee
├── Send notification to HR
├── Status: "Expiring Soon"
└── Action: Initiate renewal process

15 Days Before Expiry:
├── Send reminder to employee
├── Send reminder to HR and manager
├── Status: "Warning"
└── Action: Urgent renewal needed

On Expiry Date:
├── Send alert to all stakeholders
├── Status: "Expired"
├── Action: Immediate action required
└── May restrict certain system access

Post-Expiry Handling:
├── Flag employee record
├── Report to compliance team
├── Follow up daily until renewed
└── Document compliance breach
```

### Renewal Workflow

```
Certificate Renewal Process
═══════════════════════════

Step 1: Expiry Alert (30 days)
├── System detects expiring certificate
└── Notification sent to employee

Step 2: Employee Action
├── Employee attends renewal training/exam
└── Obtains new certificate

Step 3: Upload New Certificate
├── Employee uploads renewed certificate
├── New document record created
├── New issue_date and expiry_date set
└── Old certificate marked as superseded

Step 4: HR Verification
├── HR verifies new certificate
├── Marks as verified
└── System updates employee compliance status

Step 5: Archive Old Certificate
├── Old certificate retained for records
├── Marked as "superseded" or "replaced"
└── No longer active for compliance
```

### Expiry Queries

#### Documents Expiring Soon (Next 30 Days)
```
Purpose: Find documents requiring renewal attention

Filter Logic:
├── expiry_date__isnull=False
├── expiry_date__gte=today
├── expiry_date__lte=today + 30 days
└── Order by: expiry_date (soonest first)

Use Cases:
├── Daily expiry report
├── Renewal planning
├── Compliance dashboard
└── HR notifications
```

#### Expired Documents
```
Purpose: Find non-compliant documents

Filter Logic:
├── expiry_date__isnull=False
├── expiry_date__lt=today
└── Order by: expiry_date (oldest first)

Use Cases:
├── Compliance violations report
├── Urgent action list
├── Employee restrictions
└── Management escalation
```

#### Documents by Validity Period
```
Purpose: Analyze renewal patterns

Filter Logic:
├── issue_date__isnull=False
├── expiry_date__isnull=False
├── Calculate: validity_period = expiry_date - issue_date
└── Group by: validity_period

Use Cases:
├── Renewal scheduling
├── Training planning
├── Budget forecasting
└── Vendor contract management
```

### Sri Lankan Context

#### Professional Licenses
```
Common Professional Certifications:
├── CIMA (Chartered Management Accountant)
│   └── Annual renewal required
│
├── CIM (Chartered Institute of Marketing)
│   └── Annual renewal required
│
├── ACCA (Association of Chartered Certified Accountants)
│   └── Annual renewal required
│
└── Engineering Council License
    └── Annual renewal required
```

#### Safety Certificates
```
Workplace Safety Requirements:
├── First Aid Certificate
│   └── Validity: 2-3 years
│
├── Fire Safety Training
│   └── Validity: 2 years
│
├── Occupational Health & Safety
│   └── Validity: 2 years
│
└── Food Handlers Certificate (if applicable)
    └── Validity: 1 year
```

### Expected Outcome
- Expiry date tracking
- Automated expiry alerts
- Renewal workflow support
- Compliance monitoring
- Proactive certificate management

### Verification Checklist
- [ ] issue_date field added
- [ ] expiry_date field added
- [ ] is_expired property implemented
- [ ] is_expiring_soon property implemented
- [ ] days_until_expiry property implemented
- [ ] validity_period property implemented
- [ ] get_expiry_alert_level method implemented
- [ ] Database index on expiry_date
- [ ] Expiry alert thresholds defined
- [ ] Model docstring updated

---

## Task 56: Add Document Visibility

### Overview
Add visibility and sensitivity control fields to the EmployeeDocument model. Some documents contain sensitive information and should have restricted access. This system enables fine-grained control over who can view each document, supporting privacy regulations and HR best practices.

### Dependencies
- Task 55: Add document expiry fields

### Instructions

1. **Open employee_document.py model file**
   - Continue in `apps/employees/models/employee_document.py`
   - Locate EmployeeDocument model class

2. **Add is_sensitive field**
   - BooleanField, default=False
   - Marks document as containing sensitive information
   - Restricts access to authorized personnel only
   - Examples: Medical records, disciplinary documents

3. **Add visible_to_employee field**
   - BooleanField, default=True
   - Controls if employee can view their own document
   - Some documents should be HR-only
   - Examples: Reference checks, background investigations

4. **Add visible_to_manager field**
   - BooleanField, default=False
   - Controls if employee's manager can view
   - Performance-related documents may be shared
   - Examples: Training certificates, performance reviews

5. **Add visible_to_department_hr field**
   - BooleanField, default=True
   - Controls if department HR can view
   - Most documents accessible to department HR
   - Departmental HR coordinators

6. **Add access_log field**
   - JSONField, default=list
   - Stores who accessed document and when
   - Format: [{'user': user_id, 'timestamp': datetime, 'action': 'view'}]
   - Audit trail for sensitive documents

7. **Add access_restricted_to field**
   - ManyToManyField to User model
   - Additional users granted access
   - Flexible access control
   - Related name: 'accessible_employee_documents'

8. **Add can_be_viewed_by method**
   - Method: can_be_viewed_by(user)
   - Returns True if user can view document
   - Checks all visibility rules
   - Central access control logic

9. **Add log_access method**
   - Method: log_access(user, action='view')
   - Records document access
   - Appends to access_log
   - Timestamp and user tracking

10. **Add helper methods for sensitivity**
    - Method: mark_as_sensitive()
    - Method: mark_as_public()
    - Method: grant_access_to(user)
    - Method: revoke_access_from(user)

11. **Update model docstring**
    - Document visibility controls
    - Explain access rules
    - Note privacy considerations

### Document Visibility Structure

```
┌────────────────────────────────────────────────┐
│         Document Visibility Controls           │
├────────────────────────────────────────────────┤
│ Sensitivity:                                   │
│  • is_sensitive (BooleanField)                 │
│                                                │
│ Visibility Flags:                              │
│  • visible_to_employee (BooleanField)          │
│  • visible_to_manager (BooleanField)           │
│  • visible_to_department_hr (BooleanField)     │
│                                                │
│ Access Control:                                │
│  • access_restricted_to (ManyToMany → User)    │
│  • access_log (JSONField)                      │
│                                                │
│ Methods:                                       │
│  • can_be_viewed_by(user)                      │
│  • log_access(user, action)                    │
│  • mark_as_sensitive()                         │
│  • grant_access_to(user)                       │
└────────────────────────────────────────────────┘
```

### Sensitivity Classification

| Sensitivity Level | Document Types | Access Level |
|------------------|---------------|--------------|
| **Highly Sensitive** | Medical records, salary negotiations, disciplinary actions | Director HR, assigned HR only |
| **Sensitive** | Performance reviews, background checks, references | HR team, direct manager (selective) |
| **Confidential** | Contracts, NIC copies, personal information | HR team, employee |
| **Public** | Training certificates, general correspondence | Employee, manager, HR |

### Visibility Scenarios

#### Scenario 1: Employment Contract (Confidential)
```
Document: Employment Contract
├── is_sensitive: False
├── visible_to_employee: True
├── visible_to_manager: False
├── visible_to_department_hr: True
│
└── Access Rules:
    ├── Employee: ✓ Can view own contract
    ├── Manager: ✗ Cannot view
    ├── Department HR: ✓ Can view
    ├── Director HR: ✓ Can view (admin access)
    └── Other employees: ✗ Cannot view
```

#### Scenario 2: Medical Certificate (Highly Sensitive)
```
Document: Medical Certificate (detailed diagnosis)
├── is_sensitive: True
├── visible_to_employee: True
├── visible_to_manager: False
├── visible_to_department_hr: False
├── access_restricted_to: [hr_director, assigned_hr_officer]
│
└── Access Rules:
    ├── Employee: ✓ Can view own medical record
    ├── Manager: ✗ Cannot view (privacy)
    ├── Department HR: ✗ Cannot view (restricted)
    ├── HR Director: ✓ Explicitly granted access
    ├── Assigned HR Officer: ✓ Explicitly granted access
    └── Other users: ✗ Cannot view
```

#### Scenario 3: Training Certificate (Public)
```
Document: First Aid Training Certificate
├── is_sensitive: False
├── visible_to_employee: True
├── visible_to_manager: True
├── visible_to_department_hr: True
│
└── Access Rules:
    ├── Employee: ✓ Can view
    ├── Manager: ✓ Can view (relevant for team safety)
    ├── Department HR: ✓ Can view
    ├── HR Team: ✓ Can view
    └── Other employees: ✗ Cannot view
```

#### Scenario 4: Disciplinary Action (Highly Sensitive)
```
Document: Written Warning Letter
├── is_sensitive: True
├── visible_to_employee: True (must be aware)
├── visible_to_manager: True (issued by manager)
├── visible_to_department_hr: True
│
└── Access Rules:
    ├── Employee: ✓ Must see own disciplinary records
    ├── Manager: ✓ Issued the warning
    ├── Department HR: ✓ HR oversight
    ├── HR Director: ✓ Admin access
    └── Other users: ✗ Strictly confidential
```

#### Scenario 5: Background Check (HR Only)
```
Document: Background Verification Report
├── is_sensitive: True
├── visible_to_employee: False (pre-hire screening)
├── visible_to_manager: False
├── visible_to_department_hr: False
├── access_restricted_to: [hr_director, recruitment_lead]
│
└── Access Rules:
    ├── Employee: ✗ Cannot view (recruitment document)
    ├── Manager: ✗ Cannot view
    ├── Department HR: ✗ Cannot view (restricted)
    ├── HR Director: ✓ Explicitly granted
    ├── Recruitment Lead: ✓ Explicitly granted
    └── Other users: ✗ Cannot view
```

### Access Control Logic

```
Access Decision Flow: can_be_viewed_by(user)
════════════════════════════════════════════

Step 1: Check if user is system admin
├── If admin: return True
└── Admins have full access

Step 2: Check if user is HR Director
├── If HR Director: return True
└── HR Directors have access to all employee docs

Step 3: Check if user owns the document (employee)
├── If user == document.employee.user:
│   └── Return visible_to_employee
└── Employee access controlled by flag

Step 4: Check if user is employee's manager
├── If user == document.employee.manager:
│   └── Return visible_to_manager
└── Manager access controlled by flag

Step 5: Check if user is department HR
├── If user in department HR role:
│   └── Return visible_to_department_hr
└── Department HR access controlled by flag

Step 6: Check explicit access grants
├── If user in access_restricted_to:
│   └── Return True
└── Explicit grants override other rules

Step 7: Default deny
└── Return False (no access)
```

### Access Logging

```
Access Log Structure
════════════════════

Format: JSON array of access records

Example:
[
  {
    "user_id": 42,
    "username": "hr_admin@company.lk",
    "timestamp": "2026-01-24T09:30:15Z",
    "action": "view",
    "ip_address": "192.168.1.10"
  },
  {
    "user_id": 15,
    "username": "director_hr@company.lk",
    "timestamp": "2026-01-24T14:15:30Z",
    "action": "download",
    "ip_address": "192.168.1.25"
  }
]

Logged Actions:
├── view: Document viewed online
├── download: Document downloaded
├── print: Document printed
└── export: Document exported to PDF/email
```

### Privacy and Compliance

#### Sri Lankan Personal Data Protection
```
Data Protection Considerations:
├── Personal data must be protected
├── Access logs for audit trails
├── Consent for data collection
├── Right to access own data
└── Right to request data deletion

Employee Rights:
├── View own documents (except pre-hire)
├── Request document removal (with HR approval)
├── Know who accessed their documents
└── Dispute incorrect information
```

#### Retention and Deletion
```
Document Retention Rules:
├── Active employment: Retain all documents
│
├── Post-employment:
│   ├── Contracts: 7 years
│   ├── Payroll records: 10 years
│   ├── NIC copies: 3 years
│   ├── Other: 3 years default
│   └── Delete after retention period
│
└── Right to be forgotten:
    ├── Employee can request data deletion
    ├── Must comply with legal retention first
    └── Anonymize after legal period ends
```

### Document Visibility Matrix

| Document Type | Employee | Manager | Dept HR | HR Director | Notes |
|--------------|----------|---------|---------|-------------|-------|
| Employment Contract | ✓ | ✗ | ✓ | ✓ | Confidential terms |
| Resume/CV | ✓ | ✓ | ✓ | ✓ | General access |
| NIC Copy | ✓ | ✗ | ✓ | ✓ | Sensitive ID |
| Educational Cert | ✓ | ✓ | ✓ | ✓ | Verification |
| Professional License | ✓ | ✓ | ✓ | ✓ | Public certification |
| Medical Certificate | ✓ | ✗ | ✗ | ✓ | Highly sensitive |
| Performance Review | ✓ | ✓ | ✓ | ✓ | Feedback document |
| Disciplinary Action | ✓ | ✓ | ✓ | ✓ | Must inform employee |
| Background Check | ✗ | ✗ | ✗ | ✓ | Pre-hire only |
| Reference Check | ✗ | ✗ | ✗ | ✓ | Confidential |

### Helper Methods Usage

#### mark_as_sensitive
```
Purpose: Mark document as sensitive with restricted access

Actions:
├── Set is_sensitive = True
├── Set visible_to_employee = True (usually)
├── Set visible_to_manager = False
├── Set visible_to_department_hr = False
└── Clear access_restricted_to (reset explicit grants)

Usage:
document.mark_as_sensitive()
```

#### grant_access_to
```
Purpose: Grant specific user access to document

Parameters:
└── user: User instance to grant access

Actions:
├── Add user to access_restricted_to
├── Save document
└── Log access grant

Usage:
document.grant_access_to(hr_director_user)
```

#### log_access
```
Purpose: Record document access for audit trail

Parameters:
├── user: User who accessed
├── action: Type of access (view, download, print)
└── ip_address: Optional IP address

Actions:
├── Create access log entry
├── Append to access_log JSON field
└── Save document

Usage:
document.log_access(
    user=request.user,
    action='download',
    ip_address=request.META.get('REMOTE_ADDR')
)
```

### Expected Outcome
- Fine-grained access control
- Sensitive document protection
- Audit trail for document access
- Privacy compliance support
- Flexible visibility rules

### Verification Checklist
- [ ] is_sensitive field added
- [ ] visible_to_employee field added
- [ ] visible_to_manager field added
- [ ] visible_to_department_hr field added
- [ ] access_log JSONField added
- [ ] access_restricted_to ManyToMany added
- [ ] can_be_viewed_by method implemented
- [ ] log_access method implemented
- [ ] mark_as_sensitive method implemented
- [ ] grant_access_to method implemented
- [ ] revoke_access_from method implemented
- [ ] Privacy considerations documented
- [ ] Model docstring updated

---

## Task 57: Run EmployeeDocument Migrations

### Overview
Generate and apply Django migrations for the EmployeeDocument model. This task creates the database schema for document storage, including all fields, indexes, and relationships defined in previous tasks.

### Dependencies
- Task 51: Define DocumentType Choices
- Task 52: Create EmployeeDocument model
- Task 53: Add document file field
- Task 54: Add document metadata fields
- Task 55: Add document expiry fields
- Task 56: Add document visibility
- All model code complete and tested

### Instructions

1. **Verify model implementation**
   - Review EmployeeDocument model code
   - Check all fields defined correctly
   - Verify all imports present
   - Ensure no syntax errors

2. **Check model is registered**
   - Verify model imported in `models/__init__.py`
   - Check model added to `__all__` list
   - Ensure employees app in INSTALLED_APPS

3. **Generate migration file**
   - Run makemigrations command
   - Command: `python manage.py makemigrations employees`
   - Review generated migration file
   - Check field definitions accurate

4. **Review migration file**
   - Open generated migration file
   - Verify all fields present
   - Check indexes created correctly
   - Verify foreign key relationships
   - Check default values appropriate

5. **Apply migration to database**
   - Run migrate command
   - Command: `python manage.py migrate employees`
   - Verify migration applied successfully
   - Check no errors in output

6. **Verify database schema**
   - Connect to database
   - Check table created: `employees_employeedocument`
   - Verify all columns present
   - Check indexes created
   - Verify foreign key constraints

7. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import EmployeeDocument model
   - Try creating test instance
   - Verify save operation works
   - Test relationships and queries

8. **Create database indexes**
   - Verify indexes on frequently queried fields:
     - employee (foreign key)
     - document_type
     - uploaded_at
     - expiry_date
     - is_verified
   - Check index creation in migration

9. **Update migration tracking**
   - Note migration number (e.g., 0007_employeedocument.py)
   - Update documentation with migration info
   - Add to version control

10. **Rollback test (optional)**
    - Test migration rollback
    - Command: `python manage.py migrate employees <previous_migration>`
    - Verify rollback successful
    - Re-apply migration: `python manage.py migrate employees`

### Migration Generation

```
Command: Generate Migration
════════════════════════════

$ python manage.py makemigrations employees

Expected Output:
Migrations for 'employees':
  employees/migrations/0007_employeedocument.py
    - Create model EmployeeDocument
    - Add field employee
    - Add field document_type
    - Add field title
    - Add field description
    - Add field file
    - Add field file_size
    - Add field file_type
    - Add field original_filename
    - Add field issue_date
    - Add field expiry_date
    - Add field is_sensitive
    - Add field visible_to_employee
    - Add field visible_to_manager
    - Add field visible_to_department_hr
    - Add field uploaded_by
    - Add field uploaded_at
    - Add field is_verified
    - Add field verified_by
    - Add field verified_at
    - Add field verification_notes
    - Add field access_log
    - Add field access_restricted_to
    - Add indexes
```

### Migration Application

```
Command: Apply Migration
════════════════════════

$ python manage.py migrate employees

Expected Output:
Running migrations:
  Applying employees.0007_employeedocument... OK

Database Changes:
├── Table created: employees_employeedocument
├── Indexes created: 5-8 indexes
├── Foreign keys created: 3 relationships
└── Constraints applied: field constraints
```

### Database Schema Verification

```
Table: employees_employeedocument
═════════════════════════════════

Columns:
├── id (BigAutoField, Primary Key)
├── employee_id (BigInteger, Foreign Key)
├── document_type (VARCHAR(50))
├── title (VARCHAR(200))
├── description (TEXT, nullable)
├── notes (TEXT, nullable)
├── file (VARCHAR(100))
├── file_size (INTEGER, nullable)
├── file_type (VARCHAR(100), nullable)
├── original_filename (VARCHAR(255), nullable)
├── issue_date (DATE, nullable)
├── expiry_date (DATE, nullable)
├── is_sensitive (BOOLEAN, default False)
├── visible_to_employee (BOOLEAN, default True)
├── visible_to_manager (BOOLEAN, default False)
├── visible_to_department_hr (BOOLEAN, default True)
├── uploaded_by_id (BigInteger, Foreign Key, nullable)
├── uploaded_at (TIMESTAMP)
├── is_verified (BOOLEAN, default False)
├── verified_by_id (BigInteger, Foreign Key, nullable)
├── verified_at (TIMESTAMP, nullable)
├── verification_notes (TEXT, nullable)
├── access_log (JSON, nullable)
├── created_at (TIMESTAMP, auto)
└── updated_at (TIMESTAMP, auto)

Indexes:
├── PRIMARY KEY (id)
├── INDEX idx_employee (employee_id)
├── INDEX idx_document_type (document_type)
├── INDEX idx_uploaded_at (uploaded_at)
├── INDEX idx_expiry_date (expiry_date)
├── INDEX idx_is_verified (is_verified)
└── INDEX idx_composite (employee_id, document_type)

Foreign Keys:
├── FK employee_id → employees_employee.id
├── FK uploaded_by_id → auth_user.id
└── FK verified_by_id → auth_user.id

Many-to-Many:
└── Table: employees_employeedocument_access_restricted_to
    ├── id (Primary Key)
    ├── employeedocument_id (Foreign Key)
    └── user_id (Foreign Key)
```

### Django Shell Testing

```
Test Model in Django Shell
═══════════════════════════

$ python manage.py shell

>>> from apps.employees.models import EmployeeDocument, Employee
>>> from django.contrib.auth.models import User

# Test 1: Create document instance
>>> employee = Employee.objects.first()
>>> user = User.objects.first()
>>> doc = EmployeeDocument(
...     employee=employee,
...     document_type='CONTRACT',
...     title='Employment Contract 2026',
...     uploaded_by=user
... )
>>> doc.save()
>>> print(doc)
Employment Contract 2026 - CONTRACT

# Test 2: Query documents
>>> docs = EmployeeDocument.objects.filter(employee=employee)
>>> print(docs.count())
1

# Test 3: Test relationships
>>> doc.employee
<Employee: EMP-0001 - John Silva>
>>> doc.uploaded_by
<User: hr_admin>

# Test 4: Test properties
>>> doc.is_expired
False
>>> doc.is_expiring_soon
False
```

### Common Migration Issues

#### Issue 1: Missing Dependency Migration
```
Error: "No such table: employees_employee"

Cause: Employee model migration not run first

Solution:
1. Check Employee model migration exists
2. Run: python manage.py migrate employees
3. Ensure all dependencies migrated
4. Retry EmployeeDocument migration
```

#### Issue 2: Field Name Conflict
```
Error: "Column name already exists"

Cause: Field already exists in database

Solution:
1. Check if previous migration partially applied
2. Rollback: python manage.py migrate employees <previous>
3. Delete conflicting migration file
4. Regenerate: python manage.py makemigrations
5. Apply: python manage.py migrate
```

#### Issue 3: Import Error
```
Error: "Cannot import name 'EmployeeDocument'"

Cause: Model not properly imported in __init__.py

Solution:
1. Open apps/employees/models/__init__.py
2. Add: from .employee_document import EmployeeDocument
3. Add to __all__: 'EmployeeDocument'
4. Retry migration
```

#### Issue 4: File Storage Not Configured
```
Error: "ImproperlyConfigured: MEDIA_ROOT not set"

Cause: Django file upload settings missing

Solution:
1. Open settings.py
2. Add: MEDIA_ROOT = BASE_DIR / 'media'
3. Add: MEDIA_URL = '/media/'
4. Create media directory
5. Retry migration
```

### Migration File Example

```python
# Generated migration file structure
# employees/migrations/0007_employeedocument.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import apps.employees.models.employee_document

class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('employees', '0006_previous_migration'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document_type', models.CharField(choices=[...], max_length=50)),
                ('title', models.CharField(max_length=200)),
                ('file', models.FileField(upload_to=apps.employees.models.employee_document.employee_document_upload_path)),
                # ... other fields ...
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='employees.employee')),
                # ... other relationships ...
            ],
            options={
                'verbose_name': 'Employee Document',
                'verbose_name_plural': 'Employee Documents',
                'ordering': ['-uploaded_at'],
            },
        ),
        migrations.AddIndex(
            model_name='employeedocument',
            index=models.Index(fields=['employee'], name='idx_employee'),
        ),
        # ... other indexes ...
    ]
```

### Post-Migration Verification

```
Verification Checklist
══════════════════════

Database Level:
├── [ ] Table employees_employeedocument exists
├── [ ] All columns present and correct type
├── [ ] Foreign keys created
├── [ ] Indexes created
└── [ ] Constraints applied

Application Level:
├── [ ] Model imports without errors
├── [ ] Can create model instances
├── [ ] Can save to database
├── [ ] Can query from database
├── [ ] Relationships work correctly
└── [ ] Properties and methods function

File Storage:
├── [ ] MEDIA_ROOT configured
├── [ ] MEDIA_URL configured
├── [ ] Media directory exists
├── [ ] Upload path function works
└── [ ] Files upload successfully
```

### Expected Outcome
- Database table created successfully
- All fields and indexes in place
- Model fully functional
- Relationships working correctly
- Ready for admin and API integration

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied successfully
- [ ] Database table created
- [ ] All columns present
- [ ] Indexes created
- [ ] Foreign keys working
- [ ] Model tested in Django shell
- [ ] No migration errors
- [ ] Can create and save documents
- [ ] Relationships functional
- [ ] File upload path working

---

## Summary

This document established the employee document management system:

### Completed Infrastructure
- ✅ Document type constants (CONTRACT, RESUME, NIC_COPY, CERTIFICATE, OTHER)
- ✅ Core EmployeeDocument model with relationships
- ✅ File storage with organized upload paths
- ✅ Document metadata (title, description, verification)
- ✅ Expiry tracking for certificates and licenses
- ✅ Visibility controls for sensitive documents
- ✅ Database migrations applied

### Key Achievements
1. **Document Organization** - Type-based categorization
2. **File Management** - Secure storage with metadata
3. **Compliance Tracking** - Expiry alerts and verification
4. **Privacy Protection** - Fine-grained access controls
5. **Audit Trail** - Access logging and tracking
6. **Sri Lankan Context** - NIC storage, professional licenses

### Next Steps
Proceed to [02_Tasks-58-66_Bank-Account-Model.md](02_Tasks-58-66_Bank-Account-Model.md) to implement bank account details for payroll processing, including account encryption and verification workflows.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7 (51-57)  
**Total Lines:** ~1380
