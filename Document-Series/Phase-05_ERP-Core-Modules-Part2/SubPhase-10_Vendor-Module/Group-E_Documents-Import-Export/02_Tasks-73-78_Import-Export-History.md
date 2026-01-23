# Tasks 73-78: Import/Export and History

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** E - Documents & Import/Export  
> **Document:** 02 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-72_Document-Model-Service.md](01_Tasks-67-72_Document-Model-Service.md)

---

## Document Overview

This document implements CSV import/export functionality and creates the VendorHistory model for tracking changes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create Vendor CSV Importer | High | 35 min |
| 74 | Implement Column Mapping | Medium | 25 min |
| 75 | Implement Import Validation | Medium | 30 min |
| 76 | Create Vendor CSV Exporter | Medium | 25 min |
| 77 | Create VendorHistory Model | Medium | 25 min |
| 78 | Run History Migrations | Low | 15 min |

---

## Task 73: Create Vendor CSV Importer

### Overview
Create service to import vendors from CSV files.

### Dependencies
- Task 72: Implement Document Expiry Alert

### Instructions

1. **Create import_service.py**
   - At `apps/vendors/services/import_service.py`

2. **Implement import_vendors_from_csv method**
   - Parameter: csv_file
   - Read CSV file
   - Parse rows
   - Map columns to fields
   - Validate data
   - Create/update vendors
   - Return import results

3. **Add pandas dependency**
   - Use pandas for CSV processing
   - Handle large files efficiently

4. **Return import summary**
   - Total rows
   - Created count
   - Updated count
   - Failed count
   - Error details

### Expected Outcome
- Bulk vendor import
- CSV processing
- Import reporting

### Verification Checklist
- [ ] Import service created
- [ ] CSV parsing implemented
- [ ] pandas integrated

---

## Task 74: Implement Column Mapping

### Overview
Map CSV columns to Vendor model fields.

### Dependencies
- Task 73: Create Vendor CSV Importer

### Instructions

1. **Define column mapping**
   - Create mapping dictionary
   - CSV column → Model field
   - Handle variations (company_name, Company Name, COMPANY_NAME)

2. **Support flexible mapping**
   - Accept custom mapping parameter
   - Detect headers automatically
   - Case-insensitive matching

### CSV Column Mapping

| CSV Column | Model Field | Required |
|------------|-------------|----------|
| company_name | company_name | Yes |
| vendor_type | vendor_type | Yes |
| business_registration | business_registration | No |
| tax_id | tax_id | No |
| email | primary_email | No |
| phone | primary_phone | No |
| address | address_line_1 | No |
| city | city | No |
| district | district | No |
| province | province | No |
| payment_terms | payment_terms_days | No |
| credit_limit | credit_limit | No |

### Expected Outcome
- Flexible column mapping
- Header detection
- Mapping customization

### Verification Checklist
- [ ] Mapping implemented
- [ ] Flexible matching added

---

## Task 75: Implement Import Validation

### Overview
Validate CSV data before import.

### Dependencies
- Task 74: Implement Column Mapping

### Instructions

1. **Implement validation rules**
   - Company name required
   - Valid vendor_type value
   - Valid email format
   - Valid phone format
   - Valid district-province mapping

2. **Check for duplicates**
   - By company_name + tax_id
   - By business_registration
   - Option to skip or update

3. **Handle validation errors**
   - Collect all errors per row
   - Skip invalid rows
   - Flag for review
   - Continue processing valid rows

4. **Return validation report**
   - Valid rows
   - Invalid rows with errors
   - Duplicate warnings
   - Skipped count

### Validation Rules

#### Required Fields
- company_name
- vendor_type

#### Format Validation
- email: Valid email format
- phone: Valid phone format
- vendor_type: Must be in VENDOR_TYPE_CHOICES

#### Business Rules
- District-province mapping valid
- Tax ID unique (if provided)
- Valid currency code

### Expected Outcome
- Comprehensive validation
- Error reporting
- Duplicate handling

