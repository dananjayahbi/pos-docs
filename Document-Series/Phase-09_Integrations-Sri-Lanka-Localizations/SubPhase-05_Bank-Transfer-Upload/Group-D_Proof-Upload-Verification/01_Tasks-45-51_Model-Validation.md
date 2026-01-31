# Tasks 45-51: PaymentProof Model and File Validation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** D - Proof Upload & Verification  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous:** [../Group-C_Payment-Reference-Instructions/02_Tasks-37-44_Customer-Instructions-Verification.md](../Group-C_Payment-Reference-Instructions/02_Tasks-37-44_Customer-Instructions-Verification.md)
- **→ Next Document:** [02_Tasks-52-58_Storage-API-Verify.md](02_Tasks-52-58_Storage-API-Verify.md)

---

## Document Overview

This document covers the creation of the PaymentProof model and comprehensive file validation framework for bank transfer payment proofs. It establishes the data structure for storing uploaded payment receipts, implements field configurations for file storage and metadata, and creates a robust validation system that ensures only valid image (JPG/PNG) and PDF files are accepted with proper format verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create PaymentProof Model | Medium | 45 min |
| 46 | Create File Field Configuration | Low | 20 min |
| 47 | Create Upload Timestamp Field | Low | 15 min |
| 48 | Create Customer Notes Field | Low | 15 min |
| 49 | Create Upload Validation Framework | Medium | 40 min |
| 50 | Create Image Validation (JPG/PNG) | Low | 30 min |
| 51 | Create PDF Validation | Low | 25 min |

---

## Task 45: Create PaymentProof Model

### Overview
Create the PaymentProof model to store customer-uploaded payment receipts for bank transfer transactions. This model serves as the central data structure for managing proof of payment files, linking them to BankTransferTransaction records, and storing associated metadata like upload timestamps and customer notes. The model supports the verification workflow where customers upload bank receipts and admins verify payments.

### Dependencies
- Task 44 (Customer Instructions Display) complete
- BankTransferTransaction model exists
- Django project with multi-tenancy configured
- Base models and mixins available

### Instructions

1. **Create model file structure**
   - Navigate to `backend/apps/payments/models/` directory
   - Create new file named `payment_proof.py`
   - This file will contain the PaymentProof model definition

2. **Import required dependencies**
   - Import Django's models module
   - Import BankTransferTransaction model
   - Import base model classes (TenantAwareModel, TimestampMixin)
   - Import file storage utilities

3. **Define PaymentProof model class**
   - Inherit from TenantAwareModel and TimestampMixin
   - Define model name as "PaymentProof"
   - Set appropriate Meta options for ordering and permissions

4. **Add relationship to transaction**
   - Create ForeignKey field to BankTransferTransaction
   - Name field as `transaction`
   - Set related_name to 'proofs' for reverse access
   - Use on_delete=CASCADE to delete proofs when transaction deleted
   - This links proof to specific payment transaction

5. **Configure model permissions**
   - Set default_permissions for add, change, delete, view
   - Add custom permission for 'verify_proof'
   - Set verbose_name and verbose_name_plural

6. **Add ordering and indexes**
   - Order by '-uploaded_at' (newest first)
   - Add database index on transaction field
   - Add index on uploaded_at for query performance

7. **Implement __str__ method**
   - Return meaningful string representation
   - Include transaction reference and upload date
   - Format: "Proof for {transaction.reference} - {uploaded_at}"

8. **Update models __init__.py**
   - Import PaymentProof model
   - Add to __all__ list for module exports
   - Ensure proper model registration

### Model Relationships

```
BankTransferTransaction (1) ←──────── (N) PaymentProof
    │                                       │
    │ transaction (ForeignKey)              │
    │                                       │
    ├─ reference_number                     ├─ file
    ├─ customer                             ├─ uploaded_at
    ├─ amount                               ├─ notes
    └─ status                               └─ verified_at
```

### PaymentProof Model Structure

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| transaction | ForeignKey | Link to BankTransferTransaction | CASCADE, indexed |
| file | FileField | Uploaded proof file | (Added in Task 46) |
| uploaded_at | DateTimeField | Upload timestamp | (Added in Task 47) |
| notes | TextField | Customer notes | (Added in Task 48) |
| verified_at | DateTimeField | Admin verification time | NULL, blank |
| verified_by | ForeignKey | Admin who verified | NULL, blank |
| verification_notes | TextField | Admin notes | Blank |

### Model Meta Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| db_table | payment_proofs | Explicit table name |
| ordering | ['-uploaded_at'] | Newest first |
| verbose_name | Payment Proof | Admin display |
| indexes | transaction, uploaded_at | Query optimization |
| permissions | verify_proof | Custom permission |

