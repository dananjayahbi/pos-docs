# Tasks 79-83: CSV Import and Export

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** F - Import/Export & API  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-84-88_API-Tests.md](02_Tasks-84-88_API-Tests.md)

---

## Document Overview

This document covers CSV import and export functionality for bulk customer data operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Customer CSV Importer | High | 35 min |
| 80 | Implement Column Mapping | Medium | 25 min |
| 81 | Implement Import Validation | Medium | 30 min |
| 82 | Implement Import Progress Tracking | Medium | 25 min |
| 83 | Create Customer CSV Exporter | Medium | 25 min |

---

## Task 79: Create Customer CSV Importer

### Overview
Create service to import customers from CSV files with support for large file processing.

### Dependencies
- pandas library installed

### Instructions

1. **Install pandas**
   - Add to requirements.txt
   - Install in virtual environment

2. **Create import_service.py file** in services/
3. **Define CustomerImportService class**

4. **Implement import_from_csv method**
   - Accept CSV file
   - Parse CSV using pandas
   - Create customers in batches
   - Handle errors gracefully
   - Return import summary

5. **Implement batch processing**
   - Process 100 rows at a time
   - Use bulk_create for performance
   - Log progress

6. **Add async support**
   - Use Celery for large imports
   - Run import as background task

### CSV Import Flow

```
CSV File Upload
      │
      ▼
Parse CSV File (pandas)
      │
      ▼
Validate Column Headers
      │
      ▼
For Each Row (Batch of 100):
  ├─ Map columns to fields
  ├─ Validate data
  ├─ Check for duplicates (optional)
  ├─ Create Customer object
  └─ Log errors if any
      │
      ▼
Bulk Create Batch
      │
      ▼
Update Progress Counter
      │
      ▼
Return Import Summary
```

### Import Summary Format

```json
{
  "total_rows": 1000,
  "successful": 950,
  "failed": 50,
  "skipped": 0,
  "errors": [
    {
      "row": 42,
      "error": "Invalid email format",
      "data": {"email": "invalid-email"}
    }
  ],
  "duration_seconds": 45.5
}
```

### Expected Outcome
- CSV import service with batch processing

### Verification Checklist
- [ ] pandas installed
- [ ] import_service.py created
- [ ] import_from_csv method implemented
- [ ] Batch processing working
- [ ] Celery task for async import
- [ ] Returns import summary

---

## Task 80: Implement Column Mapping

### Overview
Implement flexible column mapping to handle different CSV formats.

### Dependencies
- Task 79: Create Customer CSV Importer

### Instructions

1. **Implement column mapping configuration**
   - Accept mapping dictionary
   - Map CSV columns to model fields
   - Support default mappings

2. **Create default mapping**
   - Standard column names
   - Common variations

3. **Implement auto-detect mapping**
   - Analyze CSV headers
   - Suggest field mappings
   - Return confidence scores

4. **Add custom mapping support**
   - Allow user-defined mappings
   - Save mapping templates
   - Reuse for future imports

### Default Column Mapping

| CSV Column | Model Field | Alternatives |
|------------|-------------|--------------|
| first_name | first_name | firstname, given_name |
| last_name | last_name | lastname, surname |
| company_name | company_name | company, business_name |
| email | email | email_address, contact_email |
| phone | primary_phone | phone_number, mobile, contact |
| address | address_line_1 | street, address1 |
| city | city | town |
| district | district | - |
| province | province | state |
| postal_code | postal_code | zip, zip_code |
| tax_id | tax_id | tin, vat_number |
| customer_type | customer_type | type |
| status | status | - |

### Column Mapping Format

```json
{
  "csv_column": "model_field",
  "First Name": "first_name",
  "Last Name": "last_name",
  "Email Address": "email",
  "Phone Number": "primary_phone",
  "Company": "company_name",
  "Street Address": "address_line_1",
  "City/Town": "city"
}
```

### Auto-Detect Logic

For each CSV header:
1. Normalize (lowercase, remove spaces/punctuation)
2. Check exact matches in default mapping
3. Check alternative names
4. Calculate string similarity scores
5. Suggest best match with confidence

### Expected Outcome
- Flexible column mapping system