### Verification Checklist
- [ ] Validation rules implemented
- [ ] Duplicate checking added
- [ ] Error reporting working

---

## Task 76: Create Vendor CSV Exporter

### Overview
Create service to export vendors to CSV.

### Dependencies
- Task 75: Implement Import Validation

### Instructions

1. **Create export_service.py**
   - At `apps/vendors/services/export_service.py`

2. **Implement export_vendors_to_csv method**
   - Parameters: filters, fields
   - Query vendors based on filters
   - Select specified fields
   - Generate CSV
   - Return file or stream

3. **Add export options**
   - Select fields to export
   - Filter by status, type, etc.
   - Sort order
   - Include related data (contacts, addresses)

### Export Columns
```
vendor_code, company_name, vendor_type, business_registration,
tax_id, primary_email, primary_phone, address_line_1, city,
district, province, payment_terms_days, credit_limit, rating,
total_orders, total_spend, status, created_at
```

### Expected Outcome
- Vendor export functionality
- Flexible field selection
- Filtered exports

### Verification Checklist
- [ ] Export service created
- [ ] CSV generation working
- [ ] Filtering supported

---

## Task 77: Create VendorHistory Model

### Overview
Create model to track vendor field changes for audit trail.

### Dependencies
- Task 76: Create Vendor CSV Exporter

### Instructions

1. **Create vendor_history.py**
   - At `apps/vendors/models/vendor_history.py`

2. **Define VendorHistory model**
   - UUIDField primary key
   - ForeignKey to Vendor (CASCADE)
   - changed_by: FK to User
   - changed_at: DateTimeField
   - field_name: CharField
   - old_value: TextField
   - new_value: TextField
   - change_type: CharField (CREATE, UPDATE, DELETE)

3. **Configure Meta**
   - Ordering: ['-changed_at']
   - Indexes on vendor and changed_at

### History Fields

| Field | Type | Purpose |
|-------|------|---------|
| vendor | FK | Related vendor |
| changed_by | FK User | Who made change |
| changed_at | DateTime | When changed |
| field_name | CharField | Field changed |
| old_value | TextField | Previous value |
| new_value | TextField | New value |
| change_type | CharField | Type of change |

### Tracked Fields
- company_name
- vendor_type
- status
- payment_terms_days
- credit_limit
- rating
- Contact fields
- Address fields

### Expected Outcome
- Change tracking model
- Audit trail support

### Verification Checklist
- [ ] History model created
- [ ] All tracking fields defined

---

## Task 78: Run History Migrations

### Overview
Generate and apply history model migrations.

### Dependencies
- Task 77: Create VendorHistory Model

### Instructions

1. **Generate and apply migration**
2. **Test history tracking**

3. **Implement auto-logging**
   - Use Django signals (post_save)
   - Track field changes
   - Create history records automatically

4. **Create get_vendor_history method**
   - Query history for vendor
   - Return chronological changes
   - Filter by field, user, date range

### History Tracking Implementation
```
Use post_save signal:
1. Get old values (from database)
2. Compare with new values
3. For each changed field:
   - Create VendorHistory record
   - Store old and new values
   - Link to user and timestamp
```

### Expected Outcome
- History table created
- Auto-logging configured
- History retrieval working

### Verification Checklist
- [ ] Migration applied
- [ ] Signal handler created
- [ ] History logging working
- [ ] Retrieval method implemented

---

## Notes for AI Agents

### Import Best Practices
- Validate before import
- Use transactions (rollback on error)
- Provide detailed error messages
- Allow partial imports
- Log all import operations

### Export Considerations
- Paginate large exports
- Stream for performance
- Include headers
- Format dates consistently
- Handle special characters

### History Tracking
- Only track significant fields
- Store values as JSON for complex fields
- Don't track password changes in plain text
- Provide history view in admin
- Allow filtering and search

### CSV Format
- UTF-8 encoding
- Comma delimiter
- Quoted strings
- First row as headers
- Date format: YYYY-MM-DD