### Tenant Isolation

```
Tenant A                    Tenant B
├── Transaction #1001       ├── Transaction #2001
│   ├── Proof #1           │   ├── Proof #1
│   └── Proof #2           │   └── Proof #2
└── Transaction #1002       └── Transaction #2002
    └── Proof #3               └── Proof #3

Each tenant's proofs isolated via TenantAwareModel
```

### Expected Outcome
- PaymentProof model created with proper inheritance
- Relationship to BankTransferTransaction established
- Model registered in Django admin
- Tenant isolation automatically applied
- Foundation ready for file and metadata fields

### Verification Checklist
- [ ] `payment_proof.py` file created in models directory
- [ ] Model inherits from TenantAwareModel and TimestampMixin
- [ ] ForeignKey to BankTransferTransaction defined with CASCADE
- [ ] Meta class configured with ordering and permissions
- [ ] __str__ method returns meaningful representation
- [ ] Model imported in models/__init__.py
- [ ] Database migrations can be generated without errors

---

## Task 46: Create File Field Configuration

### Overview
Configure the file field on PaymentProof model to handle uploaded payment receipts. This field manages file storage location, upload paths, and file naming conventions. The configuration supports both local development storage and production S3 storage, organizing files by tenant and order reference for easy management and retrieval.

### Dependencies
- Task 45: Create PaymentProof Model

### Instructions

1. **Add file field to PaymentProof model**
   - Open `payment_proof.py` model file
   - Add FileField named `file`
   - This field stores the uploaded proof document

2. **Configure upload_to path**
   - Define upload path as `proofs/{tenant}/{order}/`
   - Use callable function to dynamically generate path
   - Include tenant ID for isolation
   - Include order reference for organization

3. **Create upload path function**
   - Define function `proof_upload_path(instance, filename)`
   - Extract tenant from instance
   - Extract order reference from transaction
   - Format path: `proofs/{tenant.id}/{order_ref}/{filename}`
   - Preserve original filename with sanitization

4. **Configure file storage backend**
   - Use Django's default storage (configurable)
   - In settings.py, configure DEFAULT_FILE_STORAGE
   - For development: FileSystemStorage
   - For production: S3Boto3Storage (configured in Task 55)

5. **Add file validation placeholder**
   - Add validators parameter to file field
   - Reference validator functions (implemented in Task 49)
   - Validators will check file type and size

6. **Set field constraints**
   - Set null=False, blank=False (required field)
   - Add help_text describing accepted formats
   - Help text: "Upload JPG, PNG, or PDF (max 5MB)"

7. **Configure max_length for file path**
   - Set max_length=500 for file field
   - Accommodates long tenant/order paths
   - Prevents path truncation issues

### File Storage Hierarchy

```
storage/
└── proofs/
    ├── tenant_abc123/
    │   ├── ORD-2025-001/
    │   │   ├── receipt_20250131_120000.jpg
    │   │   └── bank_slip_20250131_120500.pdf
    │   └── ORD-2025-002/
    │       └── payment_proof.png
    └── tenant_xyz789/
        └── ORD-2025-003/
            └── transfer_receipt.jpg
```

### Upload Path Function Logic

```
Input:
  instance = PaymentProof object
  filename = "bank_receipt.jpg"

Process:
  tenant_id = instance.transaction.customer.tenant.id
  order_ref = instance.transaction.order.reference
  sanitized = sanitize_filename(filename)
  
Output:
  path = f"proofs/{tenant_id}/{order_ref}/{sanitized}"
  Example: "proofs/tenant_abc123/ORD-2025-001/bank_receipt.jpg"
```

### File Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| upload_to | proof_upload_path | Dynamic path generation |
| max_length | 500 | Support long paths |
| null | False | Required field |
| blank | False | Required in forms |
| validators | [file_validators] | Type and size validation |
| help_text | Format description | User guidance |

### Storage Configuration (settings.py)

| Environment | Storage Backend | Configuration |
|-------------|----------------|---------------|
| Development | FileSystemStorage | MEDIA_ROOT = 'media/' |
| Production | S3Boto3Storage | AWS credentials, bucket |
| Testing | InMemoryStorage | No actual files |

### Filename Sanitization

| Original | Sanitized | Reason |
|----------|-----------|--------|
| "My Receipt!.jpg" | "my_receipt.jpg" | Remove special chars |
| "வங்கி ரசீது.pdf" | "receipt.pdf" | ASCII only |
| "../../evil.jpg" | "evil.jpg" | Prevent path traversal |
| "receipt (1).jpg" | "receipt_1.jpg" | Remove parentheses |

### Expected Outcome
- File field added to PaymentProof model
- Dynamic upload paths organized by tenant and order
- Storage backend configurable for dev/production
- Filename sanitization prevents security issues
- Field ready for validation rules

