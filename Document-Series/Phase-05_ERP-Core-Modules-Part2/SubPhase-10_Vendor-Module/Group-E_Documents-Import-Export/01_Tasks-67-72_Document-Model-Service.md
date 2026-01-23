# Tasks 67-72: Document Model and Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** E - Documents & Import/Export  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-73-78_Import-Export-History.md](02_Tasks-73-78_Import-Export-History.md)

---

## Document Overview

This document creates the VendorDocument model for document management and implements document upload and expiry alert functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create VendorDocument Model | Medium | 25 min |
| 68 | Define DocumentType Choices | Low | 15 min |
| 69 | Add Document Fields | Medium | 20 min |
| 70 | Run Document Migrations | Low | 15 min |
| 71 | Implement Document Upload | Medium | 25 min |
| 72 | Implement Document Expiry Alert | Medium | 25 min |

---

## Task 67: Create VendorDocument Model

### Overview
Create model to store vendor documents (contracts, certificates, licenses).

### Dependencies
- Group D completed

### Instructions

1. **Create vendor_document.py file**
   - At `apps/vendors/models/vendor_document.py`

2. **Define VendorDocument model**
   - UUIDField primary key
   - ForeignKey to Vendor (CASCADE, related_name='documents')

3. **Configure Meta**
   - Ordering: ['-uploaded_at']

### Expected Outcome
- Document management model

### Verification Checklist
- [ ] Model created with vendor FK

---

## Task 68: Define DocumentType Choices

### Overview
Define document type choices.

### Dependencies
- Task 67: Create VendorDocument Model

### Instructions

1. **Add to constants.py**
   - DOCUMENT_TYPE_CONTRACT: 'CONTRACT'
   - DOCUMENT_TYPE_CERTIFICATE: 'CERTIFICATE'
   - DOCUMENT_TYPE_PRICE_LIST: 'PRICE_LIST'
   - DOCUMENT_TYPE_LICENSE: 'LICENSE'
   - DOCUMENT_TYPE_OTHER: 'OTHER'

2. **Create DOCUMENT_TYPE_CHOICES tuple**

### Document Types

| Type | Value | Purpose |
|------|-------|---------|
| CONTRACT | 'CONTRACT' | Supply contracts |
| CERTIFICATE | 'CERTIFICATE' | Quality/ISO certificates |
| PRICE_LIST | 'PRICE_LIST' | Price list documents |
| LICENSE | 'LICENSE' | Business licenses |
| OTHER | 'OTHER' | Other documents |

### Expected Outcome
- Document type classification

### Verification Checklist
- [ ] All types defined
- [ ] Choices tuple created

---

## Task 69: Add Document Fields

### Overview
Add fields for document details and file storage.

### Dependencies
- Task 68: Define DocumentType Choices

### Instructions

1. **Add document_type**
   - CharField with DOCUMENT_TYPE_CHOICES

2. **Add name**
   - CharField(255)
   - Document name/title

3. **Add file**
   - FileField
   - Upload_to: 'vendors/{vendor_id}/documents/'
   - Store actual document file

4. **Add expiry_date**
   - DateField
   - Optional
   - For licenses/certificates

5. **Add notes**
   - TextField
   - Optional

6. **Add audit fields**
   - uploaded_by: FK to User
   - uploaded_at: DateTimeField

### Document Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| document_type | CharField | Type classification |
| name | CharField(255) | Document name |
| file | FileField | File storage |
| expiry_date | DateField | Expiry tracking |
| notes | TextField | Additional notes |
| uploaded_by | FK User | Uploader |
| uploaded_at | DateTimeField | Upload time |

### File Storage Path
```
media/vendors/{vendor_uuid}/documents/{filename}
```

### Expected Outcome
- Complete document storage
- Expiry tracking
- Audit trail

### Verification Checklist
- [ ] All fields added
- [ ] File storage configured
- [ ] Expiry tracking included

---

## Task 70: Run Document Migrations

### Overview
Generate and apply document model migrations.

### Dependencies
- Task 69: Add Document Fields

### Instructions

1. **Generate and apply migration**
2. **Test document upload**

### Verification Checklist
- [ ] Migration applied
- [ ] Table created

---

## Task 71: Implement Document Upload

### Overview
Implement service method to upload and store vendor documents.

### Dependencies
- Task 70: Run Document Migrations

### Instructions

1. **Create document_service.py**
   - At `apps/vendors/services/document_service.py`

2. **Implement upload_document method**
   - Parameters: vendor_id, document_type, name, file, expiry_date, uploaded_by
   - Validate file type and size
   - Create VendorDocument record
   - Store file
   - Return created document

3. **Add file validation**
   - Allowed types: PDF, DOC, DOCX, JPG, PNG
   - Max size: 10MB
   - Virus scan (optional)

4. **Handle file storage**
   - Use Django FileField
   - Generate unique filename
   - Store in vendor-specific directory

### Expected Outcome
- Document upload functionality
- File validation
- Secure storage

### Verification Checklist
- [ ] Method implemented
- [ ] Validation added
- [ ] File storage working

---

## Task 72: Implement Document Expiry Alert

### Overview
Create Celery task to alert on expiring documents.

### Dependencies
- Task 71: Implement Document Upload

### Instructions

1. **Create document_tasks.py**
   - At `apps/vendors/tasks/document_tasks.py`

2. **Implement check_expiring_documents task**
   - Query documents with expiry_date
   - Find documents expiring soon
   - Send alerts based on schedule:
     - 30 days before: First reminder
     - 14 days before: Second reminder
     - 7 days before: Urgent reminder
     - 1 day before: Final reminder
     - Expired: Expiry notification

3. **Send notifications**
   - Email to vendor manager
   - System notification
   - Include document details
   - Include renewal instructions

4. **Schedule task**
   - Run daily via Celery Beat
   - Configure in celery.py

### Expiry Alert Schedule

| Days Before | Alert Level | Action |
|-------------|-------------|--------|
| 30 | Info | First reminder |
| 14 | Warning | Second reminder |
| 7 | Urgent | Urgent reminder |
| 1 | Critical | Final reminder |
| 0 (expired) | Alert | Expired notification |

### Expected Outcome
- Automated expiry alerts
- Scheduled notifications
- Renewal reminders

### Verification Checklist
- [ ] Celery task created
- [ ] Alert logic implemented
- [ ] Notifications working
- [ ] Task scheduled

---

## Notes for AI Agents

### Document Security
- Restrict access to authorized users
- Log document views
- Encrypt sensitive documents
- Backup regularly

### File Management
- Clean up old document versions
- Archive expired documents
- Maintain file naming convention
- Organize by vendor and type

### Expiry Management
- Track renewal process
- Update expiry dates when renewed
- Archive expired documents
- Maintain document history