### Verification Checklist
- [ ] Default mapping defined
- [ ] Custom mapping supported
- [ ] Auto-detect implemented
- [ ] Alternative column names handled
- [ ] Mapping templates can be saved

---

## Task 81: Implement Import Validation

### Overview
Add comprehensive validation to ensure data quality during import.

### Dependencies
- Task 80: Implement Column Mapping

### Instructions

1. **Implement validate_row method**
   - Check required fields
   - Validate data formats
   - Check business rules
   - Return validation errors

2. **Add field validators**
   - Email format validation
   - Phone format validation (Sri Lanka)
   - District-province mapping validation
   - Tax ID format validation

3. **Implement duplicate checking**
   - Check by email
   - Check by phone
   - Optional: skip duplicates or update

4. **Add validation settings**
   - strict_mode: fail on any error
   - skip_invalid: skip invalid rows
   - update_duplicates: update existing

### Validation Rules

| Field | Validation |
|-------|------------|
| first_name | Required for INDIVIDUAL type |
| last_name | Required for INDIVIDUAL type |
| company_name | Required for BUSINESS type |
| email | Valid email format |
| phone | Valid Sri Lanka phone (+94) |
| district | Must be one of 25 districts |
| province | Must be one of 9 provinces |
| district-province | Must match correctly |
| tax_id | Valid TIN/VAT format (optional) |
| customer_type | INDIVIDUAL or BUSINESS |
| status | Valid status value |

### Sri Lanka Phone Validation

Valid formats:
- +94712345678
- 0712345678
- 712345678

Invalid formats:
- 12345 (too short)
- 12345678901234 (too long)
- abcdefghij (non-numeric)

### Validation Error Format

```json
{
  "row": 15,
  "valid": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    },
    {
      "field": "district",
      "message": "District 'Colomboo' not found. Did you mean 'Colombo'?",
      "value": "Colomboo"
    }
  ]
}
```

### Import Modes

| Mode | Behavior |
|------|----------|
| strict | Fail entire import on first error |
| skip_invalid | Skip invalid rows, continue import |
| update_existing | Update if duplicate found |
| fail_on_duplicate | Fail if duplicate found |
| skip_duplicate | Skip if duplicate found |

### Expected Outcome
- Comprehensive import validation

### Verification Checklist
- [ ] validate_row method implemented
- [ ] All field validators working
- [ ] Duplicate checking implemented
- [ ] Validation settings configurable
- [ ] Clear error messages returned

---

## Task 82: Implement Import Progress Tracking

### Overview
Add progress tracking for large CSV imports running asynchronously.

### Dependencies
- Task 81: Implement Import Validation

### Instructions

1. **Create CustomerImport model**
   - import_id (UUID)
   - filename
   - status (PENDING, PROCESSING, COMPLETED, FAILED)
   - total_rows
   - processed_rows
   - successful_rows
   - failed_rows
   - started_at, completed_at
   - uploaded_by (User)

2. **Implement progress tracking**
   - Update processed_rows counter
   - Calculate progress percentage
   - Store in database or Redis

3. **Implement get_import_status method**
   - Accept import_id
   - Return current status
   - Include progress details

4. **Add import cancellation**
   - Allow canceling in-progress imports
   - Clean up partial imports

### CustomerImport Model Fields

| Field | Type | Description |
|-------|------|-------------|
| import_id | UUID | Unique import identifier |
| filename | CharField | Original CSV filename |
| status | CharField | PENDING, PROCESSING, COMPLETED, FAILED |
| total_rows | Integer | Total rows in CSV |
| processed_rows | Integer | Rows processed so far |
| successful_rows | Integer | Successfully imported |
| failed_rows | Integer | Failed validations |
| skipped_rows | Integer | Skipped duplicates |
| error_log | JSONField | Detailed error information |
| started_at | DateTime | Import start time |
| completed_at | DateTime | Import completion time |
| uploaded_by | FK(User) | User who initiated import |

### Import Progress Response

```json
{
  "import_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "customers_2026_01.csv",
  "status": "PROCESSING",
  "total_rows": 10000,
  "processed_rows": 4567,
  "successful_rows": 4550,
  "failed_rows": 17,
  "skipped_rows": 0,
  "progress_percent": 45.67,
  "estimated_time_remaining": "2 minutes",
  "started_at": "2026-01-15T10:30:00",
  "elapsed_time": "2 minutes 15 seconds"
}
```