### Verification Checklist
- [ ] FileField named `file` added to model
- [ ] upload_to uses callable function with tenant/order path
- [ ] Upload path function properly extracts tenant and order
- [ ] max_length set to 500 for file paths
- [ ] Field marked as required (null=False, blank=False)
- [ ] help_text added describing accepted formats
- [ ] Storage backend configurable in settings.py
- [ ] Migrations generated successfully

---

## Task 47: Create Upload Timestamp Field

### Overview
Add the uploaded_at timestamp field to PaymentProof model to automatically record when each proof file is uploaded. This field is critical for tracking upload times, ordering proofs chronologically, establishing audit trails, and implementing time-based business logic like upload deadlines or verification SLAs.

### Dependencies
- Task 45: Create PaymentProof Model

### Instructions

1. **Add uploaded_at field to model**
   - Open `payment_proof.py` model file
   - Add DateTimeField named `uploaded_at`
   - This field tracks when proof was uploaded

2. **Configure auto_now_add behavior**
   - Set auto_now_add=True parameter
   - Automatically sets field to current datetime on creation
   - Field value cannot be manually overridden
   - Timestamp set once and never changes

3. **Set field constraints**
   - Field automatically non-null (auto_now_add implies null=False)
   - Not editable in admin or forms (editable=False implied)
   - Timezone-aware datetime using Django's timezone settings

4. **Add database index**
   - Add db_index=True for query performance
   - Enables efficient filtering and ordering by upload time
   - Supports queries like "proofs uploaded in last 24 hours"

5. **Configure verbose name**
   - Set verbose_name="Uploaded At"
   - Improves admin interface readability
   - Used in Django admin list displays

6. **Add help text**
   - Set help_text="Timestamp when proof was uploaded"
   - Provides context in admin interface
   - Documents field purpose for developers

7. **Update model ordering**
   - Confirm Meta.ordering includes '-uploaded_at'
   - Ensures newest proofs appear first
   - Provides consistent default ordering

### Timestamp Behavior

```
Proof Creation Timeline:
┌──────────────────────────────────────────────────┐
│ 1. Customer clicks "Upload Proof"               │
│ 2. File selected and form submitted             │
│ 3. PaymentProof.objects.create() called         │
│ 4. uploaded_at = timezone.now() ← Auto-set     │
│ 5. Record saved to database                     │
│ 6. uploaded_at cannot be changed later          │
└──────────────────────────────────────────────────┘

Example Value: 2025-01-31T15:30:45.123456+05:30
```

### Timestamp Use Cases

| Use Case | Implementation | Query Example |
|----------|----------------|---------------|
| Recent uploads | Filter by uploaded_at | `uploaded_at__gte=now()-24h` |
| Audit trail | Display in admin | "Uploaded on Jan 31, 2025" |
| Upload deadline | Compare to cutoff | `uploaded_at < deadline` |
| Verification SLA | Time since upload | `now() - uploaded_at > 2 hours` |
| Daily reports | Group by date | `uploaded_at__date` |

### Timezone Handling

| Configuration | Setting | Impact |
|---------------|---------|--------|
| USE_TZ | True | All datetimes timezone-aware |
| TIME_ZONE | 'Asia/Colombo' | Default timezone for display |
| Database | UTC | Stored in UTC (PostgreSQL) |
| Display | Local TZ | Converted for user display |

### Query Performance

```
Index on uploaded_at enables efficient queries:

✓ Fast: PaymentProof.objects.filter(uploaded_at__gte=date)
✓ Fast: PaymentProof.objects.order_by('-uploaded_at')
✓ Fast: PaymentProof.objects.filter(uploaded_at__date=today)
✗ Slow without index: Full table scan
```

### Expected Outcome
- uploaded_at field automatically captures upload time
- Timestamp set once on creation, immutable
- Timezone-aware using Django's timezone settings
- Indexed for efficient querying
- Supports audit trails and time-based logic

### Verification Checklist
- [ ] DateTimeField named `uploaded_at` added to model
- [ ] auto_now_add=True parameter set
- [ ] db_index=True for query performance
- [ ] verbose_name set to "Uploaded At"
- [ ] help_text added for documentation
- [ ] Model Meta.ordering includes '-uploaded_at'
- [ ] Migrations generated successfully
- [ ] Field appears correctly in Django admin

---

## Task 48: Create Customer Notes Field

### Overview
Add the notes TextField to PaymentProof model to allow customers to provide additional context or information about their payment proof. This optional field enables customers to explain discrepancies, provide reference details, or add any relevant information that helps admins verify the payment more efficiently.

### Dependencies
- Task 45: Create PaymentProof Model

### Instructions

1. **Add notes field to model**
   - Open `payment_proof.py` model file
   - Add TextField named `notes`
   - This field stores customer-provided text

2. **Configure optional field behavior**
   - Set blank=True to allow empty submissions
   - Set null=True to allow NULL in database
   - Field not required in forms or API

3. **Set maximum length**
   - Add max_length=500 parameter
   - Prevents excessively long notes
   - Balances detail with brevity

4. **Add verbose name and help text**
   - Set verbose_name="Customer Notes"
   - Set help_text="Optional notes about this payment (max 500 characters)"
   - Provides clear guidance to users

5. **Configure default value**
   - Set default='' (empty string)
   - Avoids NULL vs empty string confusion
   - Simplifies template logic

6. **Add admin configuration**
   - Display field in admin changelist if not empty
   - Show character count in admin form
   - Enable word wrap for readability

7. **Consider sanitization**
   - Plan for HTML escaping on display
   - Prevent XSS attacks through notes
   - Remove dangerous characters on save

### Notes Field Behavior

```
Customer Upload Form:
┌─────────────────────────────────────────────┐
│ Upload Payment Proof                        │
│                                             │
│ File: [receipt.jpg] ✓ Selected             │
│                                             │
│ Notes (Optional):                           │
│ ┌─────────────────────────────────────────┐ │
│ │ Transfer made from wife's account.      │ │
│ │ Name: Kumari Silva, Acc: 1234567890     │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│ Characters: 87 / 500                        │
│                                             │
│ [Upload Proof]                              │
└─────────────────────────────────────────────┘
```

### Common Note Scenarios

| Scenario | Example Note | Value |
|----------|--------------|-------|
| Different account | "Paid from business partner account" | High |
| Partial payment | "First installment, balance pending" | High |
| Late payment | "Payment delayed due to bank holiday" | Medium |
| Reference details | "Order #12345, Invoice #INV-2025-001" | Medium |
| No note | "" (empty) | Normal |

### Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | TextField | Multi-line text |
| max_length | 500 | Limit verbosity |
| blank | True | Optional field |
| null | True | Allow NULL in DB |
| default | '' | Empty string default |
| verbose_name | "Customer Notes" | Admin display |
| help_text | Usage guidance | User instruction |

### Character Limit Enforcement

| Layer | Method | Error Message |
|-------|--------|---------------|
| Frontend | JavaScript counter | "Maximum 500 characters" |
| Backend | MaxLengthValidator | "Ensure value has at most 500 characters" |
| Database | VARCHAR(500) | Truncation or error |

### XSS Prevention

```
Input:  "<script>alert('xss')</script> Payment made"
Storage: "<script>alert('xss')</script> Payment made"  (raw)
Display: "&lt;script&gt;alert('xss')&lt;/script&gt; Payment made"

Prevention Methods:
1. Django template auto-escaping: {{ proof.notes }}
2. API serialization escaping
3. Admin interface escaping
4. Remove <script> tags on save (optional)
```

### Expected Outcome
- Optional notes field added to PaymentProof model
- Customers can provide context about their payment
- 500 character limit prevents abuse
- Field properly handles empty submissions
- XSS prevention through proper escaping

### Verification Checklist
- [ ] TextField named `notes` added to model
- [ ] max_length=500 parameter set
- [ ] blank=True and null=True for optional field
- [ ] default='' set to avoid NULL issues
- [ ] verbose_name and help_text configured
- [ ] Migrations generated successfully
- [ ] Field displays correctly in admin
- [ ] Character counter implemented (future task)
- [ ] XSS protection tested

---

## Task 49: Create Upload Validation Framework

### Overview
Create a comprehensive validation framework for uploaded payment proofs. This framework validates file types, ensures only allowed formats (JPG, PNG, PDF) are accepted, checks file integrity, and provides clear error messages when validation fails. The framework serves as the foundation for specific image and PDF validators implemented in subsequent tasks.

### Dependencies
- Task 45: Create PaymentProof Model
- Task 46: Create File Field Configuration

### Instructions

1. **Create validators file structure**
   - Navigate to `backend/apps/payments/utils/` directory
   - Create new file named `file_validators.py`
   - This file contains all upload validation logic

2. **Define allowed file types**
   - Create ALLOWED_EXTENSIONS constant
   - Include: ['jpg', 'jpeg', 'png', 'pdf']
   - Create ALLOWED_MIME_TYPES constant
   - Include: ['image/jpeg', 'image/png', 'application/pdf']

3. **Create base validator function**
   - Define `validate_payment_proof_file(file)` function
   - This function orchestrates all validation checks
   - Called automatically by Django on file upload