### Progress Update Frequency

- Update every 100 rows
- Update at least every 5 seconds
- Final update on completion

### Expected Outcome
- Import progress tracking system

### Verification Checklist
- [ ] CustomerImport model created
- [ ] Progress tracking implemented
- [ ] get_import_status method working
- [ ] Progress percentage calculated
- [ ] Import cancellation supported

---

## Task 83: Create Customer CSV Exporter

### Overview
Create service to export customers to CSV format with customizable columns.

### Dependencies
- pandas library installed

### Instructions

1. **Create export_service.py file** in services/
2. **Define CustomerExportService class**

3. **Implement export_to_csv method**
   - Accept customer queryset
   - Accept column selection
   - Generate CSV using pandas
   - Return file or stream

4. **Implement column selection**
   - Allow selecting specific fields
   - Support nested fields (address, phone)
   - Include calculated fields (total_purchases)

5. **Add filtering support**
   - Export filtered customers
   - Apply date ranges
   - Filter by tags, status, type

6. **Implement async export for large datasets**
   - Use Celery task
   - Generate file in background
   - Notify when ready

### Export Columns (Default)

| Column | Field | Description |
|--------|-------|-------------|
| customer_code | customer_code | Unique code |
| first_name | first_name | First name |
| last_name | last_name | Last name |
| company_name | company_name | Company name |
| email | email | Email address |
| primary_phone | primary_phone | Phone number |
| customer_type | customer_type | Individual/Business |
| status | status | Active/Inactive |
| total_purchases | total_purchases | Lifetime value |
| outstanding_balance | outstanding_balance | Current balance |
| created_at | created_at | Registration date |

### Optional Export Columns

- Address fields (city, district, province)
- All phone numbers
- Tax IDs
- Financial summary
- Last purchase date
- Order count
- Tags (comma-separated)

### Export Options

```json
{
  "columns": [
    "customer_code",
    "first_name",
    "last_name",
    "email",
    "primary_phone",
    "total_purchases"
  ],
  "filters": {
    "status": "ACTIVE",
    "customer_type": "BUSINESS",
    "created_from": "2026-01-01",
    "created_to": "2026-01-31"
  },
  "format": "csv",
  "include_headers": true
}
```

### Export Flow

```
Export Request
      │
      ▼
Apply Filters
      │
      ▼
Select Columns
      │
      ▼
Query Customers (optimized)
      │
      ▼
Convert to DataFrame (pandas)
      │
      ▼
Format Data
      │
      ▼
Generate CSV
      │
      ▼
Return File or Stream
```

### Expected Outcome
- CSV export service

### Verification Checklist
- [ ] export_service.py created
- [ ] export_to_csv method implemented
- [ ] Column selection working
- [ ] Filtering supported
- [ ] Async export for large datasets
- [ ] Returns proper CSV format

---

## Summary

This document implemented CSV import and export:

### Completed Features
- ✅ CSV importer with pandas
- ✅ Batch processing (100 rows)
- ✅ Flexible column mapping
- ✅ Auto-detect column mapping
- ✅ Comprehensive validation (email, phone, districts)
- ✅ Duplicate checking
- ✅ Import progress tracking
- ✅ CustomerImport model for status
- ✅ CSV exporter with filtering
- ✅ Customizable export columns
- ✅ Async processing with Celery

### Key Achievements
1. **Bulk Operations** - Efficient import/export of large datasets
2. **Flexibility** - Column mapping for various CSV formats
3. **Data Quality** - Comprehensive validation rules
4. **Progress Tracking** - Real-time import status
5. **Performance** - Batch processing and async tasks

### Import Features
- Supports multiple CSV formats via column mapping
- Validates email, phone, district-province
- Checks for duplicates (configurable)
- Processes in batches of 100
- Tracks progress for large files
- Returns detailed error logs

### Export Features
- Customizable column selection
- Filter by status, type, dates, tags
- Includes calculated fields (totals)
- Async export for large datasets
- Standard CSV format

### Next Steps
Proceed to Document 02 for API endpoints and tests.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~780