4. **Implement extension validation**
   - Extract file extension from filename
   - Convert to lowercase for case-insensitive check
   - Verify extension in ALLOWED_EXTENSIONS list
   - Raise ValidationError if extension not allowed

5. **Implement MIME type validation**
   - Read file content to detect actual file type
   - Use python-magic library for reliable detection
   - Compare detected MIME type to ALLOWED_MIME_TYPES
   - Prevents file type spoofing (renaming .exe to .jpg)

6. **Add file corruption check**
   - Attempt to open file using appropriate library
   - For images: use Pillow to open and verify
   - For PDFs: use PyPDF2 to parse header
   - Catch exceptions indicating corrupted files

7. **Implement error messaging**
   - Raise ValidationError with descriptive messages
   - "Only JPG, PNG, and PDF files are allowed"
   - "File appears to be corrupted"
   - "File type does not match extension"

8. **Create utility functions**
   - `get_file_extension(filename)`: Extract extension
   - `get_mime_type(file)`: Detect actual file type
   - `is_valid_file_type(file)`: Overall type check

9. **Add validators to FileField**
   - Update PaymentProof model file field
   - Add validators=[validate_payment_proof_file]
   - Validation runs automatically on save

### Validation Flow

```
File Upload
    │
    ▼
┌─────────────────────────────────────┐
│  validate_payment_proof_file()      │
└─────────────────────────────────────┘
    │
    ├─► Check extension (.jpg, .png, .pdf)
    │       │
    │       ├─► ✓ Valid → Continue
    │       └─► ✗ Invalid → ValidationError
    │
    ├─► Check MIME type (magic bytes)
    │       │
    │       ├─► ✓ Matches extension → Continue
    │       └─► ✗ Mismatch → ValidationError
    │
    ├─► Check file integrity
    │       │
    │       ├─► ✓ Opens successfully → Continue
    │       └─► ✗ Corrupted → ValidationError
    │
    └─► Call specific validators
            │
            ├─► validate_image() [Task 50]
            └─► validate_pdf() [Task 51]
```

### Validation Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| ALLOWED_EXTENSIONS | ['jpg', 'jpeg', 'png', 'pdf'] | Extension whitelist |
| ALLOWED_MIME_TYPES | ['image/jpeg', 'image/png', 'application/pdf'] | MIME whitelist |
| MAX_FILE_SIZE | 5 * 1024 * 1024 (5MB) | Size limit (Task 52) |

### File Type Detection

| Method | Reliability | Speed | Notes |
|--------|-------------|-------|-------|
| Extension only | Low | Fast | Easily spoofed |
| MIME type | Medium | Fast | Sent by browser, can fake |
| Magic bytes | High | Medium | Reads file header |
| Full parse | Very High | Slow | Opens entire file |

### Validation Error Examples

```python
# Invalid extension
File: "receipt.exe"
Error: "Only JPG, PNG, and PDF files are allowed."

# Type mismatch
File: "malware.exe" renamed to "receipt.jpg"
Error: "File type does not match extension. Expected image/jpeg, got application/x-executable."

# Corrupted file
File: "broken.jpg" (truncated)
Error: "File appears to be corrupted and cannot be opened."

# Valid file
File: "bank_receipt.jpg"
Result: ✓ Validation passed
```

### Magic Bytes Examples

| File Type | Magic Bytes (Hex) | Human Readable |
|-----------|-------------------|----------------|
| JPEG | FF D8 FF | ÿØÿ |
| PNG | 89 50 4E 47 | ‰PNG |
| PDF | 25 50 44 46 | %PDF |

### Dependencies Required

```python
# requirements.txt additions
python-magic==0.4.27
Pillow==10.0.0
PyPDF2==3.0.1
```

### Expected Outcome
- Comprehensive validation framework created
- File extension and MIME type validation implemented
- File corruption detection in place
- Clear error messages for validation failures
- Foundation ready for specific validators

### Verification Checklist
- [ ] `file_validators.py` created in utils directory
- [ ] ALLOWED_EXTENSIONS and ALLOWED_MIME_TYPES defined
- [ ] validate_payment_proof_file() function implemented
- [ ] Extension validation checks file suffix
- [ ] MIME type validation uses magic bytes
- [ ] File corruption check attempts to open file
- [ ] ValidationError raised with descriptive messages
- [ ] Validators added to PaymentProof.file field
- [ ] Dependencies added to requirements.txt
- [ ] Unit tests created for validation scenarios

---

## Task 50: Create Image Validation (JPG/PNG)

### Overview
Implement specific validation logic for image files (JPG, JPEG, PNG) uploaded as payment proofs. This validator ensures images are genuine, properly formatted, meet minimum size requirements, and don't contain malicious payloads. It uses Pillow library to verify image integrity, validate dimensions, and check file format authenticity beyond simple extension checking.

### Dependencies
- Task 49: Create Upload Validation Framework

### Instructions

1. **Create image validator function**
   - Open `file_validators.py`
   - Define `validate_image(file)` function
   - This function validates JPG and PNG images specifically

2. **Check file extension**
   - Verify extension is in ['jpg', 'jpeg', 'png']
   - Case-insensitive check (convert to lowercase)
   - Skip validation if not an image

3. **Validate image format using Pillow**
   - Import Image from PIL (Pillow)
   - Attempt to open image: `Image.open(file)`
   - Call `image.verify()` to check integrity
   - Catch exceptions for invalid images

4. **Check image MIME type**
   - Use python-magic to detect actual type
   - Verify detected type is 'image/jpeg' or 'image/png'
   - Prevent renamed executables from passing as images

5. **Validate minimum file size**
   - Check file.size attribute
   - Minimum size: 10 KB (10,240 bytes)
   - Prevents suspicious tiny files
   - Legitimate receipts rarely under 10KB

6. **Validate minimum dimensions**
   - Get image width and height: `image.size`
   - Minimum width: 200 pixels
   - Minimum height: 200 pixels
   - Prevents unusable low-resolution images

7. **Check maximum dimensions**
   - Maximum width: 10,000 pixels
   - Maximum height: 10,000 pixels
   - Prevents memory exhaustion attacks
   - Normal receipts well under this limit

8. **Validate color mode**
   - Check image.mode attribute
   - Allowed modes: RGB, RGBA, L (grayscale)
   - Reject unusual modes (CMYK, LAB)
   - Ensures compatibility with image processing

9. **Add validation to framework**
   - Call `validate_image()` from `validate_payment_proof_file()`
   - Only run if file extension is image type
   - Chain with other validators

### Image Validation Flow

```
Image Upload
    │
    ▼
validate_image(file)
    │
    ├─► Check extension (.jpg, .jpeg, .png)
    │       └─► ✗ Not image → Skip (return)
    │
    ├─► Open with Pillow
    │       │
    │       ├─► ✓ Opens → Continue
    │       └─► ✗ Cannot open → "Invalid image file"
    │
    ├─► Verify image integrity
    │       │
    │       ├─► ✓ Valid → Continue
    │       └─► ✗ Corrupted → "Corrupted image"
    │
    ├─► Check MIME type
    │       │
    │       ├─► ✓ image/jpeg or image/png → Continue
    │       └─► ✗ Other → "File is not a valid image"
    │
    ├─► Check file size
    │       │
    │       ├─► ✓ >= 10 KB → Continue
    │       └─► ✗ < 10 KB → "Image too small"
    │
    ├─► Check dimensions
    │       │
    │       ├─► ✓ 200x200 to 10000x10000 → Continue
    │       └─► ✗ Out of range → "Invalid dimensions"
    │
    └─► ✓ Validation Passed
```

### Image Validation Rules

| Check | Requirement | Error Message |
|-------|-------------|---------------|
| Extension | .jpg, .jpeg, .png | "Only JPG and PNG images allowed" |
| MIME type | image/jpeg, image/png | "File is not a valid image" |
| Min size | >= 10 KB | "Image file too small (min 10KB)" |
| Min dimensions | >= 200x200 px | "Image too small (min 200x200)" |
| Max dimensions | <= 10000x10000 px | "Image too large (max 10000x10000)" |
| Integrity | Opens without error | "Corrupted or invalid image" |
| Color mode | RGB, RGBA, L | "Unsupported image format" |

### Pillow Image Verification

```python
from PIL import Image

# Basic verification
image = Image.open(file)
image.verify()  # Raises exception if corrupt

# Re-open after verify (verify closes file)
file.seek(0)
image = Image.open(file)

# Get properties
width, height = image.size
format = image.format  # 'JPEG', 'PNG'
mode = image.mode      # 'RGB', 'RGBA', 'L'
```

### Valid Image Examples

| File | Size | Dimensions | Format | Result |
|------|------|------------|--------|--------|
| bank_receipt.jpg | 250 KB | 1024x768 | JPEG | ✓ Valid |
| payment_slip.png | 180 KB | 800x600 | PNG | ✓ Valid |
| scan.jpg | 1.2 MB | 2000x1500 | JPEG | ✓ Valid |
| tiny.jpg | 5 KB | 100x100 | JPEG | ✗ Too small |
| huge.png | 15 MB | 15000x10000 | PNG | ✗ Too large |
| fake.jpg (exe) | 50 KB | N/A | EXE | ✗ Not image |

### Security Considerations

```
Attack Vector: Malicious Image Upload
┌─────────────────────────────────────────────┐
│ 1. Attacker renames malware.exe → img.jpg  │
│    ✗ Blocked: MIME type check              │
│                                             │
│ 2. Attacker creates polyglot file          │
│    (Valid JPG + executable payload)         │
│    ✗ Blocked: File size analysis           │
│                                             │
│ 3. Attacker uploads decompression bomb     │
│    (Small JPG → Huge uncompressed)          │
│    ✗ Blocked: Dimension limits             │
│                                             │
│ 4. Attacker uploads crafted JPEG           │
│    (Exploits image parser vulnerability)    │
│    ✗ Mitigated: Use latest Pillow version  │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Robust image validation for JPG and PNG files
- Pillow-based integrity verification
- Dimension and size requirements enforced
- Protection against malicious file uploads
- Clear error messages for validation failures

### Verification Checklist
- [ ] validate_image() function created
- [ ] Pillow used to open and verify images
- [ ] MIME type checked using python-magic
- [ ] Minimum file size (10 KB) enforced
- [ ] Minimum dimensions (200x200) enforced
- [ ] Maximum dimensions (10000x10000) enforced
- [ ] Color mode validation implemented
- [ ] Function integrated into validation framework
- [ ] Unit tests for various image scenarios
- [ ] Security testing for malicious files

---

## Task 51: Create PDF Validation

### Overview
Implement specific validation logic for PDF files uploaded as payment proofs. This validator ensures PDFs are genuine, properly formatted, not password-protected, meet size requirements, and don't contain malicious embedded content. It uses PyPDF2 library to verify PDF structure, validate headers, and check document properties beyond simple extension checking.

### Dependencies
- Task 49: Create Upload Validation Framework

### Instructions

1. **Create PDF validator function**
   - Open `file_validators.py`
   - Define `validate_pdf(file)` function
   - This function validates PDF files specifically

2. **Check file extension**
   - Verify extension is '.pdf' (case-insensitive)
   - Skip validation if not a PDF
   - Return early to avoid unnecessary processing

3. **Validate PDF magic bytes**
   - Read first 4 bytes of file
   - Check for PDF signature: '%PDF' (bytes: 25 50 44 46)
   - Verify file is actually a PDF, not renamed file
   - Prevent file type spoofing

4. **Validate PDF structure using PyPDF2**
   - Import PdfReader from PyPDF2
   - Attempt to read PDF: `PdfReader(file)`
   - Catch exceptions for corrupted or invalid PDFs
   - Verify PDF can be parsed successfully

5. **Check minimum file size**
   - Verify file.size >= 10 KB (10,240 bytes)
   - Prevents suspicious tiny files
   - Legitimate PDF receipts rarely under 10KB

6. **Validate PDF is not encrypted**
   - Check reader.is_encrypted property
   - Reject password-protected PDFs
   - Admins need direct access for verification
   - Error: "Password-protected PDFs not allowed"

7. **Check page count**
   - Get number of pages: `len(reader.pages)`
   - Minimum pages: 1 (obviously)
   - Maximum pages: 10
   - Receipts should be 1-2 pages typically
   - Prevents upload of large documents

8. **Validate PDF metadata**
   - Access metadata: `reader.metadata`
   - Check for suspicious producer/creator
   - Ensure metadata is readable
   - Reject PDFs with malformed metadata

9. **Add validation to framework**
   - Call `validate_pdf()` from `validate_payment_proof_file()`
   - Only run if file extension is '.pdf'
   - Chain with other validators

### PDF Validation Flow

```
PDF Upload
    │
    ▼
validate_pdf(file)
    │
    ├─► Check extension (.pdf)
    │       └─► ✗ Not PDF → Skip (return)
    │
    ├─► Check magic bytes (%PDF)
    │       │
    │       ├─► ✓ Starts with %PDF → Continue
    │       └─► ✗ Different bytes → "Not a valid PDF"
    │
    ├─► Parse with PyPDF2
    │       │
    │       ├─► ✓ Parses → Continue
    │       └─► ✗ Error → "Corrupted PDF"
    │
    ├─► Check file size
    │       │
    │       ├─► ✓ >= 10 KB → Continue
    │       └─► ✗ < 10 KB → "PDF too small"
    │
    ├─► Check encryption
    │       │
    │       ├─► ✓ Not encrypted → Continue
    │       └─► ✗ Encrypted → "Password-protected PDFs not allowed"
    │
    ├─► Check page count
    │       │
    │       ├─► ✓ 1-10 pages → Continue
    │       └─► ✗ > 10 pages → "Too many pages (max 10)"
    │
    └─► ✓ Validation Passed
```

### PDF Validation Rules

| Check | Requirement | Error Message |
|-------|-------------|---------------|
| Extension | .pdf | "Only PDF files allowed" |
| Magic bytes | %PDF | "File is not a valid PDF" |
| Structure | Parseable by PyPDF2 | "Corrupted or invalid PDF" |
| Min size | >= 10 KB | "PDF too small (min 10KB)" |
| Encryption | Not encrypted | "Password-protected PDFs not allowed" |
| Page count | 1-10 pages | "PDF must have 1-10 pages" |
| Metadata | Readable | "PDF has malformed metadata" |

### PDF Magic Bytes

```
Valid PDF Header:
Hex:  25 50 44 46 2D 31 2E
Text: %PDF-1.4
      ↑
      PDF signature (first 4 bytes)

Check:
file.seek(0)
header = file.read(4)
if header != b'%PDF':
    raise ValidationError("Not a valid PDF file")
```

### PyPDF2 Validation

```python
from PyPDF2 import PdfReader

# Open and parse PDF
reader = PdfReader(file)

# Check encryption
if reader.is_encrypted:
    raise ValidationError("Password-protected PDFs not allowed")

# Check page count
page_count = len(reader.pages)
if page_count < 1 or page_count > 10:
    raise ValidationError(f"PDF must have 1-10 pages (has {page_count})")

# Read metadata
metadata = reader.metadata
producer = metadata.get('/Producer', 'Unknown')
```

### Valid PDF Examples

| File | Size | Pages | Encrypted | Result |
|------|------|-------|-----------|--------|
| bank_receipt.pdf | 150 KB | 1 | No | ✓ Valid |
| statement.pdf | 320 KB | 3 | No | ✓ Valid |
| invoice.pdf | 80 KB | 2 | No | ✓ Valid |
| tiny.pdf | 5 KB | 1 | No | ✗ Too small |
| protected.pdf | 200 KB | 1 | Yes | ✗ Encrypted |
| book.pdf | 5 MB | 50 | No | ✗ Too many pages |
| fake.pdf (exe) | 100 KB | N/A | N/A | ✗ Not PDF |

### Security Considerations

```
Attack Vector: Malicious PDF Upload
┌─────────────────────────────────────────────┐
│ 1. Attacker renames malware.exe → doc.pdf  │
│    ✗ Blocked: Magic bytes check            │
│                                             │
│ 2. Attacker uploads PDF with JavaScript    │
│    ✗ Mitigated: PDFs displayed in viewer   │
│    (not executed in browser)                │
│                                             │
│ 3. Attacker uploads PDF with embedded file │
│    ✗ Mitigated: Only viewed, not extracted │
│                                             │
│ 4. Attacker uploads massive PDF (DOS)      │
│    ✗ Blocked: Page count limit             │
│                                             │
│ 5. Attacker uploads crafted PDF exploit    │
│    ✗ Mitigated: Latest PyPDF2 version      │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Robust PDF validation for payment proofs
- PyPDF2-based structure verification
- Magic bytes checking prevents spoofing
- Encrypted PDFs rejected for accessibility
- Page count limits prevent abuse
- Clear error messages for validation failures

### Verification Checklist
- [ ] validate_pdf() function created
- [ ] Magic bytes (%PDF) checked in file header
- [ ] PyPDF2 used to parse and validate PDF
- [ ] Minimum file size (10 KB) enforced
- [ ] Encryption check rejects password-protected files
- [ ] Page count validated (1-10 pages)
- [ ] Metadata accessibility verified
- [ ] Function integrated into validation framework
- [ ] Unit tests for various PDF scenarios
- [ ] Security testing for malicious PDFs

---

## Summary

This document established the complete PaymentProof model with file field, timestamp, and notes fields, along with a comprehensive validation framework for uploaded payment proofs. The validation system ensures only genuine JPG, PNG, and PDF files are accepted through extension checking, MIME type verification, magic byte validation, and format-specific integrity checks.

### Completed Tasks
- Task 45: PaymentProof model created with tenant isolation
- Task 46: File field configured with dynamic upload paths
- Task 47: Upload timestamp field auto-captures upload time
- Task 48: Customer notes field allows optional context
- Task 49: Validation framework orchestrates all checks
- Task 50: Image validation ensures genuine JPG/PNG files
- Task 51: PDF validation ensures genuine, unencrypted PDFs

### Key Achievements
- Multi-tenant proof storage with proper isolation
- Organized file storage by tenant and order
- Immutable upload timestamps for audit trails
- Flexible notes field for customer explanations
- Comprehensive validation preventing malicious uploads
- Protection against file type spoofing and corruption

### Next Steps
Continue to [02_Tasks-52-58_Storage-API-Verify.md](02_Tasks-52-58_Storage-API-Verify.md) to implement file size limits, image compression, secure upload URLs, S3 storage configuration, upload API endpoints, multiple uploads support, and end-to-end verification.
